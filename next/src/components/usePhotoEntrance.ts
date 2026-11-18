"use client";

import {useEffect,useRef} from "react";
import {animate} from "framer-motion";
import type {AnimationPlaybackControls} from 'framer-motion';

// Reveal prints promptly while preserving their resting rotation and shadow.
export default function usePhotoEntrance(){
  const ref=useRef<HTMLAnchorElement>(null);
  useEffect(()=>{
    const card=ref.current;
    if(!card||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const touch=window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    let progress=0,animation:AnimationPlaybackControls|undefined;
    const render=(value:number)=>{
      progress=Math.max(0,Math.min(1,value));
      const remaining=1-progress;
      card.style.opacity=String(.4+progress*.6);
      card.style.scale=String(1-remaining*.06);
      if(!touch)card.style.setProperty('--entrance-blur',`${remaining**3*8}px`);
    };
    render(0);
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        // Reveal each print once. Swiping it out of view must not restart
        // blur/scale compositing every time it crosses the scrollport edge.
        observer.unobserve(card);
        animation?.stop();
        animation=animate(progress,1,{
          duration:.2,
          ease:[.16,1,.3,1],
          onUpdate:render,
          onComplete:()=>{card.style.removeProperty('opacity');card.style.removeProperty('scale');card.style.removeProperty('--entrance-blur');},
        });
      }
    },{threshold:.01,rootMargin:'0px'});
    observer.observe(card);
    return()=>{observer.disconnect();animation?.stop();card.style.removeProperty('opacity');card.style.removeProperty('scale');card.style.removeProperty('--entrance-blur');};
  },[]);
  return ref;
}
