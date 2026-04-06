/* =====================================================
   SUTU & CUPCAKE — SHARED JS (place at bottom of body)
   ===================================================== */

// ── ACTIVE NAV LINK ──
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// ── NAV SHRINK ON SCROLL ──
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl && navEl.classList.toggle('scrolled', scrollY > 60);
});

// ── MOBILE MENU ──
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
if (hamburger) hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── CUSTOM CURSOR ──
const cur  = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = innerWidth / 2, my = innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, .card, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '18px'; cur.style.height = '18px';
    ring.style.width = '54px'; ring.style.height = '54px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '10px'; cur.style.height = '10px';
    ring.style.width = '36px'; ring.style.height = '36px';
  });
});

// ── FLOATING HEARTS ──
const canvas = document.getElementById('hearts-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener('resize', resize);

const floaters = Array.from({ length: 32 }, () => ({
  x:     Math.random() * innerWidth,
  y:     Math.random() * innerHeight + innerHeight,
  size:  Math.random() * 13 + 5,
  speed: Math.random() * 0.55 + 0.2,
  drift: (Math.random() - 0.5) * 0.45,
  alpha: Math.random() * 0.18 + 0.04,
  rot:   Math.random() * Math.PI * 2,
  rs:    (Math.random() - 0.5) * 0.018,
}));

const burst = [];

function drawHeart(x, y, s, a, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.globalAlpha = a;
  ctx.fillStyle = '#e8637a';
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo( s * 0.5, -s * 0.1,  s, s * 0.4, 0, s);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s, s * 0.4, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  floaters.forEach(h => {
    h.y   -= h.speed;
    h.x   += h.drift;
    h.rot += h.rs;
    if (h.y < -40) {
      h.y = canvas.height + 40;
      h.x = Math.random() * canvas.width;
    }
    drawHeart(h.x, h.y, h.size, h.alpha, h.rot);
  });

  for (let i = burst.length - 1; i >= 0; i--) {
    const h = burst[i];
    h.x += h.vx; h.y += h.vy; h.vy += 0.13; h.alpha -= 0.02;
    if (h.alpha <= 0) { burst.splice(i, 1); continue; }
    drawHeart(h.x, h.y, h.size, h.alpha, h.rot);
  }

  requestAnimationFrame(loop);
})();

// Click = burst of hearts
document.addEventListener('click', e => {
  for (let i = 0; i < 7; i++) {
    burst.push({
      x: e.clientX, y: e.clientY,
      size: Math.random() * 10 + 5,
      vx:   (Math.random() - 0.5) * 5.5,
      vy:   -(Math.random() * 4.5 + 2),
      alpha: 0.78,
      rot:  Math.random() * Math.PI,
    });
  }
});

// ── AOS ──
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 700, easing: 'ease-out', once: true, offset: 50 });
}
