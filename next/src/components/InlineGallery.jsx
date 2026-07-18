"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import GalleryPage from "@/components/GalleryPage";
import {
  getCloudinaryUrl,
  getPhotoId,
  getPhotoPosition,
  getSectionBySlug,
} from "@/components/galleryData";

const BASE_DROP = 22;

// How much breathing room the opened photos keep above the viewport bottom.
// Must stay below the page's own bottom padding (36px+) so the scroll target
// remains reachable once the folders swap to the taller detail view.
const OPEN_BOTTOM_SPACE = 28;
const SCROLL_DURATION_MS = 460;

const hashText = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const randomBetween = (seed, min, max) =>
  min + (seed / 4294967295) * (max - min);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// rAF-driven window scroll with ease-in-out, so the folder shift and the
// unfold can be sequenced deterministically (scrollTo smooth has no
// completion signal).
const animateWindowScroll = (targetY, duration) =>
  new Promise((resolve) => {
    const startY = window.scrollY;
    const change = targetY - startY;
    if (Math.abs(change) < 1) {
      resolve();
      return;
    }
    const start = performance.now();
    const easeInOut = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY + change * easeInOut(t));
      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    window.requestAnimationFrame(step);
  });

function InlineFolderPhotos({ section, onBack }) {
  return (
    <section className="inline-gallery-detail inline-unfold bg-white text-black">
      <div
        className="mx-auto w-full max-w-[689px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to gallery folders"
          className="inline-flex h-[24px] w-[24px] items-center justify-center border-0 bg-transparent p-0"
        >
          <Image
            src="/icons/left-arrow.svg"
            alt=""
            aria-hidden="true"
            width={22}
            height={20}
          />
        </button>

        <h1 className="mt-[10px] text-[32px] leading-none tracking-[-0.02em] [-webkit-text-stroke:0.5px_#000000]">
          {section.title}
        </h1>

        {section.dateRange ? (
          <p className="gallery-folder-date text-[16px] font-normal leading-none tracking-[-0.02em] text-[#0b65d8] [-webkit-text-stroke:0.4px_#0b65d8]">
            {section.dateRange}
          </p>
        ) : null}
      </div>

      <div className="inline-gallery-photo-scroll overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-gallery-photo-row flex w-max items-start">
          {section.photos.map((photo, index) => {
            const publicId = getPhotoId(photo);
            const objectPosition = getPhotoPosition(photo);
            const angleSeed = hashText(`${publicId}-angle`);
            const liftSeed = hashText(`${publicId}-lift`);
            let angle = randomBetween(angleSeed, -4.2, 4.2);
            if (Math.abs(angle) < 0.9) {
              angle = angle < 0 ? -0.9 : 0.9;
            }
            const lift = randomBetween(liftSeed, 0, 8);

            return (
              <article
                key={publicId}
                className="shrink-0 bg-[#f7f5ea] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                style={{
                  transform: `rotate(${angle}deg) translateY(${BASE_DROP + lift}px)`,
                  marginLeft: index === 0 ? 0 : "clamp(18px, 2.4vw, 34px)",
                  zIndex: index + 1,
                  borderStyle: "solid",
                  borderColor: "#ffffff",
                  borderWidth: "18px 18px 58px 18px",
                  borderRadius: "6px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCloudinaryUrl(publicId, 1400)}
                  alt={`${section.title} photo ${index + 1}`}
                  className="gallery-photo"
                  style={{ objectPosition }}
                  draggable={false}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function InlineGallery() {
  // phase: "idle" (folders) | "pending" (desktop: folders shifting up) |
  // "open" (photos visible)
  const [view, setView] = useState({ slug: null, phase: "idle" });
  // Extra document height while the close glide is in flight. Held in state
  // (set from event handlers) so a stale value can never silently stick to
  // the page; the open glide instead mutates the spacer element directly,
  // which is safe because that element never survives back into idle view.
  const [spacerHeight, setSpacerHeight] = useState(0);
  const foldersRootRef = useRef(null);
  const measureRef = useRef(null);
  const detailRef = useRef(null);
  const spacerRef = useRef(null);
  const savedScrollYRef = useRef(0);
  const restoreRef = useRef(false);

  const selectedSection = view.slug ? getSectionBySlug(view.slug) : null;
  const pendingSection = view.phase === "pending" ? selectedSection : null;

  const openFolderInPlace = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href^="/gallery/"]');
    const href = link?.getAttribute("href");
    const slug = href?.split("/").filter(Boolean).pop();
    if (!slug || !getSectionBySlug(slug)) return;

    event.preventDefault();
    event.stopPropagation();

    // Ignore clicks while a previous open is still animating.
    if (view.phase !== "idle") return;
    setSpacerHeight(0);
    setView({ slug, phase: "pending" });
  };

  const handleBack = () => {
    const detailHeight = detailRef.current?.offsetHeight ?? 0;

    if (prefersReducedMotion()) {
      setView({ slug: null, phase: "idle" });
      window.scrollTo(0, savedScrollYRef.current);
      return;
    }

    // Swap back to the folders with the spacer already holding the photos
    // view's height, so the document stays tall enough to glide back down.
    restoreRef.current = true;
    setSpacerHeight(detailHeight);
    setView({ slug: null, phase: "idle" });
  };

  // Open choreography (all viewports): measure the hidden detail view, extend
  // the document with a spacer so the target position is reachable, shift the
  // folders up, and only then unfold the photos.
  useLayoutEffect(() => {
    if (view.phase !== "pending") return undefined;

    const rootEl = foldersRootRef.current;
    const measureEl = measureRef.current;
    const open = () => setView({ slug: view.slug, phase: "open" });

    if (!rootEl || !measureEl) {
      open();
      return undefined;
    }

    const detailHeight = measureEl.offsetHeight;
    const rootTop = rootEl.getBoundingClientRect().top;
    savedScrollYRef.current = window.scrollY;

    const delta = Math.ceil(
      rootTop + detailHeight + OPEN_BOTTOM_SPACE - window.innerHeight,
    );
    if (delta <= 0) {
      open();
      return undefined;
    }

    const targetY = window.scrollY + delta;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (spacerRef.current) {
      spacerRef.current.style.height = `${Math.max(0, Math.ceil(targetY - maxScroll))}px`;
    }

    if (prefersReducedMotion()) {
      window.scrollTo(0, targetY);
      open();
      return undefined;
    }

    let cancelled = false;
    animateWindowScroll(targetY, SCROLL_DURATION_MS).then(() => {
      if (cancelled) return;
      setView((current) =>
        current.phase === "pending"
          ? { slug: current.slug, phase: "open" }
          : current,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [view]);

  // Close choreography (all viewports): the photos have already folded away
  // in this commit; keep the document tall with the spacer, glide back down
  // to where the folders originally sat, then drop the spacer (it is below
  // the viewport by then, so nothing jumps).
  useLayoutEffect(() => {
    if (view.phase !== "idle" || !restoreRef.current) return undefined;
    restoreRef.current = false;

    let cancelled = false;
    animateWindowScroll(savedScrollYRef.current, SCROLL_DURATION_MS).then(
      () => {
        if (!cancelled) setSpacerHeight(0);
      },
    );
    return () => {
      cancelled = true;
      setSpacerHeight(0);
    };
  }, [view]);

  if (view.phase === "open" && selectedSection) {
    return (
      <div ref={detailRef}>
        <InlineFolderPhotos section={selectedSection} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div
      ref={foldersRootRef}
      className="inline-gallery-folders"
      onClickCapture={openFolderInPlace}
    >
      <GalleryPage />
      {pendingSection ? (
        // Zero-height clip: the copy can be measured without adding any
        // height to the document while it exists.
        <div
          aria-hidden="true"
          style={{
            height: 0,
            overflow: "hidden",
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          <div ref={measureRef}>
            <InlineFolderPhotos section={pendingSection} onBack={() => { }} />
          </div>
        </div>
      ) : null}
      <div ref={spacerRef} aria-hidden="true" style={{ height: spacerHeight }} />
    </div>
  );
}
