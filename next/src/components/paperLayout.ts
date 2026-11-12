/** Keep the renderer in the same physical coordinates as the responsive CSS. */
export function paperScale(viewportWidth: number) {
  return viewportWidth > 760 ? 0.8 : 1;
}

export function paperInset(viewportWidth: number) {
  return viewportWidth <= 760
    ? viewportWidth < 640
      ? 12
      : 16
    : 16 * paperScale(viewportWidth);
}

export function paperViewportWidth(viewportWidth: number) {
  return viewportWidth > 760
    ? viewportWidth * 0.93 + paperInset(viewportWidth)
    : viewportWidth;
}
