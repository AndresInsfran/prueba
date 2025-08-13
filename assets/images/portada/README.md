# � Carpeta de Imágenes del Carrusel de Portada

## 🎯 Configuración Actual
- **portada1.jpg** - Primera imagen del carrusel
- **portada2.jpg** - Segunda imagen del carrusel

## ➕ Para Agregar Nuevas Imágenes
1. Coloca la imagen en esta carpeta
2. Edita `assets/js/hero-carousel-config.js`
3. Agrega el nombre del archivo a `availableImages`

## ⚠️ Importante
- El carrusel SOLO usa imágenes de esta carpeta
- No usa imágenes de galería u otras carpetas
- Formatos soportados: .jpg, .jpeg, .png, .webp

## 📋 Ejemplo de Configuración
```javascript
availableImages: [
  'portada1.jpg',
  'portada2.jpg',
  'nueva-imagen.jpg'  // Agregar aquí
],
```
3. Nombres recomendados: `portada1.jpg`, `portada2.jpg`, etc.

### 📐 Especificaciones Recomendadas:
- **Ratio**: 16:9 (ejemplo: 1920x1080px)
- **Peso máximo**: 500KB por imagen
- **Calidad**: Alta resolución para pantallas grandes
- **Formato**: JPG para fotos, PNG para imágenes con transparencia

### 🖼️ Tipos de Contenido Sugerido:
- Imagen principal del santuario
- Vistas del interior
- Eventos especiales
- Celebraciones importantes
- Flyers de actividades
- Anuncios relevantes

### 🔄 Funcionamiento Automático:
El sistema detectará automáticamente todas las imágenes en esta carpeta y las incluirá en el carrusel de la portada.

### 📝 Notas:
- Las imágenes se ordenarán alfabéticamente por nombre
- La primera imagen (alfabéticamente) será la que se muestre inicialmente
- Se aplicará lazy loading automáticamente excepto para la primera imagen

### 🚨 Importante:
- No usar espacios en los nombres de archivo
- Evitar caracteres especiales (usar solo letras, números, guiones)
- Verificar que las imágenes sean apropiadas para el contexto religioso
