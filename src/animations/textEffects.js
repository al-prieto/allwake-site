// src/animations/textEffects.js
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function textReveal() {
  let split, tl;
  const target = document.querySelector('.main-text');

  // Función principal de creación
  const createTextReveal = () => {
    if (!target) return;

    // 1. Limpieza previa
    if (split) split.revert();
    if (tl) tl.kill();

    // 2. Configuración robusta para iOS
    split = new SplitText(target, {
      type: 'words,chars',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      tag: 'span', // <--- IMPORTANTE: Usar span evita que iOS lo trate como bloque
    });

    // 3. Timeline
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-two',
        start: 'top center',
        end: '80% bottom',
        scrub: 1,
        pin: false,
      },
    });

    // Estado inicial de la animación
    gsap.set(split.chars, { color: 'rgba(51, 51, 51, 0.3)' });

    // Animación
    tl.to(split.chars, {
      color: 'var(--clr-text-dark)',
      duration: 0.02,
      stagger: { amount: 1, from: 'start' },
      ease: 'none',
    });

    // 4. LA REVELACIÓN: Solo mostramos el texto cuando GSAP terminó de calcular
    requestAnimationFrame(() => {
      target.classList.add('is-ready');
    });
  };

  /* ---------------------------------------------
     Inicialización Segura
     --------------------------------------------- */
  const init = () => {
    // Esperamos un frame extra para asegurar que el layout CSS se asentó
    requestAnimationFrame(() => {
      createTextReveal();
      ScrollTrigger.refresh();
    });
  };

  // Esperar a que las fuentes carguen es OBLIGATORIO para SplitText
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }

  /* ---------------------------------------------
     Background headline (THE / VISION)
     (Tu código original, sin cambios)
     --------------------------------------------- */
  const bgLines = gsap.utils.toArray('.bg-headline .bg-line');
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (bgLines.length) {
    const bgTl = gsap.timeline({ paused: true });
    if (prefersReduced) {
      bgTl.set(bgLines, { opacity: (i) => (i === 0 ? 0.05 : 0.07) });
    } else {
      bgTl.fromTo(
        bgLines,
        { opacity: 0, y: 30, scale: 1.05, filter: 'blur(8px)' },
        {
          opacity: (i) => (i === 0 ? 0.1 : 0.12),
          y: 0,
          scale: 1,
          filter: 'blur(1px)',
          ease: 'expo.out',
          duration: 2.2,
          stagger: 0.12,
        }
      );
    }
    ScrollTrigger.create({
      trigger: '.section-two',
      start: '85% bottom',
      end: 'bottom bottom',
      toggleActions: 'play none none reverse',
      animation: bgTl,
    });
  }

  /* ---------------------------------------------
     Resize Handling Mejorado
     --------------------------------------------- */
  // Ignoramos cambios de resize verticales pequeños (típicos de barra de navegación móvil)
  let lastWidth = window.innerWidth;

  const handleResize = () => {
    const newWidth = window.innerWidth;
    // Solo regeneramos si cambió el ancho (rotación o cambio real de tamaño)
    if (newWidth !== lastWidth) {
      lastWidth = newWidth;
      // Ocultamos momentáneamente para recalcular sin glitches
      if (target) target.classList.remove('is-ready');

      clearTimeout(debouncer);
      debouncer = setTimeout(() => {
        createTextReveal();
      }, 250);
    } else {
      // Si es solo cambio de altura (barra nav), solo refrescamos triggers
      ScrollTrigger.refresh();
    }
  };

  let debouncer;
  window.addEventListener('resize', handleResize);

  /* ---------------------------------------------
     Cleanup
     --------------------------------------------- */
  return () => {
    if (split) split.revert();
    if (tl) tl.kill();
    window.removeEventListener('resize', handleResize);
    clearTimeout(debouncer);
  };
}
