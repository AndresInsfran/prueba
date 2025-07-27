/* ===========================
   CARRUSEL Y GALERÍA FUNCIONAL MEJORADOS
   =========================== */

const Gallery = {
  currentSlide: 0,
  totalSlides: 0,
  lightboxImages: [],
  currentLightboxIndex: 0,
  autoplayInterval: null,

  init() {
    console.log('🖼️ Inicializando Galería y Carrusel...');
    this.initCarousel();
    this.initGallery();
    this.initLightbox();
    console.log('✅ Galería y Carrusel inicializados correctamente');
  },

  // Inicializar Carrusel
  initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) {
      console.log('ℹ️ No se encontró carrusel en la página');
      return;
    }

    const slides = carousel.querySelectorAll('.carousel-slide');
    this.totalSlides = slides.length;

    if (this.totalSlides === 0) {
      console.log('⚠️ No hay imágenes en el carrusel');
      return;
    }

    console.log(`📸 Carrusel encontrado con ${this.totalSlides} imágenes`);

    // Crear indicadores
    this.createIndicators(carousel);

    // Configurar controles
    this.setupCarouselControls(carousel);

    // Mostrar primera imagen
    this.showSlide(0);

    // Auto-play opcional
    this.startAutoPlay();

    // Agregar título dinámico
    this.addCarouselTitle(carousel);
  },

  addCarouselTitle(carousel) {
    const title = document.createElement('div');
    title.className = 'carousel-title';
    title.innerHTML = '<i class="fas fa-images"></i> Momentos Especiales';
    carousel.appendChild(title);
  },

  createIndicators(carousel) {
    // Remover indicadores existentes
    const existingIndicators = carousel.querySelector('.carousel-indicators');
    if (existingIndicators) {
      existingIndicators.remove();
    }

    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('data-slide', i);
      indicator.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      indicator.addEventListener('click', () => this.goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }

    carousel.appendChild(indicatorsContainer);
  },

  setupCarouselControls(carousel) {
    // Botón anterior
    const prevBtn = carousel.querySelector('.carousel-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevSlide();
      });
    }

    // Botón siguiente
    const nextBtn = carousel.querySelector('.carousel-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextSlide();
      });
    }

    // Controles de teclado (solo cuando el carrusel está visible)
    document.addEventListener('keydown', (e) => {
      if (this.isCarouselVisible()) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevSlide();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
        }
      }
    });

    // Touch/swipe support
    this.setupTouchControls(carousel);

    // Pausar autoplay al hover
    carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
    carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
  },

  isCarouselVisible() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return false;
    
    const rect = carousel.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  },

  setupTouchControls(carousel) {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }, { passive: true });

    // Mouse events para desktop
    let isMouseDown = false;

    carousel.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mouseup', (e) => {
      if (isMouseDown) {
        endX = e.clientX;
        endY = e.clientY;
        this.handleSwipe();
        isMouseDown = false;
        carousel.style.cursor = 'grab';
      }
    });

    carousel.addEventListener('mouseleave', () => {
      isMouseDown = false;
      carousel.style.cursor = 'default';
    });
  },

  handleSwipe() {
    const threshold = 50;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);

    // Solo procesar swipe horizontal si no es principalmente vertical
    if (Math.abs(diffX) > threshold && diffY < threshold * 2) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  },

  showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Validar índice
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;

    // Ocultar todas las diapositivas
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Mostrar diapositiva actual
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }

    this.currentSlide = index;
  },

  nextSlide() {
    this.showSlide(this.currentSlide + 1);
  },

  prevSlide() {
    this.showSlide(this.currentSlide - 1);
  },

  goToSlide(index) {
    this.showSlide(index);
  },

  startAutoPlay() {
    this.autoplayInterval = setInterval(() => {
      if (this.totalSlides > 1) {
        this.nextSlide();
      }
    }, 5000); // 5 segundos
  },

  pauseAutoPlay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  },

  resumeAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  },

  // Inicializar Galería
  initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) {
      console.log('ℹ️ No se encontraron elementos de galería');
      return;
    }

    console.log(`🖼️ Galería encontrada con ${galleryItems.length} imágenes`);
    
    this.lightboxImages = []; // Limpiar array

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        // Agregar imagen al array del lightbox
        this.lightboxImages.push({
          src: img.src,
          alt: img.alt,
          caption: item.querySelector('.gallery-caption')?.textContent || img.alt
        });

        // Agregar ícono de zoom
        this.addZoomIcon(item);

        // Event listener para abrir lightbox
        item.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`🔍 Abriendo imagen ${index + 1} en lightbox`);
          this.openLightbox(index);
        });

        // Mejorar accesibilidad
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ver imagen: ${img.alt}`);

        // Soporte para teclado
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openLightbox(index);
          }
        });
      }
    });

    console.log(`✅ ${this.lightboxImages.length} imágenes configuradas para lightbox`);
  },

  addZoomIcon(item) {
    const zoomIcon = document.createElement('div');
    zoomIcon.className = 'gallery-zoom-icon';
    zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
    
    // Agregar dentro del item pero después de la imagen
    const overlay = item.querySelector('.gallery-overlay');
    if (overlay) {
      item.insertBefore(zoomIcon, overlay);
    } else {
      item.appendChild(zoomIcon);
    }
  },

  // Inicializar Lightbox
  initLightbox() {
    this.createLightbox();
  },

  createLightbox() {
    // Remover lightbox existente si existe
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Cerrar galería">&times;</button>
        <button class="lightbox-controls lightbox-prev" aria-label="Imagen anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-controls lightbox-next" aria-label="Imagen siguiente">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-loading">
          <div class="spinner"></div>
          Cargando...
        </div>
        <img class="lightbox-image" src="" alt="" style="display: none;">
        <div class="lightbox-caption"></div>
        <div class="lightbox-counter"></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.closeLightbox();
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
      this.prevLightboxImage();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
      this.nextLightboxImage();
    });

    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        e.preventDefault();
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevLightboxImage();
        if (e.key === 'ArrowRight') this.nextLightboxImage();
      }
    });

    console.log('✅ Lightbox creado y configurado');
  },

  openLightbox(index) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox || this.lightboxImages.length === 0) {
      console.error('❌ No se puede abrir lightbox: elemento no encontrado o sin imágenes');
      return;
    }

    this.currentLightboxIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pausar autoplay del carrusel
    this.pauseAutoPlay();
    
    this.updateLightboxImage();
    console.log(`✅ Lightbox abierto con imagen ${index + 1}`);
  },

  closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reanudar autoplay del carrusel
      this.resumeAutoPlay();
      
      console.log('✅ Lightbox cerrado');
    }
  },

  updateLightboxImage() {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');
    const loading = lightbox.querySelector('.lightbox-loading');
    const currentImage = this.lightboxImages[this.currentLightboxIndex];

    if (!currentImage) {
      console.error('❌ Imagen no encontrada en el índice:', this.currentLightboxIndex);
      return;
    }

    // Mostrar loading
    loading.style.display = 'block';
    img.style.display = 'none';

    // Cargar imagen
    const newImg = new Image();
    newImg.onload = () => {
      img.src = newImg.src;
      img.alt = currentImage.alt;
      caption.textContent = currentImage.caption;
      counter.textContent = `${this.currentLightboxIndex + 1} / ${this.lightboxImages.length}`;
      
      // Ocultar loading y mostrar imagen
      loading.style.display = 'none';
      img.style.display = 'block';
    };
    
    newImg.onerror = () => {
      console.error('❌ Error cargando imagen:', currentImage.src);
      loading.textContent = 'Error cargando imagen';
    };
    
    newImg.src = currentImage.src;

    // Mostrar/ocultar controles según la cantidad de imágenes
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    if (this.lightboxImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  },

  nextLightboxImage() {
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.lightboxImages.length;
    this.updateLightboxImage();
  },

  prevLightboxImage() {
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
    this.updateLightboxImage();
  }
};

// Funciones globales para compatibilidad
window.Gallery = Gallery;

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Gallery.init());
} else {
  Gallery.init();
}
