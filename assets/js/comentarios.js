/* ===========================
   SISTEMA DE COMENTARIOS Y TESTIMONIOS
   =========================== */

class SistemaComentarios {
  constructor() {
    this.comentariosPendientes = [];
    this.comentariosAprobados = [];
    this.isAdmin = false;
    this.init();
  }

  init() {
    this.setupFormHandler();
    this.loadComentarios();
    this.setupAdminAccess();
    console.log('Sistema de comentarios inicializado');
  }

  setupFormHandler() {
    const form = document.getElementById('form-comentario');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitComentario();
    });
  }

  submitComentario() {
    const formData = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      tipo: document.getElementById('tipo-comentario').value,
      comentario: document.getElementById('comentario').value.trim(),
      aceptaPublicacion: document.getElementById('acepta-publicacion').checked,
      fecha: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Validaciones
    if (!formData.nombre || !formData.comentario) {
      this.showMessage('Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    if (!formData.aceptaPublicacion) {
      this.showMessage('Debes aceptar la publicación de tu testimonio.', 'error');
      return;
    }

    // Simular envío (en producción, enviarías a un servidor/email)
    this.saveComentarioPendiente(formData);
    this.showMessage(
      '¡Gracias por compartir tu testimonio! Será revisado y publicado pronto.',
      'exito'
    );
    
    // Limpiar formulario
    document.getElementById('form-comentario').reset();
  }

  saveComentarioPendiente(comentario) {
    // En una implementación real, esto se enviaría por email o se guardaría en una base de datos
    this.comentariosPendientes.push(comentario);
    localStorage.setItem('comentarios_pendientes', JSON.stringify(this.comentariosPendientes));
    
    // Simular notificación al administrador
    console.log('Nuevo comentario pendiente:', comentario);
    
    // Actualizar panel de admin si está visible
    if (this.isAdmin) {
      this.updateAdminPanel();
    }
  }

  loadComentarios() {
    // Cargar comentarios pendientes del localStorage
    const pendientes = localStorage.getItem('comentarios_pendientes');
    if (pendientes) {
      this.comentariosPendientes = JSON.parse(pendientes);
    }

    // Cargar comentarios aprobados del localStorage
    const aprobados = localStorage.getItem('comentarios_aprobados');
    if (aprobados) {
      this.comentariosAprobados = JSON.parse(aprobados);
      this.renderComentariosAprobados();
    }
  }

  renderComentariosAprobados() {
    const container = document.getElementById('comentarios-grid');
    if (!container) return;

    // Mantener comentarios de ejemplo y agregar los nuevos aprobados
    const comentariosExistentes = container.querySelectorAll('.comentario-card').length;
    
    this.comentariosAprobados.forEach(comentario => {
      const comentarioCard = this.createComentarioCard(comentario);
      container.appendChild(comentarioCard);
    });
  }

  createComentarioCard(comentario) {
    const card = document.createElement('div');
    card.className = 'comentario-card';
    
    const inicial = comentario.nombre.charAt(0).toUpperCase();
    const fecha = new Date(comentario.fecha).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });

    const tipoLabels = {
      'testimonio': 'Testimonio',
      'agradecimiento': 'Agradecimiento',
      'oracion-respondida': 'Oración Respondida',
      'experiencia': 'Experiencia',
      'sugerencia': 'Sugerencia'
    };

    card.innerHTML = `
      <div class="comentario-tipo">${tipoLabels[comentario.tipo] || 'Testimonio'}</div>
      <div class="comentario-header">
        <div class="comentario-avatar">${inicial}</div>
        <div class="comentario-info">
          <h4>${this.sanitizeText(comentario.nombre)}</h4>
          <div class="fecha">${fecha}</div>
        </div>
      </div>
      <div class="comentario-texto">
        "${this.sanitizeText(comentario.comentario)}"
      </div>
    `;

    return card;
  }

  setupAdminAccess() {
    // Acceso de administrador con doble clic en el título
    const titulo = document.querySelector('.comentarios-header h2');
    if (titulo) {
      let clickCount = 0;
      titulo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
          this.promptAdminAccess();
          clickCount = 0;
        }
        setTimeout(() => { clickCount = 0; }, 1000);
      });
    }
  }

  promptAdminAccess() {
    const password = prompt('Ingrese la clave de administrador:');
    if (password === 'santuario2025') { // Cambiar por una clave segura
      this.isAdmin = true;
      this.showAdminPanel();
      this.showMessage('Acceso de administrador activado', 'exito');
    } else if (password !== null) {
      this.showMessage('Clave incorrecta', 'error');
    }
  }

  showAdminPanel() {
    const panel = document.getElementById('admin-comentarios');
    if (panel) {
      panel.classList.add('visible');
      this.updateAdminPanel();
    }
  }

  updateAdminPanel() {
    const container = document.getElementById('comentarios-pendientes');
    if (!container) return;

    if (this.comentariosPendientes.length === 0) {
      container.innerHTML = '<p>No hay comentarios pendientes de moderación.</p>';
      return;
    }

    container.innerHTML = '';
    this.comentariosPendientes.forEach((comentario, index) => {
      const div = document.createElement('div');
      div.className = 'comentario-pendiente-admin';
      div.innerHTML = `
        <h4>${this.sanitizeText(comentario.nombre)} - ${comentario.tipo}</h4>
        <p><strong>Email:</strong> ${comentario.email || 'No proporcionado'}</p>
        <p><strong>Fecha:</strong> ${new Date(comentario.fecha).toLocaleString('es-ES')}</p>
        <p><strong>Comentario:</strong> "${this.sanitizeText(comentario.comentario)}"</p>
        <div class="comentario-acciones">
          <button class="btn-aprobar" onclick="window.SistemaComentarios.aprobarComentario(${index})">
            <i class="fas fa-check"></i> Aprobar
          </button>
          <button class="btn-rechazar" onclick="window.SistemaComentarios.rechazarComentario(${index})">
            <i class="fas fa-times"></i> Rechazar
          </button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  aprobarComentario(index) {
    if (index >= 0 && index < this.comentariosPendientes.length) {
      const comentario = this.comentariosPendientes.splice(index, 1)[0];
      this.comentariosAprobados.push(comentario);
      
      // Guardar cambios
      localStorage.setItem('comentarios_pendientes', JSON.stringify(this.comentariosPendientes));
      localStorage.setItem('comentarios_aprobados', JSON.stringify(this.comentariosAprobados));
      
      // Actualizar vistas
      this.updateAdminPanel();
      
      // Agregar a la vista pública
      const container = document.getElementById('comentarios-grid');
      if (container) {
        const nuevaCard = this.createComentarioCard(comentario);
        container.appendChild(nuevaCard);
      }
      
      this.showMessage('Comentario aprobado y publicado', 'exito');
    }
  }

  rechazarComentario(index) {
    if (index >= 0 && index < this.comentariosPendientes.length) {
      this.comentariosPendientes.splice(index, 1);
      localStorage.setItem('comentarios_pendientes', JSON.stringify(this.comentariosPendientes));
      this.updateAdminPanel();
      this.showMessage('Comentario rechazado', 'exito');
    }
  }

  showMessage(mensaje, tipo) {
    const messageDiv = document.getElementById('mensaje-comentario');
    if (!messageDiv) return;

    messageDiv.textContent = mensaje;
    messageDiv.className = `mensaje-estado mensaje-${tipo}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }

  sanitizeText(text) {
    // Función simple para sanitizar texto y prevenir XSS
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Método para exportar comentarios (útil para respaldo)
  exportarComentarios() {
    const data = {
      pendientes: this.comentariosPendientes,
      aprobados: this.comentariosAprobados,
      fecha: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comentarios_santuario_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  window.SistemaComentarios = new SistemaComentarios();
});

// Funciones globales para el admin panel
window.aprobarComentario = (index) => {
  if (window.SistemaComentarios) {
    window.SistemaComentarios.aprobarComentario(index);
  }
};

window.rechazarComentario = (index) => {
  if (window.SistemaComentarios) {
    window.SistemaComentarios.rechazarComentario(index);
  }
};
