# Sprint 4 - Detailed Tasks Breakdown

**Sprint:** 4  
**Duration:** 2 semanas (FINAL MVP)  
**Goal:** Admin completo + Deploy a producción  
**Total Story Points:** 21

---

## Task Organization

```
US-008 (Admin Eventos)  → 8 pts → 10 tasks
US-010 (Admin Blog)     → 5 pts → 8 tasks
INFRA-005 (CI/CD)       → 5 pts → 5 tasks
INFRA-006 (Deploy)      → 3 pts → 4 tasks
Total: 27 tasks
```

---

## 📅 US-008: Panel Admin - Gestión de Eventos (8 pts)

### Task 8.1: Endpoints Admin de Eventos (Backend)

**Estimated:** 2 horas  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Sprint 3 US-004 completada (modelos Event y EventRegistration existen)

#### QUÉ HACER:

Crear endpoints CRUD para que admin pueda gestionar eventos.

#### QUÉ DEBE CUMPLIR:

- [ ] POST `/api/admin/events` - Crear evento
  - Requiere autenticación + role admin
  - Recibe: title, description, date, time, mode, location, link, capacity, category, image
  - Validar todos los campos requeridos
  - Retornar evento creado
- [ ] PUT `/api/admin/events/:id` - Editar evento
  - Requiere autenticación + role admin
  - Actualizar solo campos enviados
  - Validar que evento existe
  - Retornar evento actualizado
- [ ] DELETE `/api/admin/events/:id` - Cancelar/eliminar evento
  - Requiere autenticación + role admin
  - Soft delete (marcar como cancelled o isActive=false)
  - Retornar confirmación
- [ ] GET `/api/admin/events` - Listar todos los eventos (incluye cancelled)
  - Requiere autenticación + role admin
  - Filtros opcionales: status (upcoming/past/cancelled)
  - Ordenado por fecha descendente
  - Incluir contador de registrados
- [ ] GET `/api/admin/events/:id/registrations` - Ver registradas a un evento
  - Requiere autenticación + role admin
  - Retornar lista con: userId, name, email, registeredAt
  - Ordenado por fecha de registro

#### VALIDACIONES:

- [ ] Todos los endpoints protegidos con requireAdmin middleware
- [ ] Validar formato de fecha y hora
- [ ] Capacity debe ser número positivo
- [ ] Mode debe ser: virtual, presencial, o híbrido

#### ARCHIVOS AFECTADOS:

- `backend/src/controllers/eventController.js`
- `backend/src/routes/admin/events.js` (crear nuevo o usar existente)
- `backend/src/middleware/requireAdmin.js` (debe existir de Sprint 3)

---

### Task 8.2: Image Upload Service (Backend)

**Estimated:** 2 horas  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** AWS S3 configurado (Sprint 0)

#### QUÉ HACER:

Crear servicio para subir imágenes a AWS S3 y retornar URL pública.

#### QUÉ DEBE CUMPLIR:

- [ ] POST `/api/upload/image` - Upload de imagen
  - Requiere autenticación (user o admin)
  - Acepta multipart/form-data
  - Validar tipo de archivo: jpg, jpeg, png, webp
  - Validar tamaño máximo: 5MB
  - Subir a AWS S3
  - Retornar URL pública de la imagen
  - Manejo de errores claro
- [ ] Generar nombres únicos para evitar colisiones
- [ ] Organizar por carpetas: /events/, /blog/, /profiles/

#### VALIDACIONES:

- [ ] Solo imágenes permitidas
- [ ] Tamaño máximo respetado
- [ ] Error 413 si archivo muy grande
- [ ] Error 415 si tipo no soportado

#### ARCHIVOS AFECTADOS:

- `backend/src/services/uploadService.js` (crear)
- `backend/src/routes/upload.js` (crear)
- `backend/src/middleware/multer.js` (configurar multer)

#### DEPENDENCIAS EXTERNAS:

- Librería: multer
- Librería: aws-sdk o @aws-sdk/client-s3

---

### Task 8.3: Export CSV Endpoint (Backend)

**Estimated:** 1 hora  
**Priority:** MEDIUM  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Task 8.1 completada

#### QUÉ HACER:

Crear endpoint para exportar lista de asistentes en formato CSV.

#### QUÉ DEBE CUMPLIR:

- [ ] GET `/api/admin/events/:id/export-csv` - Exportar asistentes
  - Requiere autenticación + role admin
  - Generar CSV con columnas: Nombre, Email, Fecha de Registro
  - Headers correctos para download (Content-Type, Content-Disposition)
  - Nombre de archivo: `evento-[id]-asistentes.csv`
  - Incluir BOM para compatibilidad con Excel
  - Retornar archivo CSV

#### VALIDACIONES:

- [ ] Validar que evento existe
- [ ] Manejar caso de 0 registros (CSV vacío con headers)

#### ARCHIVOS AFECTADOS:

- `backend/src/controllers/eventController.js`
- `backend/src/routes/admin/events.js`

#### DEPENDENCIAS EXTERNAS:

- Librería: json2csv (o similar)

---

### Task 8.4: EventForm Component (Frontend)

**Estimated:** 3 horas  
**Priority:** HIGH  
**Assignee:** Frontend  
**Status:** done  
**Dependencies:** Task 8.1 y 8.2 completadas

#### QUÉ HACER:

Crear formulario reutilizable para crear y editar eventos.

#### QUÉ DEBE CUMPLIR:

