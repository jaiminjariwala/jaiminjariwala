import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const source=readFileSync(new URL('./PortfolioV2.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
const artwork=new URL('../../public/images/skills-pencil-transparent.png',import.meta.url);

test('Skills uses the supplied pencil illustration on white scalloped paper',()=>{
  assert.ok(source.includes('if(kind==="skills")return <Image'));
  assert.ok(source.includes('src="/images/skills-pencil-transparent.png"'));
  assert.ok(source.includes('<StampRim/><StampArt kind="skills"/>'));
  assert.ok(source.includes('sizes="(max-width: 760px) 50vw, 183px"'));
  assert.ok(css.includes('.stamp .skillsArtwork{left:10%;top:10%;width:80%;height:80%;object-fit:contain;mix-blend-mode:normal}'));
});

test('Skills stays upcoming without a misleading navigation action or faded artwork',()=>{
  assert.ok(source.includes('<div className={`${styles.stamp} ${styles.skillsStamp}`} aria-label="Skills (adding soon)"'));
  assert.ok(!source.includes('navigate("skills")'));
  assert.ok(!source.includes('${styles.stamp} ${styles.locked}'));
});

test('the Skills asset contains genuine alpha transparency, not a cream rectangle',async()=>{
  const sharp=require('sharp');
  const buffer=readFileSync(artwork);
  const metadata=await sharp(buffer).metadata();
  const stats=await sharp(buffer).stats();
  assert.ok(metadata.hasAlpha);
  assert.equal(stats.channels[3].min,0);
  assert.equal(stats.channels[3].max,255);
  assert.ok(stats.channels[3].mean<180,'the background must be mostly transparent');
  const {data,info}=await sharp(buffer).raw().toBuffer({resolveWithObject:true});
  for(const [x,y] of [[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]]){
    assert.equal(data[(y*info.width+x)*info.channels+info.channels-1],0,'each outer corner is transparent');
  }
});
