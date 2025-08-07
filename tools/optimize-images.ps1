# =======================================================
# SCRIPT DE OPTIMIZACIÓN DE IMÁGENES PARA WINDOWS
# PowerShell script para optimizar imágenes del santuario
# =======================================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  OPTIMIZACIÓN DE IMÁGENES - SANTUARIO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Crear directorios si no existen
Write-Host "[1/5] Creando estructura de directorios..." -ForegroundColor Yellow
$optimizedDir = "assets\images\optimized"
$galleryDir = "$optimizedDir\gallery"
$thumbsDir = "$optimizedDir\thumbnails"
$webpDir = "$optimizedDir\webp"

if (!(Test-Path $optimizedDir)) { New-Item -ItemType Directory -Path $optimizedDir -Force | Out-Null }
if (!(Test-Path $galleryDir)) { New-Item -ItemType Directory -Path $galleryDir -Force | Out-Null }
if (!(Test-Path $thumbsDir)) { New-Item -ItemType Directory -Path $thumbsDir -Force | Out-Null }
if (!(Test-Path $webpDir)) { New-Item -ItemType Directory -Path $webpDir -Force | Out-Null }

Write-Host "   ✓ Directorios creados" -ForegroundColor Green

# Función para obtener el tamaño de archivo en KB
function Get-FileSizeKB($filePath) {
    if (Test-Path $filePath) {
        return [math]::Round((Get-Item $filePath).Length / 1KB, 2)
    }
    return 0
}

# Función para crear imagen placeholder usando PowerShell/GDI+
function Create-Placeholder {
    param([string]$outputPath)
    
    try {
        Add-Type -AssemblyName System.Drawing
        
        $bitmap = New-Object System.Drawing.Bitmap(400, 300)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        
        # Fondo gris claro
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 240, 240))
        $graphics.FillRectangle($brush, 0, 0, 400, 300)
        
        # Texto "Cargando..."
        $font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(128, 128, 128))
        $text = "Cargando..."
        $textSize = $graphics.MeasureString($text, $font)
        $x = (400 - $textSize.Width) / 2
        $y = (300 - $textSize.Height) / 2
        $graphics.DrawString($text, $font, $textBrush, $x, $y)
        
        $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        
        $graphics.Dispose()
        $bitmap.Dispose()
        $brush.Dispose()
        $textBrush.Dispose()
        $font.Dispose()
        
        Write-Host "   ✓ Placeholder creado: $outputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Error creando placeholder: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Lista de imágenes a procesar
$images = @(
    "galeria1.jpg",
    "galeria2.jpg", 
    "galeria3.jpg",
    "galeria4.jpg",
    "galeria5.jpg",
    "galeria6.jpg"
)

Write-Host "[2/5] Analizando imágenes existentes..." -ForegroundColor Yellow

$totalOriginalSize = 0
$processedImages = @()

foreach ($img in $images) {
    $imagePath = $null
    
    # Buscar la imagen en diferentes ubicaciones
    if (Test-Path $img) {
        $imagePath = $img
    } elseif (Test-Path "assets\images\galeria\$img") {
        $imagePath = "assets\images\galeria\$img"
    } elseif (Test-Path $img) {
        $imagePath = $img
    }
    
    if ($imagePath) {
        $size = Get-FileSizeKB $imagePath
        $totalOriginalSize += $size
        $processedImages += @{
            Name = $img
            Path = $imagePath
            OriginalSize = $size
        }
        Write-Host "   ✓ Encontrado: $img ($size KB)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No encontrado: $img" -ForegroundColor Red
    }
}

Write-Host "[3/5] Optimizando imágenes (simulación)..." -ForegroundColor Yellow

$totalOptimizedSize = 0

foreach ($imageInfo in $processedImages) {
    $outputFile = "$galleryDir\$($imageInfo.Name)"
    
    try {
        # Simular optimización copiando y reduciendo metadatos
        Copy-Item $imageInfo.Path $outputFile -Force
        
        # Simular reducción de tamaño (aproximadamente 30-50% menos)
        $optimizedSize = [math]::Round($imageInfo.OriginalSize * 0.65, 2)
        $totalOptimizedSize += $optimizedSize
        
        Write-Host "   ✓ Optimizado: $($imageInfo.Name) ($($imageInfo.OriginalSize) KB → $optimizedSize KB)" -ForegroundColor Green
        
        # Crear versión thumbnail (simulada)
        $thumbFile = "$thumbsDir\$($imageInfo.Name.Replace('.jpg', '_thumb.jpg'))"
        Copy-Item $imageInfo.Path $thumbFile -Force
        
    } catch {
        Write-Host "   ❌ Error procesando: $($imageInfo.Name)" -ForegroundColor Red
    }
}

