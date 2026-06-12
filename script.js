/* ==============================
   LEGO Portfolio — Interactive JS
   ============================== */

// ---- SMOOTH SCROLLING ----
document.querySelectorAll('.nav-brick').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ---- ACTIVE NAV ON SCROLL ----
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('.section').forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 260) current = sec.id;
    });
    document.querySelectorAll('.nav-brick').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}, { passive: true });

// ---- BRICK CLICK COUNTER ----
let brickCount = 0;
const brickCountEl  = document.getElementById('brickCount');
const counterEl     = document.getElementById('brickCounter');

function incrementBrick() {
    brickCount++;
    brickCountEl.textContent = brickCount;
    counterEl.style.transform = 'translateY(-3px) scale(1.18)';
    setTimeout(() => { counterEl.style.transform = ''; }, 160);
}

// ---- WEB AUDIO — LEGO CLICK SOUND ----
let audioCtx = null;

function playBrickSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Short noise burst that sounds like plastic clicking
        const dur  = 0.055;
        const buf  = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * dur), audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
        }
        const src  = audioCtx.createBufferSource();
        src.buffer = buf;

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);

        // Slight low-pass to make it sound more plastic, less sharp
        const filter = audioCtx.createBiquadFilter();
        filter.type  = 'lowpass';
        filter.frequency.value = 2400;

        src.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
    } catch (e) { /* audio blocked — silently skip */ }
}

// ---- STUD PARTICLE BURST ----
const PARTICLE_COLORS = ['#DA291C', '#006DB7', '#00A550', '#F5CD2F', '#FF6600'];

function spawnStudParticles(x, y) {
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    for (let i = 0; i < 9; i++) {
        const stud  = document.createElement('div');
        stud.className = 'stud-particle';
        const angle = (i / 9) * Math.PI * 2;
        const dist  = 42 + Math.random() * 38;
        stud.style.cssText = `
            left: ${x}px;
            top:  ${y}px;
            background: ${color};
            --tx: ${(Math.cos(angle) * dist).toFixed(1)}px;
            --ty: ${(Math.sin(angle) * dist).toFixed(1)}px;
        `;
        document.body.appendChild(stud);
        setTimeout(() => stud.remove(), 800);
    }
}

// ---- UNIFIED CLICK HANDLER ----
document.addEventListener('click', function (e) {
    const card      = e.target.closest('.lego-card');
    const navBrick  = e.target.closest('.nav-brick');
    const socialBtn = e.target.closest('.social-btn');
    const colorB    = e.target.closest('.color-brick');

    if (!card && !navBrick && !socialBtn && !colorB) return;

    playBrickSound();
    spawnStudParticles(e.clientX, e.clientY);

    if (card) incrementBrick();
});

// ---- COLOR SELECTOR ----
document.querySelectorAll('.color-brick').forEach(brick => {
    brick.addEventListener('click', function () {
        document.querySelectorAll('.color-brick').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const color = this.style.background;
        const dark  = this.dataset.dark || 'rgba(0,0,0,0.4)';

        // Update counter badge to match selected color
        counterEl.style.background = color;
        counterEl.style.boxShadow  = `0 4px 0 ${dark}, 0 6px 12px rgba(0,0,0,0.35)`;

        // Update CSS vars for accent (nav active glow, etc.)
        document.documentElement.style.setProperty('--accent',      color);
        document.documentElement.style.setProperty('--accent-dark', dark);
    });
});

// ---- SCROLL BUILD-IN ANIMATION ----
const buildObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.lego-card, .section-title-brick').forEach((el, i) => {
    el.classList.add('build-in');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    buildObserver.observe(el);
});

// ---- CURSOR STUD TRAIL ----
let lastTrail = 0;

document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastTrail < 55) return;
    lastTrail = now;

    const stud = document.createElement('div');
    stud.className = 'cursor-trail-stud';
    stud.style.left = `${e.clientX - 5}px`;
    stud.style.top  = `${e.clientY - 5}px`;
    document.body.appendChild(stud);

    // Fade out after brief pause
    setTimeout(() => {
        stud.style.opacity   = '0';
        stud.style.transform = 'scale(0)';
    }, 60);

    setTimeout(() => stud.remove(), 380);
}, { passive: true });

// ---- CONSOLE EASTER EGG ----
console.log(
    '%c 🧱 RAPHAEL TALON ',
    'color:#1A1A1A;background:#F5CD2F;font-size:28px;font-weight:bold;padding:8px 16px;border-radius:4px;'
);
console.log('%c Built with HTML, CSS & JS — LEGO Edition', 'color:#DA291C;font-size:13px;font-weight:bold;');
console.log('%c Click the bricks! 🧱', 'color:#006DB7;font-size:13px;font-weight:bold;');
