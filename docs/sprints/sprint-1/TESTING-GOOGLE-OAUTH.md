# Testing Google OAuth 2.0 - Entre Amigas

## ✅ Verificación de Configuración Completada

Ejecutamos el script de diagnóstico y todas las verificaciones pasaron:
- ✅ Variables de entorno configuradas
- ✅ Credenciales de Google con formato correcto
- ✅ Passport y passport-google-oauth20 instalados
- ✅ Modelo User con campos OAuth (googleId, authProvider, profileImage)
- ✅ Configuración de Passport cargada correctamente
- ✅ Rutas de OAuth configuradas

---

## 🔧 PASO 1: Configurar Google Cloud Console

Antes de probar, **DEBES verificar** que tu Google Cloud Console tenga estos URIs configurados:

### 1.1 Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a "APIs y Servicios" → "Credenciales"
4. Haz clic en tu OAuth 2.0 Client ID

### 1.2 Configurar URIs de Redireccionamiento
En **"URIs de redireccionamiento autorizados"** DEBE estar:
```
http://localhost:8000/api/v1/auth/google/callback
```

### 1.3 Configurar Orígenes JavaScript Autorizados
En **"Orígenes de JavaScript autorizados"** DEBEN estar:
```
http://localhost:8080
http://localhost:8000
```

**⚠️ IMPORTANTE**: Si agregas o cambias URIs, Google puede tardar hasta 5 minutos en aplicar los cambios.

---

## 🚀 PASO 2: Iniciar Servidores

### 2.1 Terminal 1 - Backend
```bash
cd c:\dev\12ea\backend
npm run dev
```

**Deberías ver**:
```
🚀 Servidor corriendo en modo development
📡 Puerto: 8000
🌐 URL: http://localhost:8000
🔗 API: http://localhost:8000/api/v1
💚 Health Check: http://localhost:8000/health
```

### 2.2 Terminal 2 - Frontend
```bash
cd c:\dev\12ea\frontend
npm run dev
```

**Deberías ver**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
```

---

## 🧪 PASO 3: Probar Flujo de Google OAuth

### Test 1: Acceso Directo al Endpoint OAuth
1. Abre tu navegador en: http://localhost:8000/api/v1/auth/google
2. **Comportamiento esperado**:
   - El backend loggeará: `🔐 Iniciando flujo de Google OAuth...`
   - Deberías ser **redirigido inmediatamente** a la página de login de Google
   - La URL de Google será algo como: `https://accounts.google.com/o/oauth2/v2/auth?...`