- [ ] Componente EventForm.jsx con dos modos: create y edit
- [ ] Campos del formulario:
  - Título (text, requerido)
  - Descripción (textarea, requerido)
  - Fecha (datepicker, requerido)
  - Hora (time input, requerido)
  - Modalidad (dropdown: virtual/presencial/híbrido, requerido)
  - Ubicación (text, requerido si presencial o híbrido)
  - Link (url, requerido si virtual o híbrido)
  - Capacidad (number, requerido, mínimo 1)
  - Categoría (text, opcional)
  - Imagen (file upload con preview)
- [ ] Validaciones con React Hook Form + Yup:
  - Todos los campos requeridos
  - Fecha no puede ser pasada
  - Capacity debe ser positivo
  - Link debe ser URL válida
  - Ubicación/Link condicionales según modalidad
- [ ] Upload de imagen:
  - Drag & drop o click to upload
  - Preview de imagen seleccionada
  - Mostrar imagen existente en modo edit
  - Loading state durante upload
  - Llamar a POST /api/upload/image
  - Guardar URL retornada
- [ ] Botones:
  - En create: "Crear Evento" y "Cancelar"
  - En edit: "Guardar Cambios" y "Cancelar"
  - Loading states
- [ ] Mensajes de éxito/error claros

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/events/EventForm.jsx` (crear)

---

### Task 8.5: AdminEventList Component (Frontend)

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 8.1 completada

**✅ COMPLETADO** - 2025-11-14
- Archivo creado: `frontend/src/features/admin/events/AdminEventList.jsx` (~800 líneas)
- Tabla completa con 6 columnas: Event (imagen+título), Date & Hora, Modalidad, Capacidad, Estado, Acciones
- Filtros implementados: Status (all/upcoming/past/cancelled) y búsqueda por título
- Paginación: 20 eventos por página con botones previous/next
- 4 modales integrados: CreateModal, EditModal, RegistrationsModal, ConfirmCancelModal
- Integración con EventForm (Task 8.4) para create y edit
- CRUD completo: GET, POST, PUT (edit), DELETE (soft delete)
- Badge system: Mode badges (Virtual/Presencial/Híbrido) y Status badges (Próximo/Finalizado/Cancelado)
- Loading states y empty states implementados
- Responsive design completo
- Endpoints backend verificados: todos funcionando correctamente

#### QUÉ HACER:

Crear vista de lista de eventos para el admin.

#### QUÉ DEBE CUMPLIR:

- [ ] Lista/tabla de todos los eventos
- [ ] Columnas mostradas:
  - Imagen (thumbnail pequeño)
  - Título
  - Fecha y hora
  - Modalidad (badge con color)
  - Registrados / Capacidad (ej: "15/50")
  - Estado (upcoming/past/cancelled)
  - Acciones
- [ ] Filtros:
  - Por estado: Todos / Próximos / Pasados / Cancelados
  - Búsqueda por título
- [ ] Acciones por evento:
  - Botón "Editar" → abre modal con EventForm en modo edit
  - Botón "Ver Registros" → abre modal con lista de registradas
  - Botón "Cancelar Evento" → modal de confirmación
- [ ] Botón principal: "Crear Nuevo Evento" → abre modal con EventForm
- [ ] Paginación (20 eventos por página)
- [ ] Loading states
- [ ] Empty state si no hay eventos

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/events/AdminEventList.jsx` (crear)

---

### Task 8.6: EventRegistrations Modal (Frontend)

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 8.1 y 8.3 completadas

**✅ COMPLETADO** - 2025-11-14
- Archivo creado: `frontend/src/features/admin/events/EventRegistrations.jsx` (~300 líneas)
- Modal completo con header, body y footer
- Fetch de registrations desde GET `/api/admin/events/:id/registrations`
- Tabla responsive con 3 columnas: Nombre, Email, Fecha de Registro
- Contador en header: "X personas registradas"
- Botón "Exportar CSV" funcional (generación desde frontend con BOM para Excel)
- Loading state con spinner durante fetch
- Empty state: "Aún no hay personas registradas" con ícono
- Error state con botón de reintentar
- Botón "Cerrar" en header y footer
- Responsive: tabla en desktop, cards en móvil
- Integrado en AdminEventList (reemplazó modal placeholder)
- Props: eventId, eventTitle, isOpen, onClose

#### QUÉ HACER:

Crear modal que muestra lista de usuarias registradas a un evento.

#### QUÉ DEBE CUMPLIR:

- [ ] Modal que recibe eventId como prop
- [ ] Fetch de GET `/api/admin/events/:id/registrations`
- [ ] Lista/tabla con columnas:
  - Nombre
  - Email
  - Fecha de registro
- [ ] Contador en header: "15 personas registradas"
- [ ] Botón "Exportar CSV" → descarga archivo
- [ ] Loading state durante fetch
- [ ] Empty state si no hay registros: "Aún no hay personas registradas"
- [ ] Botón "Cerrar" para cerrar modal
- [ ] Responsive (tabla se adapta en móvil)

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/events/EventRegistrations.jsx` (crear)

---

### Task 8.7: Integrar en Admin Layout (Frontend)

**Estimated:** 30 minutos
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 8.4, 8.5, 8.6 completadas

**✅ COMPLETADO** - 2025-11-14
- AdminEventsPage modificado para usar AdminEventList como componente principal
- Link "Eventos" agregado al navigation array en AdminLayout.jsx
- Ícono Calendar importado y asignado
- Ruta `/admin/events` ya existía en AppRoutes.jsx (creada en Task 8.4)
- Ruta protegida con AdminRoute ✓
- Active state funcional en sidebar
- Navegación completamente funcional
- Descripción: "Gestión de eventos"
- Posición en sidebar: después de Negocios, antes de Servicios

#### QUÉ HACER:

Integrar la gestión de eventos en el panel de admin.

#### QUÉ DEBE CUMPLIR:

- [ ] Agregar link "Gestionar Eventos" en sidebar de admin
- [ ] Ruta: `/admin/eventos`
- [ ] Componente principal: AdminEventList
- [ ] Ruta protegida con AdminRoute
- [ ] Navegación funcional desde otros puntos del admin

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/AdminLayout.jsx`
- `frontend/src/App.jsx` (agregar ruta)

