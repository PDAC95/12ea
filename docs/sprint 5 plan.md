# 🚀 SPRINT 5 PLAN - Post-Deploy Fixes & Improvements

## 📊 SPRINT OVERVIEW

**Sprint Number:** 5  
**Sprint Goal:** Resolver todos los bugs críticos identificados en producción y mejorar la experiencia de usuario para el lanzamiento oficial  
**Duration:** 2 semanas (10 días laborables)  
**Start Date:** 18 de Noviembre, 2025  
**End Date:** 29 de Noviembre, 2025  
**Story Points:** 34 puntos

---

## 🎯 SPRINT GOAL

Después de un deployment exitoso a producción, se identificaron 22 issues durante el testing inicial. Este sprint se enfoca en:

1. **Resolver bugs críticos** que impiden funcionalidad core (email verification, OAuth, registros)
2. **Corregir errores de datos** en admin dashboard y blog
3. **Mejorar UX** con validaciones y flujos optimizados
4. **Preparar para lanzamiento oficial** con todas las funcionalidades operativas

---

## 📋 USER STORIES

### 🔴 CRÍTICO (21 pts)

#### US-5.1: Sistema de Email Verification (8 pts) ✅ COMPLETADO

**Priority:** CRÍTICO
**Assignee:** Backend
**Epic:** Autenticación
**Status:** ✅ DONE (18 Nov 2025)

**User Story:**
Como usuaria registrada, quiero recibir el email de verificación para poder activar mi cuenta.

**Current Problem:**

- ~~Usuarios no reciben email de verificación después de registrarse~~ ✅ RESUELTO
- ~~Sistema muestra mensaje de "revisa tu email" pero nunca llega~~ ✅ RESUELTO

**Acceptance Criteria:**

- [x] Email de verificación llega en menos de 2 minutos después del registro ✅ (~30 segundos)
- [x] Link de verificación es válido por 24 horas ✅
- [x] Click en link verifica cuenta y muestra mensaje de éxito ✅
- [x] Usuario puede hacer login después de verificar ✅
- [x] Opción "Reenviar email" funciona si no llega el primero ✅
- [x] Logs muestran envío exitoso de emails ✅

**Technical Tasks:**

1. ✅ Verificar configuración de Resend en Railway
2. ✅ Revisar logs de errores en Railway
3. ✅ Verificar variables: EMAIL_FROM, RESEND_API_KEY, FRONTEND_URL
4. ✅ Testing con emails reales (Gmail, Outlook)
5. ✅ Verificar que emails no caigan en spam

**RESOLUCIÓN:**
- Variables RESEND_API_KEY y EMAIL_FROM configuradas en Railway
- Templates HTML completamente rediseñados (verification.html, welcome.html)
- Sistema de emails operando correctamente en producción
- Emails llegan en <30 segundos y no caen en spam
- Preview HTML generados para validación de diseño

**Dependencies:** Ninguna
**Estimated:** 8 pts (1 día)
**Actual:** 5 horas

---

#### US-5.2: Google OAuth Integration (5 pts) ✅ COMPLETADO

**Priority:** CRÍTICO
**Assignee:** Backend + Frontend
**Epic:** Autenticación
**Status:** ✅ DONE (18 Nov 2025)

**User Story:**
Como usuaria, quiero poder registrarme/login con Google para tener acceso rápido a la plataforma.

**Current Problem:**

- ~~Botón de Google OAuth no funciona~~ ✅ RESUELTO
- ~~Usuarios esperan esta funcionalidad como alternativa a email/password~~ ✅ RESUELTO

**Acceptance Criteria:**

- [x] Click en "Continuar con Google" abre popup de Google ✅
- [x] Usuario puede seleccionar cuenta de Google ✅
- [x] Después de autorizar, redirect correcto a dashboard ✅
- [x] Usuario creado en DB si es primera vez ✅
- [x] Session iniciada automáticamente ✅
- [x] Datos de perfil (nombre, email, foto) guardados correctamente ✅

**Technical Tasks:**

1. ✅ Actualizar GOOGLE_CALLBACK_URL en Railway: `https://api.entreamigas.ca/api/v1/auth/google/callback`
2. ✅ Actualizar Authorized redirect URIs en Google Cloud Console
3. ✅ Verificar GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en producción
4. ✅ Actualizar URL de OAuth en frontend (usar `https://api.entreamigas.ca`)
5. ✅ Testing completo de flujo OAuth

