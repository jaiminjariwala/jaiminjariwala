import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  const ref = useRef(null);

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

    // Observe the element referenced by the ref
    if (ref.current) {
      // Observe all children with reveal-text-container class
      const elements = ref.current.querySelectorAll('.reveal-text-container');
      elements.forEach(element => {
        observer.observe(element);
      });

      // Immediately check if elements are already in view
      // This handles the case where elements are visible on page load
      setTimeout(() => {
        elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInView) {
            element.classList.add('reveal');
          }
        });
      }, 100);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
};
