// Assemble image-edited artwork into consistently sized, transparent GIF cards.
const sharp = require('../next/node_modules/sharp');
const path = require('node:path');
const dir = path.join(__dirname, 'assets');
const size = 256;
async function writeGif(name, frames, delays) {
  await sharp(Buffer.concat(frames), {raw:{width:size,height:size*frames.length,channels:4,pageHeight:size}})
    .gif({loop:0,delay:delays,colours:256,effort:8,dither:0}).toFile(path.join(dir,name));
  // Optional animated WebP export preserves full alpha.
  await sharp(Buffer.concat(frames), {raw:{width:size,height:size*frames.length,channels:4,pageHeight:size}})
    .webp({loop:0,delay:delays,lossless:true,effort:5}).toFile(path.join(dir,name.replace('.gif','.webp')));
}
async function main() {
  const portrait = path.join(dir,'portrait-blink-sheet.png');
  const meta = await sharp(portrait).metadata();
  const half = meta.width / 2;
  const panels = await Promise.all([0,1].map(i => sharp(portrait)
    .extract({left:i*half,top:0,width:half,height:meta.height})
    .resize(232,232,{fit:'contain',background:'#00000000'})
    .extend({top:12,bottom:12,left:12,right:12,background:'#00000000'})
    .ensureAlpha().raw().toBuffer()));
  const closed = Buffer.from(panels[0]);
  // Only swap the generated eyelid patches: hair, face, and body never jitter.
  for (const [left,top,right,bottom] of [[94,101,121,123],[137,101,164,123]]) {
    for(let y=top;y<bottom;y++) for(let x=left;x<right;x++) {
      const p=(y*size+x)*4;
      panels[1].copy(closed,p,p,p+4);
    }
  }
  await writeGif('portfolio-blink.gif',[panels[0],closed,panels[0],closed],[3300,140,4200,140]);
  await sharp(panels[0],{raw:{width:size,height:size,channels:4}}).png().toFile('/tmp/portfolio-open.png');
  await sharp(closed,{raw:{width:size,height:size,channels:4}}).png().toFile('/tmp/portfolio-closed.png');
  const tree = await sharp(path.join(dir,'tree-cutout.png')).resize(232,232,{fit:'contain',background:'#00000000'})
    .extend({top:12,bottom:12,left:12,right:12,background:'#00000000'}).ensureAlpha().raw().toBuffer();
  const frames=[];
  const base=Buffer.from(tree), grains=[];
  const green=p=>tree[p+3]>240 && tree[p+1]>tree[p]*1.12 && tree[p+1]>tree[p+2]*1.08;
  // Lift bright crayon flecks off the foliage, then move each small grain cluster
  // independently. The underlying drawing is not warped into flowing waves.
  for(let y=20;y<190;y++) for(let x=8;x<size-8;x++) {
    const p=(y*size+x)*4;
    if(!green(p)||tree[p]<170||tree[p+2]<150) continue;
    let best=p,contrast=tree[p+1]-tree[p];
    for(let dy=-4;dy<=4;dy++) for(let dx=-4;dx<=4;dx++) {
      const q=((y+dy)*size+x+dx)*4;
      if(green(q)&&tree[q+1]-tree[q]>contrast){best=q;contrast=tree[q+1]-tree[q];}
    }
    if(best===p) continue;
    for(let c=0;c<3;c++) base[p+c]=tree[best+c];
    const seed=((Math.floor(x/3)*73856093)^(Math.floor(y/3)*19349663))>>>0;
    grains.push({x,y,p,phase:(seed%1000)/1000*Math.PI*2,frequency:1+seed%3});
  }
  for(let f=0;f<64;f++) {
    const phase=f/64*Math.PI*2;
    const frame=Buffer.from(base);
    for(const grain of grains) {
      const x=Math.round(grain.x+7*Math.sin(phase+grain.phase));
      const y=Math.round(grain.y+6*Math.sin(phase*grain.frequency+grain.phase*1.7));
      if(x<0||x>=size||y<0||y>=190) continue;
      const q=(y*size+x)*4;
      if(!green(q)) continue;
      for(let c=0;c<3;c++) frame[q+c]=tree[grain.p+c];
    }
    frames.push(frame);
  }
  await writeGif('component-tree.gif',frames,Array(64).fill(100));
  console.log('Independently moving crayon pixels:',grains.length);
  const ballPath=path.join(dir,'codex-lite.gif');
  const ballMeta=await sharp(ballPath,{animated:true}).metadata();
  const ballFrames=[];
  for(let i=0;i<ballMeta.pages;i++) ballFrames.push(await sharp(ballPath,{page:i,pages:1})
    .resize(232,232,{fit:'contain',background:'#00000000'})
    .extend({top:12,bottom:12,left:12,right:12,background:'#00000000'}).ensureAlpha().raw().toBuffer());
  await writeGif('codex-lite-slow.gif',ballFrames,Array(ballFrames.length).fill(140));
  for(const name of ['portfolio-blink.gif','component-tree.gif','codex-lite-slow.gif']) {
    const m=await sharp(path.join(dir,name),{animated:true}).metadata();
    console.log(name,{width:m.width,height:m.pageHeight,frames:m.pages,totalMs:m.delay.reduce((a,b)=>a+b,0)});
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
