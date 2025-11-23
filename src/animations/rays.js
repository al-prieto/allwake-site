// src/animations/rays.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

export function initRays() {
  const section = document.querySelector('#rays');
  if (!section) return;

  const mainText = section.querySelector('[data-split-words]');

  // Creamos SplitText
  const split = new SplitText(mainText, { type: 'words', wordsClass: 'word' });
  const words = split.words;

  const bg = section.querySelector('.rays__bg');
  const coins = section.querySelector('.rays__coins');
  const sticker = section.querySelector('.rays__sticker');
  const scene = section.querySelector('.rays__art');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: 'top 80%',
      end: 'bottom 90%',
      scrub: 0.8, // Scrub suave
      markers: false,
    },
    defaults: {
      force3D: true, // ⚡ CRÍTICO: Obliga a usar la GPU
      ease: 'power1.out',
    },
  });

  // Texto principal
  tl.from(
    words,
    {
      scale: 0.8, // Menos cambio de escala reduce el repintado
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'expo.out',
      delay: 0.2, // Empezar un pelín antes
    },
    0
  );

  tl.from(
    words,
    {
      xPercent: 60, // Reduje el movimiento para que sea menos costoso
      rotation: 0.01, // ⚡ Truco para forzar suavizado de bordes en GPU
      duration: 0.8,
      stagger: 0.05,
      ease: 'elastic.out(1, 0.75)',
    },
    0
  );

  // Rayos (Background)
  if (bg) {
    tl.to(
      bg,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.2
    );
  }

  // Monedas
  if (coins) {
    tl.to(
      coins,
      {
        opacity: 1,
        scale: 1.05,
        rotation: () => gsap.utils.random(-10, 10), // Menos rotación aleatoria
        duration: 0.6,
        ease: 'elastic.out(1, 0.7)',
      },
      0.3
    );
  }

  // Sticker
  if (sticker) {
    tl.from(
      sticker,
      {
        scale: 0,
        rotation: () => gsap.utils.random(-30, 30),
        duration: 0.6,
        ease: 'elastic.out(1, 0.75)',
      },
      0.5
    );
  }

  const mm = gsap.matchMedia();
  mm.add('(max-width: 900px)', () => {
    // Optimizaciones extra para móvil si fuera necesario
  });

  // Limpieza opcional al desmontar si usas frameworks SPA
  // return () => { split.revert(); tl.kill(); }
}
