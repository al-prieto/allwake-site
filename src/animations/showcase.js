// src/animations/showcase.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* --------------------- UTILITIES --------------------- */

// Split del título a NIVEL DE CARÁCTER (espacios como nodos de texto)
// src/animations/showcase.js  ➜ reemplaza splitToLetters por esto
function splitToLetters(rootEl) {
  if (!rootEl) return { letters: [], root: null };

  // Guardamos los nodos actuales (incluye <br>)
  const nodes = Array.from(rootEl.childNodes);
  rootEl.textContent = '';

  const frag = document.createDocumentFragment();

  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') {
      // Conservar los <br>
      frag.appendChild(document.createElement('br'));
      return;
    }

    // Para nodos de texto, construir letras
    const text = (node.textContent || '').replace(/\s+/g, ' ');
    for (const ch of text) {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '));
      } else {
        const outer = document.createElement('span');
        outer.className = 'letter';
        const inner = document.createElement('span');
        inner.textContent = ch;
        outer.appendChild(inner);
        frag.appendChild(outer);
      }
    }
  });

  rootEl.appendChild(frag);
  const letters = Array.from(rootEl.querySelectorAll('.letter > span'));
  return { letters, root: rootEl };
}

// Shuffle array (para el efecto aleatorio)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------------------- ANIMATIONS --------------------- */

function initShowcaseTitle(section) {
  const title = section.querySelector('.mwg_landing1');
  if (!title) return;

  const { letters, root } = splitToLetters(title);
  if (!letters.length) return;

  const shuffledLetters = shuffle(Array.from(letters));

  // estado inicial: ocultas hacia abajo
  gsap.set(letters, { y: '102%' });

  const containerHeight = root.clientHeight + 100;

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
      scrub: 0.8, // como lo tenías
    },
  });
}

/* --------------------- INIT --------------------- */

export function initShowcase() {
  const section = document.querySelector('#showcase');
  if (!section) return;

  initCircles(section);
  initShowcaseTitle(section);
}
