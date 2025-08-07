/*
 * SANTUARIO DIOCESANO - JAVASCRIPT CONSOLIDADO Y OPTIMIZADO
 * Version: 2.0 - Performance Optimized with Lazy Loading
 * Features: Modular architecture, lazy loading, calendar, gallery, PWA-ready
 */

// ===========================
// CONFIGURACIÓN GLOBAL
// ===========================
const CONFIG = {
  // Performance settings
  lazyLoadOffset: 100,
  animationDuration: 300,
  debounceDelay: 250,
  
  // API endpoints (futuro)
  api: {
    santoral: '/api/santoral',
    evangelio: '/api/evangelio'
  },
  
  // Selectors
  selectors: {
    lazyImages: 'img[data-src]',
    galleryItems: '.gallery-item',
    calendarDays: '.calendar-day',
    navToggle: '.menu-toggle',
    navMobile: '.nav-mobile'
  }
};

// ===========================
// UTILIDADES DE PERFORMANCE
// ===========================
const Utils = {
  // Debounce para optimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle para scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Formatear fechas
  formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },

  // Sanitizar HTML
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  // Generar ID único
  generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }
};

// ===========================
// LAZY LOADING OPTIMIZADO
// ===========================
const LazyLoader = {
  observer: null,
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback para navegadores sin soporte
      this.loadAllImages();
    }
    
    this.setupImagePlaceholders();
  },

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: `${CONFIG.lazyLoadOffset}px`,
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observar todas las imágenes lazy
    document.querySelectorAll(CONFIG.selectors.lazyImages).forEach(img => {
      this.observer.observe(img);
    });
  },

  loadImage(img) {
    // Crear un elemento temporal para precargar
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Remover placeholder
      img.classList.remove('img-placeholder');
      
      // Aplicar la imagen real
      img.src = img.dataset.src;
      img.classList.add('loaded');
      
      // Remover data-src
      delete img.dataset.src;
      
      // Trigger evento personalizado
      img.dispatchEvent(new CustomEvent('imageLoaded', { 
        detail: { src: img.src } 
      }));
    };
    
    tempImg.onerror = () => {
      // Imagen por defecto en caso de error
      img.src = 'assets/images/placeholder.jpg';
      img.classList.add('error');
    };
    
    tempImg.src = img.dataset.src;
  },

  setupImagePlaceholders() {
    document.querySelectorAll(CONFIG.selectors.lazyImages).forEach(img => {
      img.classList.add('img-placeholder');
      
      // Agregar dimensiones si no las tiene
      if (!img.style.aspectRatio && img.dataset.aspectRatio) {
        img.style.aspectRatio = img.dataset.aspectRatio;
      }
    });
  },

  loadAllImages() {
    // Fallback: cargar todas las imágenes inmediatamente
    document.querySelectorAll(CONFIG.selectors.lazyImages).forEach(img => {
      this.loadImage(img);
    });
  }
};

// ===========================
// NAVEGACIÓN OPTIMIZADA
// ===========================
const Navigation = {
  isMenuOpen: false,
  
  init() {
    this.setupMenuToggle();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupScrollHeader();
  },

  setupMenuToggle() {
    const toggle = document.querySelector(CONFIG.selectors.navToggle);
    const mobileNav = document.querySelector(CONFIG.selectors.navMobile);
    
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        this.toggleMobileMenu(mobileNav, toggle);
      });
      
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
          this.closeMobileMenu(mobileNav, toggle);
        }
      });
    }
  },

  toggleMobileMenu(nav, toggle) {
    this.isMenuOpen = !this.isMenuOpen;
    
    nav.classList.toggle('active', this.isMenuOpen);
    toggle.setAttribute('aria-expanded', this.isMenuOpen);
    toggle.classList.toggle('active', this.isMenuOpen);
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  },

  closeMobileMenu(nav, toggle) {
    if (this.isMenuOpen) {
      this.toggleMobileMenu(nav, toggle);
    }
  },

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Cerrar menú móvil si está abierto
          const mobileNav = document.querySelector(CONFIG.selectors.navMobile);
          const toggle = document.querySelector(CONFIG.selectors.navToggle);
          if (mobileNav && toggle) {
            this.closeMobileMenu(mobileNav, toggle);
          }
        }
      });
    });
  },

  setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  },

  setupScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollHandler = Utils.throttle(() => {
      const scrolled = window.scrollY > 100;
      header.classList.toggle('scrolled', scrolled);
    }, 16);
    
    window.addEventListener('scroll', scrollHandler);
  }
};

