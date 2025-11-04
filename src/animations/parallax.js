// parallax.js - Versión mejorada
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  // ✅ Asegurar que no hay scroll horizontal antes de iniciar
  gsap.set('html, body', { overflowX: 'hidden' });

  const hero = document.querySelector('.hero');
  const sectionTwo = document.querySelector('.section-two');
  const heroCopy = document.querySelector('.hero-copy');

  if (!hero || !sectionTwo) {
    console.warn('Hero o Section Two no encontrados');
    return;
  }

  // ✅ Configurar elementos antes del parallax
  gsap.set(hero, {
    transformOrigin: 'center center',
    overflow: 'hidden', // ✅ Importante para contener contenido escalado
  });

  // ✅ ScrollTrigger más estable y controlado
  const parallaxTrigger = ScrollTrigger.create({
    trigger: sectionTwo,
    start: 'top bottom',
    end: 'bottom top',

    pin: hero,
    pinSpacing: false,

    // ✅ Configuraciones para estabilidad
    invalidateOnRefresh: true,
    anticipatePin: 1,
    fastScrollEnd: true, // ✅ Mejor rendimiento en scroll rápido

    onUpdate: (self) => {
      const progress = self.progress;

      // ✅ Movimiento más sutil para evitar desbordamientos
      const yMovement = progress * -50; // Reducido de -100 a -50

      gsap.set(hero, {
        y: yMovement,
        ease: 'none',
        // ✅ Asegurar que no se desborde horizontalmente
        overflow: 'hidden',
      });
    },

    onComplete: () => {
      console.log('Parallax completado');
      // ✅ Asegurar overflow correcto al completar
      gsap.set('html, body', { overflowX: 'hidden' });
    },

    // ✅ Remover markers para producción
    // markers: true
  });

  // Text blur + fade effect
  ScrollTrigger.create({
    trigger: sectionTwo,
    start: 'top bottom',
    end: 'top center',
    onUpdate: (self) => {
      const progress = self.progress;

      const opacity = 1 - progress;
      const blurAmount = progress * 10;

      gsap.set(heroCopy, {
        opacity: opacity,
        filter: `blur(${blurAmount}px)`,
      });
    },
  });

  // ✅ Función de limpieza mejorada
  const handleResize = () => {
    // Mantener overflow-x bloqueado en resize
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    // Refrescar ScrollTrigger después de un pequeño delay
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    parallaxTrigger.kill();
  };
}

// ✅ Función utilitaria para debugging (opcional)
export function debugScrollIssues() {
  const checkOverflow = () => {
    const body = document.body;
    const html = document.documentElement;

    console.log(
      'Body scrollWidth vs clientWidth:',
      body.scrollWidth,
      body.clientWidth
    );
    console.log(
      'HTML scrollWidth vs clientWidth:',
      html.scrollWidth,
      html.clientWidth
    );

    if (body.scrollWidth > body.clientWidth) {
      console.warn('⚠️ Body tiene scroll horizontal');
    }

    if (html.scrollWidth > html.clientWidth) {
      console.warn('⚠️ HTML tiene scroll horizontal');
    }
  };

  checkOverflow();
  window.addEventListener('resize', checkOverflow);
}
