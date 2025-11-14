# GitHub Secrets Setup - CI/CD Backend

Esta guía te indica cómo configurar los **GitHub Secrets** necesarios para el pipeline de CI/CD del backend.

## 📋 Secrets Requeridos

Para que el workflow de GitHub Actions funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio de GitHub.

### 1. Secrets de Base de Datos

#### `MONGODB_URI`
- **Descripción**: URI de conexión a MongoDB Atlas (producción)
- **Formato**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Ejemplo**: `mongodb+srv://entreAmigas:password123@cluster0.abc123.mongodb.net/entreamigas-prod`
- **Dónde obtenerlo**: MongoDB Atlas → Clusters → Connect → Connect your application

#### `MONGODB_URI_TEST`
- **Descripción**: URI de conexión a MongoDB Atlas (testing) - opcional
- **Formato**: Mismo que `MONGODB_URI`
- **Ejemplo**: `mongodb+srv://entreAmigas:password123@cluster0.abc123.mongodb.net/entreamigas-test`
- **Nota**: Si no tienes base de datos de testing, usa la misma que producción

### 2. Secrets de Autenticación

#### `JWT_SECRET`
- **Descripción**: Secret key para generar y verificar tokens JWT
- **Formato**: String aleatorio de al menos 64 caracteres
- **Ejemplo**: `0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`
- **Cómo generar**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

### 3. Secrets de AWS S3

#### `AWS_ACCESS_KEY_ID`
- **Descripción**: Access Key ID de tu usuario de AWS
- **Formato**: String de 20 caracteres (ej: `AKIA****************`)
- **Dónde obtenerlo**: AWS Console → IAM → Users → Security credentials → Access keys

#### `AWS_SECRET_ACCESS_KEY`
- **Descripción**: Secret Access Key de tu usuario de AWS
- **Formato**: String de 40 caracteres (ej: `****************************************`)
- **Dónde obtenerlo**: Se muestra solo al crear el Access Key (guárdalo en un lugar seguro)

### 4. Secrets de Email (Resend)

#### `RESEND_API_KEY`
- **Descripción**: API Key de Resend para enviar emails
- **Formato**: String que empieza con `re_` (ej: `re_123abc456def789ghi`)
- **Dónde obtenerlo**: [Resend Dashboard](https://resend.com/api-keys) → Create API Key

### 5. Secrets de Deploy

#### `RAILWAY_TOKEN`
- **Descripción**: Token de autenticación de Railway para deployment automático
- **Formato**: String de ~200 caracteres
- **Dónde obtenerlo**:
  1. Railway Dashboard → Account Settings → Tokens
  2. Click "Create Token"
  3. Dale un nombre (ej: `GitHub Actions`)
  4. Copia el token generado
- **Nota**: Este token solo se muestra una vez, guárdalo en un lugar seguro

## 🔧 Cómo Configurar los Secrets en GitHub

### Paso 1: Ir a Settings
1. Ve a tu repositorio en GitHub
2. Click en **Settings** (pestaña superior)

### Paso 2: Acceder a Secrets
1. En el menú lateral izquierdo, busca **Secrets and variables**
2. Click en **Actions**

### Paso 3: Agregar Secrets
1. Click en **New repository secret**
2. Ingresa el **Name** (nombre exacto del secret)
3. Ingresa el **Value** (valor del secret)
4. Click en **Add secret**

### Paso 4: Repetir para cada secret
Repite el proceso para cada uno de los secrets listados arriba:
- `MONGODB_URI`
- `MONGODB_URI_TEST` (opcional)
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `RESEND_API_KEY`
- `RAILWAY_TOKEN`

## ✅ Verificar Configuración

Una vez configurados todos los secrets, puedes verificar que estén correctamente configurados:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Deberías ver una lista con todos los secrets configurados
3. No podrás ver los valores (por seguridad), pero sí los nombres

## 🚀 Activar el Workflow

Una vez configurados todos los secrets, el workflow se activará automáticamente cuando:

1. **Hagas push a main**:
   - Ejecuta lint, test, build y deploy

2. **Crees un Pull Request a main**:
   - Ejecuta lint, test y build (NO deploy)

## 🔒 Seguridad

**IMPORTANTE**:
- ❌ **NUNCA** commites los secrets en el código
- ❌ **NUNCA** compartas los secrets públicamente
- ❌ **NUNCA** uses secrets de producción en desarrollo
- ✅ Usa variables de entorno locales (`.env`) en desarrollo
- ✅ Rota los secrets periódicamente
- ✅ Usa secrets diferentes para producción y testing

## 📞 Soporte

Si tienes problemas configurando los secrets:
1. Verifica que los nombres sean exactamente iguales a los listados arriba
2. Verifica que los valores no tengan espacios al inicio o al final
3. Revisa los logs del workflow en GitHub Actions para ver el error específico

## 🔄 Actualizar Secrets

Para actualizar un secret:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en el nombre del secret que quieres actualizar
3. Click en **Update secret**
4. Ingresa el nuevo valor
5. Click en **Update secret**

---

**Última actualización**: 2025-11-14
