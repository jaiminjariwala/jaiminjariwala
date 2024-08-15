// document.addEventListener('DOMContentLoaded', () => {
//     const hoverLine = document.querySelector('.hover-line');
//     const hoverTargets = document.querySelectorAll('.hover-target');
//     const body = document.body;
//     const anchorTags = document.querySelectorAll('a');

//     function updateHoverLine(e, target) {
//         // Check if the current target of the event is an anchor tag
//         if (e.target.tagName.toLowerCase() === 'a') {
//             hoverLine.style.opacity = '0';
//             body.style.cursor = 'auto';
//             return;
//         }

//         const rect = target.getBoundingClientRect();
//         const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
//         const topOffset = e.clientY - rect.top;
//         const lineTop = Math.floor(topOffset / lineHeight) * lineHeight;

//         // Get the text content and its bounding rectangles
//         const range = document.createRange();
//         range.selectNodeContents(target);
//         const rects = range.getClientRects();

//         // Check if the cursor is within any text rectangle
//         let isOverText = false;
//         for (let i = 0; i < rects.length; i++) {
//             if (e.clientX >= rects[i].left && e.clientX <= rects[i].right &&
//                 e.clientY >= rects[i].top && e.clientY <= rects[i].bottom) {
//                 isOverText = true;
//                 break;
//             }
//         }

//         if (isOverText || (e.clientY >= rect.top && e.clientY <= rect.bottom)) {
//             hoverLine.style.left = `${e.clientX}px`;
//             hoverLine.style.top = `${rect.top + lineTop}px`;
//             hoverLine.style.height = `${lineHeight}px`;
//             hoverLine.style.opacity = '1';
//             body.style.cursor = 'none'; // Hide the mouse cursor
//         } else {
//             hoverLine.style.opacity = '0';
//             body.style.cursor = 'auto'; // Show the mouse cursor
//         }
//     }

//     hoverTargets.forEach(target => {
//         target.addEventListener('mousemove', (e) => updateHoverLine(e, target));
//         target.addEventListener('mouseleave', () => {
//             hoverLine.style.opacity = '0';
//             body.style.cursor = 'auto';
//         });
//     });

//     anchorTags.forEach(anchor => {
//         anchor.addEventListener('mouseenter', () => {
//             hoverLine.style.opacity = '0';
//             body.style.cursor = 'auto';
//         });
//         anchor.addEventListener('mouseleave', () => {
//             // Do nothing here, let the hover target handle it
//         });
//     });

//     // Ensure the cursor is visible when leaving all hover targets
//     document.addEventListener('mousemove', (e) => {
//         if (!e.target.closest('.hover-target')) {
//             body.style.cursor = 'auto';
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const resumeLink = document.getElementById('resume-link');
    const resumeOverlay = document.getElementById('resume-overlay');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            
            // Update nav links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update sections
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Set initial active state
    navLinks[0].classList.add('active');

    // Function to close resume overlay
    function closeResumeOverlay() {
        resumeOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Resume overlay functionality
    if (resumeLink && resumeOverlay) {
        resumeLink.addEventListener('click', function(e) {
            e.preventDefault();
            resumeOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        // Close overlay when clicking on the background
        resumeOverlay.addEventListener('click', function(e) {
            if (e.target === resumeOverlay) {
                closeResumeOverlay();
            }
        });
    }

    // Ensure resume overlay is hidden initially
    if (resumeOverlay) {
        resumeOverlay.classList.add('hidden');
    }
});

// Image container dragging functionality
document.addEventListener('DOMContentLoaded', function() {
    // Your existing DOMContentLoaded code

    const imageContainer = document.querySelector('.image-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Disable dragging for images within the container
    imageContainer.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    imageContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        imageContainer.classList.add('active');
        startX = e.pageX - imageContainer.offsetLeft;
        scrollLeft = imageContainer.scrollLeft;
    });

    imageContainer.addEventListener('mouseleave', () => {
        isDown = false;
        imageContainer.classList.remove('active');
    });

    imageContainer.addEventListener('mouseup', () => {
        isDown = false;
        imageContainer.classList.remove('active');
    });

    imageContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - imageContainer.offsetLeft;
        const walk = (x - startX) * 2;
        imageContainer.scrollLeft = scrollLeft - walk;
    });
});

// Image container: On clicking Travel section, Auto Scrolling from right to left will start, Stops when Click or Drag event is occured and again starts when coming back from other section to Travel Section.
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.image-container');
    const travelSection = document.querySelector('#travel');
    let isDragging = false;
    let startX, scrollLeft;
    let scrollInterval;

    // Preload images
    const preloadImages = (urls) => {
        urls.forEach((url) => {
            const img = new Image();
            img.src = url;
        });
    };

    preloadImages([
        'travelling_photos/GOA_1.jpg',
        'travelling_photos/GOA_4.jpg',
        'travelling_photos/GOA_2.jpg',
        'travelling_photos/GOA_6.JPG',
        'travelling_photos/KASHMIR_1.jpg',
        'travelling_photos/KASHMIR_2.jpg',
        'travelling_photos/KERALA_5.JPG',
        'travelling_photos/KERALA_1.JPG',
        'travelling_photos/KERALA_6.JPG',
        'travelling_photos/DUBAI_1.jpg'
    ]);

    // Function to automatically scroll images
    const startAutoScroll = () => {
        scrollInterval = setInterval(() => {
            container.scrollLeft += 0.5; // Adjust this value to change the speed
        }, 14); // Adjust this value to change the frequency
    };

    // Stop the automatic scrolling
    const stopAutoScroll = () => {
        clearInterval(scrollInterval);
    };

    // Handle dragging
    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.classList.add('dragging');
        stopAutoScroll(); // Stop auto-scrolling when the user starts dragging
    };

    const handleMouseLeave = () => {
        isDragging = false;
        container.classList.remove('dragging');
    };

    const handleMouseUp = () => {
        isDragging = false;
        container.classList.remove('dragging');
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Adjust multiplier for sensitivity
        container.scrollLeft = scrollLeft - walk;
    };

    // Start automatic scrolling when clicking on the "Travel" section
    const startTravelSection = () => {
        startAutoScroll();
    };

    // Stop automatic scrolling and enable manual dragging on container click or drag
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', stopAutoScroll); // Stop on any click inside the container

    // Observe when the travel section becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTravelSection();
            } else {
                stopAutoScroll();
            }
        });
    });

    observer.observe(travelSection);
});










