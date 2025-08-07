/* ===========================
   MENÚ MÓVIL - JAVASCRIPT MEJORADO
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  
  if (!menuToggle || !navMobile) {
    console.warn('Elementos del menú móvil no encontrados');
    return;
  }
  
  let isOpen = false;
  let overlay = null;
  
  // Crear overlay dinámicamente
  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-mobile-overlay';
      document.body.appendChild(overlay);
      
      // Cerrar menú al hacer click en overlay
      overlay.addEventListener('click', closeMenu);
    }
  }
  
  // Toggle del menú con mejor feedback
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Efecto de vibración en dispositivos compatibles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    isOpen = !isOpen;
    
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  
  // Cerrar menú al hacer click en un enlace con animación suave
  const mobileLinks = navMobile.querySelectorAll('.nav-mobile-link');
  mobileLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      // Agregar efecto visual al link clickeado
      this.style.transform = 'translateX(8px) scale(0.95)';
      this.style.transition = 'transform 0.2s ease';
      
      setTimeout(() => {
        this.style.transform = '';
        closeMenu();
      }, 200);
    });
    
    // Agregar indicador de página activa
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetSection = href.substring(1);
      if (window.location.hash === href || 
          (window.location.hash === '' && targetSection === 'inicio')) {
        link.classList.add('active');
      }
    }
  });
  
  // Cerrar menú al hacer click fuera con mejor detección
  document.addEventListener('click', function(e) {
    if (isOpen && 
        !menuToggle.contains(e.target) && 
        !navMobile.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Cerrar menú con tecla ESC y otras teclas de accesibilidad
  document.addEventListener('keydown', function(e) {
    if (isOpen) {
      if (e.key === 'Escape') {
        closeMenu();
        menuToggle.focus(); // Devolver focus al botón
      }
      
      // Navegación con teclas Tab dentro del menú
      if (e.key === 'Tab') {
        trapFocus(e);
      }
    }
  });
  
  // Trap focus dentro del menú para accesibilidad
  function trapFocus(e) {
    const focusableElements = navMobile.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
  
  // Cerrar menú en cambio de tamaño de pantalla con debounce
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768 && isOpen) {
        closeMenu();
      }
    }, 250);
  });
  
  // Actualizar enlace activo en scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = navMobile.querySelector(`a[href="#${sectionId}"]`);
      
      if (correspondingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          // Remover clase active de todos los enlaces
          mobileLinks.forEach(link => link.classList.remove('active'));
          // Agregar clase active al enlace actual
          correspondingLink.classList.add('active');
        }
      }
    });
  }
  
  // Throttle para mejor performance en scroll
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        updateActiveLink();
        scrollTimeout = null;
      }, 100);
    }
  });
  
  function openMenu() {
    isOpen = true;
    createOverlay();
    
    // Animaciones escalonadas
    menuToggle.classList.add('active');
    navMobile.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
    
    // Focus en el primer enlace para accesibilidad
    setTimeout(() => {
      const firstLink = navMobile.querySelector('.nav-mobile-link');
      if (firstLink) {
        firstLink.focus();
      }
    }, 400);
    
    // Agregar atributos ARIA
    menuToggle.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
  }
  
  function closeMenu() {
    if (!isOpen) return;
    
    isOpen = false;
    
    // Animación de cierre
    navMobile.classList.add('closing');
    
    setTimeout(() => {
      menuToggle.classList.remove('active');
      navMobile.classList.remove('active', 'closing');
      if (overlay) {
        overlay.classList.remove('active');
      }
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      
      // Restaurar scroll position si fue alterada
      document.body.style.top = '';
      
      // Atributos ARIA
      menuToggle.setAttribute('aria-expanded', 'false');
      navMobile.setAttribute('aria-hidden', 'true');
    }, 100);
  }
  
  // Inicializar atributos ARIA
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'nav-mobile');
  menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  navMobile.setAttribute('aria-hidden', 'true');
  navMobile.setAttribute('role', 'navigation');
  navMobile.setAttribute('aria-label', 'Menú de navegación móvil');
  
  console.log('Menú móvil mejorado inicializado correctamente');
});
