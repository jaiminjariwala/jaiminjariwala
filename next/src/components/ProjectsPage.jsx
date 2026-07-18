import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProjectsCurl from "@/components/ProjectsCurl";

const ProjectsPage = ({ embedded = false }) => {
  const sidePadding = embedded
    ? "clamp(0px, calc((768px - 100vw) * 9999), 12px)"
    : "clamp(0px, calc((768px - 100vw) * 9999), 20px)";

  return (
    <section
      className={`bg-white text-black${embedded ? " projects-page-embedded" : ""}`}
      style={
        embedded
          ? { paddingTop: 0 }
          : {
            height: "100dvh",
            overflow: "hidden",
            paddingTop: "clamp(40px, 6vw, 72px)",
          }
      }
    >
      {!embedded && <Navbar />}

      <div
        className={`mx-auto w-full${embedded ? " max-w-[920px]" : " max-w-[689px] pb-[28px]"
          }`}
        style={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
      >
        {embedded ? (
          <>
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
              <figcaption className="projects-embedded-caption">
                Open Source Component Library Project
              </figcaption>
            </figure>
            <p className="projects-embedded-desc">
              An open-source component library and playground built with
              Next.js and TypeScript. It&apos;s a workspace where you can
              browse polished UI components, see them render live, read and
              edit their code in an in-browser editor, and grab any assets
              they use. Signed-in users can publish their own components to a
              shared community gallery, fork others&apos; work, and roll back
              through version history. I built it to have one place where
              interactive, copy-paste-ready components live, with the real
              code and assets right next to the preview.{" "}
              <a
                href="https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library"
                target="_blank"
                rel="noopener noreferrer"
                className="projects-embedded-github"
              >
                Github
              </a>
              .
            </p>
          </>
        ) : (
          <div className="projects-row">
            <ProjectsCurl />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
