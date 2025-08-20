// src/animations/index.js
import heroAnimation from './hero.js';
import { initParallax } from './parallax.js';

// import textReveal from './textReveal.js';

export function initAnimations() {
  heroAnimation();
  initParallax();
  // textReveal();
}
