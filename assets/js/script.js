
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
        this.navMenu = document.querySelector('.navbar');
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
// TypeWriter class removed - now using GSAP TextPlugin

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
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all other accordions smoothly
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', false);
                if (typeof gsap !== 'undefined') {
                    gsap.to(otherItem.querySelector('.accordion-content'), {height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut"});
                }
            }
        });

        if (isActive) {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', false);
            if (typeof gsap !== 'undefined') {
                gsap.to(content, {height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut"});
            }
        } else {
            item.classList.add('active');
            header.setAttribute('aria-expanded', true);
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(content, {height: 0, opacity: 0}, {height: "auto", opacity: 1, duration: 0.4, ease: "power2.inOut"});
            }
        }
    }
}

/* =========================================
   8. Main Initialization
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins & Hero Entrance
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
        
        // Hero Entrance Timeline
        const heroTl = gsap.timeline();
        heroTl.fromTo('.navbar', { x: -250, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
              .fromTo('.nav-link', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.4")
              .fromTo('.hero-content h1', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.4")
              .fromTo('.hero-content .nickname', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.6")
              .fromTo('.hero-content h2', { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
              .fromTo('.hero-content p', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.2")
              .fromTo('.hero-buttons .btn', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)" }, "-=0.4");
              
        // Magnetic Buttons
        const magneticElements = document.querySelectorAll('.btn, .social-link');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // 1. Initialize Theme
    const themeManager = new ThemeManager();

    // 2. Initialize Navigation
    const mobileNav = new MobileNav();

    // 3. Advanced GSAP Animations (Premium Effects)
    if (typeof gsap !== 'undefined') {
        // A. General fade-in for standard elements
        const animateElements = gsap.utils.toArray('.timeline-item, .skill-category, .pok-card');
        animateElements.forEach((el) => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
                    y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)"
                }
            );
        });

        // B. 3D Tilt Hover Effect for Premium Cards
        const tiltElements = document.querySelectorAll('.stat, .cert-card, .pok-card');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
                const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
                gsap.to(el, { rotateX: rotateX, rotateY: rotateY, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });

        // C. Staggered 3D Flip Entrance for Certificates
        gsap.fromTo('.cert-card', 
            { y: 80, opacity: 0, rotationX: -20 },
            { 
                scrollTrigger: { trigger: '.cert-grid', start: "top 85%" }, 
                y: 0, opacity: 1, rotationX: 0, stagger: 0.15, duration: 1, ease: "power3.out", transformPerspective: 1000 
            }
        );

        // D. Number Counter & Dynamic Entrance for About Stats
        const statsContainers = document.querySelectorAll('.stat');
        gsap.fromTo(statsContainers, 
            { y: 40, opacity: 0, scale: 0.9 },
            { scrollTrigger: { trigger: '.about-stats', start: "top 90%" }, y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)" }
        );

        const numbers = document.querySelectorAll('.stat h3');
        numbers.forEach(num => {
            const text = num.innerText;
            if (text.includes('+')) {
                const target = parseInt(text);
                // Reset text to 0 initially
                num.innerText = '0+';
                gsap.to(num, {
                    scrollTrigger: { trigger: num, start: "top 90%" },
                    innerText: target,
                    duration: 2.5,
                    ease: "power3.out",
                    snap: { innerText: 1 },
                    onUpdate: function() { num.innerText = this.targets()[0].innerText + '+'; }
                });
            } else {
                gsap.fromTo(num, { opacity: 0, filter: "blur(5px)" }, {
                    scrollTrigger: { trigger: num, start: "top 90%" },
                    opacity: 1, filter: "blur(0px)", duration: 1.5, delay: 0.3, ease: "power2.out"
                });
            }
        });
    }

    // 4. Initialize TypeWriter (GSAP TextPlugin) - Cycles through certificates
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const certs = [
        "ISC2 SSCP",
        "ISC2 CC",
        "CompTIA Security+ (SY-701)"
    ];
    if (typingElement && cursor && typeof gsap !== 'undefined') {
        gsap.to(cursor, { opacity: 0, ease: "power2.inOut", repeat: -1, yoyo: true, duration: 0.5 });
        let masterTl = gsap.timeline({ repeat: -1 });
        certs.forEach(cert => {
            let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
            tl.to(typingElement, { duration: Math.max(cert.length * 0.05, 1), text: cert, ease: "none" });
            masterTl.add(tl);
        });
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

    // GSAP-powered dynamic scroll spy for sidebar
    if (typeof gsap !== 'undefined') {
        const allNavLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: () => activateLink(correspondingLink),
                    onEnterBack: () => activateLink(correspondingLink),
                });
            }
        });

        function activateLink(activeLink) {
            // Remove active from all links
            allNavLinks.forEach(link => {
                if (link !== activeLink && link.classList.contains('active')) {
                    link.classList.remove('active');
                    gsap.to(link, { paddingLeft: 0, color: 'var(--nav-text)', duration: 0.3, ease: 'power2.out' });
                }
            });
            // Add active to the current link
            if (!activeLink.classList.contains('active')) {
                activeLink.classList.add('active');
                gsap.to(activeLink, { paddingLeft: 10, color: 'var(--accent-color)', duration: 0.3, ease: 'power2.out' });
            }
        }
    }

    // Back to Top Visibility
    window.addEventListener('scroll', () => {
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