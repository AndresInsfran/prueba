/* =================================
   CALENDARIO SIMPLE - FUNCIONALIDAD
   ================================= */

// Configuración
const ADMIN_PASSWORD = "admin123"; // Cambia esta clave por una más segura
const STORAGE_KEY = "santuario_eventos";

// Variables globales
let calendar;
let eventosPersonalizados = []; // Empezar con lista vacía

// Eventos predefinidos del santuario (configuración básica)
const eventosPredefinidos = [
  // Misas dominicales
  {
    title: "Misa Dominical",
    startTime: "08:00",
    daysOfWeek: [0], // Domingo
    backgroundColor: "#007bff",
    textColor: "#ffffff",
    extendedProps: {
      type: "misa",
      description: "Misa dominical matutina"
    }
  },
  {
    title: "Misa Dominical",
    startTime: "18:00",
    daysOfWeek: [0], // Domingo
    backgroundColor: "#007bff",
    textColor: "#ffffff",
    extendedProps: {
      type: "misa",
      description: "Misa dominical vespertina"
    }
  },
  
  // Confesiones
  {
    title: "Confesiones",
    startTime: "15:30",
    endTime: "17:30",
    daysOfWeek: [6], // Sábado
    backgroundColor: "#6f42c1",
    textColor: "#ffffff",
    extendedProps: {
      type: "confesion",
      description: "Horario de confesiones"
    }
  }
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Iniciando calendario simple...');
  
  // Limpiar eventos personalizados previos
  localStorage.removeItem(STORAGE_KEY);
  eventosPersonalizados = [];
  
  // Inicializar calendario
  initializeCalendar();
  
  // Configurar eventos de administración
  setupAdminEvents();
  
  // Actualizar lista de próximos eventos
  updateProximosEventos();
  
  console.log('✅ Calendario simple inicializado correctamente');
});

// Inicializar FullCalendar
function initializeCalendar() {
  const calendarEl = document.getElementById('calendario-simple');
  
  if (!calendarEl) {
    console.error('❌ No se encontró el elemento del calendario');
    return;
  }

  calendar = new FullCalendar.Calendar(calendarEl, {
    // Configuración básica
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1, // Comenzar por lunes
    height: 'auto',
    
    // Header simplificado
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    
    // Botones personalizados
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      list: 'Lista'
    },
    
    // Configuración de eventos
    events: function(info, successCallback, failureCallback) {
      const eventosSantos = generarEventosSantos();
      const todosEventos = [...eventosPredefinidos, ...eventosPersonalizados, ...eventosSantos];
      successCallback(todosEventos);
    },
    
    // Click en evento
    eventClick: function(info) {
      mostrarInfoEvento(info.event);
    },
    
    // Configuración de vista
    dayMaxEvents: 2,
    moreLinkText: 'más eventos'
  });

  calendar.render();
}

// Configurar eventos de administración
function setupAdminEvents() {
  // Botón de acceso admin
  const btnAdmin = document.getElementById('btn-admin');
  const modalAccess = document.getElementById('modal-admin-access');
  const adminPanel = document.getElementById('admin-panel');
  
  if (btnAdmin) {
    btnAdmin.addEventListener('click', function() {
      modalAccess.style.display = 'flex';
    });
  }
  
  // Botones del modal de acceso
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnAcceder = document.getElementById('btn-acceder');
  const passwordInput = document.getElementById('admin-password');
  
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function() {
      modalAccess.style.display = 'none';
      passwordInput.value = '';
    });
  }
  
  if (btnAcceder) {
    btnAcceder.addEventListener('click', function() {
      verificarAcceso();
    });
  }
  
  // Enter en campo de password
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        verificarAcceso();
      }
    });
  }
  
  // Cerrar panel admin
  const btnCerrarAdmin = document.getElementById('cerrar-admin');
  if (btnCerrarAdmin) {
    btnCerrarAdmin.addEventListener('click', function() {
      adminPanel.style.display = 'none';
    });
  }
  
  // Formulario de eventos
  const formEvento = document.getElementById('form-evento');
  if (formEvento) {
    formEvento.addEventListener('submit', function(e) {
      e.preventDefault();
      agregarEvento();
    });
  }
}

