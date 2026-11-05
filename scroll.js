document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll(
    '.section-head, .card, .logistics-steps .step, .about-media, .partners-box, .contact-list, .contact-form, .stat-row > div, .values .value-item'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));

  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.main-nav a[href="#' + id + '"]');
      if (!link) return;
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach((s) => navObserver.observe(s));
});
