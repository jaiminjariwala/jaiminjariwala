"use client";

import {useState} from "react";
import Link from "next/link";
import type {Photo,PhotoSection} from './galleryData';
import {GlassFolder} from "./GalleryPage";
import {folders,getSectionBySlug,getCloudinaryUrl,getPhotoId,getPhotoPosition} from "./galleryData";
import {polygonPath,scallopedOutline} from "./paperGeometry";
import styles from "./PortfolioV2.module.css";
import usePhotoEntrance from "./usePhotoEntrance";
import useHorizontalDrag from "./useHorizontalDrag";

const photoFramePath=polygonPath(scallopedOutline(240,300,20));

function PhotoPrint({photo,index,title}:{photo:Photo;index:number;title:string}){
  const ref=usePhotoEntrance();
  return <a ref={ref} className={styles.photoPrint} href={getCloudinaryUrl(getPhotoId(photo),2400)} target="_blank" rel="noreferrer" aria-label={`View ${title} photo ${index+1} full size`}><svg className={styles.photoRim} viewBox="0 0 240 300" aria-hidden="true"><path d={photoFramePath} fill="white"/></svg><img src={getCloudinaryUrl(getPhotoId(photo),800)} alt={`${title}, photo ${index+1}`} loading="lazy" style={{objectPosition:getPhotoPosition(photo)}}/></a>;
}

function PhotoStrip({section}:{section:PhotoSection}){
  const drag=useHorizontalDrag();
  return <div data-paper-ink className={styles.photoGrid} tabIndex={0} role="region" aria-label={`${section.title} photographs, drag or scroll horizontally`}
    {...drag}>
    {section.photos.map((photo,index)=><PhotoPrint key={`${getPhotoId(photo)}-${index}`} photo={photo} index={index} title={section.title}/>)}
  </div>;
}

export default function PortfolioV2Gallery({initialSlug=null}:{initialSlug?:string|null}){
  const [slug,setSlug]=useState(initialSlug);
  const drag=useHorizontalDrag();
  const section=getSectionBySlug(slug);
  const openFolder=(value:string|null)=>{setSlug(value);window.scrollTo({top:0,behavior:'instant'});};
  if(section)return <>
    <header><Link href="/gallery" prefetch={false} className={styles.galleryBack} onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();openFolder(null);}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m11 5-7 7 7 7M4 12h16"/></svg>Back</Link><h1>{section.title}</h1><div className={styles.galleryDate}>{section.dateRange} · {section.photos.length} photos</div></header>
    <PhotoStrip key={section.slug||section.title} section={section}/>
  </>;
  return <>
    <header><h1>Travel</h1></header>
    <p>A few places, moments, and photographs along the way.</p>
    <div className={styles.folderGrid} role="region" aria-label="Travel folders, swipe or drag horizontally" tabIndex={0} data-cursor-type="grab" {...drag}>{folders.map(folder=><GlassFolder key={folder.slug} {...folder} onOpen={openFolder}/>)}</div>
  </>;
}
