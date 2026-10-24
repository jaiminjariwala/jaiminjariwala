import test from 'node:test';
import assert from 'node:assert/strict';
import {PAPER_HINT_KEY,paperHintPose,paperHintPull,paperHintSeen,rememberPaperHint} from './paperHint.ts';
import {paperReleaseOpens} from './paperMotion.ts';

test('hint fades in open, grips, tugs, releases, then disappears',()=>{
  assert.equal(paperHintPose(0).opacity,0);
  assert.equal(paperHintPose(450).grip,0);
  assert.equal(paperHintPose(850).grip,1);
  assert.equal(paperHintPose(850).pull,0);
  assert.equal(paperHintPose(1700).pull,1);
  assert.equal(paperHintPose(2100).grip,0);
  assert.equal(paperHintPose(2100).pull,0);
  assert.equal(paperHintPose(2900).opacity,0);
  assert.equal(paperHintPose(2900).done,true);
});

test('hint never reaches the full-opening threshold on phone or desktop',()=>{
  for(const [width,closed,opened] of [[390,180,-700],[1493,1281,-900],[320,136,-100]]){
    const pull=paperHintPull(width,closed,opened);
    assert.ok(pull>0);
    assert.ok(pull/(closed-opened)<=.12);
    assert.equal(paperReleaseOpens(false,closed-pull,closed,opened),false);
  }
});

test('first-visit marker persists and unavailable storage is safe',()=>{
  const values=new Map<string,string>();
  const storage={getItem:(key:string)=>values.get(key),setItem:(key:string,value:string)=>{values.set(key,value);}};
  assert.equal(paperHintSeen(storage),false);
  rememberPaperHint(storage);
  assert.equal(values.get(PAPER_HINT_KEY),'1');
  assert.equal(paperHintSeen(storage),true);
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.equal(paperHintSeen(blocked),false);
  assert.doesNotThrow(()=>rememberPaperHint(blocked));
});
