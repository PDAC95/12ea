# PROMPT QA - VALIDACIÓN FINAL MVP
**Proyecto:** Entre Amigas - Plataforma Comunitaria
**Fecha:** 2025-12-01
**Versión:** MVP v1.0
**Commit:** 85117b1

---

## OBJETIVO
Ejecutar una validación QA completa de todas las funcionalidades implementadas en el MVP para confirmar que el sistema está listo para producción. **NO realizar cambios en el código**, solo documentar hallazgos y dar el visto bueno final.

---

## CONTEXTO DEL SISTEMA

### URLs del Sistema
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/v1
- **Admin Panel:** http://localhost:5173/admin

### Credenciales de Prueba
- **Admin:** dev@jappi.ca / Password123
- **Usuario Regular:** (registrar nuevo o usar existente)

### Stack Tecnológico
- **Frontend:** React 18 + Vite + Bootstrap 5 + Lucide Icons
- **Backend:** Express.js + Node.js
- **Base de Datos:** MongoDB (entreamigas-dev)
- **Autenticación:** JWT

---

## MÓDULOS A VALIDAR

El MVP incluye los siguientes módulos completamente funcionales:

1. ✅ **Autenticación y Usuarios**
2. ✅ **Negocios (Businesses)**
3. ✅ **Servicios (Services)**
4. ✅ **Eventos (Events)**
5. ✅ **Blog**
6. ✅ **Tips Comunitarios**
7. ✅ **Panel de Administración**

---

## CHECKLIST DE VALIDACIÓN QA

### 1. AUTENTICACIÓN Y USUARIOS

#### 1.1 Registro de Usuario
**URL:** http://localhost:5173/register

- [ ] El formulario de registro muestra todos los campos requeridos
- [ ] Validación de email (formato correcto)
- [ ] Validación de contraseña (mínimo 8 caracteres, mayúscula, minúscula, número)
- [ ] Campo "Nombre Completo" es requerido
- [ ] Campo "Nombre Preferido" es opcional
- [ ] Checkbox de términos y condiciones funciona
- [ ] Al registrarse exitosamente, redirige a página de verificación de email
- [ ] Toast de éxito se muestra correctamente
- [ ] Errores de validación se muestran en español

#### 1.2 Login de Usuario
**URL:** http://localhost:5173/login

- [ ] Login con email y contraseña funciona
- [ ] Checkbox "Recordarme" mantiene sesión activa
- [ ] Mensaje de error claro si credenciales incorrectas
- [ ] Redirige al dashboard/home después de login exitoso
- [ ] Token JWT se guarda en localStorage
- [ ] Link "¿Olvidaste tu contraseña?" visible

#### 1.3 Perfil de Usuario
**URL:** http://localhost:5173/profile

- [ ] Se muestra información del usuario autenticado
- [ ] Se puede editar: Nombre Preferido, Teléfono, Ciudad, Bio
- [ ] Upload de foto de perfil funciona (validar formatos: JPG, PNG, WEBP)
- [ ] Validación de tamaño de imagen (máx 5MB)
- [ ] Cambios se guardan correctamente
- [ ] Toast de éxito al actualizar perfil
- [ ] La imagen de perfil se refleja en el navbar

#### 1.4 Logout
- [ ] Botón de logout visible en navbar/menú
- [ ] Al hacer logout, se limpia el token
- [ ] Redirige a página de login
- [ ] No se puede acceder a rutas protegidas después de logout

---

### 2. NEGOCIOS (BUSINESSES)

#### 2.1 Directorio Público de Negocios
**URL:** http://localhost:5173/businesses

- [ ] Se muestran TODOS los negocios con status='approved'
- [ ] NO se muestran negocios con status='pending' o 'rejected'
- [ ] Cada card de negocio muestra:
  - [ ] Logo (si existe)
  - [ ] Nombre del negocio
  - [ ] Categoría con badge de color
  - [ ] Descripción
  - [ ] Ciudad
  - [ ] Información de contacto (teléfono, email, redes)
- [ ] Filtro por búsqueda funciona (busca por nombre)
- [ ] Filtro por categoría funciona (17 categorías disponibles)
- [ ] Filtro por ciudad funciona
- [ ] Enlaces externos funcionan:
  - [ ] Website se abre en nueva pestaña
  - [ ] Instagram redirige correctamente
  - [ ] WhatsApp/Teléfono funciona

**Categorías a Validar:**
Gastronomía, Belleza y Bienestar, Salud, Fitness, Consultoría, Moda y Accesorios, Servicios del Hogar, Artesanías, Fotografía y Video, Educación y Tutorías, Tecnología, Entretenimiento, Deportes, Automotriz, Bienes Raíces, Seguros, Trámites y Gestorías

#### 2.2 Proponer Nuevo Negocio (Usuario Regular)
**URL:** http://localhost:5173/businesses (Modal "Agregar Mi Negocio")

**Pre-requisito:** Estar autenticado como usuario regular

- [ ] Modal se abre correctamente
- [ ] Campo "Nombre de la Dueña" NO está presente (se asigna automáticamente)
- [ ] Campos requeridos marcados con asterisco (*)
- [ ] Validaciones frontend funcionan:
  - [ ] Nombre del negocio: requerido, max 100 caracteres
  - [ ] Categoría: requerida, una de las 17 opciones
  - [ ] Descripción: requerida, min 50 - max 500 caracteres
  - [ ] Teléfono: requerido, formato válido
  - [ ] Ciudad: requerida
  - [ ] Email: opcional, formato email válido
  - [ ] Website: opcional, formato URL válido
  - [ ] Instagram: opcional, formato @usuario válido
