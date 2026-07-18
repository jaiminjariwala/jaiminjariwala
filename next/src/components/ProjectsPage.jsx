import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import ProjectsCurl from "@/components/ProjectsCurl";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

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
        className={`mx-auto w-full${embedded ? " max-w-[760px]" : " max-w-[689px] pb-[28px]"
          }`}
        style={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
      >
        {embedded ? (
          <>
            <h2 className={`${playfair.className} projects-embedded-title`}>
              Open Source Component Library
            </h2>
            <a
              href="https://component-library-six-eta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Component Library project"
              className="block w-full"
            >
              <Image
                src="/images/project-1-shot.png"
                alt="Component Library project interface"
                width={2922}
                height={1767}
                sizes="(max-width: 767px) calc(100vw - 24px), 760px"
                className="block h-auto w-full"
              />
            </a>
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
