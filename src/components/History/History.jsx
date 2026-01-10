import './History.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const History = () => {
    // const [isHovering, setIsHovering] = useState(false);
    const textRef = useScrollReveal();

    return (
        <div className="history" id="history">

            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                    I did my Bachelor’s in Computer Science between 2020—24 scoring 3.5 GPA.
                    </p>
                    <p className='reveal-text-container'>
                        Previous AI / Machine Learning Intern @Logicwind.<br></br>May—December 2024.
                    </p>
                    <p className='reveal-text-container'>
                        Currently pursing a Master’s in Computer Science from The George Washington University, Washington D.C.
                    </p>
                    <p className='reveal-text-container'>
                        Besides work I like to travel a lot, play spikeball and badminton.
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

export default History;