---

### Task 8.8: Seed Events Admin (Backend)

**Estimated:** 30 minutos  
**Priority:** LOW  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Task 8.1 completada

#### QUÉ HACER:

Actualizar o crear script de seed con eventos más realistas.

#### QUÉ DEBE CUMPLIR:

- [ ] Eliminar eventos de prueba anteriores
- [ ] Crear 7-10 eventos variados:
  - Mix de modalidades (virtual, presencial, híbrido)
  - Eventos próximos y algunos pasados
  - Diferentes capacidades
  - Algunos con registros, otros sin registros
- [ ] Usar imágenes placeholder (Unsplash)
- [ ] Console log con resumen

#### ARCHIVOS AFECTADOS:

- `backend/src/scripts/seedEvents.js`

---

### Task 8.9: Testing Admin Eventos (Backend)

**Estimated:** 1 hora  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Task 8.1, 8.2, 8.3 completadas

#### QUÉ HACER:

Testing manual de todos los endpoints de admin eventos.

#### ESCENARIOS A PROBAR:

- [ ] POST /api/admin/events con datos válidos → crear evento
- [ ] POST /api/admin/events sin auth → 401
- [ ] POST /api/admin/events con user regular → 403
- [ ] GET /api/admin/events → lista todos los eventos
- [ ] GET /api/admin/events?status=upcoming → solo próximos
- [ ] PUT /api/admin/events/:id → actualizar evento
- [ ] DELETE /api/admin/events/:id → cancelar evento
- [ ] GET /api/admin/events/:id/registrations → lista registradas
- [ ] GET /api/admin/events/:id/export-csv → descarga CSV
- [ ] POST /api/upload/image con imagen válida → retorna URL
- [ ] POST /api/upload/image con archivo grande → 413
- [ ] POST /api/upload/image con tipo inválido → 415

#### CHECKLIST:

- [ ] Todos los endpoints funcionan
- [ ] Validaciones correctas
- [ ] Mensajes de error claros
- [ ] CSV descarga correctamente

---

### Task 8.10: Testing Admin Eventos (Frontend)

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ready for testing
**Dependencies:** Task 8.4, 8.5, 8.6, 8.7 completadas

**📋 GUÍA DE TESTING CREADA** - 2025-11-14
- Archivo creado: `TESTING-ADMIN-EVENTOS.md` (guía completa de testing manual)
- 19 tests definidos cubriendo todos los flujos
- Checklist de 15 criterios de aceptación
- Servidores verificados: Backend (8000) ✅ Frontend (8081) ✅
- Ruta /admin/events accesible ✅
- No hay errores en consola ✅
- **LISTO PARA EJECUTAR TESTING MANUAL**

**Flujos cubiertos en la guía:**
1. Acceso y navegación (2 tests)
2. Vista de lista de eventos (3 tests)
3. Crear evento (5 tests)
4. Editar evento (2 tests)
5. Ver registros (3 tests)
6. Cancelar evento (2 tests)
7. Paginación (1 test)
8. Responsive design (1 test)
9. Console y errores (1 test)

#### QUÉ HACER:

Testing manual completo de la gestión de eventos en el admin.

#### FLUJOS A PROBAR:

- [ ] Ir a /admin/eventos
- [ ] Ver lista de eventos existentes
- [ ] Click "Crear Nuevo Evento"
- [ ] Llenar formulario completo
- [ ] Upload de imagen
- [ ] Guardar → verificar que aparece en lista
- [ ] Click "Editar" en un evento
- [ ] Modificar campos
- [ ] Guardar → verificar cambios
- [ ] Click "Ver Registros"
- [ ] Verificar lista de registradas
- [ ] Click "Exportar CSV"
- [ ] Verificar descarga de archivo
- [ ] Abrir CSV en Excel → verificar formato
- [ ] Click "Cancelar Evento"
- [ ] Confirmar → verificar que se marca como cancelled
- [ ] Probar filtros (próximos, pasados, cancelados)
- [ ] Probar búsqueda por título
- [ ] Verificar responsive en móvil

#### CHECKLIST:

- [ ] CRUD completo funciona
- [ ] Upload de imágenes funciona
- [ ] Exportar CSV funciona
- [ ] Filtros funcionan
- [ ] Validaciones funcionan
- [ ] No hay errores en consola
- [ ] Responsive OK

---

## 📝 US-010: Panel Admin - Gestión de Blog (5 pts)

### Task 10.1: Admin Blog Endpoints (Backend)

**Estimated:** 2 horas  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Sprint 3 US-007 completada (modelo BlogPost existe)

#### QUÉ HACER:

Crear endpoints CRUD para que admin pueda gestionar artículos.

#### QUÉ DEBE CUMPLIR:

- [ ] POST `/api/admin/blog` - Crear artículo
  - Requiere autenticación + role admin
  - Recibe: title, content, excerpt, featuredImage, category, status (draft/published)
  - Auto-generar slug desde title
  - Verificar unicidad de slug
  - Si status='published', agregar publishedAt=now
  - Retornar artículo creado
