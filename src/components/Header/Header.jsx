import './Header.css';

const Header = () => (
    <nav className="header-nav">
        <div className='logo'></div>
        <div>
            <ul className="nav-list">
                <li>Home</li>
                <li>About—Me</li>
                <li>Work</li>
                <li>Holidays</li>
                <li>Contact</li>
            </ul>
        </div>
    </nav>
);

export default Header;