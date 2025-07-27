/* ===========================
   MODALS MODULE
   =========================== */
const Modals = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Generic event listeners for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  },

  // Generic modal functions for future use
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Add animation class if content exists
      const content = modal.querySelector('[class*="content"]');
      if (content && content.classList.contains('animated-modal')) {
        content.classList.remove('animated-modal');
        void content.offsetWidth;
        content.classList.add('animated-modal');
      }
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  },

  closeAllModals() {
    document.querySelectorAll('[id$="-modal"]').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = '';
  }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Modals.init());
} else {
  Modals.init();
}
