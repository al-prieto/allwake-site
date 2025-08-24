// src/animations/textEffects.js
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function textReveal() {
  let split, tl;

  const createTextReveal = () => {
    // Limpieza previa
    if (split) split.revert();
    if (tl) tl.revert();

    // 👉 Envolvemos palabras y chars
    split = new SplitText('.main-text', {
      type: 'words,chars',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    });

    // Timeline con ScrollTrigger
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-two',
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
        pin: false,
        // markers: true
      },
    });

    // Estado inicial
    gsap.set(split.chars, {
      color: 'rgba(51, 51, 51, 0.3)',
    });

    // Animación
    tl.to(split.chars, {
      color: 'var(--clr-text-dark)',
      duration: 0.02,
      stagger: { amount: 1, from: 'start' },
      ease: 'none',
    });
  };

  createTextReveal();

  const debouncer = gsap.delayedCall(0.2, createTextReveal).pause();
  const handleResize = () => debouncer.restart(true);
  window.addEventListener('resize', handleResize);

  return () => {
    if (split) split.revert();
    if (tl) tl.revert();
    window.removeEventListener('resize', handleResize);
    debouncer.kill();
  };
}
