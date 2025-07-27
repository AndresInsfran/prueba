/* ===========================
   EVANGELIO DEL DÍA - API
   =========================== */

const EvangelioDia = {
  init() {
    this.cargarEvangelio();
    this.setupAutoRefresh();
  },

  async cargarEvangelio() {
    const container = document.getElementById('evangelio-dia');
    if (!container) return;

    try {
      // Mostrar loading
      container.innerHTML = `
        <div class="evangelio-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando evangelio del día...</p>
        </div>
      `;

      // Intentar obtener de API católica
      const evangelio = await this.obtenerEvangelioAPI();
      
      if (evangelio) {
        this.mostrarEvangelio(evangelio);
      } else {
        // Fallback a evangelio por defecto
        this.mostrarEvangelioDefault();
      }
    } catch (error) {
      console.error('Error al cargar evangelio:', error);
      this.mostrarEvangelioDefault();
    }
  },

  async obtenerEvangelioAPI() {
    // Intentar múltiples APIs en orden de preferencia
    const apis = [
      () => this.obtenerDeEvangelizo(),
      () => this.obtenerDeLiturgia(),
      () => this.obtenerDeVatican()
    ];

    for (const api of apis) {
      try {
        const resultado = await api();
        if (resultado) {
          return resultado;
        }
      } catch (error) {
        console.log('API falló, intentando siguiente:', error.message);
        continue;
      }
    }

    console.log('Todas las APIs fallaron, usando contenido local');
    return this.obtenerEvangelioFallback();
  },

  async obtenerDeEvangelizo() {
    try {
      const fecha = new Date().toISOString().split('T')[0];
      // API de Evangelizo (funcional y gratuita)
      const response = await fetch(`https://api.evangelizo.org/read/day/${fecha}?lang=ES&type=gospel`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SantuarioWeb/1.0'
        }
      });
      
      if (!response.ok) throw new Error('Evangelizo API no disponible');
      
      const data = await response.json();
      
      if (data && data.gospel) {
        return {
          cita: data.gospel.reference || 'Evangelio del día',
          titulo: data.gospel.title || 'Palabra de Dios',
          texto: this.limpiarTexto(data.gospel.text || data.gospel.content),
          fuente: 'Evangelizo.org'
        };
      }
      return null;
    } catch (error) {
      console.log('Error con Evangelizo:', error.message);
      return null;
    }
  },

  async obtenerDeLiturgia() {
    try {
      // API alternativa - Catholic Calendar API
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      
      const response = await fetch(`https://calapi.inadiutorium.cz/api/v0/en/calendars/general-en/${year}/${month}/${day}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Liturgia API no disponible');
      
      const data = await response.json();
      
      if (data && data.readings && data.readings.length > 0) {
        const evangelio = data.readings.find(r => r.reading_type === 'gospel') || data.readings[0];
        
        return {
          cita: evangelio.citation || 'Evangelio del día',
          titulo: evangelio.title || 'Palabra de Dios',
          texto: this.limpiarTexto(evangelio.text || 'Consulte su misal local'),
          fuente: 'Liturgia Católica'
        };
      }
      return null;
    } catch (error) {
      console.log('Error con Liturgia API:', error.message);
      return null;
    }
  },

  async obtenerDeVatican() {
    try {
      // Simulación de API del Vaticano (actualmente no hay API pública directa)
      // Esta función queda preparada para cuando esté disponible
      return null;
    } catch (error) {
      return null;
    }
  },

  limpiarTexto(texto) {
    if (!texto) return '';
    
    return texto
      .replace(/<[^>]*>/g, '') // Remover HTML
      .replace(/&quot;/g, '"') // Convertir entidades
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  },

  obtenerEvangelioFallback() {
    // Evangelios por día de la semana como fallback
    const dia = new Date().getDay();
    const evangelios = {
      0: { // Domingo
        cita: "Juan 14, 1-6",
        titulo: "Jesús, el Camino, la Verdad y la Vida",
        texto: "No se turbe vuestro corazón. Creéis en Dios, creed también en mí. En la casa de mi Padre hay muchas moradas; si no, os lo habría dicho, porque voy a prepararos sitio. Y cuando vaya y os prepare sitio, vendré otra vez y os llevaré conmigo, para que donde esté yo estéis también vosotros. Y a donde yo voy, ya sabéis el camino."
      },
      1: { // Lunes
        cita: "Mateo 5, 14-16",
        titulo: "Vosotros sois la luz del mundo",
        texto: "Vosotros sois la luz del mundo. No puede ocultarse una ciudad situada en la cima de un monte. Y no se enciende una lámpara para meterla debajo del celemín, sino para ponerla en el candelero y que alumbre a todos los de casa. Alumbre así vuestra luz delante de los hombres, para que vean vuestras buenas obras y glorifiquen a vuestro Padre que está en los cielos."
      },
      2: { // Martes
        cita: "Lucas 6, 36-38",
        titulo: "Sed misericordiosos",
        texto: "Sed misericordiosos, como vuestro Padre es misericordioso. No juzguéis y no seréis juzgados; no condenéis y no seréis condenados; perdonad y seréis perdonados. Dad y se os dará; una medida buena, apretada, remecida, rebosante pondrán en vuestro regazo; porque con la medida con que midáis os medirán a vosotros."
      },
      3: { // Miércoles
        cita: "Mateo 11, 28-30",
        titulo: "Venid a mí los que estáis cansados",
        texto: "Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré. Cargad con mi yugo y aprended de mí, que soy manso y humilde de corazón, y encontraréis descanso para vuestras almas. Porque mi yugo es llevadero y mi carga ligera."
      },
      4: { // Jueves
        cita: "Juan 13, 34-35",
        titulo: "Amaos los unos a los otros",
        texto: "Os doy un mandamiento nuevo: que os améis unos a otros. Como yo os he amado, así amaos también vosotros unos a otros. En esto conocerán todos que sois discípulos míos: si os tenéis amor unos a otros."
      },
      5: { // Viernes
        cita: "Juan 15, 12-17",
        titulo: "No hay amor más grande",
        texto: "Este es el mandamiento mío: que os améis unos a otros como yo os he amado. Nadie tiene amor más grande que el que da la vida por sus amigos. Vosotros sois mis amigos, si hacéis lo que yo os mando."
      },
      6: { // Sábado
        cita: "Lucas 11, 9-10",
        titulo: "Pedid y se os dará",
        texto: "Pues yo os digo: Pedid y se os dará, buscad y hallaréis, llamad y se os abrirá. Porque todo el que pide recibe, el que busca halla, y al que llama se le abre."
      }
    };

    return evangelios[dia];
  },

  mostrarEvangelio(evangelio) {
    const container = document.getElementById('evangelio-dia');
    const fecha = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

    container.innerHTML = `
      <div class="evangelio-header">
        <div class="evangelio-fecha">
          <i class="fas fa-calendar-alt"></i>
          <span>${fechaCapitalizada}</span>
        </div>
        ${evangelio.fuente ? `<div class="evangelio-fuente">
          <i class="fas fa-source"></i>
          <small>Fuente: ${evangelio.fuente}</small>
        </div>` : ''}
      </div>
      
      <div class="evangelio-contenido">
        <div class="evangelio-cita">
          <i class="fas fa-book-open"></i>
          ${evangelio.cita}
        </div>
        
        ${evangelio.titulo ? `<div class="evangelio-titulo">
          <i class="fas fa-cross"></i>
          ${evangelio.titulo}
        </div>` : ''}
        
        <div class="evangelio-texto">
          <div class="comillas-apertura">"</div>
          ${evangelio.texto}
          <div class="comillas-cierre">"</div>
        </div>
        
        <div class="evangelio-reflexion">
          <i class="fas fa-heart"></i>
          <em>"Que esta palabra ilumine nuestro camino y fortalezca nuestra fe"</em>
        </div>
      </div>
      
      <div class="evangelio-acciones">
        <button class="btn-evangelio-compartir" onclick="EvangelioDia.compartir()">
          <i class="fas fa-share-alt"></i>
          Compartir
        </button>
        <button class="btn-evangelio-refresh" onclick="EvangelioDia.cargarEvangelio()">
          <i class="fas fa-sync-alt"></i>
          Actualizar
        </button>
      </div>
    `;

    // Añadir animación suave
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      container.style.transition = 'all 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  },

  mostrarEvangelioDefault() {
    const evangelio = this.obtenerEvangelioFallback();
    this.mostrarEvangelio(evangelio);
  },

  setupAutoRefresh() {
    // Actualizar cada día a las 00:01
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setDate(ahora.getDate() + 1);
    mañana.setHours(0, 1, 0, 0);
    
    const msHastaMañana = mañana.getTime() - ahora.getTime();
    
    setTimeout(() => {
      this.cargarEvangelio();
      // Configurar refresh diario
      setInterval(() => {
        this.cargarEvangelio();
      }, 24 * 60 * 60 * 1000); // 24 horas
    }, msHastaMañana);
  },

  // Función para compartir el evangelio
  compartir() {
    const container = document.getElementById('evangelio-dia');
    const cita = container.querySelector('.evangelio-cita')?.textContent || '';
    const texto = container.querySelector('.evangelio-texto')?.textContent || '';
    
    const textoCompartir = `🙏 Evangelio del día 📖\n\n${cita}\n\n${texto.replace(/"/g, '')}\n\n✝️ Santuario Diocesano del Santísimo Sacramento`;
    
    if (navigator.share) {
      // API Web Share (móviles modernos)
      navigator.share({
        title: 'Evangelio del día',
        text: textoCompartir,
        url: window.location.href
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback: copiar al portapapeles
      this.copiarAlPortapapeles(textoCompartir);
    }
  },

  copiarAlPortapapeles(texto) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        this.mostrarNotificacion('✅ Evangelio copiado al portapapeles');
      }).catch(() => {
        this.fallbackCopiar(texto);
      });
    } else {
      this.fallbackCopiar(texto);
    }
  },

  fallbackCopiar(texto) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.mostrarNotificacion('✅ Evangelio copiado al portapapeles');
    } catch (err) {
      this.mostrarNotificacion('❌ No se pudo copiar. Selecciona y copia manualmente.');
    }
    
    document.body.removeChild(textArea);
  },

  mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.className = 'evangelio-notificacion';
    notif.textContent = mensaje;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color, #8B4513);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 14px;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Mostrar con animación
    setTimeout(() => {
      notif.style.opacity = '1';
      notif.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (notif.parentNode) {
          notif.parentNode.removeChild(notif);
        }
      }, 300);
    }, 3000);
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  EvangelioDia.init();
});

// Hacer disponible globalmente
window.EvangelioDia = EvangelioDia;
