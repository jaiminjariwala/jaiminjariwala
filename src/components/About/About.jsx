import './About.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const About = () => {
    // const [isHovering, setIsHovering] = useState(false);
    const textRef = useScrollReveal();

    return (
        <div className="about" id="about">
            
            <h1>About—Me</h1>

            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                        I’m passionate about enabling robotic autonomy for both humanoid and space exploration robots — through SLAM, Computer Vision, Reinforcement & Imitation Learning in simulated environments.
                    </p>
                    <p className='reveal-text-container'>
                        Furthermore, I like analyzing data, carrying out insights from it and building Machine Learning models using Pytorch.
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