// ===========================
// CALENDARIO LITÚRGICO OPTIMIZADO
// ===========================
const Calendar = {
  currentDate: new Date(),
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  santoralData: null,
  
  init() {
    this.loadSantoralData();
    this.setupCalendarNavigation();
    this.renderCalendar();
  },

  async loadSantoralData() {
    try {
      // Por ahora usamos datos estáticos, en el futuro se puede cambiar por API
      this.santoralData = await this.getSantoralData();
      this.updateCalendarWithSaintData();
    } catch (error) {
      console.warn('Error cargando datos del santoral:', error);
      this.santoralData = {};
    }
  },

  // Datos del santoral paraguayo (ejemplo)
  async getSantoralData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          // Enero
          '2025-01-01': { santo: 'Santa María, Madre de Dios', tipo: 'solemnidad' },
          '2025-01-06': { santo: 'Epifanía del Señor', tipo: 'solemnidad' },
          '2025-01-25': { santo: 'Conversión de San Pablo', tipo: 'fiesta' },
          
          // Febrero
          '2025-02-02': { santo: 'Presentación del Señor', tipo: 'fiesta' },
          '2025-02-14': { santo: 'San Cirilo y San Metodio', tipo: 'memoria' },
          
          // Marzo
          '2025-03-19': { santo: 'San José', tipo: 'solemnidad' },
          '2025-03-25': { santo: 'Anunciación del Señor', tipo: 'solemnidad' },
          
          // Abril
          '2025-04-25': { santo: 'San Marcos', tipo: 'fiesta' },
          
          // Mayo
          '2025-05-01': { santo: 'San José Obrero', tipo: 'memoria' },
          '2025-05-14': { santo: 'San Matías', tipo: 'fiesta' },
          '2025-05-31': { santo: 'Visitación de la Virgen María', tipo: 'fiesta' },
          
          // Junio
          '2025-06-24': { santo: 'Natividad de San Juan Bautista', tipo: 'solemnidad' },
          '2025-06-29': { santo: 'San Pedro y San Pablo', tipo: 'solemnidad' },
          
          // Julio
          '2025-07-03': { santo: 'Santo Tomás', tipo: 'fiesta' },
          '2025-07-11': { santo: 'San Benito', tipo: 'memoria' },
          '2025-07-22': { santo: 'Santa María Magdalena', tipo: 'memoria' },
          '2025-07-25': { santo: 'Santiago', tipo: 'fiesta' },
          
          // Agosto
          '2025-08-15': { santo: 'Asunción de la Virgen María', tipo: 'solemnidad' },
          '2025-08-24': { santo: 'San Bartolomé', tipo: 'fiesta' },
          
          // Septiembre
          '2025-09-08': { santo: 'Natividad de la Virgen María', tipo: 'fiesta' },
          '2025-09-14': { santo: 'Exaltación de la Santa Cruz', tipo: 'fiesta' },
          '2025-09-21': { santo: 'San Mateo', tipo: 'fiesta' },
          '2025-09-29': { santo: 'San Miguel, San Gabriel y San Rafael', tipo: 'fiesta' },
          
          // Octubre
          '2025-10-02': { santo: 'Santos Ángeles Custodios', tipo: 'memoria' },
          '2025-10-18': { santo: 'San Lucas', tipo: 'fiesta' },
          '2025-10-28': { santo: 'San Simón y San Judas', tipo: 'fiesta' },
          
          // Noviembre
          '2025-11-01': { santo: 'Todos los Santos', tipo: 'solemnidad' },
          '2025-11-02': { santo: 'Fieles Difuntos', tipo: 'conmemoracion' },
          '2025-11-30': { santo: 'San Andrés', tipo: 'fiesta' },
          
          // Diciembre
          '2025-12-08': { santo: 'Inmaculada Concepción', tipo: 'solemnidad' },
          '2025-12-25': { santo: 'Natividad del Señor', tipo: 'solemnidad' },
          '2025-12-26': { santo: 'San Esteban', tipo: 'fiesta' },
          '2025-12-27': { santo: 'San Juan', tipo: 'fiesta' },
          '2025-12-28': { santo: 'Santos Inocentes', tipo: 'fiesta' }
        });
      }, 100);
    });
  },

  setupCalendarNavigation() {
    const prevBtn = document.querySelector('.calendar-prev');
    const nextBtn = document.querySelector('.calendar-next');
    const todayBtn = document.querySelector('.calendar-today');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateMonth(-1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateMonth(1));
    }
    
    if (todayBtn) {
      todayBtn.addEventListener('click', () => this.goToToday());
    }
  },

  navigateMonth(direction) {
    this.currentMonth += direction;
    
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    
    this.renderCalendar();
  },

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.renderCalendar();
  },

  renderCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    const title = document.querySelector('.calendar-title');
    
    if (!calendar) return;
    
    // Actualizar título
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    if (title) {
      title.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }
    
    // Limpiar calendario
    calendar.innerHTML = '';
    
    // Agregar encabezados de días
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      calendar.appendChild(dayHeader);
    });
    
    // Obtener información del mes
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generar días del calendario
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayElement = this.createDayElement(date);
      calendar.appendChild(dayElement);
    }
  },

  createDayElement(date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayElement.appendChild(dayNumber);
    
    // Verificar si es el día actual
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isCurrentMonth = date.getMonth() === this.currentMonth;
    
    if (isToday) {
      dayElement.classList.add('today');
    }
    
    if (!isCurrentMonth) {
      dayElement.classList.add('other-month');
    }
    
    // Verificar si hay santo para este día
    const dateKey = this.formatDateKey(date);
    if (this.santoralData && this.santoralData[dateKey]) {
      const santoral = this.santoralData[dateKey];
      dayElement.classList.add('has-saint', santoral.tipo);
      
      const saintIndicator = document.createElement('div');
      saintIndicator.className = 'saint-indicator';
      saintIndicator.title = santoral.santo;
      dayElement.appendChild(saintIndicator);
      
      // Agregar tooltip
      dayElement.title = santoral.santo;
    }
    
    // Evento click
    dayElement.addEventListener('click', () => {
      this.showDayDetails(date, this.santoralData[dateKey]);
    });
    
    return dayElement;
  },

  formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  showDayDetails(date, saintData) {
    const modal = document.getElementById('day-modal') || this.createDayModal();
    const title = modal.querySelector('.modal-title');
    const content = modal.querySelector('.modal-content');
    
    if (title) {
      title.textContent = Utils.formatDate(date);
    }
    
    if (content) {
      if (saintData) {
        content.innerHTML = `
          <div class="saint-details">
            <h3>${Utils.sanitizeHTML(saintData.santo)}</h3>
            <p class="saint-type">${this.getSaintTypeText(saintData.tipo)}</p>
          </div>
        `;
      } else {
        content.innerHTML = '<p>No hay celebraciones especiales para este día.</p>';
      }
    }
    
    modal.style.display = 'block';
    modal.classList.add('active');
  },

  createDayModal() {
    const modal = document.createElement('div');
    modal.id = 'day-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title"></h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar cierre del modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    });
    
    return modal;
  },

  getSaintTypeText(type) {
    const types = {
      'solemnidad': 'Solemnidad',
      'fiesta': 'Fiesta',
      'memoria': 'Memoria',
      'conmemoracion': 'Conmemoración'
    };
    return types[type] || 'Celebración';
  },

  updateCalendarWithSaintData() {
    if (this.santoralData) {
      this.renderCalendar();
    }
  }
};

