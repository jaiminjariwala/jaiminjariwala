import test from 'node:test';
import assert from 'node:assert/strict';
import {stampArrivalPose,STAMP_ARRIVAL_DURATION} from './stampArrival.ts';
import {readFileSync} from 'node:fs';

test('stamp enters as a narrow roll and finishes flat in its exact resting position',()=>{
  for(const width of [130,160,228]){
    const start=stampArrivalPose(0,width),end=stampArrivalPose(STAMP_ARRIVAL_DURATION,width);
    assert.equal(start.flat,0);assert.ok(start.offset<0);assert.ok(start.radius>1);
    assert.equal(end.flat,width);assert.equal(end.offset,0);assert.equal(end.done,true);
  }
});
test('stamp material unfurls monotonically without overshoot',()=>{
  let previous=0;
  for(let elapsed=0;elapsed<=1000;elapsed+=10){
    const pose=stampArrivalPose(elapsed,160);
    assert.ok(pose.flat>=previous&&pose.flat<=160);assert.ok(pose.offset<=0);
    assert.ok(pose.radius>0);previous=pose.flat;
  }
});
test('unrolling replaces the DOM and printed stamp with one temporary curl',()=>{
  const source=readFileSync(new URL('./PaperPeel.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('wasOpen&&!open&&!s.reducedMotion'));
  assert.ok(source.includes('if(s.arrivalPending&&progress<.7)'));
  assert.ok(source.includes('state.current.arrivalActive?plain:ink'));
  assert.ok(source.includes("stamp.style.opacity=s.arrivalActive?'0':''"));
  assert.ok(source.includes('if(s.arrivalActive)finishStampArrival()'));
});
