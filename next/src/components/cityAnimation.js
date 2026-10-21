// Fixed-camera, photo-based motion. All traffic is simulated, not live.
export const COLUMNS = 56;
export const ROWS = 38;
export const LOOP_SECONDS = 48;

export function carPosition(seconds, index) {
  const progress = ((seconds / LOOP_SECONDS + index / 3 + .24) % 1 + 1) % 1;
  // Perspective accelerates apparent motion toward the camera.
  const distance = progress ** 2;
  return {
    x: .447 + .18 * distance,
    bottom: .475 + .82 * distance,
    width: .008 + .31 * distance,
    opacity: Math.min(1, progress * 16),
    progress,
  };
}

export function composeStreetFrame(context, plate, car, seconds, width, height) {
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
  const cars = [0, 1, 2].map(index => carPosition(seconds, index)).sort((a, b) => a.progress - b.progress);
  for (const vehicle of cars) {
    const carWidth = vehicle.width * width, carHeight = carWidth * .70;
    const x = vehicle.x * width - carWidth / 2, y = vehicle.bottom * height - carHeight;
    context.save(); context.globalAlpha = vehicle.opacity;
    context.fillStyle = "rgba(0,0,0,.25)";
    context.beginPath(); context.ellipse(vehicle.x * width, vehicle.bottom * height - carHeight * .04, carWidth * .45, carHeight * .07, 0, 0, Math.PI * 2); context.fill();
    context.drawImage(car, car.width * .085, car.height * .06, car.width * .83, car.height * .90, x, y, carWidth, carHeight);
    context.restore();
  }
}