- [ ] Upload de logo funciona:
  - [ ] Rechaza archivos > 5MB con toast error
  - [ ] Rechaza formatos no válidos (solo JPG, PNG, WEBP)
  - [ ] Muestra preview del logo
  - [ ] Puede remover logo
- [ ] Al enviar formulario válido:
  - [ ] Toast de éxito: "¡Gracias! Tu negocio será revisado por nuestro equipo"
  - [ ] Modal se cierra automáticamente
  - [ ] El negocio NO aparece inmediatamente (queda pending)

#### 2.3 Admin - Negocios Pendientes
**URL:** http://localhost:5173/admin/businesses/pending

**Pre-requisito:** Estar autenticado como admin

- [ ] Se muestran SOLO negocios con status='pending'
- [ ] Cada negocio pendiente muestra:
  - [ ] Logo (si existe)
  - [ ] Nombre del negocio
  - [ ] Categoría
  - [ ] Descripción
  - [ ] Información de contacto
  - [ ] Nombre de quien lo envió (owner)
  - [ ] Fecha de envío (createdAt)
  - [ ] Botones: "Aprobar" y "Rechazar"
- [ ] Si NO hay pendientes: mensaje "No hay negocios pendientes"
- [ ] Loading state mientras carga

#### 2.4 Admin - Aprobar Negocio
- [ ] Click en "Aprobar" abre modal de confirmación
- [ ] Modal muestra nombre del negocio
- [ ] Click en "Cancelar" cierra modal sin cambios
- [ ] Click en "Aprobar Negocio":
  - [ ] Toast de éxito: "Negocio '[nombre]' aprobado exitosamente"
  - [ ] Modal se cierra
  - [ ] Negocio desaparece de lista de pendientes
  - [ ] Lista se actualiza automáticamente
- [ ] El negocio aprobado aparece en directorio público
- [ ] Todos los datos se muestran correctamente

#### 2.5 Admin - Rechazar Negocio
- [ ] Click en "Rechazar" abre modal con textarea
- [ ] Intenta rechazar sin razón: toast warning "La razón debe tener al menos 10 caracteres"
- [ ] Razón con < 10 caracteres: mismo error
- [ ] Razón válida (10+ caracteres):
  - [ ] Toast de éxito: "Negocio '[nombre]' rechazado"
  - [ ] Modal se cierra
  - [ ] Negocio desaparece de lista de pendientes
  - [ ] Lista se actualiza
- [ ] Negocio rechazado NO aparece en directorio público

#### 2.6 Admin - Gestión General de Negocios
**URL:** http://localhost:5173/admin/businesses

- [ ] Admin puede ver TODOS los negocios (approved, pending, rejected)
- [ ] Filtros por status funcionan
- [ ] Búsqueda funciona
- [ ] Paginación funciona (si hay más de 20 negocios)
- [ ] Botón de eliminar funciona (hard delete - elimina de BD)
- [ ] Smart pagination: si eliminas el último de una página, va a la anterior
- [ ] Toast de confirmación al eliminar

---

### 3. SERVICIOS (SERVICES)

#### 3.1 Directorio Público de Servicios
**URL:** http://localhost:5173/services

- [ ] Se muestran TODOS los servicios con status='approved'
- [ ] NO se muestran servicios con status='pending' o 'rejected'
- [ ] Cada card de servicio muestra:
  - [ ] Imagen del servicio
  - [ ] Título del servicio
  - [ ] Categoría
  - [ ] Descripción
  - [ ] Precio (si está disponible)
  - [ ] Contacto del proveedor
- [ ] Filtro por búsqueda funciona
- [ ] Filtro por categoría funciona
- [ ] Paginación funciona

#### 3.2 Publicar Servicio (Usuario Regular)
**Pre-requisito:** Estar autenticado

- [ ] Modal/página de publicar servicio se abre
- [ ] Campos requeridos validados correctamente
- [ ] Upload de imágenes funciona
- [ ] Al publicar, el servicio queda en status='pending'
- [ ] Toast de éxito al enviar
- [ ] No aparece inmediatamente en directorio público

#### 3.3 Admin - Aprobar/Rechazar Servicios
**URL:** http://localhost:5173/admin/services

- [ ] Lista de servicios pendientes se muestra
- [ ] Aprobar servicio funciona
- [ ] Rechazar servicio funciona (con razón)
- [ ] Servicio aprobado aparece en directorio público
- [ ] Servicio rechazado NO aparece en directorio público

---

### 4. EVENTOS (EVENTS)

#### 4.1 Directorio Público de Eventos
**URL:** http://localhost:5173/events

- [ ] Se muestran eventos próximos (status='scheduled', isActive=true)
- [ ] NO se muestran eventos cancelados o inactivos
- [ ] Cada card de evento muestra:
  - [ ] Imagen del evento
  - [ ] Título
  - [ ] Fecha y hora
  - [ ] Modalidad (presencial, virtual, híbrido)
  - [ ] Ubicación (si es presencial) o link (si es virtual)
  - [ ] Plazas disponibles / capacidad máxima
  - [ ] Badge "Destacado" (si isFeatured=true)
- [ ] Filtro por modalidad funciona
- [ ] Búsqueda funciona
- [ ] Paginación funciona

#### 4.2 Registro a Evento (Usuario Autenticado)
- [ ] Botón "Registrarse" visible en card de evento
- [ ] Click en "Registrarse" abre modal de confirmación
- [ ] Al confirmar:
  - [ ] Toast de éxito: "¡Te has registrado exitosamente!"
  - [ ] Contador de plazas disminuye
  - [ ] Botón cambia a "Ya Registrado" (disabled)
