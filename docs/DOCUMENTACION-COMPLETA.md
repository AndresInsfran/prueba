# 📋 DOCUMENTACIÓN COMPLETA DEL PROYECTO

## 🎯 SANTUARIO DIOCESANO - WEBSITE PRINCIPAL

### 📁 Estructura del Proyecto
```
santuario-diocesano/
├── index.html                 # Página principal
├── script.js                  # JavaScript principal
├── styles.css                 # Estilos principales
├── assets/
│   ├── css/                   # Hojas de estilo organizadas
│   ├── js/                    # Scripts organizados
│   ├── images/                # Imágenes del sitio
│   └── data/                  # Datos y configuraciones
├── docs/                      # Documentación específica
└── tools/                     # Herramientas de optimización
```

## 🎠 CARRUSEL DE PORTADA

### ⚠️ IMPORTANTE: Solo Imágenes de Carpeta Portada
El carrusel está configurado para usar **ÚNICAMENTE** imágenes de la carpeta `assets/images/portada/`. No usa fallbacks de otras carpetas.

### Configuración Principal
**Archivo**: `assets/js/hero-carousel-config.js`

```javascript
// Para cambiar las imágenes mostradas:
availableImages: [
  'portada1.jpg',
  'portada2.jpg'
],

// Para cambiar velocidad:
autoPlayDelay: 5000, // 5 segundos
```

### Ubicación de Imágenes
- **Carpeta EXCLUSIVA**: `assets/images/portada/`
- **Formatos**: .jpg, .jpeg, .png, .webp
- **Sin fallbacks**: No usa imágenes de galería u otras carpetas

### Archivos del Carrusel
- `assets/js/hero-carousel-config.js` - Configuración
- `assets/js/hero-carousel.js` - Lógica principal
- `assets/css/hero-carousel.css` - Estilos

## 🖼️ GALERÍA DE IMÁGENES

### Configuración
- **Script**: `assets/js/gallery.js`
- **Estilos**: `assets/css/gallery.css`
- **Carpeta**: `assets/images/galeria/`

## 📅 CALENDARIO LITÚRGICO

### Configuración
- **Script**: `assets/js/calendario-simple.js`
- **Estilos**: `assets/css/calendario.css`
- **Integración**: FullCalendar + API

## 📖 EVANGELIO DEL DÍA

### Configuración
- **Script**: `assets/js/evangelio.js`
- **Estilos**: `assets/css/evangelio.css`
- **Fuente**: ACI Prensa API

## 💬 SISTEMA DE COMENTARIOS

### Configuración
- **Script**: `assets/js/comentarios-simple.js`
- **Estilos**: `assets/css/comentarios.css`

## 📱 RESPONSIVE & MOBILE

### Optimizaciones
- **Header**: `assets/css/header-responsive.css`
- **Mobile**: `assets/css/mobile-optimizations.css`
- **Menú**: `assets/js/mobile-menu-responsive.js`

## 🎨 EFECTOS VISUALES

### Partículas
- **Script**: `assets/js/particles.js`
- **Estilos**: `assets/css/particles.css`

### Animaciones
- **Script**: `assets/js/animations.js`
- **Estilos**: `assets/css/animations.css`

## 🔧 HERRAMIENTAS DE DESARROLLO

### Optimización
- `tools/optimizer-simple.ps1` - Optimizador de imágenes
- `tools/minifier.ps1` - Minificador de CSS/JS

### Limpieza
- `tools/cleanup.bat` - Limpieza de archivos temporales

## 📞 CONTACTO & REDES

### WhatsApp Flotante
- **Script**: `assets/js/whatsapp-float.js`
- **Estilos**: `assets/css/whatsapp-float.css`

## 🚀 COMANDOS ÚTILES

### Para Desarrollo
```bash
# Optimizar imágenes
.\tools\optimizer-simple.ps1

# Limpiar archivos temporales
.\tools\cleanup.bat

# Minificar archivos
.\tools\minifier.ps1
```

### Para Producción
1. Ejecutar optimizador de imágenes
2. Minificar CSS y JS
3. Verificar enlaces y rutas
4. Probar responsive en diferentes dispositivos

## 📋 CHECKLIST DE MANTENIMIENTO

### Semanal
- [ ] Actualizar evangelio del día
- [ ] Verificar eventos del calendario
- [ ] Revisar comentarios y mensajes

### Mensual
- [ ] Optimizar nuevas imágenes
- [ ] Actualizar galería si hay nuevas fotos
- [ ] Revisar performance del sitio

### Cuando sea necesario
- [ ] Agregar nuevas imágenes al carrusel
- [ ] Actualizar información de contacto
- [ ] Modificar horarios de misa

## 🎯 CONFIGURACIONES CLAVE

### Carrusel
```javascript
// Cambiar imágenes: assets/js/hero-carousel-config.js
availableImages: ['portada1.jpg', 'portada2.jpg']
```

### Velocidades
```javascript
// Carrusel: 5 segundos
autoPlayDelay: 5000

// Animaciones: 0.8 segundos
transitionDuration: 800
```

### Rutas Importantes
- Imágenes carrusel: `assets/images/portada/`
- Imágenes galería: `assets/images/galeria/`
- Configuraciones: `assets/js/`
- Estilos: `assets/css/`

---
**Última actualización**: Agosto 2025  
**Versión**: 2.0 - Sistema simplificado y optimizado
