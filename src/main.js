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
import { initRays } from './animations/rays.js';

gsap.registerPlugin(ScrollTrigger);

// Inicializar Lenis (smooth scrolling)
const lenis = new Lenis({
  lerp: 0.1, // suavidad del scroll (0.1 = muy suave, 0.3 = más rápido)
  wheelMultiplier: 1, // sensibilidad del scroll
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false, // desactiva smooth scroll en móvil
});

// Conectar Lenis con GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // convierte de seconds a milliseconds
});

gsap.ticker.lagSmoothing(0);

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que las fuentes estén cargadas
  document.fonts.ready.then(() => {
    initAnimations();

    // Refresh ScrollTrigger después de que todo esté listo
    gsap.delayedCall(0.5, () => {
      ScrollTrigger.refresh();
    });
  });
});
