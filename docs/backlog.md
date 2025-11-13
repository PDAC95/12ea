# Product Backlog

**Product:** Entre Amigas  
**Version:** 1.1  
**Last Updated:** 6 de noviembre, 2025  
**Owner:** Equipo Entre Amigas

---

## Backlog Summary

**Total Items:** 20  
**Must Have:** 10 items (Estimado: 52 puntos equivalentes)  
**Should Have:** 5 items (Estimado: 21 puntos equivalentes)  
**Could Have:** 5 items (Estimado: 18 puntos equivalentes)  
**Estimated Sprints for MVP:** 4 sprints (8 semanas con sprints de 2 semanas)

**Conversión T-Shirt a Puntos (para planning):**

- XS = 2 puntos
- S = 3 puntos
- M = 5 puntos
- L = 8 puntos
- XL = 13 puntos

---

## Epic Overview

### 🎯 Epic 1: Autenticación y Usuarios

**Stories:** 2  
**Total Estimation:** L + S = 11 pts  
**Priority:** Must Have  
**Description:** Sistema completo de registro, login, verificación y gestión de usuarios

### 🏠 Epic 2: Experiencia Pública

**Stories:** 2  
**Total Estimation:** M + M = 10 pts  
**Priority:** Must Have  
**Description:** Landing page y onboarding para atraer y convertir nuevas usuarias

### 📅 Epic 3: Eventos y Comunidad

**Stories:** 2  
**Total Estimation:** L + L = 16 pts  
**Priority:** Must Have  
**Description:** Sistema de eventos, registro y gestión administrativa

### 📚 Epic 4: Directorios

**Stories:** 3  
**Total Estimation:** M + M + M = 15 pts  
**Priority:** Must Have  
**Description:** Directorios de negocios y servicios con búsqueda y filtros

### ✍️ Epic 5: Contenido (Blog)

**Stories:** 2  
**Total Estimation:** S + M = 8 pts  
**Priority:** Must Have  
**Description:** Blog con artículos categorizados y panel admin para publicar

### 🔧 Epic 6: Panel de Administración

**Stories:** Integrado en épicas anteriores  
**Total Estimation:** Incluido en stories principales  
**Priority:** Must Have  
**Description:** Panel completo de admin para gestionar toda la plataforma

---

## Prioritized Backlog

### 🔴 MUST HAVE (MVP Critical)

---

#### 1. Sistema de Autenticación Completo

**ID:** US-001  
**Epic:** Autenticación y Usuarios  
**Story:** Como usuaria nueva, quiero registrarme con datos básicos para acceder a la comunidad

**Acceptance Criteria:**

- [x] Formulario de registro solicita: nombre completo, nombre preferido, email, teléfono, cumpleaños, ciudad, contraseña
- [x] Sistema valida datos en frontend (React Hook Form + Yup)
- [x] Sistema valida datos en backend (express-validator)
- [x] Password se hashea con bcrypt antes de guardar en DB
- [x] Sistema envía email de verificación al registrarse (Resend)
- [x] Email incluye link de verificación válido por 24 horas
- [x] Usuaria puede hacer login con email y contraseña
- [x] Login retorna JWT token válido por 7 días
- [x] Sistema permite solicitar recuperación de contraseña por email
- [x] Link de recuperación expira en 1 hora
- [x] Formulario de cambio de contraseña funcional
- [x] Mensajes de error claros en español
- [x] Protected routes funcionando (redirige a login si no autenticado)
- [x] Google OAuth 2.0 integrado con Passport.js

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB + Resend)
- **Dependencies:** Sprint 0 completo (MongoDB, email service configurado)
- **Complexity Factors:**
  - JWT token generation y verificación
  - Email service integration
  - Password hashing con bcrypt
  - Validación dual (frontend + backend)
  - Protected routes en React Router

**Estimation:** **L (Large)** = 8 pts
**Priority:** MUST HAVE - CRITICAL
**Status:** ✅ COMPLETADO (Sprint 1)
**Sprint Completado:** Sprint 1
**Fecha de Completion:** Noviembre 2025

---

#### 2. Landing Page Pública

**ID:** US-002  
**Epic:** Experiencia Pública  
**Story:** Como visitante nueva, quiero entender qué es Entre Amigas y cómo puedo unirme

**Acceptance Criteria:**

