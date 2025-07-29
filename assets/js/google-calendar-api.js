/* ===========================
   GOOGLE CALENDAR API - GESTIÓN COMPLETA
   =========================== */

class GoogleCalendarAPI {
  constructor() {
    // CONFIGURACIÓN - Debes reemplazar estos valores
    this.API_KEY = 'AIzaSyBNUwRynz7Hc8MGnHVYsa68VIaBFSPtb0Q'; // Reemplazar con tu API Key
    this.CLIENT_ID = 'T382456115228-863441gkbllch0d6h9b3rmeumopfi7e2.apps.googleusercontent.com'; // Reemplazar con tu Client ID
    this.CALENDAR_ID = 'primary'; // O tu Calendar ID específico
    
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
    
    this.gapi = null;
    this.tokenClient = null;
    this.isSignedIn = false;
    this.initAttempts = 0;
    this.maxInitAttempts = 3;
    
    // Verificar si estamos en un entorno compatible
    if (typeof window === 'undefined') {
      console.warn('Google Calendar API requiere entorno del navegador');
      return;
    }
    
    this.init();
  }

  async init() {
    try {
      console.log('🔄 Iniciando Google Calendar API...');
      this.initAttempts++;
      
      // Verificar credenciales
      if (!this.API_KEY || this.API_KEY === 'TU_API_KEY_AQUI' || 
          !this.CLIENT_ID || this.CLIENT_ID === 'TU_CLIENT_ID_AQUI') {
        throw new Error('Credenciales de Google Calendar no configuradas correctamente');
      }
      
      await this.loadGoogleAPI();
      await this.initializeGapi();
      this.setupUI();
      
      console.log('✅ Google Calendar API inicializado correctamente');
      this.mostrarMensaje('Google Calendar API configurado correctamente', 'success');
      
    } catch (error) {
      console.error('❌ Error inicializando Google Calendar API:', error);
      
      if (this.initAttempts < this.maxInitAttempts) {
        console.log(`🔄 Reintentando inicialización (${this.initAttempts}/${this.maxInitAttempts})...`);
        setTimeout(() => this.init(), 2000);
        return;
      }
      
      // Mostrar error específico según el tipo
      if (error.message.includes('Credenciales')) {
        this.mostrarError('❌ Credenciales de Google Calendar no configuradas. Consulta la documentación en CONFIGURACION-GOOGLE-API.md');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        this.mostrarError('❌ Error de conexión. Verifica tu conexión a internet.');
      } else {
        this.mostrarError('❌ Error al conectar con Google Calendar. Verifica la configuración.');
      }
      
      // Configurar modo degradado (solo calendario embebido)
      this.setupDegradedMode();
    }
  }

  // Configurar modo degradado sin API
  setupDegradedMode() {
    console.log('🔄 Configurando modo degradado (solo calendario embebido)');
    
    // Ocultar controles avanzados
    const advancedPanel = document.getElementById('advanced-panel');
    const authPanel = document.getElementById('auth-panel');
    const btnAvanzado = document.getElementById('btn-calendario-avanzado');
    
    if (advancedPanel) advancedPanel.style.display = 'none';
    if (authPanel) authPanel.style.display = 'none';
    if (btnAvanzado) {
      btnAvanzado.style.display = 'none';
      btnAvanzado.disabled = true;
    }
    
    // Mostrar solo el calendario embebido
    const btnSimple = document.getElementById('btn-calendario-simple');
    if (btnSimple) {
      btnSimple.classList.add('active');
      btnSimple.textContent = 'Calendario (Modo Simplificado)';
    }
    
    this.mostrarMensaje('Funcionando en modo simplificado. Para funciones avanzadas, configura las credenciales de Google Calendar API.', 'info');
  }

  // Cargar Google API
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      console.log('🔄 Cargando Google API...');
      
      if (window.gapi && window.google) {
        console.log('✅ Google API ya está cargada');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ GAPI cargada, cargando GSI...');
        const gsiScript = document.createElement('script');
        gsiScript.src = 'https://accounts.google.com/gsi/client';
        gsiScript.async = true;
        gsiScript.defer = true;
        
        gsiScript.onload = () => {
          console.log('✅ GSI cargada');
          resolve();
        };
        gsiScript.onerror = (error) => {
          console.error('❌ Error cargando GSI:', error);
          reject(new Error('Error cargando Google Sign-In'));
        };
        document.head.appendChild(gsiScript);
      };
      
