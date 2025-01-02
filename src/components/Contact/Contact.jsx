import { useState, useEffect } from "react";
import './Contact.css';

const Contact = () => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return clearInterval(timer)
    }, [])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (date) => {
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleString('en-US', { month: 'short' }),
        }
    }

    const { day, month } = formatDate(currentTime)
    const time = formatTime(currentTime)

    return (
        <div className="contact" id="contact">
            <h1>Get in touch</h1>

            <div className="contact-links">
                <a href="jaiminjariwala5@gmail.com" className="contact-item">MAIL</a>
                <a href="jaiminjariwala5@gmail.com" className="contact-item">LINKEDIN</a>
                <a href="jaiminjariwala5@gmail.com" className="contact-item">TWITTER</a>
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