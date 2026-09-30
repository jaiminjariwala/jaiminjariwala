const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const charts = require('./profile-charts.cjs');
const {createHash}=require('node:crypto');
const {spawnSync}=require('node:child_process');
const repo = 'jaiminjariwala/jaiminjariwala';
const username = 'jaiminjariwala';
const zone = 'America/New_York';
const marker = /<!-- commit-activity:start -->[\s\S]*?<!-- commit-activity:end -->/;
const clock = new Intl.DateTimeFormat('en-US', {timeZone:zone, hour:'numeric', hourCycle:'h23'});
const bucket = date => {
  const hour = Number(clock.format(new Date(date)));
  if (!Number.isInteger(hour)) throw Error('Invalid commit timestamp');
  return hour < 6 ? 3 : hour < 12 ? 0 : hour < 18 ? 1 : 2;
};
function summarize(items) {
  const seen=new Set(), counts=[0,0,0,0];
  for(const item of items) {
    if(item.repository?.private || seen.has(item.sha)) continue;
    seen.add(item.sha);
    counts[bucket(item.commit.author.date)]++;
  }
  return counts;
}
function render(counts) {
  const total=counts.reduce((a,b)=>a+b,0);
  const title=total===0 ? 'My commit activity' : counts[0]+counts[1]>=counts[2]+counts[3] ? "I'm an early 🐤" : "I'm a night owl 🦉";
  const labels=['🌞 Morning','🌇 Daytime','🌆 Evening','🌙 Night'];
  const rows=counts.map((count,i)=>{
    const fraction=total ? count/total : 0, filled=Math.round(fraction*25);
    return `${labels[i].padEnd(12)} ${String(count).padStart(5)} commits  ${'█'.repeat(filled)}${'░'.repeat(25-filled)}  ${(fraction*100).toFixed(1).padStart(5)}%`;
  });
  return `### ${title}\n\n\`\`\`text\n${rows.join('\n')}\n\`\`\``;
}
async function api(endpoint, options={}) {
  const response=await fetch(`https://api.github.com/${endpoint}`,{
    ...options, signal:AbortSignal.timeout(30000),
    headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${process.env.GH_TOKEN}`,'X-GitHub-Api-Version':'2022-11-28',...options.headers},
  });
  if(!response.ok) throw Error(`GitHub API returned ${response.status}`);
  return response.json();
}
let lastSearch=0;
async function search(query,page=1) {
  for(let attempt=0;attempt<4;attempt++) {
  // Stay below GitHub's search-specific rate limit.
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,2200-(Date.now()-lastSearch))));
  lastSearch=Date.now();
  const data=await api(`search/commits?q=${encodeURIComponent(query)}&sort=author-date&order=asc&per_page=100&page=${page}`);
  if(!data.incomplete_results) return data;
  console.warn(`GitHub search was incomplete; retry ${attempt+1}/4`);
  await new Promise(resolve=>setTimeout(resolve,3000*(attempt+1)));
  }
  throw Error('GitHub search remained incomplete after retries; keeping the previous chart');
}
async function collect(start='1970-01-01',end=new Date().toISOString().slice(0,10),unbounded=true) {
  const query=`author:${username} is:public${unbounded?'':` author-date:${start}..${end}`}`;
  const first=await search(query);
  if(first.total_count>1000) {
    if(start===end) throw Error('More than 1000 commits in one day; refusing a truncated chart');
    const mid=new Date(Math.floor((Date.parse(start)+Date.parse(end))/2/86400000)*86400000).toISOString().slice(0,10);
    const next=new Date(Date.parse(mid)+86400000).toISOString().slice(0,10);
    return [...await collect(start,mid,false),...await collect(next,end,false)];
  }
  const items=[...first.items];
  for(let page=2;page<=Math.ceil(first.total_count/100);page++) items.push(...(await search(query,page)).items);
  if(items.length!==first.total_count) throw Error('Search changed while paginating; retry instead of publishing partial data');
  return items;
}
async function main() {
  if(!process.env.GH_TOKEN) throw Error('GH_TOKEN is required');
  const counts=summarize(await collect());
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
  const assets={'profile/assets/commit-activity.svg':charts.commits(counts),'profile/assets/most-used-languages.svg':charts.languages(totals)};
  const version=path=>createHash('sha256').update(assets[path]).digest('hex').slice(0,12);
  const block=`<!-- commit-activity:start -->\n<br />\n<div align="center">\n  <img src="profile/assets/commit-activity.svg?v=${version('profile/assets/commit-activity.svg')}" width="680" alt="Commit activity by time of day in Eastern time" />\n  <br /><br />\n  <img src="profile/assets/most-used-languages.svg?v=${version('profile/assets/most-used-languages.svg')}" width="560" alt="Languages by lines of code in owned public repositories, excluding dependencies and generated files" />\n</div>\n<!-- commit-activity:end -->`;
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
    if(!marker.test(readme)) throw Error('Missing commit activity markers');
    const updated=readme.replace(marker,()=>block);
    if(updated!==readme) await api(`repos/${repo}/contents/README.md`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update public commit activity',content:Buffer.from(updated).toString('base64'),sha:file.sha,branch:'main'})});
  } else {
    for(const [path,content] of Object.entries(assets)) await fs.writeFile(path,content);
    const readme=await fs.readFile('README.md','utf8');
    if(!marker.test(readme)) throw Error('Missing commit activity markers');
    await fs.writeFile('README.md',readme.replace(marker,()=>block));
  }
  console.log(JSON.stringify({total:counts.reduce((a,b)=>a+b,0),morning:counts[0],daytime:counts[1],evening:counts[2],night:counts[3],timeZone:zone}));
}
if(process.argv.includes('--test')) {
  assert.deepEqual(['2026-09-29T09:59:00Z','2026-09-29T10:00:00Z','2026-09-29T16:00:00Z','2026-09-29T22:00:00Z'].map(bucket),[3,0,1,2]);
  assert.equal(bucket('2026-01-29T11:00:00Z'),0);
  const item={sha:'a',repository:{private:false},commit:{author:{date:'2026-09-29T16:00:00Z'}}};
  assert.deepEqual(summarize([item,item,{...item,sha:'b',repository:{private:true}}]),[0,1,0,0]);
  assert.ok(render([1,2,3,4]).includes('night owl'));
  assert.ok(!render([0,0,0,0]).includes('NaN'));
  assert.ok(charts.commits([1,2,3,4]).includes('width="800"'));
  assert.ok(!charts.languages({}).includes('NaN'));
  assert.ok(charts.languages({'A&B':10}).includes('A&amp;B 100.00%'));
  console.log('Commit activity tests passed');
} else main().catch(e=>{console.error(e.message);process.exitCode=1;});
