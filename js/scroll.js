document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  targets.forEach(el => observer.observe(el));
});