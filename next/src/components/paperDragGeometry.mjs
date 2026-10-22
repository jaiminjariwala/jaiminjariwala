export const RESTING_PAPER_ANGLE = Math.PI / 4;

export function paperDragPose(startDistance, startAngle, dx, dy, {gain=.65,stopAtOrigin=false}={}) {
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

export function nearestPaperAngle(angle, previous) {
  return previous+Math.atan2(Math.sin(angle-previous),Math.cos(angle-previous));
}

export function paperRollGrabPolygon(width,height,originX,originY,distance,angle,halfWidth=90) {
  const polygon=stationaryPaperPolygon(width,height,originX,originY,distance-halfWidth,angle);
  const nx=-Math.cos(angle),ny=Math.sin(angle);
  const side=p=>distance+halfWidth-(p.x-originX)*nx-(p.y-originY)*ny;
  const output=[];
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

export function stationaryPaperPolygon(width, height, originX, originY, distance, angle) {
  const nx = -Math.cos(angle), ny = Math.sin(angle);
  const polygon = [{x:0,y:0},{x:width,y:0},{x:width,y:height},{x:0,y:height}];
  const output = [];
  const side = p => (p.x-originX)*nx + (p.y-originY)*ny - distance;
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
