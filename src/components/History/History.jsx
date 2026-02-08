import { useState } from 'react';
import './History.css';

const History = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            text: "I am living in Arlington, VA and currently I am 2nd semester Master's in Computer Science student at The George Washington University, Washington D.C. majoring in Software Engineering.",
            hasImage: true
        },
        {
            id: 1,
            text: "I completed my Bachelor’s in Computer Science between 2020—24 with a 3.5 GPA and worked as an AI / Machine Learning Intern @Logicwind from May—December 2024.",
            hasImage: false
        },
        {
            id: 2,
            text: "I like to travel a lot, play spikeball and badminton and enjoys cooking.",
            hasImage: false
        }
    ];

    const goPrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
    const goNext = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

    return (
        <div className="history" id="history">
            <div className="history-slider">
                <div
                    className="history-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className="history-slide">
                            {slide.hasImage ? (
                                <div className="history-slide-content with-image">
                                    <div className="history-text">
                                        <p>{slide.text}</p>
                                    </div>
                                    <div className="history-image">
                                        <iframe
                                            className="history-map"
                                            title="Apple Maps - 1111 Army Navy Dr, Arlington, VA"
                                            src="https://maps.apple.com/?q=1111%20Army%20Navy%20Dr%2C%20Arlington%2C%20VA"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="history-slide-content">
                                    <p>{slide.text}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="history-nav">
                <button
                    className="history-arrow"
                    onClick={goPrev}
                    disabled={currentSlide === 0}
                    aria-label="Previous slide"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button
                    className="history-arrow"
                    onClick={goNext}
                    disabled={currentSlide === slides.length - 1}
                    aria-label="Next slide"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default History;
