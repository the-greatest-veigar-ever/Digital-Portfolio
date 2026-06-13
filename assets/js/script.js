
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
        this.theme = localStorage.getItem('theme') || 'dark';
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
        this.baseVx = (Math.random() - 0.5) * 1.5;
        this.baseVy = (Math.random() - 0.5) * 1.5;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.size = Math.random() * 2.5 + 0.5;
        this.parallaxFactor = this.size * 0.3;
    }

    update(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;

        // Friction to return to base velocity
        this.vx += (this.baseVx - this.vx) * 0.04;
        this.vy += (this.baseVy - this.vy) * 0.04;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) {
            this.baseVx *= -1;
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.baseVy *= -1;
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        }

        // Gentle gravitational pull toward cursor
        if (mouseX !== null && mouseY !== null) {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200 && dist > 1) {
                let force = (200 - dist) / 200;
                this.vx += (dx / dist) * force * 0.15;
                this.vy += (dy / dist) * force * 0.15;
            }
        }
    }

    draw(ctx, mouseX, mouseY) {
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        let drawX = this.x;
        let drawY = this.y;

        // Parallax Offset
        if (mouseX !== null && mouseY !== null) {
            let pOffsetX = (mouseX - window.innerWidth / 2) * 0.05 * this.parallaxFactor;
            let pOffsetY = (mouseY - window.innerHeight / 2) * 0.05 * this.parallaxFactor;
            drawX -= pOffsetX;
            drawY -= pOffsetY;
        }

        ctx.fillStyle = isDark ? `rgba(0, 255, 65, ${0.4 + this.size*0.1})` : `rgba(0, 150, 0, ${0.4 + this.size*0.1})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();

        return {x: drawX, y: drawY};
    }
}

class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = window.innerWidth < 768 ? 100 : 200;
        this.time = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.mouse.x = (e.clientX - rect.left) * scaleX;
            this.mouse.y = (e.clientY - rect.top) * scaleY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Click Shockwave
        document.addEventListener('click', (e) => {
            if (window.scrollY > this.canvas.height) return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.triggerShockwave(
                (e.clientX - rect.left) * scaleX,
                (e.clientY - rect.top) * scaleY
            );
        });

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }

        gsap.ticker.add(() => this.animate());
    }

    triggerShockwave(x, y) {
        this.particles.forEach(p => {
            let dx = p.x - x;
            let dy = p.y - y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) {
                let force = (300 - distance) / 300;
                gsap.to(p, {
                    vx: p.baseVx + (dx / distance) * force * 20,
                    vy: p.baseVy + (dy / distance) * force * 20,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        });
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.015;

        let drawnPositions = [];

        this.particles.forEach(particle => {
            particle.update(this.mouse.x, this.mouse.y);
            let pos = particle.draw(this.ctx, this.mouse.x, this.mouse.y);
            drawnPositions.push(pos);
        });

        this.connect(drawnPositions);
    }

    /* ---- Minimal Black Hole Renderer ---- */
    drawBlackhole(cx, cy, isDark) {
        const ctx = this.ctx;
        const R = 6;
        const pulse = Math.sin(this.time * 1.5) * 0.15 + 0.85; // subtle breathing

        ctx.save();

        // 1. Gravitational darkening -- radial void that eats light around it
        let voidGrad = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 3.5);
        voidGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        voidGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.1)');
        voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = voidGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Event horizon -- pure black circle
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        // 3. Photon ring -- single crisp ring with glow
        let glowColor = isDark ? `rgba(0, 255, 65, ${0.9 * pulse})` : `rgba(0, 200, 50, ${0.8 * pulse})`;
        let glowColorShadow = isDark ? 'rgba(0, 255, 65, 1)' : 'rgba(0, 200, 50, 1)';

        ctx.shadowColor = glowColorShadow;
        ctx.shadowBlur = 15 * pulse;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Second pass for sharper glow bloom
        ctx.shadowBlur = 8;
        ctx.strokeStyle = isDark ? `rgba(120, 255, 160, ${0.5 * pulse})` : `rgba(80, 220, 100, ${0.4 * pulse})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    connect(positions) {
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        for (let a = 0; a < positions.length; a++) {
            for (let b = a + 1; b < positions.length; b++) {
                let dx = positions[a].x - positions[b].x;
                let dy = positions[a].y - positions[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    let opacityValue = 1 - (distance / 120);
                    this.ctx.strokeStyle = isDark
                        ? `rgba(0, 255, 65, ${opacityValue * 0.25})`
                        : `rgba(0, 150, 0, ${opacityValue * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(positions[a].x, positions[a].y);
                    this.ctx.lineTo(positions[b].x, positions[b].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw cursor black hole (no lines, just the void)
        if (this.mouse.x !== null && this.mouse.y !== null && window.scrollY <= this.canvas.height) {
            this.drawBlackhole(this.mouse.x, this.mouse.y, isDark);
        }
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
   6. Experience Accordion
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
                    gsap.to(otherItem.querySelector('.accordion-content'), {height: 0, opacity: 0, duration: 0.3, ease: "power2.out"});
                }
            }
        });

        if (isActive) {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', false);
            if (typeof gsap !== 'undefined') {
                gsap.to(content, {height: 0, opacity: 0, duration: 0.3, ease: "power2.out"});
            }
        } else {
            item.classList.add('active');
            header.setAttribute('aria-expanded', true);
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(content, {height: 0, opacity: 0}, {height: "auto", opacity: 1, duration: 0.4, ease: "power2.out"});
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
        heroTl.fromTo('.navbar', { x: -250, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" })
              .fromTo('.nav-link', { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.4")
              .fromTo('.hero-content h1', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.4")
              .fromTo('.hero-content .nickname', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "-=0.6")
              .fromTo('.hero-content h2:not(.nickname)', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: "power3.out" }, "-=0.2")
              .fromTo('.hero-content p', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "-=0.2")
              .fromTo('.hero-buttons .btn', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)" }, "-=0.4");
              
        // Hero Parallax Scrub
        gsap.to('.hero-content', {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
        
        gsap.to('#network-canvas', {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
              
        // Magnetic Buttons
        const magneticElements = document.querySelectorAll('.social-link');
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
        const animateElements = gsap.utils.toArray('.timeline-item, .pok-card');
        animateElements.forEach((el) => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
                    y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)"
                }
            );
        });

        // Advanced Image Reveal (About Section)
        const aboutImages = document.querySelectorAll('.profile-image');
        if (aboutImages.length > 0) {
            gsap.fromTo(aboutImages, 
                { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", scale: 1.1 },
                { 
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
                    scale: 1,
                    duration: 1.2, 
                    ease: "power3.inOut",
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: ".about-images",
                        start: "top 80%"
                    }
                }
            );
        }

        // B. 3D Tilt Hover Effect for Premium Cards
        const tiltElements = document.querySelectorAll('.stat, .pok-card');
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

        // E. Skills Micro-Staggering
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            const items = category.querySelectorAll('li');
            gsap.fromTo(category,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
                    scrollTrigger: { trigger: category, start: "top 85%" }
                }
            );
            if(items.length > 0) {
                gsap.fromTo(items,
                    { x: -10, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out",
                        scrollTrigger: { trigger: category, start: "top 85%" }
                    }
                );
            }
        });

        // F. Projects Slideshow
        const slideshowTrack = document.getElementById('slideshow-track');
        const slides = document.querySelectorAll('.project-slide');
        const prevBtn = document.getElementById('slide-prev');
        const nextBtn = document.getElementById('slide-next');
        const dotsContainer = document.getElementById('slideshow-dots');
        const counterEl = document.getElementById('slideshow-counter');

        if (slideshowTrack && slides.length > 0) {
            let currentSlide = 0;
            const totalSlides = slides.length;

            // Generate dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('slideshow-dot');
                dot.setAttribute('aria-label', `Go to project ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }

            function updateCounter() {
                if (counterEl) counterEl.textContent = `${currentSlide + 1} / ${totalSlides}`;
            }

            function updateDots() {
                const dots = dotsContainer.querySelectorAll('.slideshow-dot');
                dots.forEach((dot, i) => {
                    if (i === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function goToSlide(index) {
                if (index === currentSlide) return;
                const direction = index > currentSlide ? 1 : -1;
                const oldSlide = slides[currentSlide];
                currentSlide = index;
                const newSlide = slides[currentSlide];

                // Animate track position
                gsap.to(slideshowTrack, {
                    x: `-${currentSlide * 100}%`,
                    duration: 0.5,
                    ease: "power2.inOut"
                });

                // Fade content of new slide
                gsap.fromTo(newSlide.querySelector('.project-card'), 
                    { opacity: 0.4, y: direction * 15 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 }
                );

                updateDots();
                updateCounter();
            }

            function nextSlide() {
                goToSlide((currentSlide + 1) % totalSlides);
            }

            function prevSlide() {
                goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
            }

            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                const projectsSection = document.getElementById('projects');
                if (!projectsSection) return;
                const rect = projectsSection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (!inView) return;

                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            });

            // Touch swipe support
            let touchStartX = 0;
            const slideshowEl = document.getElementById('projects-slideshow');
            if (slideshowEl) {
                slideshowEl.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                slideshowEl.addEventListener('touchend', (e) => {
                    const diff = touchStartX - e.changedTouches[0].screenX;
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) nextSlide();
                        else prevSlide();
                    }
                }, { passive: true });
            }

            // Entrance animation
            gsap.fromTo('.projects-slideshow',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: '.projects-slideshow', start: "top 85%" }
                }
            );

            updateCounter();
        }

        // G. Contact Section Stagger
        const contactItems = document.querySelectorAll('.contact-item');
        if (contactItems.length > 0) {
            gsap.fromTo(contactItems,
                { x: -30, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "elastic.out(1, 0.7)",
                    scrollTrigger: { trigger: ".contact-info", start: "top 85%" }
                }
            );
        }
        
        const socialLinks = document.querySelectorAll('.social-links .social-link');
        if (socialLinks.length > 0) {
            gsap.fromTo(socialLinks,
                { y: 30, opacity: 0, scale: 0.5 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)",
                    scrollTrigger: { trigger: ".social-links", start: "top 90%" }
                }
            );
        }

        // H. Experience Timeline Progress
        const experienceSection = document.querySelector('.experience-accordion');
        const progressBar = document.querySelector('.timeline-progress-bar');
        if (experienceSection && progressBar) {
            gsap.to(progressBar, {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: experienceSection,
                    start: "top center",
                    end: "bottom center",
                    scrub: true
                }
            });
        }
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
            let duration = Math.max(cert.length * 0.05, 1);
            masterTl.to(typingElement, { duration: duration, text: cert, ease: "none" })
                    .to(typingElement, { duration: duration, text: "", ease: "none", delay: 2 });
        });
    }

    // 5. Initialize Network Animation
    new NetworkAnimation();

    // 6. Initialize Hacker Mode
    new HackerMode();

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

🔐 Security Associate Portfolio
💻 Built with passion for cybersecurity
🎯 Keyboard shortcuts: Ctrl/Cmd + D (toggle theme)
🕹️ Try typing "hack" ...
`);
});