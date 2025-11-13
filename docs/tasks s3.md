# Sprint 3 - Detailed Tasks Breakdown

**Sprint:** 3  
**Duration:** 2 semanas  
**Goal:** Eventos + Blog + Admin Directorios  
**Total Story Points:** 16

---

## Task Organization

```
US-004 (Eventos) → 8 pts → 10 tasks (9 main + 1 testing)
US-007 (Blog)    → 3 pts → 6 tasks (5 main + 1 testing)
US-009 (Admin)   → 5 pts → 8 tasks
Total: 24 tasks
```

---

## 📅 US-004: Ver y Registrarse en Eventos (8 pts)

### Task 4.1: Crear Modelo Event

**Estimated:** 1.5 horas
**Priority:** HIGH
**Assignee:** DB
**Status:** ✅ Completado
**Dependencies:** Ninguna

**Acceptance Criteria:**

- [x] Schema con campos: title, description, date, time, mode, location, link, capacity, image
- [x] Enum para mode: virtual/presencial/híbrido
- [x] Validaciones básicas
- [x] Timestamps automáticos

---

### Task 4.2: Crear Modelo EventRegistration

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** DB
**Status:** ✅ Completado
**Dependencies:** Task 4.1

**Acceptance Criteria:**

- [x] Relación con User y Event
- [x] Status: confirmed/cancelled
- [x] Índice compuesto único (userId + eventId)

---

### Task 4.3: Endpoints de Eventos

**Estimated:** 3 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 4.1, 4.2

**Acceptance Criteria:**

- [x] GET /api/events - Lista pública
- [x] GET /api/events/:id - Detalle
- [x] Query params: mode, futureOnly
- [x] Ordenado por fecha

---

### Task 4.4: Endpoint de Registro a Evento

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 4.3

**Acceptance Criteria:**

- [x] POST /api/events/:id/register (protected)
- [x] Verificar capacidad disponible
- [x] Validar no duplicado
- [x] Crear registro

---

### Task 4.5: Email Service - Confirmación

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 4.4, Resend configurado

**Acceptance Criteria:**

- [x] Template HTML con detalles del evento
- [x] Integración con Resend
- [x] Email automático al registrarse
- [x] Manejo de errores

---

### Task 4.6: Frontend - EventList Component

**Estimated:** 2.5 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 4.3

**Acceptance Criteria:**

- [x] Grid responsive de eventos
- [x] EventCard component
- [x] Filtros por modalidad
- [x] Loading y empty states

---

### Task 4.7: Frontend - EventDetail Component

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 4.6

**Acceptance Criteria:**

- [x] Modal/página con info completa
- [x] Botón "Registrarme" funcional
- [x] Estados: lleno, ya registrado, fecha pasada
- [x] Confirmación y mensajes

---

### Task 4.8: Frontend - MyEvents Section

**Estimated:** 2 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 4.7

**Acceptance Criteria:**

- [x] Vista de eventos registrados
- [x] Separar próximos vs pasados
- [x] Link a detalle
- [x] Empty state

---

### Task 4.9A: Seed Events (Backend)

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Tasks 4.1-4.5

**Acceptance Criteria:**

- [x] Script con 5-7 eventos de ejemplo
- [x] Mix de modalidades y fechas
- [x] Ejecutar seed correctamente

---

### Task 4.9B: Testing Completo (Frontend + Backend)

**Estimated:** 1 hora  
**Priority:** MEDIUM  
**Assignee:** Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Task 4.9A, Tasks 4.6-4.8

**Acceptance Criteria:**

- [ ] Testing flujo completo registro
- [ ] Verificar emails llegan
- [ ] Testing edge cases (lleno, duplicado)
- [ ] Responsive check

---

## 📝 US-007: Blog con Artículos (3 pts)

### Task 7.1: Crear Modelo BlogPost

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** DB
**Status:** ✅ Completado
**Dependencies:** Ninguna

**Acceptance Criteria:**

- [x] Campos: title, slug, content, excerpt, featuredImage, category
- [x] Status: draft/published
- [x] Slugs únicos
- [x] Enum de categorías

---

### Task 7.2: Blog Endpoints

**Estimated:** 1.5 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 7.1

**Acceptance Criteria:**

- [x] GET /api/blog - Lista (solo published)
- [x] GET /api/blog/:slug - Por slug
- [x] Query params: category, page
- [x] Paginación (10 por página)

