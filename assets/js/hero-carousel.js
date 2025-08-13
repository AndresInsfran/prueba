/* ===========================
   CARRUSEL DE PORTADA HERO
   =========================== */

class HeroCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.indicators = [];
    this.isAutoPlaying = true;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 9000; // 9 segundos
    this.isTransitioning = false;
    
    this.init();
  }
  
  init() {
    console.log('🎠 Inicializando Hero Carousel...');
    
    // Delay para asegurar que el DOM esté completamente listo
    setTimeout(() => {
      const elementsReady = this.setupElements();
      if (!elementsReady) {
        console.error('❌ No se pudieron configurar los elementos del carrusel');
        return;
      }
      
      this.setupEventListeners();
      this.startAutoPlay();
      this.preloadImages();
      
      console.log('✅ Hero Carousel inicializado correctamente');
    }, 100);
  }
  
  setupElements() {
    this.track = document.getElementById('hero-carousel-track');
    this.prevBtn = document.querySelector('.hero-carousel-prev');
    this.nextBtn = document.querySelector('.hero-carousel-next');
    this.wrapper = document.querySelector('.hero-carousel-wrapper');
    
    console.log('🔍 Elementos encontrados:');
    console.log('- Track:', !!this.track);
    console.log('- Prev button:', !!this.prevBtn);
    console.log('- Next button:', !!this.nextBtn);
    console.log('- Wrapper:', !!this.wrapper);
    
    if (!this.track) {
      console.error('❌ Hero Carousel: Track no encontrado');
      return false;
    }
    
    if (!this.prevBtn || !this.nextBtn) {
      console.error('❌ Hero Carousel: Botones no encontrados');
      return false;
    }
    
    // Los slides e indicadores se obtienen dinámicamente después de generarse
    this.refreshElements();
    
    // Auto-hide en móvil tras 3 segundos de inactividad
    if (window.innerWidth <= 768) {
      this.setupAutoHide();
    }
    
    return true;
  }
  
  refreshElements() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.indicators = document.querySelectorAll('.hero-indicator');
    console.log(`🔄 Elementos refrescados: ${this.slides.length} slides, ${this.indicators.length} indicadores`);
  }
  
  setupEventListeners() {
    console.log('🎯 Configurando event listeners...');
    
    // Verificar que los elementos existan
    console.log('🔍 Estado de los elementos:');
    console.log('- prevBtn:', this.prevBtn);
    console.log('- nextBtn:', this.nextBtn);
    console.log('- wrapper:', this.wrapper);
    
    // Botones de navegación con verificación extendida
    if (this.prevBtn) {
      console.log('🔧 Configurando botón anterior...');
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔙 Botón anterior clickeado');
        this.previousSlide();
      });
      
      // Verificar visibilidad del botón
      const prevStyles = window.getComputedStyle(this.prevBtn);
      console.log('👁️ Estilos del botón anterior:');
      console.log('- Display:', prevStyles.display);
      console.log('- Visibility:', prevStyles.visibility);
      console.log('- Opacity:', prevStyles.opacity);
      console.log('- Z-index:', prevStyles.zIndex);
      console.log('- Pointer-events:', prevStyles.pointerEvents);
      
      console.log('✅ Event listener del botón anterior configurado');
    } else {
      console.error('❌ Botón anterior no encontrado');
    }
    
    if (this.nextBtn) {
      console.log('🔧 Configurando botón siguiente...');
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔜 Botón siguiente clickeado');
        this.nextSlide();
      });
      
      // Verificar visibilidad del botón
      const nextStyles = window.getComputedStyle(this.nextBtn);
      console.log('👁️ Estilos del botón siguiente:');
      console.log('- Display:', nextStyles.display);
      console.log('- Visibility:', nextStyles.visibility);
      console.log('- Opacity:', nextStyles.opacity);
      console.log('- Z-index:', nextStyles.zIndex);
      console.log('- Pointer-events:', nextStyles.pointerEvents);
      
      console.log('✅ Event listener del botón siguiente configurado');
    } else {
      console.error('❌ Botón siguiente no encontrado');
    }
    
    // Delegación de eventos para indicadores (generados dinámicamente)
    if (this.wrapper) {
      this.wrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('hero-indicator')) {
          const slideIndex = parseInt(e.target.getAttribute('data-slide'));
          console.log(`👆 Indicador ${slideIndex} clickeado`);
          this.goToSlide(slideIndex);
        }
      });
      console.log('✅ Event listener de indicadores configurado');
    }
    
    // Pause en hover
    if (this.wrapper) {
      this.wrapper.addEventListener('mouseenter', () => this.pauseAutoPlay());
      this.wrapper.addEventListener('mouseleave', () => this.resumeAutoPlay());
      console.log('✅ Event listeners de hover configurados');
    }
    
    // Touch/swipe support
    this.setupTouchEvents();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    console.log('✅ Event listener de teclado configurado');
    
    // Visibility API para pausar cuando la pestaña no está activa
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else {
        this.resumeAutoPlay();
      }
    });
    console.log('✅ Todos los event listeners configurados');
  }
  
  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    this.wrapper?.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    this.wrapper?.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // Solo procesar swipe horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }, { passive: true });
  }
  
  setupAutoHide() {
    let hideTimer;
    
    const showControls = () => {
      this.wrapper?.classList.remove('auto-hide');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        this.wrapper?.classList.add('auto-hide');
      }, 3000);
    };
    
    this.wrapper?.addEventListener('touchstart', showControls);
    this.wrapper?.addEventListener('mousemove', showControls);
    
    // Inicializar timer
    showControls();
  }
  
  handleKeyPress(e) {
    if (e.target.closest('.hero')) {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          if (this.isAutoPlaying) {
            this.pauseAutoPlay();
          } else {
            this.resumeAutoPlay();
          }
          break;
      }
    }
  }
  
  goToSlide(index) {
    console.log(`🎯 Intentando ir al slide ${index}`);
    
    if (this.isTransitioning) {
      console.log('⚠️ Transición en progreso, ignorando');
      return;
    }
    
    if (index === this.currentSlide) {
      console.log('⚠️ Ya estamos en el slide solicitado');
      return;
    }
    
    // Refrescar elementos para obtener los más recientes
    this.refreshElements();
    
    if (index < 0 || index >= this.slides.length) {
      console.error(`❌ Índice inválido: ${index}, slides disponibles: ${this.slides.length}`);
      return;
    }
    
    this.isTransitioning = true;
    console.log(`🔄 Cambiando de slide ${this.currentSlide} a ${index}`);
    
    // Verificar el estado de las imágenes
    const currentSlide = this.slides[this.currentSlide];
    const nextSlide = this.slides[index];
    
    if (currentSlide) {
      const currentImg = currentSlide.querySelector('img');
      console.log(`📸 Slide actual ${this.currentSlide}:`, {
        src: currentImg?.src,
        loaded: currentImg?.complete,
        naturalWidth: currentImg?.naturalWidth
      });
    }
    
    if (nextSlide) {
      const nextImg = nextSlide.querySelector('img');
      console.log(`📸 Slide siguiente ${index}:`, {
        src: nextImg?.src,
        loaded: nextImg?.complete,
        naturalWidth: nextImg?.naturalWidth
      });
      
      // Asegurar que la imagen esté cargada antes de mostrarla
      if (nextImg && !nextImg.complete) {
        console.log('⏳ Esperando que la imagen se cargue...');
        nextImg.onload = () => {
          console.log('✅ Imagen cargada, continuando transición');
          this.performSlideTransition(index);
        };
        nextImg.onerror = () => {
          console.error('❌ Error cargando imagen');
          this.performSlideTransition(index);
        };
        return;
      }
    }
    
    this.performSlideTransition(index);
  }
  
  performSlideTransition(index) {
    console.log(`🎬 Ejecutando transición al slide ${index}`);
    
    // Remover clase activa del slide actual
    const currentSlide = this.slides[this.currentSlide];
    const currentIndicator = this.indicators[this.currentSlide];
    
    if (currentSlide) {
      currentSlide.classList.remove('active');
      console.log(`🔹 Slide ${this.currentSlide} desactivado`);
    }
    
    if (currentIndicator) {
      currentIndicator.classList.remove('active');
      console.log(`🔸 Indicador ${this.currentSlide} desactivado`);
    }
    
    // Actualizar índice actual
    this.currentSlide = index;
    
    // Activar nuevo slide
    const newSlide = this.slides[this.currentSlide];
    const newIndicator = this.indicators[this.currentSlide];
    
    if (newSlide) {
      // Asegurar que la imagen esté visible
      const newImg = newSlide.querySelector('img');
      if (newImg) {
        newImg.style.opacity = '1';
        newImg.classList.add('loaded');
      }
      
      // Forzar un reflow antes de activar
      newSlide.offsetHeight;
      newSlide.classList.add('active');
      console.log(`🔹 Slide ${index} activado`);
    }
    
    if (newIndicator) {
      newIndicator.classList.add('active');
      console.log(`🔸 Indicador ${index} activado`);
    }
    
    console.log(`✅ Transición al slide ${index} completada`);
    
    // Reset timer de transición
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('🔓 Transición desbloqueada');
    }, 1200); // Aumentar tiempo para asegurar que la transición CSS termine
    
    this.resetAutoPlay();
  }
  
  nextSlide() {
    console.log('➡️ Navegando al siguiente slide');
    this.refreshElements();
    if (this.slides.length === 0) {
      console.error('❌ No hay slides disponibles');
      return;
    }
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  previousSlide() {
    console.log('⬅️ Navegando al slide anterior');
    this.refreshElements();
    if (this.slides.length === 0) {
      console.error('❌ No hay slides disponibles');
      return;
    }
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    if (!this.isAutoPlaying) return;
    
    this.autoPlayInterval = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, this.autoPlayDelay);
  }
  
  pauseAutoPlay() {
    this.isAutoPlaying = false;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resumeAutoPlay() {
    this.isAutoPlaying = true;
    this.startAutoPlay();
  }
  
  resetAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    }
  }
  
  preloadImages() {
    console.log('🖼️ Precargando imágenes del carrusel...');
    
    this.slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img) {
        console.log(`📥 Precargando imagen ${index + 1}: ${img.src}`);
        
        if (!img.complete) {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
            console.log(`✅ Imagen ${index + 1} precargada exitosamente`);
          });
          
          img.addEventListener('error', () => {
            console.error(`❌ Error precargando imagen ${index + 1}: ${img.src}`);
            // Intentar cargar imagen de fallback
            if (window.heroCarouselConfig && window.heroCarouselConfig.fallbackImage) {
              img.src = window.heroCarouselConfig.fallbackImage;
            }
          });
        } else {
          img.classList.add('loaded');
          img.style.opacity = '1';
          console.log(`✅ Imagen ${index + 1} ya estaba cargada`);
        }
        
        // Forzar que la primera imagen se vea inmediatamente
        if (index === 0) {
          img.style.opacity = '1';
          img.classList.add('loaded');
        }
      }
    });
    
    console.log('🖼️ Proceso de precarga iniciado');
  }
  
  // Método público para destruir el carrusel
  destroy() {
    this.pauseAutoPlay();
    // Remover event listeners si es necesario
    console.log('🎠 Hero Carousel destruido');
  }
}

// La inicialización automática se maneja desde hero-carousel-config.js
// Solo mantener funciones globales para compatibilidad
window.initHeroCarousel = function() {
  if (!window.heroCarousel) {
    window.heroCarousel = new HeroCarousel();
  }
};

window.destroyHeroCarousel = function() {
  if (window.heroCarousel) {
    window.heroCarousel.destroy();
    window.heroCarousel = null;
  }
};
