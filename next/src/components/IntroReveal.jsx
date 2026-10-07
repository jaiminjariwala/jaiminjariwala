"use client";

import { useLayoutEffect, useRef } from "react";

const TEXT = "Hello, I am Jaimin Mukesh Jariwala. I am a Software Engineer who loves building end-to-end products that people love using and scalable systems that stay reliable under heavy traffic.";

export default function IntroReveal() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const element = ref.current;
    let cancelled = false;
    let observer;
    const layout = (play = false) => {
      element.replaceChildren(...TEXT.split(" ").map(word => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.whiteSpace = "pre";
        span.textContent = word + " ";
        return span;
      }));
      const lines = [];
      let top;
      for (const word of element.children) {
        const nextTop = word.getBoundingClientRect().top;
        if (top === undefined || Math.abs(nextTop - top) > 2) {
          lines.push([]);
          top = nextTop;
        }
        lines.at(-1).push(word.textContent);
      }
      element.replaceChildren(...lines.map((words, index) => {
        const mask = document.createElement("span");
        mask.className = "intro-line-mask";
        const line = document.createElement("span");
        line.className = play ? "intro-line is-entering" : "intro-line";
        line.style.animationDelay = `${160 + index * 110}ms`;
        line.textContent = words.join("").trimEnd();
        mask.append(line);
        return mask;
      }));
    };
    document.fonts.ready.then(() => {
      if (cancelled) return;
      layout(true);
      let width = element.clientWidth;
      observer = new ResizeObserver(() => {
        if (element.clientWidth !== width) {
          width = element.clientWidth;
          layout(false);
        }
      });
      observer.observe(element);
    });
    return () => { cancelled = true; observer?.disconnect(); };
  }, []);
  return <span ref={ref} className="intro-highlight-text intro-reveal" aria-label={TEXT}><span aria-hidden="true">{TEXT}</span></span>;
}
