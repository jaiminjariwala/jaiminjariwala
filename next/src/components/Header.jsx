"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMenu } from "./ClientShell";

const MenuOverlay = () => {
  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-start"
      style={{ 
        zIndex: 10001,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh'
      }}
    >
      <div className="menu-contacts w-full max-w-[60vw] pl-[6vw] text-left text-white">
        <h2 className="text-[clamp(2rem,6vw,5.5rem)] font-[400] tracking-[-4px] leading-[0.9] mb-[2vh]">
          Contacts
        </h2>
        <div className="mt-0 flex flex-col items-start gap-10">
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="mailto:jaiminjariwala5@icloud.com">
            Mail
          </a>
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="https://www.linkedin.com/in/jaiminjariwala/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="https://x.com/jaiminjariwala_" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="https://github.com/jaiminjariwala" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="https://www.kaggle.com/jaiminmukeshjariwala/code" target="_blank" rel="noopener noreferrer">
            Kaggle
          </a>
          <a className="hero-link cursor-pointer text-[clamp(1.2rem,2.4vw,2.4rem)] text-white" href="https://leetcode.com/u/jaiminjariwala/" target="_blank" rel="noopener noreferrer">
            LeetCode
          </a>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-[2vh] right-[2vw] text-white flex items-center justify-center" style={{ zIndex: 10003 }}>
        <button 
          className="menu-text cursor-pointer bg-transparent border-0 outline-none font-[400]"
          onClick={toggleMenu}
          style={{ 
            position: 'relative', 
            zIndex: 10004,
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: 400
          }}
        >
          {isMenuOpen ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            "Menu"
          )}
        </button>
      </nav>

      {mounted && isMenuOpen && createPortal(<MenuOverlay />, document.body)}
    </>
  );
};

export default Header;
