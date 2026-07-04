/* ══════════════════════════════════════════════════════════════
   ABENEZER SAMSON — script.js   (scroll-reveal + animated skills)
   ══════════════════════════════════════════════════════════════ */

/* ── EMAILJS INIT ── */
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY');
  }
})();

/* ── PAGE LOADER ── */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
});

/* ── INJECT ALL KEYFRAMES ── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ripple { to { transform:scale(1); opacity:0; } }

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }

  @keyframes fadeInLeft {
    from { opacity:0; transform:translateX(-40px); }
    to   { opacity:1; transform:translateX(0); }
  }

  @keyframes fadeInRight {
    from { opacity:0; transform:translateX(40px); }
    to   { opacity:1; transform:translateX(0); }
  }

  @keyframes fadeInScale {
    from { opacity:0; transform:scale(0.88); }
    to   { opacity:1; transform:scale(1); }
  }

  @keyframes slideInDown {
    from { opacity:0; transform:translateY(-30px); }
    to   { opacity:1; transform:translateY(0); }
  }

  @keyframes badgePop {
    0%   { opacity:0; transform:translateY(16px) scale(0.85); }
    60%  { transform:translateY(-4px) scale(1.05); }
    100% { opacity:1; transform:translateY(0) scale(1); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Scroll reveal base states */
  .sr-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .sr-up     { transform: translateY(50px); }
  .sr-left   { transform: translateX(-50px); }
  .sr-right  { transform: translateX(50px); }
  .sr-scale  { transform: scale(0.88); }
  .sr-down   { transform: translateY(-30px); }

  .sr-visible {
    opacity: 1 !important;
    transform: none !important;
    pointer-events: auto !important;
    transition: opacity 0.72s cubic-bezier(0.16,1,0.3,1),
                transform 0.72s cubic-bezier(0.16,1,0.3,1) !important;
  }

  /* Skill badge hidden state */
  .skill-badge {
    opacity: 0;
    transform: translateY(14px) scale(0.9);
  }

  .skill-badge.badge-visible {
    animation: badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  /* Section label shimmer */
  .section-eyebrow {
    background: linear-gradient(
      90deg,
      #E02040 0%,
      #F47C20 40%,
      #E02040 60%,
      #F47C20 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* Hover lift for contact items */
  .contact-item {
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
  }

  /* Floating badge shimmer border */
  .floating-badge {
    animation: floatBadge 4s ease-in-out infinite;
  }

  @keyframes floatBadge {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  .fb-1 { animation-delay: 0s; }
  .fb-2 { animation-delay: 1.5s; }
  .fb-3 { animation-delay: 0.8s; }

  /* Project card top gradient line reveal */
  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #C0152A, #F47C20, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
  }

  .project-card:hover::before { opacity: 1; }

  /* Skill category title underline draw */
  .skill-cat-title::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #C0152A, #F47C20);
    margin-top: 8px;
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  .skill-cat-title.line-drawn::after { width: 60px; }

  /* Info card icon pulse on hover */
  .info-card:hover .info-card-icon {
    animation: iconPulse 0.4s ease;
  }

  @keyframes iconPulse {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.2); }
    70%  { transform: scale(0.95); }
    100% { transform: scale(1); }
  }

  /* Service card icon */
  .service-card:hover .service-icon {
    transform: rotateY(180deg);
    transition: transform 0.5s ease !important;
  }

  .service-icon {
    transition: transform 0.5s ease, background 0.3s ease !important;
  }

  /* Scroll progress */
  #scroll-progress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #C0152A, #F47C20);
    z-index: 9998;
    pointer-events: none;
    border-radius: 0 2px 2px 0;
    transition: width 0.1s linear;
  }
