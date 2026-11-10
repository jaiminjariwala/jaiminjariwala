"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import type { GalleryFolder } from "./galleryData";

export function GlassFolder({
  title,
  count,
  images,
  slug,
  onOpen,
}: GalleryFolder & { onOpen?: (slug: string) => void }) {
  const entranceRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const card = entranceRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    // Keep every phone-width folder visible before it enters the scrollport.
    // A delayed opacity/blur entrance can look like a swipe reached blank space.
    if (window.matchMedia("(max-width: 760px)").matches) return;
    let progress = 0;
    let animation: AnimationPlaybackControls | undefined;
    const render = (value: number) => {
      progress = Math.max(0, Math.min(1, value));
      const remaining = 1 - progress;
      card.style.opacity = String(progress);
      card.style.transform = `scale(${1 - remaining * 0.25})`;
      card.style.filter = `blur(${remaining ** 3 * 60}px)`;
    };
    render(0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(card);
          animation?.stop();
          const siblings = Array.from(card.parentElement!.children);
          animation = animate(progress, 1, {
            type: "spring",
            stiffness: 85,
            damping: 18,
            mass: 1,
            delay: entry.isIntersecting ? siblings.indexOf(card) * 0.12 : 0,
            onUpdate: render,
            onComplete: () => {
              card.style.removeProperty("opacity");
              card.style.removeProperty("transform");
              card.style.removeProperty("filter");
            },
          });
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      animation?.stop();
      card.style.removeProperty("opacity");
      card.style.removeProperty("transform");
      card.style.removeProperty("filter");
    };
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const folderImages = Array.from(
    { length: 4 },
    (_, index) => images[index] ?? null,
  );

  return (
    <Link
      ref={entranceRef}
      href={`/gallery/${slug}`}
      onClick={
        onOpen
          ? (event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              onOpen(slug);
            }
          : undefined
      }
      className="gallery-folder-card block w-[162px] shrink-0 cursor-pointer"
    >
      <div
        className="gallery-folder-visual"
        style={styles.folderAnchor}
        onMouseEnter={() => {
          // Touch taps synthesize mouseenter right before the click, which
          // briefly flashed the fan-out on phones. Only hover-capable
          // pointers get the animation.
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.backPlate} />
        <div style={styles.backPlateInnerShadow} />
        <div style={styles.paperStackShadow} />

        <div
          style={{
            ...styles.paper,
            ...styles.paperFarLeft,
            backgroundImage: folderImages[0]
              ? `url(${folderImages[0]})`
              : styles.emptyPaperBackground,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(-20px) rotateZ(-40deg)"
              : "translate(-50%, 16px) translateX(-18px) rotateZ(-8deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperInnerLeft,
            backgroundImage: folderImages[1]
              ? `url(${folderImages[1]})`
              : styles.emptyPaperBackground,
            transform: isHovered
              ? "translate(-50%, -72px) translateX(-2px) rotateZ(-22deg)"
              : "translate(-50%, 10px) translateX(-6px) rotateZ(-2deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperInnerRight,
            backgroundImage: folderImages[2]
              ? `url(${folderImages[2]})`
              : styles.emptyPaperBackground,
            transform: isHovered
              ? "translate(-50%, -72px) translateX(2px) rotateZ(22deg)"
              : "translate(-50%, 10px) translateX(6px) rotateZ(2deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperFarRight,
            backgroundImage: folderImages[3]
              ? `url(${folderImages[3]})`
              : styles.emptyPaperBackground,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(20px) rotateZ(40deg)"
              : "translate(-50%, 16px) translateX(18px) rotateZ(8deg)",
          }}
        />

        <div style={styles.glassPerspectiveWrapper}>
          <div
            style={{
              ...styles.glassShape,
              transform: isHovered ? "rotateX(-24deg)" : "rotateX(0deg)",
            }}
          >
            {slug === "seattle" && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "52%",
                  transform: "translate(-50%, -50%)",
                  width: "84%",
                  textAlign: "center",
                  fontWeight: 400,
                  fontSize: "21px",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  // Deeper saturated blue matching the printed logo in the
                  // reference folder image.
                  color: "#2183c8",
                  WebkitTextStroke: "0.5px #2183c8",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                Summer internship at{" "}
                <span
                  style={{
                    fontFamily: "var(--font-short-stack), cursive",
                    WebkitTextStroke: "2px #2183c8",
                  }}
                >
                  Amazon
                </span>
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            ...styles.groundShadow,
            opacity: isHovered ? 0.34 : 0.2,
            transform: `translateX(-50%) scale(${isHovered ? 1.08 : 1})`,
          }}
        />
      </div>

      <p
        className="gallery-folder-meta gallery-folder-title mt-[14px] text-center leading-[1.35] tracking-[-0.01em] text-[#2b2f35]"
        style={{ fontSize: "clamp(18px, 3vw, 20px)", marginBottom: 5 }}
      >
        {title}
      </p>
      <p className="gallery-folder-meta gallery-folder-count mt-[-2px] mb-0 text-center text-[16px] leading-none tracking-[-0.02em] text-[#0b65d8]">
        {count}
      </p>
    </Link>
  );
}

