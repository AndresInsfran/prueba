// ===========================
// VALIDACIÓN FINAL DEL SITIO WEB
// ===========================

console.log('🔍 INICIANDO VALIDACIÓN FINAL...');

// 1. Verificar estructura HTML
const verificarEstructura = () => {
    const secciones = [
        'inicio', 'evangelio', 'horarios', 'nosotros', 
        'momentos-especiales', 'galeria', 'calendario', 
        'noticias', 'comentarios', 'contacto', 'encuentranos'
    ];
    
    console.log('📋 Verificando secciones principales:');
    secciones.forEach(seccion => {
        const elemento = document.getElementById(seccion);
        console.log(`${elemento ? '✅' : '❌'} Sección "${seccion}": ${elemento ? 'Encontrada' : 'Faltante'}`);
    });
};

// 2. Verificar botones WhatsApp
const verificarWhatsApp = () => {
    console.log('📱 Verificando sistema WhatsApp:');
    
    // Botones en sección contacto
    const botonesContacto = document.querySelectorAll('.contacto-whatsapp .btn-whatsapp');
    console.log(`${botonesContacto.length >= 2 ? '✅' : '❌'} Botones en contacto: ${botonesContacto.length}/2`);
    
    // Botón flotante
    const botonFlotante = document.getElementById('whatsapp-float-toggle');
    console.log(`${botonFlotante ? '✅' : '❌'} Botón flotante: ${botonFlotante ? 'Presente' : 'Ausente'}`);
    
    // Menú flotante
    const menuFlotante = document.getElementById('whatsapp-float-menu');
    console.log(`${menuFlotante ? '✅' : '❌'} Menú flotante: ${menuFlotante ? 'Presente' : 'Ausente'}`);
};

// 3. Verificar evangelio del día
const verificarEvangelio = () => {
    console.log('📅 Verificando evangelio del día:');
    
    console.log(`${typeof EvangelioDia !== 'undefined' ? '✅' : '❌'} EvangelioDia: ${typeof EvangelioDia !== 'undefined' ? 'Disponible' : 'No disponible'}`);
    
    const evangelioSection = document.getElementById('evangelio-dia');
    console.log(`${evangelioSection ? '✅' : '❌'} Sección evangelio: ${evangelioSection ? 'Presente' : 'Ausente'}`);
};

// 4. Verificar dependencias externas
const verificarDependencias = () => {
    console.log('📚 Verificando dependencias externas:');
    
    // FullCalendar
    console.log(`${typeof FullCalendar !== 'undefined' ? '✅' : '❌'} FullCalendar: ${typeof FullCalendar !== 'undefined' ? 'Cargado' : 'No cargado'}`);
    
    // Font Awesome
    const fontAwesome = document.querySelector('.fab') || document.querySelector('.fas');
    console.log(`${fontAwesome ? '✅' : '❌'} Font Awesome: ${fontAwesome ? 'Cargado' : 'No cargado'}`);
    
    // Google Fonts
    const googleFonts = document.querySelector('link[href*="fonts.googleapis.com"]');
    console.log(`${googleFonts ? '✅' : '❌'} Google Fonts: ${googleFonts ? 'Cargado' : 'No cargado'}`);
};

// 5. Verificar recursos críticos
const verificarRecursos = () => {
    console.log('🖼️ Verificando recursos críticos:');
    
    // Imagen de portada
    const imagenPortada = document.querySelector('.img-portada');
    if (imagenPortada) {
        imagenPortada.onload = () => console.log('✅ Imagen portada: Cargada correctamente');
        imagenPortada.onerror = () => console.log('❌ Imagen portada: Error al cargar');
    }
    
    // Logo
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.onload = () => console.log('✅ Logo: Cargado correctamente');
        logo.onerror = () => console.log('❌ Logo: Error al cargar');
    }
};

// 6. Verificar funcionalidades interactivas
const verificarInteractividad = () => {
    console.log('🖱️ Verificando funcionalidades interactivas:');
    
    // Navegación móvil
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    console.log(`${menuToggle ? '✅' : '❌'} Menú móvil: ${menuToggle ? 'Presente' : 'Ausente'}`);
    
    // Botón volver al inicio
    const btnVolver = document.getElementById('btn-volver-inicio');
    console.log(`${btnVolver ? '✅' : '❌'} Botón volver: ${btnVolver ? 'Presente' : 'Ausente'}`);
    
    // Modales
    const modalHistoria = document.getElementById('modal-historia');
    console.log(`${modalHistoria ? '✅' : '❌'} Modal historia: ${modalHistoria ? 'Presente' : 'Ausente'}`);
};

// Ejecutar todas las verificaciones
const ejecutarValidacion = () => {
    try {
        verificarEstructura();
        verificarWhatsApp();
        verificarEvangelio();
        verificarDependencias();
        verificarRecursos();
        verificarInteractividad();
        
        console.log('🎉 VALIDACIÓN COMPLETADA');
        console.log('ℹ️ Revisa los resultados arriba para identificar cualquier problema');
        
    } catch (error) {
        console.error('❌ Error durante la validación:', error);
    }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ejecutarValidacion);
} else {
    ejecutarValidacion();
}
