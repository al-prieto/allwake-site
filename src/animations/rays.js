// src/animations/rays.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

export function initRays() {
  const section = document.querySelector('#rays');
  if (!section) return;

  const mainText = section.querySelector('[data-split-words]');

  // SplitText con limpieza automática
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
      scrub: 0.5, // Scrub más rápido para evitar sensación de "arrastre"
      markers: false,
    },
    defaults: {
      force3D: true,
      ease: 'power1.out',
    },
  });

  // Texto
  tl.from(
    words,
    {
      autoAlpha: 0, // Combina opacity + visibility (Optimización clave)
      y: 30, // Usar Y en lugar de scale reduce el repintado
      duration: 0.8,
      stagger: 0.05,
    },
    0
  );

  tl.from(
    words,
    {
      xPercent: 40,
      rotation: 0.01, // Truco anti-aliasing
      duration: 0.8,
      stagger: 0.05,
    },
    0
  );

  // Fondo (Rayos)
  if (bg) {
    tl.to(
      bg,
      {
        autoAlpha: 1, // Mejor que opacity
        scale: 1,
        duration: 0.5,
      },
      0.1
    );
  }

  // Monedas
  if (coins) {
    tl.to(
      coins,
      {
        autoAlpha: 1,
        scale: 1.05,
        y: -20, // Añadir movimiento vertical ligero ayuda a la percepción de paralaje
        rotation: 5, // Rotación fija es más barata que random() en el scrub
        duration: 0.6,
      },
      0.2
    );
  }

  // Sticker
  if (sticker) {
    tl.from(
      sticker,
      {
        scale: 0.5,
        autoAlpha: 0,
        rotation: -15,
        duration: 0.6,
      },
      0.4
    );
  }
}
