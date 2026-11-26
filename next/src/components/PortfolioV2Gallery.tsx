"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Photo, PhotoSection } from "./galleryData";
import { GlassFolder } from "./GlassFolder";
import {
  folders,
  getSectionBySlug,
  getCloudinaryUrl,
  getPhotoId,
  getPhotoPosition,
} from "./galleryData";
import { polygonPath, scallopedOutline } from "./paperGeometry";
import styles from "./PortfolioV2.module.css";
import PortfolioBackLink from "./PortfolioBackLink";
import usePhotoEntrance from "./usePhotoEntrance";
import useHorizontalDrag from "./useHorizontalDrag";

const photoFramePath = polygonPath(scallopedOutline(240, 300, 20));

function PhotoPrint({
  photo,
  index,
  title,
}: {
  photo: Photo;
  index: number;
  title: string;
}) {
  const ref = usePhotoEntrance();
  return (
    <a
      ref={ref}
      className={styles.photoPrint}
      href={getCloudinaryUrl(getPhotoId(photo), 2400)}
      target="_blank"
      rel="noreferrer"
      aria-label={`View ${title} photo ${index + 1} full size`}
    >
      <svg className={styles.photoRim} viewBox="0 0 240 300" aria-hidden="true">
        <path d={photoFramePath} fill="white" />
      </svg>
      <img
        src={getCloudinaryUrl(getPhotoId(photo), 800)}
        alt={`${title}, photo ${index + 1}`}
        loading="lazy"
        style={{ objectPosition: getPhotoPosition(photo) }}
      />
    </a>
  );
}

function PhotoStrip({ section }: { section: PhotoSection }) {
  const drag = useHorizontalDrag();
  return (
    <div
      data-paper-ink
      className={styles.photoGrid}
      tabIndex={0}
      role="region"
      aria-label={`${section.title} photographs, drag or scroll horizontally`}
      {...drag}
    >
      {section.photos.map((photo, index) => (
        <PhotoPrint
          key={`${getPhotoId(photo)}-${index}`}
          photo={photo}
          index={index}
          title={section.title}
        />
      ))}
    </div>
  );
}

export default function PortfolioV2Gallery({
  initialSlug = null,
  scrollTargetId,
}: {
  initialSlug?: string | null;
  scrollTargetId?: string;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const drag = useHorizontalDrag();
  const section = getSectionBySlug(slug);
  const introduction = useRef<HTMLParagraphElement>(null);
  const folderRow = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const paragraph = introduction.current;
    const row = folderRow.current;
    if (!paragraph || !row) return;
    let disposed = false;
    const align = () => {
      if (disposed) return;
      const text = document.createRange();
      text.selectNodeContents(paragraph);
      const offset = (text.getBoundingClientRect().width - row.getBoundingClientRect().width) / 2;
      row.style.setProperty("--travel-folders-offset", `${offset}px`);
    };
    const observer = new ResizeObserver(align);
    observer.observe(paragraph);
    align();
    void document.fonts.ready.then(align);
    return () => { disposed = true; observer.disconnect(); };
  }, [slug]);
  const openFolder = (value: string | null) => {
    setSlug(value);
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "instant" });
      return;
    }
    document
      .querySelector<HTMLElement>("[data-portfolio-scroll]")
      ?.scrollTo({ top: 0, behavior: "instant" });
  };
  if (section)
    return (
      <>
        <header>
          <PortfolioBackLink
            href="/gallery"
            label="Back to Travel"
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              openFolder(null);
            }}
          />
          <h1>{section.title}</h1>
          <div className={styles.galleryDate}>
            {section.dateRange} · {section.photos.length} photos
          </div>
        </header>
        <PhotoStrip key={section.slug || section.title} section={section} />
      </>
    );
  return (
    <>
      <header>
        <h1 className={styles.sectionHeading}>Travel</h1>
      </header>
      <p ref={introduction}>
        Photos from places I&apos;ve visited. I just love traveling{" "}
        <span className={styles.travelCompass}>🧭</span>
      </p>
      <div
        ref={folderRow}
        className={styles.folderGrid}
        role="region"
        aria-label="Travel folders, swipe or drag horizontally"
        tabIndex={0}
        data-cursor-type="grab"
        {...drag}
      >
        {folders.map((folder) => (
          <GlassFolder key={folder.slug} {...folder} onOpen={openFolder} />
        ))}
      </div>
    </>
  );
}
