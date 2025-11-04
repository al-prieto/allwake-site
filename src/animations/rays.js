// ALLWAKE RAYS SECTION
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

export function initRays() {
  const section = document.querySelector('#rays');
  if (!section) return;

  const mainText = section.querySelector('[data-split-words]');
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
      scrub: 0.8,
      markers: false,
    },
  });

  // Texto principal
  tl.from(
    words,
    {
      scale: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'expo.out',
      delay: 0.6,
    },
    0.6
  );

  tl.from(
    words,
    {
      xPercent: 100,
      rotate: 0.001,
      duration: 0.8,
      stagger: 0.05,
      ease: 'elastic.out(1, 0.75)',
    },
    0.2
  );

  // Rayos
  tl.to(
    bg,
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.4,
    },
    0.8
  );

  // Monedas
  tl.to(
    coins,
    {
      opacity: 1,
      scale: 1.05,
      rotation: gsap.utils.random(-15, 15),
      duration: 0.6,
      ease: 'elastic.out(1, 0.7)',
      delay: 0.4,
    },
    1.05
  );

  // Sticker
  tl.from(
    sticker,
    {
      scale: 0,
      rotation: gsap.utils.random(-45, 45),
      // xPercent: gsap.utils.random(-30, 30),
      // yPercent: gsap.utils.random(-30, 30),
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
      delay: 0.4,
    },
    1.5
  );
  const mm = gsap.matchMedia();
  mm.add('(max-width: 900px)', () => {
    // puedes ajustar easings/durations sólo para mobile si ves necesario
    // p.ej. tl.timeScale(1.2);
  });
}
