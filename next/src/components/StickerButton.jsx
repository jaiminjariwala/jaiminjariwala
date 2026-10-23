"use client";

import {useEffect,useId,useRef} from 'react';
import {buckleMap,buckleAppearance,stepBuckle} from './stickerBuckle.mjs';
import styles from './PortfolioV2.module.css';

const displacement=buckleMap('displacement'),shading=buckleMap('shading');
const rest=buckleAppearance(1);

export default function StickerButton({children,style,...props}){
  const id=`sticker-${useId().replaceAll(':','_')}`;
  const button=useRef(null),surface=useRef(null),defs=useRef(null),motion=useRef({position:1,velocity:0,target:1,raf:0,last:0,hover:false,focus:false,size:160});
  const paint=amount=>{
    const root=defs.current;if(!root)return;
    const size=motion.current.size,p=buckleAppearance(amount,size);
    surface.current.style.transform=p.pose;
    for(const image of root.querySelectorAll('feImage')){
      const field=image.getAttribute('result')==='ridge';
      image.setAttribute('x',field?size*-.15:0);image.setAttribute('y',field?size*-.15:0);
      image.setAttribute('width',field?size*1.3:size);image.setAttribute('height',field?size*1.3:size);
    }
    root.querySelector('feDisplacementMap').setAttribute('scale',p.scale);
    for(const channel of root.querySelectorAll('feFuncR,feFuncG,feFuncB')){
      channel.setAttribute('slope',p.shade);channel.setAttribute('intercept',1-p.shade);
    }
    const shadow=root.querySelector('feDropShadow');
    shadow.setAttribute('stdDeviation',p.blur);shadow.setAttribute('dx',p.dx);shadow.setAttribute('dy',p.dy);shadow.setAttribute('flood-opacity',p.opacity);
  };
  const animate=()=>{
    const s=motion.current;s.target=s.hover||s.focus?0:1;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      cancelAnimationFrame(s.raf);s.raf=0;s.position=s.target;s.velocity=0;paint(s.position);return;
    }
    if(s.raf)return;
    s.last=performance.now();
    const tick=now=>{
      const next=stepBuckle(s.position,s.velocity,s.target,(now-s.last)/1000);s.last=now;
      s.position=next.position;s.velocity=next.velocity;
      const done=Math.abs(s.position-s.target)<.0004&&Math.abs(s.velocity)<.005;
      if(done){s.position=s.target;s.velocity=0;button.current?.dispatchEvent(new Event('sticker-surface-change',{bubbles:true}));}
      paint(s.position);s.raf=done?0:requestAnimationFrame(tick);
    };
    s.raf=requestAnimationFrame(tick);
  };
  useEffect(()=>{
    const observer=new ResizeObserver(()=>{motion.current.size=button.current.offsetWidth;paint(motion.current.position);});
    observer.observe(button.current);
    return()=>{observer.disconnect();cancelAnimationFrame(motion.current.raf);};
  },[]);
  return <button {...props} ref={button} data-sticker-buckle style={style}
    onClick={event=>{button.current.dispatchEvent(new Event('sticker-surface-change',{bubbles:true}));props.onClick?.(event);}}
    onPointerEnter={event=>{if(event.pointerType==='mouse'&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){motion.current.hover=true;animate();}}}
    onPointerLeave={()=>{motion.current.hover=false;animate();}}
    onFocus={event=>{motion.current.focus=event.currentTarget.matches(':focus-visible');animate();}}
    onBlur={()=>{motion.current.focus=false;animate();}}>
    <svg ref={defs} className={styles.stickerFilterDefs} width="0" height="0" aria-hidden="true">
      <defs><filter id={id} x="-15%" y="-15%" width="130%" height="130%" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feImage href={displacement} x="-24" y="-24" width="208" height="208" preserveAspectRatio="none" result="ridge"/>
        <feDisplacementMap in="SourceGraphic" in2="ridge" scale={rest.scale} xChannelSelector="R" yChannelSelector="G" result="paper"/>
        <feImage href={shading} x="0" y="0" width="160" height="160" preserveAspectRatio="none" result="light"/>
        <feComponentTransfer in="light" result="foldLight">
          <feFuncR type="linear" slope="1" intercept="0"/><feFuncG type="linear" slope="1" intercept="0"/><feFuncB type="linear" slope="1" intercept="0"/>
        </feComponentTransfer>
        <feBlend in="paper" in2="foldLight" mode="multiply" result="shaded"/>
        <feComposite in="shaded" in2="paper" operator="in" result="sticker"/>
        <feDropShadow in="sticker" dx={rest.dx} dy={rest.dy} stdDeviation={rest.blur} floodColor="black" floodOpacity={rest.opacity}/>
      </filter></defs>
    </svg>
    <span ref={surface} className={styles.stickerSurface} style={{transform:rest.pose}}><span data-sticker-deformed className={styles.stickerDeformed} style={{filter:`url(#${id})`}}>{children}</span></span>
  </button>;
}
