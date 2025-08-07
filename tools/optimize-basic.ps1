# Script de optimizacion de imagenes - Santuario
# Version basica para Windows PowerShell

Write-Host "=========================================="
Write-Host "  OPTIMIZACION DE IMAGENES - SANTUARIO"
Write-Host "=========================================="

# Crear directorios
Write-Host "[1/4] Creando estructura..."
$dirs = @(
    "assets\images\optimized",
    "assets\images\optimized\gallery", 
    "assets\images\optimized\thumbnails"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) { 
        New-Item -ItemType Directory -Path $dir -Force | Out-Null 
        Write-Host "  * Creado: $dir"
    }
}

# Analizar imagenes existentes
Write-Host "[2/4] Analizando imagenes..."
$images = @("galeria1.jpg", "galeria2.jpg", "galeria3.jpg", "galeria4.jpg", "galeria5.jpg", "galeria6.jpg")
$found = 0
$totalSize = 0

foreach ($img in $images) {
    if (Test-Path $img) {
        $size = (Get-Item $img).Length
        $totalSize += $size
        $found++
        $sizeKB = [math]::Round($size/1024, 1)
        Write-Host "  * $img ($sizeKB KB)"
        
        # Copiar a directorio optimizado
        Copy-Item $img "assets\images\optimized\gallery\$img" -Force
    }
}

$totalKB = [math]::Round($totalSize/1024, 1)
Write-Host "  Total: $found imagenes ($totalKB KB)"

# Crear reporte
Write-Host "[3/4] Generando reporte..."
$report = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    imagesFound = $found
    totalSizeKB = $totalKB
    status = "Estructura creada - Optimizacion manual requerida"
}

$report | ConvertTo-Json | Out-File "assets\images\optimized\report.json" -Encoding UTF8

# Instrucciones
Write-Host "[4/4] Generando instrucciones..."
$instructions = @"
# OPTIMIZACION DE IMAGENES COMPLETADA

## Estado Actual:
- Imagenes encontradas: $found
- Tamano total: $totalKB KB
- Estructura de directorios creada

## Para optimizacion real:
1. Usar TinyPNG (https://tinypng.com/)
2. Usar Squoosh (https://squoosh.app/)
3. Reducir tamano 60-80%

## Lazy Loading:
- Ya implementado en optimized.js
- Usar data-src en lugar de src
- Imagenes cargan automaticamente al hacer scroll

## Archivos creados:
- assets\images\optimized\gallery\
- assets\images\optimized\report.json
"@

$instructions | Out-File "assets\images\optimized\README.txt" -Encoding UTF8

Write-Host ""
Write-Host "OPTIMIZACION BASE COMPLETADA"
Write-Host ""
Write-Host "Resumen:"
Write-Host "  Imagenes: $found"
Write-Host "  Tamano: $totalKB KB"
Write-Host ""
Write-Host "Recomendaciones:"
Write-Host "  1. Optimizar con TinyPNG (60-80% reduccion)"
Write-Host "  2. Lazy loading ya implementado"
Write-Host "  3. Probar en navegador"
Write-Host ""

Write-Host "Presiona Enter para continuar..."
Read-Host
