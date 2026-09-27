// Wrap the generated crayon map around a sphere and rotate a full turn.
const path = require('node:path');
const sharp = require('../next/node_modules/sharp');
async function main() {
  const {data,info} = await sharp(path.join(__dirname,'assets/earth-texture.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const size=256, count=80, radius=115;
  const frames=[];
  for(let f=0;f<count;f++) {
    const frame=Buffer.alloc(size*size*4);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const nx=(x+0.5-size/2)/radius, ny=-(y+0.5-size/2)/radius;
      const distance=Math.hypot(nx,ny);
      const edge=1+0.004*Math.sin(Math.atan2(ny,nx)*71);
      if(distance>edge) continue;
      const dst=(y*size+x)*4;
      frame[dst+3]=255;
      if(distance>0.974) {frame[dst]=7;frame[dst+1]=9;frame[dst+2]=8;continue;}
      const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
      const longitude=Math.atan2(nx,nz)+f/count*Math.PI*2-0.45;
      const latitude=Math.asin(Math.max(-1,Math.min(1,ny)));
      const u=((longitude/(2*Math.PI)+0.5)%1+1)%1;
      const v=0.5-latitude/Math.PI;
      const sx=Math.min(info.width-1,Math.floor(u*info.width));
      const sy=Math.min(info.height-1,Math.floor(v*info.height));
      const src=(sy*info.width+sx)*4;
      const light=0.72+0.28*Math.max(0,-nx*0.3+ny*0.25+nz*0.92);
      for(let c=0;c<3;c++) frame[dst+c]=Math.round(data[src+c]*light);
    }
    frames.push(frame);
  }
  await sharp(Buffer.concat(frames),{raw:{width:size,height:size*count,channels:4,pageHeight:size}})
    .gif({loop:0,delay:80,effort:7,colours:256}).toFile(path.join(__dirname,'assets/earth-rotating.gif'));
  await sharp(frames[0],{raw:{width:size,height:size,channels:4}}).png().toFile('/tmp/jaimin-earth-preview.png');
  console.log('Rendered 80 frames, seamless 6.4-second rotation.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
