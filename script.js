document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared light and dark theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    const label = themeToggle.querySelector('span');
    if (label) label.textContent = `${dark ? 'Light' : 'Dark'} mode`;
  }
};
const savedTheme = localStorage.getItem('3point-theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('3point-theme', nextTheme);
    applyTheme(nextTheme);
  });
}

// Mobile menu
const burger = document.querySelector('.burger'), nav = document.getElementById('nav');
if (burger && nav) {
  const setMenuOpen = open => {
    burger.classList.toggle('active', open);
    nav.classList.toggle('active', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => {
    setMenuOpen(!nav.classList.contains('active'));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('active')) {
      setMenuOpen(false);
      burger.focus();
    }
  });
}

// Scroll reveal + stat counters
const count = el => {
  const end = +el.dataset.count; if (reduce) return;
  let t0; const step = t => { t0 = t0 || t; const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * p); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); io2.unobserve(e.target); } }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => io2.observe(el));
} else {
  document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
}

// Portfolio filter
const btns = document.querySelectorAll('.filters button'), projs = document.querySelectorAll('.proj');
btns.forEach(b => b.addEventListener('click', () => {
  btns.forEach(x => x.classList.remove('on')); b.classList.add('on');
  projs.forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.cat !== b.dataset.f));
}));

// Contact form validation
const form = document.getElementById('form'), ok = document.getElementById('ok');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  phone: v => /^[+\d][\d\s-]{8,}$/.test(v.trim()) || 'Enter a valid phone number, e.g. +254 712 345 678.',
  projectType: v => v !== '' || 'Select the type of website you need.',
  budget: v => v !== '' || 'Select a budget or choose “I’m not sure”.',
  timeline: v => v !== '' || 'Select your preferred timeframe.',
  msg: v => v.trim().length >= 10 || 'Tell us a little about your project (at least 10 characters).'
};
if (form && ok) {
  form.addEventListener('submit', e => {
    let valid = true; ok.hidden = true;
    Object.keys(rules).forEach(id => {
      const f = document.getElementById(id), msg = form.querySelector(`[data-for="${id}"]`);
      if (!f || !msg) return;
      const r = rules[id](f.value);
      msg.textContent = r === true ? '' : r; f.classList.toggle('bad', r !== true); if (r !== true) valid = false;
    });
    if (!valid) {
      e.preventDefault();
      form.querySelector('.bad')?.focus();
    }
  });
}

// Social media quote message prefill
const socialQuote = document.getElementById('social-quote');
const socialMessage = document.getElementById('msg');
if (socialQuote && socialMessage) {
  socialQuote.addEventListener('click', () => {
    socialMessage.value = "I'm interested in social media management for my business.";
  });
}

const backTop = document.querySelector('.back-top');
if (backTop) {
  backTop.addEventListener('click', event => {
    event.preventDefault();
    const root = document.documentElement;
    const scrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    root.style.scrollBehavior = scrollBehavior;
  });
}
