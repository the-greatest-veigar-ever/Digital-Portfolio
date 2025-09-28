// Theme Management
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

// Initialize theme manager
const themeManager = new ThemeManager();

// Mobile Navigation Management
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
});

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