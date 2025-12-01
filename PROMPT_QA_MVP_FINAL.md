# PROMPT QA - VALIDACIÓN FINAL MVP ENTRE AMIGAS

**Fecha:** 2025-01-01
**Objetivo:** Validación completa del MVP antes de marcar como COMPLETADO
**Duración estimada:** 3-4 horas

---

## CONTEXTO DEL MVP

**Entre Amigas** es una plataforma comunitaria para mujeres latinas en Canadá que conecta, apoya y empodera a través de:
- Sistema de autenticación con verificación de email
- Gestión de perfil de usuario
- Módulo de Eventos comunitarios
- Módulo de Negocios de emprendedoras
- Módulo de Servicios profesionales
- Módulo de Blog con artículos
- Módulo de Tips Comunitarios (nuevo)
- Panel administrativo completo

---

## STACK TECNOLÓGICO

### Backend:
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express-Validator
- Resend (emails)
- Cloudinary (imágenes)

### Frontend:
- React 18 + Vite
- React Router v6
- TailwindCSS
- React Hook Form + Yup
- Axios
- date-fns

### URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/v1

### Credenciales de Prueba:
- **Admin:** dev@jappi.ca / Password123
- **Usuario Test:** (crear uno nuevo durante testing)

---

## MÓDULOS A VALIDAR

### ✅ MÓDULO 1: AUTENTICACIÓN Y SEGURIDAD

#### 1.1 Registro de Usuario
**URL:** http://localhost:5173/register

**Tests:**
- [ ] Formulario visible con todos los campos
- [ ] Validación frontend: campos requeridos
- [ ] Validación frontend: email formato válido
- [ ] Validación frontend: password min 8 caracteres
- [ ] Validación frontend: confirmación de password coincide
- [ ] Checkbox "Remember Me" visible y funcional
- [ ] Registro exitoso → toast success → redirect a /verify-email
- [ ] Email de verificación recibido (revisar inbox)
- [ ] Link de verificación en email funciona
- [ ] Después de verificar → redirect a /login

**Validaciones Backend:**
- [ ] Email duplicado → error 400 "Email ya está registrado"
- [ ] Password débil → error 400
- [ ] Email inválido → error 400

#### 1.2 Login
**URL:** http://localhost:5173/login

**Tests:**
- [ ] Formulario con email y password
- [ ] Checkbox "Remember Me" funcional
- [ ] Login exitoso → redirect a /dashboard
- [ ] Token JWT guardado en localStorage
- [ ] Remember Me = true → token persiste después de cerrar navegador
- [ ] Remember Me = false → token se borra al cerrar navegador
- [ ] Email incorrecto → error toast
- [ ] Password incorrecto → error toast
- [ ] Usuario no verificado → mensaje "Verifica tu email"

#### 1.3 Recuperación de Contraseña
**URL:** http://localhost:5173/forgot-password

**Tests:**
- [ ] Input de email funcional
- [ ] Submit → toast "Email enviado"
- [ ] Email de reset recibido (revisar inbox)
- [ ] Link en email abre /reset-password/:token
- [ ] Formulario reset con password + confirm
- [ ] Reset exitoso → redirect a /login
- [ ] Login con nueva password funciona

#### 1.4 Protección de Rutas
**Tests:**
- [ ] Sin login: acceder a /dashboard → redirect a /login
- [ ] Sin login: acceder a /admin → redirect a /login
- [ ] Usuario regular: acceder a /admin → error 403 o redirect
- [ ] Admin: acceder a /admin → permite acceso

---

### ✅ MÓDULO 2: PERFIL DE USUARIO

#### 2.1 Mi Perfil
**URL:** http://localhost:5173/dashboard/profile

**Tests:**
- [ ] Tabs visibles: "Información Personal", "Configuración de Cuenta"
- [ ] Tab "Información Personal" carga datos del usuario
- [ ] Editar: Full Name, Preferred Name, Bio, Phone, Location
- [ ] Upload de Profile Image funciona
- [ ] Preview de imagen antes de subir
- [ ] Guardar cambios → toast success
- [ ] Datos actualizados visibles en header/sidebar

