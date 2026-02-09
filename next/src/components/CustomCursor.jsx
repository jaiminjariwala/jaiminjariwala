"use client";

import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("select-white");

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
      updateCursorType(elementUnderMouse);
    };

    const animate = () => {
      const speed = 0.9;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }

      requestAnimationFrame(animate);
    };

    const updateCursorType = (element) => {
      if (!element) {
        setCursorType("select-white");
        return;
      }

      const isInteractive =
        element.tagName === "A" ||
        element.tagName === "BUTTON" ||
        element.closest("a") ||
        element.closest("button") ||
        element.classList.contains("cursor-pointer") ||
        element.closest(".cursor-pointer") ||
        element.classList.contains("hero-arrow") ||
        element.closest(".hero-arrow") ||
        element.classList.contains("menu-text") ||
        element.closest(".menu-text") ||
        element.classList.contains("close-menu") ||
        element.closest(".close-menu");

      const isText =
        element.tagName === "P" ||
        element.tagName === "H1" ||
        element.tagName === "H2" ||
        element.tagName === "H3" ||
        element.tagName === "H4" ||
        element.tagName === "H5" ||
        element.tagName === "H6" ||
        element.tagName === "SPAN" ||
        element.closest("p") ||
        element.closest("h1") ||
        element.closest("h2") ||
        element.closest("h3") ||
        element.closest("h4") ||
        element.closest("h5") ||
        element.closest("h6") ||
        element.closest("span");

      if (isInteractive) {
        setCursorType("hand");
      } else if (isText) {
        setCursorType("text-white");
      } else {
        setCursorType("select-white");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor ${cursorType}`} />;
};

export default CustomCursor;
