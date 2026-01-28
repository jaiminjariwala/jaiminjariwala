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
  const [currentX, setCurrentX] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(1);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isClosingSpeedMenu, setIsClosingSpeedMenu] = useState(false);
  const speedMenuRef = useRef(null);
  const speedButtonRefs = useRef([]);
  const rightArrowRef = useRef(null);
  const menuAnimationTween = useRef(null);
  const scrollContainerRef = useRef(null);
  const gsapTween = useRef(null);
  const velocityRef = useRef([]);
  const textRef = useScrollReveal();
  const accordionRefs = useRef([]);
  const holdTimeoutRef = useRef(null);
  const continuousScrollTween = useRef(null);
  const autoScrollTween = useRef(null);

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
        'IMG_1498_b4pzgw',
        'IMG_1512_zzs3lo',
        'IMG_1497_tzsfpu',
        'IMG_1511_hazeln',
        'IMG_1507_jgoyis',
        'samples/people/boy-snow-hoodie',
        'IMG_1494_f1rdit',
        'IMG_1481_t40t8q',
        
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
    
    // Stop auto-scroll if we reach the end
    if (atEnd && isAutoScrolling) {
      stopAutoScroll();
    }
  };

  // Auto-scroll functionality with specific speed
  const startAutoScrollWithSpeed = (speed) => {
    if (!scrollContainerRef.current) return;
    
    // Kill any ongoing animations
    if (gsapTween.current) gsapTween.current.kill();
    if (continuousScrollTween.current) continuousScrollTween.current.kill();
    if (autoScrollTween.current) autoScrollTween.current.kill();
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    
    // If already at the end, don't start
    if (scrollLeft >= maxScroll - 5) {
      setIsAutoScrolling(false);
      return;
    }
    
    // Calculate duration based on speed (base duration is 20 seconds for 1x speed)
    const baseDuration = 20;
    const duration = baseDuration / speed;
    
    setIsAutoScrolling(true);
    
    // Animate from current position to end
    autoScrollTween.current = gsap.to(container, {
      scrollLeft: maxScroll,
      duration: duration * ((maxScroll - scrollLeft) / maxScroll), // Adjust based on remaining distance
      ease: "none",
      onUpdate: checkScrollPosition,
      onComplete: () => {
        setIsAutoScrolling(false);
        checkScrollPosition();
      }
    });
  };

  // Auto-scroll functionality
  const startAutoScroll = () => {
    startAutoScrollWithSpeed(autoScrollSpeed);
  };

  const stopAutoScroll = () => {
    if (autoScrollTween.current) {
      autoScrollTween.current.kill();
      autoScrollTween.current = null;
    }
    setIsAutoScrolling(false);
  };

  const toggleSpeedMenu = (e) => {
    e.stopPropagation();
    
    if (showSpeedMenu) {
      // Closing animation with GSAP
      setIsClosingSpeedMenu(true);
      
      // Kill any ongoing animation
      if (menuAnimationTween.current) {
        menuAnimationTween.current.kill();
      }
      
      const timeline = gsap.timeline({
        onComplete: () => {
          setShowSpeedMenu(false);
          setIsClosingSpeedMenu(false);
        }
      });
      
      // Animate right arrow back
      timeline.to(rightArrowRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.inOut"
      }, 0);
      
      // Animate all buttons shrinking and merging back
      speedButtonRefs.current.forEach((btn) => {
        if (btn) {
          timeline.to(btn, {
            scale: 0,
            width: 0,
            opacity: 0,
            borderRadius: "50%",
            duration: 0.45,
            ease: "power3.inOut"
          }, 0);
        }
      });
      
      menuAnimationTween.current = timeline;
      
    } else {
      // Opening animation with GSAP
      if (!isAutoScrolling) {
        startAutoScroll();
      }
      setShowSpeedMenu(true);
      
      // Wait for DOM to update
      setTimeout(() => {
        if (!speedMenuRef.current || speedButtonRefs.current.length === 0) return;
        
        // Kill any ongoing animation
        if (menuAnimationTween.current) {
          menuAnimationTween.current.kill();
        }
        
        const timeline = gsap.timeline();
        
        // First, temporarily make buttons visible but off-screen to measure their natural widths
        const naturalWidths = [];
        speedButtonRefs.current.forEach((btn) => {
          if (btn) {
            gsap.set(btn, {
              position: 'absolute',
              visibility: 'hidden',
              display: 'flex',
              width: 'auto',
              scale: 1,
              opacity: 1
            });
            naturalWidths.push(btn.offsetWidth);
          }
        });
        
        // Now set initial states for all buttons (hidden at center)
        speedButtonRefs.current.forEach((btn) => {
          if (btn) {
            gsap.set(btn, {
              position: 'relative',
              visibility: 'visible',
              scale: 0,
              width: 0,
              opacity: 0,
              borderRadius: "50%"
            });
          }
        });
        
        // Animate right arrow moving right
        // Calculate total width: sum of all button widths + gaps between them
        const totalWidth = naturalWidths.reduce((sum, width) => sum + width, 0) + (naturalWidths.length - 1) * 4 + 10; // 4px gaps, 10px final gap
        
        timeline.to(rightArrowRef.current, {
          x: totalWidth,
          duration: 0.65,
          ease: "power3.out"
        }, 0);
        
        // Animate all buttons growing and separating
        speedButtonRefs.current.forEach((btn, index) => {
          if (btn) {
            timeline.to(btn, {
              scale: 1,
              width: naturalWidths[index],
              opacity: 1,
              borderRadius: "4px",
              duration: 0.6,
              ease: "power3.out",
              delay: index * 0.06 // Smooth stagger
            }, 0.1);
          }
        });
        
        menuAnimationTween.current = timeline;
      }, 10);
    }
  };

  const selectSpeed = (speed, e) => {
    e.stopPropagation();
    
    // Update the speed first
    setAutoScrollSpeed(speed);
    
    // Trigger closing animation
    toggleSpeedMenu(e);
    
    // If auto-scrolling is active, restart with new speed
    if (isAutoScrolling) {
      stopAutoScroll();
      setTimeout(() => {
        startAutoScrollWithSpeed(speed);
      }, 50);
    }
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
    
    if (autoScrollTween.current) {
      autoScrollTween.current.kill();
      autoScrollTween.current = null;
    }
    
    // Stop dragging state and auto-scroll
    setIsDragging(false);
    setDraggedPhotoIndex(null);
    setIsAutoScrolling(false);
    setShowSpeedMenu(false);
    setIsClosingSpeedMenu(false);
    
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
          ease: "power2.inOut",
          onComplete: () => {
            // Start auto-scroll after opening animation completes
            setTimeout(() => {
              startAutoScroll();
            }, 200);
          }
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
    
    // Stop auto-scroll when user starts dragging
    stopAutoScroll();
    
    setIsDragging(true);
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
    
    // Stop auto-scroll when user starts touching
    stopAutoScroll();
    
    setIsDragging(true);
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
    
    // Stop auto-scroll when user manually scrolls
    stopAutoScroll();
    
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
    
    // Stop auto-scroll when user uses arrows
    stopAutoScroll();
    
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
      if (autoScrollTween.current) {
        autoScrollTween.current.kill();
      }
      if (menuAnimationTween.current) {
        menuAnimationTween.current.kill();
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
                    
                    {/* Speed Control Button */}
                    <div className="speed-control">
                      <button 
                        className={`speed-btn ${isAutoScrolling ? 'active' : ''} ${showSpeedMenu ? 'menu-open' : ''}`}
                        onClick={toggleSpeedMenu}
                        aria-label={`Auto-scroll speed: ${autoScrollSpeed}x`}
                      >
                        <span className="speed-text">{autoScrollSpeed}x</span>
                      </button>
                      
                      {showSpeedMenu && (
                        <div ref={speedMenuRef} className={`speed-menu ${isClosingSpeedMenu ? 'closing' : ''}`}>
                          {[0.5, 1, 2].map((speed, index) => (
                            <button
                              key={speed}
                              ref={(el) => (speedButtonRefs.current[index] = el)}
                              className={`speed-option ${speed === autoScrollSpeed ? 'selected' : ''}`}
                              onClick={(e) => selectSpeed(speed, e)}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      ref={rightArrowRef}
                      className={`arrow-btn right ${!isAtEnd ? 'active' : ''} ${showSpeedMenu ? 'menu-open' : ''}`}
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
