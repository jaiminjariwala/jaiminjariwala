"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCloudinaryUrl, getPhotoId, getPhotoPosition } from "@/components/galleryData";

const hashText = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const randomBetween = (seed, min, max) => min + (seed / 4294967295) * (max - min);
const BASE_DROP = 26;

export default function GalleryFolderPhotosPage({ section }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        router.push("/gallery");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="mx-auto w-full max-w-[689px] pt-2 md:pt-6" style={{ paddingLeft: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)', paddingRight: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)' }}>
        <Link
          href="/gallery"
          aria-label="Back to gallery"
          className="inline-flex h-[24px] w-[24px] items-center justify-center"
        >
          <Image src="/icons/left-arrow.svg" alt="" aria-hidden="true" width={22} height={20} priority />
        </Link>

        <h1 className="mt-[10px] text-[32px] leading-none tracking-[-0.02em] [-webkit-text-stroke:0.5px_#000000]">
          {section.title}
        </h1>
      </div>

      <div className="gallery-photo-scroll relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="gallery-photo-row flex w-max items-start">
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
                  draggable="false"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
