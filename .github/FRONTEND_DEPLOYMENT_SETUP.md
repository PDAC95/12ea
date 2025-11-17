# Frontend CI/CD - Configuración de Deployment

## GitHub Secrets Requeridos

Para que el workflow de CI/CD del frontend funcione correctamente, debes configurar los siguientes secrets en GitHub:

### Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a: **Settings** > **Secrets and variables** > **Actions**
3. Click en **New repository secret**
4. Agrega los siguientes secrets:

### Secrets Necesarios

#### 1. VITE_API_URL
```
Nombre: VITE_API_URL
Valor: https://entre-amigas-backend.up.railway.app/api
```

**Descripción:** URL base del API backend. Se usa durante el build de Vite.

#### 2. VERCEL_TOKEN
```
Nombre: VERCEL_TOKEN
Valor: [Tu Vercel Token]
```

**Cómo obtener tu Vercel Token:**

1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click en **Create Token**
3. Dale un nombre descriptivo (ej: `github-actions-entre-amigas`)
4. Selecciona el scope apropiado (Full Account)
5. Copia el token generado
6. Pégalo en GitHub Secrets

#### 3. VERCEL_ORG_ID (Opcional pero recomendado)
```
Nombre: VERCEL_ORG_ID
Valor: [Tu Vercel Org ID]
```

**Cómo obtener tu Vercel Org ID:**

1. En tu proyecto Vercel, ve a Settings
2. Copia el `org_id` o ejecuta en local:
```bash
cd frontend
vercel link
cat .vercel/project.json
```

#### 4. VERCEL_PROJECT_ID (Opcional pero recomendado)
```
Nombre: VERCEL_PROJECT_ID
Valor: [Tu Vercel Project ID]
```

**Cómo obtener tu Vercel Project ID:**

1. En tu proyecto Vercel, ve a Settings
2. Copia el `project_id` o ejecuta en local:
```bash
cd frontend
vercel link
cat .vercel/project.json
```

---

## Configuración Alternativa: Netlify

Si prefieres usar Netlify en lugar de Vercel, reemplaza el job `deploy` en `.github/workflows/frontend-ci-cd.yml`:

```yaml
  deploy:
    name: Deploy to Netlify
    runs-on: ubuntu-latest
    needs: [lint, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: frontend-build
          path: frontend/dist

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: './frontend/dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: true
          enable-commit-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Deployment notification
        if: success()
        run: |
          echo "✅ Frontend deployed successfully to Netlify!"
          echo "🚀 Check your deployment at Netlify dashboard"
```

### Secrets para Netlify:

#### NETLIFY_AUTH_TOKEN
1. Ve a [Netlify User Settings](https://app.netlify.com/user/applications)
2. En **Personal access tokens**, click **New access token**
3. Dale un nombre y copia el token
4. Agrégalo a GitHub Secrets

#### NETLIFY_SITE_ID
1. Ve a tu sitio en Netlify
2. Navega a **Site settings** > **General** > **Site details**
3. Copia el **API ID**
4. Agrégalo a GitHub Secrets

---

## Verificación del Workflow

### Triggers del Workflow

El workflow se ejecuta automáticamente cuando:

1. **Push a `main`**: Ejecuta lint, build y deploy
2. **Pull Request a `main`**: Ejecuta lint y build (sin deploy)
3. **Cambios en `frontend/**`**: Solo si hay cambios en el directorio frontend
4. **Cambios en el workflow**: Si modificas `.github/workflows/frontend-ci-cd.yml`

### Jobs del Workflow

1. **lint**: Ejecuta ESLint para verificar calidad de código
2. **build**: Compila el proyecto con Vite y guarda artifacts
3. **deploy**: Deploy a Vercel/Netlify (solo en push a main)
4. **notify**: Envía notificaciones del resultado

### Build Artifacts

Los artifacts del build se guardan por 7 días y pueden descargarse desde:
- GitHub Actions > Tu workflow run > Artifacts

### Probar el Workflow

1. **Crear una rama de prueba:**
```bash
git checkout -b test/ci-cd-frontend
```

2. **Hacer un cambio menor:**
```bash
echo "// Test CI/CD" >> frontend/src/App.jsx
git add frontend/src/App.jsx
git commit -m "test: verificar CI/CD del frontend"
```

3. **Push y crear PR:**
```bash
git push origin test/ci-cd-frontend
```

4. **Verificar en GitHub:**
   - Ve a **Actions** en tu repositorio
   - Verás el workflow ejecutándose
   - Verifica que lint y build pasan

5. **Merge a main para deploy:**
   - Una vez que el PR pase todas las verificaciones
   - Haz merge a `main`
   - El workflow ejecutará el deploy automáticamente

---

## Monitoreo y Debugging

### Ver logs del workflow:
1. Ve a **Actions** en GitHub
2. Click en el workflow run
3. Click en el job que quieres ver (lint, build, deploy)
4. Expande los steps para ver logs detallados

### Errores comunes:

#### Error: ESLint failed
```
Solución: Ejecuta `npm run lint` localmente y corrige los errores
```

#### Error: Build failed
```
Solución: Ejecuta `npm run build` localmente y verifica errores
```

#### Error: Vercel deployment failed
```
Solución: Verifica que VERCEL_TOKEN esté configurado correctamente
```

#### Error: VITE_API_URL no está definida
```
Solución: Agrega el secret VITE_API_URL en GitHub
```

---

## Variables de Entorno en Vercel

Además de los secrets en GitHub, configura las variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** > **Environment Variables**
3. Agrega:
   - `VITE_API_URL`: URL de tu backend de producción

---

## Checklist de Configuración

- [ ] Crear cuenta en Vercel (o Netlify)
- [ ] Vincular repositorio de GitHub con Vercel
- [ ] Obtener Vercel Token
- [ ] Configurar `VERCEL_TOKEN` en GitHub Secrets
- [ ] Configurar `VITE_API_URL` en GitHub Secrets
- [ ] Configurar variables de entorno en Vercel
- [ ] Hacer push a main para probar deployment
- [ ] Verificar que el sitio esté live en Vercel

---

## Resultado Esperado

Una vez configurado correctamente:

1. ✅ Cada push a `main` ejecuta el workflow completo
2. ✅ ESLint verifica calidad de código
3. ✅ Vite compila el proyecto sin errores
4. ✅ Los artifacts se guardan por 7 días
5. ✅ Deploy automático a Vercel
6. ✅ Notificaciones del resultado en Actions

**URL del sitio:** Se generará automáticamente en Vercel (ej: `entre-amigas.vercel.app`)
