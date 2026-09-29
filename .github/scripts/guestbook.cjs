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
  const generic = new Intl.DateTimeFormat('en-US', {timeZone: details.timeZone, timeZoneName: 'shortGeneric'})
    .formatToParts(date).find(part => part.type === 'timeZoneName').value;
  const zone = /^[A-Z]{2,6}$/.test(generic) ? generic : new Intl.DateTimeFormat('en-GB', {
    timeZone: details.timeZone, timeZoneName: 'short',
  }).formatToParts(date).find(part => part.type === 'timeZoneName').value;
  // GitHub strips CSS styles, so nonbreaking spaces keep AM/PM with the time.
  return `${formatter.format(date)} ${zone}`.replace(/\s/g, '&nbsp;');
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
function messagePreview(value) {
  const lines = String(value).trim().split(/\r?\n/);
  const firstLine = lines[0].replace(/\s+/g, ' ').trim();
  const characters = Array.from(firstLine);
  const hasMore = characters.length > 48 || lines.slice(1).some(line => line.trim());
  const preview = characters.slice(0, hasMore ? 45 : 48).join('').trimEnd() + (hasMore ? '...' : '');
  return escapeMessage(preview).replace(/ /g, '&nbsp;');
}
function renderEntries(comments) {
  const entries = comments.filter(c => c.user?.type === 'User' && /^[a-zA-Z0-9-]+$/.test(c.user.login) && c.body?.trim()).slice(-5).reverse();
  const header = ['<table align="center">', '<thead><tr><th>Name</th><th>Date</th><th>Message</th></tr></thead>', '<tbody>'];
  if (!entries.length) return [...header, '<tr><td>—</td><td>—</td><td>Be the first to sign the guestbook!</td></tr>', '</tbody></table>'].join('\n');
  return [...header, ...entries.map(c => {
    const details = entryDetails(c.body);
    return `<tr><td><a href="https://github.com/${c.user.login}"><img width="24" src="https://github.com/${c.user.login}.png?size=24" alt="${c.user.login}" />&#8288;&nbsp;${c.user.login.replace(/-/g, '&#8209;')}</a></td><td>${formatDate(c.created_at, details)}</td><td>${messagePreview(details.message)}</td></tr>`;
  }), '</tbody></table>'].join('\n');
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
  assert.ok(row.includes('Hello&nbsp;&#124;&nbsp;&lt;img&nbsp;src=x&gt;...'));
  assert.ok(row.includes('/>&#8288;&nbsp;visitor'));
  assert.equal(messagePreview('Hello\nSecond line'), 'Hello...');
  assert.equal(messagePreview('Hello there'), 'Hello&nbsp;there');
  assert.equal(messagePreview('x'.repeat(100)), 'x'.repeat(45) + '...');
  assert.equal(messagePreview('Hello\r\n\r\n'), 'Hello');
  assert.ok(!row.includes('![x]'));
  assert.ok(row.includes('9/27/2026,&nbsp;8:00:00&nbsp;AM'));
  const timestamp = '2026-09-28T14:39:10Z';
  assert.ok(formatDate(timestamp, entryDetails('Hello')).includes('10:39:10&nbsp;AM'));
  assert.equal(formatDate(timestamp, entryDetails('Hello')), '9/28/2026,&nbsp;10:39:10&nbsp;AM&nbsp;ET');
  const london = entryDetails('Hello!\nTimezone: Europe/London');
  assert.equal(london.message, 'Hello!');
  assert.ok(formatDate(timestamp, london).includes('3:39:10&nbsp;PM'));
  assert.ok(formatDate(timestamp, london).endsWith('&nbsp;BST'));
  const pacific = entryDetails('Hi\nTimezone: America/Los_Angeles');
  assert.ok(formatDate(timestamp, pacific).includes('7:39:10&nbsp;AM'));
  assert.ok(formatDate('2026-01-28T14:39:10Z', pacific).endsWith('&nbsp;PT'));
  assert.ok(!formatDate(timestamp, london).includes('<br'));
  assert.equal(entryDetails('Timezone: Fake/Zone').supplied, false);
  assert.equal(entryDetails('Timezone: <script>').message, 'Timezone: <script>');
  assert.equal(renderEntries([{user:{login:'bot',type:'Bot'},body:'test'}]),renderEntries([]));
  console.log('Guestbook rendering tests passed.');
} else {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
