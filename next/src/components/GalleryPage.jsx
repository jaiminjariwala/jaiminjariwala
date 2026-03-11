"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
      className="gallery-folder-card block w-[185px] cursor-pointer"
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
    width: "185px",
    height: "159px",
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

// ── bezier helpers ──
function _hhPause(ms) { return new Promise(r => setTimeout(r, ms)); }
function _hhAnim(el, kf, opts) { return new Promise(resolve => { const a = el.animate(kf, opts); a.onfinish = resolve; a.oncancel = resolve; }); }
function _hhQBez(P0, P1, P2, t) { const m = 1-t; return { x: m*m*P0.x+2*m*t*P1.x+t*t*P2.x, y: m*m*P0.y+2*m*t*P1.y+t*t*P2.y }; }
function _hhArcFrames(P0, P1, P2, n=8) { return Array.from({length:n+1},(_,i)=>{ const p=_hhQBez(P0,P1,P2,i/n); return {transform:`translate(${p.x}px,${p.y}px)`}; }); }

function SunHint({ targetRef }) {
  const cursorRef           = useRef(null);
  const deadRef             = useRef(false);
  const [active, setActive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [pos,    setPos]    = useState(null);

  // Instant dismiss when user hovers the target
  const dismiss = () => {
    deadRef.current = true;
    setShowTip(false);
    setActive(false);
    try { localStorage.setItem('sun-hint-seen','1'); } catch {}
  };

  useEffect(() => {
    try { if (localStorage.getItem('sun-hint-seen')) return; } catch { return; }
    const t = setTimeout(() => {
      const el = targetRef?.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const tx = r.left + r.width  * 0.42;
      const ty = r.top  + r.height * 0.48;
      const P0 = { x: tx + 130, y: ty + 90 };
      const P1 = { x: tx + 30, y: ty + 110 };
      const P2 = { x: tx, y: ty };
      setPos({ P0, P1, P2, tx, ty, ttx: r.left + 14, tty: r.bottom + 10 });
      setActive(true);
    }, 1600);
    return () => clearTimeout(t);
  }, [targetRef]);

  // Attach hover-dismiss listener to target
  useEffect(() => {
    if (!active) return;
    const el = targetRef?.current;
    if (!el) return;
    el.addEventListener('mouseenter', dismiss);
    return () => el.removeEventListener('mouseenter', dismiss);
  }, [active, targetRef]);

  useEffect(() => {
    if (!active || !pos) return;
    deadRef.current = false;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const { P0, P1, P2, tx, ty } = pos;
    (async () => {
      cursor.style.opacity   = '0';
      cursor.style.transform = `translate(${P0.x}px,${P0.y}px)`;
      await _hhPause(40); if (deadRef.current) return;
      await _hhAnim(cursor, [{opacity:0},{opacity:1}], {duration:200,fill:'forwards'}); if (deadRef.current) return;
      await _hhAnim(cursor, _hhArcFrames(P0,P1,P2,8), {duration:900,easing:'ease-in-out',fill:'forwards'}); if (deadRef.current) return;
      await _hhAnim(cursor, [{transform:`translate(${tx}px,${ty}px) scale(1)`},{transform:`translate(${tx}px,${ty+5}px) scale(0.82)`}], {duration:100,easing:'ease-in',fill:'forwards'}); if (deadRef.current) return;
      setShowTip(true);
      await _hhAnim(cursor, [{transform:`translate(${tx}px,${ty+5}px) scale(0.82)`},{transform:`translate(${tx}px,${ty}px) scale(1)`}], {duration:130,easing:'ease-out',fill:'forwards'}); if (deadRef.current) return;
      await _hhPause(2800); if (deadRef.current) return;
      setShowTip(false);
      await _hhAnim(cursor, [{opacity:1},{opacity:0}], {duration:280,fill:'forwards'});
      setActive(false);
      try { localStorage.setItem('sun-hint-seen','1'); } catch {}
    })();
    return () => { deadRef.current = true; };
  }, [active, pos]);

  if (!active || !pos) return null;
  return (
    <>
      <style>{`@keyframes hh-in{from{opacity:0;transform:translateY(5px) scale(0.94)}to{opacity:1;transform:none}}`}</style>
      <div ref={cursorRef} aria-hidden="true" style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none',userSelect:'none',willChange:'transform,opacity',filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.30))'}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hand-cursor.png" alt="" draggable={false} style={{width:'34px',height:'auto',display:'block'}} />
      </div>
      {showTip && (
        <div aria-hidden="true" style={{position:'fixed',top:pos.tty,left:pos.ttx,zIndex:9999,pointerEvents:'none',whiteSpace:'nowrap',animation:'hh-in 0.2s ease forwards'}}
          className="rounded-[4px] bg-white/95 px-3 py-2 text-[18px] leading-[1.3] tracking-[-0.01em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.16)] md:text-[15px]">
          Hover on the sun for a little secret.
        </div>
      )}
    </>
  );
}

const GalleryPage = () => {
  const sunRef = useRef(null);
  return (
    <section className="relative h-screen bg-white text-black flex flex-col overflow-hidden">
      <Navbar />

      <div ref={sunRef} className="gallery-sun-wrapper group absolute left-[20px] top-[20px] z-[60] cursor-pointer md:left-[12px] md:top-[12px]">
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
          Chasing sunshine, one photo at a time. ☀️
        </div>
      </div>

      <div className="gallery-airplane-wrapper group fixed bottom-[20px] right-[20px] z-[60] cursor-pointer">
        <Image
          src="/airplane_4k_transparent.svg"
          alt="Airplane illustration"
          width={560}
          height={560}
          className="block h-auto w-[250px] md:w-[390px]"
          priority={false}
        />
        <div className="pointer-events-none absolute bottom-full right-[6%] mb-[8px] w-max max-w-[calc(100vw-24px)] whitespace-nowrap rounded-[4px] bg-white/95 px-3 py-2 text-[18px] leading-[1.3] tracking-[-0.01em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.16)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:text-[15px]">
          Wanna fly to California!
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-full max-w-[689px]"
          style={{
            marginTop: "-75px",
            paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
            paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          }}
        >
          {/* <p
            className={`${shortStack.className} gallery-heading mb-[100px] inline-block text-[clamp(24px,4.3vw,34px)] leading-[1.08] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
          >
            Sharing my travel{" "}
            <span className="inline-block bg-[#81d653] pt-0 pb-[5px] leading-[0.9]">
              photos
            </span>{" "}
            here ;)
          </p> */}

          <div className="gallery-folder-grid flex flex-wrap items-start justify-between gap-y-[20px]">
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

      <SunHint targetRef={sunRef} />
    </section>
  );
};

export default GalleryPage;
