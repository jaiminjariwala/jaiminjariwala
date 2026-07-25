"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import DesktopSidebar from "@/components/DesktopSidebar";
import GitHubContributions from "@/components/GitHubContributions";
import InlineGallery from "@/components/InlineGallery";
import MobileMenu from "@/components/MobileMenu";
import ProjectsPage from "@/components/ProjectsPage";
import { getCloudinaryUrl } from "@/components/galleryData";

const contentGutter = {
  paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
  paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
};

const HomePage = () => {
  const mainRef = useRef(null);

  // Mobile-only: the hero heading and first paragraph show immediately;
  // everything marked data-reveal stays hidden until the visitor starts
  // scrolling, then fades up as soon as its top clears the bottom edge.
  useLayoutEffect(() => {
    const root = mainRef.current;
    if (!root) return undefined;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isMobile || reduceMotion) return undefined;

    root.classList.add("home-reveal-ready");
    const targets = Array.from(root.querySelectorAll("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      // Trigger as soon as an element's top clears the bottom ~12% of the
      // screen, so nothing needs long scrolling before it appears.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
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
      root.classList.remove("home-reveal-ready");
    };
  }, []);

  return (
    <main ref={mainRef} className="home-page bg-white text-[#000000]">
      <MobileMenu />
      <DesktopSidebar />

      {/* The top-edge twin of the sidebar's progressive cloud: text melts
          into white as it scrolls out under the top of the viewport. */}
      <div className="top-edge-veil" aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      <section id="home" className="home-story-flow relative bg-white">
        <div
          className="home-hero-viewport mx-auto w-full max-w-[720px]"
          style={contentGutter}
        >
          <div className="home-hero-region">
            <div className="home-hero-intro">
              <div className="home-hero-copy w-full">
                <p
                  className="portfolio-paragraph w-full text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
                  style={{
                    // Phones keep their small right inset; on desktop the
                    // intro runs the full column width.
                    paddingRight:
                      "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
                  }}
                >
                  Hi, I am Jaimin Mukesh Jariwala, a Software Engineer who
                  loves building & shipping products and scalable end-to-end
                  systems, 0 → 1. I handle frontend, backend, cloud
                  integration, containerization, and agent orchestration.
                </p>
              </div>
            </div>

            <div id="me" className="hero-profile relative flex justify-center">
              {/* Untrimmed: the photo renders at its natural 3:4 ratio, no
                  crop box, no zoom. On phones it bleeds to both screen
                  edges like every other homepage image. */}
              <figure style={{ margin: 0 }}>
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
              </figure>
            </div>
          </div>

        </div>

        {/* Second opening screen: only the Amazon image and its paragraph,
            centered in their own viewport. */}
        <div
          data-reveal
          className="home-amazon-stage mx-auto w-full max-w-[720px]"
          style={contentGutter}
        >
          {/* Untrimmed at its natural ratio, scaled to the university
              photo's 920px width via the column-breakout figure. */}
          <figure id="work-experience-2" className="hero-amazon-figure">
            <Image
              src={getCloudinaryUrl("amazon_image_zlpqhu", 1600)}
              alt="Design Technologist internship at Amazon"
              width={1672}
              height={941}
              sizes="(max-width: 767px) 100vw, 920px"
              className="mobile-full-bleed block h-auto w-full"
            />
            <figcaption className="home-education-caption">
              At present, I am a Design Technologist I (L4) intern on SHUX
              (Smart Home UX) Alexa Team at SEA41, Amazon.
            </figcaption>
          </figure>

          <p
            className="portfolio-paragraph w-full text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
            style={{
              marginTop: 28,
              paddingRight:
                "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
            }}
          >
            During my internship, I built and delivered Echo Show Device
            Prototype Starter Kit 0 → 1 that enables one command rapid on
            device prototyping, cutting setup from 2+ days of manual work to
            about 90 seconds. Built using React Native, AWS services, and a
            Figma MCP-to-React Native workflow to accelerate design-to-device
            implementation.
          </p>
        </div>

        <section
          id="background"
          className="home-background-section"
          aria-label="My background"
        >
          {/* Grouped so the sidebar can center the image and its paragraph
              together in the viewport. */}
          <div id="education" className="w-full">
            <figure data-reveal className="home-education-figure">
              <div className="home-education-image-frame mobile-full-bleed">
                <img
                  src={getCloudinaryUrl("IMG_0230_chl99b", 1600)}
                  alt="Kogan Plaza with the blue clock at The George Washington University, Washington, D.C."
                  loading="lazy"
                  className="home-education-image"
                />
              </div>
              <figcaption className="home-education-caption">
                Pursuing Master&apos;s in Computer Science at The George
                Washington University, Washington D.C. (August 2025 -
                Present)
              </figcaption>
            </figure>

            <div
              data-reveal
              className="home-story-copy mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
              style={{ ...contentGutter, marginTop: 28 }}
            >
              <p className="portfolio-paragraph">
                Focusing on Distributed Systems, Software Engineering, Unix
                Systems Administration, Design and Analysis of Algorithms,
                Cloud Computing, and Technology Entrepreneurship. Incoming
                Computer System Architecture TA.
              </p>
            </div>
          </div>

          {/* Grouped so the sidebar can center the image and its paragraph
              together in the viewport. */}
          <div id="work-experience-1" className="w-full">
            <figure data-reveal className="home-education-figure">
              {/* Square source cropped from the top: the 3:2 frame anchors
                  the image to its bottom edge. */}
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
              <figcaption className="home-education-caption">
                AI/ML Intern at Logicwind (May 2024 - December 2024)
              </figcaption>
            </figure>

            <div
              data-reveal
              className="home-story-copy mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
              style={{ ...contentGutter, marginTop: 28 }}
            >
              <p className="portfolio-paragraph">
                Built machine-learning and computer-vision models with
                PyTorch for handwritten-text analysis and road-infrastructure
                (lanes and objects detection) analysis through REST APIs.
                Reduced inference latency by 20% and improved model accuracy
                from 72% to 96%; resolved production issues with engineering
                and client teams.
              </p>
            </div>
          </div>
        </section>

        <section
          data-reveal
          id="projects"
          className="home-story-section home-story-projects"
          aria-label="Projects"
        >
          <ProjectsPage embedded />
        </section>

        <section
          data-reveal
          id="github"
          className="home-story-section home-story-contributions"
          aria-labelledby="github-contributions-title"
        >
          <GitHubContributions />
        </section>

        <section
          data-reveal
          id="project-2"
          className="home-story-section"
          aria-label="Computer or Browser Use and Smart Copilot project"
        >
          <div
            className="mx-auto w-full max-w-[920px]"
            style={{
              paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 12px)",
              paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 12px)",
            }}
          >
            <figure>
              <Image
                src="/project_2.png"
                alt="Computer or Browser Use and Smart Copilot app interface"
                width={3186}
                height={1932}
                sizes="(max-width: 767px) 100vw, 920px"
                className="mobile-full-bleed block h-auto w-full"
              />
              <figcaption className="projects-embedded-caption">
                Computer or Browser Use and Smart Copilot
              </figcaption>
            </figure>
            <p className="projects-embedded-desc">
              On the side I&apos;m building{" "}
              <span className="experience-emphasis">
                Computer or Browser Use and Smart Copilot
              </span>
              , a screen-aware macOS app with two engines in one Electron
              process. Smart Copilot is capture-and-advise: grab a region of
              your screen, attach PDFs or short videos (the raw video never
              leaves the Mac), and ask by text or voice. Computer or Browser
              Use is the autonomous half, similar to OpenAI&apos;s Operator
              and Claude&apos;s Computer Use: give it a goal and it drives a
              real browser, a Docker sandbox, or, with permission, my Mac
              directly.{" "}
              <a
                href="https://github.com/jaiminjariwala/computer-or-browser-use-and-smart-copilot"
                target="_blank"
                rel="noopener noreferrer"
                className="projects-embedded-github"
              >
                Github
              </a>
              .{" "}
              <a
                href="https://github.com/jaiminjariwala/computer-or-browser-use-and-smart-copilot/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="projects-embedded-github"
              >
                Download
              </a>
              .
            </p>
          </div>
        </section>

        <section
          data-reveal
          id="gallery"
          className="home-story-section home-story-gallery"
          aria-label="Photo folders"
        >
          <InlineGallery />
        </section>

      </section>
    </main>
  );
};

export default HomePage;
