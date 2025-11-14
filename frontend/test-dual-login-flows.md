# Testing Manual - Sprint 3.5 FE-4: Dual Login System

**Fecha:** 2025-11-14
**Tester:** Frontend Developer
**URLs de testing:**
- Frontend: http://localhost:8081
- Backend: http://localhost:8000

**Usuarios de prueba:**
- User regular: `maria.garcia@example.com` / `Password123`
- Admin: `dev@jappi.ca` / `Password123`

---

## 📋 Checklist de Testing

### ✅ Flujo 1: Usuario Regular - Login Exitoso

**URL:** http://localhost:8081/login

**Pasos:**
1. [ ] Navegar a `/login`
2. [ ] Ingresar email: `maria.garcia@example.com`
3. [ ] Ingresar password: `Password123`
4. [ ] Click en "Iniciar Sesión"
5. [ ] Esperar loading state
6. [ ] Verificar redirección a `/dashboard`

**Verificaciones:**
- [ ] ✅ Redirige a `/dashboard` (URL cambió)
- [ ] ✅ localStorage tiene `token` (DevTools → Application → Local Storage)
- [ ] ✅ localStorage tiene `user` (debe ser objeto JSON)
- [ ] ✅ `user.role === 'user'` (inspeccionar objeto user)
- [ ] ✅ No hay errores en consola (DevTools → Console)
- [ ] ✅ Dashboard muestra nombre del usuario

**Cleanup:**
- [ ] Click en "Cerrar Sesión" para logout
- [ ] Verificar que localStorage se limpió

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 2: Admin Intenta Login en Página de Usuarios

**URL:** http://localhost:8081/login

**Pasos:**
1. [ ] Navegar a `/login`
2. [ ] Ingresar email: `dev@jappi.ca`
3. [ ] Ingresar password: `Password123`
4. [ ] Click en "Iniciar Sesión"
5. [ ] Esperar loading state

**Verificaciones:**
- [ ] ✅ NO redirige (se queda en `/login`)
- [ ] ✅ Muestra mensaje de error: "Parece que tienes una cuenta de administradora. Por favor usa el panel de administración."
- [ ] ✅ NO hay `token` en localStorage
- [ ] ✅ NO hay `user` en localStorage
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ Mensaje de error es claro y visible

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 3: Admin - Login Exitoso en Admin

**URL:** http://localhost:8081/admin/login

**Pasos:**
1. [ ] Navegar a `/admin/login`
2. [ ] Verificar diseño oscuro/corporativo (diferente a `/login`)
3. [ ] Ingresar email: `dev@jappi.ca`
4. [ ] Ingresar password: `Password123`
5. [ ] Click en "Ingresar al Panel Admin"
6. [ ] Esperar loading state "Verificando acceso..."
7. [ ] Verificar redirección a `/admin/dashboard`

**Verificaciones:**
- [ ] ✅ Diseño oscuro (gris-900) visible
- [ ] ✅ Shield icon visible
- [ ] ✅ Título "Panel de Administración" visible
- [ ] ✅ Redirige a `/admin/dashboard`
- [ ] ✅ localStorage tiene `token`
- [ ] ✅ localStorage tiene `user`
- [ ] ✅ `user.role === 'admin'` (inspeccionar objeto)
- [ ] ✅ No hay errores en consola
- [ ] ✅ Admin dashboard carga correctamente

**Cleanup:**
- [ ] Click en logout desde admin dashboard
- [ ] Verificar localStorage limpiado

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 4: Usuario Regular Intenta Login en Admin

**URL:** http://localhost:8081/admin/login

**Pasos:**
1. [ ] Navegar a `/admin/login`
2. [ ] Ingresar email: `maria.garcia@example.com`
3. [ ] Ingresar password: `Password123`
4. [ ] Click en "Ingresar al Panel Admin"
5. [ ] Esperar loading state

**Verificaciones:**
- [ ] ✅ NO redirige (se queda en `/admin/login`)
- [ ] ✅ Muestra mensaje: "Acceso denegado. Esta cuenta no tiene permisos de administrador."
- [ ] ✅ NO hay `token` en localStorage
- [ ] ✅ NO hay `user` en localStorage
- [ ] ✅ No hay errores en consola
- [ ] ✅ Mensaje de error claro con icono AlertCircle

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 5: Protección de Rutas Admin

**Escenario A: Sin autenticación**

**Pasos:**
1. [ ] Limpiar localStorage completamente
2. [ ] Navegar directamente a: `http://localhost:8081/admin/dashboard`

**Verificaciones:**
- [ ] ✅ Redirige a `/login` o `/admin/login`
- [ ] ✅ Muestra mensaje apropiado
- [ ] ✅ No puede acceder al dashboard

---

**Escenario B: Como usuario regular**

**Pasos:**
1. [ ] Login como user regular en `/login`
2. [ ] Una vez autenticado, navegar a: `http://localhost:8081/admin/dashboard`

