// Original vector illustrations rendered to GIF; reuse the app's own dock frames.
// Run: node profile/generate-assets.cjs /path/to/codex-lite/build/dock-icons/beach-ball
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('../next/node_modules/sharp');
const out = path.join(__dirname, 'assets');
const size = 192;
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">${body}</svg>`;
async function gif(name, frames, delay) {
  const raw = await Promise.all(frames.map(frame => sharp(frame).resize(size, size).ensureAlpha().raw().toBuffer()));
  await sharp(Buffer.concat(raw), {raw: {width:size, height:size*frames.length, channels:4, pageHeight:size}})
    .gif({loop:0, delay, effort:7}).toFile(path.join(out,name));
}
async function main() {
  await fs.mkdir(out, {recursive:true});
  const globe = [], components = [];
  for (let i=0; i<36; i++) {
    const angle = i/36*Math.PI*2;
    let longitude = '';
    for (let n=0; n<6; n++) {
      const x = Math.sin(angle+n*Math.PI/3)*66;
      longitude += `<ellipse cx="96" cy="90" rx="${Math.max(1,Math.abs(x))}" ry="66" fill="none" stroke="#83e1db" stroke-width="1.5"/>`;
    }
    globe.push(Buffer.from(wrap(`<ellipse cx="96" cy="170" rx="54" ry="6" fill="#243355" opacity=".18"/>
      <circle cx="96" cy="90" r="68" fill="#305db6" stroke="#172954" stroke-width="4"/>
      ${longitude}<ellipse cx="96" cy="90" rx="66" ry="22" fill="none" stroke="#83e1db" stroke-width="2"/>
      <ellipse cx="96" cy="90" rx="66" ry="47" fill="none" stroke="#83e1db" stroke-width="2"/>
      <path d="M30 90H162M96 24V156" stroke="#83e1db" stroke-width="2"/>
      <path d="M49 38Q28 57 26 81" fill="none" stroke="#fff" opacity=".7" stroke-width="3"/>`)));
    const lift = Math.sin(angle)*5;
    components.push(Buffer.from(wrap(`<rect x="17" y="31" width="162" height="135" rx="8" fill="#243355" opacity=".2"/>
      <rect x="11" y="25" width="162" height="135" rx="8" fill="#fff8e8" stroke="#243355" stroke-width="3"/>
      <path d="M12 51H172" stroke="#243355" stroke-width="3"/>
      <g fill="#ff8098"><circle cx="24" cy="38" r="4"/><circle cx="38" cy="38" r="4"/><circle cx="52" cy="38" r="4"/></g>
      <rect x="26" y="68" width="38" height="72" rx="4" fill="#a7dbd4"/>
      <path d="M34 80H56M34 91H53M34 102H56" stroke="#377e8b" stroke-width="3"/>
      <g transform="translate(0 ${lift})"><rect x="77" y="68" width="80" height="31" rx="5" fill="#ffc66d" stroke="#b67f39" stroke-width="2"/>
      <path d="m104 78-7 6 7 6m19-12 7 6-7 6m-7-14-5 16" stroke="#79572f" stroke-width="2" fill="none"/></g>
      <g transform="translate(0 ${-lift})"><rect x="77" y="111" width="35" height="29" rx="5" fill="#a5b5f0"/><rect x="120" y="111" width="37" height="29" rx="5" fill="#f2a0b2"/></g>
      <path d="m151 143 1-23 17 15-10 1-4 9Z" fill="#243355" stroke="#fff8e8" stroke-width="2"/>`)));
  }
  await gif('globe.gif',globe,90);
  await gif('components.gif',components,75);
  const source = process.argv[2];
  if (!source) throw new Error('Pass the Codex Lite beach-ball frame directory.');
  const frames = (await fs.readdir(source)).filter(f=>/^\d+\.png$/.test(f)).sort();
  if (frames.length !== 48) throw new Error('Expected 48 existing app animation frames.');
  await gif('codex-lite.gif',await Promise.all(frames.map(f=>fs.readFile(path.join(source,f)))),65);
  for (const name of ['globe.gif','components.gif','codex-lite.gif']) {
    const info = await sharp(path.join(out,name),{animated:true}).metadata();
    console.log(name, {width:info.width, pageHeight:info.pageHeight, frames:info.pages});
  }
}
main().catch(error=>{ console.error(error); process.exitCode=1; });
