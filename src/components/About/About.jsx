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
                        I’m passionate about enabling robotic autonomy for both humanoid and space exploration robots — from SLAM and Computer Vision to Reinforcement and Imitation Learning in simulated environments.
                    </p>
                    <p className='reveal-text-container'>
                        Currently exploring <strong>ROS2</strong>, <strong>Isaac Sim</strong>, <strong>MuJoCo</strong>, <strong>PyBullet</strong>, <strong>Gazebo</strong> & <strong>Deep RL</strong> to shape the next generation of robotic intelligence.
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