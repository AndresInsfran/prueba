// ===========================
// VERIFICADOR DE ERRORES Y DEBUGGING
// ===========================

const DebugHelper = {
    init() {
        this.checkDependencies();
        this.setupErrorHandling();
        this.logSystemInfo();
    },

    checkDependencies() {
        const dependencies = [
            { name: 'Font Awesome', check: () => typeof FontAwesome !== 'undefined' || document.querySelector('.fab') !== null },
            { name: 'FullCalendar', check: () => typeof FullCalendar !== 'undefined' },
            { name: 'Calendario Litúrgico', check: () => typeof calendarioLiturgico !== 'undefined' },
            { name: 'jQuery (opcional)', check: () => typeof $ !== 'undefined' }
        ];

        console.log('🔍 Verificando dependencias...');
        dependencies.forEach(dep => {
            try {
                const isAvailable = dep.check();
                console.log(`${isAvailable ? '✅' : '❌'} ${dep.name}: ${isAvailable ? 'Disponible' : 'No encontrado'}`);
            } catch (error) {
                console.log(`❌ ${dep.name}: Error al verificar - ${error.message}`);
            }
        });
    },

    setupErrorHandling() {
        // Capturar errores globales
        window.addEventListener('error', (event) => {
            console.error('🚨 Error global capturado:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Promesa rechazada sin manejar:', event.reason);
        });
    },

    logSystemInfo() {
        console.log('📊 Información del sistema:', {
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        });
    },

    checkRequiredElements() {
        const requiredElements = [
            'evangelio-dia',
            'calendario-simple',
            'whatsapp-float-toggle',
            'btn-volver-inicio',
            'menu-toggle'
        ];

        console.log('🎯 Verificando elementos requeridos...');
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`${element ? '✅' : '❌'} #${id}: ${element ? 'Encontrado' : 'No encontrado'}`);
        });
    },

    testFunctionality() {
        console.log('🧪 Probando funcionalidades...');

        // Test calendario litúrgico
        if (typeof calendarioLiturgico !== 'undefined') {
            try {
                calendarioLiturgico.obtenerLiturgiaDelDia().then(liturgia => {
                    console.log('✅ Calendario litúrgico funcionando:', liturgia);
                }).catch(error => {
                    console.error('❌ Error en calendario litúrgico:', error);
                });
            } catch (error) {
                console.error('❌ Error al probar calendario litúrgico:', error);
            }
        }

        // Test responsive design
        this.testResponsive();
    },

    testResponsive() {
        const breakpoints = [
            { name: 'Mobile', width: 480 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1024 }
        ];

        const currentWidth = window.innerWidth;
        const currentBreakpoint = breakpoints.find(bp => currentWidth <= bp.width) || 
                                { name: 'Large Desktop', width: currentWidth };

        console.log(`📱 Breakpoint actual: ${currentBreakpoint.name} (${currentWidth}px)`);
    },

    reportIssues() {
        const issues = [];
        
        // Verificar imágenes rotas
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.complete || img.naturalHeight === 0) {
                issues.push(`Imagen rota: ${img.src} (índice: ${index})`);
            }
        });

        // Verificar enlaces rotos (solo internos)
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            const target = link.getAttribute('href');
            if (target && target !== '#' && !document.querySelector(target)) {
                issues.push(`Enlace interno roto: ${target}`);
            }
        });

        if (issues.length > 0) {
            console.warn('⚠️ Problemas encontrados:', issues);
        } else {
            console.log('✅ No se encontraron problemas evidentes');
        }

        return issues;
    }
};

// Auto-inicializar en desarrollo
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar en desarrollo (detectar localhost)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname === '') {
        
        console.log('🔧 Modo desarrollo detectado - Ejecutando verificaciones...');
        DebugHelper.init();
        
        // Esperar un poco para que todo se cargue
        setTimeout(() => {
            DebugHelper.checkRequiredElements();
            DebugHelper.testFunctionality();
            DebugHelper.reportIssues();
        }, 2000);
    }
});

// Exportar para uso manual
window.DebugHelper = DebugHelper;
