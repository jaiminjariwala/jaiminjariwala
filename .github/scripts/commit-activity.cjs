const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const charts = require('./profile-charts.cjs');
const {createHash}=require('node:crypto');
const {spawnSync}=require('node:child_process');
const repo = 'jaiminjariwala/jaiminjariwala';
const username = 'jaiminjariwala';
// Keep the existing markers so scheduled writes preserve the guestbook.
const marker = /<!-- commit-activity:start -->[\s\S]*?<!-- commit-activity:end -->/;
function readmeBlock(assets) {
  const images=Object.entries(assets).map(([path,content])=>{
    const version=createHash('sha256').update(content).digest('hex').slice(0,12);
    const mode=path.endsWith('-dark.svg')?'dark':'light';
    const src=`${path}?v=${version}#gh-${mode}-mode-only`;
    return `  <a href="${src}"><img src="${src}" width="560" alt="Languages by lines of code in owned public repositories, excluding dependencies and generated files" /></a>`;
  });
  return `<!-- commit-activity:start -->\n<br />\n<div align="center">\n${images.join('\n')}\n</div>\n<!-- commit-activity:end -->`;
}
async function api(endpoint, options={}) {
  for(let attempt=0;attempt<4;attempt++) {
  let response;
  try {response=await fetch(`https://api.github.com/${endpoint}`,{
    ...options, signal:AbortSignal.timeout(30000),
    headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${process.env.GH_TOKEN}`,'X-GitHub-Api-Version':'2022-11-28',...options.headers},
  });} catch(error) {
    // Retry read requests only: writes may already have succeeded remotely.
    if(options.method || attempt===3)throw error;
    await new Promise(resolve=>setTimeout(resolve,2000*(attempt+1)));
    continue;
  }
  if(response.status>=500&&!options.method&&attempt<2) {
    await response.text();
    await new Promise(resolve=>setTimeout(resolve,2000*(attempt+1)));
    continue;
  }
  if(!response.ok) {
    const body=await response.text();
    let message;
    try { message=JSON.parse(body).message; } catch { message='No API error message'; }
    const remaining=response.headers.get('x-ratelimit-remaining');
    const retryAfter=response.headers.get('retry-after');
    const limited=response.status===429 || (response.status===403 && (remaining==='0' || retryAfter || /rate limit|abuse/i.test(message)));
    if(limited && !options.method && attempt<3) {
      const reset=Number(response.headers.get('x-ratelimit-reset'))*1000;
      const delay=retryAfter ? Number(retryAfter)*1000 : remaining==='0' && reset ? Math.max(1000,reset-Date.now()+1000) : 60000*(attempt+1);
      // Do not silently wait past the workflow's overall time budget.
      if(delay<=180000) {
        console.warn(`GitHub ${endpoint.split('?')[0]} rate limited; retrying in ${Math.ceil(delay/1000)}s`);
        await new Promise(resolve=>setTimeout(resolve,delay));
        continue;
      }
    }
    throw Error(`GitHub API returned ${response.status} for ${endpoint.split('?')[0]}: ${message} (remaining=${remaining ?? 'unknown'})`);
  }
  return response.json();
  }
}
async function main() {
  if(!process.env.GH_TOKEN) throw Error('GH_TOKEN is required');
  const repositories=[];
  for(let page=1;;page++) {
    const repos=await api(`users/${username}/repos?type=owner&per_page=100&page=${page}`);
    repositories.push(...repos.filter(r=>!r.fork&&!r.private&&r.size>0));
    if(repos.length<100)break;
  }
  const counted=spawnSync('python3',['.github/scripts/language-lines.py'],{input:JSON.stringify(repositories),encoding:'utf8',maxBuffer:10*1024*1024,timeout:720000});
  if(counted.stderr)process.stderr.write(counted.stderr);
  if(counted.status!==0)throw Error('Language line counting failed; keeping existing charts');
  const {totals}=JSON.parse(counted.stdout);
  console.log('Source lines:',JSON.stringify(totals));
  const assets={'profile/assets/most-used-languages.svg':charts.languages(totals),'profile/assets/most-used-languages-dark.svg':charts.languages(totals,'dark')};
  const block=readmeBlock(assets);
  if(process.argv.includes('--publish')) {
    for(const [path,content] of Object.entries(assets)) {
      let previous;
      try {previous=await api(`repos/${repo}/contents/${path}?ref=main`);} catch(e) {if(!e.message.includes('404'))throw e;}
      const encoded=Buffer.from(content).toString('base64');
      if(previous?.content.replace(/\s/g,'')===encoded)continue;
      await api(`repos/${repo}/contents/${path}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update profile statistics chart',content:encoded,sha:previous?.sha,branch:'main'})});
    }
    // Read the newest README after fetching stats, preserving guestbook changes.
    const file=await api(`repos/${repo}/contents/README.md?ref=main`);
    const readme=Buffer.from(file.content,'base64').toString('utf8');
    if(!marker.test(readme)) throw Error('Missing profile statistics markers');
    const updated=readme.replace(marker,()=>block);
    if(updated!==readme) await api(`repos/${repo}/contents/README.md`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update public language statistics',content:Buffer.from(updated).toString('base64'),sha:file.sha,branch:'main'})});
  } else {
    for(const [path,content] of Object.entries(assets)) await fs.writeFile(path,content);
    const readme=await fs.readFile('README.md','utf8');
    if(!marker.test(readme)) throw Error('Missing profile statistics markers');
    await fs.writeFile('README.md',readme.replace(marker,()=>block));
  }
}
module.exports={readmeBlock};
if(require.main===module&&process.argv.includes('--test')) {
  assert.ok(!charts.languages({}).includes('NaN'));
  assert.ok(charts.languages({'A&B':10}).includes('A&amp;B 100.00%'));
  assert.ok(charts.languages({Go:10}).includes('fill:#24292f'));
  assert.ok(charts.languages({Go:10},'dark').includes('fill:#e6edf3'));
  for(const theme of ['light','dark'])assert.ok(!charts.languages({Go:10},theme).includes('prefers-color-scheme'));
  const block=readmeBlock({'profile/assets/most-used-languages.svg':'light','profile/assets/most-used-languages-dark.svg':'dark'});
  assert.ok(block.includes('#gh-light-mode-only'));assert.ok(block.includes('#gh-dark-mode-only'));
  assert.ok(!block.includes('commit-activity.svg'));
  console.log('Profile language chart tests passed');
} else if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
