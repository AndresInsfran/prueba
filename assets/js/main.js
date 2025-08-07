/* ===========================
   MAIN APPLICATION ENTRY POINT
   =========================== */

/* ===========================
   NAVIGATION FUNCTIONALITY
   =========================== */
const Navigation = {
  init() {
    this.bindEvents();
    this.setupScrollEffect();
  },

  bindEvents() {
    // Mobile menu toggle
    window.toggleMobileMenu = () => {
      const mobileNav = document.getElementById('mobile-nav');
      const menuIcon = document.getElementById('menu-icon');
      
      if (mobileNav && menuIcon) {
        mobileNav.classList.toggle('active');
        menuIcon.className = mobileNav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        menuIcon.classList.add('animated');
        setTimeout(() => menuIcon.classList.remove('animated'), 300);
      }
    };

    // Close mobile menu
    window.closeMobileMenu = () => {
      const mobileNav = document.getElementById('mobile-nav');
      const menuIcon = document.getElementById('menu-icon');
      
      if (mobileNav && menuIcon) {
        mobileNav.classList.remove('active');
        menuIcon.className = 'fas fa-bars';
      }
    };

    // Auto-close mobile menu on link click
    document.querySelectorAll('.nav-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        window.closeMobileMenu();
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      const mobileNav = document.getElementById('mobile-nav');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      
      if (mobileNav && menuBtn && 
          !mobileNav.contains(e.target) && 
          !menuBtn.contains(e.target) && 
          mobileNav.classList.contains('active')) {
        window.closeMobileMenu();
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const offset = document.querySelector('.header').offsetHeight;
          window.scrollTo({ 
            top: target.offsetTop - offset, 
            behavior: 'smooth' 
          });
          window.closeMobileMenu();
        }
      });
    });
  },

  setupScrollEffect() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }
};

/* ===========================
   ANIMATIONS FUNCTIONALITY
   =========================== */
const Animations = {
  init() {
    this.setupScrollAnimations();
    this.createFloatingParticles();
  },

  setupScrollAnimations() {
    // Animate elements on scroll
    const animateOnScroll = () => {
      document.querySelectorAll('.fade-in, .animated-fadein').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('visible');
        }
      });
    };

    // Initial check and scroll listener
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.fade-in, .animated-fadein').forEach(el => {
        observer.observe(el);
      });
    }
  },

  createFloatingParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Clear existing particles
    const existingParticles = hero.querySelector('.floating-particles');
    if (existingParticles) {
      existingParticles.remove();
    }

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    
    // Create different types of particles
    const particleConfig = [
      { type: 'particle', symbol: '', count: 15 },
      { type: 'particle-cross', symbol: '✝', count: 8 },
      { type: 'particle-star', symbol: '✨', count: 10 },
      { type: 'particle-glow', symbol: '', count: 12 }
    ];

    particleConfig.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const particle = document.createElement('div');
        particle.className = config.type;
        
        if (config.symbol) {
          particle.innerHTML = config.symbol;
        }
        
        // Random positioning and styling
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 6 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particle.style.opacity = Math.random() * 0.6 + 0.3;
        
        particlesContainer.appendChild(particle);
      }
    });
    
    hero.appendChild(particlesContainer);
  }
};

/* ===========================
   MODALS FUNCTIONALITY
   =========================== */
const Modals = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Event bindings for navigation and other functionality
    // Historia modal functions are handled in advanced-gallery.js
  }
};

/* ===========================
   UTILITIES
   =========================== */
const Utils = {
  init() {
    this.setupPageLoader();
    this.setupPerformanceOptimizations();
  },

  setupPageLoader() {
    // Page loader functionality
    window.addEventListener('load', () => {
      const loader = document.querySelector('.page-loader');
      if (loader) {
        setTimeout(() => {
          loader.classList.add('hidden');
          setTimeout(() => {
            loader.remove();
          }, 800);
        }, 500);
      }
    });
  },

  setupPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Debounced scroll handler
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        document.documentElement.style.setProperty('--scroll-top', window.scrollY + 'px');
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
};

/* ===========================
   APPLICATION INITIALIZATION
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  Navigation.init();
  Animations.init();
  Modals.init();
  Utils.init();
  
  // Initialize Gallery and Carousel
  if (typeof Gallery !== 'undefined') {
    Gallery.init();
  }

  // Event listener alternativo para el botón de historia
  const btnHistoria = document.querySelector('.btn-historia');
  if (btnHistoria) {
    console.log('✅ Botón de historia encontrado, añadiendo event listener');
    btnHistoria.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🔄 Event listener activado');
      if (typeof window.abrirModalHistoria === 'function') {
        window.abrirModalHistoria();
      } else {
        console.error('❌ Función abrirModalHistoria no encontrada');
        alert('Error: Función no encontrada');
      }
    });
  } else {
    console.error('❌ Botón de historia no encontrado');
  }

  console.log('🏛️ Santuario website initialized successfully');
});

// Asegurar carga correcta de imagen de portada
document.addEventListener('DOMContentLoaded', function() {
  const imagenPortada = document.querySelector('.img-portada');
  
  if (imagenPortada) {
    // Verificar si la imagen se carga correctamente
    imagenPortada.addEventListener('load', function() {
      console.log('✅ Imagen de portada cargada correctamente');
      imagenPortada.style.opacity = '1';
    });
    
    imagenPortada.addEventListener('error', function() {
      console.error('❌ Error al cargar imagen de portada');
      // Fallback: usar imagen de fondo CSS
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundImage = 'url("assets/images/portada.jpg")';
      }
    });
    
    // Forzar recarga si no está visible después de 2 segundos
    setTimeout(() => {
      if (imagenPortada.naturalWidth === 0) {
        console.log('🔄 Forzando recarga de imagen de portada');
        imagenPortada.src = imagenPortada.src;
      }
    }, 2000);
  }
});

// Legacy support comments
// Código de carrusel removido para reimplementación
// Código de lightbox removido para reimplementación
// Código de calendario removido para reimplementación
// Código de evangelio removido para reimplementación
