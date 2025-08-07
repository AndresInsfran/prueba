#!/bin/bash
# =======================================================
# SCRIPT DE OPTIMIZACIÓN DE IMÁGENES
# Optimiza las imágenes de la galería para web
# =======================================================

echo "=========================================="
echo "  OPTIMIZACIÓN DE IMÁGENES - SANTUARIO"
echo "=========================================="

# Verificar si existe ImageMagick o similar
if ! command -v magick &> /dev/null; then
    echo "⚠️  ImageMagick no encontrado. Instalando..."
    # En Windows con Chocolatey
    # choco install imagemagick
    echo "📥 Por favor instala ImageMagick desde: https://imagemagick.org/script/download.php#windows"
    echo ""
fi

# Crear directorios si no existen
echo "[1/6] Creando estructura de directorios..."
mkdir -p "assets/images/optimized/gallery"
mkdir -p "assets/images/optimized/thumbnails" 
mkdir -p "assets/images/optimized/webp"

# Función para optimizar una imagen
optimize_image() {
    local input_file=$1
    local output_dir=$2
    local quality=${3:-85}
    local width=${4:-1200}
    
    if [ -f "$input_file" ]; then
        filename=$(basename "$input_file")
        name="${filename%.*}"
        
        echo "   ✓ Optimizando: $filename"
        
        # Imagen optimizada JPEG
        magick "$input_file" -resize "${width}x${width}>" -quality $quality "$output_dir/${name}.jpg" 2>/dev/null
        
        # Versión WebP (mayor compresión)
        magick "$input_file" -resize "${width}x${width}>" -quality $quality "$output_dir/${name}.webp" 2>/dev/null
        
        # Thumbnail
        magick "$input_file" -resize "400x400>" -quality 80 "assets/images/optimized/thumbnails/${name}_thumb.jpg" 2>/dev/null
    fi
}

# Lista de imágenes a optimizar
images=(
    "galeria1.jpg"
    "galeria2.jpg" 
    "galeria3.jpg"
    "galeria4.jpg"
    "galeria5.jpg"
    "galeria6.jpg"
    "portada.jpg"
)

echo "[2/6] Optimizando imágenes de galería..."
for img in "${images[@]}"; do
    if [ -f "$img" ]; then
        optimize_image "$img" "assets/images/optimized/gallery" 85 1200
    elif [ -f "assets/images/galeria/$img" ]; then
        optimize_image "assets/images/galeria/$img" "assets/images/optimized/gallery" 85 1200
    else
        echo "   ⚠️  No encontrado: $img"
    fi
done

echo "[3/6] Optimizando imagen de portada..."
if [ -f "portada.jpg" ]; then
    optimize_image "portada.jpg" "assets/images/optimized" 90 1920
elif [ -f "assets/images/portada.jpg" ]; then
    optimize_image "assets/images/portada.jpg" "assets/images/optimized" 90 1920
fi

echo "[4/6] Generando imágenes responsive..."
# Crear diferentes tamaños para responsive design
for img in "${images[@]}"; do
    if [ -f "assets/images/optimized/gallery/${img%.*}.jpg" ]; then
        name="${img%.*}"
        
        # Versiones responsive
        magick "assets/images/optimized/gallery/${name}.jpg" -resize "800x800>" -quality 85 "assets/images/optimized/gallery/${name}_md.jpg" 2>/dev/null
        magick "assets/images/optimized/gallery/${name}.jpg" -resize "600x600>" -quality 80 "assets/images/optimized/gallery/${name}_sm.jpg" 2>/dev/null
    fi
done

echo "[5/6] Generando sprites y placeholders..."
# Crear placeholder genérico
magick -size 400x300 xc:"#f0f0f0" -pointsize 20 -gravity center -annotate +0+0 "Cargando..." "assets/images/optimized/placeholder.jpg" 2>/dev/null

echo "[6/6] Generando reporte de optimización..."

# Calcular ahorro de espacio
original_size=0
optimized_size=0

if command -v du &> /dev/null; then
    original_size=$(du -sb *.jpg 2>/dev/null | awk '{sum += $1} END {print sum}')
    optimized_size=$(du -sb assets/images/optimized/gallery/*.jpg 2>/dev/null | awk '{sum += $1} END {print sum}')
    
    if [ "$original_size" -gt 0 ] && [ "$optimized_size" -gt 0 ]; then
        reduction=$(( (original_size - optimized_size) * 100 / original_size ))
        echo "📊 Estadísticas de optimización:"
        echo "   Original: $(( original_size / 1024 )) KB"
        echo "   Optimizado: $(( optimized_size / 1024 )) KB"
        echo "   Reducción: ${reduction}%"
    fi
fi

echo ""
echo "=========================================="
echo "✅ OPTIMIZACIÓN COMPLETADA"
echo "=========================================="
echo "📁 Imágenes optimizadas en: assets/images/optimized/"
echo "🖼️  Formatos generados:"
echo "   • JPEG optimizado (calidad 85%)"
echo "   • WebP (mayor compresión)"
echo "   • Thumbnails (400px)"
echo "   • Versiones responsive (800px, 600px)"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Actualizar rutas en HTML para usar imágenes optimizadas"
echo "   2. Implementar lazy loading"
echo "   3. Configurar servidor para servir WebP automáticamente"
echo ""
echo "Presiona Enter para continuar..."
read