// ===========================
// GALERÍA OPTIMIZADA
// ===========================
const Gallery = {
  lightbox: null,
  currentIndex: 0,
  images: [],
  
  init() {
    this.setupGalleryItems();
    this.createLightbox();
    this.setupKeyboardNavigation();
  },

  setupGalleryItems() {
    const galleryItems = document.querySelectorAll(CONFIG.selectors.galleryItems);
    
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.images.push({
          src: img.src || img.dataset.src,
          alt: img.alt || 'Imagen del santuario',
          element: item
        });
        
        item.addEventListener('click', () => {
          this.openLightbox(index);
        });
        
        // Mejorar accesibilidad
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Ver imagen ${index + 1}`);
        
        // Soporte para teclado
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openLightbox(index);
          }
        });
      }
    });
  },

  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Cerrar lightbox">&times;</button>
        <button class="lightbox-prev" aria-label="Imagen anterior">&#8249;</button>
        <button class="lightbox-next" aria-label="Imagen siguiente">&#8250;</button>
        <img class="lightbox-image" alt="">
        <div class="lightbox-info">
          <span class="lightbox-counter"></span>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.lightbox);
    
    // Event listeners para la lightbox
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', () => this.closeLightbox());
    prevBtn.addEventListener('click', () => this.navigateImage(-1));
    nextBtn.addEventListener('click', () => this.navigateImage(1));
    
    // Cerrar al hacer clic en el fondo
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
  },

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el botón de cerrar para accesibilidad
    this.lightbox.querySelector('.lightbox-close').focus();
  },

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Devolver focus al elemento que abrió la lightbox
    if (this.images[this.currentIndex]) {
      this.images[this.currentIndex].element.focus();
    }
  },

  navigateImage(direction) {
    this.currentIndex += direction;
    
    if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }
    
    this.updateLightboxImage();
  },

  updateLightboxImage() {
    const image = this.images[this.currentIndex];
    if (!image) return;
    
    const lightboxImg = this.lightbox.querySelector('.lightbox-image');
    const counter = this.lightbox.querySelector('.lightbox-counter');
    
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      
      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.navigateImage(-1);
          break;
        case 'ArrowRight':
          this.navigateImage(1);
          break;
      }
    });
  }
};

// ===========================
// INICIALIZACIÓN PRINCIPAL
// ===========================
const App = {
  init() {
    // Verificar soporte del navegador
    this.checkBrowserSupport();
    
    // Inicializar módulos según disponibilidad
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeModules();
    });
    
    // Configurar service worker si está disponible
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  },

  checkBrowserSupport() {
    // Verificar funcionalidades críticas
    const features = {
      intersectionObserver: 'IntersectionObserver' in window,
      customElements: 'customElements' in window,
      es6Modules: 'noModule' in HTMLScriptElement.prototype
    };
    
    console.log('Browser support:', features);
    
    // Mostrar advertencia si el navegador es muy antiguo
    if (!features.intersectionObserver) {
      console.warn('IntersectionObserver no soportado, usando fallback');
    }
  },

  initializeModules() {
    console.log('Inicializando Santuario Diocesano v2.0...');
    
    try {
      // Inicializar lazy loading primero
      LazyLoader.init();
      
      // Inicializar navegación
      Navigation.init();
      
      // Inicializar calendario si existe
      if (document.querySelector('.calendar-container')) {
        Calendar.init();
      }
      
      // Inicializar galería si existe
      if (document.querySelector(CONFIG.selectors.galleryItems)) {
        Gallery.init();
      }
      
      // Inicializar animaciones de entrada
      this.initializeAnimations();
      
      console.log('✅ Todos los módulos inicializados correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando módulos:', error);
    }
  },

  initializeAnimations() {
    // Animaciones de entrada para elementos visibles
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.animate || 'fade-in-up';
          
          element.classList.add(animation);
          animationObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
  },

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
    } catch (error) {
      console.log('Service Worker no disponible:', error);
    }
  }
};

// ===========================
// OPTIMIZACIONES ADICIONALES
// ===========================

// Preload de recursos críticos
const ResourcePreloader = {
  preloadCriticalImages() {
    const criticalImages = [
      'assets/images/portada.jpg',
      'assets/images/logo.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
};

// Monitoreo de performance
const PerformanceMonitor = {
  init() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Performance metrics:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalLoad: perfData.loadEventEnd - perfData.fetchStart
          });
        }, 0);
      });
    }
  }
};

// ===========================
// INICIO DE LA APLICACIÓN
// ===========================

// Inicializar la aplicación
App.init();

// Inicializar monitores de performance
PerformanceMonitor.init();

// Precargar recursos críticos
ResourcePreloader.preloadCriticalImages();

// Exportar para debugging (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.SantuarioApp = {
    Utils,
    LazyLoader,
    Navigation,
    Calendar,
    Gallery,
    CONFIG
  };
}
