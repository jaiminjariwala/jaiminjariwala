import './Hero.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Hero = () => {
    const headingRef = useScrollReveal();
    const textRef = useScrollReveal();

    return (
        <div className="hero" id="hero">
            <h1 ref={headingRef} className="reveal-text-container">
                JAIMIN<br />JARIWALA
            </h1>
            <div ref={textRef} className="reveal-text-container">
                <p>
                    Deeply interested in Web Development & UI / UX.<br />
                    Inspired by Swiss Design and how Human Psychology works.<br />
                    Mostly play around with Typography & loves Neo—brutalism.
                </p>
                <p>
                    Perhaps, Computer Vision, Reinforcement Learning,<br />
                    Self-Driving Cars and Robotics has always been my field of interest.
                </p>
            </div>

        </div>
    )
};

export default Hero;