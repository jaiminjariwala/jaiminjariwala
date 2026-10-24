// Match the desktop sheet's right gutter in PortfolioV2.module.css.
// Keep document coordinates shared by the DOM, ink texture and roll renderer.
export function paperViewportWidth(viewportWidth:number) {
  return viewportWidth > 760 ? viewportWidth * .93 + 16 : viewportWidth;
}
