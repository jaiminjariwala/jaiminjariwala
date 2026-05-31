import Image from "next/image";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

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
        <div className="projects-row">
          <div className="projects-stage">
            <Image
              src="/images/page-paper.png"
              alt=""
              aria-hidden="true"
              width={438}
              height={581}
              priority
              className="projects-page-img"
            />

            <Image
              src="/images/safety-pin.png"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1024}
              className="projects-pin"
            />
            <Image
              src="/images/safety-pin.png"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1024}
              className="projects-pin projects-pin-front"
            />
            <span className="projects-pin-pierce" aria-hidden="true" />

            <div className="projects-shot-wrap">
              <a
                href="https://component-library-six-eta.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Source Component Library project"
                className="projects-shot-link"
              >
                <Image
                  src="/images/project-1-shot.png"
                  alt="Open Source Component Library project preview"
                  width={2922}
                  height={1767}
                  priority
                  className="projects-shot-img"
                />
              </a>

              <Image
                src="/images/selotape.png"
                alt=""
                aria-hidden="true"
                width={947}
                height={369}
                className="projects-shot-tape projects-shot-tape-tl"
              />
              <Image
                src="/images/selotape.png"
                alt=""
                aria-hidden="true"
                width={947}
                height={369}
                className="projects-shot-tape projects-shot-tape-br"
              />
            </div>

            <div className="projects-page-caption">
              <h1 className={`${shortStack.className} projects-page-title`}>
                Open Source
                <br />
                Component Library
              </h1>
              <p className={`${shortStack.className} projects-page-desc`}>
                A small set of reusable, open-source React &amp;
                <br />
                Tailwind UI components.
              </p>
              <a
                href="https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library"
                target="_blank"
                rel="noopener noreferrer"
                className={`${shortStack.className} projects-github-link`}
                aria-label="Open code on GitHub"
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
