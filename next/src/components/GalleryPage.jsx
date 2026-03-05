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

        <div
          style={{
            ...styles.paper,
            ...styles.paperLeft,
            backgroundImage: `url(${images[0]})`,
            transform: isHovered
              ? "translate(-50%, -48px) translateX(-52px) rotateY(26deg) rotateZ(-16deg)"
              : "translate(-50%, 2px) translateX(-24px) rotateY(14deg) rotateZ(-7deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperMid,
            backgroundImage: `url(${images[1]})`,
            transform: isHovered
              ? "translate(-50%, -44px) translateX(0px) rotateZ(3deg)"
              : "translate(-50%, 10px) translateX(0px) rotateZ(1deg)",
          }}
        />

        <div
          style={{
            ...styles.paper,
            ...styles.paperRight,
            backgroundImage: `url(${images[2]})`,
            transform: isHovered
              ? "translate(-50%, -40px) translateX(52px) rotateY(-26deg) rotateZ(16deg)"
              : "translate(-50%, 14px) translateX(24px) rotateY(-14deg) rotateZ(7deg)",
          }}
        />

        <div style={styles.glassPerspectiveWrapper}>
          <div
            style={{
              ...styles.glassShape,
              transform: isHovered ? "rotateX(-18deg)" : "rotateX(0deg)",
            }}
          >
            <div style={styles.glassTopLine} />
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
    border: "1px solid #3a97c7",
    background: "linear-gradient(180deg, #74cdf8 0%, #58bbea 58%, #44a9dc 100%)",
    overflow: "hidden",
    clipPath:
      'path("M 0 34 C 0 25 6 17 14 17 L 56 17 C 62 17 67 19 71 22 L 78 29 C 82 32 86 34 92 34 L 190 34 C 194 34 198 38 198 42 L 198 140 C 198 147 193 152 186 152 L 12 152 C 5 152 0 147 0 140 Z")',
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.58), 0 8px 18px rgba(7,22,36,0.3)",
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
    zIndex: 2,
  },
  paperLeft: { width: "98px", height: "104px", zIndex: 2 },
  paperMid: { width: "104px", height: "112px", zIndex: 3 },
  paperRight: { width: "100px", height: "108px", zIndex: 4 },
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
    background: "linear-gradient(180deg, #79cff8 0%, #5cbde9 56%, #49addd 100%)",
    border: "1.4px solid #3895c4",
    borderRadius: "10px",
    overflow: "hidden",
    transformOrigin: "bottom center",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.56), 0 8px 26px rgba(0,0,0,0.14)",
  },
  glassTopLine: {
    position: "absolute",
    left: "8px",
    right: "8px",
    top: "7px",
    height: "3px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.62)",
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
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px] pb-[72px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="mt-[26px] md:mt-[34px]">
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
    </section>
  );
};

export default GalleryPage;
