/* ===========================
   SISTEMA DE GALERÍAS SIMPLIFICADO
   =========================== */

const AdvancedGallery = {
  galleries: {
    carousel: [],      // Momentos especiales (carrusel)
    principal: []      // Galería principal
  },
  currentGallery: 'principal',
  currentIndex: 0,

  init() {
    console.log('🖼️ Inicializando Sistema de Galerías...');
    this.initCarouselGallery();
    this.initPrincipalGallery();
    this.initModalSystem();
    this.bindGlobalEvents();
    console.log('✅ Sistema de Galerías inicializado correctamente');
  },

  // Inicializar galería del carrusel (Momentos Especiales)
  initCarouselGallery() {
    const carouselSlides = document.querySelectorAll('.carousel-slide img');
    carouselSlides.forEach((img, index) => {
      this.galleries.carousel.push({
        src: img.src,
        alt: img.alt,
        caption: img.parentElement.querySelector('.carousel-caption')?.textContent || img.alt
      });

      // Hacer clickeable las imágenes del carrusel
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openLightbox('carousel', index);
      });

      img.style.cursor = 'pointer';
      img.title = 'Click para ver en grande';
    });

    console.log(`📸 Momentos Especiales: ${this.galleries.carousel.length} imágenes configuradas`);
  },

  // Inicializar galería principal
  initPrincipalGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.galleries.principal.push({
          src: img.src,
          alt: img.alt,
          caption: item.querySelector('.gallery-caption')?.textContent || img.alt
        });

        // Event listener para abrir lightbox
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.openLightbox('principal', index);
        });
      }
    });

    console.log(`🖼️ Galería Principal: ${this.galleries.principal.length} imágenes`);
  },

  // Sistema de modales
  initModalSystem() {
    this.createAdvancedLightbox();
    this.createGalleryModal();
    this.fixHistoryModal();
  },

  createAdvancedLightbox() {
    // Remover lightbox existente
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Cerrar galería">&times;</button>
        <button class="lightbox-controls lightbox-prev" aria-label="Imagen anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-controls lightbox-next" aria-label="Imagen siguiente">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-loading">
          <div class="spinner"></div>
          Cargando...
        </div>
        <img class="lightbox-image" src="" alt="" style="display: none;">
        <div class="lightbox-caption"></div>
        <div class="lightbox-counter"></div>
        <div class="lightbox-gallery-indicator"></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.closeLightbox();
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
      this.prevImage();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
      this.nextImage();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });
  },

  createGalleryModal() {
    const modal = document.createElement('div');
    modal.id = 'modal-gallery';
    modal.className = 'modal-gallery';
    modal.innerHTML = `
      <div class="modal-gallery-content">
        <div class="modal-gallery-header">
          <h3 class="modal-gallery-title">Todas las Imágenes</h3>
          <button class="modal-gallery-close">&times;</button>
        </div>
        <div class="modal-gallery-grid" id="modal-gallery-grid">
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-gallery-close').addEventListener('click', () => {
      this.closeGalleryModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeGalleryModal();
      }
    });
  },

  fixHistoryModal() {
    const historyModal = document.getElementById('modal-historia');
    if (historyModal) {
      // Agregar clase active para mostrar/ocultar correctamente
      const style = historyModal.style;
      if (style.display === 'none') {
        historyModal.classList.remove('active');
      }
    }
  },

  // Funciones de lightbox
  openLightbox(galleryType, index) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    this.currentGallery = galleryType;
    this.currentIndex = index;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.updateLightboxImage();
    this.updateGalleryIndicator();

    console.log(`🔍 Abriendo imagen ${index + 1} de: ${galleryType === 'carousel' ? 'Momentos Especiales' : 'Galería Principal'}`);
  },

  closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  updateLightboxImage() {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');
    const loading = lightbox.querySelector('.lightbox-loading');

    const currentGalleryImages = this.galleries[this.currentGallery];
    const currentImage = currentGalleryImages[this.currentIndex];

    if (!currentImage) return;

    // Mostrar loading
    loading.style.display = 'block';
    img.style.display = 'none';

    const newImg = new Image();
    newImg.onload = () => {
      img.src = newImg.src;
      img.alt = currentImage.alt;
      caption.textContent = currentImage.caption;
      counter.textContent = `${this.currentIndex + 1} / ${currentGalleryImages.length}`;
      
      loading.style.display = 'none';
      img.style.display = 'block';
    };
    
    newImg.onerror = () => {
      loading.textContent = 'Error cargando imagen';
    };
    
    newImg.src = currentImage.src;
  },

  updateGalleryIndicator() {
    const indicator = document.querySelector('.lightbox-gallery-indicator');
    if (indicator) {
      const galleryNames = {
        carousel: 'Momentos Especiales',
        principal: 'Galería Principal'
      };
      indicator.textContent = galleryNames[this.currentGallery] || '';
    }
  },

  nextImage() {
    const currentGalleryImages = this.galleries[this.currentGallery];
    this.currentIndex = (this.currentIndex + 1) % currentGalleryImages.length;
    this.updateLightboxImage();
  },

  prevImage() {
    const currentGalleryImages = this.galleries[this.currentGallery];
    this.currentIndex = (this.currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    this.updateLightboxImage();
  },

  // Modal de galería completa
  openGalleryModal(galleryType = 'principal') {
    const modal = document.getElementById('modal-gallery');
    const grid = document.getElementById('modal-gallery-grid');
    const title = modal.querySelector('.modal-gallery-title');

    const galleryNames = {
      carousel: 'Momentos Especiales - Todas las Imágenes',
      principal: 'Galería Principal - Todas las Imágenes'
    };

    title.textContent = galleryNames[galleryType] || 'Todas las Imágenes';
    grid.innerHTML = '';

    const images = this.galleries[galleryType];
    images.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'modal-gallery-item';
      item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
      
      item.addEventListener('click', () => {
        this.closeGalleryModal();
        setTimeout(() => {
          this.openLightbox(galleryType, index);
        }, 300);
      });

      grid.appendChild(item);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeGalleryModal() {
    const modal = document.getElementById('modal-gallery');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  // Eventos globales
  bindGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      const lightbox = document.querySelector('.lightbox');
      const galleryModal = document.getElementById('modal-gallery');

      if (lightbox && lightbox.classList.contains('active')) {
        e.preventDefault();
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      }

      if (galleryModal && galleryModal.classList.contains('active')) {
        if (e.key === 'Escape') this.closeGalleryModal();
      }
    });
  }
};

// Funciones globales para compatibilidad
window.AdvancedGallery = AdvancedGallery;

// Funciones para los botones
window.openGalleryModal = (type) => AdvancedGallery.openGalleryModal(type);
// Historia modal functions are handled in advanced-gallery.js

// Auto-inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdvancedGallery.init());
} else {
  AdvancedGallery.init();
}
