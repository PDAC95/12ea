# Product Backlog

**Product:** Entre Amigas  
**Version:** 1.0  
**Last Updated:** 5 de noviembre, 2025  
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

- [ ] Formulario de registro solicita: nombre completo, nombre preferido, email, teléfono, cumpleaños, ciudad
- [ ] Sistema valida datos en frontend y backend
- [ ] Password se hashea con bcrypt antes de guardar
- [ ] Sistema envía email de verificación al registrarse
- [ ] Usuaria puede hacer login con email y contraseña
- [ ] Login retorna JWT token válido por 7 días
- [ ] Sistema permite recuperación de contraseña por email
- [ ] Token de recuperación expira en 1 hora
- [ ] Mensajes de error claros en español

**Technical Notes:**

- **Stack:** Frontend (React Hook Form + Yup) + Backend (Express + JWT + bcryptjs) + Email (Resend)
- **Dependencies:** Ninguna - Esta es la base de todo
- **Complexity Factors:**
  - Múltiples flujos (registro, login, recuperar password, verificar email)
  - Seguridad crítica (hashing, tokens, validación)
  - Integración con servicio de email
  - Manejo de errores comprehensivo

**Estimation:** **L (Large)**  
**Priority:** MUST HAVE - CRÍTICO  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 1

---

#### 2. Landing Page Pública

**ID:** US-002  
**Epic:** Experiencia Pública  
**Story:** Como visitante, quiero entender qué es Entre Amigas antes de registrarme para decidir si unirme

**Acceptance Criteria:**

- [ ] Hero section con título claro y call-to-action
- [ ] Sección que explica misión y valores del proyecto
- [ ] Sección de beneficios de unirse (3-4 beneficios clave)
- [ ] Testimonios o historias de impacto (mínimo 2)
- [ ] Call-to-action secundario en footer
- [ ] Diseño responsive (mobile y desktop)
- [ ] Carga rápida (< 3 segundos)
- [ ] SEO básico (meta tags, título, descripción)

**Technical Notes:**

- **Stack:** Frontend (React + TailwindCSS)
- **Dependencies:** Ninguna - Puede desarrollarse en paralelo
- **Complexity Factors:**
  - Diseño atractivo y acogedor
  - Responsive en múltiples dispositivos
  - Copy persuasivo en español

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 1

---

#### 3. Dashboard Principal de Usuaria

**ID:** US-003  
**Epic:** Experiencia Pública  
**Story:** Como usuaria registrada, quiero ver un dashboard con todas las opciones disponibles para navegar fácilmente

**Acceptance Criteria:**

- [ ] Dashboard muestra mensaje de bienvenida con nombre preferido
- [ ] Menú principal visible con 5 secciones: Eventos, Negocios, Servicios, Blog, Perfil
- [ ] Vista rápida de próximos 3 eventos destacados
- [ ] Navegación clara con iconos y labels
- [ ] Header con logo y opción de logout
- [ ] Diseño limpio y organizado
- [ ] Responsive para móvil y desktop
- [ ] Protected route (requiere autenticación)

**Technical Notes:**

- **Stack:** Frontend (React + React Router + Context API)
- **Dependencies:** US-001 (Autenticación debe estar funcionando)
- **Complexity Factors:**
  - Integración con sistema de auth
  - Protected routes
  - Fetch de datos de eventos para preview

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 1

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

- [ ] Vista de lista/grid de negocios
- [ ] Cada negocio muestra: nombre, categoría, descripción breve, teléfono, email, ciudad
- [ ] Filtros por categoría (dropdown)
- [ ] Filtro por ciudad
- [ ] Barra de búsqueda por palabra clave (nombre o descripción)
- [ ] Click en negocio abre vista detallada
- [ ] Información de contacto fácilmente visible (click to call, click to email)
- [ ] Diseño tipo directorio limpio
- [ ] Paginación si hay muchos resultados (20 por página)
- [ ] Mensaje amigable si no hay resultados

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-003 (Dashboard)
- **Complexity Factors:**
  - Sistema de búsqueda (text search en MongoDB)
  - Múltiples filtros combinados
  - Estructura preparada para múltiples ciudades

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 2

---

#### 6. Directorio de Servicios Esenciales

