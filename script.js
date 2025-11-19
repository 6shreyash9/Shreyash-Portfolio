// ============================================
// GSAP & Three.js Setup
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// EmailJS Configuration
// ============================================
(function() {
    emailjs.init({
        publicKey: "mhOQxRBKLFPP1uBAC" // Replace with your EmailJS Public Key
    });
})();

// ============================================
// Custom Cursor - Optimized Single Loop
// ============================================
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ============================================
// Three.js 3D Particle Background
// ============================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const isMobile = window.innerWidth < 768;
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: !isMobile 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

const particlesCount = isMobile ? 500 : 2000;
const particlesGeometry = new THREE.BufferGeometry();
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xFF8000,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

let mouseXParallax = 0;
let mouseYParallax = 0;

document.addEventListener('mousemove', (e) => {
    mouseXParallax = (e.clientX / window.innerWidth) * 2 - 1;
    mouseYParallax = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ============================================
// MASTER ANIMATION LOOP
// ============================================
function masterLoop() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }
    
    if (particlesMesh) {
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.position.x += (mouseXParallax * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (mouseYParallax * 0.5 - particlesMesh.position.y) * 0.05;
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(masterLoop);
}

masterLoop();

document.querySelectorAll('a, button, .project-card, input, textarea').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
    });
    elem.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// VIDEO AUTOPLAY - MOBILE COMPATIBLE
// ============================================
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        
        if (entry.isIntersecting) {
            video.play().catch(error => {
                console.log('Autoplay prevented, retrying muted:', error);
                video.muted = true;
                video.play();
            });
        } else {
            video.pause();
        }
    });
}, { 
    threshold: 0.25,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.project-video').forEach(video => {
    video.muted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    videoObserver.observe(video);
});

window.addEventListener('load', () => {
    document.querySelectorAll('.project-video').forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            video.play().catch(() => {
                video.muted = true;
                video.play();
            });
        }
    });
});

document.addEventListener('visibilitychange', () => {
    const videos = document.querySelectorAll('.project-video');
    
    if (document.hidden) {
        videos.forEach(v => v.pause());
    } else {
        videos.forEach(v => {
            const rect = v.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                v.play();
            }
        });
    }
});

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        gsap.to(navbar, { y: -100, duration: 0.3, ease: 'power2.out' });
    } else {
        gsap.to(navbar, { y: 0, duration: 0.3, ease: 'power2.out' });
    }
    lastScroll = currentScroll;
});

// ============================================
// Smooth Scroll for Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});

// ============================================
// Hero CTA Buttons - VIEW WORK & GET IN TOUCH
// ============================================
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', function(e) {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: '#work', offsetY: 80 },
            ease: 'power3.inOut'
        });
    });
}

const getInTouchBtn = document.getElementById('get-in-touch-btn');
if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: '#contact', offsetY: 80 },
            ease: 'power3.inOut'
        });
    });
}

// ============================================
// Hero Section Parallax - Optimized Timeline
// ============================================
const heroTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

heroTimeline
    .to('.hero-title', { y: 300, opacity: 0 }, 0)
    .to('.hero-subtitle', { y: 200, opacity: 0 }, 0)
    .to('.hero-cta', { y: 150, opacity: 0 }, 0);

// ============================================
// Project Cards Scroll Animation
// ============================================
gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'top center',
            scrub: 1
        },
        y: 100,
        opacity: 0,
        rotation: 5,
        ease: 'power2.out'
    });
});

// 3D Tilt Effect on Project Cards (Desktop Only)
if (!isMobile) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// MOBILE TOUCH INTERACTIONS
// ============================================
if ('ontouchstart' in window) {
    document.querySelectorAll('.project-card').forEach(card => {
        let tapped = false;
        
        card.addEventListener('touchstart', (e) => {
            if (!tapped) {
                card.classList.add('tapped');
                tapped = true;
                
                setTimeout(() => {
                    card.classList.remove('tapped');
                    tapped = false;
                }, 3000);
            }
        });
    });
}

// ============================================
// VIEW PROJECT BUTTON - MAKE CLICKABLE
// ============================================
document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.href && btn.href !== window.location.href && btn.href !== '#') {
            return true;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-overlay h3').textContent;
        
        alert(`Project: ${projectTitle}\n\nUpdate the data-project-url attribute in HTML with your project link!`);
    });
});

// ============================================
// About Section Animations
// ============================================
gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top center+=100'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.tech-stack', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top center+=100'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.utils.toArray('.stat-card').forEach((stat, index) => {
    gsap.from(stat, {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top center'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out'
    });
});

// Animate stat numbers
function animateNumber(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

ScrollTrigger.create({
    trigger: '.stats-grid',
    start: 'top center',
    onEnter: () => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target, 2000);
        });
    },
    once: true
});

// ============================================
// TESTIMONIALS SLIDER
// ============================================
const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "CEO, TechStart India",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "Outstanding work! The website exceeded all expectations. Professional, responsive, and delivered on time. The speed and quality are unmatched!",
        project: "E-commerce Platform"
    },
    {
        name: "Priya Sharma",
        role: "Founder, Digital Solutions",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "Working with this developer was a game-changer. The AI features are incredible and the execution was flawless. Highly recommend!",
        project: "AI Career Platform"
    },
    {
        name: "Amit Patel",
        role: "Hotel Manager, Luxury Resorts",
        image: "https://randomuser.me/api/portraits/men/56.jpg",
        rating: 5,
        text: "The hotel booking website is stunning! Our bookings increased by 150% within the first month. Premium quality and lightning fast!",
        project: "Hotel Booking System"
    },
    {
        name: "Sneha Reddy",
        role: "Healthcare Startup Founder",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        text: "The mental health AI application exceeded expectations. Intuitive, empathetic, and technically brilliant. A true professional!",
        project: "MindSync AI App"
    }
];