- [ ] Si evento está lleno (maxAttendees alcanzado):
  - [ ] Botón "Registrarse" está disabled
  - [ ] Mensaje "Evento Lleno" visible
- [ ] Usuario NO puede registrarse dos veces al mismo evento

#### 4.3 Mis Eventos (Usuario Autenticado)
**URL:** http://localhost:5173/profile (sección "Mis Eventos")

- [ ] Se muestran eventos a los que el usuario está registrado
- [ ] Solo eventos próximos (status='confirmed', evento futuro)
- [ ] Información completa del evento visible
- [ ] Opción de cancelar registro (si aplica)

#### 4.4 Admin - Crear Evento
**URL:** http://localhost:5173/admin/events

- [ ] Botón "Crear Nuevo Evento" visible
- [ ] Modal de creación se abre
- [ ] Campos requeridos:
  - [ ] Título
  - [ ] Descripción
  - [ ] Fecha
  - [ ] Hora
  - [ ] Modalidad (presencial/virtual/híbrido)
  - [ ] Capacidad máxima
- [ ] Campos opcionales:
  - [ ] Imagen del evento
  - [ ] Ubicación (si presencial)
  - [ ] Link (si virtual)
  - [ ] isFeatured checkbox
- [ ] Upload de imagen funciona
- [ ] Al crear evento:
  - [ ] Toast de éxito
  - [ ] Modal se cierra
  - [ ] Evento aparece en lista de admin
  - [ ] Evento aparece en directorio público (si isActive=true)

#### 4.5 Admin - Editar Evento
- [ ] Click en botón "Editar" abre modal con datos del evento
- [ ] Todos los campos editables
- [ ] Cambios se guardan correctamente
- [ ] Toast de éxito al actualizar
- [ ] Cambios se reflejan inmediatamente

#### 4.6 Admin - Ver Registros de Evento
- [ ] Click en botón "Ver Registros" (ícono Eye)
- [ ] Modal muestra lista de usuarios registrados
- [ ] Información visible: nombre, email, fecha de registro
- [ ] Contador de registros correcto

#### 4.7 Admin - Cancelar Evento (Soft Delete)
**CRÍTICO - NUEVA FUNCIONALIDAD**

- [ ] Botón naranja con ícono XCircle visible
- [ ] Title tooltip: "Cancelar Evento (soft delete)"
- [ ] Botón disabled si evento ya está cancelado
- [ ] Click en botón naranja abre modal de cancelación
- [ ] Modal muestra:
  - [ ] Nombre del evento
  - [ ] Fecha y hora
  - [ ] Número de registrados
  - [ ] Mensaje informativo naranja: "El evento será marcado como cancelado pero se mantendrá en la base de datos"
- [ ] Click en "Confirmar Cancelación":
  - [ ] Toast de éxito: "Evento '[nombre]' cancelado exitosamente"
  - [ ] Modal se cierra
  - [ ] Lista se actualiza
  - [ ] El evento YA NO aparece en directorio público
  - [ ] El evento PERMANECE en la base de datos con status='cancelled'
- [ ] Verificar en MongoDB: status='cancelled', isActive=false

#### 4.8 Admin - Eliminar Evento Permanentemente (Hard Delete)
**CRÍTICO - NUEVA FUNCIONALIDAD**

- [ ] Botón rojo con ícono Trash2 visible
- [ ] Title tooltip: "Eliminar Permanentemente"
- [ ] Click en botón rojo abre modal de eliminación
- [ ] Modal muestra:
  - [ ] Nombre del evento
  - [ ] Fecha y hora
  - [ ] Número de registrados
  - [ ] **Advertencia ROJA**: "⚠️ Esta acción no se puede deshacer. El evento será eliminado permanentemente de la base de datos."
- [ ] Click en "Eliminar Permanentemente":
  - [ ] Toast de éxito: "Evento '[nombre]' eliminado permanentemente"
  - [ ] Modal se cierra
  - [ ] Lista se actualiza
  - [ ] El evento desaparece de lista de admin
  - [ ] El evento NO aparece en directorio público
  - [ ] El evento FUE ELIMINADO de la base de datos
- [ ] Verificar en MongoDB: el evento NO existe (hard delete ejecutado)
- [ ] Todas las registraciones asociadas también fueron eliminadas

#### 4.9 Diferencia entre Cancelar y Eliminar
**VALIDACIÓN CRÍTICA**

- [ ] Botón naranja (XCircle) = CANCELAR (soft delete, queda en BD)
- [ ] Botón rojo (Trash2) = ELIMINAR (hard delete, se borra de BD)
- [ ] Ambos botones visibles y diferenciados por color
- [ ] Modales tienen mensajes diferentes (naranja vs rojo)
- [ ] Backend recibe llamada correcta:
  - [ ] Cancelar: `DELETE /admin/events/:id` (sin ?hard=true)
  - [ ] Eliminar: `DELETE /admin/events/:id?hard=true`

---

### 5. BLOG

#### 5.1 Blog Público
**URL:** http://localhost:5173/blog

- [ ] Se muestran artículos con status='published'
- [ ] NO se muestran drafts
- [ ] Artículos destacados (isFeatured=true) aparecen primero
- [ ] Cada card muestra:
  - [ ] Imagen destacada
  - [ ] Título
  - [ ] Excerpt/resumen
  - [ ] Categoría
  - [ ] Fecha de publicación
  - [ ] Autor
- [ ] Filtro por categoría funciona
- [ ] Búsqueda funciona
- [ ] Paginación funciona

#### 5.2 Ver Artículo Completo
**URL:** http://localhost:5173/blog/:slug

