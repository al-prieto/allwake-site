// src/animations/parallax.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  const heroImgs = document.querySelector('.hero-imgs');
  const heroCopy = document.querySelector('.hero-copy');

  if (!heroImgs) return;

  // Configuración inicial
  gsap.set(heroImgs, {
    scale: 1.3,
    transformOrigin: '50% 50%',
    force3D: true,
  });

  // --- ANIMACIÓN 1: ZOOM OUT (Con Smoothness) ---
  gsap.to(heroImgs, {
    scale: 1,
    // 'power1.out' hace que arranque un poquito más rápido y frene suave
    ease: 'power1.out',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '100vh top',

      // --- AQUÍ ESTÁ LA MAGIA ---
      // En lugar de 'true', ponemos un número (segundos de suavizado).
      // Esto desacopla la animación del dedo y le da "peso".
      scrub: 1.5,

      invalidateOnRefresh: true,
    },
  });

  // --- ANIMACIÓN 2: FADE OUT DEL TEXTO ---
  if (heroCopy) {
    gsap.to(heroCopy, {
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'none', // El texto se ve mejor si responde rápido
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '50vh top',
        scrub: true, // Dejamos el texto 1:1 para que no se sienta "laggy" al leer
      },
    });
  }
}