- [ ] PUT `/api/admin/blog/:id` - Editar artículo
  - Requiere autenticación + role admin
  - Actualizar campos enviados
  - Si cambia title, regenerar slug
  - Retornar artículo actualizado
- [ ] PATCH `/api/admin/blog/:id/publish` - Publicar artículo
  - Cambiar status de draft a published
  - Agregar publishedAt=now
  - Retornar artículo publicado
- [ ] DELETE `/api/admin/blog/:id` - Archivar artículo
  - Soft delete o cambiar status a 'archived'
  - Retornar confirmación
- [ ] GET `/api/admin/blog` - Listar todos los artículos (incluye drafts)
  - Requiere autenticación + role admin
  - Filtros: status (all/draft/published/archived)
  - Ordenado por updatedAt descendente
  - Paginación

#### VALIDACIONES:

- [ ] Title requerido
- [ ] Content requerido
- [ ] Category debe ser válida (enum)
- [ ] Slug único

#### ARCHIVOS AFECTADOS:

- `backend/src/controllers/blogController.js`
- `backend/src/routes/admin/blog.js`
- `backend/src/utils/slugify.js` (crear utilidad)

---

### Task 10.2: Slug Generation Utility (Backend)

**Estimated:** 30 minutos  
**Priority:** MEDIUM  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Ninguna

#### QUÉ HACER:

Crear utilidad para generar slugs únicos desde títulos.

#### QUÉ DEBE CUMPLIR:

- [ ] Función slugify(text)
  - Convertir a lowercase
  - Reemplazar espacios con guiones
  - Remover caracteres especiales
  - Remover acentos (ñ → n, á → a, etc.)
  - Limitar longitud (ej: 100 caracteres)
- [ ] Función generateUniqueSlug(title, BlogPost)
  - Generar slug base con slugify
  - Verificar si existe en DB
  - Si existe, agregar sufijo numérico (-2, -3, etc.)
  - Retornar slug único

#### ARCHIVOS AFECTADOS:

- `backend/src/utils/slugify.js` (crear)

---

### Task 10.3: Rich Text Editor Setup (Frontend)

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** done
**Dependencies:** Ninguna

**✅ COMPLETADO** - 2025-11-14
- Dependencias instaladas: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-image
- Archivo creado: `frontend/src/shared/components/RichTextEditor.jsx` (~380 líneas)
- Archivo de ejemplos creado: `frontend/src/shared/components/RichTextEditor.example.jsx`
- Toolbar completo con 12 opciones: Undo, Redo, Bold, Italic, H2, H3, Bullet List, Ordered List, Link, Image
- Integración perfecta con React Hook Form vía Controller
- Output HTML válido con clases Tailwind para estilizado
- Importación de HTML existente funcional (prop value)
- Custom styles inline para ProseMirror
- Responsive design completo
- Placeholder customizable
- Error handling integrado
- Disabled state funcional
- Validaciones de contenido en ejemplo (min/max caracteres sin HTML tags)

#### QUÉ HACER:

Investigar, elegir e instalar editor de texto rico para el blog.

#### QUÉ DEBE CUMPLIR:

- [x] Evaluar opciones: Tiptap, Quill, TinyMCE
- [x] Decisión: Tiptap (moderno, React-friendly, ligero)
- [x] Instalar dependencias necesarias
- [x] Crear componente wrapper RichTextEditor.jsx
- [x] Configurar toolbar con:
  - Negritas, cursivas
  - Títulos H2, H3
  - Listas (ordenadas, desordenadas)
  - Links
  - Insertar imagen (URL)
- [x] Integrar con React Hook Form
- [x] Exportar contenido como HTML
- [x] Importar HTML para edición

#### VALIDACIONES:

- [x] Editor funciona correctamente
- [x] Output es HTML válido
- [x] Puede cargar HTML existente
- [x] Responsive

#### ARCHIVOS AFECTADOS:

- `frontend/src/shared/components/RichTextEditor.jsx` (creado ✅)
- `frontend/src/shared/components/RichTextEditor.example.jsx` (creado ✅)
- `package.json` (dependencias agregadas ✅)

#### DEPENDENCIAS EXTERNAS:

- @tiptap/react ✅
- @tiptap/starter-kit ✅
- @tiptap/extension-link ✅
- @tiptap/extension-image ✅

---

### Task 10.4: BlogPostForm Component (Frontend)

**Estimated:** 3 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 10.1, 10.3, Task 8.2 (upload service) completadas

**✅ COMPLETADO** - 2025-11-14
- Archivo creado: `frontend/src/features/admin/blog/BlogPostForm.jsx` (~550 líneas)
- Modo create y edit implementados
- 6 campos del formulario completos: título, slug, contenido, extracto, imagen, categoría
- Schema de validación Yup completo con 6 validaciones
- Auto-generación de slug desde título (normalize + URL-friendly)
- Auto-generación de extracto desde contenido (primeros 150 chars sin HTML)
- Preview de slug con URL completa: https://entreamigas.ca/blog/{slug}
- Upload de imagen con validación (JPG/PNG/WebP, max 5MB)
- Preview de imagen con botón remover
- Integración perfecta con RichTextEditor (Task 10.3)
- 9 categorías disponibles: emprendimiento, educación, salud, legal, tecnología, cultura, finanzas, familia, otro
- 3 botones: Cancelar, Guardar Borrador, Publicar
- Loading states en todos los botones
- Error handling completo
- Props: mode, initialData, onSubmit, onCancel, isLoading
- Responsive design

