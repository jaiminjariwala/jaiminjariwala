// Hero.jsx
import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
// import { useEffect, useState } from 'react';

const Hero = () => {
  const textRef = useScrollReveal();
  // const [dynamicGreeting, setDynamicGreeting] = useState("Good day");

  

  return (
    <div className="hero" id="hero" aria-label="Hero section">
      <h1 className='reveal-text-container'>Hi.<br />I’m Jaimin.</h1>
      <div ref={textRef} className="introduction">
        <p className="reveal-text-container">
          Designing and Building Websites.<br></br>
          Obsessed with UI, inspired by Swiss Design.<br></br>
          Exploring GSAP and Three.js 
        </p>
      </div>
    </div>
  );
};

export default Hero;
