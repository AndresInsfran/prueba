/* ===========================
   MENÚ MÓVIL - JAVASCRIPT MEJORADO
   =========================== */

class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navMobile = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.handleResize();
    console.log('Menú móvil inicializado');
  }

  setupElements() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.navMobile = document.getElementById('nav-mobile');
    
    if (!this.menuToggle || !this.navMobile) {
      console.log('Elementos del menú móvil no encontrados');
      return;
    }
  }

  setupEventListeners() {
    if (!this.menuToggle || !this.navMobile) return;

    // Toggle del menú
    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Cerrar menú al hacer click en un enlace
    const mobileLinks = this.navMobile.querySelectorAll('.nav-mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.menuToggle.contains(e.target) && 
          !this.navMobile.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Cerrar menú con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Manejar cambio de tamaño de ventana
    window.addEventListener('resize', () => this.handleResize());
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.menuToggle || !this.navMobile) return;
    
    this.isOpen = true;
    this.menuToggle.classList.add('active');
    this.navMobile.classList.add('active');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Agregar atributos de accesibilidad
    this.menuToggle.setAttribute('aria-expanded', 'true');
    this.navMobile.setAttribute('aria-hidden', 'false');
  }

  closeMenu() {
    if (!this.menuToggle || !this.navMobile) return;
    
    this.isOpen = false;
    this.menuToggle.classList.remove('active');
    this.navMobile.classList.remove('active');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Actualizar atributos de accesibilidad
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.navMobile.setAttribute('aria-hidden', 'true');
  }

  handleResize() {
    // Cerrar menú en pantallas grandes
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMenu();
    }
  }
}
    this.overlay.addEventListener('click', () => {
      this.closeMenu();
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Cerrar al hacer click en enlaces
    const mobileLinks = this.navMobile.querySelectorAll('.nav-mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Añadir pequeño delay para smooth scroll
        setTimeout(() => {
          this.closeMenu();
        }, 100);
      });
    });

    // Cerrar al redimensionar ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Prevenir scroll del body cuando el menú está abierto
    this.navMobile.addEventListener('touchmove', (e) => {
      if (this.isOpen) {
        e.stopPropagation();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    this.menuToggle.classList.add('active');
    this.navMobile.classList.add('active');
    this.overlay.classList.add('active');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Añadir clase al header para indicar menú abierto
    const header = document.querySelector('.header');
    if (header) {
      header.classList.add('menu-open');
    }

    // Enfocar el primer enlace para accesibilidad
    const firstLink = this.navMobile.querySelector('.nav-mobile-link');
    if (firstLink) {
      setTimeout(() => {
        firstLink.focus();
      }, 300);
    }
  }

  closeMenu() {
    this.isOpen = false;
    this.menuToggle.classList.remove('active');
    this.navMobile.classList.remove('active');
    this.overlay.classList.remove('active');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Remover clase del header
    const header = document.querySelector('.header');
    if (header) {
      header.classList.remove('menu-open');
    }
  }

  // Método para abrir/cerrar programáticamente
  setMenuState(isOpen) {
    if (isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  // Método para destruir el menú si es necesario
  destroy() {
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleMenu);
    }
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.closeMenu);
      this.overlay.remove();
    }
    document.removeEventListener('keydown', this.closeMenu);
    window.removeEventListener('resize', this.closeMenu);
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = new MobileMenu();
  
  // Hacer disponible globalmente si es necesario
  window.MobileMenu = mobileMenu;
});

// Optimización para mejor rendimiento en móviles
if ('serviceWorker' in navigator) {
  // Precargar recursos críticos del menú
  const preloadLinks = [
    'assets/css/mobile-optimizations.css'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}
