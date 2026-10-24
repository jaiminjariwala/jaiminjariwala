// Bound temporary GPU surfaces to the area a phone can actually show. The
// material still uses the full document geometry, so the roll stays attached.
export function paperRasterHeight(width,documentHeight,viewportHeight,fullPage=false){
  return width<=760&&!fullPage?Math.min(documentHeight,viewportHeight+192):documentHeight;
}

export function stampAtPoint(stamps,x,y){
  return stamps.find(stamp=>{
    const r=stamp.getBoundingClientRect();
    return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
  });
}

// A scrollable, single-column collection extends beyond the viewport. The
// roll only needs to clear the visible stamps, not travel past the whole list.
export function visibleStampBounds(rects,viewport,scrollY=0){
  const visible=rects.map(r=>({
    left:Math.max(r.left,viewport.left),right:Math.min(r.right,viewport.right),
    top:Math.max(r.top,viewport.top),bottom:Math.min(r.bottom,viewport.bottom),
  })).filter(r=>r.right>r.left&&r.bottom>r.top);
  if(!visible.length)return null;
  return {
    left:Math.min(...visible.map(r=>r.left)),right:Math.max(...visible.map(r=>r.right)),
    top:Math.min(...visible.map(r=>r.top))+scrollY,bottom:Math.max(...visible.map(r=>r.bottom))+scrollY,
  };
}

// Share in-flight work as well as completed snapshots. Failed captures may
// retry; one missing image must not poison subsequent navigation.
export function cachedStamp(cache,key,capture){
  if(!cache.has(key)){
    const pending=Promise.resolve().then(capture).catch(error=>{cache.delete(key);throw error;});
    cache.set(key,pending);
  }
  return cache.get(key);
}
