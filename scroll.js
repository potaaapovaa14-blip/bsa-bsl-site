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

  const form = document.getElementById('contact-form');
  if (form) {
    const isRu = form.dataset.lang !== 'en';
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultLabel = submitBtn.textContent;
    const msgs = isRu
      ? { sending: 'Отправка…', ok: 'Спасибо! Сообщение отправлено.', fail: 'Не удалось отправить. Попробуйте написать на info@bsa-bsl.ru' }
      : { sending: 'Sending…', ok: 'Thank you! Your message has been sent.', fail: 'Something went wrong. Please email info@bsa-bsl.ru directly.' };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };
      submitBtn.disabled = true;
      submitBtn.textContent = msgs.sending;
      statusEl.textContent = '';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) throw new Error('bad response');
          statusEl.textContent = msgs.ok;
          statusEl.style.color = 'var(--gold-light)';
          form.reset();
        })
        .catch(() => {
          statusEl.textContent = msgs.fail;
          statusEl.style.color = '#c0392b';
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        });
    });
  }
});
