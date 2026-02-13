"use client";

import { useEffect, useRef, useState } from "react";

const getCursorType = (element) => {
  if (!element) return "select-black";

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
  const [cursorType, setCursorType] = useState("select-black");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.style.setProperty("cursor", "none", "important");
    document.body.style.setProperty("cursor", "none", "important");

    const styleTag = document.createElement("style");
    styleTag.innerHTML = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleTag);

    const onPointerMove = (event) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const x = event.clientX;
      const y = event.clientY;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const elementUnderPointer = document.elementFromPoint(x, y);
      setCursorType(getCursorType(elementUnderPointer));
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
