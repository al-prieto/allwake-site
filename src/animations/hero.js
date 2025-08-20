// src/animations/hero.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import img1 from '@/assets/img1.jpg';
import img2 from '@/assets/img2.jpg';
import img3 from '@/assets/img3.jpg';
import img4 from '@/assets/img4.jpg';
import img5 from '@/assets/img5.jpg';
import img6 from '@/assets/img6.jpg';
import img7 from '@/assets/img7.jpg';

export default function heroAnimation() {
  // Inyectar imágenes del hero
  const pics = [img1, img2, img3, img4, img5, img6, img7];
  const hero = document.querySelector('.hero-imgs');
  if (hero && pics.length) {
    pics.forEach((src) => {
      const el = document.createElement('img');
      el.src = src;
      hero.appendChild(el);
    });
  }

  // Animación nav inicial
  gsap.set('nav', { y: -150 });

  // Contadores
  const digit1 = document.querySelector('.digit-1');
  const digit2 = document.querySelector('.digit-2');
  const digit3 = document.querySelector('.digit-3');

  // Utilidad: dividir texto en spans
  function splitTextIntoSpans(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    const text = element.innerText;
    const splitText = text
      .split('')
      .map((char) => `<span>${char}</span>`)
      .join('');
    element.innerHTML = splitText;
  }

  // H1 del hero
  splitTextIntoSpans('.copy-left h1');

  // Generar dígitos para tercer contador
  if (digit3) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 10; j++) {
        const div = document.createElement('div');
        div.className = 'num';
        div.textContent = j;
        digit3.appendChild(div);
      }
    }
    const finalDigit = document.createElement('div');
    finalDigit.className = 'num';
    finalDigit.textContent = '0';
    digit3.appendChild(finalDigit);
  }

  // Animar contadores
  function animate(digit, duration, delay = 1) {
    if (!digit) return;
    const first = digit.querySelector('.num');
    if (!first) return;
    const numHeight = first.clientHeight;
    const totalDistance =
      (digit.querySelectorAll('.num').length - 1) * numHeight;
    gsap.to(digit, {
      y: -totalDistance,
      duration,
      delay,
      ease: 'power2.inOut',
    });
  }
  animate(digit3, 5);
  animate(digit2, 6);
  animate(digit1, 2, 5);

  // Configuración inicial: bloquear scroll durante loading
  gsap.set(['html', 'body'], { overflowY: 'hidden', overflowX: 'hidden' });

  // Barra de progreso
  gsap.to('.progress-bar', {
    width: '30%',
    duration: 2,
    ease: 'power4.inOut',
    delay: 7,
  });

  gsap.to('.progress-bar', {
    width: '100%',
    opacity: 0,
    duration: 2,
    delay: 8.5,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set('.pre-loader', { display: 'none' });

      // Re-habilitar scroll vertical, mantener horizontal bloqueado
      gsap.set(['html', 'body'], {
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'auto',
      });

      window.scrollTo(0, 0);
    },
  });

  // Revelar imágenes
  gsap.to('.hero-imgs > img', {
    clipPath: 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)',
    duration: 1,
    ease: 'power4.inOut',
    stagger: 0.25,
    delay: 9,
  });

  // Zoom del hero
  gsap.to('.hero', {
    scale: 1.3,
    duration: 3,
    ease: 'power3.inOut',
    delay: 9,
  });

  // Aparece el nav
  gsap.to('nav', {
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 11,
  });

  // Animación por letra del H1
  gsap.to('.copy-left h1 span', {
    top: '0px',
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out',
    delay: 11,
  });

  // Reveal de copy y botón
  gsap
    .timeline({ delay: 11 })
    .to('.copy-left h1', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    .to('.copy-right p', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
    .to(
      '.btn-primary',
      { y: 0, opacity: 1, transform: 'skew(-21deg)', duration: 1 },
      '-=0.8'
    );
}
