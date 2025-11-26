# Tests Manuales - Funcionalidad "Recordarme"

## 📋 Pre-requisitos

Antes de iniciar los tests, asegúrate de que:

- [ ] Backend está corriendo en `http://localhost:8000` (ejecuta `npm run dev` en `/backend`)
- [ ] Frontend está corriendo en `http://localhost:8080` (ejecuta `npm run dev` en `/frontend`)
- [ ] Tienes credenciales válidas: `dev@jappi.ca` / `Password123`
- [ ] Tienes un navegador con DevTools (Chrome, Firefox, Edge)

---

## 🧪 TEST 1: Login SIN "Recordarme" (Token de 7 días)

### Objetivo
Verificar que cuando el usuario NO marca el checkbox, el token expira en 7 días.

### Pasos

1. **Abre el navegador en modo incógnito**
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`

2. **Navega a** http://localhost:8080/login

3. **Verifica que el checkbox está visible**
   - Debe decir: "Recordarme (mantener sesión por 30 días)"
   - El checkbox debe estar desmarcado por defecto

4. **Ingresa las credenciales:**
   - Email: `dev@jappi.ca`
   - Password: `Password123`
   - **NO marques** el checkbox "Recordarme" ❌

5. **Haz clic en "Iniciar Sesión"**

6. **Deberías ser redirigido a** http://localhost:8080/dashboard

7. **Abre DevTools:**
   - Presiona `F12` o clic derecho → "Inspeccionar"

8. **Ve a la pestaña "Console"**

9. **Pega y ejecuta este código:**

```javascript
const token = localStorage.getItem('token');
if (!token) {
  console.log('❌ ERROR: No hay token en localStorage');
} else {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const emitido = new Date(decoded.iat * 1000);
  const expira = new Date(decoded.exp * 1000);
  const dias = Math.floor((decoded.exp - decoded.iat) / 86400);

  console.log('━'.repeat(60));
  console.log('📊 ANÁLISIS DEL TOKEN - TEST 1');
  console.log('━'.repeat(60));
  console.log('👤 Usuario:', decoded.email);
  console.log('📅 Emitido:', emitido.toLocaleString('es-MX'));
  console.log('⏰ Expira:', expira.toLocaleString('es-MX'));
  console.log('⏱️  Duración:', dias, 'días');
  console.log('━'.repeat(60));

  if (dias >= 6 && dias <= 8) {
    console.log('✅ TEST 1 PASADO: Token expira en ~7 días (SIN Remember Me)');
  } else {
    console.log('❌ TEST 1 FALLADO: Token expira en', dias, 'días (esperado: 7 días)');
  }
  console.log('━'.repeat(60));
}
```

### ✅ Criterios de Éxito

- [ ] El código se ejecuta sin errores
- [ ] La consola muestra: **"Duración: 7 días"** (puede ser 6-8 días)
- [ ] La consola muestra: **"✅ TEST 1 PASADO"**
- [ ] No hay errores en rojo en la consola

### 📸 Evidencia

Toma un screenshot de la consola mostrando el mensaje "✅ TEST 1 PASADO"

---

## 🧪 TEST 2: Login CON "Recordarme" (Token de 30 días)

### Objetivo
Verificar que cuando el usuario marca el checkbox, el token expira en 30 días.

### Pasos

1. **Cierra sesión:**
   - Click en el botón "Cerrar Sesión" en el dashboard
   - Deberías volver a http://localhost:8080/login

2. **Ingresa las credenciales:**
   - Email: `dev@jappi.ca`
   - Password: `Password123`
   - **SÍ marca** el checkbox "Recordarme" ✅

3. **Haz clic en "Iniciar Sesión"**

4. **Deberías ser redirigido a** http://localhost:8080/dashboard

5. **Abre DevTools** (F12) y ve a "Console"

6. **Pega y ejecuta este código:**

```javascript
const token = localStorage.getItem('token');
if (!token) {
  console.log('❌ ERROR: No hay token en localStorage');
} else {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const emitido = new Date(decoded.iat * 1000);
  const expira = new Date(decoded.exp * 1000);
  const dias = Math.floor((decoded.exp - decoded.iat) / 86400);

  console.log('━'.repeat(60));
  console.log('📊 ANÁLISIS DEL TOKEN - TEST 2');
  console.log('━'.repeat(60));
  console.log('👤 Usuario:', decoded.email);
  console.log('📅 Emitido:', emitido.toLocaleString('es-MX'));
  console.log('⏰ Expira:', expira.toLocaleString('es-MX'));
  console.log('⏱️  Duración:', dias, 'días');
  console.log('━'.repeat(60));

  if (dias >= 29 && dias <= 31) {
    console.log('✅ TEST 2 PASADO: Token expira en ~30 días (CON Remember Me)');
  } else {
    console.log('❌ TEST 2 FALLADO: Token expira en', dias, 'días (esperado: 30 días)');
  }
  console.log('━'.repeat(60));
}
```

### ✅ Criterios de Éxito

- [ ] El código se ejecuta sin errores
- [ ] La consola muestra: **"Duración: 30 días"** (puede ser 29-31 días)
- [ ] La consola muestra: **"✅ TEST 2 PASADO"**
- [ ] No hay errores en rojo en la consola

### 📸 Evidencia

Toma un screenshot de la consola mostrando el mensaje "✅ TEST 2 PASADO"

---

## 🧪 TEST 3: Persistencia del Token

### Objetivo
Verificar que el token persiste en localStorage después de cerrar el navegador.

### Pasos

1. **Con la sesión iniciada desde TEST 2**, abre DevTools (F12)

2. **Ve a la pestaña "Application"** (Chrome) o "Storage" (Firefox)

3. **En el panel izquierdo:**
   - Expande "Local Storage"
   - Haz clic en `http://localhost:8080`

