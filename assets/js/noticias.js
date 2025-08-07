/* =================================
   SISTEMA DE NOTICIAS CATÓLICAS
   ================================= */

// Configuración de las fuentes de noticias
const FUENTES_NOTICIAS = {
  arzobispado: {
    nombre: 'Arzobispado de Asunción',
    url: 'https://arzobispado.org.py/',
    icono: 'fas fa-church'
  },
  episcopal: {
    nombre: 'Conferencia Episcopal Paraguaya',
    url: 'https://episcopal.org.py/',
    icono: 'fas fa-cross'
  }
};

// Estado de la aplicación
let noticiasState = {
  currentSource: 'arzobispado',
  noticias: {
    arzobispado: [],
    episcopal: []
  },
  loading: false
};

// Noticias reales extraídas de los sitios web
const NOTICIAS_EJEMPLO = {
  arzobispado: [
    {
      titulo: "Jubileo de la Esperanza 2025",
      resumen: "El Arzobispado de Asunción invita a toda la comunidad católica a participar del Jubileo de la Esperanza 2025, un tiempo especial de gracia y renovación espiritual siguiendo las directrices del Santo Padre.",
      fecha: "2025-07-29",
      link: "https://arzobispado.org.py/jubileo-de-la-esperanza-2025/",
      imagen: "https://arzobispado.org.py/wp-content/uploads/2025/03/logo-jubileo-py_circulo-1024x1024.png"
    },
    {
      titulo: "Mensaje del Cardenal Adalberto Martínez Flores",
      resumen: "Palabras del Cardenal sobre la construcción de redes de relaciones, redes de amor y intercambio gratuito, donde la amistad sea profunda y se pueda reparar lo que se ha roto.",
      fecha: "2025-07-27",
      link: "https://arzobispado.org.py/",
      imagen: "https://arzobispado.org.py/wp-content/uploads/2022/09/Escudo_cardenalicio_Mons_Adalberto_Martinez-965x1024.jpg"
    },
    {
      titulo: "Reflexión sobre Santa Brígida de Suecia",
      resumen: "El Cardenal comparte una reflexión sobre Santa Brígida de Suecia (1303–1373), testimonio luminoso de cómo la santidad puede florecer en el corazón de la vida cotidiana, en el matrimonio y la maternidad.",
      fecha: "2025-07-23",
      link: "https://arzobispado.org.py/",
      imagen: null
    },
    {
      titulo: "Memoria de María Magdalena",
      resumen: "Reflexión sobre la figura de María Magdalena, cuya memoria litúrgica se celebra el 22 de julio, aclarando las confusiones históricas y destacando su importancia en la tradición cristiana.",
      fecha: "2025-07-22",
      link: "https://arzobispado.org.py/",
      imagen: null
    }
  ],
  episcopal: [
    {
      titulo: "Ordenación Episcopal y Toma de Posesión Canónica de Monseñor Osmar López Benítez",
      resumen: "Con alegría se comparten las imágenes de la Ordenación Episcopal y Toma de Posesión Canónica de Monseñor Osmar López Benítez, quien asumió el pastoreo de la Diócesis de San Juan Bautista de las Misiones y Ñeembucú.",
      fecha: "2025-06-15",
      link: "https://episcopal.org.py/",
      imagen: null
    },
    {
      titulo: "Mensaje del Cardenal Adalberto Martínez Flores vía X",
      resumen: "Elevamos nuestras oraciones al Dios de La Paz, confiando en su misericordia y en su poder para transformar los corazones endurecidos por la violencia. Recordamos que toda vida humana es sagrada.",
      fecha: "2025-06-14",
      link: "https://episcopal.org.py/",
      imagen: null
    },
    {
      titulo: "Jubileo 2025 - Conferencia Episcopal",
      resumen: "La Conferencia Episcopal Paraguaya se prepara para las celebraciones del Jubileo 2025, un tiempo especial de gracia, perdón y renovación espiritual para toda la Iglesia.",
      fecha: "2025-06-14",
      link: "https://episcopal.org.py/",
      imagen: null
    },
    {
      titulo: "Coordinación Nacional de ABP",
      resumen: "Actividades y coordinación de la Acción Bíblica Paraguaya, promoviendo el conocimiento y estudio de las Sagradas Escrituras en todas las comunidades del país.",
      fecha: "2025-06-14",
      link: "https://episcopal.org.py/",
      imagen: null
    }
  ]
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🗞️ Iniciando sistema de noticias...');
  
  // Configurar eventos de los tabs
  setupSourceTabs();
  
  // Cargar noticias iniciales
  loadNoticias();
  
  console.log('✅ Sistema de noticias inicializado');
});

// Configurar eventos de los tabs de fuentes
function setupSourceTabs() {
  const tabs = document.querySelectorAll('.source-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const source = this.dataset.source;
      
      // Actualizar tab activo
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Cambiar fuente actual
      noticiasState.currentSource = source;
      
      // Mostrar grid correspondiente
      showNoticiasGrid(source);
      
      // Cargar noticias si no están cargadas
      if (noticiasState.noticias[source].length === 0) {
        loadNoticiasForSource(source);
      }
    });
  });
}

