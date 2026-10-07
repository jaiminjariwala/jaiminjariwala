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
      element.replaceChildren(...TEXT.split(" ").flatMap((word, index) => {
        const span = document.createElement("span");
        span.style.whiteSpace = "nowrap";
        span.textContent = word;
        return index ? [document.createTextNode(" "), span] : [span];
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
        mask.setAttribute("aria-hidden", "true");
        const line = document.createElement("span");
        line.className = play ? "intro-line is-entering" : "intro-line";
        line.style.animationDelay = `${index * 110}ms`;
        line.textContent = words.join(" ");
        mask.append(line);
        return mask;
      }));
      element.dataset.ready = "true";
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
    return () => { cancelled = true; observer?.disconnect(); delete element.dataset.ready; };
  }, []);
  return <span ref={ref} className="intro-highlight-text intro-reveal" aria-label={TEXT}><span aria-hidden="true">{TEXT}</span></span>;
}
