import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PhotoStacks.css';

const CLOUD_NAME = "deodbdaxc";

const getCloudinaryUrl = (publicId, width = 1200) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
};

const PhotoStacks = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef(null);
  const gsapTween = useRef(null);
  const velocityRef = useRef([]);

  const photoSections = [
    {
      title: 'Washington D.C.',
      photos: [
        'IMG_0078_e7ossg',
        'IMG_0101_nzxq3r',
        'IMG_0102_noykcf',
        'IMG_0104_psmqqp',
        'IMG_0108_b9eoi4',
        'IMG_0109_cmfh3m',
        'IMG_0364_ydrfby',
        'IMG_0439_dq2tzj',
        'IMG_0440_zpxkjf',
        'IMG_0543_iitiuc',
        'IMG_0547_bvcr6g',
        'IMG_0765_pu9nb1',
        'IMG_0779_qh1nrc',
        'IMG_0894_cec1lu',
        'IMG_0901_ubkfyj',
        'IMG_0905_ly5aqw',
        'IMG_0908_ixrt0l',
        'IMG_0927_ijjsx3',
        'IMG_0969_yxomra',
        'IMG_0983_rat8bq',
        'IMG_1015_gueu52',
        'IMG_1107_reijzd'
      ]
    },
    {
      title: 'Virginia',
      photos: [
        'IMG_0469_wrhfaf',
        'IMG_0471_v6y6in',
        'IMG_1142_lxeaj2',
        'IMG_1391_e34lou',
        'IMG_1396_rzum4p',
        'IMG_1398_xryzkz',
        'IMG_1401_ibxtcp',
        'IMG_1402_qj6hkx',
        'IMG_1403_oa6ghq'
      ]
    },
    {
      title: 'Baltimore',
      photos: [
        'FullSizeR_lamwpt',
        'FullSizeR_kawt6z',
        'FullSizeR_pkuvcu',
        'IMG_0608_sr0ixr',
        'IMG_0576_gytzeo',
        'FullSizeR_yeb66c',
        'FullSizeR_wwzqrj',
        'FullSizeR_fnx6qd',
        'IMG_1219_nzkgwm'
      ]
    }
  ];

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // Check if we're at the very end (with 5px tolerance)
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 5;
    setIsAtEnd(atEnd);
  };

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setIsAtEnd(false);
    // Reset scroll position when opening a new section
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        checkScrollPosition();
      }
    }, 100);
  };

  // Drag handlers
  const handleMouseDown = (e, sectionIndex) => {
    if (expandedSection !== sectionIndex) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    velocityRef.current = [];
    
    // Kill any ongoing GSAP animation
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    
    const deltaX = currentX - e.clientX;
    scrollContainerRef.current.scrollLeft += deltaX;
    
    // Track velocity for momentum
    velocityRef.current.push({
      x: e.clientX,
      time: Date.now()
    });
    
    // Keep only last 5 movements for velocity calculation
    if (velocityRef.current.length > 5) {
      velocityRef.current.shift();
    }
    
    setCurrentX(e.clientX);
    checkScrollPosition();
  };

  const handleMouseUp = () => {
    if (isDragging && scrollContainerRef.current) {
      setIsDragging(false);
      
      // Calculate velocity from last movements
      if (velocityRef.current.length >= 2) {
        const first = velocityRef.current[0];
        const last = velocityRef.current[velocityRef.current.length - 1];
        const deltaX = last.x - first.x;
        const deltaTime = last.time - first.time;
        
        if (deltaTime > 0) {
          const velocity = deltaX / deltaTime;
          const momentum = velocity * 300; // Multiply by factor for distance
          const targetScroll = scrollContainerRef.current.scrollLeft - momentum;
          
          // Use GSAP for smooth momentum animation
          gsapTween.current = gsap.to(scrollContainerRef.current, {
            scrollLeft: targetScroll,
            duration: 1,
            ease: "power2.out",
            onUpdate: checkScrollPosition,
            onComplete: checkScrollPosition
          });
        }
      }
    }
  };

  const handleTouchStart = (e, sectionIndex) => {
    if (expandedSection !== sectionIndex) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    velocityRef.current = [];
    
    // Kill any ongoing GSAP animation
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    const deltaX = currentX - e.touches[0].clientX;
    scrollContainerRef.current.scrollLeft += deltaX;
    
    // Track velocity for momentum
    velocityRef.current.push({
      x: e.touches[0].clientX,
      time: Date.now()
    });
    
    if (velocityRef.current.length > 5) {
      velocityRef.current.shift();
    }
    
    setCurrentX(e.touches[0].clientX);
    checkScrollPosition();
  };

  const handleTouchEnd = () => {
    if (isDragging && scrollContainerRef.current) {
      setIsDragging(false);
      
      // Calculate velocity from last movements
      if (velocityRef.current.length >= 2) {
        const first = velocityRef.current[0];
        const last = velocityRef.current[velocityRef.current.length - 1];
        const deltaX = last.x - first.x;
        const deltaTime = last.time - first.time;
        
        if (deltaTime > 0) {
          const velocity = deltaX / deltaTime;
          const momentum = velocity * 300;
          const targetScroll = scrollContainerRef.current.scrollLeft - momentum;
          
          // Use GSAP for smooth momentum animation
          gsapTween.current = gsap.to(scrollContainerRef.current, {
            scrollLeft: targetScroll,
            duration: 1,
            ease: "power2.out",
            onUpdate: checkScrollPosition,
            onComplete: checkScrollPosition
          });
        }
      }
    }
  };

  // Arrow scroll handlers
  const scrollPhotos = (direction) => {
    if (!scrollContainerRef.current) return;
    
    // Kill any ongoing GSAP animation
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
    
    const scrollAmount = 400;
    const targetScroll = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    gsapTween.current = gsap.to(scrollContainerRef.current, {
      scrollLeft: targetScroll,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: checkScrollPosition,
      onComplete: checkScrollPosition
    });
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [expandedSection]);

  // Cleanup GSAP tween on unmount
  useEffect(() => {
    return () => {
      if (gsapTween.current) {
        gsapTween.current.kill();
      }
    };
  }, []);

  // Add class to section when expanded
  useEffect(() => {
    const section = document.getElementById('photo-stacks');
    if (expandedSection !== null) {
      section.classList.add('has-expanded');
    } else {
      section.classList.remove('has-expanded');
    }
  }, [expandedSection]);

  return (
    <section className="photo-stacks" id="photo-stacks">
      <div className="accordion-container">
        {photoSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="accordion-section">
            <div 
              className="accordion-header"
            >
              <div 
                className="header-left"
                onClick={() => toggleSection(sectionIndex)}
              >
                <h2 className="location-title">{section.title}</h2>
                <button 
                  className={`expand-btn ${expandedSection === sectionIndex ? 'expanded' : ''}`}
                  aria-label={expandedSection === sectionIndex ? 'Collapse' : 'Expand'}
                >
                </button>
              </div>
            </div>
            
            <div 
              className={`accordion-content ${expandedSection === sectionIndex ? 'expanded' : ''}`}
            >
              <div 
                className="photos-wrapper"
                ref={expandedSection === sectionIndex ? scrollContainerRef : null}
                onMouseDown={(e) => handleMouseDown(e, sectionIndex)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => handleTouchStart(e, sectionIndex)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="photos-container">
                  {section.photos.map((photo, photoIndex) => (
                    <div key={photoIndex} className="photo-item">
                      <img 
                        src={getCloudinaryUrl(photo, 1200)}
                        srcSet={`
                          ${getCloudinaryUrl(photo, 600)} 600w,
                          ${getCloudinaryUrl(photo, 1200)} 1200w,
                          ${getCloudinaryUrl(photo, 1800)} 1800w
                        `}
                        sizes="(max-width: 768px) 80vw, 40vw"
                        loading="lazy"
                        alt={`${section.title} photo ${photoIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {expandedSection === sectionIndex && (
                <div className="carousel-arrows">
                  <button 
                    className={`arrow-btn left ${isAtEnd ? 'active' : ''}`}
                    onClick={() => scrollPhotos('left')}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Scroll left"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={`arrow-btn right ${!isAtEnd ? 'active' : ''}`}
                    onClick={() => scrollPhotos('right')}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Scroll right"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoStacks;
