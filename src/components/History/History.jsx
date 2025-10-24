import './History.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const History = () => {
    // const [isHovering, setIsHovering] = useState(false);
    const textRef = useScrollReveal();

    return (
        <div className="history" id="history">
            
            <h1 className='reveal-text-container'>Background</h1>

            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                    Bachelor&apos;s in Computer Science 2020—24<br></br>(3.5 GPA)
                    </p>
                    <p className='reveal-text-container'>
                        AI / Machine Learning Intern, Logicwind<br></br>May—December 2024.
                    </p>
                    <p className='reveal-text-container'>
                        Currently pursing a Master&apos;s in Computer Science from The George Washington University, Washington D.C.
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