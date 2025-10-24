import { useState, useEffect } from "react";
import './Contact.css';
import { DateTime } from 'luxon';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
    const [currentTime, setCurrentTime] = useState(
        DateTime.now().setZone("America/New_York")
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now().setZone("America/New_York"))
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toFormat("hh:mm a");
    };

    const formatDate = (date) => {
        return {
            day: date.toFormat("dd"),
            month: date.toFormat("MMM"),
        };
    };

    const { day, month } = formatDate(currentTime);
    const time = formatTime(currentTime);

    const textRef = useScrollReveal();

    return (
        <div className="contact" id="contact">
            <h1 className="reveal-text-container">Get in touch</h1>

            <div ref={textRef} className="contact-links">
                <div className="contact-column">
                    <a href="mailto:jaiminjariwala5@icloud.com"
                        className="contact-item reveal-text-container"
                        target="_blank"
                        rel="noopener noreferrer">
                        MAIL
                    </a>
                    <a href="https://www.linkedin.com/in/jaimin-jariwala-296b02378/" 
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
                    <a href="https://leetcode.com/u/jaiminjariwala5/"
                        className="contact-item reveal-text-container"
                        target="_blank"
                        rel="noopener noreferrer">
                        LEETCODE
                    </a>
                </div>
            </div>

            <div className="datetime-container">
                <div className="date-card">
                    <div className="holes">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="hole" />
                        ))}
                    </div>
                    <div className="date-content">
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                    </div>
                </div>
                <div className="time">{time} EST</div>
            </div>
        </div>
    );
};

export default Contact;