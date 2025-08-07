/* ===========================
   CALENDARIO MODERNO - FULLCALENDAR.JS
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🗓️ Inicializando FullCalendar...');
  
  const calendarEl = document.getElementById('calendario-principal');
  let calendar;
  
  // Eventos del santuario
  const eventosDelSantuario = [
    // Misas regulares
    {
      title: 'Misa Matutina',
      daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
      startTime: '06:15',
      endTime: '07:00',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    },
    {
      title: 'Misa Vespertina',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Todos los días
      startTime: '18:00',
      endTime: '19:00',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    },
    {
      title: 'Misa Sabatina',
      daysOfWeek: [6], // Sábados
      startTime: '17:00',
      endTime: '18:00',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    },
    {
      title: 'Misa Dominical Matutina',
      daysOfWeek: [0], // Domingos
      startTime: '08:30',
      endTime: '09:30',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    },
    {
      title: 'Misa Dominical Vespertina',
      daysOfWeek: [0], // Domingos
      startTime: '17:00',
      endTime: '18:00',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    },
    
    // Confesiones
    {
      title: 'Confesiones',
      daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
      startTime: '07:30',
      endTime: '11:30',
      color: '#3498db',
      textColor: 'white',
      classNames: ['confesion']
    },
    {
      title: 'Confesiones',
      daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
      startTime: '15:30',
      endTime: '17:30',
      color: '#3498db',
      textColor: 'white',
      classNames: ['confesion']
    },
    
    // Eventos especiales
    {
      title: 'Festividad Virgen del Perpetuo Socorro',
      start: '2025-08-03',
      allDay: true,
      color: '#e74c3c',
      textColor: 'white',
      classNames: ['festividad']
    },
    {
      title: 'Novena de la Virgen del Perpetuo Socorro',
      start: '2025-07-25',
      end: '2025-08-03',
      color: '#e74c3c',
      textColor: 'white',
      classNames: ['festividad']
    },
    {
      title: 'Reunión Comunitaria',
      start: '2025-08-15T19:00:00',
      end: '2025-08-15T21:00:00',
      color: '#e67e22',
      textColor: 'white',
      classNames: ['evento']
    },
    {
      title: 'Catequesis Adultos',
      daysOfWeek: [3], // Miércoles
      startTime: '19:30',
      endTime: '21:00',
      color: '#e67e22',
      textColor: 'white',
      classNames: ['evento']
    },
    {
      title: 'Adoración Eucarística',
      daysOfWeek: [5], // Viernes
      startTime: '19:30',
      endTime: '21:00',
      color: '#C4A76D',
      textColor: 'white',
      classNames: ['misa']
    }
  ];
  
  // Inicializar calendario
  function initCalendar() {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        list: 'Lista'
      },
      height: 'auto',
      events: eventosDelSantuario,
      eventDisplay: 'block',
      dayMaxEvents: 3,
      moreLinkText: 'más',
      
      // Configuración de idioma
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      
      // Eventos del calendario
      eventClick: function(info) {
        mostrarDetalleEvento(info.event);
      },
      
      dateClick: function(info) {
        console.log('Fecha clickeada:', info.dateStr);
      },
      
      eventDidMount: function(info) {
        // Agregar tooltip con información adicional
        info.el.setAttribute('title', 
          `${info.event.title}\n${info.event.start ? info.event.start.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) : 'Todo el día'}`
        );
      }
    });
    
    calendar.render();
    console.log('✅ FullCalendar inicializado correctamente');
  }
  
  // Funciones de filtrado
  function setupFilters() {
    const filterButtons = document.querySelectorAll('.filtro-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remover clase active de todos los botones
        filterButtons.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        filtrarEventos(filter);
      });
    });
  }
  
  function filtrarEventos(filtro) {
    if (filtro === 'all') {
      calendar.removeAllEvents();
      calendar.addEventSource(eventosDelSantuario);
    } else {
      const eventosFiltrados = eventosDelSantuario.filter(evento => 
        evento.classNames && evento.classNames.includes(filtro)
      );
      calendar.removeAllEvents();
      calendar.addEventSource(eventosFiltrados);
    }
  }
  
  // Funciones de vista
  function setupViews() {
    const viewButtons = document.querySelectorAll('.vista-btn');
    
    viewButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remover clase active de todos los botones
        viewButtons.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        const view = this.getAttribute('data-view');
        calendar.changeView(view);
      });
    });
  }
  
  // Mostrar detalle del evento
  function mostrarDetalleEvento(evento) {
    const modal = document.createElement('div');
    modal.className = 'evento-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 15px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    const startTime = evento.start ? evento.start.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Todo el día';
    
    modalContent.innerHTML = `
      <h3 style="color: var(--color-primary); margin-bottom: 1rem;">${evento.title}</h3>
      <p style="margin-bottom: 1rem;"><strong>Fecha:</strong> ${startTime}</p>
      <p style="margin-bottom: 2rem;">Para más información sobre este evento, contáctanos por WhatsApp.</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button onclick="this.closest('.evento-modal').remove()" 
                style="padding: 0.8rem 1.5rem; background: #ccc; border: none; border-radius: 8px; cursor: pointer;">
          Cerrar
        </button>
        <a href="https://wa.me/595982044910?text=Hola,%20me%20gustaría%20información%20sobre%20${encodeURIComponent(evento.title)}" 
           target="_blank" 
           style="padding: 0.8rem 1.5rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: 8px;">
          Contactar
        </a>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  // Actualizar lista de próximos eventos
  function actualizarProximosEventos() {
    const listaEventos = document.getElementById('lista-eventos');
    const ahora = new Date();
    const proximosEventos = [];
    
    // Obtener eventos de los próximos 7 días
    eventosDelSantuario.forEach(evento => {
      if (evento.start) {
        const fechaEvento = new Date(evento.start);
        if (fechaEvento > ahora && fechaEvento <= new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          proximosEventos.push({
            ...evento,
            fecha: fechaEvento
          });
        }
      }
    });
    
    // Ordenar por fecha
    proximosEventos.sort((a, b) => a.fecha - b.fecha);
    
    // Actualizar HTML
    if (proximosEventos.length > 0) {
      listaEventos.innerHTML = proximosEventos.slice(0, 3).map(evento => {
        const fecha = evento.fecha;
        const dia = fecha.getDate();
        const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
        const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        const tipoClase = evento.classNames ? evento.classNames[0] : 'evento';
        
        return `
          <div class="evento-item">
            <div class="evento-fecha">
              <span class="evento-dia">${dia}</span>
              <span class="evento-mes">${mes}</span>
            </div>
            <div class="evento-info">
              <h4>${evento.title}</h4>
              <p><i class="fas fa-clock"></i> ${hora}</p>
              <span class="evento-tipo ${tipoClase}">${tipoClase.charAt(0).toUpperCase() + tipoClase.slice(1)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  
  // Inicializar todo
  initCalendar();
  setupFilters();
  setupViews();
  actualizarProximosEventos();
  
  console.log('✅ Sistema de calendario moderno inicializado');
});