**ID:** US-006  
**Epic:** Directorios  
**Story:** Como usuaria, quiero encontrar servicios importantes (médicos, dentistas, etc.) para acceder a recursos locales

**Acceptance Criteria:**

- [ ] Servicios organizados por categorías: Salud, Dental, Salud Mental, Legal, Educación, Emergencias, Gobierno
- [ ] Cada servicio muestra: nombre, categoría, especialidad, teléfono, dirección, notas, ciudad
- [ ] Notas visibles (ej: "Habla español", "Acepta seguro X")
- [ ] Filtros por categoría
- [ ] Filtro por ciudad
- [ ] Búsqueda por palabra clave
- [ ] Click en servicio abre vista detallada
- [ ] Link a website si está disponible
- [ ] Iconos visuales por categoría para fácil identificación
- [ ] Paginación (20 por página)

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB)
- **Dependencies:** US-003 (Dashboard)
- **Complexity Factors:**
  - Similar a US-005 pero diferente modelo de datos
  - Categorías predefinidas (enum)
  - Búsqueda por múltiples campos

**Estimation:** **M (Medium)**  
**Priority:** MUST HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 2

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
- [ ] Upload de imagen para evento (Cloudinary)
- [ ] Lista de todos los eventos creados (upcoming, completed, cancelled)
- [ ] Botón "Editar" abre formulario pre-llenado
- [ ] Botón "Cancelar evento" con confirmación
- [ ] Ver lista de usuarias registradas por evento
- [ ] Exportar lista de asistentes (CSV básico)
- [ ] Interface intuitiva sin conocimiento técnico requerido
- [ ] Validaciones claras y mensajes de error en español

**Technical Notes:**

- **Stack:** Full Stack (React + Express + MongoDB + Cloudinary)
- **Dependencies:** US-001 (Auth con roles), US-004 (Eventos)
- **Complexity Factors:**
  - Admin middleware y protected routes
  - Upload de imágenes
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

- **Stack:** Full Stack (React + Editor rico + Express + MongoDB + Cloudinary)
- **Dependencies:** US-001 (Auth admin), US-007 (Blog)
- **Complexity Factors:**
  - Editor WYSIWYG (librería como TinyMCE, Quill, o Draft.js)
  - Manejo de imágenes múltiples
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

#### 14. Notificaciones de Nuevos Eventos por Email

**ID:** US-014  
**Epic:** Eventos y Comunidad  
**Story:** Como usuaria, quiero recibir notificaciones de nuevos eventos por email

**Acceptance Criteria:**

- [ ] Email automático cuando admin crea evento nuevo
- [ ] Email incluye: título, fecha, modalidad, link a ver detalles
- [ ] Opción de desuscribirse en email
- [ ] Configuración en perfil: "Recibir notificaciones de eventos"
- [ ] Batch email para no hacer spam

**Technical Notes:**

- **Stack:** Backend + Email service
- **Dependencies:** US-008
- **Complexity Factors:** Email masivo, unsubscribe, configuración

**Estimation:** **S (Small)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 6

---

#### 15. Estadísticas Básicas para Admin

**ID:** US-015  
**Epic:** Panel de Administración  
**Story:** Como administradora, quiero ver estadísticas básicas para entender el engagement de la comunidad

**Acceptance Criteria:**

- [ ] Dashboard admin muestra:
  - Total de usuarias registradas
  - Nuevas usuarias última semana
  - Próximos eventos
  - Evento más popular (más registros)
  - Total de negocios y servicios en directorios
- [ ] Gráfico simple de crecimiento mensual
- [ ] Exportar datos básicos a CSV

**Technical Notes:**

- **Stack:** Full Stack + agregaciones
- **Dependencies:** Todas las features anteriores
- **Complexity Factors:** Queries de agregación, visualización

**Estimation:** **M (Medium)**  
**Priority:** SHOULD HAVE  
**Status:** 📋 Backlog  
**Sprint Sugerido:** Sprint 7

---

### 🟢 COULD HAVE (Nice to Have)

---

#### 16. Chat Privado entre Usuarias

**ID:** US-016  
**Story:** Como usuaria, quiero enviar mensajes privados a otras miembras para conectar directamente

