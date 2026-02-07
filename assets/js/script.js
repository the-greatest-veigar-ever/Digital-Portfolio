
/* 
 * Portfolio Main Script
 * Author: Nguyen Minh Quan
 * Last Updated: 2026
 */

/* =========================================
   1. Theme Manager
   ========================================= */
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindToggleButton();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleIcon();
        // Trigger resize for canvas redraws when theme changes
        window.dispatchEvent(new Event('resize'));
    }

    updateToggleIcon() {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            const icon = toggleButton.querySelector('i');
            if (this.theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();

        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    bindToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }
    }
}

/* =========================================
   2. Mobile Navigation
   ========================================= */
class MobileNav {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.overlay = document.getElementById('mobile-menu-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.mobileMenuToggle && this.navMenu && this.overlay) {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Toggle button click
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());

        // Overlay click to close
        this.overlay.addEventListener('click', () => this.closeMenu());

        // Close menu when nav link is clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.mobileMenuToggle.classList.add('active');
        this.navMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeMenu() {
        this.isOpen = false;
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/* =========================================
   3. UI Animations (TypeWriter, Staggered)
   ========================================= */
class TypeWriter {
    constructor(element, cursor, textList, waitTime = 3000) {
        this.element = element;
        this.cursor = cursor;
        this.textList = textList;
        this.waitTime = waitTime;
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.textList.length;
        const fullTxt = this.textList[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = 50;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.waitTime;
            this.isDeleting = true;
            this.cursor.style.display = 'inline-block'; // Keep blinking while waiting
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

/* =========================================
   4. Cyber Network Visuals
   ========================================= */
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1; // Velocity
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }

    draw(ctx) {
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(0, 255, 65, 0.5)' : 'rgba(0, 100, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = window.innerWidth < 768 ? 50 : 100;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY; // Adjust for scroll
        });

        // Initialize particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight; // Full viewport height for hero
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
            this.connect(particle);
        });

        this.connectMouse();
    }

    connect(particle) {
        for (let a = 0; a < this.particles.length; a++) {
            let dx = particle.x - this.particles[a].x;
            let dy = particle.y - this.particles[a].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                let opacityValue = 1 - (distance / 100);
                let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                this.ctx.strokeStyle = isDark
                    ? `rgba(0, 255, 65, ${opacityValue * 0.2})`
                    : `rgba(0, 100, 0, ${opacityValue * 0.1})`; // Darker green for light mode
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.particles[a].x, this.particles[a].y);
                this.ctx.stroke();
            }
        }
    }

    connectMouse() {
        // Only connect if mouse is over hero section roughly
        if (window.scrollY > this.canvas.height) return;

        this.particles.forEach(particle => {
            let dx = particle.x - this.mouse.x;
            let dy = particle.y - this.mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                let opacityValue = 1 - (distance / 150);
                let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                this.ctx.strokeStyle = isDark
                    ? `rgba(0, 255, 65, ${opacityValue * 0.5})`
                    : `rgba(0, 150, 0, ${opacityValue * 0.3})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
    }
}

/* =========================================
   5. Interactive Features (Hacker Mode)
   ========================================= */
class HackerMode {
    constructor() {
        this.secret = 'hack';
        this.input = '';
        this.timer = null;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.input += e.key.toLowerCase();

            // Clear input if no key pressed for 1 second (resets detection)
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.input = '';
            }, 1000);

            // Check match
            if (this.input.includes(this.secret)) {
                this.activate();
                this.input = '';
            }
        });
    }

    activate() {
        const body = document.body;
        const overlay = document.getElementById('access-granted');

        // Toggle Mode
        if (body.classList.contains('hacker-mode')) {
            body.classList.remove('hacker-mode');
        } else {
            body.classList.add('hacker-mode');

            // Show Overlay
            if (overlay) {
                overlay.classList.add('show');
                setTimeout(() => {
                    overlay.classList.remove('show');
                }, 2000);
            }

            console.log("%c SYSTEM OVERRIDE INITIATED... WELCOME, ADMIN. ", "background: #000; color: #0f0; font-size: 20px; font-weight: bold;");
        }
    }
}

/* =========================================
   6. Mobile Image Interaction
   ========================================= */
function initMobileImageSwap() {
    const imageContainer = document.querySelector('.image-container');
    const primaryImage = document.querySelector('.profile-image.primary');
    const secondaryImage = document.querySelector('.profile-image.secondary');

    if (!imageContainer || !primaryImage || !secondaryImage) return;

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        let isSecondaryVisible = false;

        imageContainer.addEventListener('click', (e) => {
            e.preventDefault();

            if (!isSecondaryVisible) {
                // Show secondary image
                primaryImage.style.opacity = '0';
                secondaryImage.style.opacity = '1';
                isSecondaryVisible = true;

                // Auto-hide after 3 seconds
                setTimeout(() => {
                    primaryImage.style.opacity = '1';
                    secondaryImage.style.opacity = '0';
                    isSecondaryVisible = false;
                }, 3000);
            } else {
                // Return to primary image
                primaryImage.style.opacity = '1';
                secondaryImage.style.opacity = '0';
                isSecondaryVisible = false;
            }
        });
    }
}

/* =========================================
   7. Experience Accordion
   ========================================= */
function initExperienceAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        // Click handler
        header.addEventListener('click', () => toggleAccordion(header));

        // Keyboard accessibility (Enter/Space)
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(header);
            }
        });
    });

    function toggleAccordion(header) {
        const item = header.closest('.accordion-item');
        const isActive = item.classList.contains('active');

        // Toggle the clicked item
        item.classList.toggle('active');
        header.setAttribute('aria-expanded', !isActive);
    }
}

/* =========================================
   8. Main Initialization
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme
    const themeManager = new ThemeManager();

    // 2. Initialize Navigation
    const mobileNav = new MobileNav();

    // 3. Initialize Animations (Staggered)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.cert-card, .timeline-item, .skill-category, .stat');
    animateElements.forEach(el => observer.observe(el));

    // 4. Initialize TypeWriter
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const roles = [
        "Security Architect [Junior Lv.] @NAB VN",
        "Cloud Security Enthusiast",
        "Software Engineer",
        "Leadership & Mentoring"
    ];
    if (typingElement && cursor) {
        new TypeWriter(typingElement, cursor, roles);
    }

    // 5. Initialize Network Animation
    new NetworkAnimation();

    // 6. Initialize Hacker Mode
    new HackerMode();

    // 7. Mobile Image Interaction
    initMobileImageSwap();

    // 8. Experience Accordion
    initExperienceAccordion();

    // 8. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.id === 'centerDemoBtn' || this.hasAttribute('target')) return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 9. Scroll Spy & Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', () => {
        // Scroll Spy
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Back to Top Visibility
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // 10. Shortcut Keys
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            themeManager.toggleTheme();
        }
    });

    // Console Easter Egg
    console.log(`
██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝

🔐 Security Architect Portfolio
💻 Built with passion for cybersecurity
🎯 Keyboard shortcuts: Ctrl/Cmd + D (toggle theme)
🕹️ Try typing "hack" ...
`);
});