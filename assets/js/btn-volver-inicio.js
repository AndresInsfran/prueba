/* ===========================
   BOTÓN FLOTANTE VOLVER AL INICIO - JAVASCRIPT
   =========================== */

class VolverInicio {
  constructor() {
    this.btn = null;
    this.scrollThreshold = 300; // Píxeles de scroll antes de mostrar el botón
    this.init();
  }

  init() {
    this.btn = document.getElementById('btn-volver-inicio');
    if (!this.btn) {
      console.log('No se encontró el botón volver al inicio');
      return;
    }

    this.setupEventListeners();
    this.checkScrollPosition(); // Verificar posición inicial
    console.log('Botón volver al inicio inicializado');
  }

  setupEventListeners() {
    // Evento de scroll
    window.addEventListener('scroll', () => {
      this.throttle(this.checkScrollPosition.bind(this), 100)();
    });

    // Variable para controlar eventos táctiles
    let touchHandled = false;

    // Eventos táctiles mejorados para móviles
    this.btn.addEventListener('touchstart', (e) => {
      this.btn.style.transform = 'translateY(-1px) scale(1.05)';
    });

    this.btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.btn.style.transform = '';
      touchHandled = true;
      this.scrollToTop();
      
      // Reset después de un tiempo para permitir clicks normales
      setTimeout(() => { touchHandled = false; }, 300);
    });

    // Evento de click para desktop (solo si no se manejó con touch)
    this.btn.addEventListener('click', (e) => {
      if (touchHandled) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      this.scrollToTop();
    });
  }

  checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > this.scrollThreshold) {
      this.showButton();
    } else {
      this.hideButton();
    }
  }

  showButton() {
    if (this.btn && !this.btn.classList.contains('visible')) {
      this.btn.classList.add('visible');
      this.btn.classList.remove('hidden');
    }
  }

  hideButton() {
    if (this.btn && this.btn.classList.contains('visible')) {
      this.btn.classList.remove('visible');
      this.btn.classList.add('hidden');
    }
  }

  scrollToTop() {
    // Scroll suave al inicio
    const startPosition = window.pageYOffset;
    const duration = 800; // Duración de la animación en ms
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Función de easing para una animación más suave
      const easeInOutCubic = (t) => {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const easedProgress = easeInOutCubic(progress);
      const currentPosition = startPosition * (1 - easedProgress);
      
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Asegurar que llegue exactamente al inicio
        window.scrollTo(0, 0);
        
        // Opcional: agregar un pequeño efecto visual al llegar
        this.btn.style.transform = 'translateY(-5px) scale(1.1)';
        setTimeout(() => {
          this.btn.style.transform = '';
        }, 200);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  // Función throttle para optimizar el rendimiento del scroll
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Método para actualizar el threshold dinámicamente
  setScrollThreshold(newThreshold) {
    this.scrollThreshold = newThreshold;
    this.checkScrollPosition();
  }

  // Método para destruir el botón si es necesario
  destroy() {
    if (this.btn) {
      window.removeEventListener('scroll', this.checkScrollPosition);
      this.btn.removeEventListener('click', this.scrollToTop);
      this.btn.remove();
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const volverInicio = new VolverInicio();
  
  // Hacer disponible globalmente si es necesario
  window.VolverInicio = volverInicio;
});

// Opcional: Ajustar el threshold basado en la altura de la ventana
window.addEventListener('resize', () => {
  if (window.VolverInicio) {
    const newThreshold = Math.max(300, window.innerHeight * 0.5);
    window.VolverInicio.setScrollThreshold(newThreshold);
  }
});