#### 2.2 Configuración de Cuenta
**Tests:**
- [ ] Cambiar email funcional (requiere verificación nueva)
- [ ] Cambiar password funcional (requiere password actual)
- [ ] Privacy settings: Profile Visibility toggle funciona
- [ ] Guardar configuración → toast success

---

### ✅ MÓDULO 3: EVENTOS

#### 3.1 Vista Pública de Eventos
**URL:** http://localhost:5173/dashboard/events

**Tests:**
- [ ] Grid de eventos futuros visible
- [ ] Cada card muestra: imagen, título, fecha, ubicación, categoría
- [ ] Filtro por categoría funciona
- [ ] Búsqueda por texto funciona
- [ ] Click en evento → redirect a /dashboard/events/:id

#### 3.2 Detalle de Evento
**URL:** http://localhost:5173/dashboard/events/:id

**Tests:**
- [ ] Imagen principal visible
- [ ] Título, descripción, fecha, hora
- [ ] Ubicación (dirección + mapa si existe)
- [ ] Categoría con badge
- [ ] Botón "Registrarme" visible (si autenticado)
- [ ] Registro exitoso → toast success
- [ ] Ya registrado → botón cambia a "Cancelar Registro"
- [ ] Cancelar registro → toast success

#### 3.3 Proponer Evento (Usuario)
**Tests:**
- [ ] Modal "Proponer Evento" se abre
- [ ] Todos los campos requeridos marcados con *
- [ ] Upload de imagen funciona
- [ ] Validación: título min 5 caracteres
- [ ] Validación: descripción min 50 caracteres
- [ ] Validación: fecha futura
- [ ] Submit → toast success "Evento enviado para revisión"
- [ ] Evento NO aparece en público (status=pending)

#### 3.4 Mis Eventos
**URL:** http://localhost:5173/dashboard/my-events

**Tests:**
- [ ] Lista de eventos a los que estoy registrado
- [ ] Badge de status (upcoming/past)
- [ ] Botón "Cancelar Registro" funciona
- [ ] Eventos pasados marcados visualmente

#### 3.5 Admin - Eventos Pendientes
**URL:** http://localhost:5173/admin/events/pending

**Tests:**
- [ ] Lista de eventos con status=pending
- [ ] Botón "Aprobar" funciona
- [ ] Botón "Rechazar" requiere razón (min 10 chars)
- [ ] Evento aprobado aparece en público
- [ ] Evento rechazado NO aparece en público

---

### ✅ MÓDULO 4: NEGOCIOS

#### 4.1 Directorio de Negocios
**URL:** http://localhost:5173/dashboard/businesses

**Tests:**
- [ ] Grid de negocios con status=approved visible
- [ ] NO se muestran negocios pending o rejected
- [ ] Cada card: logo, nombre, categoría, ciudad, contacto
- [ ] Filtro por categoría (17 categorías) funciona
- [ ] Filtro por ciudad funciona
- [ ] Búsqueda por texto funciona
- [ ] Enlaces externos (website, Instagram) abren en nueva pestaña
- [ ] WhatsApp/teléfono funcionan

#### 4.2 Proponer Negocio
**Tests:**
- [ ] Modal "Agregar Mi Negocio" se abre
- [ ] Campo "Nombre de la Dueña" NO está presente (fue eliminado)
- [ ] Upload de logo: max 5MB, solo JPG/PNG/WEBP
- [ ] Validación: nombre requerido, max 100 chars
- [ ] Validación: categoría requerida (debe ser una de las 17)
- [ ] Validación: descripción min 50, max 500 chars
- [ ] Validación: teléfono formato válido
- [ ] Submit → toast success "Tu negocio será revisado"
- [ ] Negocio NO aparece en público (status=pending)

#### 4.3 Admin - Negocios Pendientes
**URL:** http://localhost:5173/admin/businesses/pending