- [x] Hero section con título claro y call to action
- [x] Sección "Quiénes Somos" explicando el propósito
- [x] Sección "Qué Ofrecemos" con iconos y descripciones breves
- [x] Sección "Cómo Funciona" en 3 pasos simples
- [x] Botón prominente "Únete a la Comunidad" que lleva a registro
- [x] Footer con información de contacto y redes sociales
- [x] Diseño acogedor y profesional
- [x] Responsive (mobile y desktop)
- [x] Paleta de colores cálida y femenina (Design System implementado)
- [x] Imágenes representativas de comunidad (stock photos o propias)

**Technical Notes:**

- **Stack:** Frontend (React + TailwindCSS)
- **Dependencies:** Ninguna - puede desarrollarse en paralelo
- **Complexity Factors:**
  - Diseño responsive sin framework UI (TailwindCSS puro)
  - Optimización de imágenes
  - SEO básico (meta tags)

**Estimation:** **M (Medium)** = 5 pts
**Priority:** MUST HAVE
**Status:** ✅ COMPLETADO (Sprint 1)
**Sprint Completado:** Sprint 1
**Fecha de Completion:** Noviembre 2025

---

#### 3. Dashboard Principal de Usuaria

**ID:** US-003  
**Epic:** Experiencia Pública  
**Story:** Como usuaria registrada, quiero ver un dashboard con todas las opciones disponibles para navegar fácilmente

**Acceptance Criteria:**

- [x] Dashboard muestra mensaje de bienvenida con nombre preferido
- [x] Menú principal visible con 5 secciones: Eventos, Negocios, Servicios, Blog, Perfil
- [x] Vista rápida de próximos 3 eventos destacados
- [x] Navegación clara con iconos y labels
- [x] Header con logo y opción de logout
- [x] Diseño limpio y organizado
- [x] Responsive para móvil y desktop
- [x] Protected route (requiere autenticación)

**Technical Notes:**

- **Stack:** Frontend (React + React Router + Context API)
- **Dependencies:** US-001 (Autenticación debe estar funcionando)
- **Complexity Factors:**
  - Integración con sistema de auth
  - Protected routes
  - Fetch de datos de eventos para preview

**Estimation:** **M (Medium)** = 5 pts
**Priority:** MUST HAVE
**Status:** ✅ COMPLETADO (Sprint 2)
**Sprint Completado:** Sprint 2
**Fecha de Completion:** 13 de Noviembre, 2025

---

#### 4. Ver y Registrarse en Eventos

**ID:** US-004  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria, quiero ver eventos disponibles y registrarme para participar en actividades de la comunidad

**Acceptance Criteria:**

- [ ] Vista lista/grid de eventos próximos ordenados por fecha
- [ ] Cada evento muestra: imagen, título, fecha/hora, modalidad, ubicación/link, cupos disponibles
- [ ] Click en evento abre vista detallada con descripción completa
- [ ] Botón "Registrarme" visible y funcional
- [ ] Al registrarse, sistema envía email de confirmación automático
- [ ] Email incluye: detalles del evento, link/ubicación, recordatorio
- [ ] Sección "Mis Eventos Registrados" en perfil de usuaria
- [ ] Filtros básicos: virtual/presencial, por fecha
- [ ] Mensaje de éxito al registrarse
- [ ] No permitir registro duplicado (validación)
- [ ] Mostrar "Lleno" si evento alcanzó capacidad máxima

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB + Resend)
- **Dependencies:** US-001 (Auth), US-003 (Dashboard)
- **Complexity Factors:**
  - CRUD completo de registros
  - Integración con email service
  - Lógica de capacidad y validaciones
  - Queries optimizadas para listar eventos

**Estimation:** **L (Large)**  
**Priority:** MUST HAVE - CORE FEATURE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 2

---

#### 5. Directorio de Negocios

**ID:** US-005  
**Epic:** Directorios  
**Story:** Como usuaria, quiero encontrar negocios y emprendimientos de otras latinas para apoyar a la comunidad

**Acceptance Criteria:**

- [x] Vista de lista/grid de negocios
- [x] Cada negocio muestra: nombre, categoría, descripción breve, teléfono, email, ciudad
- [x] Filtros por categoría (dropdown)
- [x] Filtro por ciudad
- [x] Barra de búsqueda por palabra clave (nombre o descripción)
- [x] Click en negocio abre vista detallada
- [x] Información de contacto fácilmente visible (click to call, click to email)
- [x] Diseño tipo directorio limpio
- [x] Paginación si hay muchos resultados (20 por página)
- [x] Mensaje amigable si no hay resultados

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-003 (Dashboard)
- **Complexity Factors:**
  - Sistema de búsqueda (text search en MongoDB)
  - Múltiples filtros combinados
  - Estructura preparada para múltiples ciudades

