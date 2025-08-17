# ========================================
# SCRIPT PARA CAMBIAR DISEÑOS DE BOTONES
# ========================================

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("premium", "minimal", "original")]
    [string]$Diseno
)

$indexPath = "c:\Users\Andres\Desktop\prueba\index.html"

Write-Host "🎨 Cambiando diseño de botones a: $Diseno" -ForegroundColor Cyan

switch ($Diseno) {
    "premium" {
        $cssFile = "assets/css/enlaces-premium.css"
        $descripcion = "Diseño premium con efectos glassmorphism y animaciones doradas"
    }
    "minimal" {
        $cssFile = "assets/css/enlaces-minimal.css"
        $descripcion = "Diseño minimalista y elegante con bordes dorados"
    }
    "original" {
        $cssFile = "assets/css/noticias-new.css"
        $descripcion = "Diseño original con tarjetas modernas"
    }
}

# Leer contenido actual
$content = Get-Content $indexPath -Raw

# Buscar y reemplazar la línea del CSS
$pattern = 'href="assets/css/enlaces-[^"]*\.css"'
$replacement = "href=`"$cssFile`""

if ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
} else {
    # Si no encuentra el patrón, buscar el patrón más general
    $pattern = 'href="assets/css/noticias[^"]*\.css"'
    if ($content -match $pattern) {
        $content = $content -replace $pattern, $replacement
    }
}

# Guardar cambios
$content | Set-Content $indexPath -Encoding UTF8

Write-Host "✅ Diseño cambiado exitosamente" -ForegroundColor Green
Write-Host "📄 Descripción: $descripcion" -ForegroundColor Yellow
Write-Host "📁 Archivo CSS: $cssFile" -ForegroundColor Gray

Write-Host "`n🌐 Abre el navegador para ver los cambios:" -ForegroundColor Cyan
Write-Host "file:///c:/Users/Andres/Desktop/prueba/index.html" -ForegroundColor Blue

Write-Host "`n📖 Diseños disponibles:" -ForegroundColor Magenta
Write-Host "• premium  - Efectos glassmorphism y animaciones avanzadas" -ForegroundColor White
Write-Host "• minimal  - Diseño limpio y minimalista" -ForegroundColor White
Write-Host "• original - Diseño de tarjetas modernas" -ForegroundColor White

Write-Host "`n🔄 Para cambiar diseño usa:" -ForegroundColor Yellow
Write-Host ".\cambiar-diseno.ps1 -Diseno premium" -ForegroundColor Gray
Write-Host ".\cambiar-diseno.ps1 -Diseno minimal" -ForegroundColor Gray
Write-Host ".\cambiar-diseno.ps1 -Diseno original" -ForegroundColor Gray
