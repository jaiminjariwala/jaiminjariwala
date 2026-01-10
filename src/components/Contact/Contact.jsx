import './Contact.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
    const textRef = useScrollReveal();

    return (
        <div className="contact" id="contact">
            <div ref={textRef} className="contact-content">
                <div className="contact-links">
                    <div className="contact-column">
                        <a href="mailto:jaiminjariwala5@icloud.com"
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            MAIL
                        </a>
                        <a href="https://www.linkedin.com/in/jaiminjariwala/" 
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            LINKEDIN
                        </a>
                        <a href="https://x.com/jaiminjariwala_"
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            TWITTER
                        </a>
                    </div>
                    <div className="contact-column">
                        <a href="https://github.com/jaiminjariwala"
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            GITHUB
                        </a>
                        <a href="https://www.kaggle.com/jaiminmukeshjariwala/code" 
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            KAGGLE
                        </a>
                        <a href="https://leetcode.com/u/jaiminjariwala/"
                            className="contact-item reveal-text-container"
                            target="_blank"
                            rel="noopener noreferrer">
                            LEETCODE
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
