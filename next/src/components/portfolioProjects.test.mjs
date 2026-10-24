import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {portfolioProjects} from './portfolioProjects.mjs';
import {projectFramePath,videoPosition,videoTime} from './projectMedia.mjs';

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
  assert.ok(!portfolioProjects[2].description.includes('so I can understand what each request actually does'));
});

test('Projects uses the existing roll navigation while Skills stays upcoming',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('aria-label="Open projects" onClick={()=>navigate("projects")}'));
  assert.ok(source.includes('{page==="projects"&&<PortfolioV2Projects/>}'));
  assert.ok(source.includes('aria-label="Skills (adding soon)"'));
  assert.ok(!source.includes('Projects (adding soon)'));
});

test('Projects restores the original folder drawing in lavender on both stamp sizes',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(source.includes('if(kind==="projects")return <svg className={styles.projectsArtwork} viewBox="0 0 200 200"'));
  assert.ok(source.includes('fill="#c9bdf8" stroke="#9e89d8"'));
  assert.ok(source.includes('fill="#b8a5ee" stroke="#9e89d8"'));
  assert.ok(source.includes('<g stroke="#125cd6" strokeWidth="5">'));
  assert.ok(source.includes('m80 94-19 18 19 17m42-34 19 17-19 18m-14-40-13 45'));
  assert.ok(css.includes('.stamp .projectsArtwork,.homeStamp .projectsArtwork{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'));
  assert.ok(!source.includes('src="/images/projects-computer-red.png"'));
});

test('Projects keeps its white scalloped paper without a noisy or colored border',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(source.includes('<StampRim/><StampArt kind="projects"/>'));
  assert.ok(!source.includes('projectsStampMask'));
  assert.ok(!css.includes('background:#e11931'));
  assert.ok(!source.includes('stampArtworkEdge'),'do not apply the textured fade to Projects');
});

test('Projects stamps tilt right without changing the other stamp rotations',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(source.includes('className={`${styles.stamp} ${styles.projectsStamp}`} aria-label="Open projects"'));
  assert.ok(source.includes('page==="projects"?styles.projectsStamp:""'));
  assert.ok(css.includes('.stamp.projectsStamp,.homeStamp.projectsStamp{transform:rotate(4deg)}'));
});

test('project galleries preserve mobile framing and avoid automatic video playback',()=>{
  const source=readFileSync(new URL('./PortfolioV2Projects.jsx',import.meta.url),'utf8');
  const player=readFileSync(new URL('./ProjectVideoPlayer.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(player.includes('playsInline preload="metadata"'));
  assert.ok(!player.includes('autoPlay'));
  assert.ok(!player.includes(' controls playsInline'));
  assert.ok(source.includes('key={item.src}'));
  assert.ok(source.includes('aria-pressed={i===index}'));
  assert.ok(source.includes('entry.borderBoxSize[0]'));
  assert.ok(css.includes('.projectMediaFrame{padding:20px;filter:none}'));
  assert.ok(css.includes('overscroll-behavior-x:contain'));
});

test('project paper uses inward semicircular cutouts at both phone and desktop sizes',()=>{
  for(const [width,height] of [[316,213],[720,480],[980,640]]){
    const path=projectFramePath(width,height);
    assert.ok(path.startsWith('M'));
    assert.ok(path.endsWith(' Z'));
    assert.ok(!/NaN|Infinity/.test(path));
    assert.equal((path.match(/ A/g)||[]).length,2*Math.round(width/16)+2*Math.round(height/16));
    assert.ok(!path.includes(' 0 0 1 '),'arcs must cut into the paper, not protrude outside it');
  }
});

test('video seek clamps invalid and out-of-range media times',()=>{
  assert.equal(videoPosition(3,5),3);
  assert.equal(videoPosition(8,5),5);
  assert.equal(videoPosition(-1,5),0);
  assert.equal(videoPosition(2,0),0);
  assert.equal(videoPosition(NaN,5),0);
  assert.equal(videoPosition(1,Infinity),0);
  assert.equal(videoTime(65.99),'1:05');
  assert.equal(videoTime(NaN),'0:00');
});

test('floating controls support playback, keyboard seek, fullscreen, and cleanup',()=>{
  const source=readFileSync(new URL('./ProjectVideoPlayer.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
  assert.ok(source.includes('type="range"'));
  assert.ok(source.includes('aria-valuetext='));
  assert.ok(source.includes('video.current.currentTime=next'));
  assert.ok(source.includes('onEnded={()=>setPlaying(false)}'));
  assert.ok(source.includes('requestFullscreen()'));
  assert.ok(source.includes('webkitEnterFullscreen()'));
  assert.ok(source.includes('element.pause();'));
  assert.ok(css.includes('background:#fff;border-radius:999px'));
  assert.ok(css.includes('.projectVideoPlayer:fullscreen'));
});
