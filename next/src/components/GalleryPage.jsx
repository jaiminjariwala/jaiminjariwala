"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";
import { folders } from "@/components/galleryData";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

function GlassFolder({ title, count, images, slug }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/gallery/${slug}`}
      className="gallery-folder-card block w-[198px] cursor-pointer"
    >
      <div
        className="gallery-folder-visual"
        style={styles.folderAnchor}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.backPlate} />
        <div style={styles.backPlateInnerShadow} />
        <div style={styles.paperStackShadow} />

        <div
          style={{
            ...styles.paper,
            ...styles.paperFarLeft,
            backgroundImage: `url(${images[0]})`,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(-20px) rotateZ(-40deg)"
              : "translate(-50%, 16px) translateX(-18px) rotateZ(-8deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperInnerLeft,
            backgroundImage: `url(${images[1]})`,
            transform: isHovered
              ? "translate(-50%, -72px) translateX(-2px) rotateZ(-22deg)"
              : "translate(-50%, 10px) translateX(-6px) rotateZ(-2deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperInnerRight,
            backgroundImage: `url(${images[2]})`,
            transform: isHovered
              ? "translate(-50%, -72px) translateX(2px) rotateZ(22deg)"
              : "translate(-50%, 10px) translateX(6px) rotateZ(2deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperFarRight,
            backgroundImage: `url(${images[3]})`,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(20px) rotateZ(40deg)"
              : "translate(-50%, 16px) translateX(18px) rotateZ(8deg)",
          }}
        />

        <div style={styles.glassPerspectiveWrapper}>
          <div
            style={{
              ...styles.glassShape,
              transform: isHovered ? "rotateX(-18deg)" : "rotateX(0deg)",
            }}
          />
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
        className="gallery-folder-title mt-[25px] text-center font-normal leading-[1.35] tracking-[-0.01em] text-[#2b2f35] [-webkit-text-stroke:0.3px_#000000]"
        style={{ fontSize: "clamp(21px, 3.5vw, 24px)", marginBottom: 5 }}
      >
        {title}
      </p>
      <p className="mt-[-2px] mb-0 text-center text-[18px] font-normal leading-none tracking-[-0.02em] text-[#0b65d8]">
        {count}
      </p>
    </Link>
  );
}

const styles = {
  folderAnchor: {
    position: "relative",
    width: "198px",
    height: "170px",
    perspective: "1500px",
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
      'path("M 0 34 C 0 25 6 17 14 17 L 56 17 C 62 17 67 19 71 22 L 78 29 C 82 32 86 34 92 34 L 190 34 C 194 34 198 38 198 42 L 198 140 C 198 147 193 152 186 152 L 12 152 C 5 152 0 147 0 140 Z")',
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.56), 0 7px 14px rgba(12, 40, 63, 0.24)",
    zIndex: 1,
  },
  paper: {
    position: "absolute",
    left: "50%",
    top: "34px",
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
  paperFarLeft: { width: "95px", height: "102px", zIndex: 3 },
  paperInnerLeft: { width: "100px", height: "108px", zIndex: 4 },
  paperInnerRight: { width: "100px", height: "108px", zIndex: 5 },
  paperFarRight: { width: "95px", height: "102px", zIndex: 6 },
  backPlateInnerShadow: {
    position: "absolute",
    top: "48px",
    left: "0px",
    right: "0px",
    height: "65px",
    borderRadius: "10px 10px 0 0",
    background:
      "linear-gradient(to bottom, rgba(20,90,140,0.38) 0%, rgba(20,90,140,0.12) 55%, transparent 100%)",
    filter: "blur(5px)",
    zIndex: 2,
    pointerEvents: "none",
  },
  paperStackShadow: {
    position: "absolute",
    top: "44px",
    left: "18px",
    right: "18px",
    height: "28px",
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
  },
  glassShape: {
    width: "100%",
    height: "100%",
    position: "relative",
    background:
      "linear-gradient(180deg, #76c8ef 0%, #60bbe7 56%, #4eaedd 100%)",
    border: "none",
    borderRadius: "12px",
    overflow: "hidden",
    transformOrigin: "bottom center",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.42), 0 8px 18px rgba(12, 40, 63, 0.2)",
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
};

const GalleryPage = () => {
  return (
    <section className="relative min-h-screen bg-white text-black flex flex-col">
      <style jsx global>{`
        @keyframes gallery-sun-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 767px) {
          .gallery-sun-wrapper {
            display: none !important;
          }

          .gallery-heading {
            margin-bottom: 44px !important;
          }

          .gallery-folder-grid {
            justify-content: center !important;
            column-gap: 22px !important;
            row-gap: 16px !important;
          }

          .gallery-folder-card {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .gallery-folder-visual {
            transform: scale(0.86);
            transform-origin: top center;
            margin-bottom: -22px;
          }

          .gallery-folder-title {
            margin-top: 8px !important;
          }
        }
      `}</style>

      <Navbar />

      <div className="gallery-sun-wrapper group absolute left-[80px] top-[60px] z-[60] cursor-pointer md:left-[12px] md:top-[12px]">
        <Image
          src="/sun_exact_4k.svg"
          alt="Sun illustration"
          width={560}
          height={560}
          priority
          className="block h-auto w-[250px] md:w-[390px]"
          style={{
            animation: "gallery-sun-spin 24s linear infinite",
            transformOrigin: "50% 50%",
            willChange: "transform",
          }}
        />
        <div className="pointer-events-none absolute left-[6%] top-full mt-[8px] w-max max-w-[calc(100vw-24px)] whitespace-nowrap rounded-[4px] bg-white/95 px-3 py-2 text-[18px] leading-[1.3] tracking-[-0.01em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.16)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:text-[15px]">
          Missing sunshine a lot.
        </div>
      </div>

      <div
        className="mx-auto w-full max-w-[689px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="mt-[38px]">
          <p
            className={`${shortStack.className} gallery-heading mb-[100px] inline-block text-[clamp(24px,4.3vw,34px)] leading-[1.08] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
          >
            Sharing my travel{" "}
            <span className="inline-block bg-[#81d653] pt-0 pb-[5px] leading-[0.9]">
              photos
            </span>{" "}
            here ;)
          </p>

          <div className="gallery-folder-grid flex flex-wrap items-start justify-between gap-x-[16px] md:gap-x-[47px] gap-y-[20px]">
            {folders.map((folder) => (
              <GlassFolder
                key={folder.title}
                title={folder.title}
                count={folder.count}
                images={folder.images}
                slug={folder.slug}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default GalleryPage;
