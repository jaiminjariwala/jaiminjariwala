import { useState } from 'react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            <nav className="header-nav">
                <div
                    className="logo"
                    onClick={() => scrollToSection('hero')}
                    style={{ cursor: 'pointer' }}
                    aria-label="Go to home section">
                </div>

                {/* Menu text */}
                <div className="menu-text" onClick={toggleMenu}>
                    Menu
                </div>
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
                    </div>
                </div>
            </div>
        </>
    )
};

export default Header;