**Why it matters:** Facilita conexiones 1-1 más profundas entre miembras

**Estimation:** **XL (Extra Large)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Notes:** Requiere WebSockets o similar, complejidad alta

---

#### 17. Foro de Discusión

**ID:** US-017  
**Story:** Como usuaria, quiero participar en foros de discusión sobre temas relevantes

**Why it matters:** Crea conversaciones más ricas y engagement continuo

**Estimation:** **L (Large)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Notes:** Requiere moderación activa

---

#### 18. Usuarias Crean Sus Propios Eventos

**ID:** US-018  
**Story:** Como usuaria activa, quiero crear mis propios eventos para organizar encuentros

**Why it matters:** Empodera a la comunidad y escala los eventos

**Estimation:** **M (Medium)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Notes:** Requiere proceso de aprobación por admin

---

#### 19. Usuarias Agregan Sus Negocios al Directorio

**ID:** US-019  
**Story:** Como usuaria emprendedora, quiero agregar mi negocio al directorio yo misma

**Why it matters:** Reduce carga de admin y empodera a emprendedoras

**Estimation:** **S (Small)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Notes:** Versión simplificada del form admin

---

#### 20. App Móvil Nativa (iOS/Android)

**ID:** US-020  
**Story:** Como usuaria, quiero una app nativa en mi teléfono para acceder más fácilmente

**Why it matters:** Mayor engagement y notificaciones push

**Estimation:** **XL (Extra Large)**  
**Priority:** COULD HAVE  
**Status:** 📋 Backlog  
**Notes:** Considerar PWA como alternativa más rápida

---

### ⚪ WON'T HAVE (Out of Scope)

- **Videollamadas integradas** - Razón: Se usará Zoom/Google Meet con links externos
- **Pagos o membresías** - Razón: Proyecto non-profit, gratis para todas
- **Marketplace de productos** - Razón: Solo directorio, no ecommerce
- **Traducción automática a otros idiomas** - Razón: Enfocado en comunidad hispana
- **Integración con redes sociales para login** - Razón: MVP usa email/password simple

---

## Technical Debt & Infrastructure

### Technical Debt Items

**Ninguno al inicio** - Se creará conforme avance el desarrollo

### Infrastructure Tasks

- **INFRA-001:** Setup de repositorio GitHub con estructura de carpetas - **S** - Sprint 1
- **INFRA-002:** Configuración de MongoDB Atlas y conexión - **XS** - Sprint 1
- **INFRA-003:** Setup de Cloudinary para imágenes - **XS** - Sprint 1
- **INFRA-004:** Configuración de Resend/Brevo para emails - **S** - Sprint 1
- **INFRA-005:** CI/CD con GitHub Actions - **M** - Sprint 3
- **INFRA-006:** Deploy inicial a Vercel + Railway - **S** - Sprint 4

---

## Definition of Ready (DoR)

Una User Story está "Ready" para Sprint Planning cuando:

- [ ] Tiene descripción clara en formato: "Como X, quiero Y, para Z"
- [ ] Tiene criterios de aceptación específicos y verificables
- [ ] Tiene estimación de complejidad (T-Shirt Size)
- [ ] Dependencias técnicas identificadas
- [ ] Dudas técnicas principales resueltas con el equipo
- [ ] Es completable en 1 sprint (2 semanas)
- [ ] No tiene bloqueadores externos

---

## Definition of Done (DoD)

Una User Story está "Done" cuando:

- [ ] Todos los criterios de aceptación cumplidos y verificados
- [ ] Código escrito siguiendo convenciones del proyecto
- [ ] Código funciona en local sin errores
- [ ] Testing manual realizado en múltiples escenarios
- [ ] Responsive (funciona en móvil y desktop)
- [ ] Sin bugs críticos conocidos
- [ ] Texto en español correcto (sin typos)
- [ ] Validaciones de formularios funcionando
- [ ] Mensajes de error/éxito implementados
- [ ] Documentación básica en README si introduce algo nuevo
- [ ] Commit con mensaje descriptivo en español
- [ ] Deployado en ambiente de desarrollo/staging
- [ ] Demo funcional preparada

---

## Sprint Planning Guide

