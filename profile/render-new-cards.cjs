// Assemble generated, registered artwork layers into small looping profile cards.
const sharp = require('../next/node_modules/sharp');
const path = require('node:path');
const dir = path.join(__dirname, 'assets');
const size = 256;
async function gif(name, frames, delay) {
  await sharp(Buffer.concat(frames), {raw:{width:size,height:size*frames.length,channels:4,pageHeight:size}})
    .gif({loop:0,delay,colours:256,effort:8,dither:0}).toFile(path.join(dir,name));
}
async function main() {
  const source=path.join(dir,'bag-layers.png'), m=await sharp(source).metadata(), half=m.width/2;
  const layers=await Promise.all([0,1,2,3].map(async i=>{
    const panel=await sharp(source).extract({left:(i%2)*half+3,top:Math.floor(i/2)*half+3,width:half-6,height:half-6}).png().toBuffer();
    const png=await sharp(panel).trim({threshold:20}).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  }));
  const image=(index,x,y,w,h)=>`<image href="${layers[index]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
  const frames=[];
  for(let f=0;f<48;f++){
    const t=(1-Math.cos(f/48*Math.PI*2))/2;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
      ${image(0,20,22,210,222)}
      <g transform="translate(${-7*t},${-16*t}) rotate(${-18*t} 130 178)">${image(2,100,101,59,72)}</g>
      <g transform="translate(${5*t},${-17*t}) rotate(${15*t} 157 183)">${image(1,123,93,104,99)}</g>
      ${image(3,119,135,125,109)}
      </svg>`;
    const frame=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
    frames.push(frame);
    if(f===0||f===24) await sharp(frame,{raw:{width:size,height:size,channels:4}}).png().toFile(`/tmp/library-bag-${f}.png`);
  }
  await gif('library-bag.gif',frames,Array(48).fill(85));
  const portrait=path.join(dir,'portrait-fast-sheet.png'), p=await sharp(portrait).metadata(), cell=p.width/2;
  const panels=await Promise.all([0,1].map(i=>sharp(portrait).extract({left:i*cell,top:0,width:cell,height:cell}).resize(size,size).ensureAlpha().raw().toBuffer()));
  // Use only eyelid patches to keep the rest of the portrait completely stationary.
  const closed=Buffer.from(panels[0]);
  for(const [left,top,right,bottom] of [[89,108,114,139],[133,105,160,135]])
    for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
      const o=(y*size+x)*4;panels[1].copy(closed,o,o,o+4);
    }
  await gif('portrait-fast.gif',[panels[0],closed,panels[0],closed],[1700,110,2100,110]);
  await sharp(closed,{raw:{width:size,height:size,channels:4}}).png().toFile('/tmp/portrait-fast-closed.png');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
