interface HorizontalTarget {scrollLeft:number;dataset:Record<string,string|undefined>;setPointerCapture(id:number):unknown;hasPointerCapture(id:number):boolean;releasePointerCapture(id:number):unknown}
export interface HorizontalPointerEvent {currentTarget:HorizontalTarget;pointerId:number;pointerType:string;button:number;clientX:number;clientY:number;ctrlKey?:boolean;metaKey?:boolean;shiftKey?:boolean;altKey?:boolean;preventDefault():void}
export function createHorizontalDragHandlers(){
  let gesture:{id:number;x:number;y:number;left:number;dragged:boolean;active:boolean}|null=null;
  const end=(event:HorizontalPointerEvent)=>{
    if(gesture?.id!==event.pointerId)return;
    gesture.active=false;
    delete event.currentTarget.dataset.dragging;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return {
    onPointerDown:(event:HorizontalPointerEvent)=>{
      gesture=null;
      if(event.pointerType!=="mouse"||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      gesture={id:event.pointerId,x:event.clientX,y:event.clientY,left:event.currentTarget.scrollLeft,dragged:false,active:true};
    },
    onPointerMove:(event:HorizontalPointerEvent)=>{
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
    onDragStart:(event:{preventDefault():void})=>event.preventDefault(),
    onClickCapture:(event:{detail:number;preventDefault():void;stopPropagation():void})=>{if(event.detail>0&&gesture?.dragged){event.preventDefault();event.stopPropagation();}},
  };
}