- [ ] Artículo completo se despliega
- [ ] Formato Markdown renderizado correctamente
- [ ] Imagen destacada visible
- [ ] Metadata (autor, fecha, categoría) visible
- [ ] Botón "Compartir" funciona (si aplica)
- [ ] Artículos relacionados se muestran (si aplica)

#### 5.3 Admin - Lista de Artículos
**URL:** http://localhost:5173/admin/blog

- [ ] Se muestran TODOS los artículos (drafts y published)
- [ ] Filtros por status funcionan:
  - [ ] Todos
  - [ ] Borradores
  - [ ] Publicados
  - [ ] Destacados
- [ ] Búsqueda por título funciona
- [ ] Tabla muestra:
  - [ ] Imagen
  - [ ] Título
  - [ ] Categoría
  - [ ] Status
  - [ ] Fecha
  - [ ] Acciones (Editar, Publicar/Despublicar, Eliminar)

#### 5.4 Admin - Crear Artículo
- [ ] Botón "Crear Nuevo Artículo" visible
- [ ] Editor de artículo se abre
- [ ] Campos disponibles:
  - [ ] Título
  - [ ] Slug (auto-generado del título)
  - [ ] Excerpt
  - [ ] Contenido (Markdown editor)
  - [ ] Categoría
  - [ ] Imagen destacada
  - [ ] isFeatured checkbox
- [ ] Botón "Guardar como Borrador" guarda con status='draft'
- [ ] Botón "Publicar" guarda con status='published'
- [ ] Toast de éxito al guardar
- [ ] Artículo aparece en lista de admin

#### 5.5 Admin - Editar Artículo
- [ ] Click en "Editar" abre editor con datos del artículo
- [ ] Todos los campos editables
- [ ] Cambios se guardan correctamente
- [ ] Toast de éxito

#### 5.6 Admin - Publicar/Despublicar Artículo
- [ ] Botón "Publicar" cambia status de 'draft' a 'published'
- [ ] Botón "Despublicar" cambia status de 'published' a 'draft'
- [ ] Toast de confirmación
- [ ] Artículo publicado aparece en blog público
- [ ] Artículo despublicado NO aparece en blog público

#### 5.7 Admin - Eliminar Artículo Permanentemente
**CRÍTICO - FUNCIONALIDAD ACTUALIZADA**

- [ ] Botón rojo con ícono Trash2 visible (NO Archive)
- [ ] Click en "Eliminar" abre modal de confirmación
- [ ] Modal muestra:
  - [ ] Título del artículo
  - [ ] Excerpt
  - [ ] **Advertencia ROJA**: "⚠️ Esta acción no se puede deshacer. El artículo será eliminado permanentemente de la base de datos."
- [ ] Click en "Eliminar Permanentemente":
  - [ ] Loading state visible
  - [ ] Toast de éxito al eliminar
  - [ ] Modal se cierra
  - [ ] Artículo desaparece de lista
  - [ ] Lista se actualiza automáticamente
- [ ] Verificar en MongoDB: artículo fue eliminado (hard delete)
- [ ] NO existe opción de "Archivar" (fue removida)

---

### 6. TIPS COMUNITARIOS

#### 6.1 Tips Públicos
**URL:** http://localhost:5173/tips

- [ ] Se muestran tips con status='approved'
- [ ] NO se muestran tips pendientes o rechazados
- [ ] Cada tip muestra:
  - [ ] Título
  - [ ] Contenido
  - [ ] Categoría
  - [ ] Autor (usuario que lo publicó)
  - [ ] Fecha
- [ ] Filtro por categoría funciona
- [ ] Búsqueda funciona
- [ ] Paginación funciona

#### 6.2 Publicar Tip (Usuario Autenticado)
**URL:** http://localhost:5173/tips (Modal "Compartir Tip")

**Pre-requisito:** Estar autenticado

- [ ] Modal se abre correctamente
- [ ] Campos requeridos:
  - [ ] Título (max 100 caracteres)
  - [ ] Contenido (min 50, max 1000 caracteres)
  - [ ] Categoría
- [ ] Validaciones funcionan
- [ ] Al enviar:
  - [ ] Toast de éxito: "¡Gracias por compartir! Tu tip será revisado"
  - [ ] Modal se cierra
  - [ ] Tip queda en status='pending'
  - [ ] NO aparece inmediatamente en página pública

#### 6.3 Admin - Tips Pendientes
**URL:** http://localhost:5173/admin/tips/pending

- [ ] Se muestran SOLO tips con status='pending'
- [ ] Cada tip muestra:
  - [ ] Título
  - [ ] Contenido
  - [ ] Categoría
  - [ ] Autor (nombre del usuario)
  - [ ] Fecha de envío
  - [ ] Botones: "Aprobar" y "Rechazar"
- [ ] Loading state mientras carga
- [ ] Si no hay pendientes: mensaje apropiado

#### 6.4 Admin - Aprobar Tip
- [ ] Click en "Aprobar" abre modal de confirmación
- [ ] Al confirmar:
  - [ ] Toast de éxito: "Tip aprobado exitosamente"
  - [ ] Tip desaparece de pendientes
  - [ ] Tip aparece en página pública
  - [ ] Status cambia a 'approved'

#### 6.5 Admin - Rechazar Tip
- [ ] Click en "Rechazar" abre modal con textarea
- [ ] Requiere razón de rechazo (min 10 caracteres)
- [ ] Al confirmar:
  - [ ] Toast de éxito
  - [ ] Tip desaparece de pendientes
  - [ ] Tip NO aparece en página pública
  - [ ] Status cambia a 'rejected'

#### 6.6 Admin - Gestión General de Tips
**URL:** http://localhost:5173/admin/tips

