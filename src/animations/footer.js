import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initFooter() {
  const footer = document.querySelector('.aw-footer');
  if (!footer) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footer,
      start: 'top bottom',
      end: 'top 70%',
      scrub: 0.6,
    },
  });

  tl.from('.aw-footer__logo span', {
    yPercent: 10,
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power2.out',
  }).from('.aw-footer__bar', { autoAlpha: 0, duration: 0.4 }, '-=0.2');
}
