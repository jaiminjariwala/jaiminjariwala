"use client";
import Image from "next/image";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

const HomePage = () => {
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <section className="min-h-screen md:h-screen md:overflow-hidden bg-white text-[#000000]">
      <Navbar />
      <div className="mx-auto w-full max-w-[689px]" style={{ paddingLeft: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)', paddingRight: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)' }}>
        <div className="hero-layout grid items-center justify-between">
          <div className="w-full self-start">
            <h1
              className={`${shortStack.className} text-[56px] font-normal leading-[1.1] tracking-[-0.03em] [-webkit-text-stroke:2.8px_#000000]`}
            >
              Jaimin
              <br />
              Jariwala
            </h1>

            <p className="mt-[48px] md:mt-[58px] w-full text-[clamp(24px,1.65vw,24px)] font-normal leading-[1.28] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ paddingRight: 'clamp(20px, calc((100vw - 768px) * 9999), 58px)' }}>
              I am a <span className="font-bold">creative web developer</span> who builds delightful web experiences.
              I play around typography, colors, visuals, creative user interactions & illustrations.
            </p>
          </div>

          {/* CROPPED IMAGE CONTAINER */}
          <div className="hero-profile relative flex justify-center">
             <div className="overflow-hidden w-[280px] h-[360px] flex items-center justify-center">
                <Image
                  src="/my-profile.svg"
                  alt="Jaimin profile illustration"
                  width={360}
                  height={360}
                  priority
                  className="w-full h-full object-cover scale-[1.15] origin-center" 
                />
             </div>
          </div>
        </div>

        <p
          className="max-w-[689px] text-[clamp(24px,1.65vw,24px)] font-normal leading-[1.28] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]"
          style={{ marginTop: "clamp(36px, calc((768px - 100vw) * 9999), 50px)" }}
        >
          I am inspired by swiss design, apple&apos;s design principles, neubrutalism, glassmorphism, skeuomorphism, the way
          user interprets websites, and how interactivity, ease of using, look and feel dramatically transforms the user
          experience.
        </p>

        <div className="flex justify-center" style={{ marginTop: 'clamp(48px, calc((100vw - 768px) * 9999), 74px)', marginBottom: 'clamp(0px, calc((768px - 100vw) * 9999), 48px)' }}>
          <div className="h-[8px] w-[62%] min-w-[240px] max-w-[520px] rounded-full bg-[#73c951]" />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
