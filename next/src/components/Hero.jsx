"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <>
      I am a Software Developer with a focus on Frontend.
      <br />
      More about my work & interests {' '}
      <Link className="hero-link cursor-pointer" href="/interests">
        here
      </Link>
      .
    </>,
    <>I am a current Master's in Computer Science student at The George Washington University, Washington D.C. majoring in Software Engineering.</>,
    <>
      I did my Bachelor's in Computer Science & Engineering between Sep 2020 — May 2024 with a GPA of 3.5.
      <br />
      Later, worked as an AI / ML Intern @Logicwind from May — December 2024.
    </>,
    <>
      I came to US in Fall 2025. First semester I lived in D.C. and currently I am living in Pentagon City, Arlington, Virginia. I like to
      travel a lot, play spikeball and badminton and cooking is no longer my hobby, haha.
    </>
  ];

  const goPrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

  return (
    <section className="h-screen px-[6vw] text-white flex items-center">
      <div className="w-full">
        <h1 className="max-w-[60vw] text-left text-[clamp(2rem,6vw,5.5rem)] font-[400] tracking-[-3px] leading-[0.9] mb-[2vh]">
          <span className="block">Hey,</span>
          <span className="block">I am Jaimin Jariwala.</span>
        </h1>

        <div className="w-full max-w-[60vw]">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((text, index) => (
                <div key={index} className="min-w-full">
                  <p className="text-left text-[clamp(1.2rem,2.4vw,2.4rem)] font-light leading-[1.25] tracking-[-0.2px]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[2vh] flex items-center gap-6" style={{ marginLeft: '-16px' }}>
            <button className="hero-arrow" onClick={goPrev} disabled={currentSlide === 0} aria-label="Previous slide">
              <Image className="hero-arrow-icon" src="/left-arrow.svg" alt="" width={70} height={30} priority />
            </button>
            <button className="hero-arrow" onClick={goNext} disabled={currentSlide === slides.length - 1} aria-label="Next slide">
              <Image className="hero-arrow-icon" src="/right-arrow.svg" alt="" width={70} height={30} priority />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
