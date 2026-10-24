import test from 'node:test';
import assert from 'node:assert/strict';
import { stepPaperSpring, isPaperSettled, paperReleaseOpens } from './paperMotion.ts';

function simulate(start:number, target:number, fps:number, seconds = 1.5, initialVelocity = 0, dragging = false) {
  let position = start, velocity = initialVelocity;
  const positions = [];
  for (let frame = 0; frame < fps * seconds; frame++) {
    ({ position, velocity } = stepPaperSpring(position, velocity, target, 1 / fps, dragging));
    positions.push(position);
  }
  return { position, velocity, positions };
}

test('release commits at 25% in both directions, including both endpoints', () => {
  const closed = 1200, opened = -400;
  assert.equal(paperReleaseOpens(false, 801, closed, opened), false);
  assert.equal(paperReleaseOpens(false, 800, closed, opened), true);
  assert.equal(paperReleaseOpens(false, opened, closed, opened), true);
  assert.equal(paperReleaseOpens(true, -1, closed, opened), true);
  assert.equal(paperReleaseOpens(true, 0, closed, opened), false);
  assert.equal(paperReleaseOpens(true, closed, closed, opened), false);
});

test('landing has the same timing at 30, 60, and 120 Hz', () => {
  const samples = [30, 60, 120].map(fps => simulate(1150, -450, fps, .5));
  samples.forEach(sample => assert.ok(Math.abs(sample.position - samples[0].position) < 1e-8));
});

test('opening and closing decelerate into the stop without bouncing', () => {
  for (const [start, target] of [[1150, -450], [-450, 1150]]) {
    const result = simulate(start, target, 60);
    let previous = start;
    result.positions.forEach(position => {
      assert.ok(position >= Math.min(start, target) && position <= Math.max(start, target));
      assert.ok(Math.abs(position - target) <= Math.abs(previous - target));
      previous = position;
    });
    assert.ok(isPaperSettled(result.position, result.velocity, target));
  }
});

test('drag follow is responsive and release keeps the existing velocity', () => {
  const follow = simulate(0, 200, 120, .2, 0, true);
  assert.ok(follow.position > 195);
  const released = stepPaperSpring(follow.position, follow.velocity, 400, 1 / 120);
  assert.ok(released.velocity > 0);
  assert.ok(released.position > follow.position);
  assert.ok(released.position - follow.position < 5);
});

test('a long frame stays finite and does not jump to the destination', () => {
  const result = stepPaperSpring(1150, -1200, -450, 2);
  assert.ok(Number.isFinite(result.position) && Number.isFinite(result.velocity));
  assert.ok(result.position > 0);
});

test('a flat phone landing ends below a pixel instead of waiting through a visible tail',()=>{
  assert.equal(isPaperSettled(365.4,6,366),false,'desktop keeps its original precise settle');
  assert.equal(isPaperSettled(365.4,6,366,{flatLanding:true}),true);
  assert.equal(isPaperSettled(364,20,366,{flatLanding:true}),false,'a visible fold still animates');
  for(const fps of [30,60,120]){
    let position=-1200,velocity=0,finished=false;
    for(let frame=0;frame<fps*1.2;frame++){
      ({position,velocity}=stepPaperSpring(position,velocity,366,1/fps));
      if(isPaperSettled(position,velocity,366,{flatLanding:true})){
        assert.ok(Math.abs(position-366)<=.75);
        finished=true;break;
      }
    }
    assert.ok(finished,`flat landing at ${fps}fps must not linger near the top`);
  }
});
