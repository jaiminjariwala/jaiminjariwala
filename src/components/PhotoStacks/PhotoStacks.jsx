import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PhotoStacks.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const gsapTween = useRef(null);
  const velocityRef = useRef([]);
  const textRef = useScrollReveal();
  const accordionRefs = useRef([]);
  const holdTimeoutRef = useRef(null);
  const continuousScrollTween = useRef(null);

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
        'IMG_1015_gueu52',
        'IMG_1107_reijzd',
        'IMG_1219_nzkgwm'
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
        'IMG_1403_oa6ghq',
      ]
    },
    {
      title: 'Baltimore',
      photos: [
        'FullSizeR_kawt6z',
        'IMG_0608_sr0ixr',
        'FullSizeR_yeb66c',
        'FullSizeR_wwzqrj',
        'FullSizeR_fnx6qd',
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
    // Kill any ongoing GSAP animation immediately when toggling
    if (gsapTween.current) {
      gsapTween.current.kill();
      gsapTween.current = null;
    }
    
    if (continuousScrollTween.current) {
      continuousScrollTween.current.kill();
      continuousScrollTween.current = null;
    }
    
    // Stop dragging state
    setIsDragging(false);
    setDraggedPhotoIndex(null);
    
    const accordion = accordionRefs.current[index];
    if (!accordion) return;

    if (expandedSection === index) {
      // Closing animation
      gsap.to(accordion, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setExpandedSection(null);
        }
      });
    } else {
      // Close any currently open section first
      if (expandedSection !== null) {
        const prevAccordion = accordionRefs.current[expandedSection];
        if (prevAccordion) {
          gsap.to(prevAccordion, {
            height: 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
        }
      }

      // Opening animation
      setExpandedSection(index);
      
      // Wait a tick for the state to update
      setTimeout(() => {
        // Get the natural height
        accordion.style.height = 'auto';
        const naturalHeight = accordion.offsetHeight;
        accordion.style.height = '0px';
        
        gsap.to(accordion, {
          height: naturalHeight,
          duration: 0.4,
          ease: "power2.inOut"
        });

        // Reset scroll position
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
            checkScrollPosition();
          }
        }, 100);
      }, 10);
    }
    
    setIsAtEnd(false);
  };

  // Get photo index from mouse position
  const getPhotoIndexFromPosition = (clientX) => {
    if (!scrollContainerRef.current) return null;
    
    const container = scrollContainerRef.current;
    const photos = container.querySelectorAll('.photo-item');
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const rect = photo.getBoundingClientRect();
      
      if (clientX >= rect.left && clientX <= rect.right) {
        return i;
      }
    }
    
    return null;
  };

  // Drag handlers
  const handleMouseDown = (e, sectionIndex) => {
    if (expandedSection !== sectionIndex) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    velocityRef.current = [];
    
    // Get which photo is being clicked
    const photoIndex = getPhotoIndexFromPosition(e.clientX);
    setDraggedPhotoIndex(photoIndex);
    
    // Kill any ongoing GSAP animation
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
    
    if (continuousScrollTween.current) {
      continuousScrollTween.current.kill();
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
      setDraggedPhotoIndex(null);
      
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
    
    // Get which photo is being touched
    const photoIndex = getPhotoIndexFromPosition(e.touches[0].clientX);
    setDraggedPhotoIndex(photoIndex);
    
    // Kill any ongoing GSAP animation
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
    
    if (continuousScrollTween.current) {
      continuousScrollTween.current.kill();
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
      setDraggedPhotoIndex(null);
      
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
    
    if (continuousScrollTween.current) {
      continuousScrollTween.current.kill();
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

  // Continuous scroll with GSAP for silky smooth animation
  const startContinuousScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    // Kill any ongoing GSAP animations
    if (gsapTween.current) {
      gsapTween.current.kill();
    }
    
    if (continuousScrollTween.current) {
      continuousScrollTween.current.kill();
    }
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Calculate the maximum scroll distance
    const maxScroll = scrollWidth - clientWidth;
    
    // Determine target based on direction
    const target = direction === 'left' ? 0 : maxScroll;
    
    // Calculate distance to target
    const distance = Math.abs(target - scrollLeft);
    
    // Calculate duration based on distance (slower = more smooth)
    // ~2 seconds per 1000px of scrolling
    const duration = (distance / 1000) * 2;
    
    // Use GSAP to animate scrollLeft with smooth easing
    continuousScrollTween.current = gsap.to(container, {
      scrollLeft: target,
      duration: duration,
      ease: "none", // Linear for continuous feel, or use "power1.inOut" for slight easing
      onUpdate: checkScrollPosition,
      onComplete: checkScrollPosition
    });
  };

  const stopContinuousScroll = () => {
    // Clear the timeout for starting continuous scroll
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    
    // Kill the continuous scroll tween with smooth deceleration
    if (continuousScrollTween.current) {
      // Get current progress and kill the tween
      continuousScrollTween.current.kill();
      continuousScrollTween.current = null;
      
      // Optional: Add a smooth deceleration effect when stopping
      if (scrollContainerRef.current) {
        const currentScroll = scrollContainerRef.current.scrollLeft;
        gsapTween.current = gsap.to(scrollContainerRef.current, {
          scrollLeft: currentScroll,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: checkScrollPosition,
          onComplete: checkScrollPosition
        });
      }
    }
  };

  const handleArrowMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Perform initial scroll immediately
    scrollPhotos(direction);
    
    // Set a timeout to start continuous scrolling only if button is held
    // for more than 500ms (half a second)
    holdTimeoutRef.current = setTimeout(() => {
      startContinuousScroll(direction);
    }, 500);
  };

  const handleArrowMouseUp = (e) => {
    e.stopPropagation();
    stopContinuousScroll();
  };

  // Add scroll event listener and prevent wheel scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Prevent wheel/trackpad scrolling
      const preventWheel = (e) => {
        e.preventDefault();
      };
      
      container.addEventListener('scroll', checkScrollPosition);
      container.addEventListener('wheel', preventWheel, { passive: false });
      checkScrollPosition();
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        container.removeEventListener('wheel', preventWheel);
      };
    }
  }, [expandedSection]);

  // Cleanup GSAP tweens on unmount
  useEffect(() => {
    return () => {
      if (gsapTween.current) {
        gsapTween.current.kill();
      }
      if (continuousScrollTween.current) {
        continuousScrollTween.current.kill();
      }
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
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
      <div className="photo-stacks-layout">
        <div className="gallery-title-container">
          <h1 className="gallery-title">Gallery</h1>
        </div>
        
        <div className="accordion-container" ref={textRef}>
          {photoSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="accordion-section reveal-text-container">
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
                ref={(el) => (accordionRefs.current[sectionIndex] = el)}
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
                      <div 
                        key={photoIndex} 
                        className={`photo-item ${isDragging && draggedPhotoIndex === photoIndex ? 'dragging' : ''}`}
                      >
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
                      onMouseDown={(e) => handleArrowMouseDown(e, 'left')}
                      onMouseUp={handleArrowMouseUp}
                      onMouseLeave={stopContinuousScroll}
                      onTouchStart={(e) => handleArrowMouseDown(e, 'left')}
                      onTouchEnd={handleArrowMouseUp}
                      aria-label="Scroll left"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className={`arrow-btn right ${!isAtEnd ? 'active' : ''}`}
                      onMouseDown={(e) => handleArrowMouseDown(e, 'right')}
                      onMouseUp={handleArrowMouseUp}
                      onMouseLeave={stopContinuousScroll}
                      onTouchStart={(e) => handleArrowMouseDown(e, 'right')}
                      onTouchEnd={handleArrowMouseUp}
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
      </div>
    </section>
  );
};

export default PhotoStacks;
