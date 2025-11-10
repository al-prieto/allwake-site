// parallax.js - Versión con timeline + scrub (sin saltos)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  // Evitar scroll horizontal
  gsap.set('html, body', { overflowX: 'hidden' });

  const hero = document.querySelector('.hero');
  const heroImgs = document.querySelector('.hero-imgs');
  const sectionTwo = document.querySelector('.section-two');
  const heroCopy = document.querySelector('.hero-copy');

  if (!hero || !sectionTwo) {
    console.warn('Hero o Section Two no encontrados');
    return;
  }

  // Estado inicial coherente con la intro
  gsap.set(hero, { transformOrigin: 'center center', overflow: 'hidden' });
  gsap.set(heroImgs, {
    scale: 1.3, // la intro termina en 1.3
    transformOrigin: '50% 50%',
    force3D: true,
    willChange: 'transform',
  });

  // Timeline del parallax (y + scale) controlado por scroll
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to(hero, { y: -50 }, 0).fromTo(
    heroImgs,
    { scale: 1.3 },
    { scale: 1, immediateRender: false, force3D: true },
    0
  );

  const parallaxTrigger = ScrollTrigger.create({
    trigger: sectionTwo,
    start: 'top bottom',
    end: 'bottom top',
    pin: hero,
    pinSpacing: false,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    animation: tl,
    // markers: true,
  });

  // Blur + fade del copy del hero durante el scroll
  const blurTrigger = ScrollTrigger.create({
    trigger: sectionTwo,
    start: 'top bottom',
    end: 'top center',
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(heroCopy, {
        opacity: 1 - p,
        filter: `blur(${p * 10}px)`,
      });
    },
  });

  // Refresh estable en resize
  const handleResize = () => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };
  window.addEventListener('resize', handleResize);

  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    parallaxTrigger.kill();
    blurTrigger.kill();
    tl.kill();
  };
}

// Opcional: utilitario de debug
export function debugScrollIssues() {
  const checkOverflow = () => {
    const { body, documentElement: html } = document;
    console.log(
      'Body scrollWidth/clientWidth:',
      body.scrollWidth,
      body.clientWidth
    );
    console.log(
      'HTML scrollWidth/clientWidth:',
      html.scrollWidth,
      html.clientWidth
    );
    if (body.scrollWidth > body.clientWidth)
      console.warn('⚠️ Body tiene scroll horizontal');
    if (html.scrollWidth > html.clientWidth)
      console.warn('⚠️ HTML tiene scroll horizontal');
  };
  checkOverflow();
  window.addEventListener('resize', checkOverflow);
}
