"use client";

import { useRef, useState } from "react";
import ProjectVideoPlayer from "./ProjectVideoPlayer";
import { portfolioProjects } from "./portfolioProjects.ts";
import type { PortfolioProject } from "./portfolioProjects";
import styles from "./PortfolioV2.module.css";

function Arrow({ back = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={back ? "m11 5-7 7 7 7M4 12h16" : "m13 5 7 7-7 7M20 12H4"} />
    </svg>
  );
}

function ProjectGallery({ project }: { project: PortfolioProject }) {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null!);
  const item = project.media[index];
  const select = (next: number) => {
    setIndex(next);
    const thumb = rail.current?.children[next] as HTMLElement | undefined;
    // Scroll only the thumbnail rail, never the surrounding paper document.
    if (thumb)
      rail.current.scrollTo({
        left:
          thumb.offsetLeft - (rail.current.clientWidth - thumb.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <figure
      className={`${styles.projectGallery} ${project.id === "apple-homeview-simulator" ? styles.homeviewGallery : project.id === "sharded-raft-kv" ? styles.raftGallery : ""}`}
      aria-label={`${project.title} screenshots and videos`}
    >
      <div className={styles.projectMediaFrame}>
        <div
          className={styles.projectMediaStage}
          style={{ aspectRatio: item.aspect || project.aspect || "16 / 10" }}
        >
          {item.type === "video" ? (
            <ProjectVideoPlayer
              key={item.src}
              item={item}
              title={project.title}
            />
          ) : (
            <a
              href={item.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title}: ${item.label} full size`}
            >
              <img
                key={item.src}
                src={item.src}
                alt={`${project.title}: ${item.label}`}
                loading="lazy"
              />
            </a>
          )}
        </div>
      </div>
      {project.media.length > 1 && <figcaption className={styles.projectMediaCaption}>
        {project.id !== "apple-homeview-simulator" && <span aria-live="polite">{item.label}</span>}
        {project.media.length > 1 && (
          <span className={styles.projectMediaControls}>
            <button
              type="button"
              aria-label={`Previous ${project.title} media`}
              disabled={index === 0}
              onClick={() => select(index - 1)}
            >
              <Arrow back />
            </button>
            <span>
              {index + 1} / {project.media.length}
            </span>
            <button
              type="button"
              aria-label={`Next ${project.title} media`}
              disabled={index === project.media.length - 1}
              onClick={() => select(index + 1)}
            >
              <Arrow />
            </button>
          </span>
        )}
      </figcaption>}
      {project.media.length > 1 && (
        <div
          ref={rail}
          className={styles.projectThumbnails}
          role="group"
          aria-label={`${project.title} media selection`}
        >
          {project.media.map((media, i) => (
            <button
              key={media.src}
              type="button"
              aria-label={`Show ${project.title}: ${media.label}`}
              aria-pressed={i === index}
              onClick={() => select(i)}
            >
              <span className={styles.projectThumbnailImage}>
                <img src={media.poster || media.src} alt="" loading="lazy" />
                {media.type === "video" && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 5 11 7-11 7Z" fill="currentColor" />
                  </svg>
                )}
              </span>
              <span>{media.label}</span>
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}

export default function PortfolioV2Projects() {
  return (
    <>
      <header>
        <h1 className={styles.sectionHeading}>Projects</h1>
      </header>
      <p>A few things I have built.</p>
      <div className={styles.projectList}>
        {portfolioProjects.map((project) => (
          <section
            key={project.id}
            className={styles.projectEntry}
            aria-labelledby={`project-${project.id}`}
          >
            <div className={styles.projectHeadingRow}>
              <h2 id={`project-${project.id}`}>{project.title}</h2>
              {project.date && <time className={styles.projectDate}>{project.date}</time>}
            </div>
            <p>{project.description}</p>
            <div className={styles.projectLinks}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.inlineLink}>{link.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 18 18 6M6 6h12v12" />
                  </svg>
                </a>
              ))}
            </div>
            <ProjectGallery project={project} />
            {project.note && (
              <p className={styles.projectNote}>{project.note}</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