**Tests:**
- [ ] Lista de negocios con status=pending
- [ ] Muestra: logo, nombre, categoría, dueña, ciudad
- [ ] Botón "Aprobar" funciona
- [ ] Botón "Rechazar" requiere razón (min 10 chars)
- [ ] Negocio aprobado aparece en directorio público
- [ ] Negocio aprobado tiene approvedAt y approvedBy

---

### ✅ MÓDULO 5: SERVICIOS

#### 5.1 Directorio de Servicios
**URL:** http://localhost:5173/dashboard/services

**Tests:**
- [ ] Grid de servicios con status=approved visible
- [ ] Filtro por categoría funciona
- [ ] Búsqueda funciona
- [ ] Cada card: nombre, categoría, descripción, proveedor
- [ ] Click en servicio → detalle

#### 5.2 Proponer Servicio
**Tests:**
- [ ] Modal "Ofrecer un Servicio" funciona
- [ ] Validaciones: nombre, descripción, categoría, precio
- [ ] Submit → toast success
- [ ] Servicio NO aparece en público (status=pending)

#### 5.3 Admin - Servicios Pendientes
**Tests:**
- [ ] Aprobar/rechazar servicios funciona
- [ ] Servicio aprobado aparece en directorio

---

### ✅ MÓDULO 6: BLOG

#### 6.1 Blog Público
**URL:** http://localhost:5173/dashboard/blog

**Tests:**
- [ ] Grid de artículos con status=published
- [ ] Filtro por categoría funciona
- [ ] Búsqueda funciona
- [ ] Cada card: imagen, título, categoría, autor, fecha
- [ ] Click en artículo → detalle

#### 6.2 Detalle de Artículo
**URL:** http://localhost:5173/dashboard/blog/:id

**Tests:**
- [ ] Imagen destacada visible
- [ ] Título, contenido completo, autor
- [ ] Fecha de publicación
- [ ] Artículos relacionados (sidebar)

#### 6.3 Admin - Crear Artículo
**URL:** http://localhost:5173/admin/blog/new

**Tests:**
- [ ] Formulario con todos los campos
- [ ] Upload de featured image funciona
- [ ] Editor de contenido funciona
- [ ] Guardar como borrador → status=draft
- [ ] Publicar → status=published
- [ ] Artículo publicado aparece en blog público

---

### ✅ MÓDULO 7: TIPS COMUNITARIOS (NUEVO)

#### 7.1 Tips Públicos
**URL:** http://localhost:5173/dashboard/tips

**Tests:**
- [ ] Grid de tips con status=approved visible
- [ ] NO se muestran tips pending o rejected
- [ ] Filtro por categoría (12 categorías) funciona
- [ ] Búsqueda funciona
- [ ] Cada card: título, contenido (excerpt), categoría, autor, stats
- [ ] Click en tip → detalle

#### 7.2 Detalle de Tip
**URL:** http://localhost:5173/dashboard/tips/:id

**Tests:**
- [ ] Título, contenido completo visible
- [ ] Autor con foto de perfil
- [ ] Stats: vistas, likes
- [ ] Botón "Like" funciona (requiere autenticación)
- [ ] Tips relacionados en sidebar (misma categoría)

#### 7.3 Proponer Tip (Usuario)
**Tests:**
- [ ] Modal "Agregar Mi Tip" se abre
- [ ] Validación: título 5-150 caracteres
- [ ] Validación: contenido 100-2000 caracteres
- [ ] Validación: categoría requerida (una de 12)
- [ ] Character counters funcionan (X/150, X/2000)
- [ ] Submit → toast success "Tu tip será revisado"
- [ ] Tip NO aparece en público (status=pending)

#### 7.4 Mis Tips
**URL:** http://localhost:5173/dashboard/my-tips

**Tests:**
- [ ] Lista de tips propios
- [ ] Badge de status: Pending (amarillo), Approved (verde), Rejected (rojo)
- [ ] Tips pending: botones Editar y Borrar visibles
- [ ] Editar tip funciona (solo si pending)
- [ ] Borrar tip funciona (solo si pending)
- [ ] Tips approved/rejected: NO se pueden editar/borrar