`;
document.head.appendChild(styleSheet);

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════════════════════════════════
   CORE SCROLL REVEAL ENGINE
   ══════════════════════════════════════════════════════════════ */
function initScrollReveal() {

  // Map each element's data-sr attribute to direction class
  const revealMap = [
    { selector: '.section-header',             dir: 'sr-up',    delay: 0   },
    { selector: '.hero-text',                  dir: 'sr-left',  delay: 0   },
    { selector: '.hero-image-wrap',            dir: 'sr-right', delay: 150 },
    { selector: '.about-headline',             dir: 'sr-up',    delay: 0   },
    { selector: '.about-text',                 dir: 'sr-up',    delay: 80  },
    { selector: '.about-links',                dir: 'sr-up',    delay: 120 },
    { selector: '.about-cta-row',              dir: 'sr-up',    delay: 160 },
    { selector: '.info-card',                  dir: 'sr-right', delay: 0   },
    { selector: '.service-card',               dir: 'sr-up',    delay: 0   },
    { selector: '.skill-category',             dir: 'sr-up',    delay: 0   },
    { selector: '.project-card',               dir: 'sr-up',    delay: 0   },
    { selector: '.contact-item',               dir: 'sr-left',  delay: 0   },
    { selector: '.social-row',                 dir: 'sr-up',    delay: 0   },
    { selector: '.map-wrap',                   dir: 'sr-up',    delay: 0   },
    { selector: '.cv-card',                    dir: 'sr-up',    delay: 0   },
    { selector: '.form-card',                  dir: 'sr-right', delay: 0   },
    { selector: '.services-heading',           dir: 'sr-up',    delay: 0   },
    { selector: '.footer-brand',               dir: 'sr-left',  delay: 0   },
    { selector: '.footer-links-col',           dir: 'sr-up',    delay: 80  },
  ];

  // Apply hidden + direction classes
  revealMap.forEach(({ selector, dir }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('sr-hidden', dir);
    });
  });

  // Stagger siblings (cards in a grid)
  function applyStagger(selector, baseDelay = 0, step = 100) {
    const groups = {};
    document.querySelectorAll(selector).forEach(el => {
      const parent = el.parentElement;
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(el);
    });
    Object.values(groups).forEach(siblings => {
      siblings.forEach((el, i) => {
        el.dataset.srDelay = baseDelay + i * step;
      });
    });
  }

  applyStagger('.info-card',    0,   120);
  applyStagger('.service-card', 0,   80);
  applyStagger('.project-card', 0,   150);
  applyStagger('.contact-item', 0,   60);
  applyStagger('.skill-category', 0, 100);
  applyStagger('.footer-links-col', 80, 100);

  // IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.srDelay || 0, 10);

      setTimeout(() => {
        el.classList.remove('sr-hidden', 'sr-up', 'sr-left', 'sr-right', 'sr-scale', 'sr-down');
        el.classList.add('sr-visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.sr-hidden').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   SKILLS BADGE REVEAL — fade + pop stagger
   ══════════════════════════════════════════════════════════════ */
function initSkillBadges() {
  const catObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const cat    = entry.target;
      const title  = cat.querySelector('.skill-cat-title');
      const badges = cat.querySelectorAll('.skill-badge');

      // Draw underline on title
      if (title) {
        setTimeout(() => title.classList.add('line-drawn'), 100);
      }

      // Stagger each badge with badgePop
      badges.forEach((badge, i) => {
        setTimeout(() => {
          badge.classList.add('badge-visible');
        }, 200 + i * 70);
      });

      catObserver.unobserve(cat);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(c => catObserver.observe(c));
}

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a, button, .glass-card, .social-btn, .contact-item, .skill-badge, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
} else {
  if (dot)  dot.style.display  = 'none';
  if (ring) ring.style.display = 'none';
}

/* ── NAVBAR SCROLL + ACTIVE ── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const sections   = Array.from(document.querySelectorAll('section[id]'));

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
}, { passive: true });

function highlightNav() {
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (!link) return;
    if (mid >= top && mid < top + h) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
}

if (navLinksEl) {
  navLinksEl.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 3D TILT CARDS ── */
function tilt(selector, depth = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange     = 'transform';

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -depth;
      const ry = ((e.clientX - cx) / (r.width  / 2)) *  depth;
      card.style.transition = 'none';
      card.style.transform  = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03) translateZ(8px)`;
      card.style.boxShadow  = `${-ry*1.5}px ${rx*1.2}px 40px rgba(192,21,42,0.25), 0 20px 50px rgba(0,0,0,0.5)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94), box-shadow 0.5s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
}

tilt('.project-card', 7);
tilt('.service-card', 6);
tilt('.info-card',    5);
tilt('.cv-card',      4);
tilt('.contact-item', 3);
tilt('.form-card',    3);

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25;
    btn.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── RIPPLE ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => {
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const el   = document.createElement('span');
    el.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - r.left - size/2}px;
      top:${e.clientY - r.top - size/2}px;
      background:rgba(255,255,255,0.18);border-radius:50%;
      transform:scale(0);animation:ripple .55s ease-out forwards;
      pointer-events:none;`;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 600);
  });
});

