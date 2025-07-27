/* ===========================
   ANIMATIONS MODULE
   =========================== */
const Animations = {
  init() {
    this.setupScrollAnimations();
    this.createFloatingParticles();
  },

  setupScrollAnimations() {
    // Animate elements on scroll
    const animateOnScroll = () => {
      document.querySelectorAll(".fade-in, .animated-fadein").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };

    // Initial check and scroll listener
    animateOnScroll();
    window.addEventListener("scroll", animateOnScroll);
    window.addEventListener("load", animateOnScroll);

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

    // Create particles container if it doesn't exist
    let particlesContainer = hero.querySelector('.floating-particles');
    if (!particlesContainer) {
      particlesContainer = document.createElement('div');
      particlesContainer.className = 'floating-particles';
      hero.appendChild(particlesContainer);
    }

    // Clear existing particles
    particlesContainer.innerHTML = '';

    const particleTypes = [
      { class: 'particle', content: '', count: 15 },
      { class: 'particle-cross', content: '✝', count: 8 },
      { class: 'particle-star', content: '✨', count: 10 },
      { class: 'particle-glow', content: '', count: 12 }
    ];

    particleTypes.forEach(type => {
      for (let i = 0; i < type.count; i++) {
        const particle = document.createElement('div');
        particle.className = type.class;
        
        if (type.content) {
          particle.textContent = type.content;
        }

        // Random positioning and sizing
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 5 + 8;

        particle.style.cssText = `
          left: ${left}%;
          width: ${size}px;
          height: ${size}px;
          animation-delay: -${delay}s;
          animation-duration: ${duration}s;
        `;

        particlesContainer.appendChild(particle);
      }
    });
  },

  // Utility function for smooth scrolling
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
};

// Make Animations available globally
window.Animations = Animations;
