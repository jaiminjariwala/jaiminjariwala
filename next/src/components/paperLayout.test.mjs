import test from 'node:test';
import assert from 'node:assert/strict';
import {paperViewportWidth} from './paperLayout.mjs';

test('mobile sheet dimensions remain unchanged',()=>{
  for(const width of [320,390,640,760])assert.equal(paperViewportWidth(width),width);
});
test('desktop paper and curl end at the seven percent right gutter',()=>{
  for(const width of [1024,1440,1920,2560]){
    assert.ok(Math.abs((paperViewportWidth(width)-16)-width*.93)<.00001);
  }
});