// Mostrar grid de noticias específico
function showNoticiasGrid(source) {
  const grids = document.querySelectorAll('.noticias-grid');
  grids.forEach(grid => grid.classList.remove('active'));
  
  const targetGrid = document.getElementById(`noticias-${source}`);
  if (targetGrid) {
    targetGrid.classList.add('active');
  }
}

// Cargar noticias principales
async function loadNoticias() {
  showLoading(true);
  
  try {
    // Intentar cargar noticias del Arzobispado
    await loadNoticiasForSource('arzobispado');
    
    showLoading(false);
  } catch (error) {
    console.error('Error cargando noticias:', error);
    showError();
  }
}

// Cargar noticias para una fuente específica
async function loadNoticiasForSource(source) {
  if (noticiasState.loading) return;
  
  noticiasState.loading = true;
  
  try {
    // Por limitaciones de CORS, usaremos noticias de ejemplo
    // En un entorno real, necesitarías un backend o un servicio proxy
    await simulateAPICall();
    
    // Usar noticias de ejemplo
    const noticias = NOTICIAS_EJEMPLO[source] || [];
    noticiasState.noticias[source] = noticias;
    
    // Renderizar noticias
    renderNoticias(source, noticias);
    
  } catch (error) {
    console.error(`Error cargando noticias de ${source}:`, error);
    
    // Fallback a noticias de ejemplo
    const noticias = NOTICIAS_EJEMPLO[source] || [];
    noticiasState.noticias[source] = noticias;
    renderNoticias(source, noticias);
  }
  
  noticiasState.loading = false;
}

// Simular llamada a API (para efecto de carga)
function simulateAPICall() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 + Math.random() * 1000);
  });
}

// Renderizar noticias en el DOM
function renderNoticias(source, noticias) {
  const container = document.getElementById(`noticias-${source}`);
  
  if (!container) {
    console.error(`Container no encontrado para: noticias-${source}`);
    return;
  }
  
  if (noticias.length === 0) {
    container.innerHTML = `
      <div class="no-noticias">
        <i class="fas fa-newspaper"></i>
        <h3>No hay noticias disponibles</h3>
        <p>Visita directamente el sitio web para ver las últimas actualizaciones.</p>
        <a href="${FUENTES_NOTICIAS[source].url}" target="_blank" class="btn-visitar">
          <i class="fas fa-external-link-alt"></i>
          Visitar ${FUENTES_NOTICIAS[source].nombre}
        </a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = noticias.map(noticia => `
    <article class="noticia-card">
      <div class="noticia-image">
        ${noticia.imagen ? 
          `<img src="${noticia.imagen}" alt="${noticia.titulo}" />` : 
          `<i class="${FUENTES_NOTICIAS[source].icono}"></i>`
        }
      </div>
      <div class="noticia-content">
        <div class="noticia-fecha">
          <i class="fas fa-calendar-alt"></i>
          ${formatearFecha(noticia.fecha)}
        </div>
        <h3 class="noticia-titulo">${noticia.titulo}</h3>
        <p class="noticia-resumen">${noticia.resumen}</p>
        <a href="${noticia.link}" target="_blank" class="noticia-link">
          Leer más
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');
}

// Formatear fecha para mostrar
function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return fecha.toLocaleDateString('es-ES', opciones);
}

// Mostrar/ocultar indicador de carga
function showLoading(show) {
  const loading = document.getElementById('noticias-loading');
  const error = document.getElementById('noticias-error');
  
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
  }
  
  if (error && !show) {
    error.style.display = 'none';
  }
}

// Mostrar mensaje de error
function showError() {
  const loading = document.getElementById('noticias-loading');
  const error = document.getElementById('noticias-error');
  const grids = document.querySelectorAll('.noticias-grid');
  
  if (loading) loading.style.display = 'none';
  if (error) error.style.display = 'block';
  
  grids.forEach(grid => {
    if (grid.id !== 'noticias-loading' && grid.id !== 'noticias-error') {
      grid.style.display = 'none';
    }
  });
}

// Función para actualizar noticias manualmente
function actualizarNoticias() {
  console.log('🔄 Actualizando noticias...');
  
  // Limpiar cache
  noticiasState.noticias = {
    arzobispado: [],
    episcopal: []
  };
  
  // Recargar noticias actuales
  loadNoticiasForSource(noticiasState.currentSource);
}

// Función para obtener noticias (para uso externo)
function getNoticias(source = null) {
  if (source) {
    return noticiasState.noticias[source] || [];
  }
  return noticiasState.noticias;
}

// Función de utilidad para depuración
function debugNoticias() {
  console.log('📊 Estado de noticias:');
  console.log('- Fuente actual:', noticiasState.currentSource);
  console.log('- Noticias cargadas:', noticiasState.noticias);
  console.log('- Cargando:', noticiasState.loading);
}

// Exportar funciones para uso global
window.actualizarNoticias = actualizarNoticias;
window.getNoticias = getNoticias;
window.debugNoticias = debugNoticias;

// Función para intentar cargar noticias reales (comentada por limitaciones CORS)
/*
async function fetchNoticiasReales(source) {
  try {
    // Esta función necesitaría un proxy o backend para evitar problemas de CORS
    const response = await fetch(`/api/noticias/${source}`);
    if (!response.ok) throw new Error('Error en la respuesta');
    
    const data = await response.json();
    return data.noticias || [];
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return NOTICIAS_EJEMPLO[source] || [];
  }
}
*/
