import test from 'node:test';
import assert from 'node:assert/strict';
import {paperReleaseOpens} from './paperMotion.mjs';
import {paperDragPose,stationaryPaperPolygon,RESTING_PAPER_ANGLE,nearestPaperAngle,paperRollGrabPolygon,paperOpenK,restingPaperK,paperDragUpperK} from './paperDragGeometry.mjs';

test('mobile finishes flat without a dog-ear while desktop keeps its corner curl',()=>{
  for(const width of [320,375,390,393,430,640,700,760]){
    const inset=width<640?12:16;
    assert.equal((width-2*inset-restingPaperK(width))/Math.SQRT2,0);
    assert.equal(paperDragUpperK(width),restingPaperK(width),'dragging can reach the flat mobile endpoint');
  }
  for(const width of [768,1280,1493]){
    assert.equal(restingPaperK(width),width-32-Math.min(180,width*.17));
    assert.equal(paperDragUpperK(width),width-70);
  }
  const narrowDesktopPaper=768*.93+16;
  assert.equal(restingPaperK(narrowDesktopPaper,768),narrowDesktopPaper-32-Math.min(180,narrowDesktopPaper*.17),'a desktop gutter must not misclassify a narrow desktop window as a phone');
  assert.equal(paperDragUpperK(narrowDesktopPaper,768),narrowDesktopPaper-70);
});

test('fully open roll clears every corner on desktop and mobile for all grab edges',()=>{
  for(const [w,h,inset] of [[1494,1664,16],[1300,900,16],[390,844,12]]){
    for(const [x,y,angle] of [[w-inset,inset,RESTING_PAPER_ANGLE],[inset,h/2,Math.PI],[w-inset,h/2,0],[w/2,inset,Math.PI/2],[w/2,h-inset,-Math.PI/2]]){
      const distance=(w-inset*2-paperOpenK(w,h,x,y,angle,inset))/Math.SQRT2;
      for(const [cx,cy] of [[inset,inset],[w-inset,inset],[inset,h-inset],[w-inset,h-inset]]){
        const depth=(cx-x)*-Math.cos(angle)+(cy-y)*Math.sin(angle);
        assert.ok(distance-depth>=99.999,'roll and shadow must clear all stamps');
      }
    }
  }
});

test('collection stop follows the stamp corner instead of empty viewport space',()=>{
  const bounds={left:145,top:100,right:1335,bottom:675};
  const args=[1493,1112,1477,16,RESTING_PAPER_ANGLE,16];
  const stop=paperOpenK(...args,{bounds,clearance:160});
  const distance=(1493-32-stop)/Math.SQRT2;
  const busCornerDepth=(bounds.left-1477)*-Math.cos(RESTING_PAPER_ANGLE)+(bounds.bottom-16)*Math.sin(RESTING_PAPER_ANGLE);
  assert.ok(Math.abs(distance-busCornerDepth-160)<1e-8);
  assert.ok(stop>paperOpenK(...args),'stop must be earlier than the viewport corner');
  assert.equal(stop,paperOpenK(1493,2000,1477,16,RESTING_PAPER_ANGLE,16,{bounds,clearance:160}));
});

test('sideways steering changes the roll angle, not only its travel',()=>{
  const left=paperDragPose(300,RESTING_PAPER_ANGLE,-300,0);
  const down=paperDragPose(300,RESTING_PAPER_ANGLE,0,300);
  assert.ok(left.angle<RESTING_PAPER_ANGLE);
  assert.ok(down.angle>RESTING_PAPER_ANGLE);
  assert.ok(Math.abs(left.distance-down.distance)<1e-9);
});
test('diagonal pulls preserve the original axis and radial travel',()=>{
  const pose=paperDragPose(300,RESTING_PAPER_ANGLE,-200,200);
  assert.ok(Math.abs(pose.angle-RESTING_PAPER_ANGLE)<1e-9);
  assert.ok(Math.abs(pose.distance-(300+130*Math.SQRT2))<1e-9);
});
test('stationary clipping follows vertical, horizontal, and diagonal axes',()=>{
  for(const angle of [0,.2,RESTING_PAPER_ANGLE,1.4,Math.PI/2]){
    const points=stationaryPaperPolygon(1300,2000,1284,16,300,angle);
    assert.ok(points.length>=3);
    points.forEach(p=>assert.ok((p.x-1284)*-Math.cos(angle)+(p.y-16)*Math.sin(angle)>=300-1e-7));
  }
});

test('steering can tilt past vertical and horizontal without clamping',()=>{
  assert.ok(paperDragPose(100,RESTING_PAPER_ANGLE,200,200).angle>Math.PI/2);
  assert.ok(paperDragPose(100,RESTING_PAPER_ANGLE,-200,-200).angle<0);
});
test('angle wrapping follows the short path and origin remains finite',()=>{
  const wrapped=nearestPaperAngle(-Math.PI+.01,Math.PI-.01);
  assert.ok(Math.abs(wrapped-(Math.PI+.01))<1e-9);
  const atOrigin=paperDragPose(100,0,100/.65,0);
  assert.equal(atOrigin.angle,0);
  assert.ok(atOrigin.distance>=1);
});
test('the grab strip follows the current crease for every steering direction',()=>{
  for(const angle of [-.1,.1,RESTING_PAPER_ANGLE,1.7]){
    const polygon=paperRollGrabPolygon(1300,900,1284,16,300,angle);
    assert.ok(polygon.length>=3);
    polygon.forEach(p=>{
      const depth=(p.x-1284)*-Math.cos(angle)+(p.y-16)*Math.sin(angle);
      assert.ok(Math.abs(depth-300)<=90+1e-7);
    });
  }
});

test('a short closing pull commits smoothly while a tiny nudge stays open',()=>{
  const width=1285,height=924,opened=-height*.48,closed=width-32-150;
  const start=(width-32-opened)/Math.SQRT2;
  const intent=delta=>width-32-paperDragPose(start,RESTING_PAPER_ANGLE,delta,-delta,{gain:2,stopAtOrigin:true}).distance*Math.SQRT2;
  assert.equal(paperReleaseOpens(true,intent(110),closed,opened),false);
  assert.equal(paperReleaseOpens(true,intent(15),closed,opened),true);
});
test('long closing pulls stop flat instead of rolling backwards',()=>{
  const pose=paperDragPose(1200,RESTING_PAPER_ANGLE,1500,-1500,{gain:2,stopAtOrigin:true});
  assert.equal(pose.distance,1);
  assert.equal(pose.angle,RESTING_PAPER_ANGLE);
});
