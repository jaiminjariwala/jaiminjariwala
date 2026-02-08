import { useEffect, useRef, useState } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorType, setCursorType] = useState('select-black');

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Get element directly under mouse
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
      updateCursorType(elementUnderMouse);
    };

    // Smooth cursor animation
    const animate = () => {
      const speed = 0.6;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }

      requestAnimationFrame(animate);
    };

    // Update cursor type based on element
    const updateCursorType = (element) => {
      if (!element) {
        setCursorType('select-black');
        return;
      }
      const inMenuOverlay = !!element.closest('.menu-overlay');
      const inDarkHeader = !!element.closest('.header-nav.dark');
      const inDarkSection = !!element.closest('[data-theme="dark"]');

      // Check for images or photo containers
      if (element.tagName === 'IMG' || 
          element.classList.contains('photo-item') || 
          element.closest('.photo-item') ||
          element.classList.contains('photos-wrapper') || 
          element.closest('.photos-wrapper') ||
          element.classList.contains('photos-container') || 
          element.closest('.photos-container')) {
        setCursorType('hand');
      }
      // Check for any interactive elements - use hand cursor
      else if (element.classList.contains('logo') || element.closest('.logo') ||
          element.classList.contains('close-menu') || element.closest('.close-menu') ||
          element.classList.contains('menu-text') || element.closest('.menu-text') ||
          element.classList.contains('header-left') || element.closest('.header-left') ||
          element.classList.contains('location-label') || element.closest('.location-label') ||
          element.classList.contains('location-title') || element.closest('.location-title') ||
          element.classList.contains('expand-btn') || element.closest('.expand-btn') ||
          element.classList.contains('arrow-btn') || element.closest('.arrow-btn') ||
          element.classList.contains('history-arrow') || element.closest('.history-arrow') ||
          element.classList.contains('hero-arrow') || element.closest('.hero-arrow') ||
          element.tagName === 'A' || element.tagName === 'BUTTON' || 
          element.closest('a') || element.closest('button') || 
          element.classList.contains('cursor-pointer') || element.closest('.cursor-pointer')) {
        setCursorType('hand');
      }
      // Check for text elements
      else if (element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || 
               element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'H5' || 
               element.tagName === 'H6' || element.tagName === 'SPAN' || element.tagName === 'LI' ||
               element.closest('p') || element.closest('h1') || element.closest('h2') || 
               element.closest('h3') || element.closest('h4') || element.closest('h5') || 
               element.closest('h6') || element.closest('span') || element.closest('li')) {
        setCursorType(inMenuOverlay || inDarkHeader || inDarkSection ? 'text-white' : 'text');
      }
      // Menu overlay background should use white select cursor
      else if (inMenuOverlay || inDarkHeader || inDarkSection) {
        setCursorType('select-white');
      }
      // Default - black select cursor
      else {
        setCursorType('select-black');
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    const animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor ${cursorType}`}
    />
  );
};

export default CustomCursor;