4. **Busca la clave `token` en la tabla**

5. **Copia el valor completo del token** (será una cadena larga como `eyJhbGci...`)

6. **Guarda este token en un archivo de texto temporal**

7. **Cierra COMPLETAMENTE el navegador**
   - No solo la pestaña, sino toda la ventana del navegador
   - En Windows: Asegúrate de cerrar todos los procesos del navegador desde el Task Manager si es necesario

8. **Espera 10 segundos**

9. **Abre el navegador de nuevo** (NO en modo incógnito esta vez)

10. **Ve DIRECTAMENTE a** http://localhost:8080/dashboard (sin hacer login)

11. **Abre DevTools → Application → Local Storage → http://localhost:8080**

12. **Compara el token actual con el que copiaste en el paso 5**

### ✅ Criterios de Éxito

- [ ] El token sigue existiendo en localStorage después de cerrar el navegador
- [ ] El token es **idéntico** al que copiaste antes de cerrar el navegador
- [ ] Puedes acceder al dashboard sin necesidad de hacer login nuevamente
- [ ] No fuiste redirigido a `/login`

### 📸 Evidencia

Toma dos screenshots:
1. LocalStorage mostrando el token ANTES de cerrar el navegador
2. LocalStorage mostrando el MISMO token DESPUÉS de cerrar y abrir el navegador

---

## 🧪 TEST 4: Visibilidad del Checkbox

### Objetivo
Verificar que el checkbox es visible, accesible y funcional.

### Pasos

1. **Abre** http://localhost:8080/login en modo normal (no incógnito)

2. **Cierra sesión** si estás logueado

3. **Inspecciona visualmente el formulario de login**

4. **Verifica que el checkbox tiene:**
   - [ ] El texto "Recordarme (mantener sesión por 30 días)"
   - [ ] Un checkbox clicable a la izquierda del texto
   - [ ] El checkbox está desmarcado por defecto
   - [ ] El checkbox NO está deshabilitado (no está en gris)

5. **Haz clic en el checkbox 3 veces:**
   - Click 1: Se marca ✅
   - Click 2: Se desmarca ❌
   - Click 3: Se marca ✅

6. **Verifica que el estado visual cambia** (checkmark aparece/desaparece)

7. **Haz clic derecho en el checkbox → "Inspeccionar elemento"**

8. **En el HTML, verifica que tiene:**
   ```html
   <input
     type="checkbox"
     id="rememberMe"
     class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
   />
   ```

### ✅ Criterios de Éxito

- [ ] El checkbox es visible
- [ ] El texto explicativo "(mantener sesión por 30 días)" está presente
- [ ] El checkbox responde a clicks (marca/desmarca)
- [ ] El checkbox tiene el ID `rememberMe`
- [ ] El checkbox NO está disabled

### 📸 Evidencia

Toma un screenshot del formulario de login mostrando el checkbox marcado

---

## 🧪 TEST 5: Comparación de Tokens

### Objetivo
Comparar directamente los tokens generados con y sin Remember Me.

### Pasos

1. **Ejecuta TEST 1** (sin Remember Me) y **guarda el token** que aparece en la consola

2. **Ejecuta TEST 2** (con Remember Me) y **guarda este token también**

