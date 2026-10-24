import type {Bounds,Point} from './paperGeometry';
export interface PaperDragOptions {gain?:number;stopAtOrigin?:boolean}
export const RESTING_PAPER_ANGLE = Math.PI / 4;

export function restingPaperK(width:number,viewportWidth=width){
  // Phone sheets finish completely flat. A top/edge drag must not stop at
  // the old dog-ear depth and then jump back to a diagonal corner pose.
  if(viewportWidth<=760)return width-(width<640?24:32);
  return width-32-Math.min(180,width*.17);
}

export function paperDragUpperK(width:number,viewportWidth=width){
  return viewportWidth<=760?restingPaperK(width,viewportWidth):width-70;
}

export function paperOpenK(width:number, height:number, originX:number, originY:number, angle:number, inset=16, {bounds,clearance=100}:{bounds?:Bounds|null;clearance?:number}={}) {
  const nx=-Math.cos(angle),ny=Math.sin(angle);
  const {left,top,right,bottom}=bounds??{left:inset,top:inset,right:width-inset,bottom:height-inset};
  const reach=Math.max(...[[left,top],[right,top],[left,bottom],[right,bottom]].map(([x,y])=>(x-originX)*nx+(y-originY)*ny));
  // Stop at the collection's farthest stamp, not the empty page beneath it.
  // Keep only the clearance needed for the cylinder and its soft shadow.
  return width-inset*2-(Math.max(0,reach)+clearance)*Math.SQRT2;
}

export function paperDragPose(startDistance:number, startAngle:number, dx:number, dy:number, {gain=.65,stopAtOrigin=false}:PaperDragOptions={}) {
  // Preserve both pointer components: sliding sideways rotates the roll axis
  // instead of projecting every gesture onto one fixed diagonal.
  const x = Math.cos(startAngle) * startDistance - dx * gain;
  const y = Math.sin(startAngle) * startDistance + dy * gain;
  // A long closing gesture must stop at fully flat, not cross the grab
  // origin and accidentally start rolling the sheet again in reverse.
  if(stopAtOrigin&&x*Math.cos(startAngle)+y*Math.sin(startAngle)<=1){
    return {distance:1,angle:startAngle};
  }
  const distance = Math.hypot(x, y);
  // Signed components allow a slight reverse tilt past horizontal/vertical.
  // At the grab origin the direction is undefined; preserve it rather than
  // flipping the cylinder through 180 degrees for a subpixel movement.
  return { distance: Math.max(1,distance), angle: distance<1?startAngle:Math.atan2(y, x) };
}

export function nearestPaperAngle(angle:number, previous:number) {
  return previous+Math.atan2(Math.sin(angle-previous),Math.cos(angle-previous));
}

export function paperRollGrabPolygon(width:number,height:number,originX:number,originY:number,distance:number,angle:number,halfWidth=90) {
  const polygon=stationaryPaperPolygon(width,height,originX,originY,distance-halfWidth,angle);
  const nx=-Math.cos(angle),ny=Math.sin(angle);
  const side=(p:Point)=>distance+halfWidth-(p.x-originX)*nx-(p.y-originY)*ny;
  const output:Point[]=[];
  polygon.forEach((a,index)=>{
    const b=polygon[(index+1)%polygon.length],da=side(a),db=side(b);
    if(da>=0)output.push(a);
    if((da>=0)!==(db>=0)){
      const t=da/(da-db);
      output.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
    }
  });
  return output;
}

export function stationaryPaperPolygon(width:number, height:number, originX:number, originY:number, distance:number, angle:number) {
  const nx = -Math.cos(angle), ny = Math.sin(angle);
  const polygon = [{x:0,y:0},{x:width,y:0},{x:width,y:height},{x:0,y:height}];
  const output:Point[] = [];
  const side = (p:Point) => (p.x-originX)*nx + (p.y-originY)*ny - distance;
  polygon.forEach((a, index) => {
    const b = polygon[(index+1)%polygon.length];
    const da=side(a), db=side(b);
    if(da>=0)output.push(a);
    if((da>=0)!==(db>=0)){
      const t=da/(da-db);
      output.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
    }
  });
  return output;
}
