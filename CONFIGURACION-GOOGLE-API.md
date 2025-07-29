# 🚀 CONFIGURACIÓN GOOGLE CALENDAR API - GUÍA COMPLETA

## 🚨 ¿Ves el error "Error al conectar con Google Calendar"?

### ✅ **SOLUCIÓN RÁPIDA:**
1. **Ve a la sección "Calendario de Eventos"** en tu sitio web
2. **Busca el panel "Diagnóstico de Google Calendar API"**
3. **Haz clic en "Ejecutar Diagnóstico"**
4. **Revisa los resultados** y ve a `SOLUCION-ERROR-GOOGLE-CALENDAR.md`

### 🔄 **MODO DEGRADADO AUTOMÁTICO:**
- Si no puedes configurar la API ahora, el sistema funciona en **modo simplificado**
- Tienes el **calendario embebido** que funciona sin configuración adicional
- Para funciones avanzadas, continúa con esta guía

---

## ✅ ¿Qué acabamos de implementar?

### 🎯 **SISTEMA COMPLETO DE GESTIÓN DE CALENDARIO:**
- ✅ **Autenticación con Google** (OAuth 2.0)
- ✅ **Crear eventos** desde la web
- ✅ **Editar eventos** existentes
- ✅ **Eliminar eventos** con confirmación
- ✅ **Compartir eventos** (WhatsApp, redes sociales)
- ✅ **Notificaciones automáticas** (email + push)
- ✅ **Interfaz intuitiva** para gestión
- ✅ **Colores por tipo** de evento
- ✅ **Diseño responsive** completo
- ✅ **Panel de diagnóstico** integrado
- ✅ **Modo degradado** automático

---

## 🔧 PASOS PARA ACTIVAR LA API (15-20 minutos)

### 1️⃣ **Crear Proyecto en Google Cloud Console**

```bash
# 1. Ve a Google Cloud Console
https://console.cloud.google.com/

# 2. Crear nuevo proyecto
- Clic en "Seleccionar proyecto" → "Nuevo proyecto"
- Nombre: "Santuario-Calendar-API"
- Organización: (tu cuenta personal)
- Clic "Crear"
```

### 2️⃣ **Habilitar Google Calendar API**

```bash
# 1. En el proyecto creado:
APIs y servicios → Biblioteca

# 2. Buscar "Google Calendar API"
- Clic en "Google Calendar API"
- Clic "Habilitar"

# 3. También habilitar:
- Google+ API (para OAuth)
- People API (opcional, para perfiles)
```

### 3️⃣ **Crear Credenciales**

```bash
# 1. APIs y servicios → Credenciales

# 2. Crear API Key:
- Clic "Crear credenciales" → "Clave de API"
- Copiar la clave generada
- Clic "Restringir clave"
- Restricciones de API → Seleccionar "Google Calendar API"
- Guardar

# 3. Crear OAuth 2.0 Client ID:
- Clic "Crear credenciales" → "ID de cliente de OAuth 2.0"
- Tipo de aplicación: "Aplicación web"
- Nombre: "Santuario Calendar Web"
- Orígenes autorizados de JavaScript:
  * http://localhost:8000
  * https://tu-dominio.com
- URI de redirección autorizados:
  * http://localhost:8000
  * https://tu-dominio.com
- Crear
- Copiar "ID de cliente"
```

### 4️⃣ **Configurar las Credenciales en el Código**

```javascript
// Archivo: assets/js/google-calendar-api.js
// Líneas 7-9, reemplazar:

this.API_KEY = 'TU_API_KEY_AQUI';          // ← Tu API Key aquí
this.CLIENT_ID = 'TU_CLIENT_ID_AQUI';      // ← Tu Client ID aquí
this.CALENDAR_ID = 'primary';              // ← O tu Calendar ID específico
```

**Ejemplo:**
```javascript
this.API_KEY = 'AIzaSyB1Zm4xR8vE2qF9YhJk3LpN7MsQt6WvXyZ';
this.CLIENT_ID = '123456789-abc123def456.apps.googleusercontent.com';
this.CALENDAR_ID = 'primary'; // o 'tu-email@gmail.com'
```

### 5️⃣ **Configurar OAuth Consent Screen**

```bash
# 1. APIs y servicios → Pantalla de consentimiento OAuth

# 2. Configuración externa:
- Nombre de la aplicación: "Santuario Calendario"
- Email de soporte: tu-email@gmail.com
- Dominio autorizado: tu-dominio.com
- Email del desarrollador: tu-email@gmail.com

# 3. Scopes (permisos):
- Agregar scope: ../auth/calendar
- Agregar scope: ../auth/calendar.events

# 4. Usuarios de prueba:
- Agregar tu email
- Agregar emails de otros administradores
```

---

## 🎨 PERSONALIZACIÓN AVANZADA

