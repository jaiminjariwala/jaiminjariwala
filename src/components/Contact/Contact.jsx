import { useState, useEffect } from "react";
import './Contact.css';
import { DateTime } from 'luxon';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
    const [currentTime, setCurrentTime] = useState(
        DateTime.now().setZone("Asia/Kolkata")  // set to Indian Time Zone
    )

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now().setZone("Asia/Kolkata"))  // update time every second!
        }, 1000)

        return clearInterval(timer) // cleanup on component unmount
    }, [])

    const formatTime = (date) => {
        return date.toFormat("hh:mm a"); // 05:58 PM
    }

    const formatDate = (date) => {
        return {
            day: date.toFormat("dd"), // 02
            month: date.toFormat("MMM"), // Jan
        };
    }

    // extract day and month from currentTime
    const { day, month } = formatDate(currentTime)
    const time = formatTime(currentTime)

    const headingRef = useScrollReveal();
    const textRef = useScrollReveal();

    return (
        <div className="contact" id="contact">
            <h1>Get in touch</h1>

            <div ref={textRef} className="contact-links reveal-text-container">
                <a href="mailto:jaiminjariwala5@gmail.com" className="contact-item">MAIL</a>
                <a href="https://www.linkedin.com/in/jaiminjariwala/" className="contact-item">LINKEDIN</a>
                <a href="https://x.com/jaiminjariwala_" className="contact-item">TWITTER</a>
            </div>

            <div className="datetime-container">
                <div className="date-card">
                    <div className="holes">
                        {
                            [...Array(6)].map((_, index) => (
                                <div key={index} className="hole" />
                            ))
                        }
                    </div>
                    <div className="date-content">
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                    </div>
                </div>
                <div className="time">{time}</div>
            </div>
        </div>
    )
}

export default Contact;