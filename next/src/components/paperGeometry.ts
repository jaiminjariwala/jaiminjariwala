// Continuous semicircular lobes. Both the DOM mask and the reflected canvas
// fold use this outline, so the edges cannot disagree while dragging.
export const PAGE_SCALLOP_PERIOD = 24;
export interface Point {x:number;y:number}
export interface Bounds {left:number;right:number;top:number;bottom:number}

export function scallopedOutline(width:number, height:number, period = 16) {
  const nx = Math.max(2, Math.round(width / period));
  const ny = Math.max(2, Math.round(height / period));
  const sx = width / nx, sy = height / ny;
  const rx = sx / 2, ry = sy / 2;
  const points:Point[] = [];
  const arc = (cx:number, cy:number, from:number, sweep = Math.PI) => {
    const steps=Math.round(12*sweep/Math.PI);
    for (let step = 0; step <= steps; step++) {
      const angle = from + sweep * step / steps;
      points.push({ x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry });
    }
  };
  arc(rx,ry,Math.PI/2,Math.PI*1.5);
  for (let i = 1; i < nx-1; i++) arc((i + .5) * sx, ry, Math.PI);
  arc(width-rx,ry,Math.PI,Math.PI*1.5);
  for (let i = 1; i < ny-1; i++) arc(width-rx, (i + .5) * sy, -Math.PI/2);
  arc(width-rx,height-ry,-Math.PI/2,Math.PI*1.5);
  for (let i = nx-2; i > 0; i--) arc((i + .5) * sx, height-ry, 0);
  arc(rx,height-ry,0,Math.PI*1.5);
  for (let i = ny-2; i > 0; i--) arc(rx, (i + .5) * sy, Math.PI/2);
  return points;
}

export function polygonPath(points:readonly Point[]) {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
}

// Phone sheets have straight sides; the small stickers keep all four rims.
export function sheetOutline(width:number,height:number,period=24,sideScallops=true){
  if(sideScallops)return scallopedOutline(width,height,period);
  const count=Math.max(2,Math.round(width/period)),step=width/count,radius=step/2,points=[];
  for(let i=0;i<count;i++)for(let n=0;n<=12;n++){
    const angle=Math.PI+n*Math.PI/12;
    points.push({x:(i+.5)*step+Math.cos(angle)*radius,y:radius+Math.sin(angle)*radius});
  }
  for(let i=count-1;i>=0;i--)for(let n=0;n<=12;n++){
    const angle=n*Math.PI/12;
    points.push({x:(i+.5)*step+Math.cos(angle)*radius,y:height-radius+Math.sin(angle)*radius});
  }
  return points;
}

export function outlineMask(width:number, height:number, period=PAGE_SCALLOP_PERIOD, sideScallops=true) {
  const path = polygonPath(sheetOutline(width, height, period,sideScallops));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="white" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function clipHalfPlane(points:readonly Point[], k:number, keepFold = true) {
  const output = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const da = a.x - a.y - k, db = b.x - b.y - k;
    const insideA = keepFold ? da >= 0 : da <= 0;
    const insideB = keepFold ? db >= 0 : db <= 0;
    if (insideA) output.push(a);
    if (insideA !== insideB) {
      const t = da / (da - db);
      output.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return output;
}
