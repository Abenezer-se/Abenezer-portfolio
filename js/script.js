/* ══════════════════════════════════════════════════════════════
   ABENEZER SAMSON — script.js  (fully wired)
   ══════════════════════════════════════════════════════════════ */

/* ── EMAILJS INIT ────────────────────────────────────────────── */
// ⚠️  Replace with your real EmailJS credentials from emailjs.com
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY'); // ← paste your public key here
  }
})();

/* ── PAGE LOADER ─────────────────────────────────────────────── */
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
    initCounters();
    initSkillBars();
  }, 1800);
});

/* ── SCROLL PROGRESS BAR ─────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText =
  'position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#C0152A,#F47C20);z-index:9998;pointer-events:none;transition:width .1s linear;';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a,button,.glass-card,.social-btn,.contact-item,.skill-card,.project-card,.service-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
} else {
  // Hide cursors on touch devices
  if (dot)  dot.style.display  = 'none';
  if (ring) ring.style.display = 'none';
}

/* ── NAVBAR SCROLL + ACTIVE ──────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const sections  = Array.from(document.querySelectorAll('section[id]'));

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

hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks && navLinks.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  })
);

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let curr = 0;
    const step = target / (1600 / 16);
    const t = setInterval(() => {
      curr += step;
      if (curr >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(curr);
    }, 16);
  });
}

/* ── SKILL BARS ──────────────────────────────────────────────── */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const fill = en.target.querySelector('.skill-bar-fill');
        if (fill) setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 250);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(c => obs.observe(c));
}

/* ── 3-D TILT CARDS ──────────────────────────────────────────── */
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
      card.style.transform  = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04) translateZ(10px)`;
      card.style.boxShadow  = `${-ry * 2}px ${rx * 1.5}px 48px rgba(192,21,42,0.28), 0 24px 64px rgba(0,0,0,0.55)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(.25,.46,.45,.94), box-shadow 0.55s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
}

tilt('.project-card', 8);
tilt('.service-card', 7);
tilt('.skill-card',   5);
tilt('.info-card',    6);
tilt('.cv-card',      5);
tilt('.contact-item', 4);
tilt('.form-card',    4);

/* ── MAGNETIC BUTTONS ────────────────────────────────────────── */
document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
    btn.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── RIPPLE ON BUTTON CLICK ──────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => {
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const el   = document.createElement('span');
    el.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - r.left - size/2}px;
      top:${e.clientY  - r.top  - size/2}px;
      background:rgba(255,255,255,0.18);border-radius:50%;
      transform:scale(0);animation:ripple .55s ease-out forwards;
      pointer-events:none;`;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 600);
  });
});

/* ── SOCIAL ICON BRAND COLORS ────────────────────────────────── */
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
    btn.style.boxShadow   = `0 10px 32px ${c}55, 0 0 0 1px ${c}33`;
    btn.style.transform   = 'translateY(-6px) scale(1.12)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.color       = '';
    btn.style.boxShadow   = '';
    btn.style.transform   = '';
  });
});

/* ── FOOTER SOCIAL HOVER ─────────────────────────────────────── */
document.querySelectorAll('.footer-socials a').forEach(a => {
  a.addEventListener('mouseenter', () => {
    a.style.color     = '#C0152A';
    a.style.transform = 'translateY(-4px)';
  });
  a.addEventListener('mouseleave', () => {
    a.style.color     = '';
    a.style.transform = '';
  });
  a.style.transition = 'color .2s, transform .2s';
});

/* ── CONTACT FORM (EmailJS) ──────────────────────────────────── */
/*
  SETUP INSTRUCTIONS:
  1. Go to https://emailjs.com and create a free account
  2. Add a Gmail service → copy the Service ID
  3. Create an email template with these variables:
       {{from_name}} {{from_email}} {{subject}} {{message}}
     Set "To Email" to: abenezersamson414@gmail.com
  4. Copy your Public Key from Account → API Keys
  5. Replace the three constants below with your real values
*/
const EJ_SERVICE  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EJ_TEMPLATE = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz456'
const EJ_KEY      = 'YOUR_PUBLIC_KEY';   // e.g. 'AbCdEfGhIjKl'

const form       = document.getElementById('contactForm');
const statusEl   = document.getElementById('formStatus');

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
        // Demo mode — simulate success
        await new Promise(r => setTimeout(r, 1500));
      }
      showStatus('success', '✓ Message sent! I\'ll reply within 24 hours.');
      form.reset();
    } catch (err) {
      showStatus('error', '✗ Failed to send. Email me directly at abenezersamson414@gmail.com');
      console.error(err);
    } finally {
      submitBtn.disabled    = false;
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
    }
  });
}

function showStatus(type, msg) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className   = `form-status form-status--${type}`;
  statusEl.style.display = 'block';
  setTimeout(() => { statusEl.style.display = 'none'; }, 6000);
}

/* ── FORM INPUT FOCUS EFFECTS ────────────────────────────────── */
document.querySelectorAll('.form-input').forEach(inp => {
  inp.addEventListener('focus', () => {
    const wrap = inp.closest('.form-input-wrap');
    if (wrap) wrap.querySelector('.form-input-icon').style.color = '#E02040';
  });
  inp.addEventListener('blur', () => {
    const wrap = inp.closest('.form-input-wrap');
    if (wrap) wrap.querySelector('.form-input-icon').style.color = '';
  });
});

/* ── AOS ─────────────────────────────────────────────────────── */
AOS.init({ duration: 760, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', once: true, offset: 70 });

/* ── INJECT KEYFRAMES ────────────────────────────────────────── */
const ks = document.createElement('style');
ks.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0}}';
document.head.appendChild(ks);

/* ── SECTION DIVIDER LINE ON SCROLL ─────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in-view'); });
}, { threshold: 0.08 }).observe && (() => {
  const o = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in-view'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('section').forEach(s => o.observe(s));
})();
