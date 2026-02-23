"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const links = [
  { label: "home", href: "/", isHome: true },
  { label: "about", href: "/about" },
  { label: "hire me", href: "/hire-me" },
  { label: "projects", href: "/projects" },
  { label: "blogs", href: "/blogs" },
  { label: "gallery", href: "/gallery" },
  { label: "contact", href: "/contact" },
];

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktopChange(callback) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

const Navbar = () => {
  const isDesktop = useSyncExternalStore(
    subscribeDesktopChange,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => {
      setNavHeight(navRef.current?.offsetHeight ?? 0);
    });
    ro.observe(navRef.current);
    setNavHeight(navRef.current.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: isDesktop ? "fixed" : "relative",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
          paddingTop: isDesktop ? "60px" : "40px",
          paddingBottom: isDesktop ? "60px" : "40px",
          backgroundColor: "transparent",
        }}
      >
        <ul
          style={{
            margin: 0,
            padding: isDesktop ? 0 : "0 20px",
            listStyle: "none",
            display: "flex",
            flexWrap: isDesktop ? "nowrap" : "wrap",
            alignItems: "center",
            justifyContent: isDesktop ? "space-between" : "flex-start",
            gap: isDesktop ? 0 : "16px 24px",
            backgroundColor: "#ffffff",
            width: isDesktop ? "689px" : "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {links.map((item) => (
            <li key={item.label} style={{ margin: 0, padding: 0 }}>
              {item.isHome ? (
                <Link
                  href={item.href}
                  aria-label="Home"
                  className="group relative inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center p-0"
                >
                  <Image
                    src="/home-icon-svg.svg"
                    alt="Home"
                    width={30}
                    height={30}
                    priority
                    className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                  />
                  <Image
                    src="/home-icon-svg-hover.svg"
                    alt=""
                    aria-hidden="true"
                    width={30}
                    height={30}
                    priority
                    className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </Link>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-[20px] font-semibold leading-none tracking-[-0.01em] [-webkit-text-stroke:0.6px_#000000] text-black"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer that matches exact navbar height on desktop only */}
      {isDesktop && (
        <div style={{ height: navHeight }} aria-hidden="true" />
      )}
    </>
  );
};

export default Navbar;