// Verificar acceso de administrador
function verificarAcceso() {
  const password = document.getElementById('admin-password').value;
  const modalAccess = document.getElementById('modal-admin-access');
  const adminPanel = document.getElementById('admin-panel');
  
  if (password === ADMIN_PASSWORD) {
    modalAccess.style.display = 'none';
    adminPanel.style.display = 'block';
    adminPanel.classList.add('slide-in');
    document.getElementById('admin-password').value = '';
    
    // Actualizar lista de eventos en admin
    updateEventosListaAdmin();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('✅ Acceso concedido', 'success');
  } else {
    mostrarMensaje('❌ Clave incorrecta', 'error');
    document.getElementById('admin-password').value = '';
  }
}

// Agregar nuevo evento
function agregarEvento() {
  const titulo = document.getElementById('evento-titulo').value.trim();
  const fecha = document.getElementById('evento-fecha').value;
  const hora = document.getElementById('evento-hora').value;
  const tipo = document.getElementById('evento-tipo').value;
  const descripcion = document.getElementById('evento-descripcion').value.trim();
  
  if (!titulo || !fecha) {
    mostrarMensaje('❌ Por favor completa los campos obligatorios', 'error');
    return;
  }
  
  // Crear evento
  const nuevoEvento = {
    id: 'custom_' + Date.now(),
    title: titulo,
    start: fecha + (hora ? 'T' + hora : ''),
    backgroundColor: getColorPorTipo(tipo),
    textColor: getTextColorPorTipo(tipo),
    extendedProps: {
      type: tipo,
      description: descripcion,
      isCustom: true
    }
  };
  
  // Agregar a la lista
  eventosPersonalizados.push(nuevoEvento);
  
  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventosPersonalizados));
  
  // Actualizar calendario
  calendar.refetchEvents();
  
  // Actualizar lista de próximos eventos
  updateProximosEventos();
  
  // Actualizar lista admin
  updateEventosListaAdmin();
  
  // Limpiar formulario
  document.getElementById('form-evento').reset();
  
  // Mostrar mensaje de éxito
  mostrarMensaje('✅ Evento agregado correctamente', 'success');
}

// Eliminar evento personalizado
function eliminarEvento(eventoId) {
  if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
    eventosPersonalizados = eventosPersonalizados.filter(evento => evento.id !== eventoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventosPersonalizados));
    
    calendar.refetchEvents();
    updateProximosEventos();
    updateEventosListaAdmin();
    
    mostrarMensaje('✅ Evento eliminado correctamente', 'success');
  }
}

