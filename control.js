document.addEventListener('DOMContentLoaded', () => {
    const hoverLine = document.querySelector('.hover-line');
    const hoverTargets = document.querySelectorAll('.hover-target');
    const body = document.body;
    const anchorTags = document.querySelectorAll('a');

    function updateHoverLine(e, target) {
        // Check if the current target of the event is an anchor tag
        if (e.target.tagName.toLowerCase() === 'a') {
            hoverLine.style.opacity = '0';
            body.style.cursor = 'auto';
            return;
        }

        const rect = target.getBoundingClientRect();
        const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
        const topOffset = e.clientY - rect.top;
        const lineTop = Math.floor(topOffset / lineHeight) * lineHeight;

        // Get the text content and its bounding rectangles
        const range = document.createRange();
        range.selectNodeContents(target);
        const rects = range.getClientRects();

        // Check if the cursor is within any text rectangle
        let isOverText = false;
        for (let i = 0; i < rects.length; i++) {
            if (e.clientX >= rects[i].left && e.clientX <= rects[i].right &&
                e.clientY >= rects[i].top && e.clientY <= rects[i].bottom) {
                isOverText = true;
                break;
            }
        }

        if (isOverText || (e.clientY >= rect.top && e.clientY <= rect.bottom)) {
            hoverLine.style.left = `${e.clientX}px`;
            hoverLine.style.top = `${rect.top + lineTop}px`;
            hoverLine.style.height = `${lineHeight}px`;
            hoverLine.style.opacity = '1';
            body.style.cursor = 'none'; // Hide the mouse cursor
        } else {
            hoverLine.style.opacity = '0';
            body.style.cursor = 'auto'; // Show the mouse cursor
        }
    }

    hoverTargets.forEach(target => {
        target.addEventListener('mousemove', (e) => updateHoverLine(e, target));
        target.addEventListener('mouseleave', () => {
            hoverLine.style.opacity = '0';
            body.style.cursor = 'auto';
        });
    });

    anchorTags.forEach(anchor => {
        anchor.addEventListener('mouseenter', () => {
            hoverLine.style.opacity = '0';
            body.style.cursor = 'auto';
        });
        anchor.addEventListener('mouseleave', () => {
            // Do nothing here, let the hover target handle it
        });
    });

    // Ensure the cursor is visible when leaving all hover targets
    document.addEventListener('mousemove', (e) => {
        if (!e.target.closest('.hover-target')) {
            body.style.cursor = 'auto';
        }
    });
});