// src/animations/showcase.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* --------------------- UTILITY FUNCTIONS --------------------- */

// Split text into letters with word/letter structure
function splitToLetters(rootEl) {
  if (!rootEl) return { letters: [], root: null };

  const text = rootEl.textContent.trim().replace(/\s+/g, ' ');
  const words = text.split(' ');

  // Clear and rebuild
  rootEl.textContent = '';
  const frag = document.createDocumentFragment();

  words.forEach((w, wi) => {
    const word = document.createElement('span');
    word.className = 'word';

    [...w].forEach((ch) => {
      const outer = document.createElement('span');
      outer.className = 'letter';
      const inner = document.createElement('span');
      inner.textContent = ch;
      outer.appendChild(inner);
      word.appendChild(outer);
    });

    frag.appendChild(word);
    if (wi < words.length - 1) {
      frag.appendChild(document.createTextNode(' '));
    }
  });

  rootEl.appendChild(frag);
  const letters = Array.from(rootEl.querySelectorAll('.letter > span'));

  return { letters, root: rootEl };
}

// Shuffle array utility (CLAVE para el efecto)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------------------- ANIMATION FUNCTIONS --------------------- */

// Title animation con shuffle (como el sitio de referencia)
function initShowcaseTitle(section) {
  const title = section.querySelector('.mwg_landing1');
  if (!title) return;

  const { letters, root } = splitToLetters(title);
  if (!letters.length) return;

  // 🔥 SHUFFLE las letras (esto es clave!)
  const shuffledLetters = shuffle(Array.from(letters));

  // Estado inicial: todas las letras ocultas
  gsap.set(letters, { y: '102%' }); // Usa 'y' en lugar de 'yPercent' para más control

  // Altura del contenedor + buffer (como en el sitio de referencia)
  const containerHeight = root.clientHeight + 100;

  // 🎯 Animar cada letra con delay basado en su posición en el array shuffled
  shuffledLetters.forEach((letter, index) => {
    gsap.to(letter, {
      y: 0,
      ease: 'expo.inOut',
      duration: 0.8,
      scrollTrigger: {
        trigger: root,
        start: `top 95%-=${(containerHeight / letters.length) * index}`,
        end: '+=1',
        toggleActions: 'play none reverse none',
      },
    });
  });
}

// Circles animation with scaling effect
function initCircles(section) {
  const row = section.querySelector('.l-circles');
  if (!row) return;

  const dots = Array.from(row.querySelectorAll('.dot'));
  gsap.set(dots, { scaleX: 1, scaleY: 0, transformOrigin: '50% 50%' });

  gsap.to(dots, {
    scaleY: 1,
    duration: 0.5,
    ease: 'back.out(3)',
    stagger: { each: -0.2, from: 'center' },
    scrollTrigger: {
      trigger: row,
      start: 'top bottom',
      end: 'bottom 50%',
      scrub: 0.8,
    },
  });
}

/* --------------------- MAIN EXPORT FUNCTION --------------------- */

export function initShowcase() {
  const section = document.querySelector('#showcase');
  if (!section) return;

  initCircles(section);
  initShowcaseTitle(section);
}
