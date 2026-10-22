"use client";

import {useEffect,useRef} from "react";
import {animate} from "framer-motion";

// Match the folders' soft scale-and-blur spring without replacing the
// photograph's resting rotation or its paper-frame shadow.
export default function usePhotoEntrance(){
  const ref=useRef(null);
  useEffect(()=>{
    const card=ref.current;
    if(!card||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const touch=window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    let progress=0,animation;
    const render=value=>{
      progress=Math.max(0,Math.min(1,value));
      const remaining=1-progress;
      card.style.opacity=String(progress);
      card.style.scale=String(1-remaining*.25);
      if(!touch)card.style.setProperty('--entrance-blur',`${remaining**3*60}px`);
    };
    render(0);
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        // Reveal each print once. Swiping it out of view must not restart
        // blur/scale compositing every time it crosses the scrollport edge.
        observer.unobserve(card);
        animation?.stop();
        const visibleSiblings=Array.from(card.parentElement.children).filter(el=>{
          const box=el.getBoundingClientRect();
          return box.right>0&&box.left<window.innerWidth;
        });
        animation=animate(progress,1,{
          type:'spring',stiffness:85,damping:18,mass:1,
          delay:entry.isIntersecting?Math.max(0,visibleSiblings.indexOf(card))*.12:0,
          onUpdate:render,
          onComplete:()=>{card.style.removeProperty('opacity');card.style.removeProperty('scale');card.style.removeProperty('--entrance-blur');},
        });
      }
    },{threshold:.15,rootMargin:'0px 0px -8% 0px'});
    observer.observe(card);
    return()=>{observer.disconnect();animation?.stop();card.style.removeProperty('opacity');card.style.removeProperty('scale');card.style.removeProperty('--entrance-blur');};
  },[]);
  return ref;
}
