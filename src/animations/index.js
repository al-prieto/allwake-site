// src/animations/index.js
import heroAnimation from './hero.js';
import { initParallax } from './parallax.js';

import textReveal from './textEffects.js';

export function initAnimations() {
  heroAnimation();
  initParallax();
  textReveal();
}
