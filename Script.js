// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            navToggle.innerHTML = '&#10005;';
        } else {
            navToggle.innerHTML = '&#9776;';
        }
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        let targetId = '';
        if (href.startsWith('#')) {
            targetId = href;
        } else if (href.includes('#') && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'))) {
            targetId = href.substring(href.indexOf('#'));
        }

        if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });

                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (navToggle) navToggle.innerHTML = '&#9776;';
                }
            }
        }
    });
});

// Drag to Scroll functionality for collections and product strips
const dragScrollContainers = document.querySelectorAll('.ccat-imgs, .product-strip');

dragScrollContainers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    // Desktop Mouse Events for dragging
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevents image/text highlighting
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        
        if (Math.abs(walk) > 5) {
            isDragging = true;
        }
        
        container.scrollLeft = scrollLeft - walk;
    });

    // Prevent clicking links if we were dragging
    container.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Touch events for mobile to prevent unwanted link clicks (scrolling is native on mobile via CSS)
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
        isDragging = false;
        touchStartX = e.touches[0].pageX;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        if (Math.abs(touchX - touchStartX) > 10) {
            isDragging = true;
        }
    }, { passive: true });

    // Prevent default drag of images to avoid conflicts on desktop
    container.querySelectorAll('img, a').forEach(el => {
        el.addEventListener('dragstart', (e) => e.preventDefault());
    });
});

