/* ===========================
   MENÚ MÓVIL - JAVASCRIPT SIMPLIFICADO
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  
  if (!menuToggle || !navMobile) {
    console.warn('Elementos del menú móvil no encontrados');
    return;
  }
  
  let isOpen = false;
  
  // Toggle del menú
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isOpen = !isOpen;
    
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  
  // Cerrar menú al hacer click en un enlace
  const mobileLinks = navMobile.querySelectorAll('.nav-mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', function(e) {
    if (isOpen && 
        !menuToggle.contains(e.target) && 
        !navMobile.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Cerrar menú con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
  
  function openMenu() {
    isOpen = true;
    menuToggle.classList.add('active');
    navMobile.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    isOpen = false;
    menuToggle.classList.remove('active');
    navMobile.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  console.log('Menú móvil inicializado correctamente');
});
      this.toggleMenu();
    });

    // Cerrar menú al hacer click en un enlace
    const mobileLinks = this.navMobile.querySelectorAll('.nav-mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Cerrar menú al hacer click en el overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }

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
    
    if (this.overlay) {
      this.overlay.classList.add('active');
    }
    
    if (this.header) {
      this.header.classList.add('menu-open');
    }
    
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
    
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    
    if (this.header) {
      this.header.classList.remove('menu-open');
    }
    
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

// Inicializar el menú móvil cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});

// Funcionalidad adicional para smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll para todos los enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Solo aplicar smooth scroll a enlaces internos
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calcular offset del header
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

// Header scroll effect
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
