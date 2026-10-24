"use client";

import { useEffect, useRef, useState } from "react";
import PortfolioV2Gallery from "./PortfolioV2Gallery";
import PortfolioV2Projects from "./PortfolioV2Projects";
import styles from "./PortfolioV2.module.css";
import PaperPeel from "./PaperPeel";
import StickerButton from './StickerButton';
import {paperViewportWidth} from './paperLayout.mjs';
import {sectionPaths} from '@/lib/siteSeo.mjs';
import { outlineMask, polygonPath, scallopedOutline, PAGE_SCALLOP_PERIOD } from "./paperGeometry";

function ExternalArrow() {
  return <svg className={styles.externalArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>;
}

function StampRim({lobes=8}) {
  const outline=polygonPath(scallopedOutline(200,200,200/lobes));
  return <svg className={styles.stampRim} viewBox="0 0 200 200" aria-hidden="true">
    <path d={outline} fill="white"/>
    <path d={outline} fill="none" stroke="#dededb" strokeWidth=".7" vectorEffect="non-scaling-stroke"/>
  </svg>;
}

const experience = [
  ["The George Washington University", "Graduate Teaching Assistant II", "Present", ["Cloud Computing", "Database Management Systems 2"]],
  ["Amazon", "Design Technologist I Intern (L4)", "June–Aug 2026", null, "Alexa Smart Home Team"],
  ["Logicwind", "AI/ML Intern", "May–Dec 2024"],
];

const education = [
  ["The George Washington University", "Master's in Computer Science", "Aug 2025–May 2027", "GPA: 3.83 / 4.00", "35% tuition scholarship", "Washington D.C."],
  ["Parul University", "Bachelor of Technology in Computer Science and Engineering", "Sep 2020–May 2024", "CGPA: 8.57 / 10", null, "Gujarat, India"],
];

function StampArt({ kind }) {
  if (kind === "car") return <img className={styles.stampArtwork} src="/v2-reference/brownstone-art.png" alt="" aria-hidden="true"/>;
  if (kind === "rocket") return <svg className={styles.rocketArtwork} viewBox="0 0 200 200" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke="#0756ee" strokeWidth="4.8">
      <path d="m31 63 7-2-8 21 15-20-11 27 19-22-14 29 23-26-17 35 25-29-12 29 16-18-2 18 5-3"/>
      <path d="m146 61 7-2-3 17 11-12-4 22 11-10 2 17-1 13"/>
    </g>
    <g stroke="#00b56c" strokeWidth="4.2">
      <path d="m31 144 3-10q2-6 4 3l6-13q3-6 4 6l6-13q3-6 4 9l5-6 3 10 5-8 5 14 5-4 4 8 6-2"/>
      <path d="m137 140 5-9 4 5 5-17q3-6 4 9l5-28q3-9 6 20l3 11q4-12 6-4l5 12"/>
    </g>
    <g stroke="#ff2542" strokeWidth="4.1">
      <path d="M80 80q19-26 41-53 2-4 4 1l20 49q-31 6-65 3Z"/>
      <path d="m94 84 1 78m37-81-2 81m-25-70 1 80m15-78 1 61"/>
      <path d="m101 95 26-1m-26 12 26 1m-25 11 25-1m-16-29 1 57m9-57-1 61"/>
    </g>
  </svg>;
  if(kind==="experience")return <img className={`${styles.stampArtwork} ${styles.experienceArtwork}`} src="/v2-reference/snoopy-experience.png" alt="" aria-hidden="true"/>;
  if(kind==="education")return <svg className={styles.educationArtwork} viewBox="100 190 560 330" aria-hidden="true"><image href="/v2-reference/education-school-bus.png" width="736" height="736"/></svg>;
  if(kind==="projects")return <svg className={styles.projectsArtwork} viewBox="0 0 200 200" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="m34 65 2-22q0-8 9-8l37-1 17 15 54-1q10 0 10 11l3 85q0 9-9 10l-113 1q-9-1-10-11Z" fill="#ffd54b" stroke="#e6b52d" strokeWidth="2"/>
    <path d="m44 49 101 3-2 83-102-2Z" fill="#fffefa" stroke="#e5e2d8" strokeWidth="2"/>
    <path d="m37 72 126 1 7 74q1 10-10 11l-118 1q-10 0-10-11Z" fill="#f9cf43" stroke="#e6b52d" strokeWidth="2"/>
    <g stroke="#125cd6" strokeWidth="5"><path d="m80 94-19 18 19 17m42-34 19 17-19 18m-14-40-13 45"/></g>
  </svg>;
  return <span className={styles.question}>?</span>;
}

export default function PortfolioV2({initialPage="intro",initialGallerySlug=null}) {
  const [collection,setCollection]=useState(false);
  const [peel,setPeel]=useState(0);
  const [page,setPage]=useState(initialPage);
  const [paperMask,setPaperMask]=useState();
  const [collectionMask,setCollectionMask]=useState();
  const [clock,setClock]=useState("");
  const [emailCopied,setEmailCopied]=useState(false);
  const [emailCopyError,setEmailCopyError]=useState("");
  const copyReset=useRef(null);
  const paper=useRef(null);
  const heading=useRef(null);
  const navigation=useRef(null);
  const rolledOpen=useRef(false);
  const activeArt=page==="gallery"?"car":page==="experience"?"experience":page==="education"?"education":page==="projects"?"projects":"rocket";

  const copyEmail=async()=>{
    try{
      await navigator.clipboard.writeText("jaiminjariwala5@gmail.com");
      setEmailCopied(true);
      setEmailCopyError("");
      clearTimeout(copyReset.current);
      copyReset.current=setTimeout(()=>setEmailCopied(false),2200);
    }catch{
      setEmailCopyError("Couldn't copy. Email me at jaiminjariwala5@gmail.com.");
    }
  };
  useEffect(()=>()=>clearTimeout(copyReset.current),[]);

  const navigate=next=>{
    // The latest selection wins, including taps while a previous unroll is
    // finishing. Never silently discard a real stamp/navigation activation.
    window.scrollTo({top:0,behavior:"instant"});
    if(next===page){
      navigation.current=null;
      setCollection(false);
      return;
    }
    navigation.current={destination:next,phase:"rolling"};
    if(collection&&rolledOpen.current){
      navigation.current.phase="preparing";
      setPage(next);
    }else{
      setCollection(true);
    }
  };
  const followSectionLink=(event,next)=>{
    // Keep browser-native new-tab gestures. Ordinary activations retain the
    // paper transition; every href is also a real server-rendered page.
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();navigate(next);
  };
  const paperSettled=isOpen=>{
    rolledOpen.current=isOpen;
    const transition=navigation.current;
    if(isOpen&&transition?.phase==="rolling"){
      transition.phase="preparing";
      setPage(transition.destination);
    }else if(!isOpen&&transition?.phase==="unrolling"){
      navigation.current=null;
      heading.current?.focus({preventScroll:true});
    }
  };
  const paperContentReady=readyPage=>{
    const transition=navigation.current;
    if(transition?.phase==="preparing"&&transition.destination===readyPage){
      transition.phase="unrolling";
      rolledOpen.current=false;
      setCollection(false);
    }
  };
  const revealCollection=()=>{
    navigation.current=null;
    window.scrollTo({top:0,behavior:"instant"});
    setCollection(true);
  };

  useEffect(()=>{
    const observer=new ResizeObserver(entries=>{
      const box=entries[0].borderBoxSize[0];
      const mobile=window.innerWidth<=760;
      setPaperMask(outlineMask(box.inlineSize,box.blockSize,PAGE_SCALLOP_PERIOD,!mobile));
      const inset=mobile?12:16;
      setCollectionMask(outlineMask(paperViewportWidth(window.innerWidth)-(mobile?0:inset*2),window.innerHeight-inset*2,PAGE_SCALLOP_PERIOD,!mobile));
    });
    if(paper.current)observer.observe(paper.current);
    const tick=()=>setClock(new Date().toLocaleTimeString("en-US",{timeZone:"America/New_York",hour:"numeric",minute:"2-digit"}).replace(/\s?[AP]M/,""));
    tick();const timer=setInterval(tick,60000);
    return()=>{observer.disconnect();clearInterval(timer);};
  },[]);
  useEffect(()=>{
    if(!collection)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=previous;};
  },[collection]);
  useEffect(()=>{
    if(!collection)heading.current?.focus({preventScroll:true});
  },[page,collection]);

  return <div className={styles.site}>
    <div className={styles.backingShadow} aria-hidden="true"><div className={styles.backingPaper} style={{maskImage:paperMask,maskSize:"100% 100%"}}/></div>
    <section className={`${styles.collection} ${collection || peel>0?styles.collectionVisible:""}`} style={{maskImage:collectionMask,maskSize:"100% 100%"}} aria-label="Stamp collection" aria-hidden={!collection} inert={!collection?true:undefined}>
      <div className={styles.stampGrid}>
        <figure className={styles.stampItem} data-stamp-item><StickerButton className={`${styles.stamp} ${styles.carStamp}`} aria-label="Open travel" onClick={()=>navigate("gallery")}><StampRim/><StampArt kind="car"/></StickerButton><figcaption>Travel</figcaption></figure>
        <figure className={styles.stampItem} data-stamp-item><StickerButton className={`${styles.stamp} ${styles.rocketStamp}`} aria-label="Open introduction" onClick={()=>navigate("intro")}><StampRim lobes={6}/><span className={styles.stampTime}>{clock}<span>DC</span></span><StampArt kind="rocket"/><span className={styles.signature}>Jaimin<span>:)</span></span></StickerButton><figcaption>About</figcaption></figure>
        <figure className={styles.stampItem} data-stamp-item><StickerButton className={`${styles.stamp} ${styles.workStamp}`} aria-label="Open experience" onClick={()=>navigate("experience")}><StampRim/><StampArt kind="experience"/></StickerButton><figcaption>Work</figcaption></figure>
        <figure className={styles.stampItem} data-stamp-item><StickerButton className={styles.stamp} aria-label="Open education" onClick={()=>navigate("education")}><StampRim/><StampArt kind="education"/></StickerButton><figcaption>Education</figcaption></figure>
        <figure className={styles.stampItem} data-stamp-item><StickerButton className={styles.stamp} aria-label="Open projects" onClick={()=>navigate("projects")}><StampRim/><StampArt kind="projects"/></StickerButton><figcaption>Projects</figcaption></figure>
        <figure className={styles.stampItem} data-stamp-item><div className={`${styles.stamp} ${styles.locked}`} aria-label="Skills (adding soon)"><StampRim/><span className={styles.comingSoon}>Skills<small>(adding soon)</small></span></div></figure>
      </div>
    </section>

    <div className={styles.paperShadow}><div ref={paper} data-portfolio-paper className={styles.paper} style={{maskImage:paperMask}} inert={collection?true:undefined}>
      <StickerButton data-paper-stamp className={`${styles.homeStamp} ${page==="intro"?styles.rocketStamp:""}`} aria-label="Choose a stamp" onClick={revealCollection}><StampRim lobes={page==="intro"?6:8}/>{page==="intro"&&<span className={styles.stampTime}>{clock}<span>DC</span></span>}<StampArt kind={activeArt}/>{page==="intro"&&<span className={styles.signature}>Jaimin<span>:)</span></span>}</StickerButton>
      <article ref={heading} tabIndex={-1} className={`${styles.article} ${page==="intro"?styles.introPage:page==="experience"||page==="education"?styles.experiencePage:""}`} aria-label={page==="intro"?"Introduction":page==="gallery"?"Travel":page==="education"?"Education":page==="projects"?"Projects":"Experience"} key={page}>
        {page==="intro"&&<>
          <header><h1>Jaimin Mukesh Jariwala</h1></header>
          <p className={styles.introText}><span>I'm Jaimin Jariwala, a software engineer who loves building cool products that people love using and systems that don't break under heavy traffic. I like building the infrastructure and owning the entire product development lifecycle.</span></p>
          <nav className={styles.introExplore} aria-label="Explore portfolio"><h2>Explore</h2><a href={sectionPaths.gallery} onClick={event=>followSectionLink(event,"gallery")}><span className={styles.exploreLabel}>Travel</span></a><a href={sectionPaths.experience} onClick={event=>followSectionLink(event,"experience")}><span className={styles.exploreLabel}>Experience</span></a><a href={sectionPaths.education} onClick={event=>followSectionLink(event,"education")}><span className={styles.exploreLabel}>Education</span></a><a href={sectionPaths.projects} onClick={event=>followSectionLink(event,"projects")}><span className={styles.exploreLabel}>Projects</span></a></nav>
          <div className={styles.introSocials}><a href="https://github.com/jaiminjariwala"><span className={styles.inlineLink}>GitHub</span><ExternalArrow/></a><a href="https://www.linkedin.com/in/jaiminjariwala/"><span className={styles.inlineLink}>LinkedIn</span><ExternalArrow/></a><button type="button" className={styles.copyEmail} onClick={copyEmail} aria-live="polite">{emailCopied?"Copied!":"Copy email"}</button></div>
          {emailCopyError&&<p className={styles.copyError} role="status">{emailCopyError}</p>}
        </>}
        {page==="gallery"&&<PortfolioV2Gallery initialSlug={initialGallerySlug}/>}
        {page==="projects"&&<PortfolioV2Projects/>}
        {page==="experience"&&<>
          <header><h1>Experience</h1></header>
          <div className={styles.experience}>{experience.map(([company,role,date,subjects,team])=><div key={company}><div><strong>{company}</strong><span>{role}{team&&<span className={styles.experienceTeam}>{team}</span>}</span>{subjects?.map(subject=><span key={subject}>· {subject}</span>)}</div><time>{date}</time></div>)}</div>
        </>}
        {page==="education"&&<>
          <header><h1>Education</h1></header>
          <div className={styles.experience}>{education.map(([university,degree,date,grade,award,location])=><div key={university}><div><strong>{university}</strong><span>{degree}</span><span>{grade}</span>{award&&<span>{award}</span>}</div><div className={styles.educationMeta}><span>{location}</span><time>{date}</time></div></div>)}</div>
        </>}
        {page!=="intro"&&<nav className={styles.pageNavigation} aria-label="Portfolio pages"><a href={sectionPaths.intro} onClick={event=>followSectionLink(event,"intro")}>Introduction</a><a href={sectionPaths.gallery} onClick={event=>followSectionLink(event,"gallery")} aria-current={page==="gallery"?"page":undefined}>Travel</a><a href={sectionPaths.experience} onClick={event=>followSectionLink(event,"experience")} aria-current={page==="experience"?"page":undefined}>Experience</a><a href={sectionPaths.education} onClick={event=>followSectionLink(event,"education")} aria-current={page==="education"?"page":undefined}>Education</a><a href={sectionPaths.projects} onClick={event=>followSectionLink(event,"projects")} aria-current={page==="projects"?"page":undefined}>Projects</a></nav>}
      </article>
    </div></div>
    <PaperPeel variant={page} open={collection} onOpenChange={next=>{navigation.current=null;setCollection(next);}} onSettled={paperSettled} onContentReady={paperContentReady} onClipChange={(clip,progress)=>{
      if(paper.current){
        if(paper.current.style.clipPath!==clip)paper.current.style.clipPath=clip;
        const article=paper.current.querySelector("article");
        if(article)article.style.visibility=progress>=.999?"hidden":"";
      }
      setPeel(progress>0?1:0);
    }}/>
  </div>;
}
