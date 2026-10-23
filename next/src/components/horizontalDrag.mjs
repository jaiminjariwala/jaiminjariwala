export function createHorizontalDragHandlers(){
  let gesture=null;
  const end=event=>{
    if(gesture?.id!==event.pointerId)return;
    gesture.active=false;
    delete event.currentTarget.dataset.dragging;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return {
    onPointerDown:event=>{
      gesture=null;
      if(event.pointerType!=="mouse"||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      gesture={id:event.pointerId,x:event.clientX,y:event.clientY,left:event.currentTarget.scrollLeft,dragged:false,active:true};
    },
    onPointerMove:event=>{
      if(!gesture?.active||gesture.id!==event.pointerId)return;
      const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
      if(!gesture.dragged&&Math.abs(dx)>5&&Math.abs(dx)>Math.abs(dy)){
        gesture.dragged=true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging="true";
      }
      if(gesture.dragged){event.preventDefault();event.currentTarget.scrollLeft=gesture.left-dx;}
    },
    onPointerUp:end,onPointerCancel:end,onLostPointerCapture:end,
    onDragStart:event=>event.preventDefault(),
    onClickCapture:event=>{if(event.detail>0&&gesture?.dragged){event.preventDefault();event.stopPropagation();}},
  };
}
