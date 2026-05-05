const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  navLinks?.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const counters = document.querySelectorAll('.counter');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 80));

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = `${target}+`;
        return;
      }
      el.textContent = `${current}+`;
      requestAnimationFrame(tick);
    };

    tick();
    obs.unobserve(el);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => observer.observe(counter));