**Estimation:** **M (Medium)** = 5 pts
**Priority:** MUST HAVE
**Status:** ✅ COMPLETADO (Sprint 2)
**Sprint Completado:** Sprint 2
**Fecha de Completion:** 13 de Noviembre, 2025

---

#### 6. Directorio de Servicios Esenciales

**ID:** US-006  
**Epic:** Directorios  
**Story:** Como usuaria, quiero encontrar servicios importantes (médicos, dentistas, etc.) para acceder a recursos locales

**Acceptance Criteria:**

- [x] Servicios organizados por categorías: Salud, Dental, Salud Mental, Legal, Educación, Emergencias, Gobierno
- [x] Cada servicio muestra: nombre, categoría, especialidad, teléfono, dirección, notas, ciudad
- [x] Notas visibles (ej: "Habla español", "Acepta seguro X")
- [x] Filtros por categoría
- [x] Filtro por ciudad
- [x] Búsqueda por palabra clave
- [x] Click en servicio abre vista detallada
- [x] Link a website si está disponible
- [x] Iconos visuales por categoría para fácil identificación
- [x] Paginación (20 por página)

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-003 (Dashboard)
- **Complexity Factors:**
  - Similar a US-005 pero diferente modelo de datos
  - Categorías predefinidas (enum)
  - Búsqueda por múltiples campos

**Estimation:** **M (Medium)** = 5 pts
**Priority:** MUST HAVE
**Status:** ✅ COMPLETADO (Sprint 2)
**Sprint Completado:** Sprint 2
**Fecha de Completion:** 13 de Noviembre, 2025

---

#### 7. Blog con Artículos Categorizados

**ID:** US-007  
**Epic:** Contenido (Blog)  
**Story:** Como usuaria, quiero leer artículos sobre wellness, amistad y migración para sentirme acompañada e informada

**Acceptance Criteria:**

- [ ] Lista de artículos con imagen destacada, título, extracto, fecha, categoría
- [ ] Click en artículo abre vista completa
- [ ] Artículo completo con formato rico (títulos, negritas, párrafos, imágenes)
- [ ] Categorías: Wellness, Amistad, Amor Propio, Migración, Consejos, Historias
- [ ] Filtro por categoría
- [ ] Diseño legible y acogedor
- [ ] Responsive
- [ ] Paginación (10 artículos por página)
- [ ] Últimos artículos primero (orden por fecha publicación)

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-003 (Dashboard)
- **Complexity Factors:**
  - Renderizado de contenido rico
  - Manejo de imágenes
  - Sistema de slugs para URLs amigables

**Estimation:** **S (Small)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 3

---

#### 8. Panel Admin - Gestión de Eventos

**ID:** US-008  
**Epic:** Eventos y Comunidad  
**Story:** Como administradora, quiero crear y gestionar eventos fácilmente para mantener la comunidad activa

**Acceptance Criteria:**

- [ ] Panel admin accesible solo con rol "admin"
- [ ] Formulario simple para crear evento: título, descripción, fecha, hora, modalidad, ubicación/link, cupos, imagen
- [ ] Upload de imagen para evento (AWS S3)
- [ ] Lista de todos los eventos creados (upcoming, completed, cancelled)
- [ ] Botón "Editar" abre formulario pre-llenado
- [ ] Botón "Cancelar evento" con confirmación
- [ ] Ver lista de usuarias registradas por evento
- [ ] Exportar lista de asistentes (CSV básico)
- [ ] Interface intuitiva sin conocimiento técnico requerido
- [ ] Validaciones claras y mensajes de error en español

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB + AWS S3)
- **Dependencies:** US-001 (Auth con roles), US-004 (Eventos)
- **Complexity Factors:**
  - Admin middleware y protected routes
  - Upload de imágenes con AWS S3
  - CRUD completo con validaciones
  - UX super simple para usuario no técnico

**Estimation:** **L (Large)**  
**Priority:** MUST HAVE - SIN ESTO NO HAY CONTENIDO  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 3

---

#### 9. Panel Admin - Gestión de Directorios

**ID:** US-009  
**Epic:** Directorios  
**Story:** Como administradora, quiero agregar negocios y servicios a los directorios para mantener la información actualizada

**Acceptance Criteria:**

- [ ] Formulario para agregar negocio: nombre, dueña, categoría, descripción, teléfono, email, ciudad
- [ ] Formulario para agregar servicio: nombre, categoría, especialidad, teléfono, dirección, website, notas, ciudad
- [ ] Listas de negocios y servicios creados con búsqueda
- [ ] Botones "Editar" y "Eliminar" con confirmación
- [ ] Categorías como dropdown (no texto libre)
- [ ] Selector de ciudad (preparado para múltiples)
- [ ] Validaciones en tiempo real
- [ ] Interface súper simple, como llenar un formulario de Google
- [ ] Mensajes de éxito claros

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-001 (Auth admin), US-005 (Negocios), US-006 (Servicios)
- **Complexity Factors:**
  - CRUD para 2 modelos diferentes
  - Formularios con validaciones
  - UX simplificada

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 3