// Actualizar lista de eventos en panel admin
function updateEventosListaAdmin() {
  const listaContainer = document.getElementById('lista-eventos-admin');
  
  if (!listaContainer) return;
  
  if (eventosPersonalizados.length === 0) {
    listaContainer.innerHTML = '<p style="color: #6c757d; text-align: center;">No hay eventos personalizados</p>';
    return;
  }
  
  listaContainer.innerHTML = eventosPersonalizados.map(evento => {
    const fecha = new Date(evento.start);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const horaFormateada = fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="evento-admin-item">
        <div class="evento-admin-info">
          <h5>${evento.title}</h5>
          <p>📅 ${fechaFormateada} - ⏰ ${horaFormateada}</p>
          <p>📋 ${evento.extendedProps.type.charAt(0).toUpperCase() + evento.extendedProps.type.slice(1)}</p>
        </div>
        <button class="btn-eliminar" onclick="eliminarEvento('${evento.id}')">
          <i class="fas fa-trash"></i>
          Eliminar
        </button>
      </div>
    `;
  }).join('');
}

// Actualizar próximos eventos
function updateProximosEventos() {
  const container = document.getElementById('eventos-proximos');
  
  if (!container) return;
  
  const ahora = new Date();
  const proximosEventos = [];
  
  // Obtener los eventos de hoy
  const eventosDehoy = obtenerProximasMisas();
  proximosEventos.push(...eventosDehoy);
  
  // Agregar confesiones de hoy según el día (versión compacta)
  const diaSemana = ahora.getDay();
  const fechaHoy = ahora.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  
  if (diaSemana >= 1 && diaSemana <= 5) { // Lunes a viernes
    proximosEventos.push({
      titulo: "Confesiones",
      fecha: "Hoy - " + fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1),
      hora: "7:30-11:30 AM, 3:30-5:30 PM",
      tipo: "confesion",
      icono: "fas fa-user-shield"
    });
  } else if (diaSemana === 6) { // Sábado
    proximosEventos.push({
      titulo: "Confesiones", 
      fecha: "Hoy - " + fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1),
      hora: "3:30-5:30 PM",
      tipo: "confesion",
      icono: "fas fa-user-shield"
    });
  }
  
  // Agregar santos importantes del mes actual
  const mesActual = ahora.getMonth() + 1;
  const añoActual = ahora.getFullYear();
  
  // Solo agregar eventos personalizados de hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Inicio del día
  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1); // Inicio del día siguiente
  
  eventosPersonalizados.forEach(evento => {
    const fechaEvento = new Date(evento.start);
    fechaEvento.setHours(0, 0, 0, 0);
    
    // Solo incluir si es hoy
    if (fechaEvento.getTime() === hoy.getTime()) {
      proximosEventos.push({
        titulo: evento.title,
        fecha: "Hoy - " + fechaEvento.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        }),
        hora: new Date(evento.start).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        tipo: evento.extendedProps?.type || 'evento',
        icono: 'fas fa-calendar'
      });
    }
  });
  
  // Ordenar por prioridad: festividades importantes primero, luego misas, luego otros
  proximosEventos.sort((a, b) => {
    // Festividades importantes van primero
    if (a.tipo === 'festividad' && a.importante && b.tipo !== 'festividad') return -1;
    if (b.tipo === 'festividad' && b.importante && a.tipo !== 'festividad') return 1;
    
    // Entre festividades, las importantes van primero
    if (a.tipo === 'festividad' && b.tipo === 'festividad') {
      if (a.importante && !b.importante) return -1;
      if (!a.importante && b.importante) return 1;
    }
    
    // Misas van después de festividades importantes
    if (a.tipo === 'misa' && b.tipo !== 'misa' && b.tipo !== 'festividad') return -1;
    if (b.tipo === 'misa' && a.tipo !== 'misa' && a.tipo !== 'festividad') return 1;
    
    // Entre misas, las dominicales van primero
    if (a.tipo === 'misa' && b.tipo === 'misa') {
      if (a.importante && !b.importante) return -1;
      if (!a.importante && b.importante) return 1;
    }
    
    return 0;
  });

  // Mostrar hasta 4 eventos de forma compacta
  const eventosAMostrar = proximosEventos.slice(0, 4);
  
  container.innerHTML = eventosAMostrar.map(evento => `
    <div class="evento-proximo-compacto ${evento.importante ? 'evento-importante' : ''}" data-tipo="${evento.tipo}">
      <div class="evento-icono-compacto">
        <i class="${evento.icono || 'fas fa-calendar'}"></i>
      </div>
      <div class="evento-contenido-compacto">
        <div class="evento-titulo-compacto">${evento.titulo}</div>
        <div class="evento-hora-compacto">⏰ ${evento.hora}</div>
      </div>
      ${evento.importante ? '<div class="evento-badge-compacto">⭐</div>' : ''}
    </div>
  `).join('');
}

// Mostrar información de evento
function mostrarInfoEvento(evento) {
  const tipo = evento.extendedProps.type || 'evento';
  const descripcion = evento.extendedProps.description || 'Sin descripción disponible';
  
  // Manejo especial para santos/festividades
  if (tipo === 'festividad' && evento.extendedProps.santo) {
    mostrarModalSanto(evento);
  } else {
    // Manejo normal para otros eventos
    const mensaje = `📅 ${evento.title}\n\n📋 Tipo: ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}\n📝 ${descripcion}\n\n¿Te gustaría contactarnos por WhatsApp?`;
    
    if (confirm(mensaje)) {
      const whatsappMsg = `Hola, me interesa el evento "${evento.title}" del Santuario Diocesano. ¿Podrían darme más información?`;
      const whatsappUrl = `https://wa.me/595123456789?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank');
    }
  }
}

// Variable global para el evento actual del modal
let eventoActualModal = null;

