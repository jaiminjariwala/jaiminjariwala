export function clampPaperScroll(scrollY,maxScroll){
  const limit=Math.max(0,Number.isFinite(maxScroll)?maxScroll:0);
  return Math.max(0,Math.min(Number.isFinite(scrollY)?scrollY:0,limit));
}

export function paperScrollY(){
  const root=document.scrollingElement||document.documentElement;
  // Safari's rubber-band offset is already applied by its compositor to
  // fixed layers. Applying it again inside the canvas detaches the curl.
  return clampPaperScroll(window.scrollY,root.scrollHeight-root.clientHeight);
}
