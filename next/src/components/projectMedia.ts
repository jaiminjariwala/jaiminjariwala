// Independent edge radii let adjacent semicircles meet exactly, even when the
// media aspect ratio changes. A shared minimum radius left flat gaps between
// cutouts on the longer edge. Quarter ellipses join the four corners.
export function projectFramePath(width: number, height: number, period = 24) {
  const columns = Math.max(2, Math.round(width / period));
  const rows = Math.max(2, Math.round(height / period));
  const horizontalStep = width / columns;
  const verticalStep = height / rows;
  const horizontalRadius = horizontalStep / 2;
  const verticalRadius = verticalStep / 2;
  const commands = [`M${horizontalRadius},0`];

  const arc = (radiusX: number, radiusY: number, x: number, y: number) => {
    commands.push(`A${radiusX},${radiusY} 0 0 0 ${x},${y}`);
  };

  for (let column = 1; column < columns; column += 1) {
    arc(horizontalRadius, horizontalRadius, (column + 0.5) * horizontalStep, 0);
  }
  arc(horizontalRadius, verticalRadius, width, verticalRadius);

  for (let row = 1; row < rows; row += 1) {
    arc(verticalRadius, verticalRadius, width, (row + 0.5) * verticalStep);
  }
  arc(horizontalRadius, verticalRadius, width - horizontalRadius, height);

  for (let column = columns - 1; column > 0; column -= 1) {
    arc(
      horizontalRadius,
      horizontalRadius,
      (column - 0.5) * horizontalStep,
      height,
    );
  }
  arc(horizontalRadius, verticalRadius, 0, height - verticalRadius);

  for (let row = rows - 1; row > 0; row -= 1) {
    arc(verticalRadius, verticalRadius, 0, (row - 0.5) * verticalStep);
  }
  arc(horizontalRadius, verticalRadius, horizontalRadius, 0);

  return `${commands.join(" ")} Z`;
}

export function videoPosition(time: number, duration: number) {
  return Number.isFinite(duration) && duration > 0 && Number.isFinite(time)
    ? Math.max(0, Math.min(time, duration))
    : 0;
}

export function videoTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
