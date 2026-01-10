import './Philosophy.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Philosophy = () => {
    const textRef = useScrollReveal();

    return (
        <div className="philosophy" id="philosophy">
            <div ref={textRef}>
                <h1 className="reveal-text-container">
                    <span className="desktop-text">Less, but better.</span>
                    <span className="mobile-text">
                        <span className="line">Less,</span>
                        <span className="line">but better.</span>
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default Philosophy;
