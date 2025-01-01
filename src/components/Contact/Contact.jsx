import './Contact.css';

const Contact = () => (
    <div className="contact">
        <h2>Get in touch</h2>

        <div className="social-links">
            <a href="mailto:your-email@example.com">MAIL</a>
            <a href="https://linkedin.com/in/your-profile">LINKEDIN</a>
            <a href="https://twitter.com/your-handle">TWITTER</a>
        </div>

        <div className="time-widget">
            <div className="date">
                30<br />Dec
            </div>
            <div className="time">07:48 PM</div>
        </div>
    </div>
);

export default Contact;