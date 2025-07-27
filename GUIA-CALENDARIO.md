# 📅 GUÍA: Configuración del Calendario de Google para el Santuario

## 🎯 Opción 1: Calendario Embebido (Actual - Más Simple)

### ✅ **YA IMPLEMENTADO** - Características:
- ✅ Calendario embebido funcional
- ✅ Notificaciones del navegador
- ✅ Diseño responsive
- ✅ Integración con WhatsApp para solicitudes
- ✅ Sistema de eventos simulados

### 📋 Para personalizar tu calendario:

1. **Crear tu Calendario de Google:**
   - Ve a [Google Calendar](https://calendar.google.com)
   - Clic en "+" junto a "Otros calendarios"
   - "Crear nuevo calendario"
   - Nombre: "Eventos Santuario Diocesano"
   - Descripción: "Eventos, misas especiales y celebraciones"

2. **Obtener código de integración:**
   - En tu calendario → Configuración y uso compartido
   - "Configuración de acceso" → Hacer público
   - "Integrar calendario" → Copiar código HTML

3. **Reemplazar en el código:**
   ```html
   <!-- Busca esta línea en index.html (línea ~325) -->
   <iframe src="TU_CODIGO_AQUI" ...>
   ```

---

## 🚀 Opción 2: Google Calendar API (Avanzado)

### 🔧 **PARA IMPLEMENTAR** - Características avanzadas:
- 📝 Crear/editar/eliminar eventos desde la web
- 👥 Gestión de invitados
- 🔔 Notificaciones automáticas por email
- 📊 Sincronización bidireccional
- 🎨 Personalización completa

### 📝 Pasos para implementar API:

#### 1. Configuración en Google Cloud Console:
```bash
# 1. Ve a Google Cloud Console
https://console.cloud.google.com/

# 2. Crear proyecto nuevo
Nombre: "santuario-calendario"

# 3. Habilitar Google Calendar API
APIs & Services → Library → Google Calendar API → Enable

# 4. Crear credenciales
APIs & Services → Credentials → Create Credentials → API Key
```

#### 2. Código JavaScript para API:
```javascript
// Configuración de la API
const CALENDAR_API_KEY = 'TU_API_KEY_AQUI';
const CALENDAR_ID = 'TU_CALENDAR_ID_AQUI';

// Función para obtener eventos
async function obtenerEventos() {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_API_KEY}&timeMin=${new Date().toISOString()}&maxResults=10&singleEvents=true&orderBy=startTime`
  );
  const data = await response.json();
  return data.items;
}

// Función para crear evento
async function crearEvento(evento) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    }
  );
  return response.json();
}
```

#### 3. HTML para formulario de eventos:
```html
<div class="crear-evento-form">
  <h3>Crear Nuevo Evento</h3>
  <form id="evento-form">
    <input type="text" id="evento-titulo" placeholder="Título del evento" required>
    <input type="datetime-local" id="evento-fecha" required>
    <textarea id="evento-descripcion" placeholder="Descripción"></textarea>
    <button type="submit">Crear Evento</button>
  </form>
</div>
```

---

## 🎨 Personalización Actual Disponible

### 📅 Eventos que puedes agregar al calendario:
- **Misas especiales** (Navidad, Semana Santa, etc.)
- **Bautismos y matrimonios**
- **Novenas y adoraciones**
- **Eventos comunitarios**
- **Confesiones especiales**
- **Retiros y charlas**

### 🔔 Sistema de notificaciones:
- ✅ Notificaciones del navegador
- ✅ Recordatorios 24h antes
- ✅ Recordatorios 1h antes
- ✅ Configuración on/off

### 📱 Funcionalidades implementadas:
- ✅ **Responsive design** (móvil/tablet/desktop)
- ✅ **Integración WhatsApp** para solicitudes
- ✅ **Notificaciones push** del navegador
- ✅ **Animaciones suaves** de carga
- ✅ **Diseño consistente** con el sitio

---

## 🚀 Próximos pasos recomendados:

### Inmediato (5 minutos):
1. **Crear calendario en Google Calendar**
2. **Hacer público el calendario**
3. **Reemplazar URL en el código**
4. **Agregar primeros eventos**

### Avanzado (2-3 horas):
1. **Configurar Google Cloud project**
2. **Implementar Calendar API**
3. **Crear formularios de gestión**
4. **Configurar autenticación OAuth**

---

## 📞 Contacto para implementación:

¿Necesitas ayuda con la configuración avanzada?
- **WhatsApp**: +595 98 204 4910
- **Mensaje**: "Necesito ayuda con el calendario de Google API"

---

## 🔗 Enlaces útiles:

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Calendar Embed Generator](https://calendar.google.com/calendar/u/0/embedhelper)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Estado actual**: ✅ Calendario embebido funcional con notificaciones  
**Próximo nivel**: 🚀 Google Calendar API para gestión completa
