"use client";

import { useCallback, useEffect, useRef } from "react";
import { clipHalfPlane, scallopedOutline, PAGE_SCALLOP_PERIOD } from "./paperGeometry";
import styles from "./PortfolioV2.module.css";
import referenceMath from "./reference-paper/paperMath";
import { isPaperSettled, stepPaperSpring, paperReleaseOpens } from "./paperMotion.mjs";
import {paperHintPose,paperHintPull,paperHintSeen,rememberPaperHint} from "./paperHint.mjs";
import {paperScrollY} from './paperScroll.mjs';
import {preventPaperNativeTouch} from './paperTouch.mjs';
import { RESTING_PAPER_ANGLE, paperDragPose, stationaryPaperPolygon, nearestPaperAngle, paperRollGrabPolygon, paperOpenK, restingPaperK } from "./paperDragGeometry.mjs";

const PAPER_COLORS={
  standard:['#ffffff','#37af73','#007dfe','#c19f85','#ffffff'],
  gallery:['#ffffff','#e63a3b','#5ac561','#2050eb','#ffffff'],
};
const colorsFor=variant=>variant==='gallery'?PAPER_COLORS.gallery:PAPER_COLORS.standard;

function openPaperK(s){
  const inset=s.width<640?12:16;
  const stamps=Array.from(document.querySelectorAll('[aria-label="Stamp collection"] [data-stamp-item]'),stamp=>stamp.getBoundingClientRect());
  const bounds=stamps.length?{
    left:Math.min(...stamps.map(r=>r.left)),right:Math.max(...stamps.map(r=>r.right)),
    top:Math.min(...stamps.map(r=>r.top))+window.scrollY,bottom:Math.max(...stamps.map(r=>r.bottom))+window.scrollY,
  }:undefined;
  // The visible cylinder reaches back from its mathematical crease. Leave
  // room for that face so the stop clears the stamp rim, not only its center.
  return paperOpenK(s.width,s.height,s.originX??s.width-inset,s.originY??inset,s.restAngle??RESTING_PAPER_ANGLE,inset,{bounds,clearance:bounds?160:100});
}