3. **Si NO te redirige y se queda en loading**:
   - ❌ El middleware NO está llamando a `next()`
   - Verifica que [auth.controller.js:463](c:\dev\12ea\backend\src\controllers\auth.controller.js#L463) tenga `next();`

### Test 2: Flujo desde el Botón de Registro
1. Ve a: http://localhost:8080/register
2. Haz clic en el botón **"Continuar con Google"**
3. **Comportamiento esperado**:
   - Serás redirigido al endpoint del backend
   - Luego a la página de login de Google

### Test 3: Callback de Google
1. Después de seleccionar tu cuenta de Google
2. **Comportamiento esperado**:
   - Google te redirigirá a: `http://localhost:8000/api/v1/auth/google/callback?code=...`
   - El backend procesará el código
   - El backend loggeará:
     ```
     📧 Google OAuth - Perfil recibido: { id: '...', email: '...', name: '...' }
     ✅ Google OAuth exitoso para: tu@email.com
     🔀 Redirigiendo a frontend: http://localhost:8080/auth/callback?token=...
     ```
   - Serás redirigido a: `http://localhost:8080/auth/callback?token=...&needsProfile=...`

### Test 4: Callback del Frontend
1. En la página de callback del frontend
2. **Comportamiento esperado**:
   - Verás un spinner con "Procesando autenticación..."
   - Se guardará el token en localStorage
   - Después de 1.5 segundos, serás redirigido a la página principal (/)
   - Verás el mensaje "¡Autenticación exitosa!"

### Test 5: Verificar Usuario Creado en Base de Datos
Puedes verificar que el usuario se creó correctamente:

```bash
# En MongoDB Compass o mongosh:
# Buscar usuarios con authProvider = 'google'
db.users.find({ authProvider: 'google' })
```

**Deberías ver**:
```json
{
  "_id": "...",
  "fullName": "Tu Nombre Completo",
  "preferredName": "Tu Nombre",
  "email": "tu@gmail.com",
  "googleId": "1234567890...",
  "authProvider": "google",
  "profileImage": "https://lh3.googleusercontent.com/...",
  "isVerified": true,
  "isActive": true,
  "role": "user",
  "phone": null,
  "birthday": null,
  "city": null,
  "createdAt": "...",
  "lastLogin": "..."
}
```

**Observaciones**:
- ✅ `googleId` debe tener un valor
- ✅ `authProvider` debe ser `'google'`
- ✅ `isVerified` debe ser `true` (email pre-verificado)
- ✅ `profileImage` debe tener la URL de Google (si existe)
- ⚠️ `phone`, `birthday`, `city` serán `null` (se completarán después)
- ❌ NO debe tener campo `password` (es undefined para usuarios OAuth)

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Causa**: El URI de callback no está autorizado en Google Console

**Solución**:
1. Ve a Google Cloud Console
2. Verifica que `http://localhost:8000/api/v1/auth/google/callback` esté en "URIs de redireccionamiento autorizados"
3. Espera 5 minutos y vuelve a intentar

### Error: "invalid_client"
**Causa**: Client ID o Client Secret incorrectos

**Solución**:
1. Verifica que `.env` tenga las credenciales correctas
2. Reinicia el backend: `Ctrl+C` y `npm run dev`

### Error: Se queda en "loading" al hacer clic
**Causa**: El endpoint `/auth/google` no está llamando a `next()`

**Solución**:
1. Verifica [auth.controller.js:463](c:\dev\12ea\backend\src\controllers\auth.controller.js#L463)
2. Debe tener: `next();`
3. Reinicia el backend

### Error: "Error en la autenticación" en frontend
**Causa**: El backend no pudo procesar el callback de Google

**Solución**:
1. Revisa los logs del backend para ver el error exacto
2. Verifica que MongoDB esté conectado
3. Verifica que el modelo User tenga los campos OAuth

### Error: "No se recibió token de Google OAuth"
**Causa**: El callback de Google no generó el token JWT

**Solución**:
1. Verifica los logs del backend en el callback
2. Asegúrate de que `generateAuthToken()` esté funcionando
3. Verifica que `JWT_SECRET` esté en `.env`

---

## 📊 Checklist de Testing

### Backend
- [ ] Backend inicia sin errores
- [ ] Endpoint `/api/v1/auth/google` redirige a Google
- [ ] Endpoint `/api/v1/auth/google/callback` procesa callback
- [ ] Se loggea "Google OAuth exitoso" en consola
- [ ] Se genera token JWT correctamente

### Frontend
- [ ] Frontend inicia sin errores
- [ ] Botón "Continuar con Google" redirige correctamente
- [ ] Página `/auth/callback` procesa token
- [ ] Token se guarda en localStorage
- [ ] Redirección final funciona

### Base de Datos
- [ ] Usuario se crea con `authProvider: 'google'`
- [ ] Usuario tiene `googleId` poblado
- [ ] Usuario tiene `isVerified: true`
- [ ] Usuario NO tiene campo `password`
- [ ] Campo `profileImage` tiene URL de Google (si existe)

### Flujo Completo
- [ ] Puedo hacer clic en "Continuar con Google" desde `/register`
- [ ] Google me muestra la pantalla de selección de cuenta
- [ ] Después de seleccionar cuenta, soy redirigido al frontend
- [ ] Veo mensaje "¡Autenticación exitosa!"
- [ ] Soy redirigido a la página principal
- [ ] Mi sesión está activa (token en localStorage)

---

## 🎯 Próximos Pasos Después de Testing Exitoso

1. **Implementar modal de completar perfil**:
   - Cuando `needsProfile=true`, mostrar modal para capturar:
     - `phone`
     - `birthday`
     - `city`

2. **Agregar botón de Google OAuth en LoginPage**:
   - Reutilizar el mismo flujo que RegisterPage

3. **Manejo de cuentas duplicadas**:
   - Si un usuario se registró con email/password y luego intenta OAuth con el mismo email
   - Actualmente se vincula automáticamente

4. **Testing con múltiples cuentas**:
   - Probar con diferentes cuentas de Google
   - Verificar que cada una cree un usuario único

---

## 📝 Notas de Desarrollo

### Credenciales de Google OAuth
Las credenciales están configuradas en `backend/.env`:
```bash
GOOGLE_CLIENT_ID=<tu-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-<tu-client-secret>
```
**Importante**: Nunca commitear credenciales reales en el repositorio.

### Endpoints Importantes
```
OAuth Start: http://localhost:8000/api/v1/auth/google
OAuth Callback: http://localhost:8000/api/v1/auth/google/callback
Frontend Callback: http://localhost:8080/auth/callback
```

### Archivos Clave
- Backend Controller: `backend/src/controllers/auth.controller.js`
- Backend Routes: `backend/src/routes/auth.routes.js`
- Passport Config: `backend/src/config/passport.js`
- User Model: `backend/src/models/User.js`
- Frontend Callback: `frontend/src/features/auth/pages/GoogleCallbackPage.jsx`
- Frontend Routes: `frontend/src/routes/AppRoutes.jsx`

---

**Última actualización**: 2025-01-10
**Estado**: ✅ Implementación completa, listo para testing