---

#### 10. Panel Admin - Gestión de Blog

**ID:** US-010  
**Epic:** Contenido (Blog)  
**Story:** Como administradora, quiero publicar artículos fácilmente para compartir contenido con la comunidad

**Acceptance Criteria:**

- [ ] Editor de texto rico (WYSIWYG) tipo Medium/Notion
- [ ] Toolbar con opciones: negritas, cursivas, títulos H2/H3, listas, links
- [ ] Upload de imagen destacada (drag & drop)
- [ ] Insertar imágenes en contenido
- [ ] Campo para extracto (auto-generado de primeros 150 caracteres o manual)
- [ ] Selector de categoría
- [ ] Guardar como borrador o publicar
- [ ] Preview antes de publicar
- [ ] Lista de artículos (drafts, published, archived)
- [ ] Editar y archivar artículos
- [ ] Auto-generación de slug desde título

**Technical Notes:**

- **Stack:** Full Stack (React + Editor rico + Express + MongoDB + AWS S3)
- **Dependencies:** US-001 (Auth admin), US-007 (Blog)
- **Complexity Factors:**
  - Editor WYSIWYG (librería como TinyMCE, Quill, o Draft.js)
  - Manejo de imágenes múltiples con AWS S3
  - Sistema de drafts vs published
  - Slugs únicos

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 4

---

### 🟡 SHOULD HAVE (Post-MVP Priority)

---

#### 11. Cancelar Registro a Evento

**ID:** US-011  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria, quiero cancelar mi registro a un evento si no puedo asistir

**Acceptance Criteria:**

- [ ] Botón "Cancelar registro" en "Mis Eventos"
- [ ] Confirmación antes de cancelar
- [ ] Actualiza contador de registros del evento
- [ ] Email de confirmación de cancelación
- [ ] No permitir cancelar evento ya ocurrido

**Technical Notes:**

- **Stack:** Full Stack
- **Dependencies:** US-004 (Eventos funcionando)
- **Complexity Factors:** Lógica de cancelación y emails

**Estimation:** **S (Small)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 5 (Post-MVP)

---

#### 12. Perfiles Básicos de Usuarias

**ID:** US-012  
**Epic:** Autenticación y Usuarios  
**Story:** Como usuaria, quiero ver perfiles básicos de otras miembras para conocer más de la comunidad

**Acceptance Criteria:**

- [ ] Perfil público muestra: nombre preferido, ciudad, "miembro desde"
- [ ] No muestra datos sensibles (email, teléfono, cumpleaños)
- [ ] Lista de miembras con búsqueda por nombre o ciudad
- [ ] Click en miembra abre su perfil
- [ ] Opción de hacer perfil privado en settings

**Technical Notes:**

- **Stack:** Full Stack
- **Dependencies:** US-001
- **Complexity Factors:** Privacy settings, búsqueda

**Estimation:** **M (Medium)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 5

---

#### 13. Comentarios en Blog

**ID:** US-013  
**Epic:** Contenido (Blog)  
**Story:** Como usuaria, quiero comentar en artículos del blog para participar en conversaciones

**Acceptance Criteria:**

- [ ] Sección de comentarios al final de cada artículo
- [ ] Solo usuarias autenticadas pueden comentar
- [ ] Comentarios muestran nombre preferido y fecha
- [ ] Opción de eliminar propio comentario
- [ ] Admin puede moderar/eliminar comentarios
- [ ] Contador de comentarios visible

**Technical Notes:**

- **Stack:** Full Stack + moderación
- **Dependencies:** US-007, US-001
- **Complexity Factors:** Sistema de comentarios, moderación

**Estimation:** **M (Medium)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 6

---

#### 14. Notificaciones de Recordatorio de Eventos

**ID:** US-014  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria registrada, quiero recibir un recordatorio por email 24 horas antes del evento

**Acceptance Criteria:**

- [ ] Email automático enviado 24 hrs antes del evento
- [ ] Email incluye detalles del evento y link directo
- [ ] Opción de darse de baja de recordatorios en settings
- [ ] Cron job o scheduled task configurado

**Technical Notes:**

- **Stack:** Backend (Node + Cron job + Email service)
- **Dependencies:** US-004 (Eventos)
- **Complexity Factors:** Scheduled tasks, job queue