#### QUÉ HACER:

Crear formulario para crear y editar artículos de blog.

#### QUÉ DEBE CUMPLIR:

- [x] Componente BlogPostForm.jsx con dos modos: create y edit
- [x] Campos del formulario:
  - Título (text, requerido)
  - Slug (text, auto-generado, editable, muestra preview)
  - Contenido (RichTextEditor, requerido)
  - Extracto (textarea, opcional, auto-genera de content si vacío)
  - Imagen destacada (file upload con preview)
  - Categoría (dropdown, requerido)
- [x] Validaciones con React Hook Form + Yup:
  - Título requerido (min 10 caracteres)
  - Contenido requerido (min 100 caracteres)
  - Categoría requerida
- [x] Upload de imagen destacada:
  - Preview de imagen
  - Llamar a POST /api/upload/image
  - Guardar URL
- [x] Auto-generación de extracto:
  - Si campo vacío, tomar primeros 150 caracteres del content (sin HTML)
- [x] Preview de slug mientras escribe título
- [x] Botones:
  - "Guardar como Borrador"
  - "Publicar"
  - "Cancelar"
  - Loading states
- [x] Mensajes de éxito/error

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/blog/BlogPostForm.jsx` (creado ✅)

---

### Task 10.5: AdminBlogList Component (Frontend)

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 10.1 completada

**✅ COMPLETADO** - 2025-11-14
- Archivo creado: `frontend/src/features/admin/blog/AdminBlogList.jsx` (~700 líneas)
- Tabla completa con 5 columnas: Artículo (imagen+título+excerpt), Categoría, Estado, Fecha, Acciones
- 3 filtros implementados: Estado dropdown (all/draft/published/archived), Categoría dropdown (10 opciones), Búsqueda por título
- Paginación: 10 artículos por página con botones previous/next y contador
- 4 acciones por artículo: Editar (modal), Ver (nueva pestaña), Publicar (solo drafts), Archivar (modal confirmación)
- 2 modales integrados: CreateModal y EditModal con BlogPostForm (Task 10.4)
- ConfirmArchiveModal con advertencia y confirmación
- CRUD completo: GET, POST, PUT (edit), PATCH (publish/archive)
- Badge system: 3 status badges (Borrador/Publicado/Archivado) y 9 category badges con colores
- Loading state con spinner
- Empty state con mensaje contextual según filtros
- Error state con retry button
- Responsive design completo
- Endpoints backend: /admin/blog/posts (GET, POST, PUT, PATCH)

#### QUÉ HACER:

Crear vista de lista de artículos para el admin.

#### QUÉ DEBE CUMPLIR:

- [x] Lista/tabla de todos los artículos
- [x] Columnas:
  - Imagen destacada (thumbnail)
  - Título
  - Categoría (badge con color)
  - Estado (draft/published/archived con badge)
  - Fecha de publicación (o "Sin publicar" si draft)
  - Acciones
- [x] Filtros:
  - Por estado: Todos / Borradores / Publicados / Archivados
  - Por categoría
  - Búsqueda por título
- [x] Acciones por artículo:
  - Botón "Editar" → abre form en modo edit
  - Botón "Ver" → preview del artículo
  - Botón "Publicar" (solo si draft) → confirmar y publicar
  - Botón "Archivar" → modal de confirmación
- [x] Botón principal: "Crear Nuevo Artículo"
- [x] Paginación (10 artículos por página)
- [x] Loading states
- [x] Empty state

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/blog/AdminBlogList.jsx` (creado ✅)

---

### Task 10.6: BlogPost Preview Modal (Frontend)

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** done
**Dependencies:** Task 10.4 completada

**✅ COMPLETADO** - 2025-11-14
- Archivo creado: `frontend/src/features/admin/blog/BlogPostPreview.jsx` (~250 líneas)
- Modal completo con header, body y footer
- Imagen destacada full-width (h-64 en mobile, h-80 en desktop)
- Metadata completa: category badge con color + fecha con ícono
- Título prominente: 3xl en mobile, 4xl en desktop
- Extracto con estilo blockquote (border-left primary)
- Contenido renderizado como HTML con dangerouslySetInnerHTML
- Tipografía optimizada: Georgia serif para cuerpo, system-ui para títulos
- Prose classes de Tailwind para estilos de artículo
- Custom styles inline para código, blockquotes, imágenes
- 2 botones: Cerrar (siempre), Publicar (solo si draft)
- Props: post, isOpen, onClose, onPublish (opcional)
- Responsive: max-w-3xl contenedor, padding adaptativo, prose-lg
- Separador HR entre metadata y contenido
- Alto máximo: 95vh con scroll interno

#### QUÉ HACER:

Crear modal de preview para ver cómo se verá el artículo publicado.

#### QUÉ DEBE CUMPLIR:

- [x] Modal que recibe postId o postData
- [x] Renderiza artículo como se verá en público:
  - Imagen destacada arriba
  - Título grande
  - Metadata: categoría, fecha
  - Contenido renderizado (HTML del editor)
  - Tipografía optimizada para lectura
- [x] Botones:
  - "Cerrar"
  - "Publicar" (si es draft)
- [x] Responsive

#### ARCHIVOS AFECTADOS:

- `frontend/src/features/admin/blog/BlogPostPreview.jsx` (creado ✅)

---

### Task 10.7: Integrar en Admin Layout (Frontend)

**Estimated:** 30 minutos
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ COMPLETADO (2025-11-14)
**Dependencies:** Task 10.4, 10.5, 10.6 completadas

