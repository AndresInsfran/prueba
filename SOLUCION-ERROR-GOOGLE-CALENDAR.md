# 🔧 Solución al Error "Error al conectar con Google Calendar"

## 📋 Diagnóstico del Problema

El error indica que hay un problema con la configuración de Google Calendar API. Aquí te explico cómo solucionarlo paso a paso.

## 🔍 Panel de Diagnóstico Integrado

Hemos agregado un **Panel de Diagnóstico** al sitio web que te ayudará a identificar exactamente cuál es el problema:

1. **Ve a la sección "Calendario de Eventos"** en tu sitio web
2. **Busca el panel "Diagnóstico de Google Calendar API"**
3. **Haz clic en "Ejecutar Diagnóstico"**
4. **Revisa los resultados** - te mostrará exactamente qué está fallando

## 🛠️ Soluciones Según el Diagnóstico

### ❌ API Key: "No configurada"
**Problema**: La API Key no está configurada correctamente
**Solución**:
```javascript
// En assets/js/google-calendar-api.js, línea 7:
this.API_KEY = 'TU_VERDADERA_API_KEY_AQUI'; // Reemplaza esto
```

### ❌ Client ID: "No configurado"
**Problema**: El Client ID no está configurado correctamente
**Solución**:
```javascript
// En assets/js/google-calendar-api.js, línea 8:
this.CLIENT_ID = 'TU_VERDADERO_CLIENT_ID_AQUI'; // Reemplaza esto
```

### ❌ Google API Scripts: "Error en la carga"
**Problema**: No se pueden cargar los scripts de Google
**Posibles causas**:
- Conexión a internet intermitente
- Bloqueador de anuncios/scripts activo
- Restricciones de red corporativa

**Solución**:
1. Desactiva temporalmente bloqueadores de anuncios
2. Verifica tu conexión a internet
3. Intenta desde otra red

### ❌ Conexión a Internet: "Sin conexión"
**Problema**: No hay conectividad a los servicios de Google
**Solución**:
1. Verifica tu conexión a internet
2. Intenta acceder a https://www.google.com
3. Verifica que no hay firewall bloqueando las conexiones

## 🔄 Modo Degradado Automático

Si el sistema no puede conectarse a Google Calendar API, **automáticamente cambiará a "Modo Simplificado"** que incluye:

✅ **Calendario embebido de Google** (funciona sin API)
✅ **Visualización de eventos públicos**
✅ **Interfaz simplificada pero funcional**

## 🚀 Configuración Completa (Para Funciones Avanzadas)

Si quieres las funciones avanzadas (crear/editar/eliminar eventos), sigue estos pasos:

### 1. Obtener Credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita la **Calendar API**
4. Ve a "Credenciales" → "Crear credenciales"
5. Crea una **API Key** y un **OAuth 2.0 Client ID**

### 2. Configurar las Credenciales

Edita el archivo `assets/js/google-calendar-api.js`:

```javascript
class GoogleCalendarAPI {
  constructor() {
    // REEMPLAZA ESTAS LÍNEAS CON TUS CREDENCIALES REALES
    this.API_KEY = 'AIzaSy...'; // Tu API Key real
    this.CLIENT_ID = '123456789...'; // Tu Client ID real
    // ...resto del código
  }
}
```

### 3. Configurar Dominios Autorizados

En Google Cloud Console → Credenciales → OAuth 2.0:
- Agrega tu dominio a "Orígenes de JavaScript autorizados"
- Ejemplo: `https://tudominio.com` o `http://localhost` para pruebas

## 🧪 Probar la Configuración

1. **Ejecuta el diagnóstico** en el sitio web
2. **Todos los elementos deben mostrar ✅**
3. **Haz clic en "Gestión Avanzada"**
4. **Haz clic en "Conectar con Google"**
5. **Autoriza la aplicación**
6. **¡Deberías poder crear eventos!**

## 📞 Soporte Adicional

Si sigues teniendo problemas:

1. **Revisa la consola del navegador** (F12) para errores específicos
2. **Ejecuta el diagnóstico** y comparte los resultados
3. **Verifica que las credenciales son correctas** en Google Cloud Console
4. **Asegúrate de que el dominio está autorizado**

## 🔒 Nota de Seguridad

- ⚠️ **Nunca compartas tu API Key públicamente**
- ⚠️ **Configura restricciones de dominio** en Google Cloud Console
- ⚠️ **Usa HTTPS en producción**

---

*Última actualización: 29 de julio de 2025*