// The page is rolled about a diagonal axis, not warped as a flat triangle.
// Paper distance becomes an angle on a shallow spiral. Small material strips
// are depth sorted, so successive turns correctly hide one another.
export default function PaperPeel({ open, onOpenChange, onClipChange, onSettled, onContentReady, variant="intro" }) {
  const canvas = useRef(null);
  const gpuCanvas = useRef(null);
  const gpu = useRef(null);
  const engineReady = useRef(Promise.resolve(null));
  const variantRef = useRef(variant);
  variantRef.current=variant;
  const handle = useRef(null);
  const refreshInk = useRef(null);
  const inkDirty = useRef(false);
  const hintGlove = useRef(null);
  const hintSeen = useRef(false);
  const settings = useRef({ ...referenceMath.GPU_PAPER_DEFAULTS });
  const state = useRef({ width: 0, height: 0, k: 0, target: 0, velocity: 0, angle: RESTING_PAPER_ANGLE, targetAngle: RESTING_PAPER_ANGLE, angularVelocity: 0, plush: 0, dt: 1/60, lastTime: 0, reducedMotion: false, dragging: false, raf: 0, moved: false });
  const callbacks = useRef({ onOpenChange, onClipChange, onSettled, onContentReady });
  useEffect(() => { callbacks.current = { onOpenChange, onClipChange, onSettled, onContentReady }; });

  const notifySettled=()=>{
    const s=state.current;
    if(!s.dragging&&s.k===s.target&&s.angle===s.targetAngle&&s.velocity===0&&s.angularVelocity===0){
      callbacks.current.onSettled?.(s.open);
    }
  };

  const render = useCallback(() => {
    const s = state.current;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !s.width) return;
    const { width: w, height: h, k } = s;
    const inset = w < 640 ? 12 : 16;
    // The paper's corner belongs to the document, not the viewport. Scrolling
    // changes its screen position, never the amount of material being rolled.
    const right = s.originX??w-inset, top = (s.originY??inset)-paperScrollY();
    ctx.clearRect(0, 0, w, h);
    const closedK = restingPaperK(w);
    const openK=openPaperK(s);
    const progress = Math.max(0, Math.min(1, (closedK - k) / (closedK - openK)));
    const angle=gpu.current&&!gpu.current.failed?s.angle:RESTING_PAPER_ANGLE;
    const foldDistance=Math.max(.001,(w-2*inset-k)/Math.SQRT2);
    // Two rasterizers must overlap slightly at the attachment: two separately
    // antialiased half-coverage edges otherwise reveal the white receiver.
    const paperHeight=Math.max(h,document.querySelector('[data-portfolio-paper]')?.offsetHeight||h)+inset;
    // The DOM clip belongs to document space. Recomputing it in viewport
    // coordinates on scroll made Safari repeatedly re-rasterize the mask.
    const remaining = stationaryPaperPolygon(w,paperHeight,right,s.originY??inset,Math.max(0,foldDistance-2),angle);
    const grab=paperRollGrabPolygon(w,h,right,top,foldDistance,angle);
    if(handle.current)handle.current.style.clipPath=grab.length>=3?`polygon(${grab.map(p=>`${p.x}px ${p.y}px`).join(',')})`:'polygon(0 0,0 0,0 0)';
    const clip=`polygon(${remaining.map(p=>`${(p.x-inset).toFixed(2)}px ${(p.y-inset).toFixed(2)}px`).join(",")})`;
    if(gpu.current&&!gpu.current.failed){
      // Keep the DOM cut edge on the last completed GPU pose. The renderer
      // drops submissions when its queue is full; moving the DOM anyway
      // exposes a diagonal seam until the pointer stops and it catches up.
      if(s.paintPending)return;
      const engine=gpu.current;
      const element=document.querySelector('[data-portfolio-paper]');
      const radius=PAGE_SCALLOP_PERIOD/2;
      const frame={docW:w,docH:Math.max(h,element?.offsetHeight||h)+inset,gu:15.4,left:inset+radius,right:w-inset-radius,top:inset+radius,amp:radius,sideAmp:radius,period:PAGE_SCALLOP_PERIOD};
      const materialSettings=settings.current;
      // A very small, speed-dependent compression makes the roll feel padded
      // in motion, then returns to the exact resting radius and shadow shape.
      const mobile=w<640;
      materialSettings.rollRadiusGu=referenceMath.GPU_PAPER_DEFAULTS.rollRadiusGu*(mobile?1.38:1)+s.plush*.16;
      materialSettings.contactShadowStrength=mobile?.105:referenceMath.GPU_PAPER_DEFAULTS.contactShadowStrength;
      materialSettings.castShadowStrength=mobile?.18:referenceMath.GPU_PAPER_DEFAULTS.castShadowStrength;
      materialSettings.castShadowBlurGu=mobile?.5:referenceMath.GPU_PAPER_DEFAULTS.castShadowBlurGu;
      materialSettings.castShadowDistanceGu=mobile?.42:referenceMath.GPU_PAPER_DEFAULTS.castShadowDistanceGu;
      // Lower the free tip in world-space Z while retaining the raised body.
      // This is a material bend, not a screen-space camera tilt.
      materialSettings.tipDropGu=mobile?.85:0;
      materialSettings.rollTiltDeg=referenceMath.GPU_PAPER_DEFAULTS.rollTiltDeg+Math.tanh(s.velocity/1800)*.32;
      const originY=s.originY??inset;
      const nx=-Math.cos(angle),ny=Math.sin(angle);
      const beyond=referenceMath.materialBeyondPaperGrab(right,originY,nx,ny,frame);
      const bend=referenceMath.rollBendAtDistance(foldDistance,frame.gu,materialSettings,beyond);
      const length=Math.max(.001,foldDistance+referenceMath.projectBend(foldDistance,bend)[0]);
      s.paintPending=true;
      const paintedScroll=paperScrollY();
      // Reveal incoming DOM content before the GPU presents a receding roll.
      // Waiting for GPU completion here leaves the newly uncovered band white.
      // Rolling away is the opposite: retain the old flat pixels until done.
      if(s.velocity>0)callbacks.current.onClipChange(clip,progress);
      engine.paint(frame,{stackCornerOffsetGu:.33},right,originY,right+length*nx,originY+length*ny,s.dt,-1);
      engine.whenIdle().then(()=>{
        if(gpu.current!==engine)return;
        s.paintPending=false;
        callbacks.current.onClipChange(clip,progress);
        if(s.k===k&&s.angle===angle)notifySettled();
        if(s.k!==k||s.angle!==angle||paperScrollY()!==paintedScroll)render();
      }).catch(()=>{s.paintPending=false;});
      const stamp=document.querySelector('[data-paper-stamp]');
      if(stamp)stamp.style.opacity='';
      return;
    }
    callbacks.current.onClipChange(clip,progress);
    const stamp=document.querySelector('[data-paper-stamp]');
    if(stamp)stamp.style.opacity='';
    const period = PAGE_SCALLOP_PERIOD;
    const base = scallopedOutline(w - inset * 2, h + 200, period).map(p => ({ x: p.x + inset, y: p.y + top }));
    const trace = points => {
      if (!points.length) return;
      ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
    };

    const root2=Math.SQRT2;
    const layers = variantRef.current==="gallery"?[
      {color:"#ffffff",shift:-18},
      {color:"#e63a3b",shift:-13.5},
      {color:"#5ac561",shift:-9},
      {color:"#2050eb",shift:-4.5},
      {color:"#ffffff",shift:0},
    ]:[
      { color: "#32ab77", shift: -13.5 },
      { color: "#0584eb", shift: -9 },
      { color: "#b6a18a", shift: -4.5 },
      { color: "#fff", shift: 0 },
    ];
    const strips=[];
    layers.forEach(({ color, shift }, index) => {
      // All sheets share one roll axis. Moving each crease independently
      // caused different turn phases and exposed broad wedges of color.
      const line = k+paperScrollY();
      const maxDepth=Math.max(0,(right-top-line)/root2);
      const radius=23.1+maxDepth*.012;
      const pitch=.014;
      const surface=(distance)=>{
        const shrink=Math.max(.02,1-pitch*distance/radius);
        const angle=-Math.log(shrink)/pitch;
        const factor=radius/(1+pitch*pitch);
        return {
          across:factor*(pitch*(1-shrink*Math.cos(angle))+shrink*Math.sin(angle)),
          z:factor*(1-shrink*Math.cos(angle)-pitch*shrink*Math.sin(angle)),
          angle,
        };
      };
      const corner=clipHalfPlane(base,line);
      // Later turns sit inside the first complete coil and are occluded.
      const visibleDepth=Math.min(maxDepth,2*Math.PI*radius);
      for(let distance=0;distance<visibleDepth;distance+=2.5){
        const end=Math.min(visibleDepth,distance+2.65);
        const band=clipHalfPlane(clipHalfPlane(corner,line+distance*root2),line+end*root2,false);
        if(band.length<3)continue;
        const middle=surface((distance+end)/2);
        const points=band.map(p=>{
          const material=Math.max(0,(p.x-p.y-line)/root2);
          const roll=surface(material);
          const tangent=(p.x+p.y)/root2;
          const across=line/root2+roll.across;
          return {x:(tangent+across+shift)/root2,y:(tangent-across-shift)/root2-roll.z*.025};
        });
        const light=.965+.035*Math.cos(middle.angle-.6);
        strips.push({points,z:middle.z+index*.2,color,index,light});
      }
    });
    strips.sort((a,b)=>a.index-b.index||a.z-b.z);
    // A continuous soft contact shadow follows the axis; it is not a second
    // polygon silhouette, which used to make the edge look like a wavy ribbon.
    ctx.save();
    ctx.beginPath();ctx.moveTo(k,0);ctx.lineTo(w,w-k);
    ctx.strokeStyle="rgba(0,0,0,.065)";ctx.lineWidth=20;ctx.filter="blur(9px)";ctx.stroke();
    ctx.restore();
    for(const strip of strips){
      trace(strip.points);
      if(strip.index===layers.length-1){
        const value=Math.round(255*strip.light);
        ctx.fillStyle=`rgb(${value},${value},${value})`;
      }else ctx.fillStyle=strip.color;
      ctx.fill();
    }
    const tip = { x: top + k, y: right - k };
    if (canvas.current) {
      canvas.current.style.setProperty("--tip-x",`${Math.max(0,tip.x)}px`);
      canvas.current.style.setProperty("--tip-y",`${Math.max(0,tip.y)}px`);
    }
    notifySettled();
  }, []);

  useEffect(()=>{
    let cancelled=false;
    // Exactly five sheets: front white, blue, green, red, and one white
    // backing tip. Mesh layers are stored from the backing to the front.
    // Compile both palettes once. Changing pages must not destroy the GPU
    // device, rebuild its pipelines, or fall back to canvas mid-unroll.
    const colors=colorsFor(variantRef.current);
    engineReady.current=import('./reference-paper/pageEngine').then(({createPageEngine})=>createPageEngine(gpuCanvas.current,{colors,palettes:Object.values(PAPER_COLORS),surfaceInk:true,staticPose:true,viewportTop:paperScrollY,viewportHeight:()=>state.current.height||window.innerHeight,settings:()=>settings.current})).then(engine=>{
      if(cancelled){engine.dispose();return null;}
      gpu.current=engine;
      engine.setColors(colorsFor(variantRef.current));
      state.current.paintPending=false;
      if(state.current.ink)engine.updateUndersideInk(state.current.ink);
      gpuCanvas.current.dataset.renderer='reference-webgpu';
      render();
      return engine;
    }).catch(error=>{
      if(gpuCanvas.current){gpuCanvas.current.dataset.renderer='canvas-fallback';gpuCanvas.current.dataset.rendererError=error.message;}
      return null;
    });
    return()=>{cancelled=true;gpu.current?.dispose();gpu.current=null;};
  },[render]);

  useEffect(()=>{
    gpu.current?.setColors(colorsFor(variant));
    render();
  },[variant,render]);

  useEffect(()=>{
    let cancelled=false, revision=0;
    const stamp=document.querySelector('[data-paper-stamp]');
    if(!stamp)return;
    // Print the actual stamp onto the top sheet's material coordinates. The
    // mesh then bends and depth-tests it along with the paper, not as an
    // independently floating DOM overlay. The stationary part stays in DOM.
    const update=async()=>{
      inkDirty.current=false;
      const current=++revision;
      try{
        await document.fonts.ready;
        const {toCanvas}=await import('html-to-image');
        // html-to-image preserves absolute top/left unless explicitly reset.
        // Those page offsets cropped the stamp inside its own 160px texture.
        const image=await toCanvas(stamp,{pixelRatio:2,style:{position:'relative',top:'0px',left:'0px',right:'auto',bottom:'auto',margin:'0px',transform:'none',transition:'none',opacity:'1'},skipAutoScale:true});
        if(cancelled||current!==revision)return;
        const paper=stamp.closest('[data-portfolio-paper]');
        const ink=document.createElement('canvas');
        ink.width=window.innerWidth;
        ink.height=Math.max(window.innerHeight,paper.offsetHeight)+(window.innerWidth<640?12:16);
        const ctx=ink.getContext('2d');
        const width=stamp.offsetWidth,height=stamp.offsetHeight;
        const paperBounds=paper.getBoundingClientRect();
        ctx.save();
        ctx.translate(paperBounds.left+window.scrollX+stamp.offsetLeft+width/2,paperBounds.top+window.scrollY+stamp.offsetTop+height/2);
        const matrix=new DOMMatrix(getComputedStyle(stamp).transform);
        ctx.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f);
        ctx.drawImage(image,-width/2,-height/2,width,height);
        ctx.restore();
        // Photos are printed on the sheet too. Without their ink the white
        // start of the bend looks like a separate strip across the last photo.
        for(const source of paper.querySelectorAll('[data-paper-ink]')){
          const bounds=source.getBoundingClientRect();
          const cards=Array.from(source.children).filter(card=>{const box=card.getBoundingClientRect();return box.right>bounds.left&&box.left<bounds.right;});
          const prints=await Promise.all(cards.map(async card=>({card,image:await toCanvas(card,{
            pixelRatio:1,skipAutoScale:true,
            style:{position:'relative',left:'0px',top:'0px',transform:'none',scale:'1',opacity:'1',filter:'none','--entrance-blur':'0px'},
          })})));
          if(cancelled||current!==revision)return;
          ctx.save();
          ctx.beginPath();ctx.rect(bounds.left+window.scrollX,bounds.top+window.scrollY,bounds.width,bounds.height);ctx.clip();
          for(const {card,image:print} of prints){
            const box=card.getBoundingClientRect(),matrix=new DOMMatrix(getComputedStyle(card).transform);
            ctx.save();ctx.translate(box.left+box.width/2+window.scrollX,box.top+box.height/2+window.scrollY);
            ctx.transform(matrix.a,matrix.b,matrix.c,matrix.d,0,0);
            ctx.drawImage(print,-card.offsetWidth/2,-card.offsetHeight/2,card.offsetWidth,card.offsetHeight);ctx.restore();
          }
          ctx.restore();
        }
        state.current.ink=ink;
        const engine=await engineReady.current;
        if(cancelled||current!==revision)return;
        if(engine&&!engine.failed){
          // Finish the previous submission before replacing the ink texture,
          // then present one incoming-page frame before starting its unroll.
          await engine.whenIdle();
          if(cancelled||current!==revision)return;
          engine.updateUndersideInk(ink);
          render();
          await engine.whenIdle();
          if(cancelled||current!==revision)return;
        }else{render();}
        callbacks.current.onContentReady?.(variant);
      }catch(error){
        console.warn('Paper stamp texture could not be prepared',error);
        if(!cancelled)callbacks.current.onContentReady?.(variant);
      }
    };
    let refreshTimer;
    refreshInk.current=update;
    const schedule=()=>{
      inkDirty.current=true;
      clearTimeout(refreshTimer);
      // Do not rasterize/upload the entire photo strip while a native
      // horizontal swipe is running. Refresh only when a roll needs ink.
      refreshTimer=setTimeout(()=>{if(state.current.dragging||state.current.open)update();},350);
    };
    const paper=stamp.closest('[data-portfolio-paper]');
    const observer=new MutationObserver(schedule);
    observer.observe(paper,{subtree:true,characterData:true,childList:true});
    paper.addEventListener('load',schedule,true);
    paper.addEventListener('scroll',schedule,true);
    window.addEventListener('resize',schedule);
    update();
    return()=>{cancelled=true;refreshInk.current=null;stamp.style.opacity='';clearTimeout(refreshTimer);observer.disconnect();paper.removeEventListener('load',schedule,true);paper.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule);};
  },[variant,render]);

  const animate = useCallback(() => {
    const s=state.current;
    if(s.raf)return;
    s.lastTime=performance.now();
    const tick=now=>{
      s.raf=0;
      s.dt=Math.max(.001,Math.min((now-s.lastTime)/1000,1/24));
      s.lastTime=now;
      if(s.reducedMotion){s.k=s.target;s.angle=s.targetAngle;s.angularVelocity=0;s.velocity=0;s.plush=0;}
      else{
        const turn=stepPaperSpring(s.angle,s.angularVelocity,s.targetAngle,s.dt,s.dragging);
        s.angle=turn.position;s.angularVelocity=turn.velocity;
        if(Math.abs(s.angle-s.targetAngle)<.00001&&Math.abs(s.angularVelocity)<.0001){s.angle=s.targetAngle;s.angularVelocity=0;}
        const spring=stepPaperSpring(s.k,s.velocity,s.target,s.dt,s.dragging);
        s.k=spring.position;s.velocity=spring.velocity;
        const lower=openPaperK(s);
        const upper=s.dragging?s.width-70:restingPaperK(s.width);
        if(s.k<lower||s.k>upper){s.k=Math.max(lower,Math.min(upper,s.k));s.velocity=0;}
        const compression=Math.min(1,Math.abs(s.velocity)/1800);
        s.plush+=(compression-s.plush)*(1-Math.exp(-9*s.dt));
        if(isPaperSettled(s.k,s.velocity,s.target)){
          s.k=s.target;s.velocity=0;
          if(!s.dragging&&!s.open&&s.originX!==undefined){delete s.originX;delete s.originY;delete s.restAngle;s.angle=s.targetAngle=RESTING_PAPER_ANGLE;s.angularVelocity=0;}
        }
      }
      render();
      if(s.k!==s.target||s.velocity!==0||s.angle!==s.targetAngle||s.angularVelocity!==0||s.plush>.001)s.raf=requestAnimationFrame(tick);
    };
    s.raf=requestAnimationFrame(tick);
  },[render]);

  useEffect(()=>{
    const resize=()=>{
      const s=state.current;
      // iOS toolbar expansion changes height during ordinary scrolling.
      // Keep the existing drawing buffer and pose until the width changes.
      if(s.width===window.innerWidth&&s.height&&window.matchMedia('(pointer: coarse)').matches){render();return;}
      s.width=window.innerWidth;
      s.height=window.matchMedia('(pointer: coarse)').matches?Math.max(window.innerHeight,window.screen.height):window.innerHeight;
      s.reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.current.width=s.width*dpr;canvas.current.height=s.height*dpr;
      canvas.current.getContext("2d").setTransform(dpr,0,0,dpr,0,0);
      s.angle=s.targetAngle=RESTING_PAPER_ANGLE;s.angularVelocity=0;
      s.k=s.target=s.open?openPaperK(s):restingPaperK(s.width);
      s.velocity=0;s.plush=0;
      render();
    };
    resize();window.addEventListener("resize",resize);window.addEventListener("scroll",render,{passive:true});
    return()=>{window.removeEventListener("resize",resize);window.removeEventListener("scroll",render);cancelAnimationFrame(state.current.raf);state.current.raf=0;};
  },[render]);

  useEffect(()=>{
    const s=state.current;
    s.open=open;
    if(open&&inkDirty.current)refreshInk.current?.();
    if(!s.width)return;
    if(s.dragging)return;
    s.target=open?openPaperK(s):restingPaperK(s.width);
    s.targetAngle=nearestPaperAngle(s.restAngle??RESTING_PAPER_ANGLE,s.angle);
    animate();
  },[open,animate]);

  useEffect(()=>{
    let storage;
    try{storage=window.localStorage;}catch{/* Continue with in-memory tracking. */}
    if(open||hintSeen.current||paperHintSeen(storage)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let timer,raf=0,stopped=false,running=false,retries=0;
    const glove=hintGlove.current;
    const images=glove?.querySelectorAll('img');
    if(!glove||images.length!==2)return;
    const dismiss=(restore=true)=>{
      if(stopped)return;
      stopped=true;
      clearTimeout(timer);cancelAnimationFrame(raf);
      glove.style.opacity='0';
      if(running){
        const s=state.current;
        s.hintActive=false;
        if(restore&&!s.dragging&&!s.open){s.target=restingPaperK(s.width);animate();}
      }
    };
    const interact=()=>{
      hintSeen.current=true;rememberPaperHint(storage);dismiss();
    };
    const visibility=()=>{if(document.hidden&&running)dismiss();};
    const viewportWidth=window.innerWidth;
    const resize=()=>{if(window.innerWidth!==viewportWidth)interact();};
    const start=()=>{
      const s=state.current;
      if(stopped||s.open||s.dragging||window.scrollY>8)return;
      if(document.hidden){timer=setTimeout(start,250);return;}
      // Let the real curl and its printed texture finish initializing first.
      if((!s.width||s.paintPending||!gpu.current)&&retries++<16){timer=setTimeout(start,200);return;}
      running=true;s.hintActive=true;
      hintSeen.current=true;rememberPaperHint(storage);
      const closed=restingPaperK(s.width),pull=paperHintPull(s.width,closed,openPaperK(s));
      const inset=s.width<640?12:16;
      const cornerReach=s.width-inset*2-closed;
      const x=s.width-inset-cornerReach*.35,y=inset+cornerReach*.35;
      const began=performance.now();
      const tick=now=>{
        if(stopped)return;
        const pose=paperHintPose(now-began);
        const target=closed-pull*pose.pull;
        if(Math.abs(s.target-target)>.01){s.target=target;animate();}
        // Follow the actual spring pose, not a separate pretend drag.
        const travel=Math.max(0,(closed-s.k)/2);
        glove.style.transform=`translate3d(${x-travel-17}px,${y+travel-17}px,0) scale(${.85+.15*pose.opacity})`;
        glove.style.opacity=String(pose.opacity);
        images[0].style.opacity=String(1-pose.grip);
        images[1].style.opacity=String(pose.grip);
        if(pose.done){dismiss();return;}
        raf=requestAnimationFrame(tick);
      };
      raf=requestAnimationFrame(tick);
    };
    timer=setTimeout(start,1400);
    window.addEventListener('pointerdown',interact,{capture:true,passive:true});
    window.addEventListener('keydown',interact,{capture:true});
    window.addEventListener('scroll',interact,{passive:true});
    window.addEventListener('resize',resize,{passive:true});
    document.addEventListener('visibilitychange',visibility);
    return()=>{
      dismiss(false);
      window.removeEventListener('pointerdown',interact,true);
      window.removeEventListener('keydown',interact,true);
      window.removeEventListener('scroll',interact);
      window.removeEventListener('resize',resize);
      document.removeEventListener('visibilitychange',visibility);
    };
  },[open,animate]);

  useEffect(()=>{
    if(!open)return;
    const close=event=>{if(event.key==='Escape'&&!document.querySelector('[aria-modal="true"]'))callbacks.current.onOpenChange(false);};
    window.addEventListener('keydown',close,true);
    return()=>window.removeEventListener('keydown',close,true);
  },[open]);

  useEffect(()=>{
    // Native non-passive listeners are needed here in Safari in addition
    // to touch-action:none. Do not claim touches elsewhere on the page.
    const targets=[handle.current,...document.querySelectorAll('[data-paper-edge]')].filter(Boolean);
    const start=event=>preventPaperNativeTouch(event);
    const move=event=>{if(state.current.dragging)preventPaperNativeTouch(event);};
    for(const target of targets){
      target.addEventListener('touchstart',start,{passive:false});
      target.addEventListener('touchmove',move,{passive:false});
    }
    return()=>{for(const target of targets){target.removeEventListener('touchstart',start);target.removeEventListener('touchmove',move);}};
  },[open]);

  const pointerDown=event=>{
    if(event.isPrimary===false||(event.pointerType==='mouse'&&event.button!==0))return;
    if(event.pointerType==='touch'&&event.cancelable)event.preventDefault();
    const s=state.current;
    if(inkDirty.current)refreshInk.current?.();
    if(event.currentTarget.dataset.paperEdge){
      const edge=event.currentTarget.dataset.paperEdge;
      const inset=s.width<640?12:16;
      const origins={left:[inset,event.clientY+window.scrollY,Math.PI],right:[s.width-inset,event.clientY+window.scrollY,0],top:[event.clientX,inset,Math.PI/2],bottom:[event.clientX,document.querySelector('[data-portfolio-paper]').getBoundingClientRect().bottom+window.scrollY,-Math.PI/2]};
      const [x,y,angle]=origins[edge];
      s.originX=x;s.originY=y;s.restAngle=angle;
      s.k=s.width-2*inset-2*Math.SQRT2;
      s.angle=s.targetAngle=angle;
    }
    document.documentElement.setAttribute('data-paper-dragging','');
    s.dragging=true;s.moved=false;s.startX=event.clientX;s.startY=event.clientY;s.startK=s.k;
    s.pointerId=event.pointerId;
    s.dragOptions={gain:open?2:.65,stopAtOrigin:open};
    s.startAngle=s.angle;
    s.targetAngle=s.angle;
    s.target=s.k;s.velocity*=.35;
    event.currentTarget.setPointerCapture(event.pointerId);
    animate();
  };
  const pointerMove=event=>{
    const s=state.current;
    if(!s.dragging||event.pointerId!==s.pointerId)return;
    if(event.pointerType==='touch'&&event.cancelable)event.preventDefault();
    const dx=event.clientX-s.startX,dy=event.clientY-s.startY;
    s.moved ||= Math.hypot(dx,dy)>5;
    const inset=s.width<640?12:16;
    const pose=paperDragPose((s.width-inset*2-s.startK)/Math.SQRT2,s.startAngle,dx,dy,s.dragOptions);
    s.target=Math.max(openPaperK(s),Math.min(s.width-70,s.width-inset*2-pose.distance*Math.SQRT2));
    s.targetAngle=nearestPaperAngle(pose.angle,s.angle);
    animate();
  };
  const pointerUp=event=>{
    const s=state.current;
    if(event.pointerId!==s.pointerId)return;
    document.documentElement.removeAttribute('data-paper-dragging');
    if(!s.dragging)return;
    const dx=event.clientX-s.startX,dy=event.clientY-s.startY;
    s.moved ||= Math.hypot(dx,dy)>5;
    // The last pointerup can arrive beyond the last coalesced move event.
    const inset=s.width<640?12:16;
    const pose=paperDragPose((s.width-inset*2-s.startK)/Math.SQRT2,s.startAngle,dx,dy,s.dragOptions);
    const intent=Math.max(openPaperK(s),Math.min(s.width-70,s.width-inset*2-pose.distance*Math.SQRT2));
    s.dragging=false;
    if(!s.moved){
      // Claimed touch gestures do not generate the compatibility click.
      // Activate taps here and suppress any browser that still sends one.
      if(event.pointerType==='touch'&&event.currentTarget===handle.current){s.moved=true;callbacks.current.onOpenChange(!open);}
      else if(event.currentTarget.dataset.paperEdge){s.target=open?openPaperK(s):restingPaperK(s.width);animate();}
      return;
    }
    const resting=restingPaperK(s.width);
    const shouldOpen=paperReleaseOpens(open,intent,resting,openPaperK(s));
    callbacks.current.onOpenChange(shouldOpen);
    s.target=shouldOpen?openPaperK(s):resting;
    s.targetAngle=nearestPaperAngle(s.restAngle??RESTING_PAPER_ANGLE,s.angle);
    animate();
  };

  const cancelDrag=()=>{
    document.documentElement.removeAttribute('data-paper-dragging');
    const s=state.current;
    if(!s.dragging)return;
    s.dragging=false;s.moved=true;
    s.target=open?openPaperK(s):restingPaperK(s.width);
    s.targetAngle=nearestPaperAngle(s.restAngle??RESTING_PAPER_ANGLE,s.angle);
    animate();
  };

  useEffect(()=>{
    const clear=()=>{
      document.documentElement.removeAttribute('data-paper-dragging');
      const s=state.current;
      if(s.dragging){s.dragging=false;s.moved=true;s.target=s.open?openPaperK(s):restingPaperK(s.width);s.targetAngle=nearestPaperAngle(RESTING_PAPER_ANGLE,s.angle);animate();}
    };
    window.addEventListener('blur',clear);
    return()=>{window.removeEventListener('blur',clear);state.current.dragging=false;document.documentElement.removeAttribute('data-paper-dragging');};
  },[animate]);

  return <>
    {!open&&['left','right','top','bottom'].map(edge=><div key={edge} data-paper-edge={edge} className={`${styles.paperEdge} ${styles[`paperEdge${edge}`]}`} aria-hidden="true" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}/>)}
    <canvas ref={canvas} className={styles.peelCanvas} aria-hidden="true"/>
    <canvas ref={gpuCanvas} className={styles.peelCanvas} style={{visibility:'hidden',zIndex:7}} aria-hidden="true"/>
    <div ref={hintGlove} data-paper-roll-hint className={styles.rollHintGlove} aria-hidden="true"><img src="/cursors/glove-open.svg" alt="" draggable={false}/><img src="/cursors/glove-grip.svg" alt="" draggable={false}/></div>
    <button ref={handle} data-paper-roll-handle className={styles.peelHandle} style={{inset:0,width:'100vw',height:'100vh',transform:'none',clipPath:'polygon(0 0,0 0,0 0)'}} aria-label={open?'Roll paper closed':'Open stamp collection'} title="Drag the roll in any direction" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();callbacks.current.onOpenChange(!open);}}} onClick={()=>{if(!state.current.moved)callbacks.current.onOpenChange(!open);}}/>
  </>;
}
