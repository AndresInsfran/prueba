/* CONFIGURACIÓN DEL CARRUSEL HERO */
window.heroCarouselConfig = {
  autoPlayDelay: 9000, // 9 segundos entre slides
  transitionDuration: 800, // Duración de la transición en ms
  autoHideControlsDelay: 3000, // Tiempo para ocultar controles en móvil
  
  // Carpeta de imágenes para el carrusel
  imagesFolder: './assets/images/portada/',
  
  // Extensiones de imagen soportadas
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  
  // Lista de imágenes del carrusel
  availableImages: [
    'portada1.jpg',
    'portada2.jpg'
  ],
  
  // Configuración por defecto
  defaultSlideConfig: {
    title: 'Santuario Diocesano',
    subtitle: 'Santísimo Sacramento y Perpetuo Socorro'
  },
  
  slides: [],
  fallbackImage: './assets/images/portada/portada1.jpg',
  
  accessibility: {
    prevButtonLabel: 'Imagen anterior',
    nextButtonLabel: 'Imagen siguiente',
    slideLabel: 'Slide {index} de {total}'
  }
};

// Cargar imágenes de la carpeta portada
async function loadPortadaImages() {
  const config = window.heroCarouselConfig;
  const loadedSlides = [];
  
  console.log('🔍 Iniciando carga de imágenes...');
  console.log('Buscando:', config.availableImages);
  
  for (let i = 0; i < config.availableImages.length; i++) {
    const imageName = config.availableImages[i];
    const imagePath = config.imagesFolder + imageName;
    
    console.log(`Verificando: ${imagePath}`);
    
    try {
      const exists = await checkImageExists(imagePath);
      
      if (exists) {
        const slideData = {
          image: imagePath,
          alt: `Santuario Diocesano - Imagen ${i + 1}`,
          loading: i === 0 ? 'eager' : 'lazy'
        };
        
        loadedSlides.push(slideData);
        console.log(`✅ Imagen cargada: ${imageName}`);
      } else {
        console.log(`❌ Imagen no encontrada: ${imageName}`);
      }
    } catch (error) {
      console.log(`❌ Error cargando ${imageName}:`, error);
    }
  }
  
  // Solo usar imágenes de la carpeta portada, sin fallbacks
  config.slides = loadedSlides;
  
  console.log(`🎠 Configuración final: ${loadedSlides.length} slides cargados`);
  
  // Generar HTML dinámicamente
  generateCarouselHTML();
  
  return loadedSlides;
}

// Generar HTML del carrusel dinámicamente
function generateCarouselHTML() {
  const config = window.heroCarouselConfig;
  const track = document.getElementById('hero-carousel-track');
  const indicators = document.getElementById('hero-carousel-indicators');
  
  console.log('🏗️ Generando HTML del carrusel...');
  
  if (!track || !indicators) {
    console.error('❌ No se encontraron elementos del carrusel');
    return;
  }
  
  // Limpiar contenido existente
  track.innerHTML = '';
  indicators.innerHTML = '';
  
  console.log(`Generando ${config.slides.length} slides...`);
  
  // Generar slides
  config.slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slideElement.innerHTML = `
      <img src="${slide.image}" 
           alt="${slide.alt}" 
           loading="${slide.loading}"
           onload="console.log('✅ Imagen ${index + 1} cargada:', this.src)"
           onerror="console.error('❌ Error cargando imagen ${index + 1}:', this.src); this.src='${config.fallbackImage}'"/>
      <div class="hero-slide-overlay"></div>
    `;
    track.appendChild(slideElement);
    
    // Generar indicador
    const indicator = document.createElement('span');
    indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
    indicator.setAttribute('data-slide', index);
    indicator.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
    indicators.appendChild(indicator);
    
    console.log(`✅ Slide ${index + 1} generado: ${slide.image}`);
  });
  
  console.log('🎯 HTML del carrusel generado exitosamente');
}

// Verificar si imagen existe
function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}

// Auto-cargar imágenes
document.addEventListener('DOMContentLoaded', async function() {
  console.log('📄 DOM cargado, iniciando sistema del carrusel...');
  
  try {
    await loadPortadaImages();
    
    // Esperar un poco más para asegurar que el HTML se haya renderizado
    setTimeout(() => {
      console.log('⏰ Iniciando carrusel...');
      
      // Verificar que los elementos existan antes de inicializar
      const track = document.getElementById('hero-carousel-track');
      const prevBtn = document.querySelector('.hero-carousel-prev');
      const nextBtn = document.querySelector('.hero-carousel-next');
      
      console.log('🔍 Verificación de elementos:');
      console.log('- Track:', !!track);
      console.log('- Botón anterior:', !!prevBtn);
      console.log('- Botón siguiente:', !!nextBtn);
      
      if (track && prevBtn && nextBtn) {
        console.log('🎯 Creando instancia del carrusel...');
        window.heroCarousel = new HeroCarousel();
        
        // Verificar que se haya inicializado
        setTimeout(() => {
          if (window.heroCarousel && window.heroCarousel.refreshElements) {
            window.heroCarousel.refreshElements();
            console.log('🎯 Carrusel completamente inicializado y refrescado');
          }
        }, 100);
      } else {
        console.error('❌ No se pudieron encontrar todos los elementos necesarios');
        console.error('- Track:', !!track);
        console.error('- Botón anterior:', !!prevBtn);
        console.error('- Botón siguiente:', !!nextBtn);
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Error al cargar imágenes:', error);
  }
});