/* ── SOCIAL BRAND COLORS ── */
const brandColors = {
  linkedin:  '#0A66C2',
  github:    '#6e40c9',
  instagram: '#E1306C',
  telegram:  '#229ED9',
};

document.querySelectorAll('.social-btn[data-social]').forEach(btn => {
  const c = brandColors[btn.dataset.social] || '#C0152A';
  btn.addEventListener('mouseenter', () => {
    btn.style.background  = c;
    btn.style.borderColor = c;
    btn.style.color       = '#fff';
    btn.style.boxShadow   = `0 8px 28px ${c}55`;
    btn.style.transform   = 'translateY(-5px) scale(1.1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.color       = '';
    btn.style.boxShadow   = '';
    btn.style.transform   = '';
  });
});

/* ── FOOTER SOCIALS ── */
document.querySelectorAll('.footer-socials a').forEach(a => {
  a.addEventListener('mouseenter', () => { a.style.transform = 'translateY(-3px)'; });
  a.addEventListener('mouseleave', () => { a.style.transform = ''; });
  a.style.transition = 'color .2s, transform .2s, border-color .2s';
});

/* ── CONTACT FORM ── */
const EJ_SERVICE  = 'YOUR_SERVICE_ID';
const EJ_TEMPLATE = 'YOUR_TEMPLATE_ID';
const EJ_KEY      = 'YOUR_PUBLIC_KEY';

const form     = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const submitBtn = form.querySelector('.form-submit');
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoad   = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled    = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';

    const params = {
      from_name:  form.querySelector('[name="name"]').value.trim(),
      from_email: form.querySelector('[name="email"]').value.trim(),
      subject:    form.querySelector('[name="subject"]').value.trim(),
      message:    form.querySelector('[name="message"]').value.trim(),
    };

    try {
      if (typeof emailjs !== 'undefined' && EJ_KEY !== 'YOUR_PUBLIC_KEY') {
        await emailjs.send(EJ_SERVICE, EJ_TEMPLATE, params, EJ_KEY);
      } else {
        await new Promise(r => setTimeout(r, 1500));
      }
      showStatus('success', '✓ Message sent! I\'ll reply within 24 hours.');
      form.reset();
    } catch (err) {
      showStatus('error', '✗ Failed to send. Email me directly at abenezersamson414@gmail.com');
    } finally {
      submitBtn.disabled    = false;
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
    }
  });
}

function showStatus(type, msg) {
  if (!statusEl) return;
  statusEl.textContent   = msg;
  statusEl.className     = `form-status form-status--${type}`;
  statusEl.style.display = 'block';
  setTimeout(() => { statusEl.style.display = 'none'; }, 6000);
}

/* ── FORM INPUT ICON FOCUS ── */
document.querySelectorAll('.form-input').forEach(inp => {
  inp.addEventListener('focus', () => {
    const icon = inp.closest('.form-input-wrap')?.querySelector('.form-input-icon');
    if (icon) icon.style.color = '#E02040';
  });
  inp.addEventListener('blur', () => {
    const icon = inp.closest('.form-input-wrap')?.querySelector('.form-input-icon');
    if (icon) icon.style.color = '';
  });
});

/* ── AOS (kept for any remaining data-aos in HTML) ── */
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 700, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', once: true, offset: 60 });
}

/* ── SECTION IN-VIEW DIVIDER ── */
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in-view'); });
}, { threshold: 0.08 });
document.querySelectorAll('section').forEach(s => sectionObs.observe(s));

/* ── INIT EVERYTHING after DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSkillBadges();
});

// Also call after loader hides (ensures hero elements animate properly)
window.addEventListener('load', () => {
  setTimeout(() => {
    initScrollReveal();
    initSkillBadges();
  }, 1900);
});