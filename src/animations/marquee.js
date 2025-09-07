// src/animations/marquee.js
import { gsap } from 'gsap';

export default function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  // Respect user motion preferences
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReduced) return;

  let tl;
  const SPEED = 240; // pixels per second (increase for faster marquee)

  // Create seamless text manually with full control over spacing
  function createSeamlessText(originalText, repetitions = 3) {
    // Clean original text - total control over spaces
    const cleanText = originalText
      .trim()
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .replace(/\u00A0+/g, ' ') // Convert &nbsp; to regular spaces
      .replace(/\u2022\s+/g, '\u2022 ') // Only ONE space after bullet
      .replace(/\s+/g, ' ') // Final cleanup
      .trim();

    // Create controlled separator between repetitions
    const separator = ' '; // ONE single space - total control

    // Generate repeated text
    return Array(repetitions).fill(cleanText).join(separator);
  }

  // Turn text into <span class="marquee__char">X</span>
  function splitIntoChars(text, container) {
    const frag = document.createDocumentFragment();

    let i = 0;
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'marquee__char';
      // Preserve spaces visually
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      // Wave delay: grows per character
      span.style.animationDelay = `${i * 0.08}s`;
      frag.appendChild(span);
      i++;
    }

    container.appendChild(frag);
  }

  // Measure one "cycle": width equivalent to one repetition
  const getStep = () => {
    const container = track.querySelector('.marquee__text');
    if (!container) return 0;

    // Calculate width of one repetition based on total text
    const totalWidth = container.getBoundingClientRect().width;
    const repetitions = 3; // Same number used in createSeamlessText
    const oneRepetitionWidth = totalWidth / repetitions;

    return Math.round(oneRepetitionWidth);
  };

  function prepareContent(trackEl) {
    // Get original text from first element
    const originalElement = trackEl.querySelector('.marquee__text');
    if (!originalElement) return;

    const originalText = originalElement.textContent;

    // Create seamless text
    const seamlessText = createSeamlessText(originalText, 3);

    // Clean track and create single container
    trackEl.innerHTML = '';
    const newContainer = document.createElement('p');
    newContainer.className = 'marquee__text';
    newContainer.setAttribute('data-chars-ready', 'true');

    // Apply seamless text and split into characters
    trackEl.appendChild(newContainer);
    splitIntoChars(seamlessText, newContainer);
  }

  // Build animation
  const build = () => {
    try {
      if (tl) tl.kill();

      prepareContent(track);

      // Baseline state and promote to compositor
      gsap.set(track, { x: 0, force3D: true, transformOrigin: '0 50%' });

      const distance = getStep();
      if (!distance) return;

      const duration = distance / SPEED;

      // Infinite loop with smooth wrapping
      tl = gsap.to(track, {
        x: `-=${distance}`,
        duration,
        ease: 'none',
        repeat: -1,
        force3D: true,
        modifiers: {
          // Keep x wrapped in the range [-distance, 0)
          x: (val) => {
            const n = parseFloat(val);
            const d = -distance;
            const wrapped = ((n % d) + d) % d;
            return `${wrapped}px`;
          },
        },
      });
    } catch (error) {
      console.error('Marquee animation error:', error);
    }
  };

  // Wait for web fonts so measurements are accurate
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();

  // Rebuild on resize (debounced)
  const debounced = gsap
    .delayedCall(0.25, () => {
      fontsReady.then(build);
    })
    .pause();

  const onResize = () => debounced.restart(true);

  // Initial build and setup
  fontsReady.then(build).catch(() => {
    // Fallback if font loading fails
    build();
  });

  window.addEventListener('resize', onResize);

  // Cleanup hook
  return () => {
    if (tl) tl.kill();
    window.removeEventListener('resize', onResize);
    debounced.kill();
  };
}
