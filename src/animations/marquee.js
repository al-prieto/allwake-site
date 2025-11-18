// src/animations/marquee.js

export default function initIcebergMarquee() {
  const container = document.querySelector('.blur-sentence');
  if (!container) return;

  // Respect user motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const originalSentence = container.querySelector('.blur-sentence__sentence');
  if (!originalSentence) return;

  // Split text into characters for ICEBERG-style animation
  const wrapCharsInSpans = (element) => {
    const chars = element.textContent
      .split('')
      .map(
        (char, i) =>
          `<span class="char" style="--i:${i}">${
            char === ' ' ? '&nbsp;' : char
          }</span>`
      );
    element.innerHTML = chars.join('');
  };

  // Create seamless repeating content (3 copies for smooth loop)
  const baseText = originalSentence.textContent.trim().replace(/\s+/g, ' ');
  originalSentence.textContent = Array(3).fill(baseText).join(' ');
  wrapCharsInSpans(originalSentence);

  // Activar blur después de 1.5s
  setTimeout(() => originalSentence.classList.add('is-animated'), 1500);

  // Configuración de velocidad según viewport
  const getLoopDuration = () => {
    const vw = window.innerWidth;
    if (vw >= 1440) return 36;
    if (vw >= 1024) return 32;
    if (vw >= 768) return 24;
    return 12;
  };

  let animationId;
  let currentX;

  const animate = () => {
    const containerWidth = container.offsetWidth;
    const sentenceWidth = originalSentence.scrollWidth;
    const oneThirdWidth = sentenceWidth / 3;

    if (!oneThirdWidth || !isFinite(oneThirdWidth)) return;

    const speed = oneThirdWidth / getLoopDuration();
    currentX = containerWidth;

    const tick = () => {
      currentX -= speed / 60;

      if (currentX <= -oneThirdWidth) {
        currentX += oneThirdWidth;
      }

      originalSentence.style.transform = `translateX(${currentX}px)`;
      animationId = requestAnimationFrame(tick);
    };

    tick();
  };

  // Start animation when fonts are ready
  const startAnimation = () => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(animate).catch(animate);
    } else {
      animate();
    }
  };

  startAnimation();

  // Handle resize con debounce optimizado
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      animate();
    }, 150);
  };

  window.addEventListener('resize', handleResize, { passive: true });

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  };
}
