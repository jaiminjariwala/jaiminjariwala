"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import GitHubContributions from "@/components/GitHubContributions";
import InlineGallery from "@/components/InlineGallery";
import MobileMenu from "@/components/MobileMenu";
import ProjectsPage from "@/components/ProjectsPage";
import { getCloudinaryUrl } from "@/components/galleryData";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

const contentGutter = {
  paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
  paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
};

const storyCopyClass =
  "mx-auto w-full max-w-[720px] text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]";

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

      <section id="home" className="home-story-flow relative bg-white">
        <div className="mx-auto w-full max-w-[720px]" style={contentGutter}>
          <div className="home-hero-region">
            <div className="home-hero-intro">
              <h1 className={`${playfair.className} home-hero-title`}>
                I Build and Ship: Products and The Systems Underneath Them.
              </h1>

              <div className="home-hero-copy w-full">
                <p
                  className="portfolio-paragraph w-full text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
                  style={{
                    paddingRight:
                      "clamp(20px, calc((100vw - 768px) * 9999), 28px)",
                  }}
                >
                  Hi, I am Jaimin Jariwala, a software engineer who builds AI
                  products end to end. The interface is what people see, and I
                  care deeply about that layer, but most of my work lives
                  underneath it: agent loops, backend systems, APIs, and
                  infrastructure. I like owning everything from idea to
                  shipped.
                </p>
              </div>
            </div>

            <div
              data-reveal
              id="me"
              className="hero-profile relative flex justify-center"
            >
              <div className="flex h-[335px] w-[260px] items-center justify-center overflow-hidden">
                <Image
                  src="/images/my-profile-2.png"
                  alt="Jaimin profile illustration"
                  width={360}
                  height={360}
                  priority
                  className="h-full w-full origin-center scale-[1.15] object-cover"
                />
              </div>
            </div>
          </div>

          <div
            data-reveal
            id="currently"
            className="w-full text-[clamp(21.5px,3vw,23.5px)] font-normal leading-[1.48] tracking-[-0.01em]"
            style={{
              marginTop:
                "clamp(28px, calc((768px - 100vw) * 9999), 50px)",
            }}
          >
            <p className="portfolio-paragraph">
              Right now I am a{" "}
              <span className="experience-emphasis">
                Design Technologist I (L4) intern at Amazon
              </span>{" "}
              in Seattle. It sits in the design job family, but the work is
              engineering. I build and ship working prototypes of voice
              experiences for devices like the Echo Show and Echo Dot, along
              with web and mobile prototypes. I also build the AWS
              infrastructure behind them, with Lambda endpoints, session state
              in DynamoDB, and a skill pipeline that puts a full conversation
              on a real Echo you can talk to.
            </p>
          </div>
        </div>

        <section
          id="background"
          className="home-background-section"
          aria-label="My background"
        >
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
              I am also pursuing my Master&apos;s in Computer Science at The George
              Washington University, Washington D.C.
            </figcaption>
          </figure>

          <div
            data-reveal
            className={`${storyCopyClass} home-story-copy`}
            style={{ ...contentGutter, marginTop: -36 }}
          >
            <p className="portfolio-paragraph">
              Before grad school I was an{" "}
              <span className="experience-emphasis">
                AI/ML intern at Logicwind
              </span>{" "}
              in India. I worked on a graphology project that reads human
              handwriting and predicts personality traits from it. I built
              scalable computer vision models, machine learning pipelines, and
              the APIs that served them. I also worked on a street object and
              lane detection project.
            </p>
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
