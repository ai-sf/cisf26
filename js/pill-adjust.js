(function() {
  const GAP = parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue('--pill-gap')) || 16;
  const PD = parseFloat(getComputedStyle(document.documentElement)
               .getPropertyValue('--pill-padding')) || 16;

  function adjustPillImages() {
    // Applichiamo solo se la viewport è ≤768px
    if (window.innerWidth > 768) {
      // Rimuovo eventuali variabili inlining lasciate dal passaggio precedente
      document.querySelectorAll('.pill').forEach(pill => {
        pill.style.removeProperty('--pill-img-max-h');
      });
      return;
    }

    const viewportH = window.innerHeight;

    document.querySelectorAll('.pill').forEach(pill => {
      // 1) Limita l'altezza totale della pill all'80% del viewport se vuoi
      const maxPillH = viewportH * 0.8;
      pill.style.maxHeight = maxPillH + 'px';

      // 2) Calcola il “netto” interno
      const innerH = pill.clientHeight - PD * 2 - GAP;

      // 3) Metà di quell'altezza: immagine
      const maxImgH = innerH / 2;

      // 4) Passo il valore a CSS
      pill.style.setProperty('--pill-img-max-h', maxImgH + 'px');
    });
  }

  window.addEventListener('DOMContentLoaded', adjustPillImages);
  window.addEventListener('resize', adjustPillImages);
})();

document.querySelectorAll('.flip-container').forEach(container => {
  container.addEventListener('click', () => {
    container.classList.toggle('flipped');
  });
});