#### 7.5 Admin - Tips Pendientes
**URL:** http://localhost:5173/admin/tips/pending

**Tests:**
- [ ] Lista de tips con status=pending
- [ ] Muestra: título, contenido (excerpt), categoría, autor, fecha
- [ ] Botón "Aprobar" funciona
- [ ] Modal de aprobación con confirmación
- [ ] Tip aprobado aparece en /dashboard/tips
- [ ] Botón "Rechazar" funciona
- [ ] Modal de rechazo requiere razón (min 10 chars)
- [ ] Tip rechazado NO aparece en público

#### 7.6 Admin - Dashboard Tips
**URL:** http://localhost:5173/admin/tips

**Tests:**
- [ ] Stats cards: Total, Pendientes, Aprobados, Rechazados
- [ ] Contadores correctos
- [ ] Links a "Tips Pendientes", "Tips Aprobados", "Tips Rechazados" funcionan

#### 7.7 Admin - Tips Aprobados
**URL:** http://localhost:5173/admin/tips/list?status=approved

**Tests:**
- [ ] Tabla con SOLO tips status=approved
- [ ] Columnas: Tip, Categoría, Autor, Stats, Fecha, Acciones
- [ ] Botón "Editar" abre modal
- [ ] Modal de edición pre-carga datos del tip
- [ ] Editar tip → toast success
- [ ] Cambios reflejados en tabla
- [ ] Botón "Borrar" pide confirmación
- [ ] Borrar tip → toast success
- [ ] Tip desaparece de la tabla

#### 7.8 Admin - Tips Rechazados
**URL:** http://localhost:5173/admin/tips/list?status=rejected

**Tests:**
- [ ] Tabla con SOLO tips status=rejected
- [ ] Columna adicional "Razón de Rechazo" visible
- [ ] Razón de rechazo muestra el texto ingresado
- [ ] Botones Editar/Borrar funcionan igual que en aprobados

---

### ✅ MÓDULO 8: PANEL ADMINISTRATIVO

#### 8.1 Login Admin
**URL:** http://localhost:5173/admin/login

**Tests:**
- [ ] Formulario de login específico para admin
- [ ] Login con dev@jappi.ca funciona
- [ ] Redirect a /admin/dashboard
- [ ] Usuario regular NO puede acceder al admin

#### 8.2 Dashboard Admin
**URL:** http://localhost:5173/admin/dashboard

**Tests:**
- [ ] Stats cards visibles: Usuarios, Eventos, Negocios, Servicios, Posts
- [ ] Gráficas de estadísticas funcionan
- [ ] Navegación rápida a cada módulo

#### 8.3 Admin - Usuarios
**URL:** http://localhost:5173/admin/users

**Tests:**
- [ ] Tabla de usuarios con búsqueda
- [ ] Columnas: Nombre, Email, Role, Verified, Created At
- [ ] Filtro por rol: all/user/admin
- [ ] Cambiar rol de usuario funciona
- [ ] Suspender/activar usuario funciona

---

## PRUEBAS DE INTEGRACIÓN E2E

### Flujo 1: Usuario Nuevo → Propone Negocio → Admin Aprueba
1. [ ] Registrar nuevo usuario: test@example.com
2. [ ] Verificar email
3. [ ] Login
4. [ ] Ir a /dashboard/businesses
5. [ ] Proponer nuevo negocio (llenar formulario completo)
6. [ ] Verificar que NO aparece en directorio público
7. [ ] Logout
8. [ ] Login como admin (dev@jappi.ca)
9. [ ] Ir a /admin/businesses/pending
10. [ ] Aprobar el negocio recién creado
11. [ ] Logout admin
12. [ ] Login como usuario test@example.com
13. [ ] Ir a /dashboard/businesses
14. [ ] Verificar que el negocio AHORA aparece en el directorio

