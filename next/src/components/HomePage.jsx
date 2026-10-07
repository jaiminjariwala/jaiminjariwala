"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { animate } from "framer-motion";
import GitHubContributions from "@/components/GitHubContributions";
import InlineGallery from "@/components/InlineGallery";
import MobileMenu from "@/components/MobileMenu";
import Navbar from "@/components/DesktopSidebar";
import IntroReveal from "@/components/IntroReveal";
import { getCloudinaryUrl } from "@/components/galleryData";

const contentGutter = {
  paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
  paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
};

const WASHINGTON_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: "America/New_York",
});

const formatWashingtonTime = (date) =>
  WASHINGTON_TIME_FORMATTER.format(date).replace(/:/g, "\u200A:\u200A");

const useWashingtonTime = () => {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return now;
};

const WorkExperienceStack = () => {
  return (
    <section
      data-reveal
      className="work-experience-stack"
      aria-label="Work experience"
    >
      <article className="work-experience-item" id="work-experience-2">
        <div
          className="home-amazon-stage mx-auto w-full max-w-[720px]"
          style={contentGutter}
        >
          <figure className="hero-amazon-figure work-experience-figure">
            <Image
              src={getCloudinaryUrl("amazon_image_zlpqhu", 1600)}
              alt="Design Technologist internship at Amazon"
              width={1672}
              height={941}
              sizes="(max-width: 767px) 100vw, 920px"
              className="mobile-full-bleed block h-auto w-full"
            />
          </figure>

          <p
            className="portfolio-paragraph w-full text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
            style={{
              marginTop: 28,
              paddingRight:
                "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
            }}
          >
            In Summer 2026, I interned at Amazon as a Design Technologist I
            (L4) on the Alexa Smart Home UX team. I shipped an Echo Show
            Device Starter Kit adopted by 4 teams to build voice-enabled
            prototypes in under 2 hours. Automating AWS setup with Lambda,
            DynamoDB, and Bedrock cut setup from 2+ days to ~90 seconds and
            deployment errors by 90%. I also built a Figma MCP-to-React
            Native workflow and 17+ prototypes and wireframes.
          </p>
        </div>
      </article>

      <article className="work-experience-item" id="work-experience-1">
        <div className="work-experience-logicwind w-full">
          <figure className="home-education-figure work-experience-figure">
            <div className="home-education-image-frame mobile-full-bleed">
              <Image
                src={getCloudinaryUrl(
                  "logicwind_company_experience_image_erwixu",
                  1600,
                )}
                alt="AI/ML internship at Logicwind"
                fill
                sizes="(max-width: 767px) 100vw, 920px"
                className="home-education-image"
                style={{ objectPosition: "center bottom" }}
              />
            </div>
          </figure>

          <div
            className="home-story-copy mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
            style={{ ...contentGutter, marginTop: 28 }}
          >
            <p className="portfolio-paragraph">
              AI/ML Intern at Logicwind (May 2024 - December 2024). Built
              machine-learning and computer-vision models with PyTorch for
              handwritten-text analysis and road-infrastructure (lanes and
              objects detection) analysis through REST APIs. Reduced
              inference latency by 20% and improved model accuracy from
              72% to 96%; resolved production issues with engineering and
              client teams.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

const ProjectVideo = ({ src, label }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  return (
    <button
      type="button"
      className="codex-gallery-video"
      aria-label={`${isPlaying ? "Pause" : "Play"} ${label}`}
      onClick={togglePlayback}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </button>
  );
};

const MediaGalleryContext = createContext(null);
const MEDIA_LABELS = ["Welcome", "Sign in", "Browser sign-in", "Account chooser", "Dictation setup", "first demo", "second demo", "code workspace", "browser workspace", "light settings", "dark settings"];
const ProjectMedia = ({ children, className = "", label = "project media" }) => {
  const gallery = useContext(MediaGalleryContext);
  const mediaRef = useRef(null);
  const [standaloneExpanded, setStandaloneExpanded] = useState(false);
  const expanded = gallery ? gallery.active === label : standaloneExpanded;
  const setExpanded = useCallback(value => {
    const next = typeof value === "function" ? value(expanded) : value;
    if (gallery) gallery.setActive(next ? label : null);
    else setStandaloneExpanded(next);
  }, [expanded, gallery, label]);
  const touchStart = useRef(null);
  const localWheelState = useRef({ distance: 0, last: 0 });
  const wheelState = gallery?.wheelState || localWheelState;
  const navigate = useCallback(direction => {
    if (!gallery) return;
    const index = MEDIA_LABELS.indexOf(label);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= MEDIA_LABELS.length) return;
    if (expanded) {
      gallery.setActive(MEDIA_LABELS[nextIndex]);
    } else {
      const target = gallery.trackRef.current?.children[index + direction];
      if (target) gallery.trackRef.current.scrollTo({ left: target.offsetLeft - gallery.trackRef.current.firstElementChild.offsetLeft, behavior: "smooth" });
    }
  }, [expanded, gallery, label]);
  const [mediaTone, setMediaTone] = useState(() => label === "dark settings" ? "dark" : "light");
  useEffect(() => {
    gallery?.setTones(previous => previous[label] === mediaTone ? previous : { ...previous, [label]: mediaTone });
  }, [gallery, label, mediaTone]);
  const sampleVideoTone = event => {
    const video = event.target;
    if (video.tagName !== "VIDEO" || !video.videoWidth) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 8;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(video, video.videoWidth * .9, 0, video.videoWidth * .1, video.videoHeight * .1, 0, 0, 8, 8);
      const pixels = context.getImageData(0, 0, 8, 8).data;
      let brightness = 0;
      for (let i = 0; i < pixels.length; i += 4) brightness += .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
      brightness /= 64;
      if (brightness > 170) setMediaTone("light");
      else if (brightness < 100) setMediaTone("dark");
    } catch { /* Keep the configured contrast if sampling is unavailable. */ }
  };
  useEffect(() => {
    if (!expanded) return;
    const previousFocus = document.activeElement;
    mediaRef.current?.querySelector(".project-media-expand")?.focus();
    const escape = event => {
      if (event.key === "Escape") setExpanded(false);
      if (gallery && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        navigate(event.key === "ArrowRight" ? 1 : -1);
      }
      if (event.key === "Tab") {
        const controls = Array.from(mediaRef.current?.querySelectorAll("button, a[href]") || []);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [expanded, gallery, navigate, setExpanded]);
  const media = <div ref={mediaRef}
    onTouchStart={event => { if (expanded) touchStart.current = [event.touches[0].clientX, event.touches[0].clientY]; }}
    onTouchEnd={event => {
      if (!expanded || !touchStart.current) return;
      const dx = event.changedTouches[0].clientX - touchStart.current[0];
      const dy = event.changedTouches[0].clientY - touchStart.current[1];
      touchStart.current = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) navigate(dx < 0 ? 1 : -1);
    }}
    onWheel={event => {
      if (!expanded || !gallery || Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
      const now = performance.now();
      if (now - wheelState.current.last < 600) return;
      wheelState.current.distance += event.deltaX;
      if (Math.abs(wheelState.current.distance) > 80) {
        navigate(wheelState.current.distance > 0 ? 1 : -1);
        wheelState.current.distance = 0;
        wheelState.current.last = now;
      }
    }}
    onTimeUpdateCapture={sampleVideoTone} data-media-tone={mediaTone} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? label : undefined} className={`codex-gallery-item cursor-pointer project-media ${className} ${expanded ? "is-expanded" : ""}`}>
    {children}
    {expanded && gallery ? <>
      {MEDIA_LABELS.indexOf(label) > 0 && <button type="button" className="project-media-prev" aria-label="Previous media" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" /></svg>
      </button>}
      {MEDIA_LABELS.indexOf(label) < MEDIA_LABELS.length - 1 && <button type="button" className="project-media-next" aria-label="Next media" onClick={() => navigate(1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>
      </button>}
    </> : null}
    {(expanded || !gallery) && <button type="button" className="project-media-expand" aria-label={`${expanded ? "Exit fullscreen" : "View fullscreen"} ${label}`} onClick={() => setExpanded(value => !value)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {expanded ? <path d="M21 3l-7 7m0-6v6h6M3 21l7-7m-6 0h6v6" /> : <path d="M14 10l7-7m-7 0h7v7M10 14l-7 7m0-7v7h7" />}
      </svg>
    </button>}
  </div>;
  return expanded ? <><div className="codex-gallery-item project-media-placeholder" />{createPortal(media, document.body)}</> : media;
};

const ProjectsStack = () => {
  const codexTrackRef = useRef(null);
  const [expandedMedia, setExpandedMedia] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [mediaTones, setMediaTones] = useState({ "dark settings": "dark" });
  const wheelState = useRef({ distance: 0, last: 0 });
  const galleryValue = useMemo(() => ({ active: expandedMedia, setActive: setExpandedMedia, wheelState, trackRef: codexTrackRef, setTones: setMediaTones }), [expandedMedia]);
  const scrollToMedia = direction => {
    const track = codexTrackRef.current;
    const index = Math.max(0, Math.min(MEDIA_LABELS.length - 1, currentMedia + direction));
    const step = track?.firstElementChild?.getBoundingClientRect().width + 12;
    if (track && step) track.scrollTo({ left: index * step, behavior: "smooth" });
  };
  return (
    <section
      data-reveal
      id="project-2"
      className="projects-stack"
      aria-label="Projects"
    >
      <article className="projects-stack-item">
        <div className="projects-carousel-slide-content mx-auto w-full max-w-[920px]">
          <figure>
            <h2 className="home-section-heading">Projects</h2>
            <div className="codex-gallery mobile-full-bleed">
              <MediaGalleryContext.Provider value={galleryValue}>
              <div className="codex-gallery-track" ref={codexTrackRef} onScroll={event => {
                const track = event.currentTarget;
                const step = track.firstElementChild.getBoundingClientRect().width + 12;
                setCurrentMedia(Math.max(0, Math.min(MEDIA_LABELS.length - 1, Math.round(track.scrollLeft / step))));
              }}>
                {[
                  ["01-welcome", "Welcome"], ["02-sign-in", "Sign in"],
                  ["03-browser-sign-in", "Browser sign-in"], ["04-account-chooser", "Account chooser"],
                  ["05-microphone-permission", "Dictation setup"],
                ].map(([file, label], index) => <ProjectMedia key={file} label={label} className={index < 4 ? "project-media-subtle-border" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/${file}.png`} alt={`Codex Lite ${label}`} loading="lazy" />
                </ProjectMedia>)}
                <ProjectMedia label="first demo">
                  <ProjectVideo src="/media/codex-lite/demo-1.mp4" label="Codex Lite first demo" />
                </ProjectMedia>
                <ProjectMedia label="second demo">
                  <ProjectVideo src="/media/codex-lite/demo-2.mp4" label="Codex Lite second demo" />
                </ProjectMedia>
                <ProjectMedia label="code workspace">
                  <img
                    src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/code-workspace.png"
                    alt="Codex Lite chat and code workspace"
                    loading="lazy"
                  />
                </ProjectMedia>
                <ProjectMedia label="browser workspace">
                  <img
                    src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/browser-workspace.png"
                    alt="Codex Lite chat alongside the embedded browser"
                    loading="lazy"
                  />
                </ProjectMedia>
                <ProjectMedia className="codex-gallery-settings" label="light settings">
                  <img
                    src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/settings-light.png"
                    alt="Codex Lite light settings"
                    loading="lazy"
                  />
                </ProjectMedia>
                <ProjectMedia className="codex-gallery-settings" label="dark settings">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/settings-dark.png" alt="Codex Lite dark settings" loading="lazy" />
                </ProjectMedia>
              </div>
              </MediaGalleryContext.Provider>
              <div className="codex-gallery-controls" data-media-tone={mediaTones[MEDIA_LABELS[currentMedia]] || "light"}>
                <button type="button" className="project-media-expand" aria-label={`View fullscreen ${MEDIA_LABELS[currentMedia]}`} onClick={() => setExpandedMedia(MEDIA_LABELS[currentMedia])}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 10l7-7m-7 0h7v7M10 14l-7 7m0-7v7h7" /></svg>
                </button>
                {currentMedia > 0 && <button type="button" className="project-media-prev" aria-label="Previous media" onClick={() => scrollToMedia(-1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" /></svg>
                </button>}
                {currentMedia < MEDIA_LABELS.length - 1 && <button type="button" className="project-media-next" aria-label="Next media" onClick={() => scrollToMedia(1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>
                </button>}
              </div>
            </div>
          </figure>
          <p className="projects-embedded-desc">
            <span className="experience-emphasis">Codex Lite</span>: a
            macOS AI desktop app (Electron, React, TypeScript) with screen
            capture, attachments, on-device Whisper dictation, and a
            tabbed workspace with editor, terminal, and browser. Go +
            PostgreSQL backend with GitHub OAuth and Stripe subscriptions
            on Render/Supabase, local Qwen models via Ollama, and
            approval-gated macOS and Playwright browser automation.{" "}
            <a
              href="https://github.com/jaiminjariwala/codex-lite"
              target="_blank"
              rel="noopener noreferrer"
              className="projects-embedded-github"
            >
              Github
            </a>
            .{" "}
            <a
              href="https://github.com/jaiminjariwala/codex-lite/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="projects-embedded-github"
            >
              Download
            </a>
            .
          </p>
        </div>
      </article>

      <article id="projects" className="projects-stack-item">
        <div className="projects-carousel-slide-content mx-auto w-full max-w-[920px]">
          <figure>
            <ProjectMedia label="Component Library screenshot">
              <Image
                src="/images/project-1-shot.png"
                alt="Component Library project interface"
                width={2922}
                height={1767}
                sizes="(max-width: 767px) 100vw, 920px"
                className="block h-auto w-full"
              />
            </ProjectMedia>
          </figure>
          <p className="projects-embedded-desc">
            <span className="experience-emphasis">Open Source Component Library</span>: a component library and playground (Next.js,
            TypeScript) where you can browse UI components, see them
            render live, and edit their code in the browser. Signed-in
            users can publish to a shared gallery, fork others&apos; work,
            and roll back through version history.{" "}
            <a
              href="https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library"
              target="_blank"
              rel="noopener noreferrer"
              className="projects-embedded-github"
            >
              Github
            </a>
            .{" "}
            <a
              href="https://component-library-six-eta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="projects-embedded-github"
            >
              Live
            </a>
            .
          </p>
        </div>
      </article>
    </section>
  );
};

const HomePage = () => {
  const mainRef = useRef(null);
  const washingtonTime = useWashingtonTime();

  // Independent story beats, spring-settled like the reference's dissolves.
  useLayoutEffect(() => {
    const root = mainRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return undefined;

    root.classList.add("home-reveal-ready");
    const targets = Array.from(root.querySelectorAll(
      ".home-section-heading, .home-education-image-frame, #education > figure > img, .work-experience-figure > img, .portfolio-paragraph:not(.home-hero-copy .portfolio-paragraph), .projects-stack figure:not(:has(.home-section-heading)), .codex-gallery, .projects-embedded-desc, .projects-embedded-title"
    )).filter((el, index, all) => !all.some(other => other !== el && other.contains(el)));
    const animations = new Map();
    targets.forEach(el => {
      el.classList.add("story-motion-beat");
      el.style.opacity = "0";
      el.style.transform = "translateY(24px) scale(1.06)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          animations.get(el)?.stop();
          animations.set(el, animate(el, {
            opacity: entry.isIntersecting ? 1 : 0,
            y: entry.isIntersecting ? 0 : 24,
            scale: entry.isIntersecting ? 1 : 1.06,
          }, { type: "spring", stiffness: 65, damping: 20, mass: 1 }));
        });
      },
      // Trigger as soon as an element's top clears the bottom ~12% of the
      // screen, so nothing needs long scrolling before it appears.
      { rootMargin: "60% 0px -10% 0px", threshold: 0 },
    );

    const startObserving = () =>
      targets.forEach((el) => observer.observe(el));

    const onFirstScroll = () => {
      window.removeEventListener("scroll", onFirstScroll);
      startObserving();
    };

    if (window.scrollY > 0) {
      // Restored mid-page (e.g. back navigation): reveal in place.
      startObserving();
    } else {
      window.addEventListener("scroll", onFirstScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onFirstScroll);
      observer.disconnect();
      animations.forEach(animation => animation.stop());
      targets.forEach(el => {
        el.classList.remove("story-motion-beat");
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      });
      root.classList.remove("home-reveal-ready");
    };
  }, []);

  return (
    <main ref={mainRef} className="home-page bg-white text-[#000000]">
      <MobileMenu />

      <section id="home" className="home-story-flow relative bg-white">
        <Navbar />
        <div
          className="home-hero-viewport mx-auto w-full max-w-[720px]"
          style={contentGutter}
        >
          <div className="home-hero-region">
            <div className="home-hero-intro">
              <div className="home-hero-copy w-full">
                <p className="portfolio-paragraph w-full text-[clamp(21.5px,3vw,26px)] font-normal leading-[1.48] tracking-[-0.01em]">
                  <IntroReveal />
                </p>
              </div>
            </div>

            <div id="me" className="hero-profile relative flex justify-center">
              {/* Untrimmed: the photo renders at its natural 3:4 ratio, no
                  crop box, no zoom. On phones it bleeds to both screen
                  edges like every other homepage image. */}
              <figure className="hero-photo-figure" style={{ margin: 0 }}>
                <Image
                  src="/images/jaimin-seattle-portrait.png"
                  alt="Jaimin Jariwala portrait"
                  width={1086}
                  height={1448}
                  priority
                  className="mobile-full-bleed block h-auto w-[360px]"
                />
                <figcaption className="home-education-caption hero-photo-caption">
                  Captured on Day 1 at SEA41, Seattle
                </figcaption>
                <aside className="hero-photo-current-location">
                  <span>Washington D.C.</span>
                  <time dateTime={washingtonTime?.toISOString()}>
                    {washingtonTime
                      ? formatWashingtonTime(washingtonTime)
                      : "—"}
                  </time>
                </aside>
              </figure>
            </div>
          </div>

        </div>

        <section
          data-reveal
          id="gallery"
          className="home-story-section home-story-gallery"
          aria-label="Photo folders"
        >
          <InlineGallery />
        </section>

        <section
          id="background"
          className="home-background-section"
          aria-label="My background"
        >
          {/* Grouped so the sidebar can center the image and its paragraph
              together in the viewport. */}
          <div id="education" className="w-full">
            <figure data-reveal className="home-education-figure">
              <h2 className="home-section-heading">Education</h2>
              <div className="home-education-image-frame mobile-full-bleed">
                <img
                  src={getCloudinaryUrl("IMG_0230_chl99b", 1600)}
                  alt="Kogan Plaza with the blue clock at The George Washington University, Washington, D.C."
                  loading="lazy"
                  className="home-education-image"
                />
              </div>
            </figure>

            <div
              data-reveal
              className="home-story-copy mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
              style={{ ...contentGutter, marginTop: 28 }}
            >
              <p className="portfolio-paragraph">
                Pursuing Master&apos;s in Computer Science at The George
                Washington University, Washington D.C. (August 2025 -
                Present).
              </p>
              <p className="portfolio-paragraph" style={{ marginTop: 24 }}>
                Focusing on Distributed Systems, Software
                Security, Systems Engineering I, Software Engineering, Unix
                Systems Administration, Design and Analysis of Algorithms,
                Cloud Computing, Database Management Systems, and Technology Entrepreneurship.
              </p>
            </div>

            <figure
              data-reveal
              id="work"
              className="home-education-figure"
              style={{ marginTop: "var(--home-story-gap)" }}
            >
              <h2 className="home-section-heading">Work Experience</h2>
              <Image
                src="/images/gw-science-engineering-hall-enhanced.png"
                alt="Science and Engineering Hall at The George Washington University"
                width={1536}
                height={1024}
                sizes="(max-width: 767px) 100vw, 920px"
                className="mobile-full-bleed block h-auto w-full"
              />
            </figure>

            <div
              data-reveal
              className="home-story-copy mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
              style={{ ...contentGutter, marginTop: 28 }}
            >
              <p className="portfolio-paragraph">
                At present, I am a Graduate Teaching Assistant II for
                Cloud Computing at The George Washington University&apos;s
                Science and Engineering Hall.
              </p>
              <p className="portfolio-paragraph" style={{ marginTop: 24 }}>
                I help students debug and deploy full-stack projects on AWS using EC2, S3, IAM,
                CloudWatch, CloudTrail, and KMS, including database setup
                and hosting. I also grade coursework and hold office hours.
              </p>
            </div>
          </div>

          <WorkExperienceStack />
        </section>

        <section
          data-reveal
          id="github"
          className="home-story-section home-story-contributions"
          aria-labelledby="github-contributions-title"
        >
          <GitHubContributions />
        </section>

        <ProjectsStack />

      </section>
    </main>
  );
};

export default HomePage;
