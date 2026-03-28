// ==================== WAVE ANIMATION ====================
let time = 0;
const waveData = {};

// Initialize random wave data for each element
function initWaveData() {
    document.querySelectorAll('.wave-outline, .strand').forEach((el) => {
        waveData[el.id] = {
            offset1: Math.random() * Math.PI * 2,
            offset2: Math.random() * Math.PI * 2,
            offset3: Math.random() * Math.PI * 2,
            speed1: 0.00015 + Math.random() * 0.00012,
            speed2: 0.0001 + Math.random() * 0.00008,
            speed3: 0.00007 + Math.random() * 0.00006,
            amp1: 20 + Math.random() * 25,
            amp2: 12 + Math.random() * 18,
            amp3: 8 + Math.random() * 12
        };
    });
}

// Multi-layer wave function for organic random movement
function getWaveValue(t, data) {
    const w1 = Math.sin(t * data.speed1 + data.offset1) * data.amp1;
    const w2 = Math.sin(t * data.speed2 + data.offset2) * data.amp2;
    const w3 = Math.sin(t * data.speed3 + data.offset3) * data.amp3;
    return w1 + w2 + w3;
}

function animateTopRight(t) {
    const outlines = [
        { id: 'tr-out-1', startX: 900, cp1x: 1200, cp1y: 0, cp2x: 1500, cp2y: 150, endX: 1920, endY: 550 },
        { id: 'tr-out-2', startX: 950, cp1x: 1250, cp1y: 0, cp2x: 1550, cp2y: 180, endX: 1920, endY: 600 },
        { id: 'tr-out-3', startX: 1000, cp1x: 1300, cp1y: 0, cp2x: 1600, cp2y: 210, endX: 1920, endY: 650 },
        { id: 'tr-out-4', startX: 1050, cp1x: 1350, cp1y: 0, cp2x: 1650, cp2y: 240, endX: 1920, endY: 700 }
    ];

    outlines.forEach(o => {
        const el = document.getElementById(o.id);
        if (!el) return;
        const data = waveData[o.id];
        const wave = getWaveValue(t, data);
        
        const cp1y = o.cp1y + wave * 0.35;
        const cp2y = o.cp2y + wave * 0.55;
        const cp2x = o.cp2x + Math.sin(t * data.speed2 * 1.5 + data.offset2) * 12;
        const endY = o.endY + wave * 0.3;

        el.setAttribute('d', `M${o.startX},0 C${o.cp1x},${cp1y} ${cp2x},${cp2y} ${o.endX},${endY}`);
    });

    for (let i = 0; i <= 18; i++) {
        const el = document.getElementById(`tr-s-${i}`);
        if (!el) continue;
        const data = waveData[`tr-s-${i}`];
        const wave = getWaveValue(t, data);

        const startX = 600 + i * 50;
        const cp1x = 900 + i * 50 + wave * 0.45;
        const cp1y = Math.sin(t * data.speed1 * 1.2 + data.offset1) * 10;
        const cp2x = 1200 + i * 50 + wave * 0.65;
        const cp2y = 100 + i * 25 + wave * 0.4;
        const endY = 350 + i * 40 + wave * 0.25;

        el.setAttribute('d', `M${startX},0 C${cp1x},${cp1y} ${cp2x},${cp2y} 1920,${endY}`);
        
        const opacity = 0.28 + Math.sin(t * 0.0007 + i * 0.3 + data.offset1) * 0.14;
        el.style.opacity = Math.max(0.2, Math.min(0.5, opacity));
    }
}

