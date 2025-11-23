// SCROLL LINES ANIMATION (MWG-style, scoped)
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const CFG = {
  start: '25% bottom',
  end: '90% bottom',
  scrub: 1,
  ease: 'power1.inOut',
  each: 0.05,
  overshoot: 101,
  markers: false,
};

// Build duplicated letters SOLO dentro de la sección
function buildLines(section) {
  // Convertir NodeList a Array para iterar más rápido
  const lines = Array.from(section.querySelectorAll('.line'));
  lines.forEach((line) => {
    const text = line.dataset.text || '';
    const frag = document.createDocumentFragment();

    for (const ch of text) {
      if (ch === ' ') {
        const space = document.createElement('span');
        space.className = 'letter space';
        frag.appendChild(space);
        continue;
      }
      const wrapper = document.createElement('span');
      wrapper.className = 'letter';

      const a = document.createElement('span'); // sale
      a.textContent = ch;

      const b = document.createElement('span'); // entra
      b.className = 'letter-top';
      b.textContent = ch;

      wrapper.appendChild(a);
      wrapper.appendChild(b);
      frag.appendChild(wrapper);
    }
    line.appendChild(frag);
  });
}

// Fisher–Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initScrollLines() {
  const section = document.querySelector('.scroll-lines');
  if (!section) return;

  buildLines(section);

  // TODO: todo scopiado al contenedor
  const items = gsap.utils.toArray(
    section.querySelectorAll('.letter:not(.space)')
  );
  const shuffled = shuffle(items);

  const fronts = shuffled.map((el) => el.querySelector('span:first-child'));
  const tops = shuffled.map((el) => el.querySelector('.letter-top'));

  gsap.set([fronts, tops], { yPercent: 0, force3D: true });

  const st = {
    trigger: section,
    start: CFG.start,
    end: CFG.end,
    scrub: CFG.scrub,
    ...(CFG.markers ? { markers: true } : {}),
  };

  gsap.to(fronts, {
    yPercent: CFG.overshoot,
    ease: CFG.ease,
    snap: { yPercent: 1 },
    stagger: { each: CFG.each },
    scrollTrigger: st,
  });

  gsap.to(tops, {
    yPercent: 100,
    ease: CFG.ease,
    snap: { yPercent: 1 },
    stagger: { each: CFG.each },
    scrollTrigger: st,
  });
}
