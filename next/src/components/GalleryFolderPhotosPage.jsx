"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCloudinaryUrl } from "@/components/galleryData";

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
        <div className="inline-flex items-center">
          <Link
            href="/gallery"
            className="inline-flex cursor-pointer text-[18px] font-normal leading-none tracking-[-0.02em] text-[#0b65d8]"
          >
            Back to gallery
          </Link>
          <span className="ml-[8px] hidden text-[18px] font-normal leading-none tracking-[-0.02em] text-[#5f6673] md:inline">
            (press Delete or Backspace)
          </span>
        </div>
        <h1 className="mt-[12px] text-[32px] leading-none tracking-[-0.02em] [-webkit-text-stroke:0.5px_#000000]">
          {section.title}
        </h1>
      </div>

      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mt-10">
        <div className="flex min-h-[380px] w-max items-start px-5 pb-8 pt-16 md:min-h-[980px] md:px-12 md:pb-16 md:pt-36">
          {section.photos.map((publicId, index) => {
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
                  borderWidth: "16px 16px 52px 16px",
                  borderRadius: "6px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCloudinaryUrl(publicId, 1400)}
                  alt={`${section.title} photo ${index + 1}`}
                  className="block h-[220px] w-[185px] object-cover md:h-[500px] md:w-[418px]"
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
