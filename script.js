// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all skill cards and project cards
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add random movement to floating stickers
function animateStickers() {
    const stickers = document.querySelectorAll('.floating-stickers .sticker');
    
    stickers.forEach((sticker, index) => {
        const randomX = Math.random() * 30 - 15;
        const randomY = Math.random() * 30 - 15;
        const randomRotation = Math.random() * 15 - 7.5;
        
        setInterval(() => {
            sticker.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
        }, 3000 + index * 500);
    });
}

animateStickers();

// Cursor glow effect
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 249, 0.5), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: screen;
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Add click ripple effect
document.querySelectorAll('.skill-card, .project-card, .social-btn, .nav-link').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .skill-card, .project-card, .social-btn, .nav-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 249, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Typing effect for subtitle (optional enhancement)
const subtitle = document.querySelector('.subtitle');
const originalText = subtitle.textContent;
subtitle.textContent = '';

let charIndex = 0;
function typeWriter() {
    if (charIndex < originalText.length) {
        subtitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Add glitch effect on hover to project cards
document.querySelectorAll('.project-card h3').forEach(title => {
    title.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease';
    });
    
    title.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Console easter egg
console.log('%c RAPHAEL TALON', 'color: #fff; background: #000; font-size: 30px; font-weight: bold; padding: 10px; font-family: Arial Black;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #ff006e; font-size: 14px; font-weight: bold;');
console.log('%cStussy-inspired streetwear aesthetic', 'color: #00fff9; font-size: 14px; font-weight: bold;');
