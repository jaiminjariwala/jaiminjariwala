import './About.css';
import bwImage from '../../assets/images/Jaimin-Grayscale-Photo.png';
import colorImage from '../../assets/images/Jaimin-Color-Photo.png';
import { useState } from 'react';

const About = () => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="about">
            <div className="content">
                <p>Born and Brought up in Surat, Gujarat.</p>
                <p>
                    Cleared schooling with 85%<br />
                    Pursued Bachelors in Computer Science<br />
                    from Parul University (Vadodara, Gujarat)<br />
                    between 2020 & 2024 receiving 8.57 CGPA.
                </p>
                <p>
                    Tried building Self—Checkout Technology<br />
                    Startup in India.<br />
                    Later joined Logicwind Company as an AI<br />
                    and Machine Learning Intern.
                </p>
            </div>
            <img src={isHovering ? colorImage : bwImage}
                alt="Profile Picture"
                onMouseEnter={() => {setIsHovering(true)}}
                onMouseLeave={() => {setIsHovering(false)}}
                style={{willChange : 'filter'}}
            />
        </div>
    );
};

export default About;