**Estimation:** **S (Small)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 6

---

#### 15. Dashboard Admin con Estadísticas

**ID:** US-015  
**Epic:** Panel de Administración  
**Story:** Como administradora, quiero ver estadísticas básicas para entender el uso de la plataforma

**Acceptance Criteria:**

- [ ] Dashboard muestra: total usuarias registradas, eventos próximos, registros totales
- [ ] Gráfico simple de registros por mes (últimos 6 meses)
- [ ] Top 3 eventos más populares
- [ ] Top 3 categorías de negocios más consultadas
- [ ] Diseño visual simple con números grandes

**Technical Notes:**

- **Stack:** Full Stack (React + Chart library + MongoDB aggregation)
- **Dependencies:** US-001, US-004, US-005
- **Complexity Factors:** MongoDB aggregations, gráficos

**Estimation:** **M (Medium)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 7

---

### 🟢 COULD HAVE (Nice to Have - Fase 2)

---

#### 16. Sistema de Favoritos

**ID:** US-016  
**Epic:** Experiencia Pública  
**Story:** Como usuaria, quiero guardar negocios y servicios como favoritos para encontrarlos fácilmente después

**Acceptance Criteria:**

- [ ] Botón "Agregar a favoritos" en cada negocio/servicio
- [ ] Sección "Mis Favoritos" en dashboard
- [ ] Organizado por tipo (negocios, servicios)
- [ ] Opción de eliminar de favoritos

**Technical Notes:**

- **Stack:** Full Stack
- **Dependencies:** US-005, US-006
- **Complexity Factors:** Modelo de datos para favoritos

**Estimation:** **S (Small)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Fase 2

---

#### 17. Filtro de Eventos por Ciudad

**ID:** US-017  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria, quiero filtrar eventos por ciudad para ver solo los relevantes para mí

**Acceptance Criteria:**

- [ ] Dropdown de ciudades disponibles
- [ ] Filtro combina con otros filtros existentes
- [ ] Muestra contador de eventos por ciudad
- [ ] Opción "Todas las ciudades"

**Technical Notes:**

- **Stack:** Full Stack
- **Dependencies:** US-004
- **Complexity Factors:** Query optimization

**Estimation:** **XS (Extra Small)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Fase 2

---

#### 18. Newsletter Mensual

**ID:** US-018  
**Epic:** Contenido (Blog)  
**Story:** Como administradora, quiero enviar un newsletter mensual con highlights de la comunidad

**Acceptance Criteria:**

- [ ] Panel para crear newsletter con editor rico
- [ ] Incluye: eventos próximos, artículos destacados, nuevos negocios
- [ ] Vista previa antes de enviar
- [ ] Envío masivo a todas las usuarias verificadas
- [ ] Template de email responsive

**Technical Notes:**

- **Stack:** Backend (Email service bulk sending)
- **Dependencies:** US-001, US-010
- **Complexity Factors:** Bulk email sending, template design

**Estimation:** **M (Medium)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Fase 2

---

#### 19. Búsqueda Global

**ID:** US-019  
**Epic:** Experiencia Pública  
**Story:** Como usuaria, quiero buscar en toda la plataforma (eventos, negocios, servicios, blog) desde un solo lugar

**Acceptance Criteria:**

- [ ] Barra de búsqueda global en header
- [ ] Resultados categorizados por tipo
- [ ] Muestra top 5 resultados de cada categoría
- [ ] Link a "Ver todos" en cada categoría
- [ ] Búsqueda por palabra clave funciona en todos los modelos

**Technical Notes:**

- **Stack:** Full Stack
- **Dependencies:** US-004, US-005, US-006, US-007
- **Complexity Factors:** Text search en múltiples colecciones

**Estimation:** **M (Medium)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Fase 2

---

#### 20. Integración con Google Calendar

**ID:** US-020  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria registrada, quiero agregar el evento a mi Google Calendar con un click

**Acceptance Criteria:**

- [ ] Botón "Agregar a Google Calendar" en confirmación de registro
- [ ] Genera archivo .ics automáticamente
- [ ] Incluye todos los detalles del evento
- [ ] Funciona en diferentes dispositivos

**Technical Notes:**

- **Stack:** Backend (ics file generation)
- **Dependencies:** US-004
- **Complexity Factors:** .ics format generation

**Estimation:** **S (Small)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Fase 2

---

## Infrastructure Items (Sprint 0)

### 🔧 Technical Setup Stories

---

#### ✅ INFRA-001: Setup de Repositorio y Estructura Inicial

