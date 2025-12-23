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

    const formatDate = (date) => {
        return {
            day: date.toFormat("dd"),
            month: date.toFormat("MMM"),
        };
    };

    const { day, month } = formatDate(currentTime);
    
    // Calculate angles for clock hands (12 is at top = 0 degrees)
    const hours = currentTime.hour % 12;
    const minutes = currentTime.minute;
    const seconds = currentTime.second;
    
    const secondAngle = seconds * 6; // 6 degrees per second
    const minuteAngle = minutes * 6 + seconds * 0.1; // 6 degrees per minute
    const hourAngle = hours * 30 + minutes * 0.5; // 30 degrees per hour

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
                
                <div className="clock-wrapper">
                    <svg className="clock" viewBox="0 0 200 200">
                        {/* Outer white circle (clock face) */}
                        <circle cx="100" cy="100" r="90" fill="#141414"/>
                        
                        {/* Donut ring - outer circle */}
                        <circle 
                            cx="100" 
                            cy="100" 
                            r="85" 
                            fill="none" 
                            // stroke="black"
                            strokeWidth="2"
                        />
                        
                        {/* Minute markers (small, consistent height) */}
                        {[...Array(60)].map((_, i) => {
                            if (i % 5 !== 0) { // Skip hour positions
                                const angle = (i * 6 - 90) * Math.PI / 180;
                                const x1 = 100 + Math.cos(angle) * 85;
                                const y1 = 100 + Math.sin(angle) * 85;
                                const x2 = 100 + Math.cos(angle) * 80;
                                const y2 = 100 + Math.sin(angle) * 80;
                                return (
                                    <line 
                                        key={i}
                                        x1={x1} 
                                        y1={y1} 
                                        x2={x2} 
                                        y2={y2} 
                                        stroke="white" 
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                );
                            }
                            return null;
                        })}
                        
                        {/* Hour markers (slightly taller) */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 - 90) * Math.PI / 180;
                            const x1 = 100 + Math.cos(angle) * 85;
                            const y1 = 100 + Math.sin(angle) * 85;
                            const x2 = 100 + Math.cos(angle) * 78;
                            const y2 = 100 + Math.sin(angle) * 78;
                            return (
                                <line 
                                    key={i}
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    stroke="white" 
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                />
                            );
                        })}
                        
                        {/* Hour numbers - 12 at top */}
                        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
                            const angle = (i * 30 - 90) * Math.PI / 180;
                            const x = 100 + Math.cos(angle) * 62;
                            const y = 100 + Math.sin(angle) * 62;
                            return (
                                <text
                                    key={num}
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="16"
                                    fontWeight="500"
                                    rx={6}
                                    ry={6}
                                    fill="white"
                                    fontFamily="Helvetica, Arial, sans-serif"
                                >
                                    {num}
                                </text>
                            );
                        })}
                        
                        {/* Hour hand - rounded rectangle */}
                        <g style={{
                            transform: `rotate(${hourAngle}deg)`,
                            transformOrigin: '100px 100px',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
                        }}>
                            <rect
                                x="97"
                                y="55"
                                width="6"
                                height="45"
                                rx="3"
                                fill="white"
                            />
                        </g>
                        
                        {/* Minute hand - rounded rectangle */}
                        <g style={{
                            transform: `rotate(${minuteAngle}deg)`,
                            transformOrigin: '100px 100px',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
                        }}>
                            <rect
                                x="98"
                                y="30"
                                width="4"
                                height="70"
                                rx="2"
                                fill="white"
                            />
                        </g>
                        
                        {/* Second hand (thin, orange, extends beyond donut ring) */}
                        <line
                            x1="100"
                            y1="115"
                            x2="100"
                            y2="20"
                            stroke="#FF9500"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{
                                transform: `rotate(${secondAngle}deg)`,
                                transformOrigin: '100px 100px',
                                transition: 'none'
                            }}
                        />
                        
                        {/* Center hollow donut - white center with black border */}
                        <circle cx="100" cy="100" r="5" fill="black" stroke="white" strokeWidth="2"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Contact;
