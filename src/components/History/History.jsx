import './History.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useState, useRef } from 'react';

const History = () => {
    const textRef = useScrollReveal();
    const [isSticky, setIsSticky] = useState(false);
    const sectionRef = useRef(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY.current;
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionTop = rect.top + currentScrollY;
            const sectionBottom = sectionTop + rect.height;

            // Only enable sticky when scrolling down and within the section
            if (scrollingDown && currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
                setIsSticky(true);
            } else if (!scrollingDown) {
                // Disable sticky when scrolling up
                setIsSticky(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="history" id="history" ref={sectionRef}>
            <div className={`history-sticky-wrapper ${isSticky ? 'sticky-active' : ''}`}>
                <div className='content-and-image'>
                    <div ref={textRef} className="content">
                        <p className='reveal-text-container'>
                            I did my Bachelor's in Computer Science between 2020—24 scoring 3.5 GPA. Previous AI / Machine Learning Intern @Logicwind between May—December 2024. Began my Master's in Computer Science journey from The George Washington University, Washington D.C. in fall 2025. I Love solving problems & building scalable web applications. Inspired by Swiss Design, Liquid Glass & Neobrutalism. Currently, exploring GSAP animations and Three.js. Also, besides work I like to travel a lot, play spikeball and badminton and enjoys cooking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