- [ ] Admin ve TODOS los tips (approved, pending, rejected)
- [ ] Filtros por status funcionan
- [ ] Búsqueda funciona
- [ ] Editar tip funciona (admin puede corregir errores)
- [ ] Eliminar tip funciona (hard delete)
- [ ] Estadísticas de tips visibles (total, pendientes, aprobados, rechazados)

---

### 7. PANEL DE ADMINISTRACIÓN

#### 7.1 Login Admin
**URL:** http://localhost:5173/admin/login

- [ ] Formulario de login visible
- [ ] Email: dev@jappi.ca
- [ ] Password: Password123
- [ ] Login exitoso redirige a dashboard admin
- [ ] Token de admin guardado correctamente

#### 7.2 Dashboard Admin
**URL:** http://localhost:5173/admin/dashboard

- [ ] Widgets de estadísticas visibles:
  - [ ] Total de usuarios
  - [ ] Total de negocios (por status)
  - [ ] Total de servicios (por status)
  - [ ] Total de eventos próximos
  - [ ] Total de artículos
  - [ ] Total de tips (por status)
- [ ] Gráficas funcionan (si aplica)
- [ ] Links rápidos a cada módulo funcionan

#### 7.3 Admin - Gestión de Usuarios
**URL:** http://localhost:5173/admin/users

- [ ] Lista de TODOS los usuarios visible
- [ ] Paginación funciona (10 usuarios por página)
- [ ] Búsqueda funciona (busca en nombre, email)
- [ ] Filtros funcionan:
  - [ ] Por rol (user/admin)
  - [ ] Por estado (activo/inactivo)
  - [ ] Por verificación (verificado/no verificado)
- [ ] Tabla muestra:
  - [ ] Avatar
  - [ ] Nombre
  - [ ] Email
  - [ ] Rol
  - [ ] Estado (activo/inactivo)
  - [ ] Verificado (sí/no)
  - [ ] Fecha de registro
  - [ ] Acciones (Editar, Eliminar)

#### 7.4 Admin - Editar Usuario
- [ ] Click en "Editar" abre modal con datos del usuario
- [ ] Admin puede cambiar:
  - [ ] Nombre Completo
  - [ ] Nombre Preferido
  - [ ] Teléfono
  - [ ] Ciudad
  - [ ] Bio
  - [ ] Rol (user/admin)
  - [ ] isActive (activo/inactivo)
  - [ ] isVerified (verificado/no verificado)
- [ ] Admin NO puede cambiar:
  - [ ] Email
  - [ ] Password
- [ ] Admin NO puede desactivarse a sí mismo
- [ ] Admin NO puede cambiar su propio rol a 'user'
- [ ] Toast de éxito al actualizar
- [ ] Cambios se reflejan inmediatamente

#### 7.5 Admin - Eliminar Usuario (Hard Delete)
**CRÍTICO - FUNCIONALIDAD ACTUALIZADA**

- [ ] Click en "Eliminar" abre modal de confirmación
- [ ] Admin NO puede eliminarse a sí mismo (botón disabled o error)
- [ ] Al confirmar eliminación:
  - [ ] Usuario es eliminado permanentemente de BD (?hard=true)
  - [ ] Toast de éxito
  - [ ] Usuario desaparece de lista
  - [ ] **Smart Pagination**: Si era el último usuario de la página actual y no es página 1, navega automáticamente a la página anterior
  - [ ] Lista se actualiza correctamente
- [ ] Verificar en MongoDB: usuario fue eliminado (hard delete)
- [ ] Al recargar página, usuario NO vuelve a aparecer

#### 7.6 Admin - Navegación del Panel
- [ ] Sidebar/menú de admin visible
- [ ] Links a todos los módulos funcionan:
  - [ ] Dashboard
  - [ ] Usuarios
  - [ ] Negocios (Todos / Pendientes)
  - [ ] Servicios (Todos / Pendientes)
  - [ ] Eventos
  - [ ] Blog
  - [ ] Tips (Todos / Pendientes)
- [ ] Botón de logout funciona
- [ ] Rutas admin protegidas (solo accesibles con rol admin)

---

## 8. VALIDACIONES DE SEGURIDAD