#### QUÉ HACER:

Integrar la gestión de blog en el panel de admin.

#### QUÉ DEBE CUMPLIR:

- [x] Agregar link "Gestionar Blog" en sidebar de admin
- [x] Ruta: `/admin/blog`
- [x] Componente principal: AdminBlogList
- [x] Ruta protegida con AdminRoute
- [x] Navegación funcional

#### ARCHIVOS AFECTADOS:

- ✅ `frontend/src/features/admin/components/AdminLayout.jsx` - Agregado link "Blog" con icono FileText en navigation array
- ✅ `frontend/src/routes/AppRoutes.jsx` - Agregada ruta protegida /admin/blog con AdminRoute wrapper
- ✅ `frontend/src/features/admin/pages/AdminBlogPage.jsx` - Creado wrapper que renderiza AdminBlogList

#### LO QUE SE IMPLEMENTÓ:

**1. Modificado AdminLayout.jsx:**
   - Importado icono FileText de lucide-react
   - Agregado item "Blog" a navigation array con path '/admin/blog'
   - Posicionado entre "Servicios" y "Usuarios"
   - Descripción: "Gestión del blog"

**2. Creado AdminBlogPage.jsx:**
   - Wrapper simple que renderiza `<AdminBlogList />`
   - 14 líneas de código
   - Sigue patrón de otras admin pages

**3. Modificado AppRoutes.jsx:**
   - Importado AdminBlogPage
   - Agregada ruta /admin/blog con AdminRoute wrapper
   - Protegida con autenticación admin
   - Comentario: "Admin Blog - Sprint 4 Task 10.7"

**Resultado:** Navegación completa al panel de gestión de blog desde sidebar de admin, con acceso protegido solo para usuarios admin.

---

### Task 10.8: Testing Admin Blog (Backend + Frontend)

**Estimated:** 1.5 horas  
**Priority:** HIGH  
**Assignee:** Backend + Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Todas las tareas de US-010 anteriores completadas

#### QUÉ HACER:

Testing completo del sistema de blog admin.

#### BACKEND - ESCENARIOS:

- [ ] POST /api/admin/blog con status=draft
- [ ] POST /api/admin/blog con status=published
- [ ] GET /api/admin/blog?status=draft
- [ ] PUT /api/admin/blog/:id
- [ ] PATCH /api/admin/blog/:id/publish
- [ ] DELETE /api/admin/blog/:id
- [ ] Verificar slugs únicos

#### FRONTEND - FLUJOS:

- [ ] Crear artículo como borrador
- [ ] Verificar aparece en lista con badge "Draft"
- [ ] Editar artículo
- [ ] Preview del artículo
- [ ] Publicar artículo desde lista
- [ ] Verificar aparece como "Publicado"
- [ ] Verificar aparece en blog público
- [ ] Upload de imagen destacada
- [ ] Editor rico: negritas, listas, links
- [ ] Auto-generación de extracto
- [ ] Archivar artículo
- [ ] Filtros y búsqueda
- [ ] Responsive

#### CHECKLIST:

- [ ] CRUD funciona
- [ ] Drafts vs Published funciona
- [ ] Editor rico funciona
- [ ] Preview funciona
- [ ] No hay errores
- [ ] Responsive OK

---

## 🚀 INFRA-005: CI/CD Pipeline Setup (5 pts)

### Task CI-1: GitHub Actions Workflow (Backend)

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Done
**Dependencies:** Código en GitHub

#### QUÉ HACER:

Configurar GitHub Actions para CI/CD del backend.

#### QUÉ DEBE CUMPLIR:

- [x] Crear archivo `.github/workflows/backend-ci-cd.yml`
- [x] Triggers:
  - Push a branch `main`
  - Pull requests a `main`
- [x] Jobs:
  - **lint**: Ejecutar ESLint
  - **test**: Ejecutar tests (si existen)
  - **build**: Verificar que no hay errores de compilación
  - **deploy**: Deploy a Railway/Render (solo en main)
- [x] Configurar secrets en GitHub:
  - MONGODB_URI
  - JWT_SECRET
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - RESEND_API_KEY
- [x] Notificaciones de éxito/fallo

#### ARCHIVOS AFECTADOS:

- `.github/workflows/backend-ci-cd.yml` (crear)

---

### Task CI-2: GitHub Actions Workflow (Frontend)

**Estimated:** 1.5 horas  
**Priority:** HIGH  
**Assignee:** Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Código en GitHub

#### QUÉ HACER:

Configurar GitHub Actions para CI/CD del frontend.

#### QUÉ DEBE CUMPLIR:

- [ ] Crear archivo `.github/workflows/frontend-ci-cd.yml`
- [ ] Triggers:
  - Push a branch `main`
  - Pull requests a `main`
- [ ] Jobs:
  - **lint**: Ejecutar ESLint
  - **build**: Build de producción con Vite
  - **deploy**: Deploy a Vercel/Netlify (solo en main)
- [ ] Configurar secrets:
  - VITE_API_URL
  - VERCEL_TOKEN (o NETLIFY_TOKEN)
- [ ] Build artifacts guardados

#### ARCHIVOS AFECTADOS:

- `.github/workflows/frontend-ci-cd.yml` (crear)

---

### Task CI-3: Environment Variables Config (Backend)

**Estimated:** 1 hora  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Ninguna

#### QUÉ HACER:

Documentar y configurar todas las variables de entorno necesarias.

#### QUÉ DEBE CUMPLIR:

