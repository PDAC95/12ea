# Cómo Verificar que "Recordarme" Está Funcionando

## ✅ Verificación Automatizada (Recomendado)

### Usando el Script de Prueba

```bash
cd backend
node test-remember-me.js
```

**Resultado esperado:**
- ✅ Token sin Remember Me: ~7 días
- ✅ Token con Remember Me: ~30 días
- ✅ Diferencia: ~23 días adicionales

---

## 🌐 Verificación Manual desde el Navegador

### Método 1: Usando la Consola del Navegador

1. **Abre http://localhost:8080/login** en tu navegador

2. **Abre las DevTools** (F12 o clic derecho → Inspeccionar)

3. **Ve a la pestaña Console**

4. **Pega este código y presiona Enter:**

```javascript
// Función para decodificar y analizar un JWT
function analyzeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  const decoded = JSON.parse(jsonPayload);
  const now = Date.now() / 1000;
  const expiresInDays = Math.floor((decoded.exp - now) / (60 * 60 * 24));
  const expiresInHours = Math.floor((decoded.exp - now) / (60 * 60));

  console.log('\n📊 ANÁLISIS DEL TOKEN:');
  console.log('━'.repeat(50));
  console.log(`👤 Usuario ID: ${decoded.id}`);
  console.log(`📧 Email: ${decoded.email}`);
  console.log(`👑 Rol: ${decoded.role}`);
  console.log(`📅 Emitido: ${new Date(decoded.iat * 1000).toLocaleString('es-MX')}`);
  console.log(`⏰ Expira: ${new Date(decoded.exp * 1000).toLocaleString('es-MX')}`);
  console.log(`⏱️  Duración: ${expiresInDays} días (${expiresInHours} horas)`);
  console.log(`✅ Verificado: ${decoded.isVerified}`);
  console.log('━'.repeat(50));

  if (expiresInDays >= 28) {
    console.log('✅ REMEMBER ME ACTIVADO - Token de larga duración (~30 días)');
  } else if (expiresInDays >= 6 && expiresInDays <= 8) {
    console.log('ℹ️  Remember Me NO activado - Token estándar (~7 días)');
  }

  return expiresInDays;
}

// Analizar el token actual en localStorage
const currentToken = localStorage.getItem('token');
if (currentToken) {
  analyzeJWT(currentToken);
} else {
  console.log('⚠️  No hay token en localStorage. Haz login primero.');
}
```

5. **Haz login SIN marcar "Recordarme"**
   - Deberías ver: `ℹ️ Remember Me NO activado - Token estándar (~7 días)`

6. **Cierra sesión y vuelve a hacer login CON "Recordarme" marcado**
   - Ejecuta de nuevo el código anterior
   - Deberías ver: `✅ REMEMBER ME ACTIVADO - Token de larga duración (~30 días)`

---

### Método 2: Inspeccionando el Token en Application/Storage

1. **Haz login** en http://localhost:8080/login

2. **Abre DevTools** → **Application** (o Storage en Firefox)

3. **En el panel izquierdo:**
   - Expande **Local Storage**
   - Click en `http://localhost:8080`

4. **Busca la clave `token`** en la tabla

5. **Copia el valor del token**

6. **Ve a https://jwt.io**

7. **Pega el token** en el campo "Encoded"

8. **En la sección "Decoded" → "PAYLOAD"** verás:
   ```json
   {
     "id": "...",
     "type": "auth",
     "email": "...",
     "role": "user",
     "isVerified": true,
     "iat": 1732650938,  // Timestamp cuando se emitió
     "exp": 1735242938   // Timestamp de expiración
   }
   ```

9. **Calcula la diferencia:**
   - `exp - iat` en segundos
   - Divide entre `86400` para obtener días
   - **Sin Remember Me:** ~7 días (604,800 segundos)
   - **Con Remember Me:** ~30 días (2,592,000 segundos)

---

## 🔬 Verificación Técnica Detallada

### Prueba con cURL

```bash
# Login SIN Remember Me
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@jappi.ca",
    "password": "Password123",
    "rememberMe": false
  }'

# Login CON Remember Me
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@jappi.ca",
    "password": "Password123",
    "rememberMe": true
  }'
```

Luego decodifica los tokens en https://jwt.io y compara las fechas `exp`.

---

## 📊 Resultados Esperados

| Escenario | Duración del Token | Expira en |
|-----------|-------------------|-----------|
| **SIN "Recordarme"** | 7 días | ~168 horas |
| **CON "Recordarme"** | 30 días | ~720 horas |
| **Diferencia** | +23 días | +552 horas |

---

## 🎯 Comportamiento en Producción

### Usuario Regular (Usuario)
- **Sin Remember Me:** Debe hacer login cada 7 días
- **Con Remember Me:** Puede usar la app por 30 días sin re-autenticarse

### Experiencia del Usuario
1. Marca "Recordarme" al hacer login
2. Cierra el navegador
3. Regresa días después
4. Sigue con sesión iniciada (si no pasaron 30 días)
5. No necesita escribir email/password de nuevo

---

## 🐛 Troubleshooting

### El token sigue expirando en 7 días aunque marque "Recordarme"

**Verificar backend:**
```bash
# En backend/src/controllers/auth.controller.js línea ~117
# Debe tener:
const { email, password, rememberMe } = req.body;
const tokenExpiration = rememberMe ? '30d' : null;
```

**Verificar frontend:**
```javascript
// En LoginForm.jsx línea ~65
// Debe tener:
const response = await authService.login(data.email, data.password, data.rememberMe);
```

### El checkbox no envía el valor

**En LoginForm.jsx verifica:**
```javascript
// Línea ~172-181
<input
  {...register('rememberMe')}  // ← Debe estar registrado
  type="checkbox"
  id="rememberMe"
/>
```

---

## ✅ Test de Aceptación

- [ ] El checkbox "Recordarme" es visible en /login
- [ ] Login sin marcar → token expira en ~7 días
- [ ] Login marcando → token expira en ~30 días
- [ ] Token se guarda correctamente en localStorage
- [ ] Usuario puede cerrar navegador y volver sin re-login (antes de 30 días)
- [ ] Script `test-remember-me.js` pasa todas las validaciones

---

**Última actualización:** 26 de noviembre de 2025
**Estado:** ✅ Funcionalidad verificada y funcionando correctamente
