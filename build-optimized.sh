#!/bin/bash

echo "🚀 Iniciando build optimizado para Azure..."
echo ""

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf dist/

# Construir con optimizaciones
echo "⚙️  Compilando TypeScript y generando bundle optimizado..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completado exitosamente!"
    echo ""
    echo "📊 Análisis de tamaño:"
    echo "===================="
    
    # Mostrar tamaño total de dist
    echo ""
    echo "📦 Tamaño total de dist/:"
    du -sh dist/
    
    # Mostrar tamaño en bytes (para comparar con límite)
    DIST_SIZE=$(du -sb dist/ | cut -f1)
    LIMIT=262144000
    PERCENTAGE=$((DIST_SIZE * 100 / LIMIT))
    
    echo ""
    echo "📏 Tamaño en bytes: $DIST_SIZE / $LIMIT (${PERCENTAGE}% del límite)"
    
    if [ $DIST_SIZE -lt $LIMIT ]; then
        echo "✅ ¡El build está BAJO el límite de Azure!"
    else
        echo "⚠️  WARNING: El build aún excede el límite"
    fi
    
    # Mostrar archivos más grandes
    echo ""
    echo "📁 Los 10 archivos más grandes en dist/:"
    find dist -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr | head -10
    
    echo ""
    echo "🎉 Listo para deploy!"
    echo ""
    echo "💡 Próximos pasos:"
    echo "  1. Verifica el tamaño arriba"
    echo "  2. Deploy SOLO la carpeta dist/ a Azure"
    echo "  3. NO incluyas node_modules/, src/, o archivos de configuración"
    echo ""
else
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi
