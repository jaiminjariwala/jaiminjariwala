import './History.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const History = () => {
    // const [isHovering, setIsHovering] = useState(false);
    const textRef = useScrollReveal();

    return (
        <div className="history" id="history">
            
            <h1>History</h1>

            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                    Earned a Bachelor&apos;s degree in Computer Science between 2020 and 2024, achieving a CGPA of 8.57.
                    </p>
                    <p className='reveal-text-container'>
                        Later joined Logicwind Company as an AI / Machine Learning Intern from May 2024 to December 2024.
                    </p>
                    <p className='reveal-text-container'>
                        Currently pursing a Master&apos;s degree in Computer Science at The George Washington University, Washington D.C, with an expected graduation date in Spring 2027.
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