// Función para mostrar el modal del santo
function mostrarModalSanto(evento) {
  eventoActualModal = evento;
  const santo = evento.extendedProps.santo;
  const importante = evento.extendedProps.importante;
  const fecha = evento.start.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Actualizar contenido del modal
  document.querySelector('#modal-santo-titulo span').textContent = santo;
  document.getElementById('modal-santo-fecha').textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  document.getElementById('modal-santo-tipo').textContent = importante ? 'Festividad Importante ⭐' : 'Santo del día';
  
  // Descripción personalizada por santo
  const descripcionPersonalizada = obtenerDescripcionSanto(santo);
  document.getElementById('modal-santo-descripcion').textContent = descripcionPersonalizada;
  
  // Reflexión especial para algunos santos importantes
  const reflexion = obtenerReflexionSanto(santo);
  const reflexionDiv = document.getElementById('modal-santo-reflexion');
  if (reflexion) {
    document.getElementById('modal-santo-reflexion-texto').textContent = reflexion;
    reflexionDiv.style.display = 'block';
  } else {
    reflexionDiv.style.display = 'none';
  }
  
  // Mostrar modal con animación
  const modal = document.getElementById('modal-santo-info');
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Función para cerrar el modal
function cerrarModalSanto() {
  const modal = document.getElementById('modal-santo-info');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    eventoActualModal = null;
  }, 300);
}

