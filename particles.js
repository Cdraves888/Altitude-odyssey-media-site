(function () {
  // Skip on touch-only devices — no cursor to trail
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '99999',
  });

  document.body.appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Gold palette matching --gold:#c9a84c and --gold-light:#e2c47a
  const COLORS = ['#c9a84c', '#e2c47a', '#f0d98a', '#b8943e', '#d4b96a'];

  const particles = [];

  let mx = -999, my = -999;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    // Spawn 2–3 particles per move event
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: mx + (Math.random() - 0.5) * 6,
        y: my + (Math.random() - 0.5) * 6,
        r: 1.2 + Math.random() * 1.8,        // radius
        vx: (Math.random() - 0.5) * 0.8,     // drift
        vy: -0.4 - Math.random() * 0.8,      // float upward slightly
        alpha: 0.7 + Math.random() * 0.3,
        decay: 0.018 + Math.random() * 0.014,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;   // slight gravity pull back down
      p.alpha -= p.decay;
      p.r *= 0.985;   // shrink gently

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
