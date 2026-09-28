const assert = require('node:assert/strict');
function entryDetails(body) {
  const match = body.match(/^Timezone:[ \t]*([A-Za-z_+-]+(?:\/[A-Za-z0-9_+-]+)+)[ \t]*$/im);
  if (match) {
    try {
      const timeZone = new Intl.DateTimeFormat('en-US', {timeZone: match[1]}).resolvedOptions().timeZone;
      return {timeZone, supplied: true, message: body.replace(match[0], '').trim()};
    } catch { /* Invalid declarations stay visible; use the clearly labelled default. */ }
  }
  return {timeZone: 'America/New_York', supplied: false, message: body};
}
function formatDate(createdAt, details) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: details.timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  });
  const date = new Date(createdAt);
  const offset = new Intl.DateTimeFormat('en-US', {timeZone: details.timeZone, timeZoneName: 'shortOffset'})
    .formatToParts(date).find(part => part.type === 'timeZoneName').value;
  // GitHub strips CSS styles, so nonbreaking spaces keep AM/PM with the time.
  return `${formatter.format(date).replace(/\s/g, '&nbsp;')}<br /><sub>${details.timeZone} (${offset}${details.supplied ? '' : ', default'})</sub>`;
}

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
  return [...header, ...entries.map(c => {
    const details = entryDetails(c.body);
    return `| <a href="https://github.com/${c.user.login}"><img width="24" src="https://github.com/${c.user.login}.png?size=24" alt="${c.user.login}" /> ${c.user.login}</a> | ${formatDate(c.created_at, details)} | ${escapeMessage(details.message)} |`;
  })].join('\n');
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
  assert.ok(row.includes('9/27/2026,&nbsp;8:00:00&nbsp;AM'));
  const timestamp = '2026-09-28T14:39:10Z';
  assert.ok(formatDate(timestamp, entryDetails('Hello')).includes('10:39:10&nbsp;AM'));
  assert.ok(formatDate(timestamp, entryDetails('Hello')).includes('GMT-4, default'));
  const london = entryDetails('Hello!\nTimezone: Europe/London');
  assert.equal(london.message, 'Hello!');
  assert.ok(formatDate(timestamp, london).includes('3:39:10&nbsp;PM'));
  assert.ok(formatDate(timestamp, london).includes('Europe/London (GMT+1)'));
  const pacific = entryDetails('Hi\nTimezone: America/Los_Angeles');
  assert.ok(formatDate(timestamp, pacific).includes('7:39:10&nbsp;AM'));
  assert.ok(formatDate('2026-01-28T14:39:10Z', pacific).includes('GMT-8'));
  assert.equal(entryDetails('Timezone: Fake/Zone').supplied, false);
  assert.equal(entryDetails('Timezone: <script>').message, 'Timezone: <script>');
  assert.equal(renderEntries([{user:{login:'bot',type:'Bot'},body:'test'}]),renderEntries([]));
  console.log('Guestbook rendering tests passed.');
} else {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
