"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const folders = [
  {
    title: "Washington D.C.",
    count: "3 items",
    images: ["/Washington-DC.jpg", "/my-profile-2.png", "/project-1.svg"],
  },
  {
    title: "Arlington",
    count: "5 items",
    images: ["/my-profile-1.png", "/blog-1-image.svg", "/Washington-DC.jpg"],
  },
  {
    title: "Virginia",
    count: "4 items",
    images: ["/project-1.svg", "/my-profile-2.png", "/my-profile-1.png"],
  },
];

function GlassFolder({ title, count, images }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article className="w-[198px]">
      <div
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
            ...styles.paperLeft,
            backgroundImage: `url(${images[0]})`,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(-52px) rotateY(26deg) rotateZ(-22deg)"
              : "translate(-50%, 2px) translateX(-24px) rotateY(14deg) rotateZ(-13deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperMid,
            backgroundImage: `url(${images[1]})`,
            transform: isHovered
              ? "translate(-50%, -70px) translateX(0px) rotateZ(3deg)"
              : "translate(-50%, 6px) translateX(0px) rotateZ(1deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperRight,
            backgroundImage: `url(${images[2]})`,
            transform: isHovered
              ? "translate(-50%, -62px) translateX(52px) rotateY(-26deg) rotateZ(22deg)"
              : "translate(-50%, 6px) translateX(24px) rotateY(-14deg) rotateZ(13deg)",
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

      <p className="mt-[25px] text-center text-[21px] font-normal leading-none tracking-[-0.02em] text-[#2b2f35]" style={{ marginBottom: 5 }}>
        {title}
      </p>
      <p className="mt-[-2px] mb-0 text-center text-[18px] font-normal leading-none tracking-[-0.02em] text-[#0b65d8]">
        {count}
      </p>
    </article>
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
    background: "linear-gradient(180deg, #78cff7 0%, #60c0ec 58%, #49afdf 100%)",
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
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.16)",
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    transformStyle: "preserve-3d",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 3,
  },
  paperLeft: { width: "98px", height: "104px", zIndex: 3 },
  paperMid: { width: "104px", height: "112px", zIndex: 4 },
  paperRight: { width: "100px", height: "108px", zIndex: 5 },
  backPlateInnerShadow: {
    position: "absolute",
    top: "48px",
    left: "0px",
    right: "0px",
    height: "65px",
    borderRadius: "10px 10px 0 0",
    background: "linear-gradient(to bottom, rgba(20,90,140,0.38) 0%, rgba(20,90,140,0.12) 55%, transparent 100%)",
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
    background: "linear-gradient(180deg, #76c8ef 0%, #60bbe7 56%, #4eaedd 100%)",
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
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, transparent 70%)",
    filter: "blur(8px)",
    transition: "all 0.6s ease",
    zIndex: 0,
  },
};

const GalleryPage = () => {
  return (
    <section className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      <div
        className="flex-1 flex items-center"
        style={{
          marginTop: "clamp(-95px, calc((768px - 100vw) * 9999), 0px)",
        }}
      >
        <div
          className="mx-auto w-full max-w-[689px]"
          style={{
            paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
            paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          }}
        >
          <div>
            <div className="flex flex-wrap items-start justify-between gap-x-[16px] md:gap-x-[47px] gap-y-[20px]">
              {folders.map((folder) => (
                <GlassFolder
                  key={folder.title}
                  title={folder.title}
                  count={folder.count}
                  images={folder.images}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryPage;
