/* ===========================
   CALENDARIO DEL SANTUARIO - JAVASCRIPT
   =========================== */

class CalendarioSantuario {
  constructor() {
    this.notificacionesActivas = localStorage.getItem('calendario-notificaciones') === 'true';
    this.calendarioId = null; // Se configurará con el ID real del calendario
    this.eventos = [];
    this.init();
  }

  init() {
    this.setupNotificaciones();
    this.cargarEventos();
    this.setupAnimaciones();
    
    // Actualizar calendario cada hora
    setInterval(() => {
      this.cargarEventos();
    }, 3600000);
  }

  // Configurar sistema de notificaciones
  setupNotificaciones() {
    const btn = document.querySelector('.btn-calendario[onclick*="configurarNotificaciones"]');
    const icon = document.getElementById('bell-icon');
    const text = document.getElementById('notif-text');
    
    if (btn && icon && text) {
      this.actualizarEstadoNotificaciones(btn, icon, text);
    }
  }

  configurarNotificaciones() {
    if (!('Notification' in window)) {
      this.mostrarMensaje('Tu navegador no soporta notificaciones', 'warning');
      return;
    }

    if (this.notificacionesActivas) {
      // Desactivar notificaciones
      this.notificacionesActivas = false;
      localStorage.setItem('calendario-notificaciones', 'false');
      this.mostrarMensaje('Notificaciones desactivadas', 'info');
    } else {
      // Solicitar permisos para notificaciones
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.notificacionesActivas = true;
          localStorage.setItem('calendario-notificaciones', 'true');
          this.mostrarMensaje('¡Notificaciones activadas! Te avisaremos de eventos importantes', 'success');
          
          // Notificación de prueba
          setTimeout(() => {
            this.enviarNotificacion(
              'Santuario Diocesano',
              '¡Notificaciones configuradas correctamente! 🙏',
              'assets/images/logo.png'
            );
          }, 2000);
        } else {
          this.mostrarMensaje('Permisos denegados. Activa las notificaciones en la configuración del navegador', 'error');
        }
      });
    }

    // Actualizar UI
    const btn = document.querySelector('.btn-calendario[onclick*="configurarNotificaciones"]');
    const icon = document.getElementById('bell-icon');
    const text = document.getElementById('notif-text');
    
    if (btn && icon && text) {
      this.actualizarEstadoNotificaciones(btn, icon, text);
    }
  }

  actualizarEstadoNotificaciones(btn, icon, text) {
    if (this.notificacionesActivas) {
      btn.classList.add('activo');
      icon.className = 'fas fa-bell';
      text.textContent = 'Desactivar';
    } else {
      btn.classList.remove('activo');
      icon.className = 'fas fa-bell-slash';
      text.textContent = 'Activar';
    }
  }

  // Cargar eventos del calendario
  async cargarEventos() {
    try {
      // Aquí puedes integrar con Google Calendar API
      // Por ahora, simulamos algunos eventos
      this.eventos = this.obtenerEventosEjemplo();
      this.verificarEventosProximos();
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  obtenerEventosEjemplo() {
    const hoy = new Date();
    const eventos = [
      {
        titulo: 'Misa Dominical',
        fecha: new Date(hoy.getTime() + 24 * 60 * 60 * 1000), // Mañana
        descripcion: 'Misa dominical especial con bendición'
      },
      {
        titulo: 'Novena de la Virgen del Perpetuo Socorro',
        fecha: new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        descripcion: 'Novena especial los martes'
      },
      {
        titulo: 'Adoración Eucarística',
        fecha: new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000), // En una semana
        descripcion: 'Adoración al Santísimo Sacramento'
      }
    ];
    
    return eventos;
  }

  verificarEventosProximos() {
    if (!this.notificacionesActivas) return;
    
    const ahora = new Date();
    const enUnHora = new Date(ahora.getTime() + 60 * 60 * 1000);
    const mañana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    
    this.eventos.forEach(evento => {
      const tiempoHastaEvento = evento.fecha.getTime() - ahora.getTime();
      
      // Notificar 1 día antes
      if (tiempoHastaEvento > 0 && tiempoHastaEvento <= 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          this.enviarNotificacion(
            'Evento mañana',
            `${evento.titulo} - ${evento.descripcion}`,
            'assets/images/logo.png'
          );
        }, 5000); // Delay de 5 segundos para no spamear
      }
      
      // Notificar 1 hora antes
      if (tiempoHastaEvento > 0 && tiempoHastaEvento <= 60 * 60 * 1000) {
        setTimeout(() => {
          this.enviarNotificacion(
            'Evento en 1 hora',
            `${evento.titulo} comienza pronto`,
            'assets/images/logo.png'
          );
        }, 10000);
      }
    });
  }

  enviarNotificacion(titulo, mensaje, icono = null) {
    if (this.notificacionesActivas && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(titulo, {
        body: mensaje,
        icon: icono || 'assets/images/logo.png',
        badge: 'assets/images/logo.png',
        tag: 'santuario-evento',
        requireInteraction: false,
        silent: false
      });

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Manejar click en notificación
      notification.onclick = () => {
        window.focus();
        notification.close();
        document.getElementById('calendario')?.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  // Configurar animaciones
  setupAnimaciones() {
    const calendarioWrapper = document.querySelector('.calendario-wrapper');
    const infoCards = document.querySelectorAll('.info-card');
    
    if (calendarioWrapper) {
      calendarioWrapper.classList.add('calendario-fade-in');
      
      // Observer para animar cuando entre en viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(calendarioWrapper);
      
      infoCards.forEach(card => {
        observer.observe(card);
        card.classList.add('calendario-fade-in');
      });
    }
  }

  // Mostrar mensajes al usuario
  mostrarMensaje(mensaje, tipo = 'info') {
    const colores = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    
    const iconos = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    const notif = document.createElement('div');
    notif.className = 'calendario-notificacion';
    notif.innerHTML = `
      <i class="${iconos[tipo]}"></i>
      <span>${mensaje}</span>
    `;
    
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colores[tipo]};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 14px;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 300px;
    `;
    
    document.body.appendChild(notif);
    
    // Mostrar con animación
    setTimeout(() => {
      notif.style.opacity = '1';
      notif.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (notif.parentNode) {
          notif.parentNode.removeChild(notif);
        }
      }, 300);
    }, 4000);
  }

  // Método para compartir evento
  compartirEvento(evento) {
    const texto = `📅 ${evento.titulo}\n📅 ${evento.fecha.toLocaleDateString('es-ES')}\n📍 Santuario Diocesano del Santísimo Sacramento\n\n${evento.descripcion}`;
    
    if (navigator.share) {
      navigator.share({
        title: evento.titulo,
        text: texto,
        url: window.location.href + '#calendario'
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard?.writeText(texto).then(() => {
        this.mostrarMensaje('Evento copiado al portapapeles', 'success');
      });
    }
  }
}

// Instancia global
window.CalendarioSantuario = CalendarioSantuario;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.calendarioSantuario = new CalendarioSantuario();
});

// Hacer métodos disponibles globalmente para onclick
window.CalendarioSantuario = {
  configurarNotificaciones() {
    if (window.calendarioSantuario) {
      window.calendarioSantuario.configurarNotificaciones();
    }
  }
};
