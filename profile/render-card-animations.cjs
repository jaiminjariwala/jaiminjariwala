// Assemble image-edited artwork into consistently sized, transparent GIF cards.
const sharp = require('../next/node_modules/sharp');
const path = require('node:path');
const dir = path.join(__dirname, 'assets');
const size = 256;
async function writeGif(name, frames, delays) {
  await sharp(Buffer.concat(frames), {raw:{width:size,height:size*frames.length,channels:4,pageHeight:size}})
    .gif({loop:0,delay:delays,colours:256,effort:8,dither:0}).toFile(path.join(dir,name));
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
  for(let f=0;f<64;f++) {
    const phase=f/64*Math.PI*2;
    const frame=Buffer.from(tree);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const p=(y*size+x)*4;
      // Move the crayon texture inside green areas; silhouette and trunk stay fixed.
      if(tree[p+3]<240 || tree[p+1]<tree[p]*1.12 || tree[p+1]<tree[p+2]*1.08) continue;
      const sx=x+1.6*Math.sin(phase)*Math.sin(y/37);
      const sy=y+0.8*Math.cos(phase)*Math.sin(x/43);
      const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
      if(ix<0||iy<0||ix>=size-1||iy>=size-1) continue;
      const indices=[(iy*size+ix)*4,(iy*size+ix+1)*4,((iy+1)*size+ix)*4,((iy+1)*size+ix+1)*4];
      if(indices.some(j=>tree[j+3]<240)) continue;
      const weights=[(1-fx)*(1-fy),fx*(1-fy),(1-fx)*fy,fx*fy];
      for(let c=0;c<3;c++) frame[p+c]=Math.round(indices.reduce((sum,j,n)=>sum+tree[j+c]*weights[n],0));
    }
    frames.push(frame);
  }
  await writeGif('component-tree.gif',frames,Array(64).fill(100));
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