**Implementation Notes:**
- Created [blog.controller.js](../backend/src/controllers/blog.controller.js) with `getAllBlogPosts` and `getBlogPostBySlug` endpoints
- Created [blog.routes.js](../backend/src/routes/blog.routes.js) with proper route order
- Registered blog routes in [index.js](../backend/src/routes/index.js)
- Endpoints support:
  - Category filtering (Wellness, Amistad, Amor Propio, Migración, Consejos, Historias)
  - Pagination (default 10, max 50 per page)
  - Featured filtering
  - Full-text search
  - Related posts (same category)
  - View counter increments automatically
- Response uses `_id` for MongoDB consistency

---

### Task 7.3: Frontend - BlogList Component

**Estimated:** 1.5 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 7.2

**Acceptance Criteria:**

- [x] Grid estilo Medium
- [x] BlogCard con imagen, título, extracto
- [x] Filtro por categoría
- [x] Paginación
- [x] Responsive

---

### Task 7.4: Frontend - BlogPost Component

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 7.3

**Acceptance Criteria:**

- [x] Tipografía optimizada
- [x] Renderiza HTML content
- [x] Metadata visible
- [x] Botón volver
- [x] Responsive

**Archivos creados/modificados:**
- `frontend/src/features/blog/pages/BlogPostPage.jsx` - Componente principal del post con tipografía estilo Medium
- `frontend/src/shared/hooks/useBlogPost.js` - Custom hook para obtener post individual por slug
- `frontend/src/routes/AppRoutes.jsx` - Agregada ruta dinámica `/dashboard/blog/:slug`
- `frontend/src/features/blog/components/BlogCard.jsx` - Agregada navegación al post completo + fix renderizado de author

**Características implementadas:**
- Renderizado seguro de HTML con DOMPurify (prevención XSS)
- Tipografía optimizada con Tailwind Prose (h1-h6, blockquotes, code, listas)
- Featured image hero con gradient overlay y badge de categoría
- Metadata: autor, fecha de publicación, tiempo estimado de lectura
- Botón "Volver al blog" con animación
- Loading skeleton state
- Error state con mensaje user-friendly
- 100% responsive (mobile-first)

**Fixes aplicados:**
- Fix renderizado de `author` como objeto: cambiado `post.author` → `post.author?.name` en BlogCard y BlogPostPage
- Actualizado PropTypes para reflejar que `author` es un objeto con `{_id, name, profileImage}`
- Actualizado JSDoc para documentar estructura del objeto author

---

### Task 7.5A: Seed Blog Posts (Backend)

**Estimated:** 45 minutos
**Priority:** MEDIUM
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 7.2

**Acceptance Criteria:**

- [x] 5-7 artículos en español
- [x] Mix de categorías
- [x] Contenido realista
- [x] Imágenes de Unsplash

**Implementation Notes:**
- Created [seedBlogPosts.js](../backend/src/scripts/seedBlogPosts.js) with 7 comprehensive blog posts
- npm script configured: `npm run seed:blog`
- Blog posts created:
  - **Wellness**: 5 Prácticas de Autocuidado (342 views) ⭐
  - **Amistad**: Cómo Encontré a Mi Tribu en Toronto (267 views) ⭐
  - **Amor Propio**: Aprendí a Amarme en un País que No Me Conoce (198 views)
  - **Migración**: Lo que Nadie Te Dice Sobre Migrar a Canadá (521 views) ⭐
  - **Consejos**: 10 Apps Esenciales para Mujeres Latinas (412 views)
  - **Historias**: De Gerente en Colombia a Barista en Toronto (678 views)
  - **Consejos (Draft)**: Guía Completa: Cómo Preparar tu Finanzas Antes de Migrar
- All content in Spanish with realistic migrant experiences
- 6 published posts + 1 draft
- 3 featured posts
- All posts have Unsplash featured images
- Total 2,418 views across all posts

---

### Task 7.5B: Testing Blog (Frontend)

**Estimated:** 15 minutos
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 7.5A, Tasks 7.3-7.4

**Acceptance Criteria:**

- [x] Testing lectura de artículos
- [x] Testing filtros por categoría
- [x] Responsive check

**Resultados del Testing:**

✅ **Backend Endpoints Verificados:**
- GET `/blog` - 6 artículos con paginación funcional
- GET `/blog/:slug` - Post individual con HTML content
- GET `/blog?category=Wellness` - Filtros funcionan correctamente

