# Plan de Refactorización - Santuario Diocesano

## 🧹 Limpieza de Archivos

### Archivos para Eliminar/Consolidar:
```
❌ styles.css (obsoleto)
❌ styles_new.css (obsoleto) 
❌ script.js (funcionalidad movida a módulos)
❌ debug-mobile.html (archivo de prueba)
❌ debug-particles.js (funcionalidad removida)
❌ test-logo.html (archivo de prueba)
❌ test.html (archivo de prueba)
❌ assets/js/gallery-simplified.js (duplicado)
❌ Nueva carpeta/ (archivos obsoletos)
```

### Archivos a Mantener y Optimizar:
```
✅ index.html (optimizar)
✅ assets/css/main.css (principal)
✅ assets/css/santoral.css (específico del calendario)
✅ assets/js/calendario.js (calendario litúrgico)
✅ assets/js/santoral.js (datos de santos)
✅ assets/js/evangelio.js (evangelio del día)
✅ favicon.svg (icono principal)
```

## 📦 Estructura Optimizada Propuesta

```
santuario-diocesano/
├── index.html
├── favicon.svg
├── manifest.json (nuevo)
├── sw.js (service worker - nuevo)
├── CNAME
├── README.md
├── assets/
│   ├── css/
│   │   ├── main.css (consolidado)
│   │   ├── components.css (componentes reutilizables)
│   │   └── liturgico.css (calendario y santoral)
│   ├── js/
│   │   ├── modules/
│   │   │   ├── navegacion.js
│   │   │   ├── calendario.js
│   │   │   ├── santoral.js
│   │   │   ├── evangelio.js
│   │   │   ├── galeria.js
│   │   │   └── utilidades.js
│   │   ├── main.js (inicializador principal)
│   │   └── sw-register.js (registro de service worker)
│   ├── images/
│   │   ├── galeria/
│   │   ├── historia/
│   │   ├── optimized/ (versiones optimizadas)
│   │   └── portada.jpg
│   ├── icons/
│   │   ├── favicon.svg
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── data/
│       ├── santoral.json (datos estructurados)
│       └── eventos.json
├── docs/
│   ├── ANALISIS-MEJORAS.md
│   ├── API-DOCUMENTACION.md
│   └── DEPLOYMENT-GUIDE.md
└── tools/ (scripts de construcción)
    ├── optimize-images.js
    ├── build.js
    └── deploy.js
```

## 🔧 Scripts de Optimización

### 1. Script de Limpieza
```bash
# cleanup.bat
echo "Iniciando limpieza del proyecto..."

# Eliminar archivos obsoletos
del "styles.css" 2>nul
del "styles_new.css" 2>nul
del "script.js" 2>nul
del "debug-*.html" 2>nul
del "test*.html" 2>nul
rd /s /q "Nueva carpeta" 2>nul

echo "Limpieza completada ✅"
```

### 2. Optimización de CSS
```css
/* assets/css/main.css - Versión consolidada */
:root {
  /* Variables CSS unificadas */
  --color-primary: #8B4513;
  --color-secondary: #C4A76D;
  --color-accent: #DAA520;
  --font-primary: 'Cinzel', serif;
  --font-secondary: 'Montserrat', sans-serif;
  --transition: all 0.3s ease;
  --shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Imports optimizados */
@import url('components.css');
@import url('liturgico.css');
```

### 3. JavaScript Modular
```javascript
// assets/js/main.js - Inicializador principal
import { Navegacion } from './modules/navegacion.js';
import { CalendarioLiturgico } from './modules/calendario.js';
import { SantoralParaguayo } from './modules/santoral.js';
import { EvangelioDia } from './modules/evangelio.js';
import { Galeria } from './modules/galeria.js';

class SantuarioApp {
  constructor() {
    this.modules = {
      navegacion: new Navegacion(),
      calendario: new CalendarioLiturgico(),
      santoral: new SantoralParaguayo(),
      evangelio: new EvangelioDia(),
      galeria: new Galeria()
    };
  }

  async init() {
    try {
      // Registrar service worker
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }

      // Inicializar módulos
      for (const [name, module] of Object.entries(this.modules)) {
        if (module && typeof module.init === 'function') {
          await module.init();
          console.log(`✅ ${name} inicializado`);
        }
      }

      // Configurar event listeners globales
      this.setupGlobalEvents();
      
      console.log('🏛️ Santuario Diocesano inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando la aplicación:', error);
    }
  }

  setupGlobalEvents() {
    // Event listeners globales optimizados
    document.addEventListener('click', this.handleGlobalClick.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new SantuarioApp();
  app.init();
});
```

## 📱 Progressive Web App Setup

### manifest.json
```json
{
  "name": "Santuario Diocesano del Santísimo Sacramento",
  "short_name": "Santuario Diocesano",
  "description": "Calendario litúrgico, santoral paraguayo y horarios de misa",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#8B4513",
  "theme_color": "#C4A76D",
  "categories": ["religion", "lifestyle", "education"],
  "lang": "es-PY",
  "icons": [
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Santoral de Hoy",
      "short_name": "Santoral",
      "description": "Ver el santo del día",
      "url": "/#santoral",
      "icons": [{"src": "assets/icons/santo-96x96.png", "sizes": "96x96"}]
    },
    {
      "name": "Horarios de Misa",
      "short_name": "Horarios",
      "description": "Consultar horarios de misa",
      "url": "/#horarios",
      "icons": [{"src": "assets/icons/misa-96x96.png", "sizes": "96x96"}]
    }
  ]
}
```

