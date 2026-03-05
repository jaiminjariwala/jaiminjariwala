import Link from "next/link";
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
  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="mx-auto w-full max-w-[689px] px-5 pt-2 md:pt-6">
        <Link
          href="/gallery"
          className="inline-flex cursor-pointer text-[16px] leading-none tracking-[-0.01em] text-[#0b65d8] [-webkit-text-stroke:0.2px_#0b65d8]"
        >
          Back to gallery
        </Link>
        <h1 className="mt-[12px] text-[32px] leading-none tracking-[-0.02em] [-webkit-text-stroke:0.5px_#000000]">
          {section.title}
        </h1>
      </div>

      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mt-10">
        <div className="flex min-h-[620px] w-max items-start px-8 pb-12 pt-24 md:min-h-[980px] md:px-12 md:pb-16 md:pt-36">
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
                  className="block h-[332px] w-[278px] object-cover md:h-[500px] md:w-[418px]"
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
