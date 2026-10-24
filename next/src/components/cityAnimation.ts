// Fixed-camera, photo-based motion. All traffic is simulated, not live.
export const COLUMNS = 56;
export const ROWS = 38;
export const LOOP_SECONDS = 48;

export function carPosition(seconds:number, index:number, lane = 2) {
  const progress = ((seconds / LOOP_SECONDS + index / 3 + (lane === 3 ? .09 : .24)) % 1 + 1) % 1;
  // Perspective accelerates apparent motion toward the camera.
  const distance = progress ** 3;
  const groundDepth = 1.9 * distance;
  return {
    x: lane === 3 ? .473 + .5244 * groundDepth : .447 + .2195 * groundDepth,
    bottom: .475 + groundDepth,
    // Calibrated to the parked minivan: at ground y=.67, a moving sedan
    // is about .127 of frame width. All lanes share this road-plane scale.
    width: .006 + .62 * groundDepth,
    opacity: Math.min(1, progress * 16),
    progress,
    lane,
  };
}

export const signalCountdown = (seconds:number) => 24 - Math.floor(((seconds / 3) % 25 + 25) % 25);

function drawPerson(context:CanvasRenderingContext2D, x:number, bottom:number, size:number, phase:number, shirt:string) {
  const stride = Math.sin(phase) * size * .18;
  context.save(); context.lineCap = "round";
  context.fillStyle = "#b28a70";
  context.beginPath(); context.arc(x, bottom - size * .86, size * .09, 0, Math.PI * 2); context.fill();
  context.strokeStyle = shirt; context.lineWidth = size * .18;
  context.beginPath(); context.moveTo(x, bottom - size * .69); context.lineTo(x, bottom - size * .37); context.stroke();
  context.lineWidth = size * .07;
  context.beginPath(); context.moveTo(x, bottom - size * .62); context.lineTo(x + stride, bottom - size * .37); context.moveTo(x, bottom - size * .62); context.lineTo(x - stride, bottom - size * .37); context.stroke();
  context.strokeStyle = "#222b35";
  context.beginPath(); context.moveTo(x, bottom - size * .38); context.lineTo(x + stride, bottom); context.moveTo(x, bottom - size * .38); context.lineTo(x - stride, bottom); context.stroke();
  context.restore();
}

