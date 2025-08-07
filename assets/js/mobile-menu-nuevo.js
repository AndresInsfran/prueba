/* ===========================
   MENÚ MÓVIL - JAVASCRIPT SIMPLE
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const body = document.body;
  
  // Verificar que existen los elementos
  if (!menuToggle || !navMobile) {
    console.warn('Elementos del menú móvil no encontrados');
    return;
  }
  
  let isMenuOpen = false;
  let overlay = null;
  
  // Crear overlay
  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-mobile-overlay';
      body.appendChild(overlay);
      
      // Cerrar menú al hacer click en overlay
      overlay.addEventListener('click', closeMenu);
    }
  }
  
  // Abrir menú
  function openMenu() {
    isMenuOpen = true;
    createOverlay();
    
    menuToggle.classList.add('active');
    navMobile.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
    
    // Actualizar aria-expanded
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  
  // Cerrar menú
  function closeMenu() {
    isMenuOpen = false;
    
    menuToggle.classList.remove('active');
    navMobile.classList.remove('active');
    body.classList.remove('menu-open');
    
    if (overlay) {
      overlay.classList.remove('active');
    }
    
    // Actualizar aria-expanded
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  
  // Toggle del menú
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Cerrar menú al hacer click en un enlace
  const mobileLinks = navMobile.querySelectorAll('.nav-mobile-link');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
  
  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
  
  // Cerrar menú al cambiar orientación o redimensionar
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMenuOpen) {
      closeMenu();
    }
  });
  
  // Prevenir scroll del body cuando el menú está abierto
  function preventScroll(e) {
    if (isMenuOpen) {
      e.preventDefault();
    }
  }
  
  // Manejar eventos de touch para prevenir scroll
  document.addEventListener('touchmove', preventScroll, { passive: false });
});