- [ ] Crear `.env.example` con todas las variables:
  - NODE_ENV
  - PORT
  - MONGODB_URI
  - JWT_SECRET
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_S3_BUCKET
  - AWS_REGION
  - RESEND_API_KEY
  - FRONTEND_URL
- [ ] Documentar cada variable en README
- [ ] Verificar que .env está en .gitignore
- [ ] Crear checklist de configuración

#### ARCHIVOS AFECTADOS:

- `.env.example` (crear)
- `README.md` (actualizar)
- `.gitignore` (verificar)

---

### Task CI-4: Testing Scripts (Backend)

**Estimated:** 1 hora  
**Priority:** MEDIUM  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Ninguna

#### QUÉ HACER:

Preparar scripts de testing básicos para CI.

#### QUÉ DEBE CUMPLIR:

- [ ] Script `npm run lint` - ejecutar ESLint
- [ ] Script `npm run test` - ejecutar tests (aunque sea dummy)
- [ ] Script `npm run build` - verificar que no hay errores
- [ ] Scripts funcionales en CI

#### ARCHIVOS AFECTADOS:

- `package.json` (scripts)
- `.eslintrc.js` (si no existe)

---

### Task CI-5: Deploy Configuration (Backend + Frontend)

**Estimated:** 1.5 horas  
**Priority:** HIGH  
**Assignee:** Backend + Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Task CI-1, CI-2, CI-3 completadas

#### QUÉ HACER:

Configurar plataformas de deploy.

#### BACKEND - Railway/Render:

- [ ] Crear proyecto
- [ ] Conectar repositorio GitHub
- [ ] Configurar auto-deploy desde main
- [ ] Configurar variables de entorno
- [ ] Configurar start command
- [ ] Verificar health check

#### FRONTEND - Vercel/Netlify:

- [ ] Crear proyecto
- [ ] Conectar repositorio GitHub
- [ ] Configurar auto-deploy desde main
- [ ] Configurar build command: `npm run build`
- [ ] Configurar output directory: `dist`
- [ ] Configurar variables de entorno
- [ ] Configurar rewrites para SPA

#### ARCHIVOS AFECTADOS:

- `vercel.json` o `netlify.toml` (crear si necesario)

---

## 🌐 INFRA-006: Deploy a Producción (3 pts)

### Task DP-1: Frontend Deploy & Verification (Frontend)

**Estimated:** 1.5 horas  
**Priority:** HIGH  
**Assignee:** Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Task CI-2, CI-5 completadas

#### QUÉ HACER:

Deploy del frontend a producción y verificación.

#### QUÉ DEBE CUMPLIR:

- [ ] Push a main trigger deploy automático
- [ ] Build exitoso en plataforma
- [ ] Aplicación accesible en URL pública
- [ ] HTTPS habilitado automáticamente
- [ ] Variables de entorno correctas (apuntan a backend prod)
- [ ] Testing básico en producción:
  - Landing page carga
  - Login funciona
  - Dashboard carga
  - No errores en consola

#### VERIFICACIONES:

- [ ] URL pública funciona
- [ ] HTTPS activo
- [ ] SPA routing funciona (refresh no da 404)
- [ ] Assets cargan correctamente

---

### Task DP-2: Backend Deploy & Verification (Backend)

**Estimated:** 1.5 horas  
**Priority:** HIGH  
**Assignee:** Backend  
**Status:** 🔲 To Do  
**Dependencies:** Task CI-1, CI-5 completadas

#### QUÉ HACER:

Deploy del backend a producción y verificación.

#### QUÉ DEBE CUMPLIR:

- [ ] Push a main trigger deploy automático
- [ ] Build exitoso
- [ ] Servidor corriendo en URL pública
- [ ] MongoDB Atlas prod conectado
- [ ] Variables de entorno configuradas
- [ ] Testing básico:
  - GET /api/health retorna 200
  - POST /api/auth/login funciona
  - Endpoints protegidos requieren auth

#### VERIFICACIONES:

- [ ] URL backend funciona
- [ ] Conexión a MongoDB exitosa
- [ ] Logs accesibles
- [ ] No errores críticos

---

### Task DP-3: Domain & SSL Configuration (Backend + Frontend)

**Estimated:** 1 hora  
**Priority:** MEDIUM  
**Assignee:** Backend + Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Task DP-1, DP-2 completadas

#### QUÉ HACER:

Configurar dominio personalizado y SSL (si aplica).

#### QUÉ DEBE CUMPLIR:

- [ ] Dominio adquirido (si se decide usar)
- [ ] DNS configurado:
  - A record o CNAME para frontend
  - A record o CNAME para backend (api.dominio.com)
- [ ] SSL certificados generados (automático en Vercel/Railway)
- [ ] CORS configurado correctamente
- [ ] URLs actualizadas en variables de entorno

#### VERIFICACIONES:

- [ ] Dominio resuelve correctamente
- [ ] HTTPS funciona en ambos
- [ ] CORS permite requests

---

### Task DP-4: Production Smoke Testing (Backend + Frontend)

**Estimated:** 2 horas  
**Priority:** HIGH  
**Assignee:** Backend + Frontend  
**Status:** 🔲 To Do  
**Dependencies:** Todas las tareas anteriores completadas

#### QUÉ HACER:

Testing completo end-to-end en producción.

#### FLUJOS CRÍTICOS A PROBAR:

- [ ] **Registro de usuario:**
  - Registro exitoso
  - Email de verificación llega
  - Verificar email funciona
- [ ] **Login:**
  - User regular login funciona
  - Admin login funciona
  - Redirecciones correctas
