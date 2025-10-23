// src/animations/nav.js
import { gsap } from 'gsap';

export default function navAnimation() {
  // =========================
  // Animación nav inicial
  // =========================
  gsap.set('nav', { y: -150 });

  // =========================
  // Aparece el nav
  // =========================
  gsap.to('nav', {
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 11,
  });
}
