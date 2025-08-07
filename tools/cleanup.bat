@echo off
echo ========================================
echo   LIMPIEZA DEL PROYECTO SANTUARIO
echo ========================================
echo.

echo [1/5] Eliminando archivos obsoletos...
if exist "styles.css" (
    del "styles.css"
    echo   ✅ Eliminado: styles.css
)
if exist "styles_new.css" (
    del "styles_new.css"
    echo   ✅ Eliminado: styles_new.css
)
if exist "script.js" (
    del "script.js"
    echo   ✅ Eliminado: script.js
)
if exist "debug-mobile.html" (
    del "debug-mobile.html"
    echo   ✅ Eliminado: debug-mobile.html
)
if exist "debug-particles.js" (
    del "debug-particles.js"
    echo   ✅ Eliminado: debug-particles.js
)
if exist "test-logo.html" (
    del "test-logo.html"
    echo   ✅ Eliminado: test-logo.html
)
if exist "test.html" (
    del "test.html"
    echo   ✅ Eliminado: test.html
)

echo.
echo [2/5] Eliminando carpetas obsoletas...
if exist "Nueva carpeta" (
    rd /s /q "Nueva carpeta"
    echo   ✅ Eliminado: Nueva carpeta/
)

echo.
echo [3/5] Organizando documentación...
if not exist "docs\backup" mkdir "docs\backup"
if exist "CARRUSEL-Y-GALERIA-COMPLETADOS.md" (
    move "CARRUSEL-Y-GALERIA-COMPLETADOS.md" "docs\backup\"
    echo   ✅ Movido: CARRUSEL-Y-GALERIA-COMPLETADOS.md
)
if exist "MEJORAS-GALERIA-COMPLETADAS.md" (
    move "MEJORAS-GALERIA-COMPLETADAS.md" "docs\backup\"
    echo   ✅ Movido: MEJORAS-GALERIA-COMPLETADAS.md
)
if exist "RESTRUCTURACION-COMPLETADA.md" (
    move "RESTRUCTURACION-COMPLETADA.md" "docs\backup\"
    echo   ✅ Movido: RESTRUCTURACION-COMPLETADA.md
)
if exist "README-ESTRUCTURA.md" (
    move "README-ESTRUCTURA.md" "docs\backup\"
    echo   ✅ Movido: README-ESTRUCTURA.md
)

echo.
echo [4/5] Verificando estructura de carpetas...
if not exist "assets\images\optimized" (
    mkdir "assets\images\optimized"
    echo   ✅ Creado: assets\images\optimized\
)
if not exist "assets\icons" (
    mkdir "assets\icons"
    echo   ✅ Creado: assets\icons\
)
if not exist "assets\data" (
    mkdir "assets\data"
    echo   ✅ Creado: assets\data\
)

echo.
echo [5/5] Generando reporte de limpieza...
echo REPORTE DE LIMPIEZA - %date% %time% > docs\limpieza-reporte.txt
echo ================================================ >> docs\limpieza-reporte.txt
echo. >> docs\limpieza-reporte.txt
echo Archivos eliminados: >> docs\limpieza-reporte.txt
echo - styles.css >> docs\limpieza-reporte.txt
echo - styles_new.css >> docs\limpieza-reporte.txt
echo - script.js >> docs\limpieza-reporte.txt
echo - debug-mobile.html >> docs\limpieza-reporte.txt
echo - debug-particles.js >> docs\limpieza-reporte.txt
echo - test-logo.html >> docs\limpieza-reporte.txt
echo - test.html >> docs\limpieza-reporte.txt
echo. >> docs\limpieza-reporte.txt
echo Carpetas eliminadas: >> docs\limpieza-reporte.txt
echo - Nueva carpeta/ >> docs\limpieza-reporte.txt
echo. >> docs\limpieza-reporte.txt
echo Documentación movida a docs\backup\ >> docs\limpieza-reporte.txt
echo. >> docs\limpieza-reporte.txt
echo Estructura actual: >> docs\limpieza-reporte.txt
dir /b >> docs\limpieza-reporte.txt

echo.
echo ========================================
echo   ✅ LIMPIEZA COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo 📁 Estructura actual del proyecto:
dir /b
echo.
echo 📄 Reporte guardado en: docs\limpieza-reporte.txt
echo.
echo Próximos pasos recomendados:
echo 1. Revisar el archivo index.html
echo 2. Consolidar archivos CSS
echo 3. Optimizar imágenes
echo 4. Implementar Progressive Web App
echo.
pause
