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
    const closeResume = document.getElementById('close-resume');
    
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
    if (resumeLink && resumeOverlay && closeResume) {
        resumeLink.addEventListener('click', function(e) {
            e.preventDefault();
            resumeOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        closeResume.addEventListener('click', closeResumeOverlay);

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