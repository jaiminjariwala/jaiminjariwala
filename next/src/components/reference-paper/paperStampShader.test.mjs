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

test('rolled sheets meet at zero height without a synthetic crease shadow',()=>{
  const source=readFileSync(new URL('./pageEngine.js',import.meta.url),'utf8');
  assert.ok(source.includes('let contactLift=smoothstep(0.0,p.gu*2.0,max(0.0,distance))'));
  assert.ok(source.includes('offset*cos(theta))*contactLift'));
  assert.ok(source.includes('x=-distance;z=0.0;theta=0.0;'));
  assert.ok(source.includes('seam*(0.022/0.03)),0.0,p.rollAngle>0.0001)'));
  assert.ok(!source.includes('alpha*=smoothstep(p.pixelSize*2.0'));
});

test('stamp capture resets absolute offsets and restores visibility only on the clone',()=>{
  const source=readFileSync(new URL('../PaperPeel.jsx',import.meta.url),'utf8');
  assert.ok(source.includes("position:'relative',top:'0px',left:'0px'"));
  assert.ok(source.includes("transition:'none',opacity:'1'"));
  assert.ok(source.includes("if(stamp)stamp.style.opacity=''"));
});

test('mobile scroll keeps document clipping and the GPU viewport stable',()=>{
  const peel=readFileSync(new URL('../PaperPeel.jsx',import.meta.url),'utf8');
  const engine=readFileSync(new URL('./pageEngine.js',import.meta.url),'utf8');
  assert.ok(peel.includes('stationaryPaperPolygon(w,paperHeight,right,s.originY??inset'));
  assert.ok(!peel.includes('p.y+window.scrollY-inset'));
  assert.ok(peel.includes("s.width===window.innerWidth&&s.height&&window.matchMedia('(pointer: coarse)').matches"));
  assert.ok(peel.includes('viewportHeight:()=>state.current.height'));
  assert.ok(engine.includes('r.viewportHeight?.()??innerHeight'));
  assert.ok(peel.includes('if(state.current.dragging||state.current.open)update()'));
});

test('photos reveal once and avoid filter churn on touch devices',()=>{
  const entrance=readFileSync(new URL('../usePhotoEntrance.js',import.meta.url),'utf8');
  const css=readFileSync(new URL('../PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(entrance.includes('if(!entry.isIntersecting)continue'));
  assert.ok(entrance.includes('observer.unobserve(card)'));
  assert.ok(entrance.includes('if(!touch)card.style.setProperty'));
  assert.ok(css.includes('@media(hover:none) and (pointer:coarse){.photoPrint{filter:none;transition:none}'));
});
