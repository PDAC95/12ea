#!/bin/bash

# Script para verificar la configuración de CI/CD del frontend localmente
# Ejecutar antes de hacer push a main

set -e

echo "🔍 Verificando configuración de CI/CD del frontend..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para imprimir error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para imprimir warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Navegar al directorio del frontend
cd frontend || {
    print_error "No se encontró el directorio 'frontend'"
    exit 1
}

# 1. Verificar package.json
echo "📦 Verificando package.json..."
if [ -f "package.json" ]; then
    print_success "package.json encontrado"
else
    print_error "package.json no encontrado"
    exit 1
fi

# 2. Verificar que existan los scripts necesarios
echo ""
echo "🔧 Verificando scripts npm..."

REQUIRED_SCRIPTS=("dev" "build" "lint")
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if grep -q "\"$script\"" package.json; then
        print_success "Script '$script' encontrado"
    else
        print_error "Script '$script' no encontrado en package.json"
        exit 1
    fi
done

# 3. Instalar dependencias
echo ""
echo "📥 Instalando dependencias..."
npm ci || {
    print_error "Error al instalar dependencias"
    exit 1
}
print_success "Dependencias instaladas correctamente"

# 4. Ejecutar ESLint
echo ""
echo "🔍 Ejecutando ESLint..."
if npm run lint; then
    print_success "ESLint pasó sin errores"
else
    print_error "ESLint encontró errores. Corrige los errores antes de continuar."
    exit 1
fi

# 5. Verificar archivo .env
echo ""
echo "🔐 Verificando configuración de variables de entorno..."
if [ -f ".env" ]; then
    print_success ".env encontrado"

    # Verificar VITE_API_URL
    if grep -q "VITE_API_URL" .env; then
        print_success "VITE_API_URL configurada en .env"
    else
        print_warning "VITE_API_URL no encontrada en .env"
    fi
else
    print_warning ".env no encontrado (opcional en local)"
fi

# 6. Ejecutar build
echo ""
echo "🔨 Ejecutando build de producción..."
if npm run build; then
    print_success "Build completado exitosamente"
else
    print_error "Build falló. Verifica los errores."
    exit 1
fi

# 7. Verificar output del build
echo ""
echo "📂 Verificando output del build..."
if [ -d "dist" ]; then
    print_success "Directorio 'dist' generado"

    # Verificar que contenga archivos
    FILE_COUNT=$(find dist -type f | wc -l)
    if [ "$FILE_COUNT" -gt 0 ]; then
        print_success "Build generó $FILE_COUNT archivos"
    else
        print_error "El directorio 'dist' está vacío"
        exit 1
    fi

    # Verificar index.html
    if [ -f "dist/index.html" ]; then
        print_success "index.html generado correctamente"
    else
        print_error "index.html no encontrado en dist/"
        exit 1
    fi
else
    print_error "Directorio 'dist' no encontrado"
    exit 1
fi

# 8. Verificar tamaño del bundle
echo ""
echo "📊 Analizando tamaño del bundle..."
TOTAL_SIZE=$(du -sh dist | cut -f1)
print_success "Tamaño total del bundle: $TOTAL_SIZE"

# Warning si el bundle es muy grande
BUNDLE_SIZE_KB=$(du -sk dist | cut -f1)
if [ "$BUNDLE_SIZE_KB" -gt 5000 ]; then
    print_warning "El bundle es grande ($TOTAL_SIZE). Considera optimizar."
else
    print_success "El tamaño del bundle es aceptable"
fi

# 9. Verificar workflow de GitHub Actions
echo ""
echo "🔄 Verificando workflow de GitHub Actions..."
if [ -f "../.github/workflows/frontend-ci-cd.yml" ]; then
    print_success "Workflow de GitHub Actions encontrado"
else
    print_error "Workflow frontend-ci-cd.yml no encontrado"
    exit 1
fi

# 10. Verificar que no haya archivos sensibles en dist
echo ""
echo "🔒 Verificando archivos sensibles..."
SENSITIVE_FILES=(".env" ".env.local" ".env.production" "secrets.json")
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "dist/$file" ]; then
        print_error "Archivo sensible '$file' encontrado en dist/"
        exit 1
    fi
done
print_success "No se encontraron archivos sensibles en dist/"

# 11. Resumen final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Configura los secrets en GitHub:"
echo "      - VERCEL_TOKEN"
echo "      - VITE_API_URL"
echo ""
echo "   2. Haz commit y push a tu rama:"
echo "      git add ."
echo "      git commit -m 'feat: agregar CI/CD workflow para frontend'"
echo "      git push"
echo ""
echo "   3. Crea un Pull Request a main"
echo ""
echo "   4. Una vez mergeado, el deploy se ejecutará automáticamente"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cleanup
echo "🧹 Limpiando archivos temporales..."
rm -rf dist
print_success "Verificación completada"
