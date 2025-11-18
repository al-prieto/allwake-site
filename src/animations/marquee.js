// src/animations/marquee.js

export default function initIcebergMarquee() {
  const container = document.querySelector('.blur-sentence');
  if (!container) return;

  // Respect user motion preferences
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReduced) return;

  // Split text into characters for ICEBERG-style animation
  function wrapCharsInSpans(element) {
    const text = element.textContent;
    const chars = text
      .split('')
      // ⚠️ NUEVO: agregamos un índice --i a cada letra para escalonar con CSS
      .map((char, i) => {
        if (char === ' ')
          return `<span class="char" style="--i:${i}">&nbsp;</span>`;
        return `<span class="char" style="--i:${i}">${char}</span>`;
      })
      .join('');
    element.innerHTML = chars;
  }

  // Create seamless repeating content (3 copies for smooth loop)
  function createSeamlessContent(originalText, repetitions = 3) {
    const clean = originalText.trim().replace(/\s+/g, ' ');
    const sep = ' '; // space between repetitions
    return Array(repetitions).fill(clean).join(sep);
  }

  // Get the original text before modifying
  const originalSentence = container.querySelector('.blur-sentence__sentence');
  if (!originalSentence) return;

  const baseText = originalSentence.textContent;
  const seamlessText = createSeamlessContent(baseText, 3);

  // Replace content with seamless version
  originalSentence.textContent = seamlessText;
  wrapCharsInSpans(originalSentence);
  // NO agregamos 'is-animated' aquí

  // Activar blur después de X segundos (ajusta este valor)
  requestAnimationFrame(() => {
    setTimeout(() => {
      originalSentence.classList.add('is-animated');
    }, 1500);
  });

  let animationId;
  // const speed = 260; // px/sec

  function animate() {
    const sentence = container.querySelector('.blur-sentence__sentence');
    if (!sentence) return;

    const containerWidth = container.offsetWidth;
    const sentenceWidth = sentence.scrollWidth;
    const oneThirdWidth = sentenceWidth / 3; // ancho de una repetición

    if (!oneThirdWidth || !isFinite(oneThirdWidth)) return;

    // ⏱️ Duración del loop según viewport
    const vw = window.innerWidth;
    let loopDuration; // en segundos

    if (vw >= 1440) {
      loopDuration = 36; // desktop grande: más lento
    } else if (vw >= 1024) {
      loopDuration = 32; // laptop / desktop medio
    } else if (vw >= 768) {
      loopDuration = 24; // tablet
    } else {
      loopDuration = 16; // mobile más ágil
    }

    // px/segundo según ancho del texto y duración deseada
    const speed = oneThirdWidth / loopDuration;

    // Empezamos desde el borde derecho del contenedor
    let currentX = containerWidth;

    function tick() {
      currentX -= speed / 60; // 60fps aprox

      // Cuando pasó una repetición completa, reseteamos
      if (currentX <= -oneThirdWidth) {
        currentX += oneThirdWidth;
      }

      sentence.style.transform = `translateX(${currentX}px)`;
      animationId = requestAnimationFrame(tick);
    }

    tick();
  }

  // Wait for fonts and start animation
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();
  fontsReady
    .then(() => {
      animate();
    })
    .catch(() => {
      animate(); // fallback
    });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animate(); // restart animation with new measurements
      }
    }, 100);
  });

  // Cleanup function
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    clearTimeout(resizeTimeout);
  };
}
