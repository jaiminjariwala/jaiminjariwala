import test from 'node:test';
import assert from 'node:assert/strict';
import {clampPaperScroll} from './paperScroll.ts';

test('pull-to-refresh bounce does not shift the rendered corner twice',()=>{
  for(const bounce of [-.5,-20,-120,-300])assert.equal(clampPaperScroll(bounce,1000),0);
});
test('ordinary scrolling retains subpixel precision',()=>{
  for(const scroll of [0,.5,50,620.25,1000])assert.equal(clampPaperScroll(scroll,1000),scroll);
});
test('bottom bounce and short pages stay at their real scroll bounds',()=>{
  assert.equal(clampPaperScroll(1100,1000),1000);
  assert.equal(clampPaperScroll(30,0),0);
  assert.equal(clampPaperScroll(-30,-100),0);
});
