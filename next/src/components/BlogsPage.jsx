"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";

// ── bezier helpers (shared pattern) ──
function _hhPause(ms) { return new Promise(r => setTimeout(r, ms)); }
function _hhAnim(el, kf, opts) { return new Promise(resolve => { const a = el.animate(kf, opts); a.onfinish = resolve; a.oncancel = resolve; }); }
function _hhQBez(P0, P1, P2, t) { const m = 1-t; return { x: m*m*P0.x+2*m*t*P1.x+t*t*P2.x, y: m*m*P0.y+2*m*t*P1.y+t*t*P2.y }; }
function _hhArcFrames(P0, P1, P2, n=8) { return Array.from({length:n+1},(_,i)=>{ const p=_hhQBez(P0,P1,P2,i/n); return {transform:`translate(${p.x}px,${p.y}px)`}; }); }

function BlogHint({ targetRef }) {
  const cursorRef             = useRef(null);
  const deadRef               = useRef(false);
  const [active, setActive]   = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [pos,    setPos]      = useState(null);

  const dismiss = () => {
    deadRef.current = true;
    setShowTip(false);
    setActive(false);
    try { localStorage.setItem('blog-hint-seen','1'); } catch {}
  };

  useEffect(() => {
    try { if (localStorage.getItem('blog-hint-seen')) return; } catch { return; }
    const t = setTimeout(() => {
      const el = targetRef?.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const tx = r.right - 10;
      const ty = r.bottom - 6;
      const P0 = { x: tx + 130, y: ty + 90 };
      const P1 = { x: tx + 30, y: ty + 110 };
      const P2 = { x: tx, y: ty };
      setPos({ P0, P1, P2, tx, ty, ttx: r.right - 40, tty: r.bottom + 36 });
      setActive(true);
    }, 1400);
    return () => clearTimeout(t);
  }, [targetRef]);

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
      try { localStorage.setItem('blog-hint-seen','1'); } catch {}
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
          Click to read a blog.
        </div>
      )}
    </>
  );
}

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

const BlogsPage = () => {
  const blogLinkRef = useRef(null);
  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="mt-[38px]">
          <p
            className="block text-[clamp(18px,3.5vw,21px)] font-normal leading-none tracking-[-0.01em] "
            style={{ margin: 0, padding: 0, lineHeight: 1 }}
          >
            February 10, 2026
          </p>

          <Link
            ref={blogLinkRef}
            href="/blogs/blog1"
            className={`${shortStack.className} mt-[10px] inline-block text-[clamp(28px,4.3vw,38px)] leading-[0.92] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
          >
            My first blog
          </Link>
          <BlogHint targetRef={blogLinkRef} />
        </div>
      </div>
    </section>
  );
};

export default BlogsPage;