### 8.1 Autenticación y Autorización
- [ ] Usuario NO autenticado no puede acceder a rutas protegidas
- [ ] Usuario regular NO puede acceder a rutas /admin/*
- [ ] Token JWT expira correctamente (configurado a 7 días)
- [ ] Logout limpia el token correctamente
- [ ] Después de logout, no se puede acceder a rutas protegidas

### 8.2 Rate Limiting
**CRÍTICO - FIX IMPLEMENTADO**

- [ ] Rutas públicas tienen rate limiting activo
- [ ] Rutas /admin/* NO tienen rate limiting (están excluidas)
- [ ] NO se generan errores 429 en panel de administración
- [ ] Rate limit configurado: 100 requests por 15 minutos (configuración por defecto)
- [ ] Backend logs muestran que rate limiter está activo

### 8.3 Validaciones de Datos
- [ ] Email: formato válido requerido
- [ ] Contraseñas: mínimo 8 caracteres, mayúscula, minúscula, número
- [ ] URLs: formato URL válido (website, links de eventos)
- [ ] Teléfonos: formato válido (10-20 caracteres)
- [ ] Uploads: solo formatos permitidos (JPG, PNG, WEBP)
- [ ] Tamaños de archivo: máximo 5MB para imágenes
- [ ] Longitud de texto: min/max caracteres respetados

### 8.4 Protección contra Inyecciones
- [ ] Inputs sanitizados (no ejecutan HTML/JS malicioso)
- [ ] MongoDB queries protegidas contra NoSQL injection
- [ ] Express-validator funcionando en backend

---

## 9. VALIDACIONES DE UX/UI

### 9.1 Responsividad
- [ ] Todas las páginas son responsive (mobile, tablet, desktop)
- [ ] Menú de navegación funciona en mobile (hamburger menu)
- [ ] Tablas son scrollables en mobile
- [ ] Modales se adaptan a pantallas pequeñas
- [ ] Imágenes se redimensionan correctamente

### 9.2 Estados de Loading
- [ ] Spinners/loaders visibles mientras cargan datos
- [ ] Botones muestran estado "cargando" al hacer submit
- [ ] Skeleton screens (si aplica) funcionan
- [ ] NO hay "flash" de contenido vacío

### 9.3 Estados Vacíos (Empty States)
- [ ] Mensaje apropiado cuando no hay datos
- [ ] Iconos y texto descriptivo
- [ ] CTA para crear contenido (si aplica)

### 9.4 Manejo de Errores
- [ ] Errores de red se muestran con mensajes claros
- [ ] Errores de validación se muestran en cada campo
- [ ] Errores 404 muestran página apropiada
- [ ] Errores 500 muestran mensaje genérico (no exponen stack traces)

### 9.5 Toast Notifications
**CRÍTICO - VALIDACIÓN DE PARÁMETROS**

Todas las notificaciones toast deben tener parámetros correctos: `showToast(type, message)`

- [ ] Toast de éxito: fondo verde, ícono check
- [ ] Toast de error: fondo rojo, ícono X
- [ ] Toast de warning: fondo amarillo/naranja, ícono alerta
- [ ] Toast de info: fondo azul, ícono info
- [ ] Toasts se auto-cierran después de 3-5 segundos
- [ ] Usuario puede cerrar toast manualmente (botón X)
- [ ] NO hay errores de PropTypes en consola del navegador
- [ ] Mensajes en español y claros

### 9.6 Navegación
- [ ] Navbar visible en todas las páginas públicas
- [ ] Links de navegación funcionan
- [ ] Breadcrumbs visibles (si aplica)
- [ ] Botón "Volver" funciona
- [ ] Links externos se abren en nueva pestaña (target="_blank")

---

## 10. VALIDACIONES DE PERFORMANCE

### 10.1 Carga de Páginas
- [ ] Directorio de negocios (43+ items) carga en < 3 segundos
- [ ] Directorio de servicios carga rápidamente
- [ ] Directorio de eventos carga rápidamente
- [ ] Blog carga rápidamente
- [ ] Panel de admin carga rápidamente

### 10.2 Imágenes
- [ ] Logos de negocios cargan correctamente
- [ ] Imágenes de eventos cargan correctamente
- [ ] Imágenes de blog cargan correctamente
- [ ] NO hay broken images (404)
- [ ] Lazy loading funciona (si está implementado)

### 10.3 Memory Leaks
- [ ] Abrir/cerrar modales múltiples veces no causa lag
- [ ] Navegar entre páginas no aumenta uso de memoria excesivamente
- [ ] Filtros y búsquedas no causan memory leaks

---

## 11. VALIDACIONES DE BACKEND

### 11.1 Servidor Backend
- [ ] Servidor inicia sin errores en puerto 8000
- [ ] Logs de inicio muestran:
  ```
  🚀 Servidor corriendo en modo development
  📡 Puerto: 8000
  🌐 URL: http://localhost:8000
  🔗 API: http://localhost:8000/api/v1
  💚 Health Check: http://localhost:8000/health
  ```
- [ ] Conexión a MongoDB exitosa
- [ ] Token Service configurado correctamente
- [ ] Email Service configurado (Resend)

### 11.2 Health Check
**URL:** http://localhost:8000/health

- [ ] Endpoint responde 200 OK
- [ ] JSON response:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "environment": "development",
    "timestamp": "2025-12-01T..."
  }
  ```

### 11.3 API Endpoints
Validar que los siguientes endpoints responden correctamente:

**Auth:**
- [ ] POST /api/v1/auth/register
- [ ] POST /api/v1/auth/login
- [ ] GET /api/v1/auth/verify-email/:token
- [ ] POST /api/v1/auth/forgot-password
- [ ] POST /api/v1/auth/reset-password/:token

**Users:**
- [ ] GET /api/v1/users/profile (auth required)
- [ ] PUT /api/v1/users/profile (auth required)
- [ ] GET /api/v1/users/my-businesses (auth required)
- [ ] GET /api/v1/users/my-services (auth required)
- [ ] GET /api/v1/users/my-events (auth required)

**Businesses:**
- [ ] GET /api/v1/businesses (público)
- [ ] POST /api/v1/businesses/propose (auth required)

**Admin - Businesses:**
- [ ] GET /api/v1/admin/businesses (admin)
- [ ] GET /api/v1/admin/businesses/pending (admin)
- [ ] PUT /api/v1/admin/businesses/:id/approve (admin)
- [ ] PUT /api/v1/admin/businesses/:id/reject (admin)
- [ ] DELETE /api/v1/admin/businesses/:id (admin - hard delete)

**Services:**
- [ ] GET /api/v1/services (público)
- [ ] POST /api/v1/services (auth required)

**Admin - Services:**
- [ ] GET /api/v1/admin/services (admin)
- [ ] PUT /api/v1/admin/services/:id/approve (admin)
- [ ] PUT /api/v1/admin/services/:id/reject (admin)

**Events:**
- [ ] GET /api/v1/events (público)
- [ ] POST /api/v1/events/:id/register (auth required)

**Admin - Events:**
- [ ] GET /api/v1/admin/events (admin)
- [ ] POST /api/v1/admin/events (admin)
- [ ] PUT /api/v1/admin/events/:id (admin)
- [ ] DELETE /api/v1/admin/events/:id (admin - soft delete)
- [ ] DELETE /api/v1/admin/events/:id?hard=true (admin - hard delete)

**Blog:**
- [ ] GET /api/v1/blog (público)
- [ ] GET /api/v1/blog/:slug (público)

**Admin - Blog:**
- [ ] GET /api/v1/admin/blog (admin)
- [ ] POST /api/v1/admin/blog (admin)
- [ ] PUT /api/v1/admin/blog/:id (admin)
- [ ] PATCH /api/v1/admin/blog/:id/publish (admin)
- [ ] PATCH /api/v1/admin/blog/:id/unpublish (admin)
- [ ] DELETE /api/v1/admin/blog/:id (admin - hard delete)

**Tips:**
- [ ] GET /api/v1/tips (público)
- [ ] POST /api/v1/tips (auth required)

**Admin - Tips:**
- [ ] GET /api/v1/admin/tips (admin)
- [ ] GET /api/v1/admin/tips/pending (admin)
- [ ] PUT /api/v1/admin/tips/:id/approve (admin)
- [ ] PUT /api/v1/admin/tips/:id/reject (admin)
- [ ] PUT /api/v1/admin/tips/:id (admin)
- [ ] DELETE /api/v1/admin/tips/:id (admin)

**Admin - Users:**
- [ ] GET /api/v1/admin/users (admin)
- [ ] GET /api/v1/admin/users/:id (admin)
- [ ] PUT /api/v1/admin/users/:id (admin)
- [ ] DELETE /api/v1/admin/users/:id?hard=true (admin - hard delete)

### 11.4 Validación de Datos en Backend
- [ ] Express-validator funciona en todos los endpoints
- [ ] Errores de validación retornan 400 con mensajes claros
- [ ] Mongoose validations funcionan en modelos

---

## 12. VALIDACIONES DE BASE DE DATOS (MongoDB)

### 12.1 Colecciones Existentes
Verificar que las siguientes colecciones existen en MongoDB:

- [ ] users
- [ ] businesses
- [ ] services
- [ ] events
- [ ] eventregistrations
- [ ] blogposts
- [ ] tips

### 12.2 Datos de Prueba
Verificar que existen datos de prueba en:

- [ ] Al menos 1 usuario admin (dev@jappi.ca)
- [ ] Al menos 43 negocios aprobados
- [ ] Al menos algunos servicios
- [ ] Al menos algunos eventos próximos
- [ ] Al menos algunos artículos publicados
- [ ] Al menos algunos tips aprobados

### 12.3 Índices
Verificar que los índices necesarios existen:

- [ ] users: email (unique)
- [ ] businesses: status, category, city
- [ ] services: status, category
- [ ] events: date, status, isActive
- [ ] blogposts: slug (unique), status, isFeatured
- [ ] tips: status, category

---

## 13. VALIDACIÓN DE FUNCIONALIDADES CRÍTICAS RECIENTES

### 13.1 Rate Limiting Fix
**Commit:** 85117b1

- [ ] Servidor backend NO muestra errores 429 en rutas /admin/*
- [ ] Rate limiter salta rutas que comienzan con `/v1/admin`
- [ ] Logs del servidor confirman que skip function está activa
- [ ] Admin puede hacer múltiples requests sin ser bloqueado

### 13.2 Blog Delete (No Archive)
**Commit:** 85117b1

- [ ] Botón de "Archivar" NO existe en AdminBlogList
- [ ] Solo existe botón "Eliminar" (Trash2 icon)
- [ ] Modal de eliminación muestra advertencia roja
- [ ] Eliminación es permanente (hard delete)
- [ ] Artículo eliminado NO vuelve a aparecer al recargar

### 13.3 Events Dual Delete System
**Commit:** 85117b1

- [ ] Dos botones diferenciados (naranja XCircle + rojo Trash2)
- [ ] Botón naranja = Cancelar (soft delete)
- [ ] Botón rojo = Eliminar (hard delete)
- [ ] Modales tienen mensajes diferentes
- [ ] Backend endpoint responde correctamente a ambos casos
- [ ] Evento cancelado queda en BD con status='cancelled'
- [ ] Evento eliminado desaparece completamente de BD

### 13.4 Users Hard Delete + Smart Pagination
**Commit:** 85117b1

- [ ] Eliminación de usuario es permanente (hard delete)
- [ ] Usuario eliminado NO vuelve a aparecer al recargar
- [ ] Si eliminas el último usuario de página 2+, navega a página anterior automáticamente
- [ ] Paginación se actualiza correctamente después de eliminar
- [ ] No hay errores de "página vacía"

### 13.5 Businesses Smart Pagination
**Commit:** 85117b1

- [ ] Eliminación funciona correctamente
- [ ] Si eliminas el último negocio de página 2+, navega a página anterior
- [ ] Lista se actualiza con refetch (no solo update local)

### 13.6 Tips Controller Export Fix
**Commit:** 85117b1

- [ ] Servidor backend inicia sin errores de módulo faltante
- [ ] No hay error: "The requested module ... does not provide an export named 'updateTipAdmin'"
- [ ] Export default existe al final de tipController.js
- [ ] Todas las funciones de tips están exportadas correctamente

---

## 14. BROWSERS A VALIDAR

Realizar validación completa en los siguientes navegadores:

- [ ] Google Chrome (última versión)
- [ ] Mozilla Firefox (última versión)
- [ ] Microsoft Edge (última versión)
- [ ] Safari (si disponible)

---

## 15. CHECKLIST DE VALIDACIÓN FINAL

### 15.1 Pre-Producción
- [ ] Todas las funcionalidades core funcionan correctamente
- [ ] NO hay errores críticos en consola del navegador
- [ ] NO hay errores en logs del backend
- [ ] Todas las validaciones de seguridad pasaron
- [ ] Rate limiting configurado y funcionando
- [ ] Autenticación y autorización funcionan correctamente

### 15.2 Funcionalidades Críticas
- [ ] Registro y login de usuarios funciona
- [ ] Perfil de usuario funciona
- [ ] Directorio de negocios funciona
- [ ] Sistema de propuestas (negocios, servicios, tips) funciona
- [ ] Sistema de aprobación/rechazo admin funciona
- [ ] Eventos y registraciones funcionan
- [ ] Blog funciona
- [ ] Panel de administración completo funciona

### 15.3 Funcionalidades Recientes (Commit 85117b1)
- [ ] Rate limiting NO bloquea rutas admin (FIX confirmado)
- [ ] Blog elimina permanentemente (NO archiva)
- [ ] Eventos tiene sistema dual: Cancelar (soft) y Eliminar (hard)
- [ ] Usuarios se eliminan permanentemente con smart pagination
- [ ] Negocios tienen smart pagination
- [ ] Tips controller tiene export default (servidor inicia sin errores)

### 15.4 UX/UI
- [ ] Todas las páginas son responsive
- [ ] Loading states funcionan
- [ ] Empty states funcionan
- [ ] Toasts funcionan sin errores de PropTypes
- [ ] Modales se abren y cierran correctamente
- [ ] Navegación es intuitiva

### 15.5 Performance
- [ ] Páginas cargan en tiempo razonable (< 3 segundos)
- [ ] Imágenes cargan correctamente
- [ ] NO hay memory leaks detectados
- [ ] Paginación funciona en todas las listas largas

---

## 16. REPORTE FINAL QA

### 16.1 Resumen Ejecutivo
**Total de Tests Ejecutados:** [NÚMERO]
**Tests Pasados:** [NÚMERO]
**Tests Fallados:** [NÚMERO]
**Bugs Críticos Encontrados:** [NÚMERO]
**Bugs Menores Encontrados:** [NÚMERO]
**Estado General:** ✅ APROBADO / ❌ REQUIERE CORRECCIONES

### 16.2 Bugs Encontrados
Si se encuentran bugs, documentar en el siguiente formato:

#### BUG #1 - [CRÍTICO/ALTO/MEDIO/BAJO]
**Título:** Descripción corta del bug
**Ubicación:** Módulo/Archivo/Línea o URL
**Pasos para Reproducir:**
1. Paso 1
2. Paso 2
3. Paso 3

**Resultado Esperado:** Lo que debería pasar
**Resultado Actual:** Lo que realmente pasa
**Logs/Screenshots:** Adjuntar si es posible
**Prioridad:** Crítico/Alto/Medio/Bajo
**Recomendación:** Sugerencia de fix (opcional)

---

### 16.3 Recomendaciones para Producción
- [ ] Configurar variables de entorno de producción
- [ ] Configurar CORS para dominio de producción
- [ ] Configurar base de datos de producción (MongoDB Atlas)
- [ ] Configurar almacenamiento de imágenes (AWS S3 o similar)
- [ ] Configurar email service de producción (Resend)
- [ ] Habilitar HTTPS
- [ ] Configurar logging y monitoring (Sentry, LogRocket, etc.)
- [ ] Realizar backup de base de datos
- [ ] Documentar endpoints de API (Swagger/Postman)
- [ ] Crear documentación de usuario admin

---

## 17. CONCLUSIÓN

### 17.1 Estado del MVP
**Fecha de Validación:** [FECHA]
**Commit Validado:** 85117b1
**QA Ejecutado Por:** [NOMBRE]

**Resultado:**
- [ ] ✅ MVP APROBADO - Listo para producción
- [ ] ⚠️ MVP APROBADO CON OBSERVACIONES - Listo para producción con mejoras menores pendientes
- [ ] ❌ MVP REQUIERE CORRECCIONES - No listo para producción

### 17.2 Comentarios Finales
[Espacio para comentarios generales del QA, observaciones importantes, felicitaciones al equipo, etc.]

---

## 18. FIRMA DE APROBACIÓN

**QA Tester:** ___________________________
**Fecha:** ___________________________
**Firma:** ___________________________

**Project Manager:** ___________________________
**Fecha:** ___________________________
**Firma:** ___________________________

---

**FIN DEL DOCUMENTO DE VALIDACIÓN QA**

---

## NOTAS IMPORTANTES PARA EL QA

1. **NO realizar cambios en el código** - Este es un proceso de validación, no de desarrollo
2. **Documentar TODO** - Cualquier bug, error o inconsistencia debe ser documentado
3. **Ser exhaustivo** - Probar todos los casos edge, no solo el happy path
4. **Usar datos reales** - Probar con datos que reflejen uso real del sistema
5. **Probar en diferentes navegadores** - Asegurar compatibilidad cross-browser
6. **Validar responsive** - Probar en diferentes tamaños de pantalla
7. **Verificar logs** - Revisar consola del navegador y logs del backend
8. **Priorizar bugs** - Clasificar según impacto (crítico, alto, medio, bajo)
9. **Ser objetivo** - Reportar hallazgos sin sesgos
10. **Celebrar el trabajo** - Si todo funciona, reconocer el buen trabajo del equipo

**¡Éxito en la validación! 🚀**
