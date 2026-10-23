// Independently implemented from measured reference DOM/render parameters.
// A shallow saddle bends the material vertically; there is no X distortion.
export function buckleField(x,y){
  const limit=n=>Math.max(-1,Math.min(1,n));
  return {r:.5,g:.5+.125*limit((.5-x)*2.6)*limit((.5-y)*2.6),b:.5};
}

export function buckleMap(kind){
  let content;
  if(kind==='displacement'){
    const cells=[];
    for(let y=0;y<24;y++)for(let x=0;x<24;x++){
      const {r,g,b}=buckleField((x+.5)/24,(y+.5)/24);
      cells.push(`<rect x="${x}" y="${y}" width="1.01" height="1.01" fill="rgb(${r*100}%,${(g*100).toFixed(3)}%,${b*100}%)"/>`);
    }
    content=`<defs><filter id="smooth" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter></defs><rect width="24" height="24" fill="rgb(50%,50%,50%)"/><g filter="url(#smooth)">${cells.join('')}</g>`;
  }else{
    // Same 111-degree light direction and narrow 43–59% crease region.
    content='<defs><linearGradient id="light" gradientUnits="userSpaceOnUse" x1="-2.47" y1="6.46" x2="26.47" y2="17.54"><stop offset="0" stop-color="white"/><stop offset=".43" stop-color="white"/><stop offset=".50" stop-color="rgb(93%,93%,93%)"/><stop offset=".52" stop-color="white"/><stop offset=".59" stop-color="white"/><stop offset="1" stop-color="white"/></linearGradient></defs><path d="M0 0h24v24H0z" fill="url(#light)"/>';
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${content}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function stepBuckle(position,velocity,target,seconds){
  const dt=Math.max(0,Math.min(seconds,.05)),omega=32;
  const offset=position-target,momentum=velocity+omega*offset,decay=Math.exp(-omega*dt);
  return {position:target+(offset+momentum*dt)*decay,velocity:(velocity-omega*momentum*dt)*decay};
}

export function buckleAppearance(amount,size=160){
  const bend=Math.max(0,Math.min(1,amount));
  const distance=.5+1.5*(1-bend);
  return {scale:.12*size*bend,shade:bend,blur:1.05+2*(1-bend),dx:distance*.67,dy:distance,opacity:.21+.025*(1-bend),pose:`perspective(420px) rotateX(${4.375*bend}deg) rotateY(${-6.125*bend}deg) skew(0deg,${.4*bend}deg)`};
}
