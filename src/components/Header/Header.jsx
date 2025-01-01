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
            setIsMenuOpen(false)    // close menu after clicking
        }
    }

    return (
        <nav className="header-nav">
            <div className='logo'></div>

            {/* Hamburger Menu Button */}
            <button className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label='Toggle menu'
            >
                <span className='line'></span>
                <span className='line'></span>

            </button>

            {/* Navigation Menu */}

            <div className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
                <ul className="nav-list">
                    <li onClick={() => scrollToSection('hero')}>Home</li>
                    <li onClick={() => scrollToSection('about')}>About—Me</li>
                    <li onClick={() => scrollToSection('work')}>Work</li>
                    <li onClick={() => scrollToSection('holidays')}>Holidays</li>
                    <li onClick={() => scrollToSection('contact')}>Contact</li>
                </ul>
            </div>
        </nav>
    )

};

export default Header;