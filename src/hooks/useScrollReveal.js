import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1  // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        // Add reveal class when element comes into view
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        } else {
          // Remove reveal class when element goes out of view
          entry.target.classList.remove('reveal');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with reveal-text-container class
    document.querySelectorAll('.reveal-text-container').forEach(element => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};