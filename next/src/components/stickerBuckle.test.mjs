import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buckleField,buckleAppearance,buckleMap,stepBuckle} from './stickerBuckle.mjs';

test('the saddle field bends vertically with no horizontal ridge distortion',()=>{
  assert.equal(buckleField(0,0).r,.5);
  assert.equal(buckleField(0,0).g,.625);
  assert.equal(buckleField(1,0).g,.375);
  assert.equal(buckleField(0,1).g,.375);
  assert.equal(buckleField(1,1).g,.625);
  assert.equal(buckleField(.5,.5).g,.5);
  assert.ok(Math.abs(buckleField(4.5/24,.5/24).g-.6015625)<.00001);
  assert.ok(buckleMap('displacement').startsWith('data:image/svg+xml,'));
});
test('hover flattens geometry and shading together while developing the silhouette shadow',()=>{
  const rest=buckleAppearance(1),flat=buckleAppearance(0);
  assert.ok(rest.scale>0);assert.equal(flat.scale,0);assert.equal(flat.shade,0);
  assert.ok(flat.blur>rest.blur);assert.ok(flat.opacity>rest.opacity);
});
test('resting fold matches the reference soft low-contrast lighting instead of a dark stripe',()=>{
  const light=decodeURIComponent(buckleMap('shading'));
  assert.ok(light.includes('rgb(93%,93%,93%)'));
  assert.ok(light.includes('offset=".43"'));assert.ok(light.includes('offset=".52"'));
  const rest=buckleAppearance(1,200),hover=buckleAppearance(0,200);
  assert.equal(rest.scale,24);assert.equal(rest.blur,1.05);assert.equal(hover.blur,3.05);
  assert.ok(rest.pose.includes('rotateX(4.375deg) rotateY(-6.125deg)'));
  assert.ok(hover.pose.includes('rotateX(0deg) rotateY(0deg)'));
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