function drawCyclist(context:CanvasRenderingContext2D, x:number, bottom:number, size:number, phase:number) {
  // Head-on view: wheels overlap along the direction of travel, rather
  // than showing the side-on triangular frame of a crossing bicycle.
  context.save(); context.lineCap = "round"; context.lineJoin = "round";
  const sway = Math.sin(phase) * size * .008;
  const center = x + sway;
  context.fillStyle = "#202426";
  context.beginPath(); context.ellipse(center, bottom - size * .16, size * .025, size * .16, 0, 0, Math.PI * 2); context.fill();
  context.strokeStyle = "#858b8d"; context.lineWidth = size * .012;
  context.beginPath(); context.moveTo(center, bottom - size * .30); context.lineTo(center, bottom - size * .02); context.stroke();
  context.strokeStyle = "#963b35"; context.lineWidth = size * .026;
  context.beginPath(); context.moveTo(center, bottom - size * .17); context.lineTo(center, bottom - size * .48); context.stroke();
  context.strokeStyle = "#34383a"; context.lineWidth = size * .045;
  for (const side of [-1, 1]) {
    const pedal = Math.sin(phase + (side === 1 ? Math.PI : 0)) * size * .07;
    context.beginPath(); context.moveTo(center + side * size * .055, bottom - size * .48); context.lineTo(center + side * size * .09, bottom - size * .34 + pedal); context.lineTo(center + side * size * .045, bottom - size * .20 + pedal); context.stroke();
  }
  context.fillStyle = "#526b87";
  context.beginPath(); context.ellipse(center, bottom - size * .62, size * .105, size * .17, 0, 0, Math.PI * 2); context.fill();
  context.strokeStyle = "#b88a70"; context.lineWidth = size * .035;
  for (const side of [-1, 1]) {
    context.beginPath(); context.moveTo(center + side * size * .08, bottom - size * .72); context.lineTo(center + side * size * .15, bottom - size * .56); context.lineTo(center + side * size * .12, bottom - size * .47); context.stroke();
  }
  context.strokeStyle = "#303638"; context.lineWidth = size * .025;
  context.beginPath(); context.moveTo(center - size * .14, bottom - size * .47); context.lineTo(center + size * .14, bottom - size * .47); context.stroke();
  context.fillStyle = "#b88a70";
  context.beginPath(); context.ellipse(center, bottom - size * .85, size * .06, size * .075, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#d5d8d5";
  context.beginPath(); context.ellipse(center, bottom - size * .915, size * .073, size * .035, 0, Math.PI, Math.PI * 2); context.fill();
  context.restore();
}

export function composeStreetFrame(context:CanvasRenderingContext2D, plate:HTMLImageElement, car:HTMLImageElement, seconds:number, width:number, height:number) {
  context.clearRect(0, 0, width, height);
  context.drawImage(plate, 0, 0, width, height);
  // Only leafy canopy regions sway; architecture, trunks and camera stay fixed.
  for (const [x, y, w, h, phase] of [[.25, .01, .36, .36, 0], [.67, .04, .27, .36, 1.8]]) {
    context.save();
    context.beginPath(); context.ellipse((x + w / 2) * width, (y + h / 2) * height, w * width / 2, h * height / 2, 0, 0, Math.PI * 2); context.clip();
    const sway = Math.sin(seconds * Math.PI / 8 + phase) * width * .0018;
    context.drawImage(plate, sway, Math.cos(seconds * Math.PI / 12 + phase) * height * .0008, width, height);
    context.restore();
  }
  const cars = [2, 3].flatMap(lane => [0, 1, 2].map(index => carPosition(seconds, index, lane))).sort((a, b) => a.progress - b.progress);
  for (const vehicle of cars) {
    const carWidth = vehicle.width * width, carHeight = carWidth * .70;
    const x = vehicle.x * width - carWidth / 2, y = vehicle.bottom * height - carHeight;
    context.save(); context.globalAlpha = vehicle.opacity;
    if (vehicle.lane === 3) context.filter = vehicle.progress < .5 ? "brightness(1.3)" : "brightness(.85)";
    context.fillStyle = "rgba(0,0,0,.25)";
    context.beginPath(); context.ellipse(vehicle.x * width, vehicle.bottom * height - carHeight * .04, carWidth * .45, carHeight * .07, 0, 0, Math.PI * 2); context.fill();
    context.drawImage(car, car.width * .085, car.height * .06, car.width * .83, car.height * .90, x, y, carWidth, carHeight);
    context.restore();
  }
  // New walkers remain on the sidewalks; cyclists use the left curb lane.
  for (let index = 0; index < 5; index++) {
    const p = ((seconds / 96 + index / 5 + .12) % 1);
    const d = p * p, size = (.008 + .09 * d) * height;
    const left = index % 2 === 0;
    const x = (left ? .405 - .25 * d : .55 + .47 * d) * width;
    const bottom = (.49 + .58 * d) * height;
    context.save(); context.globalAlpha = Math.min(1, p * 16, (1 - p) * 20);
    drawPerson(context, x, bottom, size, seconds * 1.1 + index, ["#aa3439", "#d0c6ae", "#42627a", "#9c947d", "#506849"][index]);
    context.restore();
  }
  for (let index = 0; index < 2; index++) {
    const p = ((seconds / 64 + index / 2 + .18) % 1), d = p ** 3;
    const depth = 1.9 * d;
    context.save(); context.globalAlpha = Math.min(1, p * 16);
    drawCyclist(context, (.432 - .2424 * depth) * width, (.475 + depth) * height, (.006 + .72 * depth) * height, seconds * 1.4 + index);
    context.restore();
  }
  // Replace the static orange signal with a slow 24-to-0 countdown.
  context.save();
  context.fillStyle = "#111415"; context.fillRect(width * .144, height * .246, width * .025, height * .043);
  context.fillStyle = "#ff961d"; context.textAlign = "center"; context.textBaseline = "middle";
  context.font = `bold ${height * .025}px monospace`;
  context.fillText(String(signalCountdown(seconds)).padStart(2, "0"), width * .1565, height * .267);
  context.restore();
}