3. **Ve a** https://jwt.io

4. **Pega el primer token** (sin Remember Me) en el campo "Encoded"

5. **En la sección "Decoded" → PAYLOAD, anota:**
   - `iat` (issued at): _______________
   - `exp` (expires at): _______________

6. **Calcula:** `(exp - iat) / 86400` = ______ días

7. **Repite los pasos 4-6 con el segundo token** (con Remember Me)

8. **Compara:**

| Token | iat | exp | Días |
|-------|-----|-----|------|
| SIN Remember Me | _______ | _______ | ~7 días |
| CON Remember Me | _______ | _______ | ~30 días |

### ✅ Criterios de Éxito

- [ ] Token sin Remember Me: `(exp - iat) / 86400` ≈ 7 días
- [ ] Token con Remember Me: `(exp - iat) / 86400` ≈ 30 días
- [ ] La diferencia entre ambos es de aproximadamente 23 días

### 📸 Evidencia

Toma screenshots de jwt.io mostrando ambos tokens decodificados

---

## 📊 PLANTILLA DE REPORTE

Después de completar todos los tests, llena este reporte:

```markdown
# REPORTE DE TESTS MANUALES - REMEMBER ME

**Fecha:** [Fecha actual]
**Ejecutado por:** [Tu nombre]
**Navegador:** [Chrome/Firefox/Edge] - Versión: [versión]

## Resultados

### TEST 1: Login sin Remember Me
- [ ] ✅ Pasó
- [ ] ❌ Falló
- **Duración del token:** _____ días
- **Screenshot:** [adjuntar]
- **Notas:** _______________________

### TEST 2: Login con Remember Me
- [ ] ✅ Pasó
- [ ] ❌ Falló
- **Duración del token:** _____ días
- **Screenshot:** [adjuntar]
- **Notas:** _______________________

### TEST 3: Persistencia del Token
- [ ] ✅ Pasó
- [ ] ❌ Falló
- **Token persiste:** Sí / No
- **Screenshot ANTES:** [adjuntar]
- **Screenshot DESPUÉS:** [adjuntar]
- **Notas:** _______________________

### TEST 4: Visibilidad del Checkbox
- [ ] ✅ Pasó
- [ ] ❌ Falló
- **Checkbox funcional:** Sí / No
- **Texto visible:** Sí / No
- **Screenshot:** [adjuntar]
- **Notas:** _______________________

### TEST 5: Comparación de Tokens
- [ ] ✅ Pasó
- [ ] ❌ Falló
- **Token 1 (sin RM):** _____ días
- **Token 2 (con RM):** _____ días
- **Diferencia:** _____ días
- **Screenshots jwt.io:** [adjuntar]
- **Notas:** _______________________

## Veredicto Final

- **Tests pasados:** ____/5
- **Tests fallados:** ____/5
- **Estado:** ✅ APROBADO / ❌ RECHAZADO

## Observaciones Adicionales

[Agregar cualquier observación, bug encontrado, o sugerencia de mejora]

```

---

## ❓ Troubleshooting

### Problema: "No hay token en localStorage"

**Solución:**
- Verifica que hiciste login correctamente
- Verifica que fuiste redirigido a `/dashboard`
- Revisa la pestaña Network en DevTools para ver si la request de login fue exitosa (200 OK)

### Problema: El código JavaScript da error

**Solución:**
- Asegúrate de estar en la pestaña "Console" de DevTools
- Copia el código completo, incluyendo las llaves `{}`
- Presiona Enter después de pegar el código

### Problema: El token no persiste después de cerrar el navegador

**Solución:**
- NO uses modo incógnito para TEST 3 (modo incógnito borra localStorage al cerrar)
- Verifica que cerraste TODAS las ventanas del navegador, no solo una pestaña
- En Chrome, verifica que no tienes activada la opción "Clear cookies and site data when you close all windows"

### Problema: El checkbox no está visible

**Solución:**
- Verifica que el frontend está corriendo (`npm run dev` en `/frontend`)
- Refresca la página (Ctrl + F5)
- Verifica que no hay errores en la consola del navegador

---

## 📞 Soporte

Si encuentras algún problema durante los tests, verifica:
1. Backend corriendo: http://localhost:8000/health
2. Frontend corriendo: http://localhost:8080
3. Consola del navegador sin errores
4. Credenciales correctas: `dev@jappi.ca` / `Password123`

---

**Última actualización:** 26 de noviembre de 2025
**Versión:** 1.0
