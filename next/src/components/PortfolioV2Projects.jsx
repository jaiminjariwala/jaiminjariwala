"use client";

import {useEffect,useRef,useState} from 'react';
import {projectFramePath} from './projectMedia.mjs';
import ProjectVideoPlayer from './ProjectVideoPlayer';
import {portfolioProjects} from './portfolioProjects.mjs';
import styles from './PortfolioV2.module.css';

function Arrow({back=false}){
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back?'m11 5-7 7 7 7M4 12h16':'m13 5 7 7-7 7M20 12H4'}/></svg>;
}

function ProjectGallery({project}){
  const [index,setIndex]=useState(0);
  const [outline,setOutline]=useState({width:720,height:480,path:projectFramePath(720,480)});
  const frame=useRef(null),rail=useRef(null);
  const item=project.media[index];
  useEffect(()=>{
    const observer=new ResizeObserver(([entry])=>{
      const {inlineSize:width,blockSize:height}=entry.borderBoxSize[0];
      if(width>0&&height>0)setOutline({width,height,path:projectFramePath(width,height)});
    });
    observer.observe(frame.current);
    return()=>observer.disconnect();
  },[]);
  const select=next=>{
    setIndex(next);
    const thumb=rail.current?.children[next];
    // Scroll only the thumbnail rail, never the surrounding paper document.
    if(thumb)rail.current.scrollTo({left:thumb.offsetLeft-(rail.current.clientWidth-thumb.offsetWidth)/2,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return <figure className={styles.projectGallery} aria-label={`${project.title} screenshots and videos`}>
    <div ref={frame} className={styles.projectMediaFrame}>
      <svg className={styles.projectMediaRim} viewBox={`0 0 ${outline.width} ${outline.height}`} preserveAspectRatio="none" aria-hidden="true"><path d={outline.path} fill="#f8f8f7"/></svg>
      <div className={styles.projectMediaStage} style={{aspectRatio:item.aspect||project.aspect||'16 / 10'}}>
        {item.type==='video'?<ProjectVideoPlayer key={item.src} item={item} title={project.title}/>:<a href={item.src} target="_blank" rel="noreferrer" aria-label={`View ${project.title}: ${item.label} full size`}><img key={item.src} src={item.src} alt={`${project.title}: ${item.label}`} loading="lazy"/></a>}
      </div>
    </div>
    <figcaption className={styles.projectMediaCaption}>
      <span aria-live="polite">{item.label}</span>
      {project.media.length>1?<span className={styles.projectMediaControls}><button type="button" aria-label={`Previous ${project.title} media`} disabled={index===0} onClick={()=>select(index-1)}><Arrow back/></button><span>{index+1} / {project.media.length}</span><button type="button" aria-label={`Next ${project.title} media`} disabled={index===project.media.length-1} onClick={()=>select(index+1)}><Arrow/></button></span>:<a href={item.src} target="_blank" rel="noreferrer">View full size</a>}
    </figcaption>
    {project.media.length>1&&<div ref={rail} className={styles.projectThumbnails} role="group" aria-label={`${project.title} media selection`}>{project.media.map((media,i)=><button key={media.src} type="button" aria-label={`Show ${project.title}: ${media.label}`} aria-pressed={i===index} onClick={()=>select(i)}><span className={styles.projectThumbnailImage}><img src={media.poster||media.src} alt="" loading="lazy"/>{media.type==='video'&&<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor"/></svg>}</span><span>{media.label}</span></button>)}</div>}
  </figure>;
}

export default function PortfolioV2Projects(){
  return <>
    <header><h1>Projects</h1></header>
    <p>A few things I have built, from desktop tools to backend experiments.</p>
    <div className={styles.projectList}>{portfolioProjects.map(project=><section key={project.id} className={styles.projectEntry} aria-labelledby={`project-${project.id}`}>
      <h2 id={`project-${project.id}`}>{project.title}</h2>
      <p>{project.description}</p>
      <div className={styles.projectLinks}>{project.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span className={styles.inlineLink}>{link.label}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a>)}</div>
      <ProjectGallery project={project}/>
      {project.note&&<p className={styles.projectNote}>{project.note}</p>}
    </section>)}</div>
  </>;
}
