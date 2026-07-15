"use client";

import Image from "next/image";
import { Short_Stack } from "next/font/google";
import ContactPage from "@/components/ContactPage";
import InlineBlog from "@/components/InlineBlog";
import InlineGallery from "@/components/InlineGallery";
import Navbar from "@/components/Navbar";
import ProjectsPage from "@/components/ProjectsPage";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

const contentGutter = {
  paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
  paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
};

const storyCopyClass =
  "mx-auto w-full max-w-[689px] text-[clamp(21px,3.5vw,24px)] font-normal leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]";

const HomePage = () => {
  return (
    <main className="bg-white text-[#000000]">
      <section id="home" className="home-story-flow relative bg-white">
        <Navbar />

        <div className="mx-auto w-full max-w-[689px]" style={contentGutter}>
          <div className="hero-layout grid items-center justify-between">
            <div className="w-full self-start">
              <h1
                className={`hero-name ${shortStack.className} text-[56px] font-normal leading-[1.1] tracking-[-0.03em] [-webkit-text-stroke:2.8px_#000000]`}
              >
                Jaimin
                <br />
                Jariwala
              </h1>

              <p
                className="mt-[48px] w-full text-[clamp(21px,3.5vw,24px)] font-normal leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000] md:mt-[58px]"
                style={{
                  paddingRight:
                    "clamp(20px, calc((100vw - 768px) * 9999), 28px)",
                }}
              >
                I am a <span className="font-bold">full-stack product engineer</span>{" "}
                who builds AI-powered products, from autonomous agents to
                delightful, detail-obsessed interfaces. I like living across the
                whole stack: design, frontend, backend, and the systems glue in
                between.
              </p>
            </div>

            <div className="hero-profile relative flex justify-center">
              <div className="flex h-[360px] w-[280px] items-center justify-center overflow-hidden">
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
            className="w-full text-[clamp(21px,3.5vw,24px)] font-normal leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]"
            style={{
              marginTop:
                "clamp(14px, calc((768px - 100vw) * 9999), 50px)",
            }}
          >
            <p>
              Right now I am a{" "}
              <span className="[-webkit-text-stroke:0.7px_#000000]">
                Design Technologist I (L4) intern
              </span>{" "}
              <a
                href="https://www.amazon.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#3896ff] [-webkit-text-stroke:0.3px_#3896ff]"
              >
                @amazon
              </a>{" "}
              in Seattle. It sits in the design job family, but it is a technical
              role, I build and ship prototypes, currently voice-driven experiences
              across a range of devices, from Alexa-powered devices to iPad. I am
              also pursuing my <span className="font-bold">Master&apos;s in Computer Science</span>{" "}
              at The George Washington University, Washington D.C.
            </p>
          </div>
        </div>

        <section
          id="gallery"
          className="home-story-section home-story-gallery"
          aria-label="Photo folders"
        >
          <InlineGallery />
        </section>

        <div className={`${storyCopyClass} home-story-copy`} style={contentGutter}>
          <p>
            On the side I am building{" "}
            <span className="font-bold">
              Computer or Browser Use and Smart Copilot
            </span>
            , a screen-aware app that reasons about your screen and can act for
            you in a browser or on your computer, similar to OpenAI&apos;s Operator
            and Claude&apos;s Computer Use, while strengthening my Electron skills.
            Before grad school I was an{" "}
            <span className="[-webkit-text-stroke:0.7px_#000000]">
              AI/ML intern
            </span>{" "}
            <a
              href="https://logicwind.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#3896ff] [-webkit-text-stroke:0.3px_#3896ff]"
            >
              @logicwind
            </a>{" "}
            in India, where I also did my Bachelor&apos;s in CS. Surat, Gujarat,
            India is home.
          </p>
        </div>

        <section
          id="projects"
          className="home-story-section home-story-projects"
          aria-label="Projects"
        >
          <ProjectsPage embedded />
        </section>

        <div className={`${storyCopyClass} home-story-copy`} style={contentGutter}>
          <p>
            I am obsessed with the details, typography, motion, color, and the
            feel of an interface, and how the little things transform how a
            product looks, feels, and gets used.
          </p>
        </div>

        <section
          id="blogs"
          className="home-story-section home-story-blog"
          aria-label="Blog"
        >
          <InlineBlog />
        </section>

        <section
          id="contact"
          className="home-story-section home-story-contact"
          aria-label="Contact"
        >
          <ContactPage embedded />
        </section>
      </section>
    </main>
  );
};

export default HomePage;
