// src/animations/index.js
import heroAnimation from './hero.js';
import { initParallax } from './parallax.js';
import textReveal from './textEffects.js';
import initMarquee from './marquee.js';
import initIcebergMarquee from './marquee.js';
import { initShowcase } from './showcase.js';
import { initAllwakeCarousel } from './allwake-carousel.js';

export function initAnimations() {
  heroAnimation();
  initParallax();
  textReveal();
  initMarquee();
  initIcebergMarquee();
  initShowcase();
  initAllwakeCarousel();
}
