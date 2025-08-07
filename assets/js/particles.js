/* ===========================
   SISTEMA DE PARTÍCULAS PARA LA PORTADA
   =========================== */

class ParticleSystem {
  constructor() {
    this.container = null;
    this.particles = [];
    this.maxParticles = 25;
    this.isActive = false;
    this.animationId = null;
    this.init();
  }

  init() {
    this.container = document.getElementById('particles-container');
    if (!this.container) {
      console.log('No se encontró el contenedor de partículas');
      return;
    }

    // Verificar si el usuario prefiere menos movimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.maxParticles = 8;
    }

    // Ajustar número de partículas según el dispositivo
    if (window.innerWidth <= 480) {
      this.maxParticles = 12;
    } else if (window.innerWidth <= 768) {
      this.maxParticles = 18;
    }

    this.createParticles();
    this.startAnimation();
    this.setupVisibilityControl();
    
    console.log(`Sistema de partículas inicializado con ${this.maxParticles} partículas`);
  }

  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tipos de partículas
    const types = ['golden', 'white', 'light-gold'];
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const effects = ['', 'drift', 'glow'];
    
    // Asignar tipo aleatorio
    const type = types[Math.floor(Math.random() * types.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    
    particle.classList.add(type, size);
    if (effect) particle.classList.add(effect);
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    
    // Delay aleatorio para que no todas empiecen al mismo tiempo
    particle.style.animationDelay = -Math.random() * 10 + 's';
    
    // Duración aleatoria para más variedad
    const duration = 6 + Math.random() * 4; // Entre 6 y 10 segundos
    particle.style.animationDuration = duration + 's';
    
    this.container.appendChild(particle);
    this.particles.push(particle);
    
    // Remover la partícula cuando termine su animación y crear una nueva
    setTimeout(() => {
      if (this.isActive && particle.parentNode) {
        particle.parentNode.removeChild(particle);
        const index = this.particles.indexOf(particle);
        if (index > -1) {
          this.particles.splice(index, 1);
        }
        // Crear nueva partícula para mantener el número constante
        if (this.particles.length < this.maxParticles) {
          this.createParticle();
        }
      }
    }, duration * 1000);
  }

  startAnimation() {
    this.isActive = true;
    
    // Crear nuevas partículas periódicamente
    const createNewParticle = () => {
      if (this.isActive && this.particles.length < this.maxParticles) {
        this.createParticle();
      }
      
      if (this.isActive) {
        // Intervalo aleatorio entre 300ms y 800ms
        const nextInterval = 300 + Math.random() * 500;
        setTimeout(createNewParticle, nextInterval);
      }
    };
    
    // Comenzar a crear partículas después de un pequeño delay
    setTimeout(createNewParticle, 1000);
  }

  stopAnimation() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  setupVisibilityControl() {
    // Observer para pausar las partículas cuando no están visibles
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.resumeParticles();
        } else {
          this.pauseParticles();
        }
      });
    });

    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      observer.observe(heroSection);
    }

    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseParticles();
      } else {
        this.resumeParticles();
      }
    });
  }

  pauseParticles() {
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'paused';
    });
  }

  resumeParticles() {
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'running';
    });
  }

  // Método para ajustar el número de partículas dinámicamente
  setMaxParticles(newMax) {
    this.maxParticles = newMax;
    
    // Si tenemos demasiadas partículas, remover algunas
    while (this.particles.length > this.maxParticles) {
      const particle = this.particles.pop();
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }
  }

  // Destruir el sistema de partículas
  destroy() {
    this.stopAnimation();
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
    console.log('Sistema de partículas destruido');
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la página principal (que tiene la portada)
  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    const particleSystem = new ParticleSystem();
    
    // Hacer disponible globalmente para control externo
    window.ParticleSystem = particleSystem;
    
    // Ajustar partículas en resize de ventana
    window.addEventListener('resize', () => {
      let newMax = 25;
      
      if (window.innerWidth <= 480) {
        newMax = 12;
      } else if (window.innerWidth <= 768) {
        newMax = 18;
      }
      
      particleSystem.setMaxParticles(newMax);
    });
  }
});

// Cleanup cuando se sale de la página
window.addEventListener('beforeunload', () => {
  if (window.ParticleSystem) {
    window.ParticleSystem.destroy();
  }
});
