// Semicircular cutouts point into the paper, unlike the outward stamp lobes.
export function projectFramePath(width,height,period=16){
  const nx=Math.max(2,Math.round(width/period)),ny=Math.max(2,Math.round(height/period));
  const sx=width/nx,sy=height/ny,r=Math.min(sx,sy)*.49;
  let path=`M${r},0`;
  for(let i=1;i<nx;i++)path+=` L${i*sx-r},0 A${r},${r} 0 0 0 ${i*sx+r},0`;
  path+=` L${width-r},0 A${r},${r} 0 0 0 ${width},${r}`;
  for(let i=1;i<ny;i++)path+=` L${width},${i*sy-r} A${r},${r} 0 0 0 ${width},${i*sy+r}`;
  path+=` L${width},${height-r} A${r},${r} 0 0 0 ${width-r},${height}`;
  for(let i=nx-1;i>0;i--)path+=` L${i*sx+r},${height} A${r},${r} 0 0 0 ${i*sx-r},${height}`;
  path+=` L${r},${height} A${r},${r} 0 0 0 0,${height-r}`;
  for(let i=ny-1;i>0;i--)path+=` L0,${i*sy+r} A${r},${r} 0 0 0 0,${i*sy-r}`;
  return path+` L0,${r} A${r},${r} 0 0 0 ${r},0 Z`;
}

export function videoPosition(time,duration){
  return Number.isFinite(duration)&&duration>0&&Number.isFinite(time)?Math.max(0,Math.min(time,duration)):0;
}

export function videoTime(seconds){
  const value=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;
  return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
}
