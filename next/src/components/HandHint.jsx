"use client";

import { useEffect, useRef, useState } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

function animEl(el, keyframes, options) {
  return new Promise(resolve => {
    const a = el.animate(keyframes, options);
    a.onfinish = resolve;
    a.oncancel = resolve;
  });
}

// Evaluate a quadratic Bezier at parameter t (0..1)
// P0 = start, P1 = control, P2 = end
function qBez(P0, P1, P2, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x,
    y: mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y,
  };
}

// Build Web Animations keyframes that follow a quadratic Bezier arc
// The control point sits to the right of the straight line, creating the half-U swing
function bezierKeyframes(P0, P1, P2, steps = 6) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const p = qBez(P0, P1, P2, t);
    return { transform: `translate(${p.x}px, ${p.y}px)` };
  });
}

// ── HandHint ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   targetRef   – ref to the element the hand points at
 *   storageKey  – localStorage key (hint shown once per browser)
 *   tooltip     – JSX/string shown in the tooltip bubble
 *   delay       – ms before animation starts (default 1500)
 *
 * Start position: slightly below-right of the target.
 * Path: quadratic Bezier arc that bows out to the right then curves back —
 *       a half-U sweep from below-right to the button.
 */
export default function HandHint({ targetRef, storageKey, tooltip, delay = 1500 }) {
  const cursorRef             = useRef(null);
  const [active, setActive]   = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [pos, setPos]         = useState(null);

  // ── 1. measure & decide whether to show ──────────────────────────────────
  useEffect(() => {
    try { if (localStorage.getItem(storageKey)) return; } catch { return; }

    const t = setTimeout(() => {
      const btn = targetRef?.current;
      if (!btn) return;

      const r  = btn.getBoundingClientRect();
      // Land the finger-tip at the centre-left of the button
      const tx = r.left + r.width  * 0.30;
      const ty = r.top  + r.height * 0.50;

      // Start: slightly below-right (not from the very bottom of the screen)
      const P0 = { x: tx + 72, y: ty + 52 };
      // Control: further right and slightly above mid — creates the outward U swing
      const P1 = { x: tx + 115, y: ty - 10 };
      // End: the button
      const P2 = { x: tx, y: ty };

      // Tooltip appears just below the button
      const ttx = r.left;
      const tty = r.bottom + 10;

      setPos({ P0, P1, P2, tx, ty, ttx, tty });
      setActive(true);
    }, delay);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. run the animation once pos & cursor are ready ─────────────────────
  useEffect(() => {
    if (!active || !pos) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const { P0, P1, P2, tx, ty } = pos;
    let dead = false;

    (async () => {
      // park the cursor at the start, invisible
      cursor.style.opacity   = "0";
      cursor.style.transform = `translate(${P0.x}px, ${P0.y}px)`;
      await pause(40);
      if (dead) return;

      // fade in
      await animEl(cursor,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 200, fill: "forwards" });
      if (dead) return;

      // arc along the bezier curve (half-U swing)
      const frames = bezierKeyframes(P0, P1, P2, 8);
      await animEl(cursor, frames,
        { duration: 900, easing: "ease-in-out", fill: "forwards" });
      if (dead) return;

      // press — nudge down + shrink
      await animEl(cursor,
        [{ transform: `translate(${tx}px, ${ty}px) scale(1)` },
         { transform: `translate(${tx}px, ${ty + 5}px) scale(0.82)` }],
        { duration: 100, easing: "ease-in", fill: "forwards" });
      if (dead) return;

      setShowTip(true);

      // release
      await animEl(cursor,
        [{ transform: `translate(${tx}px, ${ty + 5}px) scale(0.82)` },
         { transform: `translate(${tx}px, ${ty}px) scale(1)` }],
        { duration: 130, easing: "ease-out", fill: "forwards" });
      if (dead) return;

      // hold so user can read
      await pause(2800);
      if (dead) return;

      // fade everything out
      setShowTip(false);
      await animEl(cursor,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 280, fill: "forwards" });

      setActive(false);
      try { localStorage.setItem(storageKey, "1"); } catch {}
    })();

    return () => { dead = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active || !pos) return null;

  return (
    <>
      <style>{`
        @keyframes hh-tip-in {
          from { opacity: 0; transform: translateY(5px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      {/* Hand cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          zIndex: 9999, pointerEvents: "none", userSelect: "none",
          willChange: "transform, opacity",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.30))",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hand-cursor.png"
          alt=""
          draggable={false}
          style={{ width: "34px", height: "auto", display: "block" }}
        />
      </div>

      {/* Tooltip bubble — same style as gallery sun / airplane */}
      {showTip && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top:  pos.tty,
            left: pos.ttx,
            zIndex: 9999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            animation: "hh-tip-in 0.2s ease forwards",
          }}
          className="rounded-[4px] bg-white/95 px-3 py-[8px] text-[15px] leading-[1.4] tracking-[-0.01em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        >
          {tooltip}
        </div>
      )}
    </>
  );
}