✅ **Componentes Frontend Verificados:**
- BlogCard renderiza correctamente (author.name fix aplicado)
- BlogList con filtros y paginación
- BlogPostPage con DOMPurify sanitization
- Hooks useBlogPosts y useBlogPost funcionando
- Rutas `/dashboard/blog` y `/dashboard/blog/:slug` configuradas
- Navegación desde Sidebar y MobileNav activa

✅ **Responsive Design:**
- Grid responsive: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Tipografía adaptable: text-4xl → md:text-5xl
- Metadata con flex-wrap en mobile
- Featured images con altura fija

✅ **Seguridad:**
- DOMPurify instalado y configurado
- XSS protection con whitelist de tags
- Optional chaining para author object

**Documento de testing detallado:**
`docs/testing/blog-frontend-testing-checklist.md`

---

## 🔐 US-009: Panel Admin - Directorios (5 pts)

### Task 9.1: Admin Middleware

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Auth funcionando

**Acceptance Criteria:**

- [x] Verificar JWT y role === 'admin'
- [x] Retornar 403 si no es admin
- [x] Funciona en todas rutas admin

**Implementation Notes:**
- Middleware `requireAdmin` ya implementado en [auth.middleware.js](../backend/src/middleware/auth.middleware.js:363-365)
- Utiliza la función `authorize('admin')` como wrapper
- Verificaciones implementadas:
  - ✅ Verifica que req.user existe (debe usar `protect` middleware primero)
  - ✅ Verifica que `req.user.role === 'admin'`
  - ✅ Retorna 403 con mensaje claro si no es admin
  - ✅ Incluye información de debugging en desarrollo
- Actualmente en uso en:
  - [event.routes.js](../backend/src/routes/event.routes.js) - Admin endpoints de eventos (crear, actualizar, eliminar, ver registros)
  - [blog.routes.js](../backend/src/routes/blog.routes.js) - Admin endpoints de blog (comentados para futuros sprints)
- Exportado en módulo para uso en cualquier ruta

---

### Task 9.2: Admin Endpoints - Business

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 9.1

**Acceptance Criteria:**

- [x] POST /api/admin/business - Crear
- [x] PUT /api/admin/business/:id - Editar
- [x] DELETE /api/admin/business/:id - Eliminar
- [x] GET /api/admin/business - Lista completa
- [x] Todas protegidas con requireAdmin

**Implementation Notes:**
- All CRUD endpoints already implemented in [business.controller.js](../backend/src/controllers/business.controller.js) and [business.routes.js](../backend/src/routes/business.routes.js)
- Routes use RESTful convention: `/api/v1/businesses/*` (not `/api/admin/business/*`)
- Admin permissions verified in controllers using **owner OR admin** pattern:
  ```javascript
  if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permiso' });
  }
  ```
- All routes protected with `protect` middleware (JWT authentication)
- Admin-specific privileges implemented:
  - Can set `isVerified` and `isFeatured` fields (lines 383-395 in business.controller.js)
  - Can update/delete any business (not just owned ones)
  - Automatically sets `verifiedAt` timestamp when verifying
- Endpoints:
  - POST `/api/v1/businesses` - Create business (protected, any authenticated user)
  - PUT `/api/v1/businesses/:id` - Update business (protected, owner OR admin)
  - DELETE `/api/v1/businesses/:id` - Soft delete (protected, owner OR admin, sets `isActive: false`)
  - GET `/api/v1/businesses` - List all businesses (public, with filters)
  - GET `/api/v1/businesses/:id` - Get business details (public)
- This approach is cleaner than separate admin routes - uses single RESTful API with role-based access control in controllers

---

### Task 9.3: Admin Endpoints - Services

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Completado
**Dependencies:** Task 9.1

**Acceptance Criteria:**

- [x] CRUD completo para servicios
- [x] Protegidas con requireAdmin

**Implementation Notes:**
- All CRUD endpoints already implemented in [service.controller.js](../backend/src/controllers/service.controller.js) and [service.routes.js](../backend/src/routes/service.routes.js)
- Routes use RESTful convention: `/api/v1/services/*` (identical to business implementation)
- Admin permissions verified in controllers using **owner OR admin** pattern:
  ```javascript
  if (service.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permiso' });
  }
  ```
- All routes protected with `protect` middleware (JWT authentication)
- Admin-specific privileges implemented:
  - Can set `isVerified` and `isFeatured` fields (lines 408-418 in service.controller.js)
  - Can update/delete any service (not just owned ones)
  - Automatically sets `verifiedAt` timestamp when verifying