**Descripción:** Crear repositorio GitHub y estructura base de carpetas para frontend y backend

**Tareas:**

- [ ] Crear repositorio en GitHub (privado o público)
- [ ] Crear carpetas /frontend y /backend
- [ ] Inicializar Git con .gitignore apropiado
- [ ] Crear README.md con instrucciones básicas
- [ ] Crear branches: main, develop

**Estimación:** 30 minutos  
**Prioridad:** 1  
**Dependencias:** Ninguna

**Criterio de Terminado:**

- [ ] Repositorio creado
- [ ] Estructura de carpetas lista
- [ ] .gitignore configurado
- [ ] README con instrucciones

---

#### ✅ INFRA-002: Configuración de MongoDB Atlas

**Descripción:** Configurar base de datos MongoDB Atlas (tier gratuito)

**Tareas:**

- [ ] Crear cuenta en MongoDB Atlas
- [ ] Crear cluster (M0 tier gratuito)
- [ ] Configurar network access (IP whitelist o 0.0.0.0/0 para desarrollo)
- [ ] Crear database user con credenciales
- [ ] Obtener connection string
- [ ] Probar conexión desde local

**Estimación:** 1 hora  
**Prioridad:** 2  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Cluster MongoDB creado y funcionando
- [ ] Conexión probada exitosamente
- [ ] Connection string guardada de forma segura
- [ ] Base de datos creada

---

#### ✅ INFRA-003: Configuración de AWS S3

**Descripción:** Configurar servicio de almacenamiento de imágenes AWS S3 (tier gratuito)

**Tareas:**

- [ ] Crear cuenta en AWS (si no existe)
- [ ] Crear bucket S3 con nombre único (ej: entre-amigas-production)
- [ ] Configurar permisos del bucket (public-read para imágenes o private con signed URLs)
- [ ] Crear usuario IAM con permisos S3
- [ ] Obtener credenciales (Access Key ID y Secret Access Key)
- [ ] Configurar CORS policy en el bucket
- [ ] Probar upload de imagen de prueba
- [ ] Documentar credenciales en archivo seguro

**Estimación:** 1-1.5 horas  
**Prioridad:** 3  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Bucket S3 creado y configurado
- [ ] Usuario IAM con credenciales obtenidas
- [ ] CORS configurado correctamente
- [ ] Upload de prueba exitoso
- [ ] Credenciales documentadas

---

#### ✅ INFRA-004: Configuración de Servicio de Email (Resend)

**Descripción:** Configurar Resend para envío de emails transaccionales

**Tareas:**

- [ ] Crear cuenta en Resend (5,000 emails/mes gratis)
- [ ] Obtener API key
- [ ] Configurar dominio de envío (si se tiene, sino usar default de Resend)
- [ ] Probar envío de email de prueba
- [ ] Crear templates básicos para:
  - Email de bienvenida
  - Verificación de cuenta
  - Confirmación de registro a evento
  - Recuperación de contraseña
- [ ] Documentar API key en archivo seguro

**Estimación:** 2-3 horas  
**Prioridad:** 4  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Cuenta Resend creada
- [ ] API key obtenida
- [ ] Email de prueba enviado exitosamente
- [ ] Templates básicos creados
- [ ] Credenciales documentadas

---

#### ✅ INFRA-005: Configuración de Proyecto Frontend (React + Vite)

**Descripción:** Inicializar proyecto React con Vite y configurar dependencias base

**Tareas:**

- [ ] Ejecutar `npm create vite@latest frontend -- --template react`
- [ ] Instalar dependencias base: TailwindCSS, React Router, Axios, React Hook Form, Yup
- [ ] Configurar Tailwind (postcss.config.js, tailwind.config.js)
- [ ] Configurar ESLint y Prettier
- [ ] Crear estructura de carpetas según ARCHITECTURE.md
- [ ] Crear archivo .env.example con variables necesarias
- [ ] Probar que servidor de desarrollo corre sin errores

**Estimación:** 2 horas  
**Prioridad:** 5  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Proyecto React inicializado
- [ ] Todas las dependencias instaladas
- [ ] TailwindCSS funcionando
- [ ] Estructura de carpetas completa
- [ ] Servidor dev corriendo en localhost:5173

---

#### ✅ INFRA-006: Configuración de Proyecto Backend (Node + Express)

**Descripción:** Inicializar proyecto Node.js con Express y configurar dependencias base

**Tareas:**

