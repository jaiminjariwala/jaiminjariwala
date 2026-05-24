"use client";
import Image from "next/image";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

const HomePage = () => {
  return (
    <section className="min-h-screen bg-white text-[#000000]">
      <Navbar />
      <div
        className="mx-auto w-full max-w-[689px] pb-[72px]"
        style={{ paddingLeft: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)', paddingRight: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)' }}
      >
        <div className="hero-layout grid items-center justify-between">
          <div className="w-full self-start">
            <h1
              className={`hero-name ${shortStack.className} text-[56px] font-normal leading-[1.1] tracking-[-0.03em] [-webkit-text-stroke:2.8px_#000000]`}
            >
              Jaimin
              <br />
              Jariwala
            </h1>

            <p className="mt-[48px] md:mt-[58px] w-full text-[clamp(22px,1.65vw,22px)] font-normal leading-[1.28] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ paddingRight: 'clamp(20px, calc((100vw - 768px) * 9999), 28px)' }}>
              I am a <span className="font-bold">full-stack product engineer</span> who builds AI-powered products, from autonomous agents to delightful, detail-obsessed interfaces. I like living across the whole stack: design, frontend, backend, and the systems glue in between.
            </p>
          </div>

          {/* CROPPED IMAGE CONTAINER */}
          <div className="hero-profile relative flex justify-center">
            <div className="overflow-hidden w-[280px] h-[360px] flex items-center justify-center">
              <Image
                src="/images/my-profile-2.png"
                alt="Jaimin profile illustration"
                width={360}
                height={360}
                priority
                className="w-full h-full object-cover scale-[1.15] origin-center"
              />
            </div>
          </div>
        </div>

        <div
          className="w-full text-[clamp(22px,1.65vw,22px)] font-normal leading-[1.28] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]"
          style={{ marginTop: "clamp(36px, calc((768px - 100vw) * 9999), 50px)" }}
        >
          <p>
            Right now I am a <span className="font-bold">Design Technologist I (L4) intern</span>{" "}
            <a href="https://www.amazon.com" target="_blank" rel="noreferrer" className="text-[#3896ff] [-webkit-text-stroke:0.3px_#3896ff]">
              @amazon
            </a>{" "}
            in Seattle. It sits in the design job family, but it is a technical role, I build and ship prototypes, currently voice-driven experiences across a range of devices, from Alexa-powered devices to iPad. I am also pursuing my <span className="font-bold">Master&apos;s in Computer Science</span> at The George Washington University, Washington D.C.
          </p>

          <p className="mt-7">
            On the side I am building{" "}
            <span className="font-bold">Computer or Browser Use and Smart Copilot</span>, a screen-aware app that reasons about your screen and can act for you in a browser or on your computer, similar to OpenAI&apos;s Operator and Claude&apos;s Computer Use, while strengthening my Electron skills. Before grad school I was an <span className="font-bold">AI/ML intern</span>{" "}
            <a href="https://logicwind.com" target="_blank" rel="noreferrer" className="text-[#3896ff] [-webkit-text-stroke:0.3px_#3896ff]">
              @logicwind
            </a>{" "}
            in India, where I also did my Bachelor&apos;s in CS. Surat, Gujarat, India is home.
          </p>

          <p className="mt-7">
            I am obsessed with the details, typography, motion, color, and the feel of an interface, and how the little things transform how a product looks, feels, and gets used.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
