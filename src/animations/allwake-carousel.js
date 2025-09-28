// src/animations/allwake-carousel.js

// --------------------- ALLWAKE CAROUSEL GENERATOR ---------------------

const METRICS_DATA = [
  {
    value: '247',
    unit: 'PROJECTS',
    label: 'Creative Works',
    description:
      'Stunning visuals crafted with precision retouching and AI-powered design innovation.',
    progress: 4,
    background:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
  },
  {
    value: '98.7',
    unit: '% ACCURACY',
    label: 'AI Precision',
    description:
      'Cutting-edge artificial intelligence delivering consistently flawless creative results.',
    progress: 5,
    background:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    value: '15K',
    unit: 'HOURS',
    label: 'Retouching Mastery',
    description:
      'Expert pixel-level refinement transforming ordinary images into extraordinary visuals.',
    progress: 4,
    background:
      'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4?w=800&q=80',
  },
  {
    value: '4.9',
    unit: '★ RATING',
    label: 'Client Excellence',
    description:
      'Outstanding satisfaction through innovative design and meticulous attention to detail.',
    progress: 5,
    background:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },
  {
    value: '48H',
    unit: 'TURNAROUND',
    label: 'Rapid Delivery',
    description:
      'Lightning-fast project completion without compromising creative excellence.',
    progress: 3,
    background:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  },
  {
    value: '20+',
    unit: 'TECHNIQUES',
    label: 'Advanced Methods',
    description:
      'Mastery of cutting-edge retouching and AI-driven creative solutions.',
    progress: 3,
    background:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  },
];

function createMetricCard(data) {
  const progressBars = Array.from(
    { length: 5 },
    (_, i) =>
      `<div class="progress-bar ${i < data.progress ? 'active' : ''}"></div>`
  ).join('');

  return `
    <div class="metric-card" style="background-image: url('${data.background}');">
      <div class="metric-overlay"></div>
      <div class="metric-content">
        <div class="metric-header">
          <div class="metric-main">
            <div class="metric-value">${data.value}</div>
            <div class="metric-unit">${data.unit}</div>
          </div>
          <div class="metric-progress">
            ${progressBars}
          </div>
        </div>
        <div class="metric-footer">
          <div class="metric-label">${data.label}</div>
          <div class="metric-description">${data.description}</div>
        </div>
      </div>
    </div>
  `;
}

export function initAllwakeCarousel() {
  const track = document.getElementById('metricsTrack');
  if (!track) return;

  // Crear cards originales + duplicadas para loop infinito
  const originalCards = METRICS_DATA.map(createMetricCard).join('');
  const duplicatedCards = METRICS_DATA.map(createMetricCard).join('');

  track.innerHTML = originalCards + duplicatedCards;

  // Pausar animación al hover (opcional)
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}
