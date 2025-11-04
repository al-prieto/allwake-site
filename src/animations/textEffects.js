// src/animations/textEffects.js
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function textReveal() {
  /* ---------------------------------------------
     SplitText reveal for .main-text (scroll-scrub)
     --------------------------------------------- */
  let split, tl;

  const createTextReveal = () => {
    // cleanup previous instances
    if (split) split.revert();
    if (tl) tl.revert();

    // wrap words & chars
    split = new SplitText('.main-text', {
      type: 'words,chars',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    });

    // timeline driven by scroll (scrub)
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-two',
        start: 'top center',
        end: '80% bottom',
        scrub: 1,
        pin: false,
        // markers: true,
      },
    });

    // initial state
    gsap.set(split.chars, { color: 'rgba(51, 51, 51, 0.3)' });

    // per-char color reveal
    tl.to(split.chars, {
      color: 'var(--clr-text-dark)',
      duration: 0.02,
      stagger: { amount: 1, from: 'start' },
      ease: 'none',
    });
  };

  createTextReveal();

  /* ---------------------------------------------
     Background headline (THE / VISION)
     - decoupled from scroll (no scrub)
     - scroll only triggers play/reverse
     --------------------------------------------- */
  const bgLines = gsap.utils.toArray('.bg-headline .bg-line');
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (bgLines.length) {
    // paused timeline: defines HOW it animates
    const bgTl = gsap.timeline({ paused: true });

    if (prefersReduced) {
      // accessibility: set final state without motion
      bgTl.set(bgLines, { opacity: (i) => (i === 0 ? 0.05 : 0.07) });
    } else {
      bgTl.fromTo(
        bgLines,
        { opacity: 0, y: 30, scale: 1.05, filter: 'blur(8px)' }, // from
        {
          opacity: (i) => (i === 0 ? 0.1 : 0.12), // to
          y: 0,
          scale: 1,
          filter: 'blur(1px)',
          ease: 'expo.out',
          duration: 2.2,
          stagger: 0.12, // THE slightly before VISION
        }
      );
    }

    // ScrollTrigger: defines WHEN it animates
    ScrollTrigger.create({
      trigger: '.section-two',
      start: '85% bottom',
      end: 'bottom bottom',
      toggleActions: 'play none none reverse', // down=play once, up=reverse
      animation: bgTl,
      // markers: true,
    });
  }

  /* ---------------------------------------------
     Resize handling (recompute SplitText safely)
     --------------------------------------------- */
  const debouncer = gsap.delayedCall(0.2, createTextReveal).pause();
  const handleResize = () => debouncer.restart(true);
  window.addEventListener('resize', handleResize);

  /* ---------------------------------------------
     Cleanup
     --------------------------------------------- */
  return () => {
    if (split) split.revert();
    if (tl) tl.revert();
    window.removeEventListener('resize', handleResize);
    debouncer.kill();
  };
}
