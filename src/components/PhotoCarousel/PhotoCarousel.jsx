import { useState, useRef, useEffect } from 'react';
import './PhotoCarousel.css';

const CLOUD_NAME = "deodbdaxc";

const getCloudinaryUrl = (publicId, width = 1200) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
};

const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef(null);

  const photoSections = [
    {
      title: 'Washington D.C.',
      photos: [
        'IMG_0078_e7ossg', 'IMG_0101_nzxq3r', 'IMG_0102_noykcf', 'IMG_0104_psmqqp',
        'IMG_0108_b9eoi4', 'IMG_0109_cmfh3m', 'IMG_0364_ydrfby', 'IMG_0439_dq2tzj',
        'IMG_0440_zpxkjf', 'IMG_0543_iitiuc', 'IMG_0547_bvcr6g', 'IMG_0765_pu9nb1',
        'IMG_0779_qh1nrc', 'IMG_0894_cec1lu', 'IMG_0901_ubkfyj', 'IMG_0905_ly5aqw',
        'IMG_0908_ixrt0l',
        'IMG_1015_gueu52', 'IMG_1107_reijzd'
      ]
    },
    {
      title: 'Virginia',
      photos: [
        'IMG_0122_owh6cj', 'IMG_0469_wrhfaf', 'IMG_0471_v6y6in', 'IMG_1142_lxeaj2',
        'IMG_1391_e34lou', 'IMG_1396_rzum4p', 'IMG_1398_xryzkz', 'IMG_1401_ibxtcp',
        'IMG_1402_qj6hkx', 'IMG_1403_oa6ghq'
      ]
    },
    {
      title: 'Baltimore',
      photos: [
        'FullSizeR_kawt6z', 'IMG_0608_sr0ixr',
        'FullSizeR_yeb66c', 'FullSizeR_wwzqrj', 'FullSizeR_fnx6qd',
      ]
    }
  ];

  // Flatten all photos into one array
  const allPhotos = photoSections.flatMap(section => 
    section.photos.map(photo => ({
      publicId: photo,
      location: section.title
    }))
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (translateX > 100) {
      prevSlide();
    } else if (translateX < -100) {
      nextSlide();
    }
    
    setTranslateX(0);
  };

  // Touch drag handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].pageX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (translateX > 100) {
      prevSlide();
    } else if (translateX < -100) {
      nextSlide();
    }
    
    setTranslateX(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  return (
    <section className="photo-carousel" id="photo-carousel">
      <div 
        className="carousel-container"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {allPhotos.map((photo, index) => (
            <div key={index} className="carousel-slide">
              <div className="photo-card">
                <div className="photo-tag">{photo.location}</div>
                <img
                  src={getCloudinaryUrl(photo.publicId, 1400)}
                  srcSet={`
                    ${getCloudinaryUrl(photo.publicId, 800)} 800w,
                    ${getCloudinaryUrl(photo.publicId, 1400)} 1400w,
                    ${getCloudinaryUrl(photo.publicId, 2000)} 2000w
                  `}
                  sizes="(max-width: 768px) 90vw, 70vw"
                  alt={`${photo.location} photo`}
                  draggable="false"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="carousel-nav">
          <button 
            className="nav-arrow prev" 
            onClick={prevSlide}
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="nav-arrow next" 
            onClick={nextSlide}
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Slide indicator */}
        <div className="slide-indicator">
          {currentIndex + 1} / {allPhotos.length}
        </div>
      </div>
    </section>
  );
};

export default PhotoCarousel;