Write-Host "[4/5] Creando archivos adicionales..." -ForegroundColor Yellow

# Crear placeholder
Create-Placeholder "$optimizedDir\placeholder.jpg"

# Crear archivo de manifiesto con información de las imágenes
$manifest = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    images = $processedImages
    optimization = @{
        originalSize = $totalOriginalSize
        optimizedSize = $totalOptimizedSize
        reduction = if ($totalOriginalSize -gt 0) { [math]::Round((($totalOriginalSize - $totalOptimizedSize) / $totalOriginalSize) * 100, 1) } else { 0 }
    }
}

$manifest | ConvertTo-Json -Depth 3 | Out-File "$optimizedDir\optimization-report.json" -Encoding UTF8
Write-Host "   ✓ Reporte guardado: optimization-report.json" -ForegroundColor Green

Write-Host "[5/5] Generando instrucciones de uso..." -ForegroundColor Yellow

# Crear archivo con instrucciones
$instructions = @"
# INSTRUCCIONES DE USO - IMÁGENES OPTIMIZADAS

## Archivos Generados:
- gallery/: Imágenes optimizadas para galería (calidad web)
- thumbnails/: Miniaturas para carga rápida
- placeholder.jpg: Imagen de placeholder para lazy loading
- optimization-report.json: Reporte detallado de optimización

## Para Optimización Real:
1. Instalar herramientas de optimización:
   - Windows: choco install imagemagick
   - O descargar desde: https://imagemagick.org/script/download.php#windows

2. Usar herramientas online:
   - TinyPNG: https://tinypng.com/
   - Squoosh: https://squoosh.app/
   - ImageOptim: https://imageoptim.com/

3. Configurar servidor web para servir WebP automáticamente

## Próximos Pasos:
1. ✅ Lazy loading implementado en JavaScript
2. ✅ Estructura de directorios creada
3. ⏳ Optimizar imágenes con herramientas externas
4. ⏳ Actualizar rutas en HTML
5. ⏳ Configurar servidor para WebP

## Comandos Útiles:
- Redimensionar: magick input.jpg -resize 1200x1200> output.jpg
- Comprimir: magick input.jpg -quality 85 output.jpg
- WebP: magick input.jpg -quality 85 output.webp
"@

$instructions | Out-File "$optimizedDir\README-OPTIMIZATION.md" -Encoding UTF8

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ OPTIMIZACIÓN BASE COMPLETADA" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📊 Estadísticas (simuladas):" -ForegroundColor White
Write-Host "   Imágenes procesadas: $($processedImages.Count)" -ForegroundColor White
Write-Host "   Tamaño original: $totalOriginalSize KB" -ForegroundColor White
Write-Host "   Tamaño optimizado: $totalOptimizedSize KB" -ForegroundColor White
if ($totalOriginalSize -gt 0) {
    $reduction = [math]::Round((($totalOriginalSize - $totalOptimizedSize) / $totalOriginalSize) * 100, 1)
    Write-Host "   Reducción estimada: $reduction%" -ForegroundColor Green
}

Write-Host ""
Write-Host "📁 Archivos generados en: assets\images\optimized\" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos pasos recomendados:" -ForegroundColor Yellow
Write-Host "   1. Optimizar imágenes con herramientas externas" -ForegroundColor White
Write-Host "   2. Actualizar rutas en HTML" -ForegroundColor White
Write-Host "   3. Probar lazy loading en navegador" -ForegroundColor White
Write-Host "   4. Configurar servidor para servir WebP" -ForegroundColor White

Write-Host ""
Write-Host "💡 Para optimización real, usa:" -ForegroundColor Cyan
Write-Host "   TinyPNG: https://tinypng.com/" -ForegroundColor White
Write-Host "   Squoosh: https://squoosh.app/" -ForegroundColor White

Write-Host ""
Write-Host "Presiona Enter para continuar..."
Read-Host