**Verificaciones:**
- [ ] ✅ Redirige a `/dashboard` (su propio dashboard)
- [ ] ✅ O muestra mensaje "No tienes permisos"
- [ ] ✅ NO puede acceder a admin dashboard
- [ ] ✅ No hay errores en consola

**Cleanup:** Logout

---

**Escenario C: Como admin**

**Pasos:**
1. [ ] Login como admin en `/admin/login`
2. [ ] Navegar a: `http://localhost:8081/admin/dashboard`

**Verificaciones:**
- [ ] ✅ Puede acceder sin problemas
- [ ] ✅ Dashboard carga correctamente
- [ ] ✅ Sidebar de admin visible
- [ ] ✅ No hay errores

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 6: Responsive y UX

**Pasos:**
1. [ ] Abrir DevTools (F12)
2. [ ] Activar modo responsive (Ctrl+Shift+M)
3. [ ] Cambiar viewport a iPhone 12 Pro (390x844)

**Testing en `/login`:**
- [ ] ✅ Se ve bien en 390px width
- [ ] ✅ Formulario es usable
- [ ] ✅ Botones tienen buen tamaño para touch (min 44px)
- [ ] ✅ No hay overflow horizontal
- [ ] ✅ Texto legible sin zoom
- [ ] ✅ Card se adapta correctamente

**Testing en `/admin/login`:**
- [ ] ✅ Se ve bien en 390px width
- [ ] ✅ Diseño oscuro se mantiene
- [ ] ✅ Formulario usable en móvil
- [ ] ✅ Shield icon visible
- [ ] ✅ Botones touch-friendly
- [ ] ✅ No hay overflow

**Testing en Desktop (1920px):**
- [ ] ✅ `/login` centrado y bien proporcionado
- [ ] ✅ `/admin/login` centrado y bien proporcionado
- [ ] ✅ No hay elementos demasiado anchos

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

### ✅ Flujo 7: Estados de Loading y Error

**Testing en `/login`:**

**Escenario A: Credenciales incorrectas**
1. [ ] Ingresar email: `fake@test.com`
2. [ ] Ingresar password: `wrongpassword`
3. [ ] Click en "Iniciar Sesión"

**Verificaciones:**
- [ ] ✅ Botón muestra loading state (spinner + "Iniciando sesión...")
- [ ] ✅ Botón está disabled mientras carga
- [ ] ✅ Mensaje de error se muestra: "Credenciales inválidas..."
- [ ] ✅ Error es visible y claro (fondo rojo suave)
- [ ] ✅ No hay errores en consola

---

**Escenario B: Admin en login de users**
1. [ ] Ingresar email: `dev@jappi.ca`
2. [ ] Ingresar password: `Password123`
3. [ ] Click en "Iniciar Sesión"

**Verificaciones:**
- [ ] ✅ Loading state visible
- [ ] ✅ Mensaje específico: "Parece que tienes una cuenta de administradora..."
- [ ] ✅ Error claro y diferenciado

---

**Testing en `/admin/login`:**

**Escenario C: Credenciales incorrectas**
1. [ ] Ingresar email: `fake@admin.com`
2. [ ] Ingresar password: `wrongpassword`
3. [ ] Click en "Ingresar al Panel Admin"

**Verificaciones:**
- [ ] ✅ Botón muestra: "Verificando acceso..." con spinner
- [ ] ✅ Mensaje de error visible con icono AlertCircle
- [ ] ✅ Error tiene estilo oscuro apropiado (red-500/10)

---

**Escenario D: User regular en admin login**
1. [ ] Ingresar email: `maria.garcia@example.com`
2. [ ] Ingresar password: `Password123`
3. [ ] Click en "Ingresar al Panel Admin"

**Verificaciones:**
- [ ] ✅ Loading state visible
- [ ] ✅ Mensaje específico: "Acceso denegado..."
- [ ] ✅ Error claro con icono

**Status:** [ ] PASS / [ ] FAIL
**Notas:**

---

## 📊 RESUMEN FINAL

### Checklist General

- [ ] Los 7 flujos probados exitosamente
- [ ] No hay errores en consola del navegador
- [ ] No hay warnings en consola
- [ ] Responsive funciona (móvil + desktop)
- [ ] Loading states funcionan correctamente
- [ ] Mensajes de error son claros y específicos
- [ ] Redirecciones correctas en todos los casos

### Estadísticas

**Total Flujos:** 7
**Flujos PASS:** ___
**Flujos FAIL:** ___
**% Success:** ___

### Bugs Encontrados

1. **[Severidad]** Descripción del bug
   - Pasos para reproducir
   - Comportamiento esperado
   - Comportamiento actual

### Notas Adicionales

-
-
-

---

## ✅ APROBACIÓN

**Testing completado:** [ ] SÍ / [ ] NO
**Sistema listo para producción:** [ ] SÍ / [ ] NO
**Firma:** _______________
**Fecha:** _______________

---

**END OF TESTING DOCUMENT**
