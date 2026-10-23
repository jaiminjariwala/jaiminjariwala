import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buckleProfile,buckleAppearance,buckleMap,stepBuckle} from './stickerBuckle.mjs';

test('the diagonal ridge displaces artwork locally rather than translating the whole sticker',()=>{
  assert.ok(Math.abs(buckleProfile(.58).r-.5)>.3);
  assert.ok(Math.abs(buckleProfile(.58).g-.5)>.1);
  assert.ok(Math.abs(buckleProfile(0).r-.5)<.00001);
  assert.ok(Math.abs(buckleProfile(1).r-.5)<.00001);
  assert.ok(buckleMap('displacement').startsWith('data:image/svg+xml,'));
});
test('hover flattens geometry and shading together while developing the silhouette shadow',()=>{
  const rest=buckleAppearance(1),flat=buckleAppearance(0);
  assert.ok(rest.scale>0);assert.equal(flat.scale,0);assert.equal(flat.shade,0);
  assert.ok(flat.blur>rest.blur);assert.ok(flat.opacity>rest.opacity);
});
test('resting fold matches the reference soft low-contrast lighting instead of a dark stripe',()=>{
  for(let t=0;t<=1;t+=.002)assert.ok(buckleProfile(t).shade>=.9199);
  assert.ok(buckleAppearance(1).scale<=.045);
});
test('the deformation spring is frame-rate independent and reverses continuously',()=>{
  const sample=hz=>{let p=1,v=0;for(let i=0;i<hz/2;i++){const s=stepBuckle(p,v,0,1/hz);p=s.position;v=s.velocity;}return p;};
  assert.ok(Math.abs(sample(30)-sample(120))<.000001);
  let s=stepBuckle(.5,-2,1,.001);assert.ok(s.position<.5);assert.ok(s.velocity>-2);
});
test('one filter owns the entire sticker and pointer bounds stay unchanged',()=>{
  const source=readFileSync(new URL('./StickerButton.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('in="SourceGraphic" in2="ridge"'));
  assert.ok(source.includes('in="shaded" in2="paper" operator="in"'));
  assert.ok(source.includes('prefers-reduced-motion: reduce'));
  assert.ok(!source.includes('translateY'));
});