- [ ] **Eventos:**
  - Ver lista de eventos
  - Registrarse a evento
  - Email de confirmación llega
  - Ver "Mis Eventos"
- [ ] **Blog:**
  - Ver lista de artículos
  - Leer artículo completo
- [ ] **Directorios:**
  - Ver negocios
  - Ver servicios
  - Filtros funcionan
- [ ] **Admin:**
  - Admin puede login
  - Crear evento
  - Upload imagen funciona
  - Crear artículo de blog
  - Editor rico funciona
  - Publicar artículo
  - Ver en blog público

#### CHECKLIST FINAL:

- [ ] Todos los flujos funcionan
- [ ] Emails llegan correctamente
- [ ] Uploads de imágenes funcionan
- [ ] No hay errores 500
- [ ] Performance es aceptable
- [ ] Responsive funciona
- [ ] No hay console errors críticos

#### DOCUMENTAR:

- [ ] Issues encontrados
- [ ] Bugs a fix post-launch
- [ ] Performance metrics

---

## 📊 RESUMEN DE TAREAS

### Por User Story:

| Story                      | Tareas | Tiempo |
| -------------------------- | ------ | ------ |
| **US-008 (Admin Eventos)** | 10     | 14h    |
| **US-010 (Admin Blog)**    | 8      | 14h    |
| **INFRA-005 (CI/CD)**      | 5      | 7h     |
| **INFRA-006 (Deploy)**     | 4      | 6h     |
| **TOTAL**                  | 27     | 41h    |

### Por Área:

| Área         | Tareas | Tiempo |
| ------------ | ------ | ------ |
| **DB**       | 0      | 0h     |
| **Backend**  | 12     | 16h    |
| **Frontend** | 12     | 18h    |
| **DevOps**   | 3      | 7h     |
| **TOTAL**    | 27     | 41h    |

---

## 🔗 DIAGRAMA DE DEPENDENCIAS

```
US-008: ADMIN EVENTOS
├─ Task 8.1 (BE: Endpoints) ─────┬─────────────┐
├─ Task 8.2 (BE: Upload Service) ┘             │
├─ Task 8.3 (BE: CSV Export) ← 8.1             │
│                                               │
├─ Task 8.4 (FE: EventForm) ← 8.1, 8.2         │
├─ Task 8.5 (FE: EventList) ← 8.1              │
├─ Task 8.6 (FE: Registrations) ← 8.1, 8.3     │
├─ Task 8.7 (FE: Integration) ← 8.4, 8.5, 8.6  │
│                                               │
├─ Task 8.8 (BE: Seed) ← 8.1                   │
├─ Task 8.9 (BE: Testing) ← 8.1, 8.2, 8.3      │
└─ Task 8.10 (FE: Testing) ← 8.4-8.7           │
                                                │
US-010: ADMIN BLOG                              │
├─ Task 10.1 (BE: Endpoints) ───────────┐      │
├─ Task 10.2 (BE: Slugify)              │      │
├─ Task 10.3 (FE: Editor Setup)         │      │
│                                        │      │
├─ Task 10.4 (FE: BlogForm) ← 10.1, 10.3, 8.2  │
├─ Task 10.5 (FE: BlogList) ← 10.1             │
├─ Task 10.6 (FE: Preview) ← 10.4              │
├─ Task 10.7 (FE: Integration) ← 10.4-10.6     │
└─ Task 10.8 (Testing) ← All 10.x              │
                                                │
INFRA-005: CI/CD                                │
├─ Task CI-1 (BE: GitHub Actions)              │
├─ Task CI-2 (FE: GitHub Actions)              │
├─ Task CI-3 (BE: Env Config)                  │
├─ Task CI-4 (BE: Test Scripts)                │
└─ Task CI-5 (Deploy Config) ← CI-1,2,3        │
                                                │
INFRA-006: DEPLOY ← All above                   │
├─ Task DP-1 (FE Deploy) ← CI-2, CI-5          │
├─ Task DP-2 (BE Deploy) ← CI-1, CI-5          │
├─ Task DP-3 (Domain) ← DP-1, DP-2             │
└─ Task DP-4 (Testing) ← DP-1, DP-2, DP-3      │
                                                │
                        MVP COMPLETO ✅          │
```

---

## ✅ DEFINITION OF DONE

Sprint 4 está completo cuando:

### US-008: Admin Eventos

- [ ] Admin puede crear eventos
- [ ] Admin puede editar eventos
- [ ] Admin puede cancelar eventos
- [ ] Admin puede ver lista de registradas
- [ ] Admin puede exportar CSV
- [ ] Upload de imágenes funciona
- [ ] Todo responsive y sin errores

### US-010: Admin Blog

- [ ] Admin puede crear artículos
- [ ] Admin puede guardar borradores
- [ ] Admin puede publicar artículos
- [ ] Editor rico funciona correctamente
- [ ] Preview funciona
- [ ] Artículos aparecen en blog público
- [ ] Todo responsive y sin errores

### INFRA-005: CI/CD

- [ ] GitHub Actions configurado
- [ ] Push a main hace deploy automático
- [ ] Variables de entorno configuradas
- [ ] Build exitoso en plataformas

### INFRA-006: Deploy

- [ ] Frontend en producción funcionando
- [ ] Backend en producción funcionando
- [ ] HTTPS habilitado
- [ ] Todos los flujos críticos probados
- [ ] No hay errores críticos

### General

- [ ] MVP 100% funcional
- [ ] Testing completo pasado
- [ ] Documentación actualizada
- [ ] Listo para usuarios reales

---

**END OF SPRINT 4 TASKS**