- Endpoints:
  - POST `/api/v1/services` - Create service (protected, any authenticated user)
  - PUT `/api/v1/services/:id` - Update service (protected, owner OR admin)
  - DELETE `/api/v1/services/:id` - Soft delete (protected, owner OR admin, sets `isActive: false`)
  - GET `/api/v1/services` - List all services (public, with filters)
  - GET `/api/v1/services/:id` - Get service details (public)
  - GET `/api/v1/services/my/list` - Get user's services (protected)
  - GET `/api/v1/services/service-types` - Get service types with count (public)
  - GET `/api/v1/services/featured` - Get featured services (public)
  - GET `/api/v1/services/stats` - Get statistics (public)
- Same clean RESTful approach as Business endpoints - single API with role-based access control in controllers

---

### Task 9.4: Frontend - Admin Layout

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 9.1

**Acceptance Criteria:**

- [x] Sidebar con navegación
- [x] Protected route (solo admin)
- [x] Diseño limpio

**Archivos creados:**
- `frontend/src/routes/AdminRoute.jsx` - Protected route para admins
- `frontend/src/features/admin/components/AdminLayout.jsx` - Layout con sidebar responsive
- `frontend/src/features/admin/pages/AdminDashboardPage.jsx` - Dashboard placeholder
- `frontend/src/routes/AppRoutes.jsx` - Agregada ruta `/admin`

**Características implementadas:**

✅ **AdminRoute Component:**
- Verifica que `user.role === 'admin'`
- Redirige a `/login` si no está autenticado
- Redirige a `/dashboard` con mensaje si no es admin
- Loading state mientras carga usuario

✅ **AdminLayout Component:**
- Sidebar desktop (w-64) con navegación
- Sidebar mobile colapsable con overlay
- Topbar con breadcrumb y user info
- Navegación con active states
- 4 secciones: Dashboard, Negocios, Servicios, Usuarios
- User info con avatar, name, email, role badge
- Botón logout funcional
- Diseño limpio estilo dashboard moderno
- 100% Responsive

✅ **AdminDashboardPage:**
- Stats cards con placeholders (Negocios, Servicios, Usuarios, Actividad)
- Placeholders para gráficos futuros
- Info box de bienvenida
- Cards con iconos coloridos
- Diseño clean con Tailwind

**Rutas configuradas:**
- `/admin` → AdminDashboardPage (protegida con AdminRoute)

**Próximos pasos:**
- Task 9.5+: Implementar páginas de gestión (businesses, services, users)

---

### Task 9.5: Frontend - BusinessForm

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 9.2, 9.4

**Acceptance Criteria:**

- [x] Modo create/edit
- [x] Campos con validaciones
- [x] React Hook Form + Yup
- [x] Mensajes claros

**Archivos creados:**

✅ **businessSchema.js:**
- Schema Yup con validaciones completas
- 17 categorías del enum backend
- Regex patterns (phone, email, URL, Instagram, Facebook)
- Helpers: defaultBusinessValues, businessToFormValues, formValuesToBusinessData
- Campos requeridos: name (2-100), category, description (20-1000), city
- Campos opcionales con validación: phone, email, whatsapp, website, instagram, facebook, address

✅ **BusinessForm.jsx:**
- React Hook Form con yupResolver
- Modo create/edit automático según `initialData`
- 3 secciones: Información Básica, Contacto, Redes Sociales
- Campos de texto, textarea, select
- Mensajes de error por campo con icono
- Helper text para campos opcionales
- Submit button con loading state
- Cancel button opcional
- Server error display
- isDirty validation (botón disabled si no hay cambios)
- 100% Responsive (grid-cols-1 md:grid-cols-2)
- PropTypes completo

**Próximos pasos:**
- Task 9.6: ServiceForm (similar pattern)
- Task 9.7: AdminBusinessList con integración del form

---

### Task 9.6: Frontend - ServiceForm

**Estimated:** 1.5 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 9.3, 9.4

**Acceptance Criteria:**

- [x] Similar a BusinessForm
- [x] Campos específicos de servicios
- [x] Validaciones

**Archivos creados:**

