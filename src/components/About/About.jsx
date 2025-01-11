import './About.css';
import bwImage from '../../assets/images/Jaimin-Grayscale-Photo.png';
import colorImage from '../../assets/images/Jaimin-Color-Photo.png';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useState } from 'react';

const About = () => {
    // const [isHovering, setIsHovering] = useState(false);
    const textRef = useScrollReveal();

    return (
        <div className="about" id="about">
            
            <h1>About—Me</h1>

            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                    Completed my schooling with 85%<br />and earned a Bachelor's degree in Computer Science between 2020 and 2024, achieving a CGPA of 8.57.
                    </p>
                    <p className='reveal-text-container'>
                        Tried building Self—Checkout Technology Startup in India.
                        Later joined Logicwind Company as an AI / Machine Learning Intern.
                    </p>
                </div>
                {/* <img src={isHovering ? colorImage : bwImage}
                    alt="Profile Picture"
                    onMouseEnter={() => { setIsHovering(true) }}
                    onMouseLeave={() => { setIsHovering(false) }}
                    style={{ willChange: 'filter' }}
                /> */}
            </div>
        </div>
    );
};

export default About;