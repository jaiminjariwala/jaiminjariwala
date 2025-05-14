// Hero.jsx
import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useState } from 'react';

const Hero = () => {
  const textRef = useScrollReveal();
  const [, setDisplayText] = useState("");
  const [dynamicGreeting, setDynamicGreeting] = useState("Good day");

  const getDynamicGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 4 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour === 12) {
      return "Good Noon";
    } else if (currentHour > 12 && currentHour < 17) {
      return "Good Afternoon";
    } else if (currentHour >= 17 && currentHour < 22) {
      return "Good Evening";
    } else {
      return "Hello";
    }
  };

  useEffect(() => {
    setDynamicGreeting(getDynamicGreeting());
    return () => setDisplayText("");
  }, []);

  return (
    <div className="hero" id="hero" aria-label="Hero section">
      <h1>{dynamicGreeting},<br />I’m Jaimin.</h1>
      <div ref={textRef} className="introduction">
        <p className="reveal-text-container">
          On a mission to build intelligent robots that perceive, move, and adapt — from factory floors to planetary surfaces.
        </p>
      </div>
    </div>
  );
};

export default Hero;
