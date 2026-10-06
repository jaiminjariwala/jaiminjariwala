"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GitHubContributions from "@/components/GitHubContributions";
import InlineGallery from "@/components/InlineGallery";
import MobileMenu from "@/components/MobileMenu";
import Navbar from "@/components/Navbar";
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

const ProjectsStack = () => {
  const codexTrackRef = useRef(null);
  const scrollCodexGallery = (dir) => {
    const track = codexTrackRef.current;
    if (!track) return;
    const item = track.querySelector(".codex-gallery-item");
    const step = item ? item.getBoundingClientRect().width + 12 : 320;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
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
            <div className="codex-gallery-nav" aria-label="Scroll project media">
              <button
                type="button"
                className="codex-gallery-nav-button"
                onClick={() => scrollCodexGallery(-1)}
                aria-label="Show previous project media"
              >
                <svg viewBox="0 0 16 12" aria-hidden="true">
                  <path d="M15 6H1M6 .5 1 6l5 5.5" />
                </svg>
              </button>
              <button
                type="button"
                className="codex-gallery-nav-button"
                onClick={() => scrollCodexGallery(1)}
                aria-label="Show next project media"
              >
                <svg viewBox="0 0 16 12" aria-hidden="true">
                  <path d="M1 6h14M10 .5 15 6l-5 5.5" />
                </svg>
              </button>
            </div>
            <div className="codex-gallery mobile-full-bleed">
              <div className="codex-gallery-track" ref={codexTrackRef}>
                <div className="codex-gallery-item">
                  <ProjectVideo src="/media/codex-lite/demo-1.mp4" label="Codex Lite first demo" />
                </div>
                <div className="codex-gallery-item">
                  <ProjectVideo src="/media/codex-lite/demo-2.mp4" label="Codex Lite second demo" />
                </div>
                <div className="codex-gallery-item">
                  <img
                    src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/code-workspace.png"
                    alt="Codex Lite chat and code workspace"
                    loading="lazy"
                  />
                </div>
                <div className="codex-gallery-item">
                  <img
                    src="https://raw.githubusercontent.com/jaiminjariwala/codex-lite/main/docs/media/browser-workspace.png"
                    alt="Codex Lite chat alongside the embedded browser"
                    loading="lazy"
                  />
                </div>
                <div className="codex-gallery-item codex-gallery-settings">
                  <img
                    src="/media/codex-lite/settings-appearance.png"
                    alt="Codex Lite dark settings: app icon and local AI"
                    loading="lazy"
                  />
                </div>
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
            <a
              href="https://component-library-six-eta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Component Library project"
              className="mobile-full-bleed block w-full"
            >
              <Image
                src="/images/project-1-shot.png"
                alt="Component Library project interface"
                width={2922}
                height={1767}
                sizes="(max-width: 767px) 100vw, 920px"
                className="block h-auto w-full"
              />
            </a>
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

    gsap.registerPlugin(ScrollTrigger);
    const scenes = Array.from(root.querySelectorAll(".story-scene, .work-experience-item, .projects-stack-item"));
    const context = gsap.context(() => {
      scenes.forEach(scene => {
        const media = scene.querySelector("figure");
        const paragraphs = Array.from(scene.querySelectorAll(".portfolio-paragraph, .projects-embedded-desc"));
        if (!media || !paragraphs.length) return;
        const copy = paragraphs[0].closest(".home-story-copy") || paragraphs[0];
        scene.classList.add("story-scene-active");
        media.classList.add("story-scene-media");
        copy.classList.add("story-scene-copy");
        const fits = copy.scrollHeight < window.innerHeight * .7;
        if (!fits) {
          scene.classList.remove("story-scene-active");
          media.classList.remove("story-scene-media");
          copy.classList.remove("story-scene-copy");
          gsap.fromTo([media, ...paragraphs], { opacity: 0 }, {
            opacity: 1, duration: 1, stagger: .2,
            scrollTrigger: { trigger: scene, start: "top 75%", toggleActions: "play none none reverse" },
          });
          return;
        }
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: scene, start: "top top", end: () => `+=${window.innerHeight * 2.2}`,
          pin: fits, pinSpacing: true, scrub: .85, invalidateOnRefresh: true,
        }});
        timeline.fromTo(media, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: .8 })
          .to(media, { opacity: 1, duration: .65 })
          .to(media, { opacity: 0, scale: .95, duration: .65 })
          .fromTo(paragraphs, { opacity: 0, scale: 1.1 }, {
            opacity: 1, scale: 1, duration: .9, stagger: .3, ease: "power2.out"
          }, "-=.3")
          .to(paragraphs, { opacity: 1, duration: 1 })
          .to(paragraphs, { opacity: 0, scale: .97, duration: .55, stagger: .12 });
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    root.querySelectorAll("img").forEach(img => img.addEventListener("load", refresh));
    return () => {
      context.revert();
      root.querySelectorAll("img").forEach(img => img.removeEventListener("load", refresh));
      scenes.forEach(scene => {
        scene.classList.remove("story-scene-active");
        scene.querySelectorAll(".story-scene-media, .story-scene-copy").forEach(el => el.classList.remove("story-scene-media", "story-scene-copy"));
      });
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
                  <span className="intro-highlight-text">
                    Hello, I am Jaimin Mukesh Jariwala. I am a Software
                    Engineer who loves building end-to-end products that
                    people love using and scalable systems that stay
                    reliable under heavy traffic.
                  </span>
                </p>
              </div>
            </div>

            <div id="me" className="hero-profile relative flex justify-center">
              {/* Untrimmed: the photo renders at its natural 3:4 ratio, no
                  crop box, no zoom. On phones it bleeds to both screen
                  edges like every other homepage image. */}
              <figure className="hero-photo-figure" style={{ margin: 0 }}>
                <Image
                  src={getCloudinaryUrl(
                    "621D5FFE-03CC-4021-8C9D-819EE21214A8_eeeq9l",
                    800,
                  )}
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
            <div className="story-scene">
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

            </div>
            <div className="story-scene">
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
