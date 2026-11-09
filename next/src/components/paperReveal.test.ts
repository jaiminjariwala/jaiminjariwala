import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./PaperPeel.tsx',import.meta.url),'utf8');

test('incoming stamp stays printed on the paper without a second positioning animation',()=>{
  assert.ok(source.includes('engine.updateUndersideInk(ink)'));
  assert.ok(!source.includes('arrivalActive'));
  assert.ok(!source.includes('data-stamp-arrival'));
  assert.ok(!source.includes('drawStampArrival'));
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(css.includes('.homeStamp{transition:none}'));
});

test('GPU rendering skips full-page fallback canvas clearing and caps desktop fill cost',()=>{
  assert.ok(source.indexOf('engine.paint(frame')<source.indexOf('ctx.clearRect(0,0,w,s.renderHeight)'));
  assert.ok(source.includes('window.innerWidth<=760?1.25:1.5'));
});
