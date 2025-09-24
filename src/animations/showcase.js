// src/animations/showcase.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initShowcase() {
  const section = document.querySelector('#showcase');
  if (!section) return;

  const row = section.querySelector('.l-circles');
  if (!row) return;

  const dots = Array.from(row.querySelectorAll('.dot'));
  gsap.set(dots, { scaleX: 1, scaleY: 0, transformOrigin: '50% 50%' });

  gsap.to(dots, {
    scaleY: 1,
    duration: 0.5,
    ease: 'back.out(3)',
    stagger: { each: -0.2, from: 'center' }, // como el inspo
    scrollTrigger: {
      trigger: row,
      start: 'top bottom',
      end: 'bottom 50%',
      scrub: true,
    },
  });
}
