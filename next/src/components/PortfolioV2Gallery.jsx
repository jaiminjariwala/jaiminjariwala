"use client";

import {useRef,useState} from "react";
import {GlassFolder} from "./GalleryPage";
import {folders,getSectionBySlug,getCloudinaryUrl,getPhotoId,getPhotoPosition} from "./galleryData";
import {polygonPath,scallopedOutline} from "./paperGeometry";
import styles from "./PortfolioV2.module.css";
import usePhotoEntrance from "./usePhotoEntrance";

const photoFramePath=polygonPath(scallopedOutline(240,300,20));

function PhotoPrint({photo,index,title}){
  const ref=usePhotoEntrance();
  return <a ref={ref} className={styles.photoPrint} href={getCloudinaryUrl(getPhotoId(photo),2400)} target="_blank" rel="noreferrer" aria-label={`View ${title} photo ${index+1} full size`}><svg className={styles.photoRim} viewBox="0 0 240 300" aria-hidden="true"><path d={photoFramePath} fill="white"/></svg><img src={getCloudinaryUrl(getPhotoId(photo),800)} alt={`${title}, photo ${index+1}`} loading="lazy" style={{objectPosition:getPhotoPosition(photo)}}/></a>;
}

function PhotoStrip({section}){
  const gesture=useRef(null);
  const down=event=>{
    gesture.current=null;
    if(event.pointerType!=="mouse"||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,left:event.currentTarget.scrollLeft,dragged:false,active:true};
  };
  const move=event=>{
    const drag=gesture.current;
    if(!drag?.active||drag.id!==event.pointerId)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.dragged&&Math.abs(dx)>5&&Math.abs(dx)>Math.abs(dy)){
      drag.dragged=true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging="true";
    }
    if(drag.dragged){event.preventDefault();event.currentTarget.scrollLeft=drag.left-dx;}
  };
  const end=event=>{
    if(gesture.current?.id!==event.pointerId)return;
    gesture.current.active=false;
    delete event.currentTarget.dataset.dragging;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div data-paper-ink className={styles.photoGrid} tabIndex={0} role="region" aria-label={`${section.title} photographs, drag or scroll horizontally`}
    onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
    onDragStart={event=>event.preventDefault()}
    onClickCapture={event=>{if(event.detail>0&&gesture.current?.dragged){event.preventDefault();event.stopPropagation();}}}>
    {section.photos.map((photo,index)=><PhotoPrint key={`${getPhotoId(photo)}-${index}`} photo={photo} index={index} title={section.title}/>)}
  </div>;
}

export default function PortfolioV2Gallery(){
  const [slug,setSlug]=useState(null);
  const section=getSectionBySlug(slug);
  const openFolder=value=>{setSlug(value);window.scrollTo({top:0,behavior:'instant'});};
  if(section)return <>
    <header><button className={styles.galleryBack} onClick={()=>openFolder(null)}>← Back</button><h1>{section.title}</h1><div className={styles.galleryDate}>{section.dateRange} · {section.photos.length} photos</div></header>
    <PhotoStrip key={section.slug||section.title} section={section}/>
  </>;
  return <>
    <header><h1>Travel</h1></header>
    <p>A few places, moments, and photographs along the way.</p>
    <div className={styles.folderGrid}>{folders.map(folder=><GlassFolder key={folder.slug} {...folder} onOpen={openFolder}/>)}</div>
  </>;
}
