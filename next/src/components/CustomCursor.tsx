"use client";

import { useEffect, useRef, useState } from "react";

const CURSOR_TILT_DEG = 0;

const getCursorType = (element:Element|null, pressed=false) => {
  const draggable=element?.closest('[data-paper-roll-handle], [data-paper-edge], [data-paper-ink], [data-cursor-type="grab"]');
  if (
    document.documentElement.hasAttribute("data-paper-dragging") ||
    document.querySelector('[data-paper-ink][data-dragging="true"]') ||
    (pressed&&draggable)
  ) {
    return "glove-grip";
  }

  if(draggable)return "glove-open";

  if (!element) return "select-black";

  if (element.closest('[data-cursor-type="select-black"]')) {
    return "select-black";
  }

  const isInteractive =
    element.tagName === "A" ||
    element.tagName === "BUTTON" ||
    element.closest("a") ||
    element.closest("button") ||
    element.classList.contains("cursor-pointer") ||
    element.closest(".cursor-pointer");

  if (isInteractive) return "hand";

  return "select-black";
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTypeRef = useRef("select-black");
  const [cursorType, setCursorType] = useState("select-black");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.setAttribute("data-custom-cursor-active", "");

    const onPointerMove = (event:PointerEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const x = event.clientX;
      const y = event.clientY;

      const elementUnderPointer = document.elementFromPoint(x, y);
      const nextType = getCursorType(elementUnderPointer,(event.buttons&1)!==0);
      cursorTypeRef.current = nextType;
      setCursorType(nextType);

      // Only the select cursor tilts; text and hand stay upright.
      const tilt = nextType === "select-black" ? ` rotate(${CURSOR_TILT_DEG}deg)` : "";
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)${tilt}`;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerMove, { passive: true });
    window.addEventListener("pointercancel", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerup", onPointerMove);
      window.removeEventListener("pointercancel", onPointerMove);
      document.documentElement.removeAttribute("data-custom-cursor-active");
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor ${cursorType}`} />;
};

export default CustomCursor;
