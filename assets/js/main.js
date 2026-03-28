const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, stars = [], shooters = [], t = 0;

const strandCount = 18;
const strands = Array.from({ length: strandCount }, () => ({
  phaseOffset: Math.random() * Math.PI * 2,
  speedMult: 0.6 + Math.random() * 0.9,
  ampMult: 0.5 + Math.random() * 1.0,
  warpX: (Math.random() - 0.5) * 0.12,
  warpY: (Math.random() - 0.5) * 0.12,
}));

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.035 + 0.008,
      drift: (Math.random() - 0.5) * 0.07
    });
  }
}

function spawnShooter() {
  const sx = W * 0.22 + Math.random() * W * 0.55;
  const sy = H * 0.12 + Math.random() * H * 0.38;
  const angle = Math.PI / 5 + (Math.random() - 0.5) * 0.45;
  shooters.push({ x: sx, y: sy, len: 80 + Math.random() * 80, angle, life: 1, speed: 5 + Math.random() * 4 });
}

function drawCorner() {
  const clipPath = new Path2D();
  clipPath.moveTo(W, 0);
  clipPath.lineTo(W * 0.34, 0);
  clipPath.bezierCurveTo(W * 0.58, H * 0.06, W * 0.80, H * 0.20, W * 0.87, H * 0.44);
  clipPath.bezierCurveTo(W * 0.91, H * 0.55, W * 0.95, H * 0.60, W, H * 0.63);
  clipPath.closePath();

  ctx.save();
  ctx.clip(clipPath);
  ctx.fillStyle = 'rgba(7, 9, 34, 0.94)';
  ctx.fill(clipPath);

  strands.forEach((s, i) => {
    const prog = i / (strandCount - 1);
    const wave1 = Math.sin(t * s.speedMult + s.phaseOffset) * W * 0.045 * s.ampMult;
    const wave2 = Math.cos(t * s.speedMult * 0.7 + s.phaseOffset + 1.2) * H * 0.055 * s.ampMult;
    const wave3 = Math.sin(t * s.speedMult * 1.3 + s.phaseOffset + 2.4) * W * 0.03 * s.ampMult;
    const cp1x = W * (0.58 + s.warpX) + wave1;
    const cp1y = H * (0.06 + s.warpY) + wave2 * 0.5;
    const cp2x = W * (0.80 + s.warpX * 0.5) + wave3;
    const cp2y = H * (0.20 + s.warpY * 0.5) + wave2;
    const alpha = 0.07 + Math.abs(Math.sin(t * s.speedMult * 0.5 + s.phaseOffset)) * 0.18;

    ctx.beginPath();
    ctx.moveTo(W * (0.34 + prog * 0.66) + wave1 * 0.3, 0);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, W, H * 0.63 * prog + wave2 * 0.3);
    ctx.strokeStyle = `rgba(160, 200, 255, ${alpha})`;
    ctx.lineWidth = 0.75 + Math.abs(Math.sin(t * s.speedMult + s.phaseOffset)) * 0.5;
    ctx.stroke();
  });

  ctx.restore();

  const edgePulse = 0.35 + 0.2 * Math.sin(t * 0.9);
  ctx.beginPath();
  ctx.moveTo(W * 0.34, 0);
  ctx.bezierCurveTo(W * 0.58, H * 0.06, W * 0.80, H * 0.20, W * 0.87, H * 0.44);
  ctx.bezierCurveTo(W * 0.91, H * 0.55, W * 0.95, H * 0.60, W, H * 0.63);
  ctx.strokeStyle = `rgba(130, 175, 255, ${edgePulse})`;
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#04040f';
  ctx.fillRect(0, 0, W, H);

  const ng = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.46);
  ng.addColorStop(0, 'rgba(45,15,110,0.28)');
  ng.addColorStop(1, 'rgba(4,4,15,0)');
  ctx.fillStyle = ng;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    s.twinkle += s.ts;
    s.x += s.drift;
    if (s.x < 0) s.x = W;
    if (s.x > W) s.x = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,232,255,${0.25 + 0.75 * Math.abs(Math.sin(s.twinkle))})`;
    ctx.fill();
  });

  if (Math.random() < 0.013) spawnShooter();
  shooters = shooters.filter(s => s.life > 0);
  shooters.forEach(sh => {
    sh.x += Math.cos(sh.angle) * sh.speed;
    sh.y += Math.sin(sh.angle) * sh.speed;
    sh.life -= 0.02;
    const tx = sh.x - Math.cos(sh.angle) * sh.len;
    const ty = sh.y - Math.sin(sh.angle) * sh.len;
    const g = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, `rgba(255,255,255,${sh.life})`);
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sh.x, sh.y);
    ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sh.life})`; ctx.fill();
  });

  drawCorner();
  ctx.save();
  ctx.translate(W, H);
  ctx.rotate(Math.PI);
  drawCorner();
  ctx.restore();

  t += 0.016;
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();
