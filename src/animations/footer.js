import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import textureUrl from '../assets/texture-footer-allwake.svg';

gsap.registerPlugin(ScrollTrigger);

export function initFooter() {
  const footer = document.querySelector('.aw-footer');
  if (!footer) return;

  // --- Selecciones específicas para el logo y la textura
  const logo = footer.querySelector('.aw-footer__logo');
  const texImg = footer.querySelector('.aw-footer__texture img');

  // Inyecta src vía Vite (resuelve la ruta del asset en build)
  if (texImg && !texImg.getAttribute('src')) {
    texImg.src = textureUrl;
  }

  // --- Animación de entrada (lo que ya tenías, afinando el rango)
  gsap
    .timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%', // aparece un poco antes
        end: 'top 70%',
        scrub: 0.6,
      },
    })
    .from(logo.querySelector('span'), {
      yPercent: 8,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
    .from('.aw-footer__bar', { autoAlpha: 0, duration: 0.4 }, '-=0.2');

  // --- Parallax de la textura dentro del propio bloque (sin “espacio negro” extra)
  // Mueve la textura ~25% de la altura del bloque a lo largo del scroll
  const parallax = () => {
    const range = logo.offsetHeight * 0.25; // ajusta 0.15–0.35
    gsap.fromTo(
      texImg,
      { y: -range },
      {
        y: range,
        ease: 'none',
        scrollTrigger: {
          trigger: logo,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  };

  parallax();
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
