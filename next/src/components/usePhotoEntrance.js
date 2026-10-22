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
    let progress=0,animation;
    const render=value=>{
      progress=Math.max(0,Math.min(1,value));
      const remaining=1-progress;
      card.style.opacity=String(progress);
      card.style.scale=String(1-remaining*.25);
      card.style.setProperty('--entrance-blur',`${remaining**3*60}px`);
    };
    render(0);
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        animation?.stop();
        const visibleSiblings=Array.from(card.parentElement.children).filter(el=>{
          const box=el.getBoundingClientRect();
          return box.right>0&&box.left<window.innerWidth;
        });
        animation=animate(progress,entry.isIntersecting?1:0,{
          type:'spring',stiffness:85,damping:18,mass:1,
          delay:entry.isIntersecting?Math.max(0,visibleSiblings.indexOf(card))*.12:0,
          onUpdate:render,
        });
      }
    },{threshold:.15,rootMargin:'0px 0px -8% 0px'});
    observer.observe(card);
    return()=>{observer.disconnect();animation?.stop();card.style.removeProperty('opacity');card.style.removeProperty('scale');card.style.removeProperty('--entrance-blur');};
  },[]);
  return ref;
}
