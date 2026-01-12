import './History.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const History = () => {
    const textRef = useScrollReveal();

    return (
        <div className="history" id="history">
            <div className='content-and-image'>
                <div ref={textRef} className="content">
                    <p className='reveal-text-container'>
                        I am a Software Developer who loves solving challenging problems & building scalable web applications. I completed my Bachelor’s in Computer Science between 2020—24 with a 3.5 GPA and worked as an AI / Machine Learning Intern @Logicwind from May—December 2024. Began my Master’s in Computer Science journey from The George Washington University, Washington D.C. in fall 2025. Besides work, I like to travel a lot, play spikeball and badminton and enjoys cooking.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default History;
