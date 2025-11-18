# 🔧 Configuración de Variables de Entorno en Vercel

**Fecha:** 18 de Noviembre, 2025
**Task:** US-5.2.3 - Actualizar Frontend para Usar API Correcta

---

## 📋 Variables de Entorno Requeridas

### **VITE_API_URL** (CRÍTICO)

**Valor de Producción:**
```
https://api.entreamigas.ca/api/v1
```

**Descripción:**
URL base del backend API. Esta variable es usada por:
- Axios instance en `src/shared/utils/api.js`
- Google OAuth button en `LoginForm.jsx` y `RegisterForm.jsx`
- Todos los llamados a la API

**Sin esta variable:**
- ❌ Google OAuth no funcionará
- ❌ Login/registro fallará
- ❌ Ningún endpoint de API funcionará

---

### **VITE_FRONTEND_URL** (Opcional)

**Valor de Producción:**
```
https://entreamigas.ca
```

**Descripción:**
URL del frontend. Puede ser usada para redirects o links.

---

### **VITE_APP_NAME** (Opcional)

**Valor:**
```
Entre Amigas
```

**Descripción:**
Nombre de la aplicación usado en títulos y metadata.

---

### **VITE_ENV** (Opcional)

**Valor de Producción:**
```
production
```

**Descripción:**
Entorno de ejecución. Usado para lógica condicional.

---

## 🚀 Cómo Configurar en Vercel

### **Opción 1: Vercel Dashboard (Web)**

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Click en tu proyecto "Entre Amigas Frontend"
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://api.entreamigas.ca/api/v1` | Production |
| `VITE_FRONTEND_URL` | `https://entreamigas.ca` | Production |
| `VITE_APP_NAME` | `Entre Amigas` | All |
| `VITE_ENV` | `production` | Production |

5. Click **Save**
6. **IMPORTANTE:** Redeploy el proyecto para que las variables surtan efecto

---

### **Opción 2: Vercel CLI**

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Login a Vercel
vercel login

# Setear variables de entorno
vercel env add VITE_API_URL production
# Cuando pregunte el valor, pega: https://api.entreamigas.ca/api/v1

vercel env add VITE_FRONTEND_URL production
# Cuando pregunte el valor, pega: https://entreamigas.ca

vercel env add VITE_APP_NAME
# Cuando pregunte el valor, pega: Entre Amigas

vercel env add VITE_ENV production
# Cuando pregunte el valor, pega: production

# Redeploy
vercel --prod
```

---

## ✅ Verificación Post-Configuración

Después de configurar y redeploy, verifica:

### **1. Verificar que las variables se aplicaron:**

Abre la consola del navegador en https://entreamigas.ca y ejecuta:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
// Debería mostrar: https://api.entreamigas.ca/api/v1
```

### **2. Probar Google OAuth:**

1. Ve a https://entreamigas.ca/login
2. Click en "Continuar con Google"
3. Debería redirigir a: `https://api.entreamigas.ca/api/v1/auth/google`
4. Si redirige a `localhost` o `undefined`, las variables NO están configuradas

### **3. Probar Login Normal:**

1. Intenta hacer login con credenciales válidas
2. Abre Network tab en DevTools
3. Verifica que los requests vayan a `https://api.entreamigas.ca/api/v1/auth/login`
4. Si van a localhost, las variables NO están configuradas

---

## 🐛 Troubleshooting

### **Problema: Variables no se aplican después de configurarlas**

**Solución:**
1. Las variables de entorno solo se aplican en el **BUILD time**, no en runtime
2. Debes hacer un **redeploy** después de agregar/modificar variables
3. En Vercel Dashboard → Deployments → Click en los 3 puntos → "Redeploy"

### **Problema: Google OAuth sigue redirigiendo a localhost**

**Solución:**
1. Verifica que `VITE_API_URL` esté configurada en **Production** environment
2. Haz un redeploy forzado (no solo un push)
3. Limpia cache del navegador y recarga la página

### **Problema: API requests fallan con CORS error**

**Solución:**
1. Verifica que el backend (Railway) tenga configurado CORS para permitir `https://entreamigas.ca`
2. En `backend/.env` debe haber: `FRONTEND_URL=https://entreamigas.ca`
3. El backend debe usar `cors({ origin: process.env.FRONTEND_URL })`

---

## 📝 Archivos Modificados (Task 5.2.3)

### **✅ Creados:**
- `frontend/src/shared/config/constants.js` - Constantes centralizadas

### **✅ Modificados:**
- `frontend/src/shared/utils/api.js` - Usa `API_URL` de constants
- `frontend/src/features/auth/components/LoginForm.jsx` - OAuth button usa `API_URL`
- `frontend/src/features/auth/components/RegisterForm.jsx` - OAuth button usa `API_URL`
- `frontend/.env.example` - Documentadas todas las variables

---

## 🎯 Criterios de Éxito (Task 5.2.3)

- [x] Botón de Google OAuth apunta a `https://api.entreamigas.ca/api/v1/auth/google` ✅
- [ ] Variable `VITE_API_URL` configurada correctamente en Vercel (PENDIENTE - usuario debe hacerlo)
- [x] No hay referencias hardcoded a localhost ✅
- [x] Código usa constante centralizada `API_URL` ✅

---

**Próximo Paso:** Configurar las variables en Vercel y hacer redeploy para completar Task 5.2.3
