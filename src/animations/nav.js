// src/animations/nav.js
export default function navAnimation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.close-btn');
  const menuContainer = document.querySelector('.menu-container');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!menuToggle || !closeBtn || !menuContainer) return;

  // -------------------------
  // Open / Close
  // -------------------------
  menuToggle.addEventListener('click', () => {
    menuContainer.style.left = '0%';
    shuffleAll();
    animateMenuItems(menuItems, 'in');
  });

  closeBtn.addEventListener('click', () => {
    menuContainer.style.left = '-100%';
    animateMenuItems(menuItems, 'out');
  });

  function animateMenuItems(items, direction) {
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.left = direction === 'in' ? '0px' : '-100px';
      }, index * 50);
    });
  }

  // -------------------------
  // SplitType
  // -------------------------
  /* global SplitType */
  new SplitType('.menu-item a', { types: 'words, chars' });
  new SplitType('.menu-item span', { types: 'words, chars' });
  new SplitType('.menu-title p', { types: 'words, chars' });
  new SplitType('.menu-content p', { types: 'words, chars' });

  const links = document.querySelectorAll(
    '.menu-item, .menu-sub-item .menu-title, .menu-sub-item .menu-content'
  );

  // -------------------------
  // Helpers de hover (color en labels a la derecha)
  // -------------------------
  document.querySelectorAll('.menu-item').forEach((item) => {
    const linkElement = item.querySelector('.menu-item-link a');
    if (linkElement) {
      const width = linkElement.offsetWidth;
      const bg = item.querySelector('.menu-item-link .bg-hover');
      if (bg) bg.style.width = width + 30 + 'px';
      const spanElement = item.querySelector('span');
      if (spanElement) spanElement.style.left = width + 40 + 'px';
    }

    const chars = item.querySelectorAll('span .char');
    const colorChars = (chs) =>
      chs.forEach((c, i) =>
        setTimeout(() => c.classList.add('char-active'), i * 50)
      );
    const clearChars = (chs) =>
      chs.forEach((c) => c.classList.remove('char-active'));

    if (linkElement) {
      linkElement.addEventListener('mouseenter', () => colorChars(chars));
      linkElement.addEventListener('mouseleave', () => clearChars(chars));
    }
  });

  // -------------------------
  // Hover shuffle SEGURO (idempotente)
  // -------------------------
  links.forEach((link) => {
    link.addEventListener('mouseenter', (event) => {
      const target = event.currentTarget.querySelector(
        '.menu-item-link a, .menu-title p, .menu-content p'
      );
      if (target) addShuffleEffect(target);
      const spanElement = link.querySelector('span');
      if (spanElement) addShuffleEffect(spanElement);
    });

    link.addEventListener('mouseleave', (event) => {
      const target = event.currentTarget.querySelector(
        '.menu-item-link a, .menu-title p, .menu-content p'
      );
      if (target) resetToOriginal(target);
      const spanElement = link.querySelector('span');
      if (spanElement) resetToOriginal(spanElement);
    });
  });

  function shuffleAll() {
    links.forEach((link) => {
      const target = link.querySelector(
        '.menu-item-link a, .menu-title p, .menu-content p'
      );
      if (target) addShuffleEffect(target);
    });
  }

  // Genera el efecto sin perder el texto original ni solapar timers
  function addShuffleEffect(element) {
    const chars = element.querySelectorAll('.char');

    chars.forEach((char, index) => {
      // Guarda la letra original una sola vez
      if (!char.dataset.original) {
        char.dataset.original = char.textContent;
      }

      // Cancela timers antiguos si existieran
      if (char.dataset.timer) {
        clearInterval(Number(char.dataset.timer));
        delete char.dataset.timer;
      }

      // Evita animaciones solapadas en el mismo char
      if (char.dataset.animating === '1') return;
      char.dataset.animating = '1';

      const original = char.dataset.original;
      const isUpper = /[A-Z]/.test(original); // respeta mayúsculas
      const duration = 300 + index * 30; // ligera escalera por índice
      const started = Date.now();

      const timer = setInterval(() => {
        const r = Math.floor(Math.random() * 26);
        char.textContent = String.fromCharCode((isUpper ? 65 : 97) + r);

        // Fin de animación -> restaurar
        if (Date.now() - started >= duration) {
          clearInterval(timer);
          char.textContent = original;
          char.dataset.animating = '0';
          delete char.dataset.timer;
        }
      }, 16);

      char.dataset.timer = String(timer);
    });
  }

  // Restaura inmediatamente los caracteres al texto original
  function resetToOriginal(element) {
    const chars = element.querySelectorAll('.char');
    chars.forEach((char) => {
      if (char.dataset.timer) {
        clearInterval(Number(char.dataset.timer));
        delete char.dataset.timer;
      }
      if (char.dataset.original) {
        char.textContent = char.dataset.original;
      }
      char.dataset.animating = '0';
    });
  }
}
