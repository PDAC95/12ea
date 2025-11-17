# Script para verificar la configuración de CI/CD del frontend localmente (Windows PowerShell)
# Ejecutar antes de hacer push a main

$ErrorActionPreference = "Stop"

Write-Host "🔍 Verificando configuración de CI/CD del frontend..." -ForegroundColor Cyan
Write-Host ""

# Función para imprimir success
function Print-Success {
    param([string]$message)
    Write-Host "✅ $message" -ForegroundColor Green
}

# Función para imprimir error
function Print-Error {
    param([string]$message)
    Write-Host "❌ $message" -ForegroundColor Red
}

# Función para imprimir warning
function Print-Warning {
    param([string]$message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

# Navegar al directorio del frontend
if (Test-Path "frontend") {
    Set-Location frontend
} else {
    Print-Error "No se encontró el directorio 'frontend'"
    exit 1
}

# 1. Verificar package.json
Write-Host "📦 Verificando package.json..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    Print-Success "package.json encontrado"
} else {
    Print-Error "package.json no encontrado"
    exit 1
}

# 2. Verificar que existan los scripts necesarios
Write-Host ""
Write-Host "🔧 Verificando scripts npm..." -ForegroundColor Cyan

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$requiredScripts = @("dev", "build", "lint")

foreach ($script in $requiredScripts) {
    if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
        Print-Success "Script '$script' encontrado"
    } else {
        Print-Error "Script '$script' no encontrado en package.json"
        exit 1
    }
}

# 3. Instalar dependencias
Write-Host ""
Write-Host "📥 Instalando dependencias..." -ForegroundColor Cyan
try {
    npm ci
    Print-Success "Dependencias instaladas correctamente"
} catch {
    Print-Error "Error al instalar dependencias"
    exit 1
}

# 4. Ejecutar ESLint
Write-Host ""
Write-Host "🔍 Ejecutando ESLint..." -ForegroundColor Cyan
try {
    npm run lint
    if ($LASTEXITCODE -eq 0) {
        Print-Success "ESLint pasó sin errores"
    } else {
        Print-Error "ESLint encontró errores. Corrige los errores antes de continuar."
        exit 1
    }
} catch {
    Print-Error "Error al ejecutar ESLint"
    exit 1
}

# 5. Verificar archivo .env
Write-Host ""
Write-Host "🔐 Verificando configuración de variables de entorno..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Print-Success ".env encontrado"

    # Verificar VITE_API_URL
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_API_URL") {
        Print-Success "VITE_API_URL configurada en .env"
    } else {
        Print-Warning "VITE_API_URL no encontrada en .env"
    }
} else {
    Print-Warning ".env no encontrado (opcional en local)"
}

# 6. Ejecutar build
Write-Host ""
Write-Host "🔨 Ejecutando build de producción..." -ForegroundColor Cyan
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Print-Success "Build completado exitosamente"
    } else {
        Print-Error "Build falló. Verifica los errores."
        exit 1
    }
} catch {
    Print-Error "Error al ejecutar build"
    exit 1
}

# 7. Verificar output del build
Write-Host ""
Write-Host "📂 Verificando output del build..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Print-Success "Directorio 'dist' generado"

    # Verificar que contenga archivos
    $fileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
    if ($fileCount -gt 0) {
        Print-Success "Build generó $fileCount archivos"
    } else {
        Print-Error "El directorio 'dist' está vacío"
        exit 1
    }

    # Verificar index.html
    if (Test-Path "dist/index.html") {
        Print-Success "index.html generado correctamente"
    } else {
        Print-Error "index.html no encontrado en dist/"
        exit 1
    }
} else {
    Print-Error "Directorio 'dist' no encontrado"
    exit 1
}

# 8. Verificar tamaño del bundle
Write-Host ""
Write-Host "📊 Analizando tamaño del bundle..." -ForegroundColor Cyan
$totalSize = (Get-ChildItem -Path "dist" -Recurse -File | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Print-Success "Tamaño total del bundle: $totalSizeMB MB"

# Warning si el bundle es muy grande
if ($totalSizeMB -gt 5) {
    Print-Warning "El bundle es grande ($totalSizeMB MB). Considera optimizar."
} else {
    Print-Success "El tamaño del bundle es aceptable"
}

# 9. Verificar workflow de GitHub Actions
Write-Host ""
Write-Host "🔄 Verificando workflow de GitHub Actions..." -ForegroundColor Cyan
if (Test-Path "../.github/workflows/frontend-ci-cd.yml") {
    Print-Success "Workflow de GitHub Actions encontrado"
} else {
    Print-Error "Workflow frontend-ci-cd.yml no encontrado"
    exit 1
}

# 10. Verificar que no haya archivos sensibles en dist
Write-Host ""
Write-Host "🔒 Verificando archivos sensibles..." -ForegroundColor Cyan
$sensitiveFiles = @(".env", ".env.local", ".env.production", "secrets.json")
$foundSensitive = $false

foreach ($file in $sensitiveFiles) {
    if (Test-Path "dist/$file") {
        Print-Error "Archivo sensible '$file' encontrado en dist/"
        $foundSensitive = $true
    }
}

if (-not $foundSensitive) {
    Print-Success "No se encontraron archivos sensibles en dist/"
}

# 11. Resumen final
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Print-Success "TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE"
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Configura los secrets en GitHub:"
Write-Host "      - VERCEL_TOKEN"
Write-Host "      - VITE_API_URL"
Write-Host ""
Write-Host "   2. Haz commit y push a tu rama:"
Write-Host "      git add ."
Write-Host "      git commit -m 'feat: agregar CI/CD workflow para frontend'"
Write-Host "      git push"
Write-Host ""
Write-Host "   3. Crea un Pull Request a main"
Write-Host ""
Write-Host "   4. Una vez mergeado, el deploy se ejecutará automáticamente"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Cleanup
Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Cyan
Remove-Item -Path "dist" -Recurse -Force
Print-Success "Verificación completada"

# Volver al directorio raíz
Set-Location ..
