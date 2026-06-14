/* ============================================
   AAYUSH HALWAI — PORTFOLIO JAVASCRIPT
   Features: Loader, Particles, Typing, Scroll Reveal,
             Navbar, Back-to-top, Theme Toggle
   ============================================ */

'use strict';

/* ---- 1. LOADER ---- */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Kick off hero animations after load
      triggerHeroAnimations();
    }, 900);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 120);
  });
}

/* ---- 2. PARTICLE CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const NUM = 80;
  const MAX_DIST = 130;
  const MOUSE_DIST = 160;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Build particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }
  createParticles();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Wander
      p.x += p.vx;
      p.y += p.vy;

      // Soft mouse repulsion
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          const force = (MOUSE_DIST - d) / MOUSE_DIST;
          p.x += dx * force * 0.025;
          p.y += dy * force * 0.025;
        }
      }

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* ---- 3. TYPING ANIMATION ---- */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Student & Aspiring Developer',
    'Building things with JavaScript',
    'Learning every single day',
    'Turning ideas into code',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting && charIdx <= current.length) {
      el.textContent = current.slice(0, charIdx);
      charIdx++;
      if (charIdx > current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 2000);
      }
    } else if (deleting && charIdx >= 0) {
      el.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
      }
    }

    if (!pause) {
      const speed = deleting ? 40 : 75;
      setTimeout(type, speed);
    } else {
      setTimeout(type, 100);
    }
  }

  // Wait for loader before starting
  setTimeout(type, 1500);
})();

/* ---- 4. NAVBAR ---- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Sticky effect
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      const href = l.getAttribute('href')?.slice(1);
      l.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

/* ---- 5. SCROLL REVEAL ---- */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Skip hero — handled by loader callback
  const toObserve = Array.from(revealEls).filter(el => !el.closest('.hero'));

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    toObserve.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  toObserve.forEach(el => observer.observe(el));
})();

/* ---- 6. SKILL BAR ANIMATION ---- */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        if (width) fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => observer.observe(f));
})();

/* ---- 7. BACK TO TOP ---- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- 8. THEME TOGGLE ---- */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

/* ---- 9. SMOOTH ANCHOR SCROLLING (fallback for older browsers) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});