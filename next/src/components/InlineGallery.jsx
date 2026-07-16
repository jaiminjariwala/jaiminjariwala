"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryPage from "@/components/GalleryPage";
import {
  getCloudinaryUrl,
  getPhotoId,
  getPhotoPosition,
  getSectionBySlug,
} from "@/components/galleryData";

const BASE_DROP = 22;

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
  const [selectedSlug, setSelectedSlug] = useState(null);
  const selectedSection = selectedSlug
    ? getSectionBySlug(selectedSlug)
    : null;

  const openFolderInPlace = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href^="/gallery/"]');
    const href = link?.getAttribute("href");
    const slug = href?.split("/").filter(Boolean).pop();
    const gallerySection = link?.closest(".home-story-gallery");
    if (!slug || !getSectionBySlug(slug)) return;

    event.preventDefault();
    event.stopPropagation();
    setSelectedSlug(slug);

    // The folders are replaced in place. On mobile, wait for React to commit
    // the detail view, then scroll only by the amount the first polaroid (plus
    // its shadow) extends below the viewport. This preserves as much of the
    // preceding paragraph as possible instead of pinning the gallery to the top.
    if (
      gallerySection instanceof HTMLElement &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const firstPolaroid = gallerySection.querySelector(
            ".inline-gallery-photo-row > article",
          );
          if (!(firstPolaroid instanceof HTMLElement)) return;

          const shadowClearance = 36;
          const safeViewportBottom = window.innerHeight - 16;
          const hiddenBottom =
            firstPolaroid.getBoundingClientRect().bottom +
            shadowClearance -
            safeViewportBottom;
          if (hiddenBottom <= 0) return;

          const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          window.scrollBy({
            top: Math.ceil(hiddenBottom),
            behavior: reduceMotion ? "auto" : "smooth",
          });
        });
      });
    }
  };

  if (selectedSection) {
    return (
      <InlineFolderPhotos
        section={selectedSection}
        onBack={() => setSelectedSlug(null)}
      />
    );
  }

  return (
    <div
      className="inline-gallery-folders"
      onClickCapture={openFolderInPlace}
    >
      <GalleryPage />
    </div>
  );
}