### 📅 **Tipos de Eventos Disponibles:**
```javascript
// En google-calendar-api.js, línea ~450
const colores = {
  'misa': '1',           // Azul - Misas regulares
  'bautismo': '7',       // Azul claro - Bautismos
  'matrimonio': '4',     // Rosa - Matrimonios
  'confesion': '6',      // Naranja - Confesiones
  'adoracion': '3',      // Púrpura - Adoración
  'novena': '2',         // Verde - Novenas
  'retiro': '8',         // Gris - Retiros
  'charla': '9',         // Azul oscuro - Charlas
  'evento-especial': '11', // Rojo - Eventos especiales
  'otro': '5'            // Amarillo - Otros
};
```

### 🔔 **Sistema de Notificaciones:**
```javascript
// Configurar recordatorios automáticos
reminders: {
  useDefault: false,
  overrides: [
    {method: 'email', minutes: 24 * 60}, // 1 día antes por email
    {method: 'popup', minutes: 60}       // 1 hora antes popup
  ]
}
```

### 🌐 **Configurar Dominio de Producción:**
```bash
# Cuando subas a producción:
# 1. En Google Cloud Console → Credenciales
# 2. Editar OAuth 2.0 Client ID
# 3. Agregar tu dominio real:
#    - https://santuariodiocesano.com
#    - https://www.santuariodiocesano.com
```

---

## 🧪 TESTING Y VERIFICACIÓN

### 1️⃣ **Prueba Local (Desarrollo):**
```bash
# 1. Abrir: http://localhost:8000#calendario
# 2. Clic "Conectar con Google"
# 3. Autorizar permisos
# 4. Crear evento de prueba
# 5. Verificar en Google Calendar
```

### 2️⃣ **Verificar Funcionalidades:**
- ✅ Login/Logout con Google
- ✅ Crear evento nuevo
- ✅ Editar evento existente
- ✅ Eliminar evento
- ✅ Compartir evento
- ✅ Notificaciones push
- ✅ Colores por categoría

### 3️⃣ **Solución de Problemas Comunes:**

**Error: "Origen no autorizado"**
```bash
# Solución: Verificar dominios en OAuth 2.0
- Google Cloud Console → Credenciales
- Editar Client ID
- Agregar tu dominio exacto
```

**Error: "API no habilitada"**
```bash
# Solución: Habilitar todas las APIs necesarias
- Google Calendar API ✅
- Google+ API ✅
- People API ✅
```

**Error: "Credenciales inválidas"**
```bash
# Solución: Verificar API Key y Client ID
- Copiar exactamente desde Google Cloud Console
- Sin espacios adicionales
- Verificar restricciones de API Key
```

---

## 📊 MONITOREO Y ANALYTICS

### 📈 **Verificar Uso de API:**
```bash
# Google Cloud Console → APIs y servicios → Panel
# Monitorear:
- Solicitudes por día
- Errores de API
- Cuotas utilizadas
```

### 📝 **Logs de Eventos:**
```javascript
// Ver logs en DevTools Console:
// - Eventos creados
// - Errores de API
// - Estados de autenticación
```

---

## 🔒 SEGURIDAD Y MEJORES PRÁCTICAS

### 🛡️ **Configuraciones de Seguridad:**
```bash
# 1. Restringir API Key:
- Solo Google Calendar API
- Solo tu dominio

# 2. OAuth Consent Screen:
- Estado: "En producción" (cuando esté listo)
- Verificación del dominio

# 3. Scopes mínimos:
- Solo calendar y calendar.events
- No solicitar permisos innecesarios
```

### 🚫 **NO HACER:**
- ❌ Compartir API Keys en repositorios públicos
- ❌ Usar credenciales de desarrollo en producción
- ❌ Dar acceso a usuarios no autorizados
- ❌ Olvidar configurar restricciones de dominio

---

## 🎯 PRÓXIMOS PASOS

### Inmediato (Hoy):
1. ✅ Seguir pasos 1-4 de configuración
2. ✅ Probar en http://localhost:8000
3. ✅ Crear primer evento de prueba

### Corto plazo (Esta semana):
1. 🔄 Configurar calendario real del santuario
2. 🔄 Agregar eventos regulares (misas, confesiones)
3. 🔄 Probar notificaciones
4. 🔄 Capacitar a otros administradores

### Largo plazo (Próximo mes):
1. 🚀 Subir a producción
2. 🚀 Configurar dominio real
3. 🚀 Integrar con sistema de emails
4. 🚀 Analytics de eventos

---

## 📞 SOPORTE

**Si necesitas ayuda:**
- 📧 **Documentación**: [Google Calendar API Docs](https://developers.google.com/calendar/api)
- 🆘 **Soporte Google**: [Cloud Support](https://cloud.google.com/support/)
- 💬 **Comunidad**: [Stack Overflow](https://stackoverflow.com/questions/tagged/google-calendar-api)

---

**Estado actual**: 🎉 Sistema completo implementado, listo para configurar credenciales  
**Próximo paso**: 🔧 Seguir pasos 1-4 para activar API  
**Tiempo estimado**: ⏱️ 15-20 minutos de configuración
