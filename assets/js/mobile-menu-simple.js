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
  
  // Cerrar menú en cambio de tamaño de pantalla
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isOpen) {
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
  
  console.log('Menú móvil simplificado inicializado correctamente');
});
