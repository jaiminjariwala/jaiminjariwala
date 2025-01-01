import './Holidays.css';

const Holidays = () => (
    <div className="holidays">
        <h3>Upcoming in my Holidays or Adventure List is to once a lifetime visit ICELAND'S Black Sand Beach...</h3>
        <div className="image-grid">
            <div className="image-item">
                <img src="/path/to/kashmir-mini.jpg" alt="Kashmir Mini" />
                <p>Kashmir-Mini</p>
            </div>
            <div className="image-item">
                <img src="/path/to/sonmarg.jpg" alt="Sonmarg Kashmir" />
                <p>Sonmarg, Kashmir</p>
            </div>
            <div className="image-item">
                <img src="/path/to/burj-khalifa.jpg" alt="Burj Khalifa Dubai" />
                <p>Burj Khalifa, Dubai</p>
            </div>
        </div>
    </div>
);

export default Holidays;