import type {Point} from './paperGeometry';
import type {StampSnapshot} from '@/types/paper';

export const STAMP_PLACEMENT_MS=420;
export function stampPlacementPose(elapsed:number,width:number){
  const progress=Math.max(0,Math.min(1,elapsed/STAMP_PLACEMENT_MS));
  const remaining=(1-progress)**2;
  const flat=width*(1-remaining);
  return {progress,flat,offset:progress===1?0:-width*.65*remaining,radius:Math.min(width*.075,(width-flat)/Math.PI),done:progress===1};
}

// The paper is convex. Wait until all four rotated stamp corners have been
// uncovered before applying the smaller sticker above it.
export function stampRegionExposed(stamp:Pick<StampSnapshot,'x'|'y'|'width'|'height'|'rotation'>,polygon:readonly Point[]){
  if(polygon.length<3)return false;
  const {x,y,width:w,height:h,rotation:r}=stamp,c=Math.cos(r),s=Math.sin(r);
  return [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].every(([px,py])=>{
    const point={x:x+w/2+px*c-py*s,y:y+h/2+px*s+py*c};
    let sign=0;
    for(let i=0;i<polygon.length;i++){
      const a=polygon[i],b=polygon[(i+1)%polygon.length];
      const cross=(b.x-a.x)*(point.y-a.y)-(b.y-a.y)*(point.x-a.x);
      if(Math.abs(cross)<.01)continue;
      if(sign&&Math.sign(cross)!==sign)return false;
      sign=Math.sign(cross);
    }
    return true;
  });
}

// One bounded stamp canvas, at most 48 outer-cylinder strips. No per-strip
// filters, full-page clears, frame-time texture uploads, or changing base tilt.
export function drawStampPlacement(ctx:CanvasRenderingContext2D,image:HTMLCanvasElement,white:HTMLCanvasElement,shade:HTMLCanvasElement,width:number,height:number,elapsed:number,rotation:number){
  const pose=stampPlacementPose(elapsed,width);
  ctx.save();ctx.translate(width/2+pose.offset,height/2);ctx.rotate(rotation);ctx.translate(-width/2,-height/2);
  if(pose.flat>0)ctx.drawImage(image,0,0,image.width*pose.flat/width,image.height,0,0,pose.flat,height);
  if(pose.radius>.01){
    const arc=Math.min(width-pose.flat,Math.PI*pose.radius),steps=48;
    // The lifted white back is closest to the camera and covers the ink.
    for(const back of [false,true])for(let i=0;i<steps;i++){
      const a=i*Math.PI/steps,b=(i+1)*Math.PI/steps,mid=(a+b)/2;
      if((mid>Math.PI/2)!==back)continue;
      const u=pose.flat+arc*i/steps,span=arc/steps;
      const x=pose.flat+Math.min(Math.sin(a),Math.sin(b))*pose.radius;
      const dx=Math.max(.15,Math.abs(Math.sin(b)-Math.sin(a))*pose.radius)+.25;
      const y=-pose.radius*(1-Math.cos(mid))*.13;
      const args=[image.width*u/width,0,image.width*span/width,image.height,x,y,dx,height] as const;
      ctx.drawImage(back?white:image,...args);
      ctx.globalAlpha=back?.1:.08+.12*(1-Math.abs(Math.cos(mid)));
      ctx.drawImage(back?image:shade,...args);ctx.globalAlpha=1;
    }
  }
  ctx.restore();return pose;
}
