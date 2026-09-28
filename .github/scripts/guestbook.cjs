const assert = require('node:assert/strict');
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
});

// Treat visitor messages as untrusted text, never commands or raw Markdown.
function escapeMessage(value) {
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 240)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;').replace(/`/g, '&#96;')
    .replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')
    .replace(/\*/g, '&#42;').replace(/_/g, '&#95;')
    .replace(/\\/g, '&#92;');
}
function renderEntries(comments) {
  const entries = comments.filter(c => c.user?.type === 'User' && /^[a-zA-Z0-9-]+$/.test(c.user.login) && c.body?.trim()).slice(-5).reverse();
  const header = ['| Name | Date | Message |', '|---|---|---|'];
  if (!entries.length) return [...header, '| — | — | Be the first to sign the guestbook! |'].join('\n');
  return [...header, ...entries.map(c =>
    `| <a href="https://github.com/${c.user.login}"><img width="24" src="https://github.com/${c.user.login}.png?size=24" alt="${c.user.login}" /> ${c.user.login}</a> | ${dateFormatter.format(new Date(c.created_at))} | ${escapeMessage(c.body)} |`
  )].join('\n');
}
async function main() {
  const repo = process.env.GH_REPOSITORY;
  if (repo !== 'jaiminjariwala/jaiminjariwala') throw new Error('Unexpected repository');
  const api = async (endpoint, options = {}) => {
    const response = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`, {
      ...options,
      headers: {Accept:'application/vnd.github+json', Authorization:`Bearer ${process.env.GH_TOKEN}`, 'X-GitHub-Api-Version':'2022-11-28', 'Content-Type':'application/json'},
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status} for ${endpoint}`);
    return response.json();
  };
  const comments = [];
  for (let page=1; ; page++) {
    const batch = await api(`issues/1/comments?per_page=100&page=${page}`);
    comments.push(...batch);
    if (batch.length < 100) break;
  }
  const file = await api('contents/README.md?ref=main');
  const readme = Buffer.from(file.content,'base64').toString('utf8');
  const marker = /<!-- guestbook:start -->[\s\S]*?<!-- guestbook:end -->/;
  if (!marker.test(readme)) throw new Error('Missing guestbook markers');
  const updated = readme.replace(marker, () => `<!-- guestbook:start -->\n${renderEntries(comments)}\n<!-- guestbook:end -->`);
  if (updated === readme) { console.log('Guestbook is already up to date.'); return; }
  await api('contents/README.md', {method:'PUT', body:JSON.stringify({message:'Update profile guestbook', content:Buffer.from(updated).toString('base64'), sha:file.sha, branch:'main'})});
  console.log('Updated the profile guestbook.');
}
if (process.argv.includes('--test')) {
  assert.ok(renderEntries([]).includes('Be the first to sign the guestbook!'));
  const row = renderEntries([{user:{login:'visitor',type:'User'},body:'Hello | <img src=x>\n![x](bad) $HOME `code`',created_at:'2026-09-27T12:00:00Z'}]);
  assert.ok(row.includes('Hello &#124; &lt;img src=x&gt;'));
  assert.ok(!row.includes('![x]'));
  assert.ok(row.includes('9/27/2026, 8:00:00 AM'));
  assert.equal(dateFormatter.format(new Date('2026-09-28T14:39:10Z')), '9/28/2026, 10:39:10 AM');
  assert.equal(dateFormatter.format(new Date('2026-01-28T14:39:10Z')), '1/28/2026, 9:39:10 AM');
  assert.equal(renderEntries([{user:{login:'bot',type:'Bot'},body:'test'}]),renderEntries([]));
  console.log('Guestbook rendering tests passed.');
} else {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
