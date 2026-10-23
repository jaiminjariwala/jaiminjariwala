// One diagonal material ridge. The same field displaces every rendered
// pixel, including ink, lettering and the scalloped silhouette.
export function buckleProfile(t){
  const q=(t-.56)/.085;
  const ridge=Math.exp(-q*q);
  // Reference frames bottom out near 233–239 on white paper (~8% shade),
  // with a long soft approach and a short highlight side, not a dark stripe.
  const side=q+.3,softness=side<0?1.05:.55;
  const shade=Math.min(1,1-.08*Math.exp(-Math.pow(side/softness,2))+.012*Math.exp(-Math.pow((q-.7)/.4,2)));
  return {r:.5-.35*ridge,g:.5+.12*ridge,shade};
}

export function buckleMap(kind){
  const stops=Array.from({length:101},(_,i)=>{
    const p=buckleProfile(i/100),rgb=kind==='displacement'?[p.r,p.g,.5]:[p.shade,p.shade,p.shade];
    return `<stop offset="${i}%" stop-color="rgb(${rgb.map(n=>(n*255).toFixed(3)).join(',')})"/>`;
  }).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="-15 -15 130 130"><defs><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="35">${stops}</linearGradient></defs><path fill="url(#b)" d="M-15-15h130v130H-15z"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function stepBuckle(position,velocity,target,seconds){
  const dt=Math.max(0,Math.min(seconds,.05)),omega=26;
  const offset=position-target,momentum=velocity+omega*offset,decay=Math.exp(-omega*dt);
  return {position:target+(offset+momentum*dt)*decay,velocity:(velocity-omega*momentum*dt)*decay};
}

export function buckleAppearance(amount){
  const bend=Math.max(0,Math.min(1,amount));
  return {scale:.045*bend,shade:bend,blur:.004+.008*(1-bend),dy:.003+.009*(1-bend),opacity:.09+.08*(1-bend)};
}
