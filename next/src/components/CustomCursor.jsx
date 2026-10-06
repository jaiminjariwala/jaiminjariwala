"use client";

import { useEffect, useRef, useState } from "react";

const CURSOR_TILT_DEG = -14;

const getCursorType = (element) => {
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

  const isTextual =
    element.matches("p, h1, h2, h3, h4, h5, h6, span, li, strong, em, b, i") ||
    element.closest("p, h1, h2, h3, h4, h5, h6, span, li, strong, em, b, i");

  return isTextual ? "text" : "select-black";
};

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorTypeRef = useRef("select-black");
  const [cursorType, setCursorType] = useState("select-black");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.style.setProperty("cursor", "none", "important");
    document.body.style.setProperty("cursor", "none", "important");

    const styleTag = document.createElement("style");
    styleTag.innerHTML = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleTag);
    const samples = new Map();
    const sampleSurface = (element, x, y) => {
      if (element?.tagName === "IMG") {
        const source = element.currentSrc || element.src;
        if (!samples.has(source)) {
          samples.set(source, null);
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = 128;
              canvas.height = Math.max(1, Math.round(128 * image.height / image.width));
              const context = canvas.getContext("2d", { willReadFrequently: true });
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
              samples.set(source, { context, width: canvas.width, height: canvas.height, ratio: image.width / image.height });
            } catch { /* Cross-origin images fall back to their backing surface. */ }
          };
          image.src = source;
        }
        const sample = samples.get(source);
        if (sample) {
          const rect = element.getBoundingClientRect();
          const contained = getComputedStyle(element).objectFit === "contain";
          const width = contained ? Math.min(rect.width, rect.height * sample.ratio) : rect.width;
          const height = contained ? width / sample.ratio : rect.height;
          const px = (x - rect.left - (rect.width - width) / 2) / width;
          const py = (y - rect.top - (rect.height - height) / 2) / height;
          if (px >= 0 && px < 1 && py >= 0 && py < 1) {
            try {
              const [r, g, b, alpha] = sample.context.getImageData(Math.floor(px * sample.width), Math.floor(py * sample.height), 1, 1).data;
              if (alpha > 200) return .2126 * r + .7152 * g + .0722 * b > 145 ? "light" : "dark";
            } catch { /* Fall back if canvas sampling is unavailable. */ }
          }
        }
      }
      for (let node = element; node; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (color && (color.length < 4 || color[3] > .8)) return .2126 * color[0] + .7152 * color[1] + .0722 * color[2] > 145 ? "light" : "dark";
      }
      return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    };

    const onPointerMove = (event) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const x = event.clientX;
      const y = event.clientY;

      const elementUnderPointer = document.elementFromPoint(x, y);
      cursor.dataset.surface = sampleSurface(elementUnderPointer, x, y);
      const nextType = getCursorType(elementUnderPointer);
      cursorTypeRef.current = nextType;
      setCursorType(nextType);

      // Only the select cursor tilts; text and hand stay upright.
      const tilt = nextType === "select-black" ? ` rotate(${CURSOR_TILT_DEG}deg)` : "";
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)${tilt}`;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.head.removeChild(styleTag);
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor ${cursorType}`} />;
};

export default CustomCursor;
