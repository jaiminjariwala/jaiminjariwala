// Hero.jsx
import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
// import { useEffect, useState } from 'react';

const Hero = () => {
  const textRef = useScrollReveal();
  // const [dynamicGreeting, setDynamicGreeting] = useState("Good day");

  

  return (
    <div className="hero" id="hero" aria-label="Hero section">
      <h1>Hi.<br />I’m Jaimin.</h1>
      <div ref={textRef} className="introduction">
        {/* <p className="reveal-text-container">
          Love solving problems & building scalable web applications.<br></br>
          Inspired by Swiss Design, Glassmorphism & Neobrutalism.<br></br>
          Exploring GSAP animations and Three.js.
        </p> */}
      </div>
    </div>
  );
};

export default Hero;
