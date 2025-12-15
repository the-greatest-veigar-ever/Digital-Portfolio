
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
            if (window.innerWidth > 968 && this.isOpen) {
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

// Initialize mobile navigation
const mobileNav = new MobileNav();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip preventDefault for demo button or external links
        if (this.id === 'centerDemoBtn' || this.hasAttribute('target')) {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

// Back to Top Click Event
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add fade-in animation for elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.cert-card, .timeline-item, .skill-category, .stat');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Terminal typing effect for hero section
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        themeManager.toggleTheme();
    }
});

// Add Matrix rain effect (optional, can be enabled/disabled)
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.enabled = false;
    }

    init() {
        if (!this.enabled) return;

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.ctx || !this.enabled) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = '10px monospace';

        for (let i = 0; i < this.canvas.width / 10; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            const x = i * 10;
            const y = Math.random() * this.canvas.height;
            this.ctx.fillText(text, x, y);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Uncomment the next lines to enable Matrix rain effect
// const matrixRain = new MatrixRain();
// matrixRain.enabled = true;
// matrixRain.init();

// Enhanced Image Effects
class ImageEffects {
    constructor() {
        this.imageContainer = null;
        this.primaryImage = null;
        this.secondaryImage = null;
        this.particles = [];
        this.animationFrame = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEffects());
        } else {
            this.setupEffects();
        }
    }

    setupEffects() {
        this.imageContainer = document.querySelector('.image-container');
        this.primaryImage = document.querySelector('.profile-image.primary');
        this.secondaryImage = document.querySelector('.profile-image.secondary');

        if (!this.imageContainer) return;

        this.addHoverIndicator();
        this.addParticleCanvas();
        this.addFloatingElements();
        this.addAdvancedHoverEffects();
        this.addGlitchEffect();
        this.addPulseEffect();
        this.addMobileSupport();
    }

    addHoverIndicator() {
        // Create hover indicator
        const indicator = document.createElement('div');
        indicator.className = 'hover-indicator';
        indicator.innerHTML = `
            <div class="indicator-icon">👁️</div>
            <div class="indicator-text">Hover to reveal</div>
        `;

        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: 'JetBrains Mono', monospace;
            z-index: 8;
            opacity: 0.8;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(0, 255, 65, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
            animation: pulse-glow 2s ease-in-out infinite;
        `;

        this.imageContainer.appendChild(indicator);

        // Hide indicator on hover
        this.imageContainer.addEventListener('mouseenter', () => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(0.8)';
        });

        this.imageContainer.addEventListener('mouseleave', () => {
            setTimeout(() => {
                indicator.style.opacity = '0.8';
                indicator.style.transform = 'scale(1)';
            }, 500);
        });
    }

    addMobileSupport() {
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

        if (isMobile) {
            this.setupMobileEffects();
        }
    }

    setupMobileEffects() {
        // Change hover indicator for mobile
        const indicator = this.imageContainer.querySelector('.hover-indicator');
        if (indicator) {
            indicator.innerHTML = `
                <div class="indicator-icon">👆</div>
                <div class="indicator-text">Tap to reveal</div>
            `;
        }

        // Add tap functionality for mobile
        let isSecondaryVisible = false;

        this.imageContainer.addEventListener('click', (e) => {
            e.preventDefault();

            if (!isSecondaryVisible) {
                // Show secondary image
                this.primaryImage.style.opacity = '0';
                this.secondaryImage.style.opacity = '1';
                isSecondaryVisible = true;

                // Auto-hide after 3 seconds
                setTimeout(() => {
                    this.primaryImage.style.opacity = '1';
                    this.secondaryImage.style.opacity = '0';
                    isSecondaryVisible = false;
                }, 3000);
            } else {
                // Return to primary image
                this.primaryImage.style.opacity = '1';
                this.secondaryImage.style.opacity = '0';
                isSecondaryVisible = false;
            }
        });

        // Disable hover effects on mobile and replace with touch effects
        this.imageContainer.style.cursor = 'pointer';

        // Add touch feedback
        this.imageContainer.addEventListener('touchstart', () => {
            this.imageContainer.style.transform = 'scale(0.98)';
        });

        this.imageContainer.addEventListener('touchend', () => {
            this.imageContainer.style.transform = 'scale(1)';
        });
    }

    addParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 300;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '4';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.3s ease';

        this.imageContainer.appendChild(canvas);
        this.ctx = canvas.getContext('2d');

        // Create particles
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * 250,
                y: Math.random() * 300,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        this.imageContainer.addEventListener('mouseenter', () => {
            canvas.style.opacity = '1';
            this.startParticleAnimation();
        });

        this.imageContainer.addEventListener('mouseleave', () => {
            canvas.style.opacity = '0';
            this.stopParticleAnimation();
        });
    }

    startParticleAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, 250, 300);

            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x <= 0 || particle.x >= 250) particle.vx *= -1;
                if (particle.y <= 0 || particle.y >= 300) particle.vy *= -1;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
                this.ctx.fill();
            });

            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    stopParticleAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    addFloatingElements() {
        const elements = ['⚡', '💻', '🔐', '🎯', '⭐'];

        elements.forEach((element, index) => {
            const floatingEl = document.createElement('div');
            floatingEl.innerHTML = element;
            floatingEl.style.position = 'absolute';
            floatingEl.style.fontSize = '20px';
            floatingEl.style.opacity = '0';
            floatingEl.style.pointerEvents = 'none';
            floatingEl.style.zIndex = '5';
            floatingEl.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

            // Position around the image
            const angle = (index / elements.length) * Math.PI * 2;
            const radius = 140;
            const x = Math.cos(angle) * radius + 125;
            const y = Math.sin(angle) * radius + 150;

            floatingEl.style.left = x + 'px';
            floatingEl.style.top = y + 'px';
            floatingEl.style.transform = 'scale(0) rotate(0deg)';

            this.imageContainer.appendChild(floatingEl);

            // Show on hover with staggered animation
            this.imageContainer.addEventListener('mouseenter', () => {
                setTimeout(() => {
                    floatingEl.style.opacity = '0.8';
                    floatingEl.style.transform = 'scale(1) rotate(360deg)';
                }, index * 100);
            });

            this.imageContainer.addEventListener('mouseleave', () => {
                floatingEl.style.opacity = '0';
                floatingEl.style.transform = 'scale(0) rotate(0deg)';
            });
        });
    }

    addAdvancedHoverEffects() {
        let mouseX = 0;
        let mouseY = 0;

        this.imageContainer.addEventListener('mousemove', (e) => {
            const rect = this.imageContainer.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
            mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;

            // 3D tilt effect
            const tiltX = mouseY * 10;
            const tiltY = mouseX * -10;

            this.imageContainer.style.transform = `
                perspective(1000px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
                scale(1.02)
            `;
        });

        this.imageContainer.addEventListener('mouseleave', () => {
            this.imageContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    addGlitchEffect() {
        let glitchInterval;

        this.imageContainer.addEventListener('mouseenter', () => {
            // Random glitch effect
            glitchInterval = setInterval(() => {
                if (Math.random() > 0.9) { // 10% chance
                    this.triggerGlitch();
                }
            }, 1000);
        });

        this.imageContainer.addEventListener('mouseleave', () => {
            clearInterval(glitchInterval);
        });
    }

    triggerGlitch() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.position = 'absolute';
        glitchOverlay.style.top = '0';
        glitchOverlay.style.left = '0';
        glitchOverlay.style.width = '100%';
        glitchOverlay.style.height = '100%';
        glitchOverlay.style.background = `
            linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 0, 0, 0.1) 25%,
                rgba(0, 255, 0, 0.1) 50%,
                rgba(0, 0, 255, 0.1) 75%,
                transparent 100%
            )
        `;
        glitchOverlay.style.zIndex = '6';
        glitchOverlay.style.pointerEvents = 'none';
        glitchOverlay.style.animation = 'glitch 0.3s ease-in-out';

        this.imageContainer.appendChild(glitchOverlay);

        setTimeout(() => {
            glitchOverlay.remove();
        }, 300);
    }

    addPulseEffect() {
        // Add subtle pulse animation
        setInterval(() => {
            if (Math.random() > 0.8) { // 20% chance
                const pulse = document.createElement('div');
                pulse.style.position = 'absolute';
                pulse.style.top = '50%';
                pulse.style.left = '50%';
                pulse.style.width = '10px';
                pulse.style.height = '10px';
                pulse.style.background = 'rgba(0, 255, 65, 0.6)';
                pulse.style.borderRadius = '50%';
                pulse.style.transform = 'translate(-50%, -50%)';
                pulse.style.zIndex = '7';
                pulse.style.pointerEvents = 'none';
                pulse.style.animation = 'pulse-expand 2s ease-out forwards';

                this.imageContainer.appendChild(pulse);

                setTimeout(() => pulse.remove(), 2000);
            }
        }, 3000);
    }
}

// Add CSS animations for the effects
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translateX(0); opacity: 0; }
        25% { transform: translateX(-2px); opacity: 0.5; }
        50% { transform: translateX(2px); opacity: 1; }
        75% { transform: translateX(-1px); opacity: 0.5; }
    }

    @keyframes pulse-expand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }

    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
            border-color: rgba(0, 255, 65, 0.3);
        }
        50% {
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.6);
            border-color: rgba(0, 255, 65, 0.6);
        }
    }

    .image-container:hover {
        animation: subtle-shake 0.1s ease-in-out infinite alternate;
    }

    @keyframes subtle-shake {
        0% { transform: scale(1.02) translateX(0); }
        100% { transform: scale(1.02) translateX(0.5px); }
    }

    /* Mobile-specific styles */
    @media (max-width: 768px) {
        .hover-indicator {
            font-size: 10px !important;
            padding: 6px 8px !important;
        }

        .image-container {
            width: 200px !important;
            height: 240px !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize the image effects
const imageEffects = new ImageEffects();

// Circular Carousel Management
class CircularCarousel {
    constructor() {
        this.currentProject = 0;

        this.wheel = document.getElementById('carouselWheel');
        this.centerContent = document.getElementById('centerContent');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.bubbles = document.querySelectorAll('.project-bubble');

        this.totalProjects = this.bubbles.length; // Total number of projects

        this.init();
    }

    init() {
        this.updateDisplay();
        this.rotateWheel(); // Apply initial rotation and counter-rotation
        this.bindEvents();
        this.startAutoRotate();
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevProject());
        this.nextBtn?.addEventListener('click', () => this.nextProject());

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToProject(index));
        });

        // Bubble clicks
        this.bubbles.forEach((bubble, index) => {
            bubble.addEventListener('click', () => this.goToProject(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport()) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevProject();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextProject();
                }
            }
        });

        // Pause auto-rotate on hover
        const container = document.querySelector('.circular-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoRotate());
            container.addEventListener('mouseleave', () => this.startAutoRotate());
        }
    }

    nextProject() {
        this.stopAutoRotate();
        this.currentProject = (this.currentProject + 1) % this.totalProjects;
        this.updateDisplay();
        this.rotateWheel();
        this.startAutoRotate();
    }

    prevProject() {
        this.stopAutoRotate();
        this.currentProject = (this.currentProject - 1 + this.totalProjects) % this.totalProjects;
        this.updateDisplay();
        this.rotateWheel();
        this.startAutoRotate();
    }

    goToProject(index) {
        if (index !== this.currentProject) {
            this.stopAutoRotate();
            this.currentProject = index;
            this.updateDisplay();
            this.rotateWheel();
            this.startAutoRotate();
        }
    }

    updateDisplay() {
        // Get the current project bubble
        const currentBubble = this.bubbles[this.currentProject];

        if (currentBubble && this.centerContent) {
            // Read data from the current project bubble
            const icon = currentBubble.getAttribute('data-icon') || 'fas fa-circle';
            const title = currentBubble.getAttribute('data-title') || 'Select a Project';
            const description = currentBubble.getAttribute('data-description') || 'Click on any project bubble to view details';
            const demoUrl = currentBubble.getAttribute('data-demo') || '#';

            // Update center content elements
            const iconEl = this.centerContent.querySelector('#centerIcon');
            const titleEl = this.centerContent.querySelector('#centerTitle');
            const descriptionEl = this.centerContent.querySelector('#centerDescription');
            const demoBtn = this.centerContent.querySelector('#centerDemoBtn');

            if (iconEl) iconEl.className = icon;
            if (titleEl) titleEl.textContent = title;
            if (descriptionEl) descriptionEl.textContent = description;

            if (demoBtn) {
                demoBtn.href = demoUrl;
                // Show demo button if valid URL, hide if default
                demoBtn.style.display = (demoUrl && demoUrl !== '#') ? 'inline-flex' : 'none';
            }
        }

        // Update active states
        this.bubbles.forEach((bubble, index) => {
            bubble.classList.toggle('active', index === this.currentProject);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentProject);
        });

        // Update arrow button states
        this.updateArrowStates();

        // Add pulse animation to center
        this.animateCenter();
    }

    updateArrowStates() {
        // Disable prev button if at first project
        if (this.prevBtn) {
            this.prevBtn.disabled = (this.currentProject === 0);
        }

        // Disable next button if at last project
        if (this.nextBtn) {
            this.nextBtn.disabled = (this.currentProject === this.bubbles.length - 1);
        }
    }

    rotateWheel() {
        const anglePerProject = 360 / this.totalProjects;
        const angle = -(this.currentProject * anglePerProject);
        if (this.wheel) {
            this.wheel.style.transform = `rotate(${angle}deg)`;

            // Counter-rotate all bubbles to keep content straight
            this.bubbles.forEach((bubble) => {
                bubble.style.transform = `rotate(${-angle}deg)`;
            });
        }
    }

    animateCenter() {
        if (this.centerContent) {
            this.centerContent.style.transform = 'scale(0.95)';
            this.centerContent.style.opacity = '0.8';

            setTimeout(() => {
                this.centerContent.style.transform = 'scale(1)';
                this.centerContent.style.opacity = '1';
            }, 200);
        }
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            this.nextProject();
        }, 4000); // Change every 4 seconds
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    isInViewport() {
        const section = document.querySelector('.projects');
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize circular carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const circularCarousel = new CircularCarousel();
});

// Console easter egg
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
✨ Enhanced with dynamic image effects
`);