- [ ] Ejecutar `npm init -y` en carpeta /backend
- [ ] Instalar dependencias: Express, Mongoose, dotenv, bcryptjs, jsonwebtoken, express-validator, cors, helmet
- [ ] Instalar dev dependencies: nodemon
- [ ] Crear estructura de carpetas según ARCHITECTURE.md
- [ ] Crear archivo .env.example con variables necesarias
- [ ] Configurar scripts en package.json (dev, start)
- [ ] Crear server.js básico con Express
- [ ] Configurar conexión a MongoDB
- [ ] Crear endpoint de health check
- [ ] Probar que servidor corre sin errores

**Estimación:** 2-3 horas  
**Prioridad:** 6  
**Dependencias:** INFRA-001, INFRA-002

**Criterio de Terminado:**

- [ ] Proyecto Node inicializado
- [ ] Todas las dependencias instaladas
- [ ] Estructura de carpetas completa
- [ ] Servidor corriendo en localhost:5000
- [ ] Conexión a MongoDB exitosa
- [ ] Health check endpoint responde

---

#### ✅ INFRA-007: Configuración Inicial de AWS S3 Upload Service

**Descripción:** Configurar servicio de upload de imágenes con AWS S3 en backend

**Tareas:**

- [ ] Instalar dependencias: `@aws-sdk/client-s3`, `multer`
- [ ] Crear archivo de configuración `/backend/src/config/aws.js`
- [ ] Crear servicio `/backend/src/services/upload.service.js` con funciones:
  - `uploadToS3(file, folder)` - sube archivo a S3
  - `deleteFromS3(fileKey)` - elimina archivo de S3
- [ ] Crear middleware `/backend/src/middleware/upload.middleware.js` con Multer
- [ ] Probar upload de imagen de prueba
- [ ] Documentar uso en README

**Estimación:** 2 horas  
**Prioridad:** 7  
**Dependencias:** INFRA-003, INFRA-006

**Criterio de Terminado:**

- [ ] Servicio de upload configurado
- [ ] Upload de prueba exitoso
- [ ] Delete de prueba exitoso
- [ ] Middleware funcionando
- [ ] Documentado en README

---

### ⏱ Sprint 0 Timeline Sugerido

**Total Estimado:** 8-12 horas  
**Duración Sugerida:** 2-3 días

**Día 1 (3-4 horas):**

- INFRA-001: Repo y estructura (30 min)
- INFRA-002: MongoDB Atlas (1 hr)
- INFRA-003: AWS S3 (1-1.5 hrs)
- INFRA-004: Resend (2-3 hrs)

**Día 2 (3-4 horas):**

- INFRA-005: Frontend setup (2 hrs)
- INFRA-006: Backend setup (2-3 hrs)

**Día 3 (2 horas):**

- INFRA-007: AWS S3 service (2 hrs)
- Testing completo
- Documentar troubleshooting común

---

## Risk Management

### High Risk Items

1. **US-008 + US-010 (Admin Panels)** - Riesgo: UX muy compleja para usuario no técnico
   - **Mitigation:** Prototipar primero, hacer testing con administradora real antes de codear
2. **US-004 (Eventos con emails)** - Riesgo: Emails van a spam o servicio falla

   - **Mitigation:** Testing exhaustivo, configurar SPF/DKIM, tener plan B (mostrar confirmación en web)

3. **Timeline de 8 semanas** - Riesgo: Muy ajustado para 1 persona
   - **Mitigation:** Priorizar despiadadamente Must Have, usar componentes pre-hechos (TailwindUI, shadcn), considerar 2 semanas extra si necesario

### Dependencies Críticas

```
US-001 (Auth)
    ├── US-003 (Dashboard)
    │     ├── US-004 (Eventos)
    │     ├── US-005 (Negocios)
    │     ├── US-006 (Servicios)
    │     └── US-007 (Blog)
    ├── US-008 (Admin Eventos)
    ├── US-009 (Admin Directorios)
    └── US-010 (Admin Blog)

US-002 (Landing) → Independiente (puede ir en paralelo)
```

---

## Quick Actions

### Para iniciar Sprint Planning:

1. Filtrar backlog por "MUST HAVE" + Status "Backlog"
2. Verificar que stories cumplan Definition of Ready
3. Revisar dependencias y orden lógico
4. Seleccionar stories según velocity estimada (~12-15 pts)
5. Mover stories a "Sprint X" en tablero Kanban
6. Definir Sprint Goal claro

### Para agregar nueva User Story:

1. Escribir en formato: "Como [rol], quiero [acción] para [beneficio]"
2. Definir 3-5 criterios de aceptación específicos
3. Estimar complejidad (XS, S, M, L, XL)
4. Identificar dependencias técnicas
5. Priorizar con MoSCoW
6. Agregar en sección correspondiente del backlog
7. Tag con Epic si aplica

