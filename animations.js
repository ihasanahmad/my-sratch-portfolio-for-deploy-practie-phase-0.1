// animations.js - cleaned and guarded version
// Requires Lenis and GSAP (+ ScrollTrigger) loaded before this script

// Initialize Lenis for smooth scrolling (guard if Lenis exists)
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// Register ScrollTrigger if gsap is available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Query commonly used elements (may be null)
const animatedBg = document.querySelector('.animated-bg');
const animatedGradient = document.querySelector('.animated-gradient');
const heroTitle = document.getElementById('myheading');
const heroSubtitle = document.querySelector('.hero-subtitle');
const developerTitle = document.querySelector('.developer-title');
const primaryButton = document.querySelector('.glass-btn');
const profileImg = document.querySelector('.profile-img');
const profileGlow = document.querySelector('.profile-glow');

// Animate background colors with GSAP - Enhanced for better visibility
if (animatedBg && typeof gsap !== 'undefined') {
    // Ensure background is visible
    animatedBg.style.opacity = '1';
    animatedBg.style.visibility = 'visible';
    
    gsap.to(animatedBg, {
        backgroundPosition: '400% 400%',
        duration: 25,
        repeat: -1,
        ease: 'sine.inOut',
        force3D: true
    });
    
    // Add additional animation for depth
    gsap.to(animatedBg, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    });
}

// Enhanced gradient animation
if (animatedGradient && typeof gsap !== 'undefined') {
    animatedGradient.style.opacity = '1';
    animatedGradient.style.visibility = 'visible';
    
    // Create floating effect
    gsap.to(animatedGradient, {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        duration: 'random(10, 20)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true
    });
    
    // Opacity pulse
    gsap.to(animatedGradient, {
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Hero, subtitle, developer title, and button
if (heroTitle && typeof gsap !== 'undefined') {
    gsap.from(heroTitle, { duration: 1, opacity: 0, y: 50, ease: 'power4.out' });
}
if (heroSubtitle && typeof gsap !== 'undefined') {
    gsap.from(heroSubtitle, { duration: 1.2, opacity: 0, y: 50, ease: 'power4.out', delay: 0.2 });
}
if (developerTitle && typeof gsap !== 'undefined') {
    gsap.from(developerTitle, { duration: 1.4, opacity: 0, y: 50, ease: 'power4.out', delay: 0.4 });
}
if (primaryButton && typeof gsap !== 'undefined') {
    gsap.from(primaryButton, { duration: 1.6, opacity: 0, y: 50, ease: 'power4.out', delay: 0.6 });
}

// Profile image and glow
if (profileImg && typeof gsap !== 'undefined') {
    gsap.from(profileImg, { duration: 1.5, opacity: 0, x: -100, rotateY: 45, ease: 'power4.out', perspective: 1200 });
}
if (profileGlow && typeof gsap !== 'undefined') {
    gsap.to(profileGlow, { duration: 4, opacity: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

// Parallax effect helper (register custom effect only if gsap exists)
if (typeof gsap !== 'undefined') {
    try {
        gsap.registerEffect({
            name: 'parallax',
            effect: (targets, config) => gsap.to(targets, { y: `+=${(config && config.amount) || 200}`, duration: (config && config.duration) || 1 }),
            defaults: { amount: 200, duration: 1 }
        });
    } catch (e) {
        // ignore if already registered or if registration fails
    }
}

// Skill cards entrance animation and hover
const skillCards = document.querySelectorAll('.skill-card');
if (skillCards && skillCards.length > 0 && typeof gsap !== 'undefined') {
    gsap.from(skillCards, {
        scrollTrigger: {
            trigger: '.skills-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.5,
        },
        duration: 0.8,
        opacity: 0,
        y: 100,
        stagger: 0.1,
        ease: 'power3.out'
    });

    skillCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { duration: 0.3, scale: 1.05, y: -10, boxShadow: '0 20px 50px rgba(100, 200, 255, 0.4)', ease: 'power3.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { duration: 0.3, scale: 1, y: 0, ease: 'power3.out' });
        });
    });
}

// About section text animation
if (typeof gsap !== 'undefined') {
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-section', start: 'top 75%', toggleActions: 'play none none reverse' },
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    });
}

// Statistics cards animation and counters
const statCards = document.querySelectorAll('.stat-card');
if (statCards && statCards.length > 0 && typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    gsap.from(statCards, {
        scrollTrigger: { trigger: '.about-section', start: 'top 70%', toggleActions: 'play none none reverse' },
        duration: 0.8,
        opacity: 0,
        ease: 'power2.out'
    });

    statCards.forEach((card) => {
        const statNumber = card.querySelector('.stat-number');
        if (!statNumber) return;

        const originalText = statNumber.textContent || '';
        // Extract numeric portion (may contain suffix like +)
        const numericMatch = originalText.match(/\d+/);
        const endValue = numericMatch ? parseInt(numericMatch[0], 10) : NaN;

        if (!isNaN(endValue)) {
            ScrollTrigger.create({
                trigger: card,
                onEnter: () => {
                    gsap.to({ value: 0 }, {
                        value: endValue,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () {
                            const val = Math.ceil(this.targets()[0].value);
                            // Preserve any non-numeric characters that followed the number
                            const suffix = originalText.replace(/\d+/g, '') || '';
                            statNumber.textContent = `${val}${suffix}`;
                        }
                    });
                }
            });
        }
    });
}

// Form groups animation
const formGroups = document.querySelectorAll('.form-group');
if (formGroups && formGroups.length > 0 && typeof gsap !== 'undefined') {
    gsap.from(formGroups, {
        scrollTrigger: { trigger: '.contact-section', start: 'top 75%', toggleActions: 'play none none reverse' },
        duration: 0.6,
        opacity: 0,
        x: -30,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

// Form inputs focus animation
const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"]');
if (formInputs && formInputs.length > 0 && typeof gsap !== 'undefined') {
    formInputs.forEach((input) => {
        input.addEventListener('focus', () => {
            gsap.to(input, { duration: 0.3, scale: 1.02, boxShadow: '0 0 30px rgba(100, 200, 255, 0.4)', ease: 'power2.out' });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, { duration: 0.3, scale: 1, boxShadow: 'none', ease: 'power2.out' });
        });
    });
}

// Footer links hover
const footerLinks = document.querySelectorAll('.footer-link');
if (footerLinks && footerLinks.length > 0 && typeof gsap !== 'undefined') {
    footerLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => gsap.to(link, { duration: 0.3, color: '#64c8ff', ease: 'power2.out' }));
        link.addEventListener('mouseleave', () => gsap.to(link, { duration: 0.3, color: 'rgba(255, 255, 255, 0.7)', ease: 'power2.out' }));
    });
}

