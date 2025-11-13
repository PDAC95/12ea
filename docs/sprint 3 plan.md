# Sprint 3 Plan - Entre Amigas

**Sprint Duration:** 2 semanas (Semanas 5-6)  
**Sprint Goal:** Sistema de eventos funcionando end-to-end + Admin puede gestionar directorios  
**Team Capacity:** ~20-25 horas/semana (1 desarrollador)  
**Total Points:** 16 puntos  
**Start Date:** [TBD]  
**End Date:** [TBD]

---

## Sprint Goal

**"Usuarias pueden ver y registrarse en eventos recibiendo confirmación por email, y administradoras pueden gestionar directorios y blog"**

### Success Criteria

- ✅ Usuarias ven lista de eventos próximos
- ✅ Usuarias pueden registrarse y reciben email de confirmación
- ✅ Sección "Mis Eventos" funcional
- ✅ Usuarias pueden leer artículos del blog
- ✅ Admin puede crear/editar/eliminar negocios y servicios
- ✅ Todas las rutas admin protegidas por rol
- ✅ UI responsive (móvil y desktop)

---

## Sprint Backlog

### US-004: Ver y Registrarse en Eventos

**Story Points:** 8 (Large)  
**Priority:** MUST HAVE - CORE FEATURE  
**Estimated Hours:** 16-18 horas

**Como** usuaria  
**Quiero** ver eventos disponibles y registrarme  
**Para** participar en actividades de la comunidad

#### Acceptance Criteria

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

---

### US-007: Blog con Artículos Categorizados

**Story Points:** 3 (Small)  
**Priority:** MUST HAVE  
**Estimated Hours:** 6-7 horas

**Como** usuaria  
**Quiero** leer artículos sobre wellness, amistad y migración  
**Para** sentirme acompañada e informada

#### Acceptance Criteria

- [ ] Lista de artículos con imagen destacada, título, extracto, fecha, categoría
- [ ] Click en artículo abre vista completa
- [ ] Artículo completo con formato rico (títulos, negritas, párrafos, imágenes)
- [ ] Categorías: Wellness, Amistad, Amor Propio, Migración, Consejos, Historias
- [ ] Filtro por categoría
- [ ] Diseño legible y acogedor
- [ ] Responsive
- [ ] Paginación (10 artículos por página)
- [ ] Últimos artículos primero (orden por fecha publicación)

---

### US-009: Panel Admin - Gestión de Directorios

**Story Points:** 5 (Medium)  
**Priority:** MUST HAVE  
**Estimated Hours:** 10-12 horas

**Como** administradora  
**Quiero** agregar negocios y servicios a los directorios  
**Para** mantener la información actualizada

#### Acceptance Criteria

- [ ] Panel admin accesible solo con rol "admin"
- [ ] Formulario para agregar negocio: nombre, dueña, categoría, descripción, teléfono, email, ciudad
- [ ] Formulario para agregar servicio: nombre, categoría, especialidad, teléfono, dirección, website, notas, ciudad
- [ ] Listas de negocios y servicios creados con búsqueda
- [ ] Botones "Editar" y "Eliminar" con confirmación
- [ ] Categorías como dropdown (no texto libre)
- [ ] Selector de ciudad (preparado para múltiples)
- [ ] Validaciones en tiempo real
- [ ] Interface súper simple, como llenar un formulario de Google
- [ ] Mensajes de éxito claros

---

## Sprint Schedule (Sugerido)

### Week 1 (Días 1-7)

**Focus:** Eventos completos

- **Día 1-2:** US-004 - Backend (modelos, endpoints básicos)
- **Día 3:** US-004 - Email service + testing
- **Día 4-5:** US-004 - Frontend (EventList, EventDetail)
- **Día 6:** US-004 - MyEvents + seed data
- **Día 7:** US-004 - Testing completo, polish

### Week 2 (Días 8-14)

**Focus:** Blog + Admin Directorios

- **Día 8-9:** US-007 - Backend + Frontend completo
- **Día 10:** US-009 - Admin middleware + endpoints
- **Día 11-12:** US-009 - Admin forms y listas
- **Día 13:** US-009 - Testing, validaciones, polish
- **Día 14:** Sprint Review prep, testing integral

---

**Ver archivo completo para detalles técnicos, tareas específicas y decisiones de arquitectura**

**END OF SPRINT 3 PLAN**
