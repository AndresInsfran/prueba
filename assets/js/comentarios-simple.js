/**
 * Sistema Simple de Comentarios con Moderación
 * Versión minimalista para el Santuario
 */

class ComentariosSimple {
  constructor() {
    this.comentarios = this.cargarComentarios();
    this.comentariosPendientes = this.cargarPendientes();
    this.mostrandoTodos = false;
    this.comentariosPorPagina = 4;
    this.clickCount = 0;
    this.isMobile = window.innerWidth <= 768;
    this.inicializar();
  }

  inicializar() {
    this.setupFormulario();
    this.setupModeracion();
    this.setupVerMas();
    this.setupMobileOptimizations();
    this.mostrarComentarios();
  }

  setupFormulario() {
    const form = document.getElementById('form-comentario-simple');
    if (form) {
      form.addEventListener('submit', (e) => this.enviarComentario(e));
    }
  }

  setupModeracion() {
    const btnModerar = document.getElementById('btn-moderar');
    if (btnModerar) {
      btnModerar.addEventListener('click', () => this.handleModerarClick());
    }

    const btnCerrar = document.getElementById('cerrar-moderacion');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => this.cerrarPanelModeracion());
    }
  }

  setupVerMas() {
    const btnVerMas = document.getElementById('btn-ver-mas');
    const btnVerMenos = document.getElementById('btn-ver-menos');
    
    if (btnVerMas) {
      btnVerMas.addEventListener('click', () => this.verMasComentarios());
    }
    
    if (btnVerMenos) {
      btnVerMenos.addEventListener('click', () => this.verMenosComentarios());
    }
  }

  setupMobileOptimizations() {
    // Detectar cambios de orientación
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.ajustarPantallaMobile();
    });

    // Mejorar experiencia táctil en móviles
    if (this.isMobile) {
      this.configurarEventosTactiles();
    }
  }

  configurarEventosTactiles() {
    // Hacer que los botones respondan mejor al toque
    const botones = document.querySelectorAll('.btn-enviar-simple, .btn-ver-mas, .btn-ver-menos, .btn-moderar');
    
    botones.forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      btn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    });

    // Prevenir zoom accidental en inputs
    const inputs = document.querySelectorAll('#nombre-simple, #comentario-simple');
    inputs.forEach(input => {
      input.addEventListener('touchstart', function() {
        if (window.innerWidth <= 768) {
          // Asegurar que no haya zoom
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            
            // Restaurar después de que termine la edición
            setTimeout(() => {
              viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
            }, 3000);
          }
        }
      });
    });
  }

  ajustarPantallaMobile() {
    if (this.isMobile) {
      // Ajustar cantidad de comentarios en móvil
      this.comentariosPorPagina = 3;
    } else {
      this.comentariosPorPagina = 4;
    }
    
    // Recargar comentarios con nueva configuración
    this.mostrarComentarios();
  }

  handleModerarClick() {
    this.clickCount++;
    
    if (this.clickCount === 3) {
      const password = prompt('Ingresa la clave de moderación:');
      if (password === 'santuario2025') {
        this.abrirPanelModeracion();
      } else if (password !== null) {
        alert('Clave incorrecta');
      }
      this.clickCount = 0;
    }
    
    // Reset click count después de 2 segundos
    setTimeout(() => {
      this.clickCount = 0;
    }, 2000);
  }

  enviarComentario(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre-simple').value.trim();
    const comentario = document.getElementById('comentario-simple').value.trim();
    
    if (!nombre || !comentario) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const nuevoComentario = {
      id: Date.now(),
      nombre: this.sanitizarTexto(nombre),
      comentario: this.sanitizarTexto(comentario),
      fecha: new Date().toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      }),
      fechaCompleta: new Date().toISOString(),
      aprobado: true // Se publica automáticamente
    };

    this.comentarios.unshift(nuevoComentario);
    this.guardarComentarios();
    this.mostrarComentarios();
    
    // Limpiar formulario
    document.getElementById('form-comentario-simple').reset();
    
    // Mostrar mensaje de éxito
    this.mostrarMensaje('¡Gracias por compartir tu testimonio! Ya está publicado.', 'exito');
    
    // Scroll suave hacia el nuevo comentario
    setTimeout(() => {
      document.querySelector('.comentarios-lista').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 500);
  }

  verMasComentarios() {
    this.mostrandoTodos = true;
    this.mostrarComentarios();
  }

  verMenosComentarios() {
    this.mostrandoTodos = false;
    this.mostrarComentarios();
    
    // Scroll hacia los comentarios
    document.querySelector('.comentarios-lista').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  mostrarComentarios() {
    const contenedor = document.getElementById('comentarios-simples');
    const btnVerMas = document.getElementById('btn-ver-mas');
    const btnVerMenos = document.getElementById('btn-ver-menos');
    
    if (!contenedor) return;

    const comentariosAprobados = this.comentarios.filter(c => c.aprobado);
    
    let comentariosMostrar;
    if (this.mostrandoTodos) {
      comentariosMostrar = comentariosAprobados;
    } else {
      comentariosMostrar = comentariosAprobados.slice(0, this.comentariosPorPagina);
    }
    
    contenedor.innerHTML = comentariosMostrar.map(comentario => `
      <div class="comentario-simple" data-id="${comentario.id}">
        <div class="comentario-autor">${comentario.nombre}</div>
        <div class="comentario-contenido">${comentario.comentario}</div>
        <div class="comentario-fecha">${comentario.fecha}</div>
      </div>
    `).join('');

    // Manejar botones ver más/menos
    if (comentariosAprobados.length > this.comentariosPorPagina) {
      if (this.mostrandoTodos) {
        btnVerMas.style.display = 'none';
        btnVerMenos.style.display = 'inline-flex';
      } else {
        btnVerMas.style.display = 'inline-flex';
        btnVerMenos.style.display = 'none';
      }
    } else {
      btnVerMas.style.display = 'none';
      btnVerMenos.style.display = 'none';
    }
  }

  abrirPanelModeracion() {
    document.getElementById('panel-moderacion').style.display = 'block';
    this.actualizarPanelModeracion();
  }

  cerrarPanelModeracion() {
    document.getElementById('panel-moderacion').style.display = 'none';
  }

  actualizarPanelModeracion() {
    this.mostrarComentariosAprobadosAdmin();
    // Solo mostrar comentarios aprobados ya que no hay sistema de aprobación
  }

  mostrarComentariosPendientes() {
    const contenedor = document.getElementById('lista-pendientes');
    if (!contenedor) return;

    // Como no hay pendientes, siempre mostrar mensaje vacío
    contenedor.innerHTML = '<p class="sin-pendientes">Los comentarios se publican automáticamente</p>';
  }

  mostrarComentariosAprobadosAdmin() {
    const contenedor = document.getElementById('lista-aprobados-admin');
    if (!contenedor) return;

    const aprobados = this.comentarios.filter(c => c.aprobado).slice(0, 10);

    contenedor.innerHTML = aprobados.map(comentario => `
      <div class="comentario-aprobado-admin" data-id="${comentario.id}">
        <div class="comentario-admin-header">
          <span class="comentario-admin-autor">${comentario.nombre}</span>
          <span class="comentario-admin-fecha">${comentario.fecha}</span>
        </div>
        <div class="comentario-admin-contenido">${comentario.comentario}</div>
        <div class="comentario-admin-acciones">
          <button class="btn-eliminar" onclick="comentariosSimple.eliminarComentario(${comentario.id})">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `).join('');
  }

  aprobarComentario(id) {
    const comentario = this.comentariosPendientes.find(c => c.id === id);
    if (comentario) {
      comentario.aprobado = true;
      this.comentarios.unshift(comentario);
      this.comentariosPendientes = this.comentariosPendientes.filter(c => c.id !== id);
      
      this.guardarComentarios();
      this.guardarPendientes();
      this.mostrarComentarios();
      this.actualizarPanelModeracion();
    }
  }

  rechazarComentario(id) {
    this.comentariosPendientes = this.comentariosPendientes.filter(c => c.id !== id);
    this.guardarPendientes();
    this.actualizarPanelModeracion();
  }

  eliminarComentario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      this.comentarios = this.comentarios.filter(c => c.id !== id);
      this.guardarComentarios();
      this.mostrarComentarios();
      this.actualizarPanelModeracion();
    }
  }

  mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje-simple');
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.className = `mensaje-simple ${tipo}`;
      mensaje.style.display = 'block';
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        mensaje.style.display = 'none';
      }, 5000);
    }
  }

  sanitizarTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  cargarComentarios() {
    try {
      const guardados = localStorage.getItem('comentarios_santuario_simple');
      return guardados ? JSON.parse(guardados) : this.comentariosEjemplo();
    } catch {
      return this.comentariosEjemplo();
    }
  }

  cargarPendientes() {
    try {
      const guardados = localStorage.getItem('comentarios_pendientes_santuario');
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  }

  guardarComentarios() {
    try {
      localStorage.setItem('comentarios_santuario_simple', JSON.stringify(this.comentarios));
    } catch (error) {
      console.log('No se pudo guardar en localStorage');
    }
  }

  guardarPendientes() {
    try {
      localStorage.setItem('comentarios_pendientes_santuario', JSON.stringify(this.comentariosPendientes));
    } catch (error) {
      console.log('No se pudo guardar pendientes en localStorage');
    }
  }

  comentariosEjemplo() {
    return [
      {
        id: 6,
        nombre: 'Carmen Villalba',
        comentario: 'Las misas del domingo son muy emotivas. Me encanta la calidez de la comunidad y los cantos que elevan el alma hacia Dios.',
        fecha: 'Julio 2025',
        aprobado: true
      },
      {
        id: 5,
        nombre: 'Roberto Silva',
        comentario: 'Vine por primera vez para una boda y quedé impresionado por la belleza del altar y la solemnidad de la ceremonia. Definitivamente regresaré.',
        fecha: 'Julio 2025',
        aprobado: true
      },
      {
        id: 4,
        nombre: 'Elena Morales',
        comentario: 'Cada vez que paso por momentos difíciles, vengo aquí a orar. La paz que se siente en este santuario es incomparable.',
        fecha: 'Junio 2025',
        aprobado: true
      },
      {
        id: 3,
        nombre: 'Ana Rodríguez',
        comentario: 'Pedí por la salud de mi hijo y mis oraciones fueron escuchadas. La Virgen del Perpetuo Socorro intercedió por nosotros. Eternamente agradecida.',
        fecha: 'Mayo 2025',
        aprobado: true
      },
      {
        id: 2,
        nombre: 'José Martínez',
        comentario: 'Durante los momentos más difíciles de mi vida, encontré fortaleza en las misas de este santuario. La comunidad me acogió con amor.',
        fecha: 'Mayo 2025',
        aprobado: true
      },
      {
        id: 1,
        nombre: 'María González',
        comentario: 'Gracias al Santísimo Sacramento y a la Virgen del Perpetuo Socorro por todas las bendiciones recibidas. Este santuario es un lugar de paz y esperanza.',
        fecha: 'Abril 2025',
        aprobado: true
      }
    ];
  }
}

// Inicializar cuando el DOM esté listo
let comentariosSimple;
document.addEventListener('DOMContentLoaded', () => {
  comentariosSimple = new ComentariosSimple();
});

// Exportar para uso en otros módulos si es necesario
window.ComentariosSimple = ComentariosSimple;
