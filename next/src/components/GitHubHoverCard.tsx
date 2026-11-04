"use client";

import {cloneElement,useEffect,useId,useRef,useState} from 'react';
import type {ReactElement} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import type {ContributionsPayload} from '@/types/api';
import {compactContributionWeeks,loadHoverContributions} from './githubHoverCalendar';
import styles from './GitHubHoverCard.module.css';

const colors=['#f0f1f0','#a4e9b1','#55c974','#2da44e','#216e39'];
const monthFormatter=new Intl.DateTimeFormat('en-US',{month:'short',timeZone:'UTC'});

export default function GitHubHoverCard({children}:{children:ReactElement<{'aria-describedby'?:string}>}){
  const [open,setOpen]=useState(false);
  const [data,setData]=useState<ContributionsPayload|null>(null);
  const [failed,setFailed]=useState(false);
  const [below,setBelow]=useState(false);
  const root=useRef<HTMLSpanElement>(null);
  const hovered=useRef(false),focused=useRef(false);
  const closeTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const openTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const reduced=useReducedMotion();
  const id=useId();
  const weeks=compactContributionWeeks(data?.contributions??[]);

  useEffect(()=>{
    let active=true;
    // Warm the original endpoint after first paint, not on the hover path.
    const timer=setTimeout(()=>{void loadHoverContributions().then(payload=>{if(active){setData(payload);setFailed(false);}}).catch(()=>{if(active)setFailed(true);});},700);
    return()=>{active=false;clearTimeout(timer);clearTimeout(closeTimer.current);clearTimeout(openTimer.current);};
  },[]);

  useEffect(()=>{
    if(!open)return;
    const dismiss=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){clearTimeout(closeTimer.current);clearTimeout(openTimer.current);setOpen(false);}
    };
    window.addEventListener('keydown',dismiss);
    return()=>window.removeEventListener('keydown',dismiss);
  },[open]);

  const show=(delay=0)=>{
    setBelow((root.current?.getBoundingClientRect().top??300)<240);
    clearTimeout(closeTimer.current);clearTimeout(openTimer.current);
    if(delay&&!open)openTimer.current=setTimeout(()=>setOpen(true),delay);else setOpen(true);
    if(!data)void loadHoverContributions().then(payload=>{setData(payload);setFailed(false);}).catch(()=>setFailed(true));
  };
  const hide=()=>{
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current=setTimeout(()=>{if(!hovered.current&&!focused.current)setOpen(false);},100);
  };
  return <span ref={root} className={styles.anchor}
    onPointerEnter={event=>{if(event.pointerType==='touch'||!window.matchMedia('(hover: hover)').matches)return;hovered.current=true;show(100);}}
    onPointerLeave={()=>{hovered.current=false;hide();}}
    onFocusCapture={event=>{if(event.target.matches(':focus-visible')){focused.current=true;show();}}}
    onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget)){focused.current=false;hide();}}}>
    {cloneElement(children,{'aria-describedby':open?id:undefined})}
    <AnimatePresence>
      {open&&<motion.span id={id} role="tooltip" aria-label="Jaimin Jariwala's GitHub activity" className={styles.card} data-below={below||undefined}
        initial={{opacity:0,y:8,scale:.96,filter:reduced?'none':'blur(8px)'}}
        animate={{opacity:1,y:0,scale:1,filter:'blur(0px)'}}
        exit={{opacity:0,y:4,scale:.98,filter:reduced?'none':'blur(6px)'}}
        transition={{duration:reduced?0:.18,ease:[.22,1,.36,1]}}>
        <motion.span className={styles.calendarReveal} initial={{height:0}} animate={{height:140}}
          transition={{duration:reduced?0:.34,delay:reduced?0:.07,ease:[.22,1,.36,1]}}>
          {failed&&!data?<span className={styles.unavailable}>GitHub activity is temporarily unavailable.</span>:<svg className={styles.calendar} viewBox="0 0 269 135" role="img" aria-label={data?'Recent GitHub contributions':'Loading GitHub contributions'}>
            {weeks.map((week,column)=>{
              const first=week.find(day=>day!==null);
              const previous=weeks[column-1]?.find(day=>day!==null);
              return <g key={column}>
                {first&&(column===0||first.date.slice(0,7)!==previous?.date.slice(0,7))&&column<16&&<text x={column*16} y="10">{monthFormatter.format(new Date(`${first.date}T00:00:00Z`))}</text>}
                {week.map((day,row)=>day&&<motion.rect key={day.date} x={column*16} y={23+row*16} width="13" height="13" rx="3"
                  fill={colors[Math.max(0,Math.min(4,day.level))]} stroke="#00000008" strokeWidth=".6"
                  initial={{opacity:0,scale:.65,filter:reduced?'none':'blur(2px)'}} animate={{opacity:1,scale:1,filter:'blur(0px)'}}
                  transition={{duration:reduced?0:.24,delay:reduced?0:.12+column*.018+row*.008}}>
                  <title>{day.count} contributions on {day.date}</title>
                </motion.rect>)}
              </g>;
            })}
            {!data&&Array.from({length:17},(_,column)=>Array.from({length:7},(_,row)=><rect key={`${column}-${row}`} x={column*16} y={23+row*16} width="13" height="13" rx="3" fill={colors[0]}/>))}
          </svg>}
        </motion.span>
        <span className={styles.profile}>
          {/* Same local portrait used by the previous portfolio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/my-profile-1.png" width="40" height="40" alt=""/>
          <span className={styles.identity}><span className={styles.name}>Jaimin <span className={styles.handle}>jaiminjariwala</span></span><span className={styles.description}>Software engineer. Building products and tools.</span></span>
        </span>
      </motion.span>}
    </AnimatePresence>
  </span>;
}
