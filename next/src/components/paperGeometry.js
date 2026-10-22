// Continuous semicircular lobes. Both the DOM mask and the reflected canvas
// fold use this outline, so the edges cannot disagree while dragging.
export const PAGE_SCALLOP_PERIOD = 24;

export function scallopedOutline(width, height, period = 16) {
  const nx = Math.max(2, Math.round(width / period));
  const ny = Math.max(2, Math.round(height / period));
  const sx = width / nx, sy = height / ny;
  const rx = sx / 2, ry = sy / 2;
  const points = [];
  const arc = (cx, cy, from, sweep = Math.PI) => {
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

export function polygonPath(points) {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
}

export function outlineMask(width, height, period) {
  const path = polygonPath(scallopedOutline(width, height, period));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="white" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function clipHalfPlane(points, k, keepFold = true) {
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