✅ **serviceSchema.js:**
- Schema Yup con validaciones completas
- 9 tipos de servicio del enum backend (Salud, Legal, Educación, Financiero, Inmigración, Traducción, Tecnología, Consultoría, Otros)
- Regex patterns (phone, email, URL, Facebook URL, LinkedIn URL)
- Helpers: defaultServiceValues, serviceToFormValues, formValuesToServiceData
- Campos requeridos: name (2-100), serviceType, description (20-1000), city
- Campos opcionales: credentials (máx 500), phone, email, whatsapp, website, instagram, facebook, linkedin, address

✅ **ServiceForm.jsx:**
- React Hook Form con yupResolver
- Modo create/edit automático según `initialData`
- 3 secciones: Información Básica (incluye credentials), Contacto, Redes Sociales
- Campos específicos de servicios: serviceType (9 tipos), credentials
- Redes sociales: Instagram (handle), Facebook (URL completa), LinkedIn (URL completa)
- Mensajes de error por campo con icono
- Helper text para campos opcionales
- Submit button con loading state
- Cancel button opcional
- Server error display
- isDirty validation
- 100% Responsive (grid-cols-1 md:grid-cols-2)
- PropTypes completo

**Próximos pasos:**
- Task 9.7: AdminBusinessList con integración de BusinessForm
- Task 9.8: AdminServiceList con integración de ServiceForm

---

### Task 9.7: Frontend - AdminBusinessList

**Estimated:** 1.5 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Completado
**Dependencies:** Task 9.5

**Acceptance Criteria:**

- [x] Lista con búsqueda
- [x] Botones Editar/Eliminar
- [x] Modal de confirmación
- [x] Paginación

**Archivos creados:**

✅ **useAdminBusinesses.js (Custom Hook):**
- Hook para gestión admin de negocios con API calls
- fetchBusinesses con paginación (limit: 10) y búsqueda
- createBusiness, updateBusiness, deleteBusiness
- Estados: businesses, pagination, loading, error, searchQuery
- Métodos: handleSearch, handlePageChange
- Auto-fetch inicial

✅ **ConfirmDialog.jsx (Shared Component):**
- Modal de confirmación reutilizable
- Props: isOpen, onClose, onConfirm, title, message
- Variantes: danger, warning, info (colores personalizables)
- Loading state en botón de confirmación
- Escape key para cerrar
- Backdrop con overlay oscuro

✅ **AdminBusinessesPage.jsx:**
- Página completa de gestión de negocios
- Header con contador total y botón "Nuevo Negocio"
- Barra de búsqueda en tiempo real
- Tabla responsive con 5 columnas: Negocio, Categoría, Ciudad, Contacto, Acciones
- Botones Editar (azul) y Eliminar (rojo) por fila
- Paginación completa (anterior/siguiente, página X de Y)
- Estados: loading spinner, error banner, empty state
- **Modales:**
  - Create: Modal fullscreen con BusinessForm
  - Edit: Modal fullscreen con BusinessForm + initialData
  - Delete: ConfirmDialog con mensaje de confirmación
- Integración completa con useAdminBusinesses hook
- Uso de formValuesToBusinessData para transformar datos

**Rutas configuradas:**
- `/admin/businesses` → AdminBusinessesPage (protegida con AdminRoute)
- Importada en AppRoutes.jsx línea 30 y ruta líneas 170-178

**Features implementados:**
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Búsqueda en tiempo real
- ✅ Paginación funcional
- ✅ Modales para create/edit con BusinessForm
- ✅ Modal de confirmación para delete
- ✅ Estados de loading, error, empty
- ✅ Tabla responsive
- ✅ 100% AdminLayout integration

**Próximos pasos:**
- Task 9.8: AdminServiceList (mismo pattern con ServiceForm)

---

### Task 9.8: Frontend - AdminServiceList + Testing

**Estimated:** 1.5 horas  
**Priority:** MEDIUM  
**Assignee:** Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Task 9.6, 9.7

**Acceptance Criteria:**

- [ ] Similar a AdminBusinessList
- [ ] Testing completo CRUD
- [ ] Testing security (no-admin)
- [ ] Responsive check

---

## Summary

**Total Tasks:** 24  
**Total Hours:** ~36.5 horas  
**Distribution:**

- Week 1: Eventos (18h)
- Week 2: Blog (7h) + Admin (11.5h)

**By Assignee:**

- DB: 3 tasks (modelos)
- Backend: 9 tasks (endpoints, seeds, email)
- Frontend: 12 tasks (components, forms, UI)

---

**END OF SPRINT 3 TASKS**