### Flujo 2: Usuario Propone Tip → Admin Rechaza
1. [ ] Login como usuario
2. [ ] Ir a /dashboard/tips
3. [ ] Proponer nuevo tip
4. [ ] Ir a /dashboard/my-tips
5. [ ] Verificar que tip aparece con badge "Pending"
6. [ ] Logout
7. [ ] Login como admin
8. [ ] Ir a /admin/tips/pending
9. [ ] Rechazar el tip con razón: "Contenido duplicado"
10. [ ] Logout admin
11. [ ] Login como usuario
12. [ ] Ir a /dashboard/my-tips
13. [ ] Verificar que tip aparece con badge "Rejected"
14. [ ] Verificar que muestra razón de rechazo

### Flujo 3: Admin Edita y Borra Tip Aprobado
1. [ ] Login como admin
2. [ ] Ir a /admin/tips/list?status=approved
3. [ ] Click "Editar" en cualquier tip
4. [ ] Cambiar título, contenido, categoría
5. [ ] Guardar cambios
6. [ ] Verificar que cambios se reflejan en tabla
7. [ ] Click "Borrar" en el mismo tip
8. [ ] Confirmar borrado
9. [ ] Verificar que tip desaparece de la tabla
10. [ ] Ir a /dashboard/tips (vista pública)
11. [ ] Verificar que tip ya NO aparece

---

## PRUEBAS DE SEGURIDAD

### Validación de Autenticación
- [ ] Sin token: API requests a endpoints protegidos → 401
- [ ] Token expirado → 401 + redirect a /login
- [ ] Token inválido → 401 + redirect a /login
- [ ] CSRF protection funcional

### Validación de Autorización
- [ ] Usuario regular: POST /admin/tips/:id/approve → 403
- [ ] Usuario regular: DELETE /admin/tips/:id → 403
- [ ] Usuario regular: PUT /admin/users/:id/role → 403

### Validación de Inputs
- [ ] XSS: Intentar script en título de tip → sanitizado
- [ ] SQL Injection: Intentar query en búsqueda → sanitizado
- [ ] File upload: Intentar subir .exe → rechazado
- [ ] File upload: Intentar subir imagen > 5MB → rechazado

---

## PRUEBAS DE RENDIMIENTO

### Carga de Datos
- [ ] Dashboard con 50+ tips carga en < 3 segundos
- [ ] Directorio con 100+ negocios carga en < 3 segundos
- [ ] Lista admin con 200+ items pagina correctamente

### Búsqueda
- [ ] Búsqueda en 50+ tips responde en < 1 segundo
- [ ] Filtros múltiples funcionan sin lag

---

## PRUEBAS DE UI/UX

### Responsive Design
- [ ] Desktop (1920x1080): Todo visible correctamente
- [ ] Tablet (768px): Layout se adapta
- [ ] Mobile (375px): Hamburger menu funciona
- [ ] Cards en grid responsive (3 cols → 2 → 1)

### Navegación
- [ ] Sidebar desktop funciona
- [ ] Mobile drawer se abre/cierra
- [ ] Breadcrumbs visibles y funcionales
- [ ] Links "Volver" funcionan

### Toast Notifications
- [ ] Toast success (verde) aparece y desaparece
- [ ] Toast error (rojo) aparece y desaparece
- [ ] Toast warning (amarillo) aparece y desaparece
- [ ] Toast no tiene errores de PropTypes en consola

### Loading States
- [ ] Spinners aparecen mientras carga data
- [ ] Skeletons en cards mientras carga
- [ ] Botones muestran "Cargando..." mientras procesa
- [ ] Botones se deshabilitan mientras procesa

---

## BUGS CRÍTICOS (DEBEN ESTAR RESUELTOS)

- [ ] ✅ Tips: acceso a `response.data.data.tips` → `response.data.data`
- [ ] ✅ TipDetailPage: `likesCount` → `likeCount`
- [ ] ✅ myTips.js: import `proposeTip` → `createTip`
- [ ] ✅ Validator: `rejectionReason` → `reason`
- [ ] ✅ Admin route GET /admin/tips agregada
- [ ] ✅ AdminTipsPage: acceso correcto a datos
- [ ] ✅ Modal de edición funciona completamente
- [ ] ✅ Borrar tip con confirmación funciona

