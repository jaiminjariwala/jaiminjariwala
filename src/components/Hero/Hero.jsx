// Hero.jsx
import "./Hero.css";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useState } from "react";
// import { useEffect, useState } from 'react';

const Hero = () => {
  const textRef = useScrollReveal();
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [dynamicGreeting, setDynamicGreeting] = useState("Good day");

  const slides = [
    "I am living in Arlington, VA. Current Master's in Computer Science student at The George Washington University, Washington D.C. majoring in Software Engineering.",
    "I completed my Bachelor’s in Computer Science between 2020—24 with a 3.5 GPA and worked as an AI / Machine Learning Intern @Logicwind from May—December 2024.",
    "I like to travel a lot, play spikeball and badminton and enjoys cooking."
  ];

  const goPrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

  return (
    <div className="hero" id="hero" aria-label="Hero section">
      <h1 className="hero-title">
        <span className="hero-line">Hey,</span>
        <span className="hero-line">I am Jaimin Jariwala.</span>
      </h1>
      <div ref={textRef} className="hero-intro">
        <div className="hero-slider">
          <div
            className="hero-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((text, index) => (
              <div key={index} className="hero-slide">
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-nav">
          <button
            className="hero-arrow"
            onClick={goPrev}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <svg className="hero-arrow-icon" width="36" height="16" viewBox="0 0 30 14" fill="none" aria-hidden="true">
              <path d="M22 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 1L6 7L12 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="hero-arrow"
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            aria-label="Next slide"
          >
            <svg className="hero-arrow-icon" width="36" height="16" viewBox="0 0 30 14" fill="none" aria-hidden="true">
              <path d="M8 7H24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M18 1L24 7L18 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