// Función para contactar por WhatsApp desde el modal
function contactarWhatsAppSanto() {
  if (eventoActualModal) {
    const santo = eventoActualModal.extendedProps.santo;
    const fecha = eventoActualModal.start.toLocaleDateString('es-ES');
    const whatsappMsg = `Hola, me interesa conocer más sobre las celebraciones del ${santo} (${fecha}) en el Santuario Diocesano. ¿Podrían darme información sobre los horarios de misa y actividades especiales?`;
    const whatsappUrl = `https://wa.me/595123456789?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank');
    cerrarModalSanto();
  }
}

// Función para obtener descripción personalizada del santo
function obtenerDescripcionSanto(santo) {
  const descripciones = {
    'San Cayetano de Thiene - San Sixto II, papa': 'San Cayetano, fundador de los Teatinos, dedicó su vida al cuidado de los pobres y enfermos. San Sixto II, papa y mártir, murió durante la persecución de Valeriano.',
    'Santo Domingo de Guzmán': 'Fundador de la Orden de Predicadores (Dominicos), dedicó su vida a la predicación y la lucha contra las herejías. Patrón de los astrónomos.',
    'San Lorenzo, diácono y mártir': 'Diácono de la Iglesia romana, mártir durante la persecución de Valeriano. Es venerado como protector contra el fuego y patrón de los cocineros.',
    'Nuestra Señora de la Asunción': 'Dogma que proclama que María, al final de su vida terrena, fue llevada en cuerpo y alma al cielo. Festividad de precepto.',
    'Santa Rosa de Lima': 'Primera santa canonizada de América. Mística y penitente, dedicó su vida a la oración y al cuidado de los necesitados.',
    'San Agustín de Hipona': 'Doctor de la Iglesia, filósofo y teólogo. Sus "Confesiones" y "La Ciudad de Dios" son obras fundamentales del cristianismo.',
    'San Alfonso María de Ligorio': 'Doctor de la Iglesia, fundador de los Redentoristas. Patrono de los confesores y moralistas.',
    'San Juan María Vianney': 'El Santo Cura de Ars, patrón de los párrocos. Conocido por su dedicación al sacramento de la confesión.',
    'San Roque - San Esteban de Hungría': 'San Roque, peregrino que cuidaba a los apestados. San Esteban, primer rey cristiano de Hungría.',
    'San Pío X, papa': 'Papa que promovió la comunión frecuente y la reforma de la música sacra. Canonizado por su santidad pastoral.',
    'Martirio de San Juan Bautista': 'Conmemoración del martirio del Precursor del Señor, degollado por orden de Herodes Antipas.',
    'San Ramón Nonato': 'Religioso mercedario, rescatador de cautivos. Patrón de las parturientas y los partos difíciles.'
  };
  
  return descripciones[santo] || `Celebramos hoy la festividad de ${santo}. Un santo que nos inspira con su ejemplo de vida cristiana y dedicación a Dios.`;
}

// Función para obtener reflexión especial de algunos santos
function obtenerReflexionSanto(santo) {
  const reflexiones = {
    'San Cayetano de Thiene - San Sixto II, papa': 'San Cayetano nos enseña que la verdadera nobleza está en el servicio a los más necesitados. Su ejemplo nos invita a buscar a Dios en los pobres.',
    'Santo Domingo de Guzmán': 'Santo Domingo nos recuerda que la predicación debe nacer de la contemplación. "Contemplare et contemplata aliis tradere" - contemplar y transmitir lo contemplado.',
    'Nuestra Señora de la Asunción': 'María Asunta es signo de esperanza para todos los cristianos. Ella nos precede en la gloria que nos espera.',
    'San Agustín de Hipona': '"Nos hiciste, Señor, para ti, e inquieto está nuestro corazón hasta que descanse en ti." San Agustín nos enseña el camino de la búsqueda sincera de Dios.'
  };
  
  return reflexiones[santo] || null;
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    cerrarModalSanto();
  }
});

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-santo-info');
  if (e.target === modal) {
    cerrarModalSanto();
  }
});

// Obtener color por tipo de evento
function getColorPorTipo(tipo) {
  const colores = {
    'misa': '#007bff',
    'evento': '#28a745',
    'festividad': '#ffc107',
    'confesion': '#6f42c1'
  };
  return colores[tipo] || '#007bff';
}

// Obtener color de texto por tipo
function getTextColorPorTipo(tipo) {
  return tipo === 'festividad' ? '#212529' : '#ffffff';
}

// Mostrar mensajes de notificación
function mostrarMensaje(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
    <div class="notificacion-content">
      ${mensaje}
      <button class="notificacion-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Estilos inline para la notificación
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
    color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
    border: 1px solid ${tipo === 'success' ? '#c3e6cb' : tipo === 'error' ? '#f5c6cb' : '#bee5eb'};
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 1001;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Agregar al DOM
  document.body.appendChild(notificacion);
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    if (notificacion.parentElement) {
      notificacion.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notificacion.parentElement) {
          notificacion.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Agregar estilos de animación para notificaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notificacion-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notificacion-close {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 15px;
    opacity: 0.7;
  }
  
  .notificacion-close:hover {
    opacity: 1;
  }
`;
document.head.appendChild(styleSheet);

// Función de utilidad para depuración
function debugCalendar() {
  console.log('📊 Estado del calendario:');
  console.log('- Eventos predefinidos:', eventosPredefinidos.length);
  console.log('- Eventos personalizados:', eventosPersonalizados.length);
  console.log('- Calendar object:', calendar);
}

// Función para obtener santos del día desde el sistema de evangelio
function obtenerSantoDelDia(fecha) {
  if (typeof EvangelioDia !== 'undefined' && EvangelioDia.obtenerSantoDominicos) {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return EvangelioDia.obtenerSantoDominicos(mes, dia);
  }
  return null;
}

// Función para generar eventos de santos para el calendario
function generarEventosSantos() {
  const eventosSantos = [];
  const añoActual = new Date().getFullYear();
  
  // Santos de agosto (mes actual)
  const santosAgosto = {
    '8-1': 'San Alfonso María de Ligorio',
    '8-2': 'San Eusebio de Vercelli',
    '8-4': 'San Juan María Vianney',
    '8-5': 'Dedicación de la Basílica de Santa María',
    '8-6': 'Transfiguración del Señor',
    '8-7': 'San Cayetano de Thiene - San Sixto II, papa',
    '8-8': 'Santo Domingo de Guzmán',
    '8-9': 'Santa Teresa Benedicta de la Cruz',
    '8-10': 'San Lorenzo, diácono y mártir',
    '8-11': 'Santa Clara de Asís',
    '8-13': 'San Hipólito, mártir - Santos Ponciano e Hipólito',
    '8-14': 'San Maximiliano María Kolbe',
    '8-15': 'Nuestra Señora de la Asunción',
    '8-16': 'San Roque - San Esteban de Hungría',
    '8-19': 'San Juan Eudes',
    '8-20': 'San Bernardo de Claraval',
    '8-21': 'San Pío X, papa',
    '8-22': 'Virgen María Reina',
    '8-23': 'Santa Rosa de Lima',
    '8-24': 'San Bartolomé Apóstol',
    '8-25': 'San Luis de Francia',
    '8-27': 'Santa Mónica',
    '8-28': 'San Agustín de Hipona',
    '8-29': 'Martirio de San Juan Bautista',
    '8-31': 'San Ramón Nonato'
  };
  
  // Agregar eventos para cada santo
  Object.entries(santosAgosto).forEach(([fecha, santo]) => {
    const [mes, dia] = fecha.split('-');
    // Determinar si es una festividad importante (color especial)
    const esImportante = santo.includes('Asunción') || santo.includes('Transfiguración') || 
                        santo.includes('Domingo de Guzmán') || santo.includes('Lorenzo');
    
    eventosSantos.push({
      title: `⛪ ${santo}`,
      start: `${añoActual}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`,
      allDay: true,
      backgroundColor: esImportante ? '#dc3545' : '#ffc107',
      textColor: esImportante ? '#ffffff' : '#212529',
      borderColor: esImportante ? '#dc3545' : '#ffc107',
      extendedProps: {
        type: 'festividad',
        description: `Festividad de ${santo}`,
        santo: santo,
        importante: esImportante
      }
    });
  });
  
  return eventosSantos;
}

// Obtener próximas misas con fechas específicas
function obtenerProximasMisas() {
  const ahora = new Date();
  const misas = [];
  
  // Solo mostrar eventos del día actual
  const fecha = new Date(ahora);
  const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, etc.
  const fechaTexto = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric', 
    month: 'long'
  });
  
  // Verificar si hay eventos litúrgicos especiales hoy
  const eventosLiturgicos = obtenerEventosLiturgicos(fecha);
  if (eventosLiturgicos.length > 0) {
    misas.push(...eventosLiturgicos);
  }
  
  // Misas del día actual según día de la semana (versión compacta)
  if (diaSemana === 0) { // Domingo
    misas.push({
      titulo: "Misas Dominicales",
      fecha: "Hoy - " + fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1),
      hora: "8:30 AM, 5:00 PM, 6:15 PM",
      tipo: "misa",
      icono: "fas fa-cross",
      importante: true
    });
  } else if (diaSemana === 6) { // Sábado
    misas.push({
      titulo: "Misas Vespertinas",
      fecha: "Hoy - " + fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1),
      hora: "5:00 PM, 6:15 PM",
      tipo: "misa",
      icono: "fas fa-cross"
    });
  } else if (diaSemana >= 1 && diaSemana <= 5) { // Lunes a viernes
    misas.push({
      titulo: "Misas Diarias",
      fecha: "Hoy - " + fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1),
      hora: "6:15 AM, 6:00 PM",
      tipo: "misa",
      icono: "fas fa-cross"
    });
  }
  
  return misas;
}