// Scroll listener for gradient opacity
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;

    if (animatedGradient && typeof gsap !== 'undefined') {
        gsap.to(animatedGradient, { opacity: 0.5 + (scrollProgress / 200), duration: 0.5, overwrite: 'auto' });
    }
});

// Button interactions (scale, shadows)
const buttons = document.querySelectorAll('.glass-btn, .btn-primary, .btn-secondary');
if (buttons && buttons.length > 0 && typeof gsap !== 'undefined') {
    buttons.forEach((btn) => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { duration: 0.3, scale: 1.05, boxShadow: '0 15px 50px rgba(100, 200, 255, 0.5)', ease: 'power3.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { duration: 0.3, scale: 1, ease: 'power3.out' }));
        btn.addEventListener('mousedown', () => gsap.to(btn, { duration: 0.1, scale: 0.95, ease: 'power2.out' }));
        btn.addEventListener('mouseup', () => gsap.to(btn, { duration: 0.1, scale: 1.05, ease: 'power2.out' }));
    });
}

// Page load header animation and section scroll animations
window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
        gsap.from('.header-container', { duration: 0.8, opacity: 0, scale: 0.95, ease: 'back.out' });

        const sections = document.querySelectorAll('.skills-section, .about-section, .contact-section');
        if (sections && sections.length > 0) {
            sections.forEach((section) => {
                gsap.from(section, {
                    scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 45%', toggleActions: 'play none none reverse', markers: false },
                    duration: 0.8,
                    opacity: 0,
                    y: 50,
                    ease: 'power3.out'
                });
            });
        }
    }
});

// Create enhanced floating particles effect for better background visibility
function createParticles() {
    try {
        // Remove existing particles if any
        const existingParticles = document.querySelector('.particles');
        if (existingParticles) {
            existingParticles.remove();
        }
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; min-height: 100vh; pointer-events: none; z-index: -1; overflow: hidden;`;
        document.body.appendChild(particlesContainer);

        // Create more particles for better visibility
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = 150 + Math.random() * 200;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = 0.1 + Math.random() * 0.15;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(100, 200, 255, ${opacity}), rgba(255, 100, 200, ${opacity * 0.5}), transparent);
                border-radius: 50%;
                filter: blur(60px);
                left: ${x}%;
                top: ${y}%;
                will-change: transform;
            `;
            particlesContainer.appendChild(particle);

            if (typeof gsap !== 'undefined') {
                const duration = 15 + Math.random() * 20;
                const xMovement = (Math.random() - 0.5) * 300;
                const yMovement = (Math.random() - 0.5) * 300;
                
                gsap.to(particle, {
                    x: xMovement,
                    y: yMovement,
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    force3D: true
                });
                
                // Add opacity animation
                gsap.to(particle, {
                    opacity: opacity * 1.5,
                    duration: duration * 0.7,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        }
        
        console.log('✨ Enhanced particles created');
    } catch (e) {
        console.warn('Particles init failed', e);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);

// Mouse follow effect (subtle) - only animate if animatedGradient exists
document.addEventListener('mousemove', (e) => {
    if (!animatedGradient || typeof gsap === 'undefined') return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    gsap.to(animatedGradient, { duration: 1, x: (mouseX - window.innerWidth / 2) * 0.05, y: (mouseY - window.innerHeight / 2) * 0.05, overwrite: 'auto' });
});

// Intersection Observer for lazy reveal of .glass-card
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

const glassCards = document.querySelectorAll('.glass-card');
if (glassCards && glassCards.length > 0) {
    glassCards.forEach((card) => observer.observe(card));
}

console.log('✨ Portfolio animations loaded successfully!');
console.log(lenis ? '📱 Lenis smooth scrolling enabled' : '📱 Lenis not available');
console.log(typeof gsap !== 'undefined' ? '⚡ GSAP animations active' : '⚡ GSAP not available');
