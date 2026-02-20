import Image from "next/image";
import Navbar from "@/components/Navbar";

const ProjectsPage = () => {
  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px] pb-[72px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="projects-hero-row mt-[30px]">
          <h1
            className="projects-hero-title [-webkit-text-stroke:0.3px_#000000]"
            style={{ fontSize: "clamp(21px, 3.5vw, 24px)" }}
          >
            Open Source Component Library
          </h1>
          <a
            href="https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library"
            target="_blank"
            rel="noopener noreferrer"
            className="projects-code-pill"
            aria-label="Open code on GitHub"
          >
            Code
          </a>
        </div>

        <a
          href="https://component-library-six-eta.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Source Component Library project"
          className="projects-preview-link"
        >
          <Image
            src="/project-1.svg"
            alt="Open Source Component Library project preview"
            width={1600}
            height={940}
            priority
            className="projects-preview-image"
          />
        </a>
      </div>
    </section>
  );
};

export default ProjectsPage;