// Obtener eventos litúrgicos especiales por fecha
function obtenerEventosLiturgicos(fecha) {
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const eventos = [];
  
  // Eventos de Agosto (mes actual como ejemplo)
  if (mes === 8) {
    switch (dia) {
      case 7:
        eventos.push({
          titulo: "San Cayetano",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "En todas las misas",
          tipo: "festividad",
          icono: "fas fa-church",
          importante: true,
          descripcion: "Memoria del fundador de los Teatinos"
        });
        break;
      case 8:
        eventos.push({
          titulo: "Santo Domingo de Guzmán",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "En todas las misas",
          tipo: "festividad",
          icono: "fas fa-church",
          importante: true,
          descripcion: "Memoria del fundador de los Dominicos"
        });
        break;
      case 10:
        eventos.push({
          titulo: "San Lorenzo, mártir",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "Fiesta especial",
          tipo: "festividad",
          icono: "fas fa-church",
          importante: true,
          descripcion: "Fiesta del diácono mártir"
        });
        break;
      case 15:
        eventos.push({
          titulo: "Asunción de la Virgen María",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "Solemnidad",
          tipo: "festividad",
          icono: "fas fa-pray",
          importante: true,
          descripcion: "Solemnidad - Patrona de Paraguay"
        });
        break;
      case 23:
        eventos.push({
          titulo: "Santa Rosa de Lima",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "En todas las misas",
          tipo: "festividad",
          icono: "fas fa-church",
          importante: true,
          descripción: "Primera santa de América"
        });
        break;
      case 28:
        eventos.push({
          titulo: "San Agustín de Hipona",
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          hora: "Memoria obligatoria",
          tipo: "festividad",
          icono: "fas fa-church",
          importante: true,
          descripcion: "Memoria del Doctor de la Iglesia"
        });
        break;
    }
  }
  
  return eventos;
}

// Exportar funciones para uso global
window.eliminarEvento = eliminarEvento;
window.debugCalendar = debugCalendar;
