import { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isHeaderDark, setIsHeaderDark] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const darkSections = document.querySelectorAll('[data-theme="dark"]');
        if (!darkSections.length) {
            setIsHeaderDark(false);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const anyDarkInView = entries.some((entry) => entry.isIntersecting);
                setIsHeaderDark(anyDarkInView);
            },
            {
                root: null,
                threshold: 0.1,
                rootMargin: '-20% 0px -70% 0px'
            }
        );

        darkSections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <nav className={`header-nav ${isHeaderDark ? 'dark' : ''}`}>
                {/* Menu text - now treated as a button */}
                <button className="menu-text" onClick={toggleMenu}>
                    Menu
                </button>
            </nav>

            {/* Full-page black overlay menu */}
            <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <button className="close-menu" onClick={toggleMenu}>✕</button>
                
                <div className="menu-contacts">
                    <h2>Contacts</h2>
                    <div className="menu-links">
                        <a href="mailto:jaiminjariwala5@icloud.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            Mail
                        </a>
                        <a href="https://www.linkedin.com/in/jaiminjariwala/" 
                            target="_blank"
                            rel="noopener noreferrer">
                            LinkedIn
                        </a>
                        <a href="https://x.com/jaiminjariwala_"
                            target="_blank"
                            rel="noopener noreferrer">
                            Twitter
                        </a>
                        <a href="https://github.com/jaiminjariwala"
                            target="_blank"
                            rel="noopener noreferrer">
                            GitHub
                        </a>
                        <a href="https://www.kaggle.com/jaiminmukeshjariwala/code" 
                            target="_blank"
                            rel="noopener noreferrer">
                            Kaggle
                        </a>
                        <a href="https://leetcode.com/u/jaiminjariwala/"
                            target="_blank"
                            rel="noopener noreferrer">
                            LeetCode
                        </a>
                        {/* Resume removed */}
                    </div>
                </div>
            </div>

            {/* Resume popup */}
            {false && null}
        </>
    )
};

export default Header;
