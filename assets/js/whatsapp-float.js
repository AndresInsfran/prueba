// ===========================
// WHATSAPP FLOTANTE
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const whatsappToggle = document.getElementById('whatsapp-float-toggle');
    const whatsappMenu = document.getElementById('whatsapp-float-menu');
    let menuAbierto = false;

    if (whatsappToggle && whatsappMenu) {
        // Toggle del menú
        whatsappToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            menuAbierto = !menuAbierto;
            
            if (menuAbierto) {
                whatsappMenu.classList.add('active');
                whatsappToggle.style.transform = 'rotate(45deg)';
            } else {
                whatsappMenu.classList.remove('active');
                whatsappToggle.style.transform = 'rotate(0deg)';
            }
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!whatsappToggle.contains(e.target) && !whatsappMenu.contains(e.target)) {
                if (menuAbierto) {
                    menuAbierto = false;
                    whatsappMenu.classList.remove('active');
                    whatsappToggle.style.transform = 'rotate(0deg)';
                }
            }
        });
    } else {
        console.warn('Elementos del botón flotante de WhatsApp no encontrados');
    }
});

// Función para abrir WhatsApp directamente (para uso desde otros lugares)
function abrirWhatsApp(numero, mensaje = '') {
    const mensajeDefecto = 'Hola, me comunico desde la página web del Santuario';
    const textoFinal = mensaje || mensajeDefecto;
    
    // Detectar si es móvil
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let url;
    if (esMobile) {
        // Para móviles, usar el protocolo whatsapp://
        url = `whatsapp://send?phone=595${numero}&text=${encodeURIComponent(textoFinal)}`;
    } else {
        // Para desktop, usar wa.me
        url = `https://wa.me/595${numero}?text=${encodeURIComponent(textoFinal)}`;
    }
    
    // Intentar abrir en una nueva ventana
    const ventana = window.open(url, '_blank', 'noopener,noreferrer');
    
    // Si no se pudo abrir (bloqueador de pop-ups), usar location
    if (!ventana) {
        window.location.href = url;
    }
}

// Agregar manejadores de eventos a todos los enlaces de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const enlacesWhatsApp = document.querySelectorAll('a[href*="wa.me"]');
    
    enlacesWhatsApp.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            // Asegurar que el enlace funcione
            console.log('Abriendo WhatsApp:', this.href);
        });
    });
});

// Agregar animación de pulso al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 6px 30px rgba(37, 211, 102, 0.8); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
