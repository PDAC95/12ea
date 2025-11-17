# Scripts de Verificación CI/CD

Scripts para verificar localmente que el código pase las validaciones de CI/CD antes de hacer push.

## Scripts Disponibles

### Frontend

#### 🐧 Linux/Mac: `verify-frontend-ci.sh`
```bash
cd .github/scripts
chmod +x verify-frontend-ci.sh
./verify-frontend-ci.sh
```

#### 🪟 Windows: `verify-frontend-ci.ps1`
```powershell
cd .github/scripts
.\verify-frontend-ci.ps1
```

## Qué Verifican

Ambos scripts verifican:

1. ✅ Existencia de `package.json`
2. ✅ Scripts npm requeridos (`dev`, `build`, `lint`)
3. ✅ Instalación de dependencias (`npm ci`)
4. ✅ Ejecución de ESLint sin errores
5. ✅ Variables de entorno configuradas
6. ✅ Build de producción exitoso
7. ✅ Generación de artifacts en `dist/`
8. ✅ Tamaño del bundle
9. ✅ Workflow de GitHub Actions
10. ✅ No hay archivos sensibles en el build

## Cuándo Usarlos

Ejecuta estos scripts:
- ✅ Antes de crear un Pull Request
- ✅ Después de cambios importantes en el código
- ✅ Antes de hacer merge a `main`
- ✅ Para debug de problemas de CI/CD

## Resultado Esperado

Si todo está bien, verás:
```
✅ TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE
```

Si hay errores, el script te dirá qué corregir antes de continuar.
