"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "me", target: "me" },
  { label: "gallery", target: "gallery" },
  { label: "education", target: "education" },
  { label: "work", target: "work-experience-2" },
  { label: "projects", target: "project-2" },
  { label: "github", href: "https://github.com/jaiminjariwala" },
  { label: "leetcode", href: "https://leetcode.com/u/jaiminjariwala/" },
  { label: "linkedin", href: "https://www.linkedin.com/in/jaiminjariwala/" },
];

const flashIntro = () => {
  const intro = document.querySelector(".intro-highlight-text");
  if (!intro) return;

  intro.classList.remove("is-highlighted");
  // Restart the CSS animation on repeated clicks.
  void intro.offsetWidth;
  intro.classList.add("is-highlighted");
  window.setTimeout(() => intro.classList.remove("is-highlighted"), 1200);
};

const Navbar = () => {
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let animationFrame;
    lastScrollY.current = window.scrollY;

    const updateVisibility = () => {
      animationFrame = undefined;
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 24) {
        setIsScrollHidden(false);
      } else if (scrollDelta > 8) {
        setIsScrollHidden(true);
      } else if (scrollDelta < -8) {
        setIsScrollHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`site-navbar-shell${isScrollHidden ? " is-scroll-hidden" : ""}`}>
      <nav className="site-navbar" aria-label="Primary navigation">
        <ul className="site-navbar-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                className={`site-navbar-link${item.href ? " site-navbar-external" : ""}`}
                href={item.href ?? `#${item.target}`}
                onClick={
                  item.target === "me"
                    ? (event) => {
                        event.preventDefault();
                        flashIntro();
                      }
                    : undefined
                }
                {...(item.href
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
