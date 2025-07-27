/* ===========================
   NAVIGATION MODULE
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
        menuIcon.classList.toggle('animated');
      }
    };

    // Close mobile menu
    window.closeMobileMenu = () => {
      const mobileNav = document.getElementById('mobile-nav');
      const menuIcon = document.getElementById('menu-icon');
      
      if (mobileNav && menuIcon) {
        mobileNav.classList.remove('active');
        menuIcon.classList.remove('animated');
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

// Global functions for navigation
window.toggleMobileMenu = () => Navigation.toggleMobileMenu();
window.closeMobileMenu = () => Navigation.closeMobileMenu();

// Make Navigation available globally
window.Navigation = Navigation;
