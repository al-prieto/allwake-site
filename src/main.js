// src/main.js
import './styles/tokens.css';
import './styles/hero.css';
import './styles/section-two.css';
import './styles/marquee.css';
import './styles/section-showcase.css';
import './styles/allwake-carousel.css';
import './styles/scroll-lines.css';
import './styles/rays.css';
import './styles/footer.css';
import './styles/nav.css';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initAnimations } from './animations/index.js';

gsap.registerPlugin(ScrollTrigger);

// 1. Optimización clave para iOS
ScrollTrigger.config({
  ignoreMobileResize: true,
});

// 2. Inicializar Lenis
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: true,
  touchMultiplier: 1.5,
  infinite: false,
});

// --- CAMBIO NUEVO AQUÍ ---
// Hacemos Lenis global para poder activarlo desde hero.js
window.lenis = lenis;

// Detenemos el scroll INMEDIATAMENTE al cargar
lenis.stop();
// -------------------------

// 3. Sincronización Lenis + GSAP
gsap.ticker.remove(gsap.ticker.lagSmoothing);

function raf(time) {
  lenis.raf(time * 1000);
}
gsap.ticker.add(raf);

// Opcional: ayuda a que ScrollTrigger no pelee con Lenis
ScrollTrigger.normalizeScroll(false);

// 4. Init
document.addEventListener('DOMContentLoaded', () => {
  document.fonts.ready.then(() => {
    initAnimations();
    gsap.delayedCall(0.5, () => {
      ScrollTrigger.refresh();
    });
  });
});
