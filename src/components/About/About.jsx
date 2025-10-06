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
                        I’m passionate about building intelligent systems that empower devices to see, understand, and interact with the world as humans do. My goal is to design AI models that run efficiently on-device — enabling real-time perception, learning, and adaptation while keeping user experience and privacy at the core.
                    </p>
                    <p className='reveal-text-container'>
                        My interests lie at the intersection of Deep Learning, Computer Vision and on-device AI, where intelligence enhances everyday experiences without compromising user trust.
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