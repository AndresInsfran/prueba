/* ===========================
   UTILITIES MODULE
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
  },

  // Utility functions
  formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },

  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  isMobile() {
    return window.innerWidth <= 768;
  },

  isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  isDesktop() {
    return window.innerWidth > 1024;
  },

  // Local storage helpers
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return null;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Could not remove from localStorage:', e);
      }
    }
  },

  // Event emitter for custom events
  events: {
    listeners: {},

    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    },

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => callback(data));
      }
    },

    off(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    }
  }
};

// Make Utils available globally
window.Utils = Utils;
