"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

// offset: gap kept above the section after the jump. Photo targets ("Me",
// "My Background") use 0 so the image lands flush with the top edge of the
// screen; text targets keep a small breathing gap.
const MENU_ITEMS = [
  { label: "Home", target: "home", offset: 0 },
  { label: "Me", target: "me", offset: 0 },
  { label: "Currently", target: "currently", offset: 0 },
  { label: "My Background", target: "background", offset: 0 },
  { label: "Projects", target: "projects", offset: 16 },
  { label: "GitHub", target: "github", offset: 0 },
  { label: "Gallery", target: "gallery", offset: 16 },
  // External profiles open in a new tab instead of jumping to a section.
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jaiminjariwala/" },
  { label: "LeetCode", href: "https://leetcode.com/u/jaiminjariwala/" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll behind the open overlay; Escape closes it.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const goTo = (event, item) => {
    event.preventDefault();
    setIsOpen(false);

    // Wait two frames so the scroll lock is released before scrolling.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const behavior = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
          ? "auto"
          : "smooth";

        if (item.target === "home") {
          window.scrollTo({ top: 0, behavior });
          return;
        }

        const el = document.getElementById(item.target);
        if (!el) return;
        const top =
          el.getBoundingClientRect().top + window.scrollY - item.offset;
        window.scrollTo({ top: Math.max(0, top), behavior });
      });
    });
  };

  return (
    <>
      <button
        type="button"
        className={`mobile-menu-button${isOpen ? " is-open" : ""}`}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-overlay"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {isOpen ? (
        <nav
          id="mobile-menu-overlay"
          className="mobile-menu-overlay"
          aria-label="Site sections"
        >
          <ul className="mobile-menu-list">
            {MENU_ITEMS.map((item, index) => (
              <li
                key={item.label}
                style={{ animationDelay: `${80 + index * 55}ms` }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${playfair.className} mobile-menu-link`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={`#${item.target}`}
                    className={`${playfair.className} mobile-menu-link`}
                    onClick={(event) => goTo(event, item)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
