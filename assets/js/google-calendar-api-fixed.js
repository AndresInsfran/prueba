/* ===========================
   GOOGLE CALENDAR API - VERSIÓN SIMPLIFICADA Y FUNCIONAL
   =========================== */

class GoogleCalendarAPI {
  constructor() {
    // CONFIGURACIÓN - Debes reemplazar estos valores
    this.API_KEY = 'TU_API_KEY_AQUI'; // Reemplazar con tu API Key real
    this.CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // Reemplazar con tu Client ID real
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
    this.configurarEventListeners();
    this.actualizarEstadoAuth();
    this.crearPanelDiagnostico();
  }

  // Configurar event listeners
  configurarEventListeners() {
    // Botón de calendario simple/avanzado
    const btnSimple = document.getElementById('btn-calendario-simple');
    const btnAvanzado = document.getElementById('btn-calendario-avanzado');
    
    if (btnSimple) {
      btnSimple.addEventListener('click', () => {
        this.mostrarCalendarioSimple();
      });
    }
    
    if (btnAvanzado) {
      btnAvanzado.addEventListener('click', () => {
        this.mostrarCalendarioAvanzado();
      });
    }

    // Botón de autorización
    const authorizeBtn = document.getElementById('authorize-btn');
    if (authorizeBtn) {
      authorizeBtn.addEventListener('click', () => {
        console.log('🔄 Iniciando proceso de autenticación...');
        this.signIn();
      });
    }

    // Botón de cerrar sesión
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        console.log('🔄 Cerrando sesión...');
        this.signOut();
      });
    }

    // Botón de crear evento
    const createEventBtn = document.getElementById('create-event-btn');
    if (createEventBtn) {
      createEventBtn.addEventListener('click', () => {
        console.log('🔄 Abriendo formulario de evento...');
        this.mostrarModalEvento();
      });
    }

    // Botón de actualizar
    const refreshBtn = document.getElementById('refresh-calendar-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        console.log('🔄 Actualizando calendario...');
        this.cargarEventos();
      });
    }
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
    } else {
      this.mostrarError('Sistema de autenticación no disponible');
    }
  }

  // Cerrar sesión
  signOut() {
    try {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
      }
      this.isSignedIn = false;
      this.actualizarEstadoAuth();
      this.mostrarMensaje('Sesión cerrada correctamente', 'info');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      this.mostrarError('Error al cerrar sesión');
    }
  }

  // Actualizar estado de autenticación
  actualizarEstadoAuth() {
    try {
      const authPanel = document.getElementById('auth-panel');
      const advancedPanel = document.getElementById('advanced-panel');
      const authorizeBtn = document.getElementById('authorize-btn');
      const signoutBtn = document.getElementById('signout-btn');

      if (this.isSignedIn) {
        // Usuario autenticado
        if (authPanel) authPanel.style.display = 'none';
        if (advancedPanel) advancedPanel.style.display = 'block';
        if (authorizeBtn) authorizeBtn.style.display = 'none';
        if (signoutBtn) signoutBtn.style.display = 'inline-flex';
        
        console.log('✅ Estado de autenticación actualizado: Usuario conectado');
      } else {
        // Usuario no autenticado
        if (authPanel) authPanel.style.display = 'block';
        if (advancedPanel) advancedPanel.style.display = 'none';
        if (authorizeBtn) authorizeBtn.style.display = 'inline-flex';
        if (signoutBtn) signoutBtn.style.display = 'none';
        
        console.log('ℹ️ Estado de autenticación actualizado: Usuario no conectado');
      }
    } catch (error) {
      console.error('❌ Error actualizando estado de autenticación:', error);
      // No mostrar alerta, solo registrar el error
    }
  }

  // Mostrar calendario simple
  mostrarCalendarioSimple() {
    const btnSimple = document.getElementById('btn-calendario-simple');
    const btnAvanzado = document.getElementById('btn-calendario-avanzado');
    const authPanel = document.getElementById('auth-panel');
    const advancedPanel = document.getElementById('advanced-panel');

    if (btnSimple) btnSimple.classList.add('active');
    if (btnAvanzado) btnAvanzado.classList.remove('active');
    if (authPanel) authPanel.style.display = 'none';
    if (advancedPanel) advancedPanel.style.display = 'none';
  }

  // Mostrar calendario avanzado
  mostrarCalendarioAvanzado() {
    const btnSimple = document.getElementById('btn-calendario-simple');
    const btnAvanzado = document.getElementById('btn-calendario-avanzado');
    const authPanel = document.getElementById('auth-panel');
    const advancedPanel = document.getElementById('advanced-panel');

    if (btnSimple) btnSimple.classList.remove('active');
    if (btnAvanzado) btnAvanzado.classList.add('active');
    
    if (this.isSignedIn) {
      if (authPanel) authPanel.style.display = 'none';
      if (advancedPanel) advancedPanel.style.display = 'block';
    } else {
      if (authPanel) authPanel.style.display = 'block';
      if (advancedPanel) advancedPanel.style.display = 'none';
    }
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

  // Mostrar modal para crear evento (simplificado)
  mostrarModalEvento(evento = null) {
    console.log('📝 Mostrando formulario de evento...');
    
    // Por ahora, mostrar un prompt simple hasta implementar el modal completo
    const titulo = prompt('Título del evento:', evento ? evento.summary : '');
    if (!titulo) return;
    
    const fechaInicio = prompt('Fecha y hora de inicio (YYYY-MM-DD HH:MM):', 
      evento ? new Date(evento.start.dateTime).toISOString().slice(0, 16).replace('T', ' ') : 
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    );
    if (!fechaInicio) return;
    
    const descripcion = prompt('Descripción (opcional):', evento ? evento.description || '' : '');
    
    // Crear evento simple
    const eventoData = {
      summary: titulo,
      description: descripcion || 'Evento del Santuario',
      location: 'Santuario Diocesano del Santísimo Sacramento, Asunción, Paraguay',
      start: {
        dateTime: new Date(fechaInicio.replace(' ', 'T')).toISOString(),
        timeZone: 'America/Asuncion'
      },
      end: {
        dateTime: new Date(new Date(fechaInicio.replace(' ', 'T')).getTime() + 60*60*1000).toISOString(), // +1 hora
        timeZone: 'America/Asuncion'
      }
    };
    
    if (evento && evento.id) {
      this.actualizarEvento(evento.id, eventoData);
    } else {
      this.crearEvento(eventoData);
    }
  }

  // Crear evento
  async crearEvento(eventoData) {
    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: this.CALENDAR_ID,
        resource: eventoData
      });
      
      console.log('✅ Evento creado:', response.result);
      this.mostrarMensaje('Evento creado correctamente', 'success');
      this.cargarEventos(); // Recargar eventos
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      this.mostrarError('Error al crear el evento');
    }
  }

  // Actualizar evento
  async actualizarEvento(eventId, eventoData) {
    try {
      const response = await gapi.client.calendar.events.update({
        calendarId: this.CALENDAR_ID,
        eventId: eventId,
        resource: eventoData
      });
      
      console.log('✅ Evento actualizado:', response.result);
      this.mostrarMensaje('Evento actualizado correctamente', 'success');
      this.cargarEventos(); // Recargar eventos
    } catch (error) {
      console.error('❌ Error actualizando evento:', error);
      this.mostrarError('Error al actualizar el evento');
    }
  }

  // Cargar eventos
  async cargarEventos() {
    if (!this.isSignedIn) {
      console.log('ℹ️ Usuario no autenticado, no se pueden cargar eventos');
      return;
    }

    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: this.CALENDAR_ID,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      const events = response.result.items;
      console.log('✅ Eventos cargados:', events.length);
      this.mostrarEventosEnLista(events);
    } catch (error) {
      console.error('❌ Error cargando eventos:', error);
      this.mostrarError('Error al cargar eventos');
    }
  }

  // Mostrar eventos en la lista de gestión (simplificado)
  mostrarEventosEnLista(eventos) {
    const lista = document.getElementById('events-list');
    if (!lista) return;

    if (eventos.length === 0) {
      lista.innerHTML = '<p class="loading-events">No hay eventos próximos</p>';
      return;
    }

    // Mostrar solo los primeros 5 eventos de manera simple
    const eventosHtml = eventos.slice(0, 5).map(evento => {
      const fecha = new Date(evento.start.dateTime || evento.start.date);
      const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: evento.start.dateTime ? '2-digit' : undefined,
        minute: evento.start.dateTime ? '2-digit' : undefined
      });

      return `
        <div class="event-simple">
          <strong>${evento.summary || 'Sin título'}</strong><br>
          <small>${fechaFormateada}</small>
        </div>
      `;
    }).join('');

    lista.innerHTML = eventosHtml;
  }

  // Mostrar mensaje
  mostrarMensaje(mensaje, tipo = 'info') {
    console.log(`📢 ${tipo.toUpperCase()}: ${mensaje}`);
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
      <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${mensaje}</span>
      <button onclick="this.parentElement.remove()" class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Mostrar error
  mostrarError(mensaje) {
    this.mostrarMensaje(mensaje, 'error');
  }
}

// Crear instancia global cuando se carga el script
let googleCalendarAPI;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    googleCalendarAPI = new GoogleCalendarAPI();
  });
} else {
  googleCalendarAPI = new GoogleCalendarAPI();
}

// Exportar para uso global
window.googleCalendarAPI = googleCalendarAPI;
