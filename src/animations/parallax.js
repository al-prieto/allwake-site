import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  // PASO 1: Preparar el hero para el parallax
  // El hero necesita estar "pinned" (fijo) mientras la sección 2 empuja
  const hero = document.querySelector('.hero');
  const sectionTwo = document.querySelector('.section-two');

  if (!hero || !sectionTwo) {
    console.warn('Hero o Section Two no encontrados');
    return;
  }

  // PASO 2: Crear el ScrollTrigger para el parallax (estilo ICEBERG)
  ScrollTrigger.create({
    trigger: sectionTwo,
    start: 'top bottom',
    end: 'bottom top', // Cambiado: dura más tiempo

    // PASO 3: Pin el hero pero con más duración
    pin: hero,
    pinSpacing: false,

    invalidateOnRefresh: true, // ✅ recalcula tamaños al refrescar o resize
    anticipatePin: 1, // ✅ previene saltos y overflows

    // PASO 4: Animación suave del hero (como ICEBERG)
    onUpdate: (self) => {
      const progress = self.progress;

      // El hero se mueve suavemente hacia arriba mientras se "empuja"
      const yMovement = progress * -100; // Se mueve 50px hacia arriba
      gsap.set(hero, {
        y: yMovement,
        ease: 'none',
      });

      console.log('Parallax progress:', progress, 'Y movement:', yMovement);
    },

    // PASO 5: Al completar la animación
    onComplete: () => {
      console.log('Parallax completado - Section Two visible');
    },

    // Debug - remover después
    // markers: {
    //   startColor: 'green',
    //   endColor: 'red',
    //   fontSize: '18px',
    // },
  });

  console.log('Parallax inicializado');
}

/*
EXPLICACIÓN PASO A PASO:

1. TRIGGER: sectionTwo es el elemento que activa la animación
2. START: "top bottom" = cuando el TOP de sectionTwo toca el BOTTOM del viewport
3. END: "top top" = cuando el TOP de sectionTwo llega al TOP del viewport  
4. PIN: hero se queda fijo durante este periodo
5. onUpdate: ejecuta código mientras el parallax está activo

RESULTADO:
- Usuario hace scroll hacia abajo
- Al llegar a sectionTwo, el hero se "pega" 
- sectionTwo sigue subiendo, "empujando" visualmente al hero
- Hero opcional se encoge ligeramente para dar sensación de profundidad
*/
