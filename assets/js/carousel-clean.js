/* ===========================
   CARRUSEL LIMPIO - JAVASCRIPT
   =========================== */

class CarouselClean {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5 segundos
    this.init();
  }

  init() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) {
      console.log('No se encontró carrusel en la página');
      return;
    }

    const slides = carousel.querySelectorAll('.carousel-slide');
    this.totalSlides = slides.length;

    if (this.totalSlides === 0) {
      console.log('No hay imágenes en el carrusel');
      return;
    }

    console.log(`Carrusel inicializado con ${this.totalSlides} imágenes`);

    this.createIndicators();
    this.setupControls();
    this.showSlide(0);
    this.startAutoplay();
    this.setupTouchControls();
  }

  createIndicators() {
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      
      if (i === 0) {
        indicator.classList.add('active');
      }
      
      indicator.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetAutoplay();
      });
      
      indicatorsContainer.appendChild(indicator);
    }
  }

  setupControls() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoplay();
      });
    }

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
      if (this.isCarouselInView()) {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
          this.resetAutoplay();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
          this.resetAutoplay();
        }
      }
    });
  }

  setupTouchControls() {
    const carousel = document.querySelector('.carousel-wrapper');
    if (!carousel) return;

    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const swipeDistance = Math.abs(endX - startX);

      if (swipeDistance > minSwipeDistance) {
        if (endX < startX) {
          // Swipe izquierda - siguiente
          this.nextSlide();
        } else {
          // Swipe derecha - anterior
          this.prevSlide();
        }
        this.resetAutoplay();
      }
    });
  }

  showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Mostrar slide actual
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }

    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(prevIndex);
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }

  startAutoplay() {
    this.stopAutoplay(); // Limpiar cualquier autoplay existente
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    // Reiniciar autoplay después de un breve delay
    setTimeout(() => {
      this.startAutoplay();
    }, 1000);
  }

  isCarouselInView() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return false;

    const rect = carousel.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return rect.top < viewHeight && rect.bottom > 0;
  }

  // Pausar autoplay cuando no está visible
  handleVisibilityChange() {
    if (document.hidden) {
      this.stopAutoplay();
    } else if (this.isCarouselInView()) {
      this.startAutoplay();
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new CarouselClean();
  
  // Manejar cambios de visibilidad
  document.addEventListener('visibilitychange', () => {
    carousel.handleVisibilityChange();
  });
  
  // Pausar autoplay cuando el usuario sale del área del carrusel
  const carouselSection = document.querySelector('.carousel-section');
  if (carouselSection) {
    carouselSection.addEventListener('mouseenter', () => {
      carousel.stopAutoplay();
    });
    
    carouselSection.addEventListener('mouseleave', () => {
      carousel.startAutoplay();
    });
  }
});

// Exponer para uso global si es necesario
window.CarouselClean = CarouselClean;
