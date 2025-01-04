import { useState, useEffect } from "react";
import './Contact.css';
import { DateTime } from 'luxon';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
    const [currentTime, setCurrentTime] = useState(
        DateTime.now().setZone("Asia/Kolkata")
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now().setZone("Asia/Kolkata"))
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

    const headingRef = useScrollReveal();
    const textRef = useScrollReveal();

    return (
        <div className="contact" id="contact">
            <h1>Get in touch</h1>

            <div ref={textRef} className="contact-links reveal-text-container">
                <div className="contact-column">
                    <a href="mailto:jaiminjariwala5@gmail.com" className="contact-item">MAIL</a>
                    <a href="https://www.linkedin.com/in/jaiminjariwala/" className="contact-item">LINKEDIN</a>
                    <a href="https://x.com/jaiminjariwala_" className="contact-item">TWITTER</a>
                </div>
                <div className="contact-column">
                    <a href="https://github.com/jaiminjariwala" className="contact-item">GITHUB</a>
                    <a href="https://www.kaggle.com/jaiminjariwala" className="contact-item">KAGGLE</a>
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
                <div className="time">{time}</div>
            </div>
        </div>
    );
};

export default Contact;