---

## FORMATO DE REPORTE FINAL

```markdown
# QA REPORT - VALIDACIÓN FINAL MVP ENTRE AMIGAS
Fecha: [YYYY-MM-DD]
QA Tester: [Nombre]
Duración: [X horas]

## RESUMEN EJECUTIVO
- Total de tests: XXX
- Tests pasados: XXX
- Tests fallados: XXX
- Bugs críticos: X
- Bugs menores: X
- **ESTADO FINAL: ✅ APROBADO / ❌ REQUIERE CORRECCIONES**

## MÓDULOS VALIDADOS

### ✅ Autenticación (XX/XX tests passed)
- Registro: ✅
- Login: ✅
- Reset Password: ✅
- Protección de rutas: ✅

### ✅ Perfil de Usuario (XX/XX tests passed)
...

### ✅ Eventos (XX/XX tests passed)
...

### ✅ Negocios (XX/XX tests passed)
...

### ✅ Servicios (XX/XX tests passed)
...

### ✅ Blog (XX/XX tests passed)
...

### ✅ Tips Comunitarios (XX/XX tests passed)
...

### ✅ Panel Admin (XX/XX tests passed)
...

## BUGS ENCONTRADOS

### CRÍTICOS (Bloqueantes)
Ninguno / [Listar si existen]

### ALTOS (Deben corregirse antes de producción)
1. **Título del Bug**
   - Descripción: ...
   - Pasos: ...
   - Esperado: ...
   - Actual: ...
   - Prioridad: Alta

### MEDIOS
...

### BAJOS (Mejoras futuras)
...

## PRUEBAS E2E
- [ ] Flujo 1: Usuario → Propone Negocio → Admin Aprueba: ✅/❌
- [ ] Flujo 2: Usuario → Propone Tip → Admin Rechaza: ✅/❌
- [ ] Flujo 3: Admin Edita y Borra Tip: ✅/❌

## SEGURIDAD
- Autenticación: ✅
- Autorización: ✅
- Validación de inputs: ✅
- File uploads: ✅

## RENDIMIENTO
- Carga de páginas: ✅
- Búsquedas: ✅
- Paginación: ✅

## UI/UX
- Responsive: ✅
- Navegación: ✅
- Toast notifications: ✅
- Loading states: ✅

## RECOMENDACIONES
1. ...
2. ...

## CONCLUSIÓN
[Descripción general del estado del MVP]

**Veredicto:**
- ✅ **APROBADO PARA PRODUCCIÓN** - MVP listo para deployment
- ⚠️ **APROBADO CON OBSERVACIONES** - Bugs menores que pueden corregirse post-launch
- ❌ **RECHAZADO** - Requiere correcciones críticas antes de producción

---

**Firma QA:** _______________
**Fecha:** _______________
```

---

## NOTAS IMPORTANTES

1. **Tiempo Estimado:** 3-4 horas para completar TODO el testing
2. **Prioridad:** Enfocarse en flujos críticos primero (Auth, Tips, Admin)
3. **Documentación:** Capturar screenshots de cualquier bug
4. **Logs:** Revisar console.log en navegador y backend durante tests
5. **Database:** Asegurar que hay data de prueba suficiente en MongoDB
6. **Email:** Revisar inbox durante tests de verificación/reset

## CRITERIOS DE ACEPTACIÓN MVP

Para marcar el MVP como **COMPLETADO**, se debe cumplir:

- [ ] ≥ 95% de tests pasados
- [ ] 0 bugs críticos
- [ ] ≤ 3 bugs altos (no bloqueantes)
- [ ] Todos los flujos E2E funcionan
- [ ] Sin errores en consola (frontend y backend)
- [ ] Responsive funcional en mobile/tablet/desktop
- [ ] Módulo de Tips 100% funcional (prioridad #1)

---

**¡Éxito con el testing! 🚀**
