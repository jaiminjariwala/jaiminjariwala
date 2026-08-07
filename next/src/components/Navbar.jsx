"use client";

const NAV_ITEMS = [
  { label: "me", target: "me" },
  { label: "gallery", target: "gallery" },
  { label: "education", target: "education" },
  { label: "work2", target: "work-experience-2" },
  { label: "work1", target: "work-experience-1" },
  { label: "project 2", target: "project-2" },
  { label: "project 1", target: "projects" },
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

const Navbar = () => (
  <div className="site-navbar-shell">
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

export default Navbar;