let currentIndex = 0;
const track = document.querySelector('.testimonials-track');
const dotsContainer = document.querySelector('.testimonial-dots');

testimonials.forEach((t, index) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card' + (index === 0 ? ' active' : '');
    
    const stars = '★'.repeat(t.rating);
    
    card.innerHTML = `
        <div class="testimonial-header">
            <img src="${t.image}" alt="Portrait of ${t.name}" class="testimonial-image">
            <div class="testimonial-info">
                <h3>${t.name}</h3>
                <p class="client-role">${t.role}</p>
                <div class="testimonial-rating" aria-label="${t.rating} out of 5 stars">${stars}</div>
            </div>
        </div>
        <p class="testimonial-text">${t.text}</p>
        <span class="testimonial-project">📁 ${t.project}</span>
    `;
    
    track.appendChild(card);
    
    const dot = document.createElement('div');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => showTestimonial(index));
    dotsContainer.appendChild(dot);
});

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    cards[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    currentIndex = index;
    
    cards[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

document.querySelector('.prev').addEventListener('click', () => {
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prev);
});

document.querySelector('.next').addEventListener('click', () => {
    const next = (currentIndex + 1) % testimonials.length;
    showTestimonial(next);
});

let autoSlideInterval = setInterval(() => {
    const next = (currentIndex + 1) % testimonials.length;
    showTestimonial(next);
}, 5000);

const testimonialsSection = document.querySelector('.testimonials-slider');
testimonialsSection.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

testimonialsSection.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    }, 5000);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prev);
    }
    if (e.key === 'ArrowRight') {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    }
});

// ============================================
// Testimonials Section Animation
// ============================================
gsap.from('.testimonials-section .section-header', {
    scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top center+=100'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.utils.toArray('.metric').forEach((metric, index) => {
    gsap.from(metric, {
        scrollTrigger: {
            trigger: '.testimonial-metrics',
            start: 'top bottom-=100'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out'
    });
});

// ============================================
// Contact Section Animation
// ============================================
gsap.from('.contact-container', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top center'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// ============================================
// CONTACT FORM WITH EMAILJS - DEBUG VERSION
// ============================================
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    const originalText = btn.querySelector('span').textContent;
    
    btn.querySelector('span').textContent = 'SENDING...';
    btn.style.background = 'rgba(255, 128, 0, 0.5)';
    btn.disabled = true;
    
    console.log('Form data:', {
        name: e.target.from_name.value,
        email: e.target.from_email.value,
        subject: e.target.subject.value,
        message: e.target.message.value
    });
    
    emailjs.sendForm(
        'service_1ompz8b',      // ← PUT YOUR ACTUAL SERVICE ID HERE
        'template_5n8wvrn',     // ← PUT YOUR ACTUAL TEMPLATE ID HERE
        e.target
    )
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        btn.querySelector('span').textContent = 'MESSAGE SENT! ✓';
        btn.style.background = '#4CAF50';
        
        setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 2000);
    })
    .catch((error) => {
        console.error('FULL ERROR:', error);
        console.error('Error status:', error.status);
        console.error('Error text:', error.text);
        
        btn.querySelector('span').textContent = 'FAILED TO SEND ✗';
        btn.style.background = '#f44336';
        
        // Show error details
        alert('Error: ' + error.text);
        
        setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
});


// ============================================
// Mobile Menu Toggle
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
}

// ============================================
// Section Numbers Animation
// ============================================
gsap.utils.toArray('.section-number').forEach(num => {
    gsap.from(num, {
        scrollTrigger: {
            trigger: num,
            start: 'top center'
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });
});

// ============================================
// Button Ripple Effect
// ============================================
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// Page Load Animation
// ============================================
window.addEventListener('load', () => {
    gsap.from('.logo-text', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.nav-links li', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero-content', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
    });
});

// ============================================
// Lazy Load Images
// ============================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, {
    rootMargin: '50px'
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// Scroll Progress Indicator
// ============================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
        const scrollProgress = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollTimeout = null;
    }, 100);
});

// ============================================
// Disable Three.js on very small screens
// ============================================
if (window.innerWidth < 480) {
    const webglCanvas = document.getElementById('webgl-canvas');
    if (webglCanvas) {
        webglCanvas.style.display = 'none';
    }
}

// ============================================
// Add will-change for performance
// ============================================
gsap.set(['.hero-title', '.hero-subtitle', '.hero-cta'], {
    willChange: 'transform, opacity'
});

ScrollTrigger.addEventListener('scrollEnd', () => {
    gsap.set(['.hero-title', '.hero-subtitle', '.hero-cta'], {
        willChange: 'auto'
    });
});

// ============================================
// Console Message
// ============================================
console.log('%c🏎️ Portfolio Loaded Successfully!', 'color: #FF8000; font-size: 20px; font-weight: bold;');
console.log('%c✉️ EmailJS Active | Messages → shreyashnashine81@gmail.com', 'color: #00D9FF; font-size: 12px;');
console.log('%cDeveloped by Shreyash Nashine', 'color: #A0A0A0; font-size: 10px;');
