// Hero.jsx
import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useState, useCallback } from 'react';

const TYPING_SPEED = 300;
const DELETING_SPEED = 200;
const PAUSE_DURATION = 2500;

const GREETINGS = [
  "Namaste",
  "Hello",
  "Bonjour",
  "Hola",
  "こんにちは",
  "你好",
];

const Hero = () => {
  const headingRef = useScrollReveal();
  const textRef = useScrollReveal();
  const [displayText, setDisplayText] = useState("");

  const typeWriter = useCallback(() => {
    let currentWordIndex = 0;
    let currentLetterIndex = 0;
    let isDeleting = false;

    const animate = () => {
      const currentWord = GREETINGS[currentWordIndex];

      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, currentLetterIndex + 1));
        currentLetterIndex++;

        if (currentLetterIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(animate, PAUSE_DURATION);
          return;
        }
      } else {
        setDisplayText(currentWord.substring(0, currentLetterIndex - 1));
        currentLetterIndex--;

        if (currentLetterIndex === 0) {
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % GREETINGS.length;
        }
      }

      setTimeout(animate, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    };

    animate();
  }, []);

  useEffect(() => {
    typeWriter();
    return () => setDisplayText("");
  }, [typeWriter]);

  return (
    <div className="hero" id="hero" aria-label="Hero section">
      <h1>Good Morning,<br />I’m Jaimin.</h1>
      <div ref={textRef} className="introduction reveal-text-container">
        <p>
        I’m deeply interested in Computer Vision & training Robots in simulation using Reinforcement Learning.
        </p>
        <p>
          Perhaps, Web Development & UI / UX has always been my field of interest. 
          I’m inspired by Swiss Design, Neo—Brutalism, Typography & how Human Psychology interpret Websites.
        </p>
      </div>
    </div>
  );
};

export default Hero;