### Para marcar Story como Done:

1. Verificar todos los AC cumplidos
2. Testing manual completo
3. Code review (self-review si solo)
4. Deploy a staging
5. Mover a columna "Done" en tablero
6. Actualizar velocity tracking
7. Preparar demo si es Sprint Review

---

## Metrics & Success Criteria

### Sprint Health Metrics

- **Commitment Accuracy:** ¿Completamos lo planeado? (objetivo: >80%)
- **Velocity Trend:** ¿Nuestra velocity es consistente?
- **Blocked Days:** ¿Cuántos días estuvimos bloqueados? (objetivo: 0-1 días)
- **Tech Debt Created:** ¿Cuántos items de TD agregamos?

### MVP Success Criteria (Al final de Sprint 4)

- [ ] Las 10 User Stories Must Have están completadas al 100%
- [ ] Al menos 5-10 usuarias beta pueden usar la plataforma sin bugs críticos
- [ ] Admin puede gestionar contenido sin ayuda técnica
- [ ] Plataforma deployada y accesible públicamente
- [ ] Performance aceptable (< 3s load time)
- [ ] Al menos 3-5 artículos de blog publicados
- [ ] Al menos 10 servicios en directorio
- [ ] Al menos 1 evento creado y funcional

---

## Next Steps

1. **Inmediato:** Revisar este backlog con equipo/stakeholders
2. **Esta semana:** Preparar Sprint 1 Planning
3. **Antes de Sprint 1:**
   - Setup de repositorio y estructura
   - Crear tablero Kanban (GitHub Projects, Trello, o Notion)
   - Preparar ambiente de desarrollo local
4. **Sprint 1 Día 1:** Sprint Planning formal con selección de stories

---

## Appendix: Story Point Reference

**XS (2 pts) - 2-4 horas:**

- Cambio de texto simple
- Ajuste de estilo CSS
- Agregar validación simple

**S (3 pts) - 4-8 horas:**

- Componente UI simple
- Endpoint API básico
- Form simple con validación

**M (5 pts) - 1-2 días:**

- Feature completa simple (ej: página estática)
- CRUD básico
- Integración con servicio externo simple

**L (8 pts) - 3-4 días:**

- Feature compleja con múltiples partes
- Sistema de autenticación
- Feature con integración externa compleja

**XL (13 pts) - 5+ días:**

- Feature muy compleja
- Requiere investigación o spike
- **Nota:** Si una story es XL, probablemente debe dividirse

---

**Última actualización:** 13 de noviembre, 2025
**Próxima revisión:** Sprint 3 - Día 1
**Maintained by:** Equipo Entre Amigas

---

## Sprint Progress Tracking

### ✅ Sprint 1 - Completado (13/13 SP)

**Duración:** 2 semanas
**Fecha Completion:** Noviembre 2025
**Velocity:** 13 SP / 2 semanas = 6.5 SP/semana

**User Stories Completadas:**
- ✅ US-001: Sistema de Autenticación Completo (8 SP)
- ✅ US-002: Landing Page Pública (5 SP)

**Logros:**
- Sistema de autenticación con JWT completo
- Email verification y password recovery
- Landing page responsive con diseño acogedor
- Google OAuth 2.0 integrado
- Protected routes funcionando

### ✅ Sprint 2 - Completado (15/15 SP)

**Duración:** 2 semanas
**Fecha Completion:** 13 de Noviembre, 2025
**Velocity:** 15 SP / 2 semanas = 7.5 SP/semana

**User Stories Completadas:**
- ✅ US-003: Dashboard Principal de Usuaria (5 SP)
- ✅ US-005: Directorio de Negocios (5 SP)
- ✅ US-006: Directorio de Servicios Esenciales (5 SP)

**Logros:**
- Dashboard con navegación completa
- Directorios de Negocios y Servicios con búsqueda y filtros
- Componentes compartidos reutilizables
- 10 endpoints REST API implementados
- Seed data para testing

### 📊 Velocity Promedio

**Total SP Completados:** 28 SP
**Total Sprints:** 2
**Velocity Promedio:** 14 SP/sprint (7 SP/semana)

### 🎯 Próximo Sprint

**Sprint 3 - Planeado:**
- US-004: Ver y Registrarse en Eventos (8 SP)
- US-007: Blog con Artículos (3 SP)
- US-009: Panel Admin - Directorios (5 SP)
- **Total:** 16 SP

---

**FIN DEL PRODUCT BACKLOG**

_Este es un documento vivo que se actualiza después de cada sprint y refinement session._
