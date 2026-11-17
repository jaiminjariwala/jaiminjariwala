"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import type { PortfolioSection, StampKind } from "@/lib/siteSeo";
import PortfolioV2Gallery from "./PortfolioV2Gallery";
import PortfolioV2Projects from "./PortfolioV2Projects";
import styles from "./PortfolioV2.module.css";
import PaperPeel from "./PaperPeel";
import StickerButton from "./StickerButton";
import GitHubHoverCard from "./GitHubHoverCard";
import { paperViewportWidth, paperScale, paperInset } from "./paperLayout.ts";
import { sectionPaths } from "@/lib/siteSeo.ts";
import {
  outlineMask,
  polygonPath,
  scallopedOutline,
  PAGE_SCALLOP_PERIOD,
} from "./paperGeometry";

function ExternalArrow() {
  return (
    <svg
      className={styles.externalArrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

function StampRim({ lobes = 6 }: { lobes?: number }) {
  const outline = polygonPath(scallopedOutline(200, 200, 200 / lobes));
  return (
    <svg className={styles.stampRim} viewBox="0 0 200 200" aria-hidden="true">
      <path d={outline} fill="white" />
      <path
        d={outline}
        fill="none"
        stroke="#dededb"
        strokeWidth=".7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface ExperienceEntry {
  company: string;
  role: string;
  date: string;
  location: string;
  subjects?: string[];
  team?: string;
}

const experience: ExperienceEntry[] = [
  {
    company: "The George Washington University",
    role: "Graduate Teaching Assistant II",
    date: "Aug 2026 – Present",
    location: "Washington D.C.",
    subjects: ["Cloud Computing Class", "Database Management Systems 2 Class"],
  },
  {
    company: "Amazon",
    role: "Design Technologist I Intern (L4)",
    date: "June – Aug 2026",
    location: "Seattle, Washington",
    team: "Alexa Smart Home Team",
  },
  {
    company: "Logicwind",
    role: "AI/ML Intern",
    date: "May – Dec 2024",
    location: "Surat, Gujarat, India",
  },
];

const education: [string, string, string, string, string | null, string][] = [
  [
    "The George Washington University",
    "Master's in Computer Science",
    "Aug 2025 – May 2027",
    "GPA: 3.83 / 4.00",
    "35% tuition scholarship",
    "Washington D.C.",
  ],
  [
    "Parul University",
    "Bachelor of Technology in Computer Science and Engineering",
    "Sep 2020 – May 2024",
    "CGPA: 8.57 / 10",
    null,
    "Gujarat, India",
  ],
];

function EducationDegree({ degree }: { degree: string }) {
  const continuation = " and Engineering";
  if (!degree.endsWith(continuation)) return <span>{degree}</span>;
  return (
    <span>
      {degree.slice(0, -continuation.length)}
      <span className={styles.degreeContinuation}>{continuation}</span>
    </span>
  );
}

function StampArt({ kind }: { kind: StampKind }) {
  if (kind === "car")
    return (
      <img
        className={styles.stampArtwork}
        src="/v2-reference/brownstone-art.png"
        alt=""
        aria-hidden="true"
      />
    );
  if (kind === "rocket")
    return (
      <svg
        className={styles.rocketArtwork}
        viewBox="0 0 200 200"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="#0756ee" strokeWidth="4.8">
          <path d="m31 63 7-2-8 21 15-20-11 27 19-22-14 29 23-26-17 35 25-29-12 29 16-18-2 18 5-3" />
          <path d="m146 61 7-2-3 17 11-12-4 22 11-10 2 17-1 13" />
        </g>
        <g stroke="#00b56c" strokeWidth="4.2">
          <path d="m31 144 3-10q2-6 4 3l6-13q3-6 4 6l6-13q3-6 4 9l5-6 3 10 5-8 5 14 5-4 4 8 6-2" />
          <path d="m137 140 5-9 4 5 5-17q3-6 4 9l5-28q3-9 6 20l3 11q4-12 6-4l5 12" />
        </g>
        <g stroke="#ff2542" strokeWidth="4.1">
          <path d="M80 80q19-26 41-53 2-4 4 1l20 49q-31 6-65 3Z" />
          <path d="m94 84 1 78m37-81-2 81m-25-70 1 80m15-78 1 61" />
          <path d="m101 95 26-1m-26 12 26 1m-25 11 25-1m-16-29 1 57m9-57-1 61" />
        </g>
      </svg>
    );
  if (kind === "experience")
    return (
      <img
        className={`${styles.stampArtwork} ${styles.experienceArtwork}`}
        src="/v2-reference/snoopy-experience.png"
        alt=""
        aria-hidden="true"
      />
    );
  if (kind === "education")
    return (
      <svg
        className={styles.educationArtwork}
        viewBox="100 190 560 330"
        aria-hidden="true"
      >
        <image
          href="/v2-reference/education-school-bus.png"
          width="736"
          height="736"
        />
      </svg>
    );
  if (kind === "projects")
    return (
      <svg
        className={styles.projectsArtwork}
        viewBox="0 0 200 200"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="m34 65 2-22q0-8 9-8l37-1 17 15 54-1q10 0 10 11l3 85q0 9-9 10l-113 1q-9-1-10-11Z"
          fill="#c9bdf8"
          stroke="#9e89d8"
          strokeWidth="2"
        />
        <path
          d="m44 49 101 3-2 83-102-2Z"
          fill="#fffefa"
          stroke="#e5e2d8"
          strokeWidth="2"
        />
        <path
          d="m37 72 126 1 7 74q1 10-10 11l-118 1q-10 0-10-11Z"
          fill="#b8a5ee"
          stroke="#9e89d8"
          strokeWidth="2"
        />
        <g stroke="#125cd6" strokeWidth="5">
          <path d="m80 94-19 18 19 17m42-34 19 17-19 18m-14-40-13 45" />
        </g>
      </svg>
    );
  return <span className={styles.question}>?</span>;
}

function PortfolioContent({
  page,
  initialGallerySlug,
  scrollTargetId,
  introLinks,
}: {
  page: PortfolioSection;
  initialGallerySlug?: string | null;
  scrollTargetId?: string;
  introLinks?: ReactNode;
}) {
  return (
    <>
      {page === "intro" && (
        <>
          <header>
            <h1>Jaimin Mukesh Jariwala</h1>
            {introLinks}
          </header>
          <p className={styles.introText}>
            <span>
              Hello, I am a software engineer who enjoys
              building cool products that people love using and systems
              that don&apos;t break under heavy traffic. I like building
              the infrastructure and owning the entire product development
              lifecycle.
            </span>
          </p>
        </>
      )}
      {page === "gallery" && (
        <PortfolioV2Gallery
          initialSlug={initialGallerySlug}
          scrollTargetId={scrollTargetId}
        />
      )}
      {page === "projects" && <PortfolioV2Projects />}
      {page === "experience" && (
        <>
          <header>
            <h1>Experience</h1>
          </header>
          <div className={styles.experience}>
            {experience.map(
              ({ company, role, date, location, subjects, team }) => (
                <div key={company}>
                  <div>
                    <strong>{company}</strong>
                    <span>{role}</span>
                    {team && (
                      <span className={styles.experienceTeam}>
                        · {team}
                      </span>
                    )}
                    {subjects?.map((subject) => (
                      <span key={subject}>· {subject}</span>
                    ))}
                  </div>
                  <div className={styles.experienceMeta}>
                    <span>{location}</span>
                    <time>{date}</time>
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      )}
      {page === "education" && (
        <>
          <header>
            <h1>Education</h1>
          </header>
          <div className={styles.experience}>
            {education.map(
              ([university, degree, date, grade, award, location]) => (
                <div key={university}>
                  <div>
                    <strong>{university}</strong>
                    <EducationDegree degree={degree} />
                    <span>{grade}</span>
                    {award && <span>{award}</span>}
                  </div>
                  <div className={styles.educationMeta}>
                    <span>{location}</span>
                    <time>{date}</time>
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      )}
    </>
  );
}

const phoneSections: { page: PortfolioSection; label: string; art: StampKind }[] = [
  { page: "intro", label: "Introduction", art: "rocket" },
  { page: "experience", label: "Experience", art: "experience" },
  { page: "education", label: "Education", art: "education" },
  { page: "projects", label: "Projects", art: "projects" },
  { page: "gallery", label: "Travel", art: "car" },
];

const phoneEmail = "jaiminjariwala5@icloud.com";

function PhonePortfolio({
  clock,
  initialPage,
  initialGallerySlug,
}: {
  clock: string;
  initialPage: PortfolioSection;
  initialGallerySlug: string | null;
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const update = () => setShowBackToTop(window.scrollY > 400);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    // Direct links still land at the requested section of the phone document.
    const target = window.location.hash.slice(1) || `phone-${initialPage}`;
    if (target === "phone-intro" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
    }
  }, [initialPage]);

  return (
    <div className={styles.phoneSite}>
      <main className={styles.phoneContent}>
        {phoneSections.map(({ page, label, art }) => (
          <section
            key={page}
            id={`phone-${page}`}
            aria-label={label}
            className={`${styles.article} ${styles.phoneSection} ${page === "intro" ? styles.introPage : page === "experience" || page === "education" ? styles.experiencePage : ""}`}
          >
            <div
              className={`${styles.homeStamp} ${styles.phoneStamp} ${page === "intro" ? styles.rocketStamp : page === "projects" ? styles.projectsStamp : ""}`}
              aria-hidden="true"
            >
              <StampRim />
              {page === "intro" && (
                <span className={styles.stampTime}>
                  {clock}<span>DC</span>
                </span>
              )}
              <StampArt kind={art} />
              {page === "intro" && (
                <span className={styles.signature}>
                  Jaimin<span>:)</span>
                </span>
              )}
            </div>
            <PortfolioContent
              page={page}
              initialGallerySlug={initialGallerySlug}
              scrollTargetId={`phone-${page}`}
              introLinks={page === "intro" ? (
                <>
                  <div className={styles.phoneSocials}>
                    <a href="https://github.com/jaiminjariwala">GitHub <ExternalArrow /></a>
                    <a href="https://www.linkedin.com/in/jaiminjariwala/">LinkedIn <ExternalArrow /></a>
                    <a href="/JAIMIN_RESUME.pdf" target="_blank" rel="noopener noreferrer">Resume <ExternalArrow /></a>
                  </div>
                  <div className={styles.phoneEmail}>
                    <a href="tel:+12023917502">+1 (202) 391-7502</a>
                    <a href={`mailto:${phoneEmail}`} className={styles.inlineLink}>
                      {phoneEmail}
                    </a>
                  </div>
                </>
              ) : undefined}
            />
          </section>
        ))}
      </main>
      {showBackToTop && (
        <button
          type="button"
          className={styles.phoneBackToTop}
          aria-label="Back to top"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          })}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 11 6-6 6 6M12 5v14" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function PortfolioV2({
  initialPage = "intro",
  initialGallerySlug = null,
}: {
  initialPage?: PortfolioSection;
  initialGallerySlug?: string | null;
}) {
  const [phone, setPhone] = useState(false);
  const [collection, setCollection] = useState(false);
  useEffect(() => {
    // iPad mini can be narrower than this breakpoint. iPadOS also identifies
    // itself as a Mac in desktop mode, so preserve its paper layout explicitly.
    const isIPad = /iPad/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const media = window.matchMedia(
      "(max-width: 760px), (pointer: coarse) and (max-height: 500px)",
    );
    const update = () => {
      setPhone(media.matches && !isIPad);
      setCollection(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [peel, setPeel] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [paperMask, setPaperMask] = useState<string>();
  const [collectionMask, setCollectionMask] = useState<string>();
  const [clock, setClock] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailCopyError, setEmailCopyError] = useState("");
  const copyReset = useRef<ReturnType<typeof setTimeout>>(undefined);
  const paper = useRef<HTMLDivElement>(null);
  const contentViewport = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLElement>(null);
  const navigation = useRef<{
    destination: PortfolioSection;
    phase: "rolling" | "preparing" | "unrolling";
  } | null>(null);
  const rolledOpen = useRef(false);
  const activeArt =
    page === "gallery"
      ? "car"
      : page === "experience"
        ? "experience"
        : page === "education"
          ? "education"
          : page === "projects"
            ? "projects"
            : "rocket";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("jaiminjariwala5@gmail.com");
      setEmailCopied(true);
      setEmailCopyError("");
      clearTimeout(copyReset.current);
      copyReset.current = setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      setEmailCopyError(
        "Couldn't copy. Email me at jaiminjariwala5@gmail.com.",
      );
    }
  };
  useEffect(() => () => clearTimeout(copyReset.current), []);

  const navigate = (next: PortfolioSection) => {
    // The latest selection wins, including taps while a previous unroll is
    // finishing. Never silently discard a real stamp/navigation activation.
    contentViewport.current?.scrollTo({ top: 0, behavior: "instant" });
    if (next === page) {
      navigation.current = null;
      setCollection(false);
      return;
    }
    navigation.current = { destination: next, phase: "rolling" };
    if (collection && rolledOpen.current) {
      navigation.current.phase = "preparing";
      setPage(next);
    } else {
      setCollection(true);
    }
  };
  const followSectionLink = (
    event: MouseEvent<HTMLAnchorElement>,
    next: PortfolioSection,
  ) => {
    // Keep browser-native new-tab gestures. Ordinary activations retain the
    // paper transition; every href is also a real server-rendered page.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    navigate(next);
  };
  const paperSettled = (isOpen: boolean) => {
    rolledOpen.current = isOpen;
    const transition = navigation.current;
    if (isOpen && transition?.phase === "rolling") {
      transition.phase = "preparing";
      setPage(transition.destination);
    } else if (!isOpen && transition?.phase === "unrolling") {
      navigation.current = null;
      heading.current?.focus({ preventScroll: true });
    }
  };
  const paperContentReady = (readyPage: PortfolioSection) => {
    const transition = navigation.current;
    if (
      transition?.phase === "preparing" &&
      transition.destination === readyPage
    ) {
      transition.phase = "unrolling";
      rolledOpen.current = false;
      setCollection(false);
    }
  };
  const revealCollection = () => {
    navigation.current = null;
    setCollection(true);
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const box = entries[0].borderBoxSize[0];
      const mobile = window.innerWidth <= 760;
      setPaperMask(
        outlineMask(
          box.inlineSize,
          box.blockSize,
          PAGE_SCALLOP_PERIOD * paperScale(window.innerWidth),
          !mobile,
        ),
      );
      const inset = paperInset(window.innerWidth);
      setCollectionMask(
        outlineMask(
          paperViewportWidth(window.innerWidth) - (mobile ? 0 : inset * 2),
          window.innerHeight - inset * 2,
          PAGE_SCALLOP_PERIOD * paperScale(window.innerWidth),
          !mobile,
        ),
      );
    });
    if (paper.current) observer.observe(paper.current);
    const tick = () =>
      setClock(
        new Date()
          .toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            minute: "2-digit",
          })
          .replace(/\s?[AP]M/, ""),
      );
    tick();
    const timer = setInterval(tick, 60000);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [phone]);
  useEffect(() => {
    if (!collection || phone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [collection, phone]);
  useEffect(() => {
    if (!collection) heading.current?.focus({ preventScroll: true });
  }, [page, collection]);

  if (phone) {
    return (
      <PhonePortfolio
        clock={clock}
        initialPage={initialPage}
        initialGallerySlug={initialGallerySlug}
      />
    );
  }

  return (
    <div className={styles.site}>
      <div className={styles.backingShadow} aria-hidden="true">
        <div
          className={styles.backingPaper}
          style={{ maskImage: paperMask, maskSize: "100% 100%" }}
        />
      </div>
      <section
        className={`${styles.collection} ${collection || peel > 0 ? styles.collectionVisible : ""}`}
        style={{ maskImage: collectionMask, maskSize: "100% 100%" }}
        aria-label="Stamp collection"
        aria-hidden={!collection}
        inert={!collection ? true : undefined}
      >
        <div className={styles.stampGrid}>
          <figure className={styles.stampItem} data-stamp-item>
            <StickerButton
              className={`${styles.stamp} ${styles.carStamp}`}
              aria-label="Open travel"
              onClick={() => navigate("gallery")}
            >
              <StampRim />
              <StampArt kind="car" />
            </StickerButton>
          </figure>
          <figure className={styles.stampItem} data-stamp-item>
            <StickerButton
              className={`${styles.stamp} ${styles.rocketStamp}`}
              aria-label="Open introduction"
              onClick={() => navigate("intro")}
            >
              <StampRim lobes={6} />
              <span className={styles.stampTime}>
                {clock}
                <span>DC</span>
              </span>
              <StampArt kind="rocket" />
              <span className={styles.signature}>
                Jaimin<span>:)</span>
              </span>
            </StickerButton>
          </figure>
          <figure className={styles.stampItem} data-stamp-item>
            <StickerButton
              className={`${styles.stamp} ${styles.workStamp}`}
              aria-label="Open experience"
              onClick={() => navigate("experience")}
            >
              <StampRim />
              <StampArt kind="experience" />
            </StickerButton>
          </figure>
          <figure className={styles.stampItem} data-stamp-item>
            <StickerButton
              className={styles.stamp}
              aria-label="Open education"
              onClick={() => navigate("education")}
            >
              <StampRim />
              <StampArt kind="education" />
            </StickerButton>
          </figure>
          <figure className={styles.stampItem} data-stamp-item>
            <StickerButton
              className={`${styles.stamp} ${styles.projectsStamp}`}
              aria-label="Open projects"
              onClick={() => navigate("projects")}
            >
              <StampRim />
              <StampArt kind="projects" />
            </StickerButton>
          </figure>
        </div>
      </section>

      <div className={styles.paperShadow}>
        <div
          ref={paper}
          data-portfolio-paper
          className={styles.paper}
          style={{ maskImage: paperMask }}
          inert={collection ? true : undefined}
        >
          <StickerButton
            key={`stamp-${page}`}
            data-paper-stamp
            className={`${styles.homeStamp} ${page === "intro" ? styles.rocketStamp : page === "projects" ? styles.projectsStamp : ""}`}
            aria-label="Choose a stamp"
            onClick={revealCollection}
          >
            <StampRim />
            {page === "intro" && (
              <span className={styles.stampTime}>
                {clock}
                <span>DC</span>
              </span>
            )}
            <StampArt kind={activeArt} />
            {page === "intro" && (
              <span className={styles.signature}>
                Jaimin<span>:)</span>
              </span>
            )}
          </StickerButton>
          <div
            ref={contentViewport}
            data-portfolio-scroll
            className={styles.contentViewport}
          >
            <article
              ref={heading}
              tabIndex={-1}
              className={`${styles.article} ${page === "intro" ? styles.introPage : page === "experience" || page === "education" ? styles.experiencePage : ""}`}
              aria-label={
                page === "intro"
                  ? "Introduction"
                  : page === "gallery"
                    ? "Travel"
                    : page === "education"
                      ? "Education"
                      : page === "projects"
                        ? "Projects"
                        : "Experience"
              }
              key={page}
            >
              <PortfolioContent page={page} initialGallerySlug={initialGallerySlug} />
              <footer className={styles.portfolioFooter}>
                <h2 className={styles.footerHeading}>Explore</h2>
                <nav
                  className={styles.pageNavigation}
                  aria-label="Portfolio pages"
                >
                  <a
                    href={sectionPaths.intro}
                    onClick={(event) => followSectionLink(event, "intro")}
                    aria-current={page === "intro" ? "page" : undefined}
                  >
                    Introduction
                  </a>
                  <a
                    href={sectionPaths.gallery}
                    onClick={(event) => followSectionLink(event, "gallery")}
                    aria-current={page === "gallery" ? "page" : undefined}
                  >
                    Travel
                  </a>
                  <a
                    href={sectionPaths.experience}
                    onClick={(event) => followSectionLink(event, "experience")}
                    aria-current={page === "experience" ? "page" : undefined}
                  >
                    Experience
                  </a>
                  <a
                    href={sectionPaths.education}
                    onClick={(event) => followSectionLink(event, "education")}
                    aria-current={page === "education" ? "page" : undefined}
                  >
                    Education
                  </a>
                  <a
                    href={sectionPaths.projects}
                    onClick={(event) => followSectionLink(event, "projects")}
                    aria-current={page === "projects" ? "page" : undefined}
                  >
                    Projects
                  </a>
                </nav>
                <div className={styles.footerSocials}>
                  <GitHubHoverCard>
                    <a href="https://github.com/jaiminjariwala">
                      <span className={styles.inlineLink}>GitHub</span>
                      <ExternalArrow />
                    </a>
                  </GitHubHoverCard>
                  <a href="https://www.linkedin.com/in/jaiminjariwala/">
                    <span className={styles.inlineLink}>LinkedIn</span>
                    <ExternalArrow />
                  </a>
                  <button
                    type="button"
                    className={styles.copyEmail}
                    onClick={copyEmail}
                    aria-live="polite"
                  >
                    {emailCopied ? "Copied!" : "Copy email"}
                  </button>
                </div>
                {emailCopyError && (
                  <p className={styles.copyError} role="status">
                    {emailCopyError}
                  </p>
                )}
              </footer>
            </article>
          </div>
        </div>
      </div>
      <PaperPeel
        variant={page}
        open={collection}
        onOpenChange={(next) => {
          navigation.current = null;
          setCollection(next);
        }}
        onSettled={paperSettled}
        onContentReady={paperContentReady}
        onClipChange={(clip, progress) => {
          if (paper.current) {
            if (paper.current.style.clipPath !== clip)
              paper.current.style.clipPath = clip;
            const article = paper.current.querySelector("article");
            if (article)
              article.style.visibility = progress >= 0.999 ? "hidden" : "";
          }
          setPeel(progress > 0 ? 1 : 0);
        }}
      />
    </div>
  );
}
