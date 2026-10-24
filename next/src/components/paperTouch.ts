// Bind only to paper handles, never the document or photo/folder strips.
export function preventPaperNativeTouch(event:{cancelable:boolean;touches:ArrayLike<unknown>;preventDefault():void}){
  if(event.cancelable&&event.touches.length===1)event.preventDefault();
}
