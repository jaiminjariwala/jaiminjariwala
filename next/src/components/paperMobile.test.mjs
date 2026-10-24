import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cachedStamp,paperRasterHeight,stampAtPoint,visibleStampBounds} from './paperMobile.mjs';
const {sheetOutline,scallopedOutline,outlineMask}=await import(`data:text/javascript,${encodeURIComponent(readFileSync(new URL('./paperGeometry.js',import.meta.url),'utf8'))}`);

test('mobile sheets retain top/bottom scallops and straight full-width sides',()=>{
  for(const width of [320,390,430,760]){
    const height=1400,points=sheetOutline(width,height,24,false),radius=width/Math.round(width/24)/2;
    assert.ok(points.every(p=>p.y<=radius+.001||p.y>=height-radius-.001));
    assert.ok(Math.abs(Math.min(...points.map(p=>p.x)))<.001);
    assert.ok(Math.abs(Math.max(...points.map(p=>p.x))-width)<.001);
    assert.ok(outlineMask(width,height,24,false).startsWith('url("data:image/svg+xml,'));
  }
  assert.deepEqual(sheetOutline(200,200,25),scallopedOutline(200,200,25),'small stamps keep their four scalloped rims');
});

test('long phone pages do not allocate document-height animation surfaces',()=>{
  assert.equal(paperRasterHeight(390,12000,844),1036);
  assert.equal(paperRasterHeight(760,12000,1024),1216);
  assert.equal(paperRasterHeight(390,700,844),700);
  assert.equal(paperRasterHeight(1440,4000,900),4000,'desktop rendering is unchanged');
  assert.equal(paperRasterHeight(390,4000,844,true),4000,'a bottom-edge grab still renders at its actual document position');
});

test('stamp snapshots share in-flight work and reuse the completed capture',async()=>{
  const cache=new Map();let captures=0;
  const capture=async()=>{captures++;return {image:'work'};};
  const first=cachedStamp(cache,'work:390',capture),second=cachedStamp(cache,'work:390',capture);
  assert.equal(first,second);
  const image=await first;
  assert.equal(await cachedStamp(cache,'work:390',capture),image);
  assert.equal(captures,1);
  await cachedStamp(cache,'work:430',capture);
  assert.equal(captures,2,'a resized stamp gets a new capture');
});

test('failed captures can retry rather than permanently blocking navigation',async()=>{
  const cache=new Map();
  await assert.rejects(cachedStamp(cache,'travel',async()=>{throw new Error('decode failed');}));
  assert.equal(cache.has('travel'),false);
  assert.equal(await cachedStamp(cache,'travel',async()=>42),42);
});

test('a roll grab strip overlapping an exposed stamp routes its tap correctly',()=>{
  const travel={getBoundingClientRect:()=>({left:20,top:100,right:150,bottom:230})};
  const work={getBoundingClientRect:()=>({left:210,top:100,right:340,bottom:230})};
  assert.equal(stampAtPoint([travel,work],260,150),work);
  assert.equal(stampAtPoint([travel,work],70,180),travel);
  assert.equal(stampAtPoint([travel,work],180,350),undefined,'the actual roll remains draggable outside the stamps');
});

test('a long stamp stack keeps the open roll inside the visible collection',()=>{
  const viewport={left:0,right:390,top:12,bottom:832};
  const stack=Array.from({length:6},(_,i)=>({left:74,right:316,top:102+i*286,bottom:344+i*286}));
  assert.deepEqual(visibleStampBounds(stack,viewport),{left:74,right:316,top:102,bottom:832});
  const scrolled=stack.map(r=>({...r,top:r.top-1250,bottom:r.bottom-1250}));
  assert.deepEqual(visibleStampBounds(scrolled,viewport),{left:74,right:316,top:12,bottom:524});
  assert.deepEqual(visibleStampBounds(stack,viewport,50),{left:74,right:316,top:152,bottom:882});
  assert.equal(visibleStampBounds([{left:74,right:316,top:1000,bottom:1242}],viewport),null);
});

test('new selections interrupt navigation instead of being silently ignored',()=>{
  const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
  assert.ok(!source.includes('if(navigation.current)return;'));
  assert.ok(source.includes('onOpenChange={next=>{navigation.current=null;setCollection(next);}}'));
  assert.ok(source.includes('rolledOpen.current=false;'));
});

test('mobile optimizations retain the same GPU renderer and touch gesture boundaries',()=>{
  const source=readFileSync(new URL('./PaperPeel.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('sideAmp:mobileSheet?0:radius'));
  assert.ok(source.includes('pixelRatio:Math.min(window.devicePixelRatio||1,window.innerWidth<=760?1.25:2)'));
  assert.ok(source.includes('const image=await stampImage(variant,stamp);'));
  assert.ok(source.includes('window.requestIdleCallback(prepare'));
  assert.ok(source.includes('if(!s.collectionBounds)'));
  assert.ok(source.includes('if(s.stampTap)'));
  assert.ok(source.includes('tap.stamp.click()'));
  assert.ok(source.includes('s.stampTap.cancelled=true'));
});

test('flat mobile pages clear the curl and stale GPU frames cannot bring it back',()=>{
  const source=readFileSync(new URL('./PaperPeel.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('s.flatMobile=mobileSheet&&!s.open&&!s.dragging&&k===closedK'));
  assert.ok(source.includes("gpu.current?.clear()"));
  assert.ok(source.includes("callbacks.current.onClipChange('none',0)"));
  assert.ok(source.includes('if(s.flatMobile){notifySettled();return;}'));
  assert.ok(source.includes('flatLanding:window.innerWidth<=760&&!s.open&&!s.dragging'));
  assert.ok(source.includes('s.originX=s.width/2;s.originY=inset;s.restAngle=Math.PI/2'));
});
