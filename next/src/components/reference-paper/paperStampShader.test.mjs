import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withSurfaceStamp} from './paperStampShader.mjs';

test('stationary and rolled stamp ink share one mesh without blanking the article',()=>{
  const source=readFileSync(new URL('./pageEngine.js',import.meta.url),'utf8');
  const patched=withSurfaceStamp(source);
  assert.ok(patched.includes('if(materialDepth<0.0){'));
  assert.ok(!patched.includes('alpha*=stationaryInk.a'));
  assert.ok(patched.includes('f32(ij.x)-24.0'));
  assert.ok(!patched.includes('o.original/p.size'));
});
test('unrolling reveals the DOM photo before presenting the receding roll',()=>{
  const source=readFileSync(new URL('../PaperPeel.jsx',import.meta.url),'utf8');
  const reveal=source.indexOf('if(s.velocity>0)callbacks.current.onClipChange(clip,progress);');
  assert.ok(reveal>=0);
  assert.ok(reveal<source.indexOf('engine.paint(frame'));
  assert.ok(source.includes('foldDistance-2'));
});
test('unexpected renderer changes fail explicitly instead of silently duplicating the stamp',()=>{
  assert.throws(()=>withSurfaceStamp('unrecognized shader'),/source changed/);
});

test('mobile tip droop changes world depth rather than the camera tilt',()=>{
  const source=readFileSync(new URL('./pageEngine.js',import.meta.url),'utf8');
  const peel=readFileSync(new URL('../PaperPeel.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('z-=min(p.tipAngle*p.gu'));
  assert.ok(source.includes('i.tipDropGu??0'));
  assert.ok(peel.includes('materialSettings.tipDropGu=mobile?.85:0'));
  assert.ok(!peel.includes('mobile?12:'));
});

test('colored undersheets do not leave a hairline at the white attachment',()=>{
  const source=readFileSync(new URL('./pageEngine.js',import.meta.url),'utf8');
  assert.ok(source.includes('if(o.layer<${r}u){'));
  assert.ok(source.includes('alpha*=smoothstep(p.pixelSize*2.0,max(p.gu*0.65,p.pixelSize*4.0),materialDepth)'));
  assert.ok(source.indexOf('alpha*=smoothstep(p.pixelSize*2.0')<source.indexOf('if(alpha<0.001){discard;}'));
});

test('stamp capture resets absolute offsets and restores visibility only on the clone',()=>{
  const source=readFileSync(new URL('../PaperPeel.jsx',import.meta.url),'utf8');
  assert.ok(source.includes("position:'relative',top:'0px',left:'0px'"));
  assert.ok(source.includes("transition:'none',opacity:'1'"));
  assert.ok(source.includes("if(stamp)stamp.style.opacity=''"));
});
