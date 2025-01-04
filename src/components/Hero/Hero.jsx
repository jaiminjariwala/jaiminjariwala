import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useState } from 'react';

const Hero = () => {
    const headingRef = useScrollReveal();
    const textRef = useScrollReveal();
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const words = ["Hello", "こんにちは", "你好", "Hola"];  // English, Japanese, Chinese, Spanish

    useEffect(() => {
        let currentWordIndex = 0;
        let currentLetterIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentWord = words[currentWordIndex];

            if (!isDeleting) {
                // Typing
                setDisplayText(currentWord.substring(0, currentLetterIndex + 1));
                currentLetterIndex++;

                if (currentLetterIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(typeWriter, 2500); // Wait before starting to delete
                    return;
                }
            } else {
                // Deleting
                setDisplayText(currentWord.substring(0, currentLetterIndex - 1));
                currentLetterIndex--;

                if (currentLetterIndex === 0) {
                    isDeleting = false;
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                }
            }

            const speed = isDeleting ? 200 : 300; // Adjust typing speed here
            setTimeout(typeWriter, speed);
        };

        typeWriter();

        return () => {
            setDisplayText("");
        };
    }, []);

    return (
        <div className="hero" id="hero" aria-label="Hero section">
            <h1 ref={headingRef} className="reveal-text-container">
                <div className="typewriter-container">
                    <span className="dynamic-text typewriter">{displayText}</span>
                    <span className="static-text"> I’m</span>
                </div>
                <div>JAIMIN JARIWALA</div>
            </h1>
            <div ref={textRef} className="reveal-text-container">
                <p>
                    I am deeply interested in Computer Vision, Reinforcement Learning & Robotics, especially Training Robots in Simulation.
                </p>
                <p>
                    Perhaps, Web Development & UI / UX has always been my field of interest. I am also inspired by Swiss Design, Neo—Brutalism, Typography and how Human Psychology interpret Websites.
                </p>
            </div>

        </div>
    )
};

export default Hero;