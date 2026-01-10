import './Philosophy.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Philosophy = () => {
    const textRef = useScrollReveal();

    return (
        <div className="philosophy" id="philosophy">
            <div ref={textRef}>
                <h1 className="reveal-text-container">Less, but better.</h1>
            </div>
        </div>
    );
};

export default Philosophy;
