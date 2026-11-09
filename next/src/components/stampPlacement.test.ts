import test from 'node:test';
import assert from 'node:assert/strict';
import {STAMP_PLACEMENT_MS,stampPlacementPose,stampRegionExposed} from './stampPlacement';

test('placement unfurls monotonically and meets the exact final stamp pose',()=>{
  for(const width of [130,160,228]){
    let flat=0;
    for(let t=0;t<=STAMP_PLACEMENT_MS;t+=5){const p=stampPlacementPose(t,width);assert.ok(p.flat>=flat&&p.flat<=width);assert.ok(p.offset<=0&&p.radius>=0);flat=p.flat;}
    assert.deepEqual(stampPlacementPose(STAMP_PLACEMENT_MS,width),{progress:1,flat:width,offset:0,radius:0,done:true});
    for(const hz of [30,60,120])assert.equal(stampPlacementPose(Math.ceil(STAMP_PLACEMENT_MS/(1000/hz))*(1000/hz),width).done,true);
  }
});

test('placement waits for the entire rotated stamp region to be uncovered',()=>{
  const stamp={x:30,y:40,width:160,height:160,rotation:-.07};
  assert.equal(stampRegionExposed(stamp,[]),false);
  assert.equal(stampRegionExposed(stamp,[{x:0,y:0},{x:100,y:0},{x:100,y:300},{x:0,y:300}]),false);
  const full=[{x:0,y:0},{x:250,y:0},{x:250,y:300},{x:0,y:300}];
  assert.equal(stampRegionExposed(stamp,full),true);
  assert.equal(stampRegionExposed(stamp,full.toReversed()),true);
});
