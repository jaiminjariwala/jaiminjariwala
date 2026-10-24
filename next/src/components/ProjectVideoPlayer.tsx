"use client";

import {useEffect,useRef,useState} from 'react';
import {videoPosition,videoTime} from './projectMedia.ts';
import styles from './PortfolioV2.module.css';
import type {ProjectMedia} from './portfolioProjects';

export default function ProjectVideoPlayer({item,title}:{item:ProjectMedia;title:string}){
  const player=useRef<HTMLDivElement>(null!),video=useRef<HTMLVideoElement>(null!);
  const [playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(0),[fullscreen,setFullscreen]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    const element=video.current;
    const update=()=>setFullscreen(document.fullscreenElement===player.current||!!element.webkitDisplayingFullscreen);
    document.addEventListener('fullscreenchange',update);
    element.addEventListener('webkitbeginfullscreen',update);
    element.addEventListener('webkitendfullscreen',update);
    return()=>{document.removeEventListener('fullscreenchange',update);element.removeEventListener('webkitbeginfullscreen',update);element.removeEventListener('webkitendfullscreen',update);element.pause();};
  },[]);
  const togglePlay=async()=>{
    const element=video.current;
    if(!element.paused){element.pause();return;}
    setError('');
    try{await element.play();}catch{setError('Could not play this video. Please try again.');}
  };
  const toggleFullscreen=async()=>{
    try{
      if(document.fullscreenElement===player.current)await document.exitFullscreen();
      else if(player.current.requestFullscreen)await player.current.requestFullscreen();
      else if(video.current.webkitEnterFullscreen)video.current.webkitEnterFullscreen();
      else setError('Fullscreen is not available in this browser.');
    }catch{setError('Could not open fullscreen. Please try again.');}
  };
  return <div ref={player} className={styles.projectVideoPlayer}>
    <video ref={video} src={item.src} poster={item.poster} playsInline preload="metadata" aria-label={`${title}: ${item.label}`}
      onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}
      onTimeUpdate={event=>setTime(event.currentTarget.currentTime)}
      onDurationChange={event=>{const value=event.currentTarget.duration;setDuration(Number.isFinite(value)&&value>0?value:0);}}
      onError={()=>setError('This video could not load. Please try again.')}/>
    <div className={styles.projectVideoControls} role="group" aria-label={`${title} video controls`}>
      <button type="button" onClick={togglePlay} aria-label={`${playing?'Pause':'Play'} ${title}: ${item.label}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{playing?<path d="M7 5h4v14H7Zm7 0h4v14h-4Z" fill="currentColor"/>:<path d="m8 4 12 8-12 8Z" fill="currentColor"/>}</svg>
      </button>
      <input type="range" min="0" max={duration||1} step=".01" value={videoPosition(time,duration)} disabled={!duration} aria-label={`Seek ${title}: ${item.label}`} aria-valuetext={`${videoTime(time)} of ${videoTime(duration)}`} onChange={event=>{const next=videoPosition(Number(event.target.value),duration);video.current.currentTime=next;setTime(next);}}/>
      <button type="button" onClick={toggleFullscreen} aria-label={`${fullscreen?'Exit':'Enter'} fullscreen ${title}: ${item.label}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{fullscreen?<path d="m4 4 6 6m-6 0h6V4m10 16-6-6m6 0h-6v6"/>:<path d="m14 10 6-6m-6 0h6v6M10 14l-6 6m0-6v6h6"/>}</svg>
      </button>
    </div>
    {error&&<p className={styles.projectVideoError} role="status">{error}</p>}
  </div>;
}
