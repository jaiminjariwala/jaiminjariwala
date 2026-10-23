import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {portfolioProjects} from './portfolioProjects.mjs';

test('all three projects use existing local media with real source links',()=>{
  assert.deepEqual(portfolioProjects.map(p=>p.id),['codex-lite','component-library','url-shortener']);
  for(const project of portfolioProjects){
    assert.ok(project.description.length>50);
    for(const link of project.links)assert.equal(new URL(link.href).protocol,'https:');
    for(const item of project.media){
      assert.ok(item.label);
      assert.ok(item.src.startsWith('/'));
      assert.ok(existsSync(new URL(`../../public${item.src}`,import.meta.url)),item.src);
      if(item.poster)assert.ok(existsSync(new URL(`../../public${item.poster}`,import.meta.url)));
    }
  }
  assert.equal(portfolioProjects[0].media.filter(m=>m.type==='video').length,2);
  assert.equal(portfolioProjects[2].links.length,1,'local-only shortener must not advertise a deployed service');
});

test('Projects uses the existing roll navigation while Skills stays upcoming',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('aria-label="Open projects" onClick={()=>navigate("projects")}'));
  assert.ok(source.includes('{page==="projects"&&<PortfolioV2Projects/>}'));
  assert.ok(source.includes('aria-label="Skills (adding soon)"'));
  assert.ok(!source.includes('Projects (adding soon)'));
});

test('project galleries preserve mobile framing and avoid automatic video playback',()=>{
  const source=readFileSync(new URL('./PortfolioV2Projects.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(source.includes('controls playsInline preload="none"'));
  assert.ok(!source.includes('autoPlay'));
  assert.ok(source.includes('key={item.src}'));
  assert.ok(source.includes('aria-pressed={i===index}'));
  assert.ok(source.includes('entry.borderBoxSize[0]'));
  assert.ok(css.includes('.projectMediaFrame{padding:19px;filter:none}'));
  assert.ok(css.includes('overscroll-behavior-x:contain'));
});
