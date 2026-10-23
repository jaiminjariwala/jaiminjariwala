// Bind only to paper handles, never the document or photo/folder strips.
export function preventPaperNativeTouch(event){
  if(event.cancelable&&event.touches.length===1)event.preventDefault();
}