const styles = {
  folderAnchor: {
    position: "relative",
    width: "185px",
    height: "159px",
    perspective: "550px",
    cursor: "pointer",
  },
  backPlate: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "95%",
    border: "none",
    background:
      "linear-gradient(180deg, #78cff7 0%, #60c0ec 58%, #49afdf 100%)",
    overflow: "hidden",
    clipPath:
      'path("M 0 31 C 0 23 5 16 13 16 L 52 16 C 57 16 62 18 66 21 L 73 27 C 76 30 80 31 86 31 L 177 31 C 182 31 185 35 185 39 L 185 130 C 185 137 180 142 173 142 L 12 142 C 5 142 0 137 0 130 Z")',
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.56), 0 7px 14px rgba(12, 40, 63, 0.24)",
    zIndex: 1,
  },
  paper: {
    position: "absolute",
    left: "50%",
    top: "29px",
    borderRadius: "3px",
    backgroundColor: "#f7f5ea",
    borderStyle: "solid",
    borderWidth: "6px 6px 20px 6px",
    borderColor: "#ffffff",
    backgroundOrigin: "content-box",
    backgroundClip: "content-box",
    boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    transformOrigin: "bottom center",
    transformStyle: "preserve-3d",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 3,
  },
  emptyPaperBackground:
    "linear-gradient(135deg, #f8fbff 0%, #edf4fb 48%, #dfeaf4 100%)",
  paperFarLeft: { width: "82px", height: "96px", zIndex: 3 },
  paperInnerLeft: { width: "86px", height: "102px", zIndex: 4 },
  paperInnerRight: { width: "86px", height: "102px", zIndex: 5 },
  paperFarRight: { width: "82px", height: "96px", zIndex: 6 },
  backPlateInnerShadow: {
    position: "absolute",
    top: "41px",
    left: "0px",
    right: "0px",
    height: "56px",
    borderRadius: "10px 10px 0 0",
    background:
      "linear-gradient(to bottom, rgba(20,90,140,0.38) 0%, rgba(20,90,140,0.12) 55%, transparent 100%)",
    filter: "blur(5px)",
    zIndex: 2,
    pointerEvents: "none",
  },
  paperStackShadow: {
    position: "absolute",
    top: "38px",
    left: "15px",
    right: "15px",
    height: "24px",
    borderRadius: "10px",
    background:
      "linear-gradient(to top, rgba(13, 43, 67, 0.32) 0%, rgba(13, 43, 67, 0.15) 45%, rgba(13, 43, 67, 0) 100%)",
    filter: "blur(1.8px)",
    zIndex: 2,
    pointerEvents: "none",
  },
  glassPerspectiveWrapper: {
    position: "absolute",
    bottom: "0px",
    width: "100%",
    height: "69%",
    zIndex: 10,
    transformStyle: "preserve-3d",
  },
  glassShape: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    background:
      "linear-gradient(180deg, #76c8ef 0%, #6cc3ec 56%, #62bce6 100%)",
    border: "none",
    borderRadius: "12px",
    overflow: "hidden",
    transformOrigin: "bottom center",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.42), 0 3px 8px rgba(12, 40, 63, 0.1)",
  },
  groundShadow: {
    position: "absolute",
    bottom: "-26px",
    left: "50%",
    width: "74%",
    height: "16px",
    background:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, transparent 70%)",
    filter: "blur(8px)",
    transition: "all 0.6s ease",
    zIndex: 0,
  },
} as const;
