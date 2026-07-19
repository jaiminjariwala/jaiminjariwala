"use client";

// Desktop-only floating nav: a bare column of words on the left edge,
// vertically centered. Clicking a word scrolls to its section, then the
// section's TEXT flashes like a full mouse selection — gray bands cover the
// whole line height, so consecutive lines merge into one block — holds a
// beat, and fades away. The three external profiles are styled as inline
// links (teal, underlined) and just open in a new tab.

const SIDEBAR_ITEMS = [
  // "home" scrolls to the very top; the hero heading is what flashes.
  { label: "think big", target: "home", flashSelector: ".home-hero-title" },
  { label: "me", target: "me", flashSelector: ".home-hero-copy p" },
  { label: "currently", target: "currently", flashSelector: "#currently p" },
  {
    label: "background",
    target: "background",
    flashSelector: "#background .home-story-copy p",
  },
  {
    label: "project 1",
    target: "projects",
    flashSelector: "#projects .projects-embedded-desc",
  },
  {
    label: "github work",
    target: "github",
    flashSelector: "#github-contributions-title",
  },
  {
    label: "project 2",
    target: "project-2",
    flashSelector: "#project-2 .projects-embedded-desc",
  },
  // The gallery is all images — nothing textual to flash, so just scroll.
  { label: "gallery", target: "gallery" },
  { label: "linkedin", href: "https://www.linkedin.com/in/jaiminjariwala/" },
  { label: "leetcode", href: "https://leetcode.com/u/jaiminjariwala/" },
  { label: "github", href: "https://github.com/jaiminjariwala" },
];

// Breathing room kept above a section after the jump.
const SCROLL_OFFSET = 24;

// Cancels whatever the previous click is still doing (settle watcher or a
// running flash) so two quick clicks never fight each other.
let cancelPending = null;

// Full selection-style flash: measure the text's line boxes, then lay
// opaque gray strips BEHIND the text (negative z-index inside the
// element's own stacking context), one per line, stretched so consecutive
// lines touch. Because the strips sit behind the glyphs they can never
// clip tight-leading headings, and because the fade is a single group
// opacity on their container, overlapping strips never show seams.
const flashText = (element) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rects = Array.from(range.getClientRects()).filter(
    (r) => r.width > 4 && r.height > 4,
  );
  if (rects.length === 0) return;

  // Merge the per-fragment rects (plain text, bold spans, links) into one
  // band per line.
  rects.sort((a, b) => a.top - b.top || a.left - b.left);
  const lines = [];
  rects.forEach((r) => {
    const line = lines[lines.length - 1];
    if (line && Math.abs(r.top - line.top) < 8) {
      line.left = Math.min(line.left, r.left);
      line.right = Math.max(line.right, r.right);
      line.bottom = Math.max(line.bottom, r.bottom);
    } else {
      lines.push({
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
      });
    }
  });

  const elRect = element.getBoundingClientRect();
  const overlay = document.createElement("span");
  overlay.className = "text-flash-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const EDGE = 3; // little extension above the first / below the last line
  lines.forEach((line, index) => {
    const top = index === 0 ? line.top - EDGE : line.top;
    const bottom =
      index === lines.length - 1
        ? line.bottom + EDGE
        : Math.max(lines[index + 1].top, line.bottom);
    const strip = document.createElement("span");
    strip.className = "text-flash-strip";
    strip.style.top = `${top - elRect.top}px`;
    strip.style.height = `${bottom - top}px`;
    strip.style.left = `${line.left - elRect.left - 2}px`;
    strip.style.width = `${line.right - line.left + 4}px`;
    overlay.appendChild(strip);
  });

  element.classList.add("text-flash-host");
  element.appendChild(overlay);

  let safetyTimer = 0;
  const cleanup = () => {
    window.clearTimeout(safetyTimer);
    overlay.removeEventListener("animationend", cleanup);
    overlay.remove();
    element.classList.remove("text-flash-host");
    if (cancelPending === cleanup) cancelPending = null;
  };
  overlay.addEventListener("animationend", cleanup);
  // Clean up even if animationend never fires for any reason.
  safetyTimer = window.setTimeout(cleanup, 1700);
  cancelPending = cleanup;
};

// Wait until the smooth scroll stops moving (or times out), then flash, so
// the highlight always plays where the visitor is actually looking.
const flashWhenSettled = (element) => {
  let cancelled = false;
  cancelPending = () => {
    cancelled = true;
  };

  let lastY = window.scrollY;
  let stableFrames = 0;
  const startedAt = performance.now();

  const tick = () => {
    if (cancelled) return;
    const currentY = window.scrollY;
    if (Math.abs(currentY - lastY) < 1) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
    }
    lastY = currentY;

    if (stableFrames >= 8 || performance.now() - startedAt > 2000) {
      flashText(element);
      return;
    }
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
};

export default function DesktopSidebar() {
  const goTo = (event, item) => {
    event.preventDefault();
    cancelPending?.();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = reduceMotion ? "auto" : "smooth";

    if (item.target === "home") {
      window.scrollTo({ top: 0, behavior });
    } else {
      const el = document.getElementById(item.target);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }

    const flashEl = item.flashSelector
      ? document.querySelector(item.flashSelector)
      : null;
    if (flashEl && !reduceMotion) flashWhenSettled(flashEl);
  };

  return (
    <>
      {/* iOS-style progressive blur behind the sidebar: invisible on the
          white page, but full-bleed content (the photo carousel) melts into
          a soft cloud as it slides underneath the words. Six stacked
          backdrop-blur layers with staggered gradient masks ramp the blur
          strength down smoothly, so there is no visible seam anywhere. */}
      <div className="desktop-sidebar-veil" aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <nav className="desktop-sidebar" aria-label="Section shortcuts">
        <ul className="desktop-sidebar-list">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desktop-sidebar-link desktop-sidebar-external"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  href={`#${item.target}`}
                  className="desktop-sidebar-link"
                  onClick={(event) => goTo(event, item)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
