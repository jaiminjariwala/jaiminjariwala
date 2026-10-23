export const STAMP_ARRIVAL_DURATION=760;

export function stampArrivalPose(elapsed,width){
  const progress=Math.max(0,Math.min(1,elapsed/STAMP_ARRIVAL_DURATION));
  const ease=1-Math.pow(1-progress,3);
  const spread=progress*progress*(3-2*progress);
  return {progress,flat:width*spread,offset:progress===1?0:-width*.65*(1-ease),radius:Math.max(.6,width*.075*(1-spread)),done:progress===1};
}

// A real material-coordinate roll: flat paper is laid down from left to
// right, while the remaining image wraps around a shaded vertical cylinder.
export function drawStampArrival(ctx,image,width,height,elapsed,rotation=0){
  const pose=stampArrivalPose(elapsed,width);
  ctx.save();
  ctx.translate(width/2+pose.offset,height/2);
  ctx.rotate(rotation*pose.progress);
  ctx.translate(-width/2,-height/2);
  if(pose.flat>.1)ctx.drawImage(image,0,0,image.width*pose.flat/width,image.height,0,0,pose.flat,height);
  const strips=[];
  const point=u=>{
    const angle=(u-pose.flat)/pose.radius;
    return {x:pose.flat+Math.sin(angle)*pose.radius,z:pose.radius*(1-Math.cos(angle)),angle};
  };
  for(let u=pose.flat;u<width;u+=1.2){
    const end=Math.min(width,u+1.3),a=point(u),b=point(end);
    strips.push({u,end,a,b,z:(a.z+b.z)/2});
  }
  strips.sort((a,b)=>a.z-b.z);
  for(const {u,end,a,b} of strips){
    const front=Math.cos((a.angle+b.angle)/2)>=0;
    const x=Math.min(a.x,b.x),span=Math.max(.15,Math.abs(b.x-a.x));
    ctx.filter=front?`brightness(${.78+.22*Math.abs(Math.cos(a.angle))})`:'brightness(0) invert(1)';
    ctx.drawImage(image,image.width*u/width,0,image.width*(end-u)/width,image.height,x,-a.z*.12,span,height);
    if(!front){
      ctx.filter='none';ctx.globalAlpha=.12;
      ctx.drawImage(image,image.width*u/width,0,image.width*(end-u)/width,image.height,x,-a.z*.12,span,height);
      ctx.globalAlpha=1;
    }
  }
  ctx.restore();
  return pose;
}
