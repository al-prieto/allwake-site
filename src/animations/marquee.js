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
  const speed = 260; // px/sec

  function animate() {
    const sentence = container.querySelector('.blur-sentence__sentence');
    if (!sentence) return;

    const containerWidth = container.offsetWidth;
    const sentenceWidth = sentence.scrollWidth;
    const oneThirdWidth = sentenceWidth / 3; // width of one repetition

    // Start from right edge, move to left
    let currentX = containerWidth;

    function tick() {
      currentX -= speed / 60; // 60fps approximation

      // When one full repetition has passed, reset position
      if (currentX <= -oneThirdWidth) {
        currentX += oneThirdWidth; // jump back by one repetition width
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