function animateBottomLeft(t) {
    const outlines = [
        { id: 'bl-out-1', startY: 580, cp1y: 800, cp2x: 350, cp2y: 1080, endX: 770, endY: 1080 },
        { id: 'bl-out-2', startY: 600, cp1y: 830, cp2x: 390, cp2y: 1080, endX: 820, endY: 1080 },
        { id: 'bl-out-3', startY: 620, cp1y: 860, cp2x: 430, cp2y: 1080, endX: 870, endY: 1080 },
        { id: 'bl-out-4', startY: 640, cp1y: 890, cp2x: 470, cp2y: 1080, endX: 920, endY: 1080 }
    ];

    outlines.forEach((o) => {
        const el = document.getElementById(o.id);
        if (!el) return;
        const data = waveData[o.id];
        const wave = getWaveValue(t, data);

        const cp1y = o.cp1y + wave * 0.45;
        const cp2x = o.cp2x + wave * 0.35;
        const cp2y = o.cp2y + Math.sin(t * data.speed2 * 1.5 + data.offset2) * 8;
        const endX = o.endX + wave * 0.25;

        el.setAttribute('d', `M0,${o.startY} C0,${cp1y} ${cp2x},${cp2y} ${endX},1080`);
    });

    for (let i = 0; i <= 18; i++) {
        const el = document.getElementById(`bl-s-${i}`);
        if (!el) continue;
        const data = waveData[`bl-s-${i}`];
        const wave = getWaveValue(t, data);

        const startY = 450 + i * 20;
        const cp1y = 700 + i * 22 + wave * 0.55;
        const cp2x = 400 + i * 28 + wave * 0.4;
        const cp2y = 1000 + wave * 0.3;
        const endX = 850 + i * 35 + wave * 0.22;

        el.setAttribute('d', `M0,${startY} C0,${cp1y} ${cp2x},${cp2y} ${endX},1080`);
        
        const opacity = 0.28 + Math.sin(t * 0.0007 + i * 0.3 + data.offset1 + 1) * 0.14;
        el.style.opacity = Math.max(0.2, Math.min(0.5, opacity));
    }
}

function animateWaves() {
    time += 16;
    animateTopRight(time);
    animateBottomLeft(time);
    requestAnimationFrame(animateWaves);
}

// ==================== STARFIELD ANIMATION ====================
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];

const STAR_COUNT = 180;
const SHOOTING_STAR_CHANCE = 0.01;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.008 + 0.004;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }

    update(t) {
        this.opacity = this.baseOpacity + Math.sin(t * this.twinkleSpeed + this.twinkleOffset) * 0.18;
        this.opacity = Math.max(0.2, Math.min(0.75, this.opacity));
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width * 0.4;
        this.y = -80;
        this.length = Math.random() * 120 + 60;
        this.speed = Math.random() * 3.5 + 2;
        this.angle = Math.PI / 4 + (Math.random() * 0.25 - 0.12);
        this.opacity = 0;
        this.active = false;
        this.fadeIn = true;
    }

    activate() {
        this.x = Math.random() * width * 0.3 + width * 0.15;
        this.y = -80;
        this.opacity = 0;
        this.active = true;
        this.fadeIn = true;
    }

    update() {
        if (!this.active) return;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.fadeIn) {
            this.opacity += 0.04;
            if (this.opacity >= 0.9) this.fadeIn = false;
        } else {
            this.opacity -= 0.01;
        }

        if (this.opacity <= 0 || this.x > width + 150 || this.y > height + 150) {
            this.active = false;
            this.reset();
        }
    }

    draw() {
        if (!this.active || this.opacity <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.4, `rgba(180, 210, 255, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(100, 150, 220, 0)`);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    shootingStars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }

    for (let i = 0; i < 4; i++) {
        shootingStars.push(new ShootingStar());
    }
}

let starTime = 0;
function animateStars() {
    starTime += 16;
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.update(starTime);
        star.draw();
    });

    if (Math.random() < SHOOTING_STAR_CHANCE) {
        const inactive = shootingStars.find(s => !s.active);
        if (inactive) inactive.activate();
    }

    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStars);
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    initWaveData();
    resize();
    animateWaves();
    animateStars();
    
    window.addEventListener('resize', resize);
});