### Service Worker
```javascript
// sw.js - Service Worker optimizado
const CACHE_NAME = 'santuario-v2.0.0';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/icons/icon-192x192.png',
  '/favicon.svg'
];

// Estrategia de cache híbrida
const cacheStrategies = {
  static: ['css', 'js', 'png', 'jpg', 'svg', 'ico'],
  networkFirst: ['json', 'api'],
  cacheFirst: ['images', 'fonts']
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia basada en tipo de recurso
  if (cacheStrategies.static.some(ext => url.pathname.includes(ext))) {
    event.respondWith(cacheFirst(request));
  } else if (cacheStrategies.networkFirst.some(type => url.pathname.includes(type))) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
```

## 🎨 Mejoras de UI/UX

### 1. Sistema de Temas
```css
/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #f0f0f0;
    --color-primary: #D4A574;
  }
}

/* Tema personalizable */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
}

[data-theme="high-contrast"] {
  --color-primary: #000000;
  --color-bg: #ffffff;
  --color-text: #000000;
}
```

### 2. Componentes Reutilizables
```css
/* assets/css/components.css */
.btn {
  /* Base button styles */
  @apply px-4 py-2 rounded-lg transition-all duration-300;
}

.btn--primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.btn--secondary {
  @apply bg-secondary text-primary hover:bg-secondary-dark;
}

.card {
  @apply bg-white rounded-xl shadow-lg p-6 transition-transform;
}

.card:hover {
  @apply transform scale-105;
}
```

## 📊 Optimización de Performance

### 1. Lazy Loading Mejorado
```javascript
// assets/js/modules/utilidades.js
export class LazyLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver(
      this.handleImageIntersection.bind(this),
      { threshold: 0.1, rootMargin: '50px' }
    );
  }

  init() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));
  }

  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.imageObserver.unobserve(img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });

    if (srcset) img.srcset = srcset;
    img.src = src;
  }
}
```

### 2. Code Splitting
```javascript
// Carga dinámica de módulos
async function loadModule(moduleName) {
  const modules = {
    galeria: () => import('./modules/galeria.js'),
    calendario: () => import('./modules/calendario.js'),
    santoral: () => import('./modules/santoral.js')
  };

  try {
    const module = await modules[moduleName]();
    return module.default;
  } catch (error) {
    console.error(`Error cargando módulo ${moduleName}:`, error);
  }
}
```

## 🔍 SEO y Metadatos Mejorados

```html
<!-- index.html - Head optimizado -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>Santuario Diocesano del Santísimo Sacramento | Asunción, Paraguay</title>
  <meta name="title" content="Santuario Diocesano del Santísimo Sacramento | Asunción, Paraguay">
  <meta name="description" content="Descubre el santoral paraguayo, horarios de misa y evangelio del día en nuestro santuario. Calendario litúrgico completo y tradiciones católicas de Paraguay.">
  <meta name="keywords" content="santuario, paraguay, asunción, misa, católico, santoral, calendario litúrgico, evangelio">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://santuariodiocesano.com/">
  <meta property="og:title" content="Santuario Diocesano del Santísimo Sacramento">
  <meta property="og:description" content="Calendario litúrgico, santoral paraguayo y tradiciones católicas">
  <meta property="og:image" content="https://santuariodiocesano.com/assets/images/og-image.jpg">
  <meta property="og:locale" content="es_PY">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://santuariodiocesano.com/">
  <meta property="twitter:title" content="Santuario Diocesano del Santísimo Sacramento">
  <meta property="twitter:description" content="Calendario litúrgico, santoral paraguayo y tradiciones católicas">
  <meta property="twitter:image" content="https://santuariodiocesano.com/assets/images/og-image.jpg">
  
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#C4A76D">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  
  <!-- Icons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "Santuario Diocesano del Santísimo Sacramento y Perpetuo Socorro",
    "description": "Santuario católico en Asunción, Paraguay",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Asunción",
      "addressCountry": "PY"
    },
    "url": "https://santuariodiocesano.com",
    "telephone": "+595982044910",
    "sameAs": [
      "https://www.facebook.com/share/16YXw5izH7/",
      "https://youtube.com/@santuariodiocesanodelstmosacra"
    ]
  }
  </script>
</head>
```

## 📋 Checklist de Implementación

### Fase 1: Limpieza (Esta semana)
- [ ] Eliminar archivos obsoletos
- [ ] Consolidar CSS en archivos principales
- [ ] Reestructurar JavaScript en módulos
- [ ] Optimizar imágenes existentes
- [ ] Implementar lazy loading básico

### Fase 2: PWA (Próxima semana)
- [ ] Crear manifest.json
- [ ] Implementar service worker
- [ ] Generar iconos PWA
- [ ] Configurar cache strategies
- [ ] Testing offline

### Fase 3: Optimización (2-3 semanas)
- [ ] Code splitting
- [ ] Bundle optimization
- [ ] Performance audit
- [ ] Accessibility testing
- [ ] SEO optimization

### Fase 4: Funcionalidades Avanzadas (1 mes)
- [ ] Sistema de notificaciones
- [ ] Búsqueda avanzada
- [ ] Integración con calendarios externos
- [ ] Analytics implementation
- [ ] Testing completo

---

*Este plan de refactorización optimizará significativamente el rendimiento, mantenibilidad y experiencia de usuario del sitio web del Santuario Diocesano.*
