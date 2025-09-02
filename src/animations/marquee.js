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

  // Measure one "step": width of the first text + its right margin
  const getStep = () => {
    const el = track.querySelector('.marquee__text');
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const mr = parseFloat(getComputedStyle(el).marginRight) || 0;
    return Math.round(rect.width + mr);
  };

  const build = () => {
    if (tl) tl.kill();

    // Baseline state and promote to compositor
    gsap.set(track, { x: 0, force3D: true, transformOrigin: '0 50%' });

    const distance = getStep();
    if (!distance) return;

    const duration = distance / SPEED;

    // Infinite loop with smooth wrapping (no hard reset)
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
  };

  // Wait for web fonts so measurements are accurate (prevents first-cycle jump)
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();
  fontsReady.then(build);

  // Rebuild on resize (debounced)
  const debounced = gsap
    .delayedCall(0.25, () => {
      fontsReady.then(build);
    })
    .pause();

  const onResize = () => debounced.restart(true);
  window.addEventListener('resize', onResize);

  // Cleanup hook (optional if you ever unmount)
  return () => {
    if (tl) tl.kill();
    window.removeEventListener('resize', onResize);
    debounced.kill();
  };
}
