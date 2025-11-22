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

// 1. Optimización CLAVE para iOS: Evita recálculos al mover la barra de dirección
ScrollTrigger.config({
  ignoreMobileResize: true,
});

// 2. Inicializar Lenis con configuración Mobile
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: true, // Activo para unificar la física en iOS/Android
  touchMultiplier: 1.5,
  infinite: false,
});

// 3. Sincronización Perfecta (Lenis + GSAP)
function raf(time) {
  lenis.raf(time * 1000); // GSAP da segundos, Lenis necesita ms
}

// Añadimos Lenis al ticker de GSAP (un solo corazón latiendo)
gsap.ticker.add(raf);

// RECOMENDADO: Asegura que ScrollTrigger se entere inmediatamente del scroll
lenis.on('scroll', ScrollTrigger.update);

// Desactivamos la normalización nativa de ScrollTrigger para que Lenis mande
ScrollTrigger.normalizeScroll(false);

// 4. Inicialización
document.addEventListener('DOMContentLoaded', () => {
  document.fonts.ready.then(() => {
    initAnimations();

    // Refresco final con un pequeño delay para asegurar que el layout está listo
    gsap.delayedCall(0.5, () => {
      ScrollTrigger.refresh();
    });
  });
});