**RESOLUCIÓN:**
- Dominio personalizado `api.entreamigas.ca` configurado en Railway con SSL automático (Let's Encrypt)
- DNS CNAME actualizado en Hostinger: `api → 3w398gey.up.railway.app`
- Variables de entorno actualizadas en Railway y Vercel
- Google Cloud Console OAuth redirect URIs configuradas para producción
- Flujo OAuth testeado exitosamente (usuarios nuevos y existentes)

**Dependencies:** Ninguna
**Estimated:** 5 pts (1 día)
**Actual:** 6 horas

---

#### US-5.3: Admin Dashboard Data Fix (3 pts)

**Priority:** CRÍTICO  
**Assignee:** Backend  
**Epic:** Admin Panel

**User Story:**  
Como administradora, quiero ver estadísticas correctas en el dashboard para tener visibilidad real del estado de la plataforma.

**Current Problem:**

- Dashboard muestra 1 usuario cuando hay 14
- Muestra 0 negocios y 0 servicios cuando hay registros
- Estadísticas no son confiables para toma de decisiones

**Acceptance Criteria:**

- [ ] Contador de usuarios muestra número exacto en DB
- [ ] Contador de negocios muestra total correcto
- [ ] Contador de servicios muestra total correcto
- [ ] Contador de eventos muestra total correcto
- [ ] Contador de blog posts muestra total correcto
- [ ] Stats se actualizan al refrescar página

**Technical Tasks:**

1. Revisar query de stats en AdminController
2. Verificar agregaciones de MongoDB
3. Agregar logging para debug
4. Testing con datos reales de producción
5. Verificar permisos de queries en MongoDB Atlas

**Dependencies:** Ninguna  
**Estimated:** 3 pts (medio día)

---

#### US-5.4: Business Registration Fix (5 pts)

**Priority:** CRÍTICO  
**Assignee:** Backend + Frontend  
**Epic:** Directorios

**User Story:**  
Como usuaria, quiero poder registrar mi negocio correctamente para que aparezca en el directorio.

**Current Problem:**

- Error 400 al intentar guardar negocio
- Validación de URL de website causa conflictos
- Usuario no puede completar registro

**Acceptance Criteria:**

- [ ] Form acepta URLs válidas (http://, https://, www., sin www.)
- [ ] Validación clara de qué formato de URL es válido
- [ ] Negocio se crea correctamente en DB
- [ ] Negocio aparece en lista "Pendiente de aprobación" para admin
- [ ] Mensaje de éxito claro para usuario

**Technical Tasks:**

1. Revisar validación de URL en BusinessValidator
2. Actualizar schema de Business model si necesario
3. Verificar que frontend envíe formato correcto
4. Testing con diferentes formatos de URL
5. Mejorar mensajes de error en frontend

**Dependencies:** Ninguna  
**Estimated:** 5 pts (1 día)

---

### 🟡 ALTA PRIORIDAD (11 pts)

#### US-5.5: Post-Registration Flow (3 pts)

**Priority:** HIGH  
**Assignee:** Frontend  
**Epic:** Autenticación

**User Story:**  
Como usuaria recién registrada, quiero ser redirigida automáticamente al dashboard para empezar a usar la plataforma inmediatamente.

**Current Problem:**

- Después de registro, usuario ve mensaje de "revisa email"
- Pero debe hacer login manualmente incluso si email ya está verificado

**Acceptance Criteria:**

- [ ] Si email verification está deshabilitado temporalmente, redirect directo a dashboard
- [ ] Session iniciada automáticamente
- [ ] Mensaje de bienvenida aparece
- [ ] Usuario no necesita login manual adicional

**Technical Tasks:**

1. Modificar RegisterForm para auto-login después de registro exitoso
2. Guardar token en localStorage
3. Redirect a /dashboard
4. Mostrar toast de bienvenida

**Dependencies:** US-5.1 debe estar en progreso  
**Estimated:** 3 pts (medio día)

---

#### US-5.6: Blog Categories Alignment (3 pts)

**Priority:** HIGH  
**Assignee:** Frontend + Backend  
**Epic:** Blog

**User Story:**  
Como usuaria, quiero que las categorías de blog sean consistentes para poder filtrar contenido correctamente.

**Current Problem:**

- Nombres de categorías en filtros no coinciden con categorías en posts
- Íconos de categorías se ven mal (emojis rotos)

**Acceptance Criteria:**

- [ ] Categorías en dropdown coinciden 100% con categorías en DB
- [ ] Íconos/emojis de categorías se renderizan correctamente
- [ ] Filtro por categoría funciona
- [ ] Contador de posts por categoría es correcto

**Technical Tasks:**

1. Definir lista oficial de categorías de blog
2. Actualizar constante BLOG_CATEGORIES en frontend
3. Migrar posts existentes a categorías correctas
4. Verificar encoding de emojis en DB
5. Testing de filtros

**Dependencies:** Ninguna  
**Estimated:** 3 pts (medio día)

---

#### US-5.7: City Dropdown Standardization (2 pts)

**Priority:** HIGH  
**Assignee:** Frontend  
**Epic:** Directorios

**User Story:**  
Como usuaria registrando negocio/servicio, quiero seleccionar ciudad de una lista para evitar errores de escritura.

**Current Problem:**

- Campo de ciudad es texto libre
- Lleva a inconsistencias: "Toronto", "toronto", "TORONTO", "GTA", etc.

**Acceptance Criteria:**

- [ ] Dropdown con ~50 ciudades principales de Canadá
- [ ] Searchable/filterable
- [ ] Agrupadas por provincia
- [ ] Opción "Otra" con campo de texto si no encuentra su ciudad
- [ ] Validación que requiere selección

**Technical Tasks:**

1. Crear constante CANADIAN_CITIES en frontend
2. Implementar Select component con search
3. Actualizar BusinessForm y ServiceForm
4. Migrar datos existentes a formato estandarizado

**Dependencies:** Ninguna  
**Estimated:** 2 pts (medio día)

---

#### US-5.8: Admin Routes Fix (3 pts)

**Priority:** HIGH  
**Assignee:** Backend + Frontend  
**Epic:** Admin Panel

**User Story:**  
Como administradora, quiero acceder a todas las secciones del panel admin para gestionar la plataforma.

**Current Problem:**

- /admin/services → 404
- /admin/blog → Error 400
- /admin/users → 404

**Acceptance Criteria:**

- [ ] Todas las rutas admin retornan 200
- [ ] Datos se cargan correctamente
- [ ] Paginación funciona
- [ ] Filtros funcionan

**Technical Tasks:**

1. Verificar rutas en adminRoutes.js
2. Verificar controllers existen
3. Testing de cada endpoint con Postman
4. Verificar que frontend use rutas correctas

**Dependencies:** Ninguna  
**Estimated:** 3 pts (medio día)

---

### 🟢 MEDIA PRIORIDAD (12 pts)

#### US-5.9: Dashboard Content Updates (2 pts)

**Priority:** MEDIUM  
**Assignee:** Frontend  
**Epic:** UX Improvements

**User Story:**  
Como usuaria, quiero ver contenido relevante en el dashboard para saber qué funcionalidades están disponibles.

**Current Problem:**

- Tarjetas de Eventos, Blog, Mi Perfil muestran "Próximamente"
- Usuario no sabe qué está disponible

**Acceptance Criteria:**

- [ ] Tarjeta de Eventos muestra próximos 3 eventos o CTA para ver todos
- [ ] Tarjeta de Blog muestra últimos 3 posts
- [ ] Tarjeta de Mi Perfil muestra info básica + botón editar
- [ ] Sección de navegación "Mi Perfil" funciona

**Dependencies:** Ninguna  
**Estimated:** 2 pts (medio día)

---

#### US-5.10: User Submission Workflows (5 pts)

**Priority:** MEDIUM  
**Assignee:** Frontend + Backend  
**Epic:** Community Features

**User Story:**  
Como usuaria, quiero poder proponer eventos/negocios/servicios para contribuir a la comunidad.

**Current Problem:**

- No hay forma para usuarios regulares de proponer contenido
- Todo debe ser creado por admin

**Acceptance Criteria:**

- [ ] Botón "Proponer Evento" en página de Eventos
- [ ] Modal de creación de evento para usuarios
- [ ] Evento creado con status "Pendiente de aprobación"
- [ ] Admin puede ver, aprobar o rechazar propuestas
- [ ] Usuario recibe notificación de aprobación/rechazo

**Dependencies:** US-5.8 (admin routes deben funcionar)  
**Estimated:** 5 pts (1 día)

---

#### US-5.11: Landing Page CTA (2 pts)

**Priority:** MEDIUM  
**Assignee:** Frontend  
**Epic:** Marketing

**User Story:**  
Como visitante no registrada, quiero poder agregar mi negocio/servicio desde la landing para contribuir sin necesidad de crear cuenta primero.

**Acceptance Criteria:**

- [ ] Sección en landing "¿Tienes un negocio?"
- [ ] CTA "Agregar mi negocio" o "Ofrecer mis servicios"
- [ ] Click abre modal o página de registro simplificado
- [ ] Captura info básica + email para seguimiento

**Dependencies:** Ninguna  
**Estimated:** 2 pts (medio día)

---

#### US-5.12: Security - Hide Admin Message (1 pt)

**Priority:** MEDIUM  
**Assignee:** Frontend  
**Epic:** Security

**User Story:**  
Como administradora del sistema, no quiero que el mensaje "¿Eres administradora?" sea visible en el login para evitar dar pistas a atacantes.

**Current Problem:**

- Login muestra mensaje visible para todos sobre acceso admin
- Potencial riesgo de seguridad

**Acceptance Criteria:**

- [ ] Mensaje removido del UI
- [ ] Admin login sigue funcionando en ruta dedicada

**Dependencies:** Ninguna  
**Estimated:** 1 pt (15 minutos)

---

#### US-5.13: Google Address Autocomplete (2 pts - INVESTIGACIÓN)

**Priority:** MEDIUM  
**Assignee:** Backend  
**Epic:** UX Improvements

**User Story:**  
Como usuaria registrando negocio, quiero autocompletado de dirección para facilitar el ingreso de datos.

**Current Problem:**

- Campo de dirección es texto libre
- Propenso a errores y formato inconsistente

**Acceptance Criteria:**

- [ ] Investigar costo de Google Places API
- [ ] Si es gratis/económico: implementar
- [ ] Si es costoso: documentar para fase futura
- [ ] Autocompletado funciona para direcciones canadienses

**Dependencies:** Ninguna  
**Estimated:** 2 pts (investigación + documento)

---

## 📅 SPRINT TIMELINE

### **Semana 1: Críticos (18-22 Nov)**

**Lunes (Día 1):** US-5.1 Email Verification  
**Martes (Día 2):** US-5.1 continuación + testing  
**Miércoles (Día 3):** US-5.2 Google OAuth  
**Jueves (Día 4):** US-5.3 Admin Dashboard + US-5.12 Security  
**Viernes (Día 5):** US-5.4 Business Registration Fix

### **Semana 2: Alta + Media (25-29 Nov)**

**Lunes (Día 6):** US-5.5 Post-reg flow + US-5.11 Landing CTA  
**Martes (Día 7):** US-5.6 Blog categories + US-5.7 City dropdown  
**Miércoles (Día 8):** US-5.8 Admin routes fix  
**Jueves (Día 9):** US-5.9 Dashboard content + US-5.13 Google autocomplete (investigación)  
**Viernes (Día 10):** US-5.10 User submissions + Buffer/Testing final

---

## 🎯 DEFINITION OF DONE

Una User Story está "Done" cuando:

- [ ] **Código implementado** y commiteado a branch feature
- [ ] **Testing manual** completado en desarrollo local
- [ ] **Code review** aprobado por otro dev (si aplica)
- [ ] **Testing en staging** (Railway preview deploy)
- [ ] **Merge a main** y auto-deploy a producción
- [ ] **Smoke testing en producción** exitoso
- [ ] **Issue cerrado** en backlog con notas de implementación
- [ ] **Documentación actualizada** si aplica

---

## 🚀 DEPLOYMENT STRATEGY

**Continuous Deployment:**

- Cada merge a `main` dispara auto-deploy en Railway y Vercel
- Testing inmediato en producción
- Rollback rápido si hay issues críticos

**Hotfix Process:**

- Issues críticos en producción se pueden hacer directo a main
- Notificar al equipo antes de hotfix
- Deploy y verificar inmediatamente

---

## 📊 SPRINT METRICS

**Velocity Esperada:** 34 puntos  
**Días Laborables:** 10  
**Puntos por día:** ~3.4

**Breakdown por Prioridad:**

- 🔴 Crítico: 21 pts (62%)
- 🟡 Alta: 11 pts (32%)
- 🟢 Media: 12 pts (35%)

---

## 🎉 SPRINT SUCCESS CRITERIA

Sprint será considerado exitoso si:

1. ✅ **TODOS los issues críticos están resueltos** (US-5.1 a US-5.4)
2. ✅ **Mínimo 80% de alta prioridad completado**
3. ✅ **Plataforma es funcional para usuarias reales**
4. ✅ **Cero errores 400/500 en producción**
5. ✅ **Admin puede gestionar todo el contenido**

---

## 🔄 DAILY STAND-UP FORMAT

**Time:** 9:00 AM diario  
**Duration:** 15 minutos max

**Questions:**

1. ¿Qué completaste ayer?
2. ¿Qué harás hoy?
3. ¿Hay blockers?

---

## 📝 RETROSPECTIVE TOPICS

Al final del sprint, discutir:

1. ¿Qué funcionó bien en este sprint?
2. ¿Qué podemos mejorar?
3. ¿Hubo estimaciones incorrectas?
4. ¿Cómo podemos prevenir estos bugs en el futuro?
5. ¿Necesitamos más testing antes de deploy?

---

**Sprint Owner:** Patricio  
**Scrum Master:** Claude (AI Assistant)  
**Team:** Backend (1), Frontend (1), Full-stack (Patricio)