      script.onerror = (error) => {
        console.error('❌ Error cargando GAPI:', error);
        reject(new Error('Error cargando Google API'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Inicializar GAPI
  async initializeGapi() {
    console.log('🔄 Inicializando GAPI...');
    
    if (!window.gapi) {
      throw new Error('Google API no está disponible');
    }
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout inicializando Google API'));
      }, 10000);
      
      gapi.load('client', {
        callback: () => {
          clearTimeout(timeout);
          resolve();
        },
        onerror: () => {
          clearTimeout(timeout);
          reject(new Error('Error cargando cliente de Google API'));
        }
      });
    });
    
    console.log('🔄 Inicializando cliente GAPI...');
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });

    this.gapi = gapi;
    console.log('✅ Cliente GAPI inicializado');
    
    // Configurar OAuth2
    if (!window.google || !window.google.accounts) {
      throw new Error('Google Sign-In no está disponible');
    }
    
    console.log('🔄 Configurando OAuth2...');
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (tokenResponse) => {
        this.handleAuthCallback(tokenResponse);
      },
    });
    console.log('✅ OAuth2 configurado');
  }

  // Configurar interfaz de usuario
  setupUI() {
    this.crearInterfazGestion();
    this.actualizarEstadoAuth();
    this.crearPanelDiagnostico();
  }

  // Crear panel de diagnóstico
  crearPanelDiagnostico() {
    const calendarioContainer = document.querySelector('.calendario-container');
    if (!calendarioContainer) return;

    // Crear panel de diagnóstico
    const diagnosticPanel = document.createElement('div');
    diagnosticPanel.className = 'diagnostic-panel';
    diagnosticPanel.innerHTML = `
      <div class="diagnostic-header">
        <h4><i class="fas fa-stethoscope"></i> Diagnóstico de Google Calendar API</h4>
        <button id="run-diagnostic" class="btn-diagnostic">
          <i class="fas fa-play"></i> Ejecutar Diagnóstico
        </button>
      </div>
      <div id="diagnostic-results" class="diagnostic-results" style="display: none;">
        <div class="diagnostic-item">
          <span class="diagnostic-label">API Key:</span>
          <span id="api-key-status" class="diagnostic-status">Verificando...</span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Client ID:</span>
          <span id="client-id-status" class="diagnostic-status">Verificando...</span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Google API Scripts:</span>
          <span id="scripts-status" class="diagnostic-status">Verificando...</span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Conexión a Internet:</span>
          <span id="network-status" class="diagnostic-status">Verificando...</span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Estado de Autenticación:</span>
          <span id="auth-status" class="diagnostic-status">Verificando...</span>
        </div>
      </div>
    `;

    // Insertar después de la descripción del calendario
    const descripcion = calendarioContainer.querySelector('.calendario-descripcion');
    if (descripcion) {
      descripcion.after(diagnosticPanel);
    }

    // Configurar el botón de diagnóstico
    const runDiagnosticBtn = document.getElementById('run-diagnostic');
    if (runDiagnosticBtn) {
      runDiagnosticBtn.addEventListener('click', () => this.ejecutarDiagnostico());
    }
  }

  // Ejecutar diagnóstico completo
  async ejecutarDiagnostico() {
    console.log('🔍 Ejecutando diagnóstico de Google Calendar API...');
    
    const resultsDiv = document.getElementById('diagnostic-results');
    if (resultsDiv) resultsDiv.style.display = 'block';

    // Verificar API Key
    this.updateDiagnosticStatus('api-key-status', 
      this.API_KEY && this.API_KEY !== 'TU_API_KEY_AQUI' ? 'success' : 'error',
      this.API_KEY && this.API_KEY !== 'TU_API_KEY_AQUI' ? 'Configurada' : 'No configurada'
    );

    // Verificar Client ID
    this.updateDiagnosticStatus('client-id-status',
      this.CLIENT_ID && this.CLIENT_ID !== 'TU_CLIENT_ID_AQUI' ? 'success' : 'error',
      this.CLIENT_ID && this.CLIENT_ID !== 'TU_CLIENT_ID_AQUI' ? 'Configurado' : 'No configurado'
    );

    // Verificar scripts de Google
    const scriptsLoaded = window.gapi && window.google && window.google.accounts;
    this.updateDiagnosticStatus('scripts-status',
      scriptsLoaded ? 'success' : 'error',
      scriptsLoaded ? 'Cargados correctamente' : 'Error en la carga'
    );

    // Verificar conexión de red
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/$discovery/rest?version=v3', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      this.updateDiagnosticStatus('network-status', 'success', 'Conectado');
    } catch (error) {
      this.updateDiagnosticStatus('network-status', 'error', 'Sin conexión');
    }

    // Verificar estado de autenticación
    this.updateDiagnosticStatus('auth-status',
      this.isSignedIn ? 'success' : 'warning',
      this.isSignedIn ? 'Autenticado' : 'No autenticado'
    );
  }

  // Actualizar estado del diagnóstico
  updateDiagnosticStatus(elementId, status, text) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.className = `diagnostic-status ${status}`;
    element.innerHTML = `
      <i class="fas fa-${status === 'success' ? 'check-circle' : status === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i>
      ${text}
    `;
  }

  // Manejar autenticación
  handleAuthCallback(tokenResponse) {
    if (tokenResponse.error) {
      console.error('Error de autenticación:', tokenResponse.error);
      this.mostrarError('Error de autenticación con Google');
      return;
    }

    this.isSignedIn = true;
    this.actualizarEstadoAuth();
    this.cargarEventos();
    this.mostrarMensaje('¡Conectado a Google Calendar!', 'success');
  }

  // Iniciar sesión
  signIn() {
    if (this.tokenClient) {
      this.tokenClient.requestAccessToken({prompt: 'consent'});
    }
  }

  // Cerrar sesión
  signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      this.isSignedIn = false;
      this.actualizarEstadoAuth();
      this.mostrarMensaje('Sesión cerrada', 'info');
    }
  }

  // Crear interfaz de gestión
  crearInterfazGestion() {
    const calendarioContainer = document.querySelector('.calendario-container');
    
    if (!calendarioContainer) return;

    const interfazHTML = `
      <!-- Panel de autenticación -->
      <div id="auth-panel" class="auth-panel">
        <div class="auth-status">
          <div id="signed-out" class="auth-section">
            <h3><i class="fas fa-sign-in-alt"></i> Conectar con Google Calendar</h3>
            <p>Inicia sesión para gestionar eventos del santuario</p>
            <button id="authorize-btn" class="btn-auth">
              <i class="fab fa-google"></i>
              Conectar con Google
            </button>
          </div>
          
          <div id="signed-in" class="auth-section" style="display: none;">
            <h3><i class="fas fa-check-circle"></i> Conectado a Google Calendar</h3>
            <div class="auth-actions">
              <button id="signout-btn" class="btn-auth secondary">
                <i class="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </button>
              <button id="create-event-btn" class="btn-auth primary">
                <i class="fas fa-plus"></i>
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar eventos -->
      <div id="event-modal" class="event-modal" style="display: none;">
        <div class="event-modal-overlay" onclick="this.parentElement.style.display='none'"></div>
        <div class="event-modal-content">
          <div class="event-modal-header">
            <h3 id="modal-title">
              <i class="fas fa-calendar-plus"></i>
              Crear Nuevo Evento
            </h3>
            <button class="event-modal-close" onclick="this.closest('.event-modal').style.display='none'">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="event-form" class="event-form">
            <div class="form-group">
              <label for="event-title">
                <i class="fas fa-heading"></i>
                Título del Evento *
              </label>
              <input type="text" id="event-title" required placeholder="Ej: Misa Especial de Navidad">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="event-start">
                  <i class="fas fa-clock"></i>
                  Fecha y Hora de Inicio *
                </label>
                <input type="datetime-local" id="event-start" required>
              </div>
              
              <div class="form-group">
                <label for="event-end">
                  <i class="fas fa-clock"></i>
                  Fecha y Hora de Fin *
                </label>
                <input type="datetime-local" id="event-end" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="event-description">
                <i class="fas fa-align-left"></i>
                Descripción
              </label>
              <textarea id="event-description" rows="4" placeholder="Describe el evento, requisitos especiales, etc."></textarea>
            </div>
            
            <div class="form-group">
              <label for="event-location">
                <i class="fas fa-map-marker-alt"></i>
                Ubicación
              </label>
              <input type="text" id="event-location" placeholder="Santuario Diocesano del Santísimo Sacramento">
            </div>
            
            <div class="form-group">
              <label for="event-type">
                <i class="fas fa-tags"></i>
                Tipo de Evento
              </label>
              <select id="event-type">
                <option value="misa">Misa</option>
                <option value="bautismo">Bautismo</option>
                <option value="matrimonio">Matrimonio</option>
                <option value="confesion">Confesión</option>
                <option value="adoracion">Adoración</option>
                <option value="novena">Novena</option>
                <option value="retiro">Retiro</option>
                <option value="charla">Charla</option>
                <option value="evento-especial">Evento Especial</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>
                <input type="checkbox" id="event-notification">
                <i class="fas fa-bell"></i>
                Enviar notificaciones a los feligreses
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-form secondary" onclick="this.closest('.event-modal').style.display='none'">
                <i class="fas fa-times"></i>
                Cancelar
              </button>
              <button type="submit" class="btn-form primary">
                <i class="fas fa-save"></i>
                <span id="submit-text">Crear Evento</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de eventos gestionables -->
      <div id="events-manager" class="events-manager" style="display: none;">
        <h3><i class="fas fa-list"></i> Gestionar Eventos</h3>
        <div id="events-list" class="events-list">
          <!-- Los eventos se cargarán aquí -->
        </div>
      </div>
    `;

    // Insertar después de la descripción del calendario
    const descripcion = calendarioContainer.querySelector('.calendario-descripcion');
    descripcion.insertAdjacentHTML('afterend', interfazHTML);

    this.setupEventListeners();
  }

  // Configurar event listeners
  setupEventListeners() {
    // Botones de autenticación
    document.getElementById('authorize-btn')?.addEventListener('click', () => this.signIn());
    document.getElementById('signout-btn')?.addEventListener('click', () => this.signOut());
    document.getElementById('create-event-btn')?.addEventListener('click', () => this.mostrarModalEvento());

    // Formulario de eventos
    document.getElementById('event-form')?.addEventListener('submit', (e) => this.manejarFormularioEvento(e));

    // Auto-completar fecha de fin cuando se selecciona inicio
    document.getElementById('event-start')?.addEventListener('change', (e) => {
      const start = new Date(e.target.value);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hora
      document.getElementById('event-end').value = end.toISOString().slice(0, 16);
    });
  }

  // Actualizar estado de autenticación
  actualizarEstadoAuth() {
    const signedOut = document.getElementById('signed-out');
    const signedIn = document.getElementById('signed-in');
    const eventsManager = document.getElementById('events-manager');

    if (this.isSignedIn) {
      signedOut.style.display = 'none';
      signedIn.style.display = 'block';
      eventsManager.style.display = 'block';
    } else {
      signedOut.style.display = 'block';
      signedIn.style.display = 'none';
      eventsManager.style.display = 'none';
    }
  }

  // Mostrar modal para crear evento
  mostrarModalEvento(evento = null) {
    const modal = document.getElementById('event-modal');
    const form = document.getElementById('event-form');
    const modalTitle = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');

    if (evento) {
      // Modo edición
      modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Evento';
      submitText.textContent = 'Actualizar Evento';
      this.llenarFormulario(evento);
      form.dataset.eventId = evento.id;
    } else {
      // Modo creación
      modalTitle.innerHTML = '<i class="fas fa-calendar-plus"></i> Crear Nuevo Evento';
      submitText.textContent = 'Crear Evento';
      form.reset();
      delete form.dataset.eventId;
      
      // Valores por defecto
      document.getElementById('event-location').value = 'Santuario Diocesano del Santísimo Sacramento, Asunción, Paraguay';
    }

    modal.style.display = 'flex';
  }

  // Continúa en el próximo bloque...

  // Llenar formulario con datos del evento
  llenarFormulario(evento) {
    document.getElementById('event-title').value = evento.summary || '';
    document.getElementById('event-description').value = evento.description || '';
    document.getElementById('event-location').value = evento.location || '';
    
    // Convertir fechas
    if (evento.start.dateTime) {
      document.getElementById('event-start').value = new Date(evento.start.dateTime).toISOString().slice(0, 16);
    }
    if (evento.end.dateTime) {
      document.getElementById('event-end').value = new Date(evento.end.dateTime).toISOString().slice(0, 16);
    }
  }

  // Manejar envío del formulario
  async manejarFormularioEvento(e) {
    e.preventDefault();
    
    const form = e.target;
    const eventId = form.dataset.eventId;
    
    const eventoData = {
      summary: document.getElementById('event-title').value,
      description: document.getElementById('event-description').value,
      location: document.getElementById('event-location').value,
      start: {
        dateTime: new Date(document.getElementById('event-start').value).toISOString(),
        timeZone: 'America/Asuncion'
      },
      end: {
        dateTime: new Date(document.getElementById('event-end').value).toISOString(),
        timeZone: 'America/Asuncion'
      },
      colorId: this.obtenerColorPorTipo(document.getElementById('event-type').value),
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60}, // 1 día antes
          {method: 'popup', minutes: 60}       // 1 hora antes
        ]
      }
    };

    try {
      let resultado;
      if (eventId) {
        // Actualizar evento existente
        resultado = await this.actualizarEvento(eventId, eventoData);
        this.mostrarMensaje('Evento actualizado correctamente', 'success');
      } else {
        // Crear nuevo evento
        resultado = await this.crearEvento(eventoData);
        this.mostrarMensaje('Evento creado correctamente', 'success');
      }

      // Cerrar modal y recargar eventos
      document.getElementById('event-modal').style.display = 'none';
      this.cargarEventos();

      // Enviar notificación si está marcado
      if (document.getElementById('event-notification').checked) {
        this.enviarNotificacionEvento(resultado);
      }

    } catch (error) {
      console.error('Error al guardar evento:', error);
      this.mostrarError('Error al guardar el evento');
    }
  }

  // Crear evento en Google Calendar
  async crearEvento(eventoData) {
    const response = await gapi.client.calendar.events.insert({
      calendarId: this.CALENDAR_ID,
      resource: eventoData
    });
    return response.result;
  }

  // Actualizar evento existente
  async actualizarEvento(eventId, eventoData) {
    const response = await gapi.client.calendar.events.update({
      calendarId: this.CALENDAR_ID,
      eventId: eventId,
      resource: eventoData
    });
    return response.result;
  }

  // Eliminar evento
  async eliminarEvento(eventId) {
    if (!confirm('¿Está seguro de que desea eliminar este evento?')) {
      return;
    }

    try {
      await gapi.client.calendar.events.delete({
        calendarId: this.CALENDAR_ID,
        eventId: eventId
      });
      
      this.mostrarMensaje('Evento eliminado correctamente', 'success');
      this.cargarEventos();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      this.mostrarError('Error al eliminar el evento');
    }
  }

  // Cargar eventos del calendario
  async cargarEventos() {
    if (!this.isSignedIn) return;

    try {
      const now = new Date();
      const response = await gapi.client.calendar.events.list({
        calendarId: this.CALENDAR_ID,
        timeMin: now.toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const eventos = response.result.items || [];
      this.mostrarEventosEnLista(eventos);
      
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      this.mostrarError('Error al cargar eventos');
    }
  }

  // Mostrar eventos en la lista de gestión
  mostrarEventosEnLista(eventos) {
    const lista = document.getElementById('events-list');
    if (!lista) return;

    if (eventos.length === 0) {
      lista.innerHTML = `
        <div class="no-events">
          <i class="fas fa-calendar-times"></i>
          <p>No hay eventos próximos</p>
        </div>
      `;
      return;
    }

    lista.innerHTML = eventos.map(evento => {
      const fecha = new Date(evento.start.dateTime || evento.start.date);
      const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: evento.start.dateTime ? '2-digit' : undefined,
        minute: evento.start.dateTime ? '2-digit' : undefined
      });

      return `
        <div class="event-item">
          <div class="event-info">
            <div class="event-title">
              <i class="fas fa-calendar-alt"></i>
              ${evento.summary}
            </div>
            <div class="event-details">
              <span class="event-date">
                <i class="fas fa-clock"></i>
                ${fechaFormateada}
              </span>
              ${evento.location ? `
                <span class="event-location">
                  <i class="fas fa-map-marker-alt"></i>
                  ${evento.location}
                </span>
              ` : ''}
            </div>
            ${evento.description ? `
              <div class="event-description">
                ${evento.description.substring(0, 100)}${evento.description.length > 100 ? '...' : ''}
              </div>
            ` : ''}
          </div>
          <div class="event-actions">
            <button class="btn-event-action edit" onclick="googleCalendarAPI.mostrarModalEvento(${JSON.stringify(evento).replace(/"/g, '&quot;')})">
              <i class="fas fa-edit"></i>
              Editar
            </button>
            <button class="btn-event-action delete" onclick="googleCalendarAPI.eliminarEvento('${evento.id}')">
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
            <button class="btn-event-action share" onclick="googleCalendarAPI.compartirEvento(${JSON.stringify(evento).replace(/"/g, '&quot;')})">
              <i class="fas fa-share-alt"></i>
              Compartir
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Obtener color por tipo de evento
  obtenerColorPorTipo(tipo) {
    const colores = {
      'misa': '1',           // Azul
      'bautismo': '7',       // Azul claro
      'matrimonio': '4',     // Rosa
      'confesion': '6',      // Naranja
      'adoracion': '3',      // Púrpura
      'novena': '2',         // Verde
      'retiro': '8',         // Gris
      'charla': '9',         // Azul oscuro
      'evento-especial': '11', // Rojo
      'otro': '5'            // Amarillo
    };
    return colores[tipo] || '1';
  }

  // Compartir evento
  compartirEvento(evento) {
    const fecha = new Date(evento.start.dateTime || evento.start.date);
    const fechaTexto = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: evento.start.dateTime ? '2-digit' : undefined,
      minute: evento.start.dateTime ? '2-digit' : undefined
    });

    const texto = `📅 ${evento.summary}\n📅 ${fechaTexto}\n📍 ${evento.location || 'Santuario Diocesano'}\n\n${evento.description || 'Te esperamos en este evento especial'}\n\n✝️ Santuario Diocesano del Santísimo Sacramento`;
    
    if (navigator.share) {
      navigator.share({
        title: evento.summary,
        text: texto,
        url: evento.htmlLink || window.location.href
      });
    } else {
      navigator.clipboard?.writeText(texto).then(() => {
        this.mostrarMensaje('Evento copiado al portapapeles', 'success');
      });
    }
  }

  // Enviar notificación de evento
  enviarNotificacionEvento(evento) {
    // Aquí puedes integrar con tu sistema de notificaciones
    // Por ejemplo, enviar email a la lista de suscriptores
    console.log('Enviando notificación para evento:', evento.summary);
    
    // Simular notificación push
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nuevo evento: ${evento.summary}`, {
        body: `${new Date(evento.start.dateTime).toLocaleDateString('es-ES')} - ${evento.location}`,
        icon: 'assets/images/logo.png'
      });
    }
  }

  // Mostrar mensajes
  mostrarMensaje(mensaje, tipo = 'info') {
    const colores = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    
    const notif = document.createElement('div');
    notif.className = 'api-notification';
    notif.textContent = mensaje;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colores[tipo]};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.opacity = '1';
      notif.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100px)';
      setTimeout(() => notif.remove(), 300);
    }, 4000);
  }

  mostrarError(mensaje) {
    this.mostrarMensaje(mensaje, 'error');
  }
}

// Instancia global
window.GoogleCalendarAPI = GoogleCalendarAPI;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.googleCalendarAPI = new GoogleCalendarAPI();
});