### Velocity Estimada por Sprint

Asumiendo trabajo individual con ~20-25 horas/semana dedicadas:

- **Sprint 1-2 (Learning Curve):** 8-10 puntos equivalentes
- **Sprint 3+ (Velocity Normal):** 12-15 puntos equivalentes

**Conversión:**

- XS = 2 pts
- S = 3 pts
- M = 5 pts
- L = 8 pts
- XL = 13 pts

### Propuesta de Sprints para MVP (8 semanas)

#### Sprint 1 (Semanas 1-2): Fundación

**Objetivo:** Infraestructura y autenticación funcionando

**Stories Planeadas:**

- INFRA-001, 002, 003, 004 (Setup completo)
- US-001: Sistema de Autenticación Completo (L = 8 pts)
- US-002: Landing Page Pública (M = 5 pts)

**Total:** ~13 puntos + infra

**Entregable:** Usuarias pueden registrarse, verificar email, y hacer login. Landing page pública visible.

---

#### Sprint 2 (Semanas 3-4): Core Features Usuaria

**Objetivo:** Usuarias pueden navegar y usar features principales

**Stories Planeadas:**

- US-003: Dashboard Principal (M = 5 pts)
- US-005: Directorio de Negocios (M = 5 pts)
- US-006: Directorio de Servicios (M = 5 pts)

**Total:** 15 puntos

**Entregable:** Usuarias autenticadas ven dashboard y pueden buscar en directorios.

---

#### Sprint 3 (Semanas 5-6): Eventos + Admin parte 1

**Objetivo:** Sistema de eventos funcionando end-to-end

**Stories Planeadas:**

- US-004: Ver y Registrarse en Eventos (L = 8 pts)
- US-007: Blog con Artículos (S = 3 pts)
- US-009: Panel Admin - Directorios (M = 5 pts)

**Total:** 16 puntos

**Entregable:** Usuarias pueden registrarse a eventos y reciben emails. Admin puede gestionar directorios.

---

#### Sprint 4 (Semanas 7-8): Admin completo + Polish + Deploy

**Objetivo:** Panel admin completo, contenido inicial, y deploy a producción

**Stories Planeadas:**

- US-008: Panel Admin - Eventos (L = 8 pts)
- US-010: Panel Admin - Blog (M = 5 pts)
- INFRA-005: CI/CD (M = 5 pts)
- INFRA-006: Deploy producción (S = 3 pts)
- Polish & Testing final

**Total:** 21 puntos (sprint más intenso, última semana)

**Entregable:** MVP completo funcionando en producción. Admin puede gestionar todo sin ayuda técnica.

---

## Backlog Refinement Notes

**Frequency:** Cada 5-7 días (mitad de cada sprint)  
**Next Review:** Sprint 1 - Día 7  
**Duration:** 30-60 minutos

**Objetivos de Refinement:**

1. Revisar stories del siguiente sprint
2. Aclarar dudas técnicas
3. Ajustar estimaciones si es necesario
4. Identificar dependencias o bloqueadores
5. Preparar 2-3 sprints hacia adelante

**Items que necesitan refinamiento:**

- [ ] US-008 y US-010 (Admin panels) - Definir UX exacta antes de Sprint 3
- [ ] US-004 (Eventos) - Confirmar flujo de emails antes de Sprint 3

---

## Sprint Velocity Tracking

| Sprint   | Planned Points | Completed Points | Velocity | Notes            |
| -------- | -------------- | ---------------- | -------- | ---------------- |
| Sprint 1 | 13 + infra     | -                | -        | Fundación + Auth |
| Sprint 2 | 15             | -                | -        | Core features    |
| Sprint 3 | 16             | -                | -        | Eventos + Admin  |
| Sprint 4 | 21             | -                | -        | Polish + Deploy  |

**Average Velocity:** [Calcular después de Sprint 2]  
**MVP Completion:** Sprint 4 (100%)

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

**Última actualización:** 5 de noviembre, 2025  
**Próxima revisión:** Sprint 1 - Día 7  
**Maintained by:** Equipo Entre Amigas

---

**FIN DEL PRODUCT BACKLOG**

_Este es un documento vivo que se actualiza después de cada sprint y refinement session._
