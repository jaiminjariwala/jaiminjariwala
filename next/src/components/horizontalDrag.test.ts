import test from 'node:test';
import assert from 'node:assert/strict';
import {createHorizontalDragHandlers} from './horizontalDrag.ts';
import type {HorizontalPointerEvent} from './horizontalDrag';
import {readFileSync} from 'node:fs';

function fixture(){
  const captures=new Set<number>();
  const strip={scrollLeft:0,dataset:{} as Record<string,string|undefined>,setPointerCapture:(id:number)=>captures.add(id),hasPointerCapture:(id:number)=>captures.has(id),releasePointerCapture:(id:number)=>captures.delete(id)};
  const event=(overrides:Partial<HorizontalPointerEvent>={}):HorizontalPointerEvent&{detail:number;prevented?:boolean;stopped?:boolean;stopPropagation():void}=>({currentTarget:strip,pointerId:1,pointerType:'mouse',button:0,clientX:250,clientY:100,detail:1,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},...overrides});
  return {strip,event,handlers:createHorizontalDragHandlers()};
}

test('folder dragging reveals later content and suppresses the release click',()=>{
  const {strip,event,handlers}=fixture();
  handlers.onPointerDown(event());handlers.onPointerMove(event({clientX:50}));
  assert.equal(strip.scrollLeft,200);assert.equal(strip.dataset.dragging,'true');
  handlers.onPointerUp(event({clientX:50}));
  const click=event();handlers.onClickCapture(click);
  assert.equal(click.prevented,true);assert.equal(click.stopped,true);
  assert.equal(strip.dataset.dragging,undefined);
});

test('touch swipes remain native and ordinary folder taps still open',()=>{
  const {strip,event,handlers}=fixture();
  const down=event({pointerType:'touch'}),move=event({pointerType:'touch',clientX:50});
  handlers.onPointerDown(down);handlers.onPointerMove(move);
  assert.equal(strip.scrollLeft,0);assert.equal(move.prevented,undefined);
  const tap=event();handlers.onClickCapture(tap);assert.equal(tap.prevented,undefined);
});

test('small movements and vertical gestures do not start horizontal dragging',()=>{
  const {strip,event,handlers}=fixture();
  handlers.onPointerDown(event());
  handlers.onPointerMove(event({clientX:247}));
  handlers.onPointerMove(event({clientX:240,clientY:180}));
  assert.equal(strip.scrollLeft,0);assert.equal(strip.dataset.dragging,undefined);
  const click=event();handlers.onClickCapture(click);assert.equal(click.prevented,undefined);
});

test('phone folders remain visible instead of waiting for an entrance animation',()=>{
  const source=readFileSync(new URL('./GalleryPage.tsx',import.meta.url),'utf8');
  assert.ok(source.indexOf("if(window.matchMedia('(max-width: 760px)').matches)return;")<source.indexOf('render(0);'));
  assert.ok(source.includes("if(window.matchMedia('(max-width: 760px)').matches)return;"));
});
