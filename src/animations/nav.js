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
  // Nota: Si SplitType da error de "undefined", asegúrate de importarlo arriba o cargarlo en el HTML
  try {
    new SplitType('.menu-item a', { types: 'words, chars' });
    new SplitType('.menu-item span', { types: 'words, chars' });
    new SplitType('.menu-title p', { types: 'words, chars' });
    new SplitType('.menu-content p', { types: 'words, chars' });
  } catch (e) {
    console.warn('SplitType no cargó correctamente', e);
  }

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
      linkElement.addEventListener('mouseenter', () => {
        // SOLUCIÓN IOS: Solo animar si el dispositivo tiene cursor real
        if (window.matchMedia('(hover: hover)').matches) {
          colorChars(chars);
        }
      });
      linkElement.addEventListener('mouseleave', () => clearChars(chars));
    }
  });

  // -------------------------
  // Hover shuffle SEGURO (idempotente)
  // -------------------------
  links.forEach((link) => {
    link.addEventListener('mouseenter', (event) => {
      // SOLUCIÓN IOS: Bloquea la animación en pantallas táctiles.
      // Al no haber cambio en el DOM, el iPhone ejecuta el click inmediatamente.
      if (!window.matchMedia('(hover: hover)').matches) return;

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
    if (!element) return; // seguridad extra
    const chars = element.querySelectorAll('.char');

    chars.forEach((char, index) => {
      if (!char.dataset.original) {
        char.dataset.original = char.textContent;
      }

      if (char.dataset.timer) {
        clearInterval(Number(char.dataset.timer));
        delete char.dataset.timer;
      }

      if (char.dataset.animating === '1') return;
      char.dataset.animating = '1';

      const original = char.dataset.original;
      const isUpper = /[A-Z]/.test(original);
      const duration = 300 + index * 30;
      const started = Date.now();

      const timer = setInterval(() => {
        const r = Math.floor(Math.random() * 26);
        char.textContent = String.fromCharCode((isUpper ? 65 : 97) + r);

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

  function resetToOriginal(element) {
    if (!element) return;
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

  // =========================
  // Smooth scroll "Premium" usando Lenis
  // =========================
  document.querySelectorAll('.menu-item-link a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Cierra el menú
      menuContainer.style.left = '-100%';
      animateMenuItems(menuItems, 'out'); // Opcional: anima salida items también

      // Cálculo del offset (altura del nav + un poquito de aire)
      const navEl = document.querySelector('nav');
      const offsetVal = (navEl?.getBoundingClientRect().height || 0) + 20;

      // USAR LENIS SI EXISTE (Esto es lo que da la suavidad)
      if (window.lenis) {
        window.lenis.scrollTo(target, {
          offset: -offsetVal,
          duration: 2, // <--- Ajusta esto: más alto = más lento y suave (ej: 1.5 a 2.5)
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing "exponential out" suave
        });
      } else {
        // Fallback por si acaso
        const y =
          target.getBoundingClientRect().top + window.pageYOffset - offsetVal;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}
