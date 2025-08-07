/* ===========================
   SCRIPT PRINCIPAL DEL PROYECTO
   =========================== */

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Santuario Web - Inicializando...');
  
  // Inicializar módulos principales
  initializeScrollEffects();
  initializeAnimations();
  
  console.log('✅ Santuario Web - Inicialización completada');
});

// Efectos de scroll
function initializeScrollEffects() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll para enlaces de navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Animaciones al hacer scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observar elementos con clase fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}