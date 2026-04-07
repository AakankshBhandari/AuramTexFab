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
