# Product Requirements Document (PRD)

**Product:** Entre Amigas  
**Version:** 1.1  
**Date:** 5 de noviembre, 2025  
**Last Updated:** 6 de noviembre, 2025  
**Owner:** Equipo Entre Amigas  
**Status:** 🟡 Planning

---

## 1. Product Vision

### Problem Statement

Las mujeres migrantes de habla hispana en Canadá (20-60 años) enfrentan aislamiento social y soledad al llegar a un nuevo país. Actualmente dependen de grupos dispersos de Facebook sin estructura, lo que dificulta crear conexiones genuinas, acceder a recursos locales relevantes y construir una red de apoyo consistente.

**Para quién:** Mujeres migrantes de habla hispana en Canadá (20-60 años, diversos niveles educativos)  
**El problema es:** Soledad, aislamiento social y falta de comunidad estructurada al migrar  
**Actualmente ellos:** Usan grupos de Facebook fragmentados sin recursos centralizados  
**Nuestro producto:** Plataforma web comunitaria que centraliza eventos, recursos y conexiones en un espacio seguro y estructurado para crear amistad genuina y apoyo mutuo

### Success Definition

En 6 meses, este producto será exitoso si:

- **Métrica 1:** 100+ usuarias registradas activas
- **Métrica 2:** Presencia establecida en 3+ ciudades de Canadá
- **Métrica 3:** Promedio de 2+ eventos mensuales con participación consistente

---

## 2. User Personas

### Primary User: Mujer Migrante Hispana

- **Context:** Mujer entre 20-60 años, recién llegada o establecida en Canadá, habla español como lengua materna
- **Goal:** Crear conexiones auténticas, encontrar amigas con experiencias similares, acceder a recursos en español
- **Pain:** Soledad, barrera del idioma, desconocimiento de recursos locales, dificultad para hacer amigas
- **Tech Level:** Variado (Bajo a Alto) - debe ser intuitivo para todas

### Secondary User: Administradora del Proyecto

- **Context:** Fundadora/gestora de la comunidad
- **Goal:** Gestionar contenido, eventos y directorios de forma simple y rápida
- **Pain:** Necesita herramientas fáciles sin conocimiento técnico profundo
- **Tech Level:** Medio - necesita panel admin intuitivo

---

## 3. Core Features (MVP)

### Feature 1: Landing Page Pública

**Descripción:** Página de inicio acogedora y profesional que explica el proyecto

**User Story:** Como visitante nueva, quiero entender rápidamente qué es Entre Amigas y cómo me puede ayudar

**Funcionalidad:**

- Hero section con mensaje claro de valor
- Secciones: Quiénes Somos, Qué Ofrecemos, Cómo Funciona
- Testimonios de miembras (opcional en MVP)
- Call to action: "Únete a la comunidad" → registro
- Footer con información de contacto
- Diseño responsive y acogedor

**Prioridad:** MUST HAVE  
**Estimación:** 5 puntos (Medium)

---

### Feature 2: Sistema de Autenticación Completo

**Descripción:** Registro, login, verificación de email y recuperación de contraseña

**User Story:** Como usuaria nueva, quiero registrarme de forma segura para acceder a la plataforma

**Funcionalidad:**

- Registro con campos: nombre completo, nombre preferido, email, teléfono, cumpleaños, ciudad, contraseña
- Email de verificación automático
- Login con email y contraseña
- Recuperación de contraseña por email
- JWT tokens con expiración de 7 días
- Validación en frontend y backend
- Mensajes de error claros en español

**Prioridad:** MUST HAVE - CRÍTICO  
**Estimación:** 8 puntos (Large)

---

### Feature 3: Dashboard de Usuaria

**Descripción:** Panel principal con navegación a todas las secciones

**User Story:** Como usuaria registrada, quiero ver un dashboard organizado para acceder fácilmente a eventos, directorios y blog

**Funcionalidad:**

- Mensaje de bienvenida personalizado
- Menú de navegación: Eventos, Negocios, Servicios, Blog, Perfil
- Vista rápida de próximos 3 eventos destacados
- Header con logo y logout
- Responsive para móvil y desktop

**Prioridad:** MUST HAVE  
**Estimación:** 5 puntos (Medium)

---

### Feature 4: Módulo de Eventos

**Descripción:** Ver eventos, registrarse y recibir confirmación por email

**User Story:** Como usuaria, quiero ver eventos disponibles y registrarme para participar en actividades

**Funcionalidad:**

**Vista Pública (Usuarias):**

- Lista/grid de eventos próximos ordenados por fecha
- Cada evento muestra: imagen, título, fecha/hora, modalidad, ubicación/link, cupos
- Click en evento abre vista detallada
- Botón "Registrarme" funcional
- Email de confirmación automático al registrarse
- Sección "Mis Eventos Registrados"
- Filtros: virtual/presencial, por fecha
- Mensaje "Lleno" si evento alcanzó capacidad

**Panel Admin:**

- Formulario simple para crear evento (todos los campos necesarios)
- Upload de imagen para evento (AWS S3)
- Lista de eventos creados (upcoming, completed, cancelled)
- Editar y cancelar eventos
- Ver lista de usuarias registradas por evento
- Exportar asistentes (CSV básico)

**Prioridad:** MUST HAVE - CORE FEATURE  
**Estimación:** 16 puntos (8 + 8 Large)

---

### Feature 5: Directorio de Negocios

**Descripción:** Buscar y filtrar negocios de mujeres latinas

**User Story:** Como usuaria, quiero encontrar negocios de otras latinas para apoyar a la comunidad

**Funcionalidad:**

**Vista Pública:**

- Lista/grid de negocios
- Cada negocio: nombre, dueña, categoría, descripción breve, teléfono, email, ciudad
- Filtros por categoría y ciudad
- Búsqueda por palabra clave
- Vista detallada al hacer click
- Click to call, click to email
- Paginación (20 por página)

**Panel Admin:**

- Formulario para agregar negocio
- Categorías predefinidas (dropdown)
- Lista de negocios con búsqueda
- Editar y eliminar negocios

**Prioridad:** MUST HAVE  
**Estimación:** 10 puntos (5 + 5 Medium)

---

### Feature 6: Directorio de Servicios Esenciales

**Descripción:** Directorio de servicios importantes (médicos, dentistas, legales, etc.)

**User Story:** Como usuaria, quiero encontrar servicios esenciales locales para acceder a recursos

**Funcionalidad:**

**Vista Pública:**

- Servicios organizados por categorías predefinidas
- Cada servicio: nombre, categoría, especialidad, teléfono, dirección, website, notas, ciudad
- Filtros por categoría y ciudad
- Búsqueda por palabra clave
- Vista detallada con notas (ej: "Habla español")
- Iconos por categoría
- Paginación (20 por página)

**Panel Admin:**

- Formulario para agregar servicio
- Categorías predefinidas (dropdown)
- Lista de servicios con búsqueda
- Editar y eliminar servicios

**Prioridad:** MUST HAVE  
**Estimación:** 10 puntos (5 + 5 Medium)

---

### Feature 7: Blog con Artículos

**Descripción:** Blog con contenido sobre wellness, amistad, migración

**User Story:** Como usuaria, quiero leer artículos para sentirme acompañada e informada

**Funcionalidad:**

**Vista Pública:**

- Lista de artículos con imagen destacada, título, extracto, fecha, categoría
- Categorías: Wellness, Amistad, Amor Propio, Migración, Consejos, Historias
- Filtro por categoría
- Vista completa del artículo con formato rico
- Diseño legible y acogedor
- Paginación (10 artículos por página)
- Orden: últimos artículos primero

**Panel Admin:**

- Editor de texto rico (WYSIWYG)
- Upload de imagen destacada
- Insertar imágenes en contenido (AWS S3)
- Campo para extracto
- Selector de categoría
- Guardar como borrador o publicar
- Preview antes de publicar
- Lista de artículos (drafts, published, archived)
- Editar y archivar artículos
- Auto-generación de slug

**Prioridad:** MUST HAVE  
**Estimación:** 8 puntos (3 + 5 Small + Medium)

---

## 4. Functional Scope

### In Scope ✅

- Landing page pública informativa
- Sistema completo de autenticación (registro, login, recuperación)
- Dashboard principal con navegación clara
- Módulo de Eventos (ver, registrar, mis eventos) con emails automáticos
- Directorio de Negocios con filtros y búsqueda
- Directorio de Servicios Esenciales con filtros y búsqueda
- Blog con artículos categorizados
- Panel de administración completo para gestionar: eventos, directorios, blog
- Sistema de emails transaccionales (confirmaciones, bienvenida)
- Diseño responsive (mobile-first)
- Estructura multi-ciudad desde el inicio

### Out of Scope ❌

- Chat o mensajería entre usuarias
- Foro de discusión o comentarios
- Notificaciones push
- App móvil nativa
- Las usuarias crean eventos (solo admin)
- Las usuarias agregan negocios (solo admin)
- Sistema de pagos o membresías
- Integración con redes sociales
- Perfiles públicos completos de usuarias
- Galería de fotos

---

## 5. Technical Requirements

### Stack: MERN

- **Frontend:** React 18+ con Vite, TailwindCSS para estilos
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (tier gratuito)
- **Authentication:** JWT + bcrypt para hash de passwords
- **Email Service:** Resend (5,000 emails/mes gratis) o Brevo (300 emails/día gratis)
- **File Storage:** AWS S3 (tier gratuito 5GB primer año)

### Hosting (Opciones Económicas/Gratuitas)

- **Frontend:** Vercel o Netlify (gratis para proyectos pequeños)
- **Backend + DB:** Railway (tier gratuito con límites razonables) o Render (175 hrs/mes gratis)
- **MongoDB:** MongoDB Atlas tier gratuito (512MB)

### Non-Functional Requirements

- **Performance:**
  - Carga inicial < 3 segundos
  - Tiempo de respuesta API < 500ms
- **Security:**
  - HTTPS obligatorio
  - Passwords hasheados con bcrypt (salt rounds: 10)
  - JWT con expiración (7 días)
  - Validación de datos en frontend y backend
  - Protección contra SQL injection y XSS
  - Rate limiting en endpoints críticos
- **Scalability:**
  - Arquitectura preparada para 500+ usuarias concurrentes
  - Paginación en listas largas (20 items por página)
- **Accessibility:**
  - Contraste WCAG AA mínimo
  - Navegación por teclado
  - Alt text en imágenes
- **Usability:**
  - Interface intuitiva para usuarios de bajo nivel técnico
  - Mensajes de error claros en español
  - Formularios con validación en tiempo real

### External Dependencies

- **Resend/Brevo:** Envío de emails transaccionales (confirmaciones, bienvenida, recuperación password)
- **AWS S3:** Almacenamiento y optimización de imágenes (blog, eventos)
- **MongoDB Atlas:** Base de datos cloud
- **Google Fonts:** Tipografías (opcional)

---

## 6. User Flows

### User Flow 1: Registro y Primer Login

1. Visitante llega a landing page
2. Click en "Únete a la comunidad"
3. Llena formulario de registro
4. Sistema envía email de verificación
5. Usuaria verifica email (click en link)
6. Hace login con credenciales
7. Ve dashboard por primera vez
8. Explora eventos/directorios

### User Flow 2: Registrarse a un Evento

1. Usuaria autenticada va a sección Eventos
2. Ve lista de eventos próximos
3. Click en evento de interés
4. Ve detalles completos
5. Click en "Registrarme"
6. Sistema confirma registro
7. Usuaria recibe email de confirmación
8. Evento aparece en "Mis Eventos"

### User Flow 3: Admin Crea un Evento

1. Admin hace login
2. Accede a panel de administración
3. Click en "Crear Evento"
4. Llena formulario simple
5. Sube imagen del evento (AWS S3)
6. Click en "Publicar"
7. Evento aparece visible para todas las usuarias
8. Admin puede ver registros en tiempo real

### User Flow 4: Buscar en Directorio de Negocios

1. Usuaria va a sección Negocios
2. Ve lista de todos los negocios
3. Usa filtros (categoría: "Comida", ciudad: "Toronto")
4. Resultados se actualizan
5. Usa búsqueda por palabra clave ("panadería")
6. Click en negocio de interés
7. Ve información detallada y contacto
8. Click to call o envía email

---

## 7. MVP Definition

### What Gets Built First

**Timeline:** 8 semanas (2 meses)

**Included:**

- ✅ Landing page profesional y acogedora
- ✅ Sistema completo de autenticación con emails
- ✅ Dashboard usuaria con navegación clara
- ✅ Módulo de Eventos completo (CRUD admin + vista usuaria + registros + emails)
- ✅ Directorio de Negocios completo (CRUD admin + vista usuaria con filtros)
- ✅ Directorio de Servicios completo (CRUD admin + vista usuaria con filtros)
- ✅ Blog completo (CRUD admin + vista usuaria con categorías)
- ✅ Panel de administración funcional y fácil de usar
- ✅ Diseño responsive para móvil y desktop
- ✅ Sistema de emails transaccionales funcionando

**Excluded (Post-MVP):**

- ⏸️ Cancelación de registros a eventos
- ⏸️ Perfiles públicos de usuarias
- ⏸️ Comentarios en blog
- ⏸️ Chat o mensajería
- ⏸️ Notificaciones push
- ⏸️ Estadísticas y analytics para admin
- ⏸️ Newsletter automatizada

**Definition of Done:**

El MVP estará completo cuando:

1. Una usuaria puede registrarse, verificar email y hacer login
2. La administradora puede crear eventos, negocios, servicios y artículos desde panel admin sin ayuda técnica
3. Una usuaria puede ver eventos y registrarse, recibiendo confirmación por email
4. Una usuaria puede buscar y filtrar en ambos directorios
5. Una usuaria puede leer artículos del blog categorizados
6. La plataforma funciona perfectamente en móvil y desktop
7. Todos los emails se envían correctamente
8. El sitio está desplegado y accesible públicamente

---

## 8. Risks & Assumptions

### Assumptions

- [ ] Las usuarias tienen acceso a internet y dispositivos (móvil o computadora)
- [ ] Las usuarias confiarán en compartir datos básicos (teléfono, email)
- [ ] La administradora puede dedicar 2-4 horas semanales a gestionar contenido
- [ ] Habrá al menos 1 evento mensual para mantener engagement
- [ ] El tier gratuito de servicios externos será suficiente los primeros 6 meses

### Risks

| Risk                                        | Impact    | Mitigation                                                                                                                                                     |
| ------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin UI demasiado compleja**             | 🔴 High   | Diseñar panel admin extremadamente simple con tutoriales integrados. Priorizar UX sobre features avanzadas. Hacer pruebas de usabilidad con la administradora. |
| **Envío de emails falla o va a spam**       | 🔴 High   | Usar servicio confiable (Resend/Brevo). Configurar SPF/DKIM correctamente. Incluir opción de ver confirmación en web si email falla. Testing exhaustivo.       |
| **Baja adopción inicial (< 20 usuarias)**   | 🟡 Medium | Estrategia de lanzamiento con eventos presenciales. Marketing en grupos de Facebook existentes. Invitaciones personales. Testimonios de early adopters.        |
| **Costo de hosting excede presupuesto**     | 🟡 Medium | Usar tiers gratuitos cuidadosamente. Monitorear uso mensual. Optimizar consultas de DB. Tener plan B con alternativas (ej: Render en lugar de Railway).        |
| **AWS S3 costos inesperados**               | 🟡 Medium | Configurar límites de bucket. Implementar compresión de imágenes. Monitorear uso mensualmente. Mantener imágenes dentro de tier gratuito (5GB/año).            |
| **Bugs críticos en producción**             | 🟡 Medium | Testing manual exhaustivo antes de lanzar. Ambiente de staging para probar cambios. Error monitoring (Sentry). Proceso de rollback rápido.                     |
| **Falta de contenido inicial (blog vacío)** | 🟢 Low    | Preparar 5-10 artículos antes de lanzar. Calendario editorial mensual. Colaboraciones con community members para contenido.                                    |

---

## 9. Success Metrics

### Launch Metrics (Primeros 30 días)

- **Registros:** 30-50 usuarias registradas
- **Verificación:** 70%+ de usuarias verifican su email
- **Engagement:** 50%+ de usuarias regresan al menos 1 vez después del registro
- **Eventos:** 1 evento realizado con 10+ asistentes
- **Landing Page:** 500+ visitas

### 3-Month Metrics

- **Usuarias Activas:** 75-100 usuarias
- **Eventos:** 3 eventos realizados exitosamente
- **Directorios:** 20+ negocios y 15+ servicios agregados
- **Blog:** 10+ artículos publicados
- **Retención:** 40%+ de usuarias activas mensualmente
- **Ciudades:** Presencia en 2 ciudades

### 6-Month Success Criteria

- **100+ usuarias registradas** ✅
- **3+ ciudades activas** ✅
- 8-10 eventos realizados
- Engagement: 30% usuarias leen blog mensualmente
- Retención: 50% usuarias regresan al menos 2x/mes

### Tracking Methods

- Google Analytics 4 (gratuito)
- Backend logging de eventos clave
- Feedback directo de usuarias en eventos
- Encuestas trimestrales de satisfacción

---

## 10. Launch Plan

### Pre-Launch (Semana antes del lanzamiento)

- [ ] Testing completo en staging
- [ ] 5-10 artículos de blog preparados
- [ ] 2 eventos creados y programados
- [ ] 10+ negocios y servicios agregados
- [ ] 5-10 usuarias beta testeando
- [ ] Marketing materials preparados
- [ ] Posts programados en redes sociales

### Launch Day

- [ ] Deploy a producción
- [ ] Smoke tests
- [ ] Anuncio en grupos de Facebook relevantes
- [ ] Invitaciones personales a contactos cercanos
- [ ] Monitoreo activo de errores
- [ ] Responder preguntas de usuarias

### Post-Launch (Primera semana)

- [ ] Onboarding calls con nuevas usuarias
- [ ] Recolectar feedback
- [ ] Fix bugs críticos inmediatamente
- [ ] Publicar 2-3 artículos nuevos
- [ ] Reminder del primer evento
- [ ] Celebrar hitos (ej: 25 usuarias registradas)

### Success Tracking

### Sprint Milestones

**Sprint 1-2 (Semanas 1-3):**

- ✅ Autenticación funciona
- ✅ Landing page viva
- ✅ MongoDB configurado

**Sprint 3-5 (Semanas 4-6):**

- ✅ Eventos operacional
- ✅ Ambos directorios funcionando
- ✅ Blog publicando artículos
- ✅ Panel admin usable

**Sprint 6-8 (Semanas 7-8):**

- ✅ Testing completo
- ✅ Feedback incorporado
- ✅ MVP lanzado en producción

### Post-Launch Metrics (Seguimiento Semanal)

**Mes 1:**

- 30-50 usuarias registradas
- 1 evento realizado con 10+ asistentes
- 500 visitas a landing page
- 5+ artículos publicados

**Mes 3:**

- 75-100 usuarias activas
- 3 eventos realizados
- Presencia en 2 ciudades
- 15+ negocios en directorio

**Mes 6 (Objetivo de Éxito):**

- **100+ usuarias registradas** ✅
- **3+ ciudades activas** ✅
- 8-10 eventos realizados
- Engagement: 30% usuarias leen blog mensualmente
- Retención: 50% usuarias regresan al menos 2x/mes

### Key Performance Indicators (KPIs)

- **Adquisición:** Nuevas registros semanales
- **Engagement:** % usuarias que se registran en eventos
- **Retención:** % usuarias activas mes a mes
- **Contenido:** Artículos publicados por mes
- **Comunidad:** Promedio de asistentes por evento
- **Alcance:** Ciudades con presencia activa

---

## 11. Admin Panel - Especificaciones de Usabilidad

**Principios de Diseño para Panel Admin:**

1. **Extremadamente Simple:**

   - Un botón claro para cada acción: "Crear Evento", "Agregar Negocio", etc.
   - Formularios cortos con solo campos esenciales
   - Sin jerga técnica

2. **Visual y Claro:**

   - Vista previa inmediata de lo que se está creando
   - Mensajes de confirmación claros: "Evento creado exitosamente"
   - Indicadores visuales de estado (publicado, borrador, etc.)

3. **Editor de Texto Amigable:**

   - Editor WYSIWYG para blog (como Word)
   - Botones visuales: B para negrita, I para cursiva
   - Subir imágenes con drag & drop

4. **Gestión Intuitiva:**

   - Tablas claras con datos resumidos
   - Botones de "Editar" y "Eliminar" visibles
   - Confirmación antes de eliminar: "¿Segura que quieres eliminar este evento?"

5. **Dashboard Admin:**
   - Vista rápida: "Tienes 3 eventos próximos", "5 nuevas registradas esta semana"
   - Acceso rápido a tareas comunes
   - Sin gráficos complejos (fase 1)

---

## Quick Reference

**Este PRD alimenta:**
→ Product Backlog (todas las User Stories)  
→ Sprint Planning (priorizamos del backlog cada 2 semanas)  
→ Definición de tareas técnicas por desarrollador

**Frecuencia de revisión:** Cada 3 meses o cuando haya cambio mayor en visión/scope

**Próxima acción:** Crear Product Backlog detallado con estimaciones de Story Points

---

## Appendix: Technical Architecture Overview

### Frontend Structure

```
/client
  /src
    /components
      /common (Button, Input, Card, etc.)
      /layout (Header, Footer, Sidebar)
    /features
      /auth (Login, Register, ForgotPassword)
      /dashboard
      /events
      /business
      /services
      /blog
      /admin
      /landing
    /shared
      /hooks (useAuth, useDebounce, useApi)
      /utils (api.js, validators.js, formatters.js)
    /routes (ProtectedRoute, AdminRoute)
```

### Backend Structure

```
/server
  /src
    /models (User, Event, Business, Service, BlogPost, EventRegistration)
    /routes (auth, events, business, services, blog, admin)
    /controllers (auth, events, business, services, blog, admin)
    /middleware (auth, admin, validate, upload, errorHandler)
    /services (email, token, upload with AWS S3)
    /utils (asyncHandler, ApiError)
    /config (database, email, aws)
```

---

**Version History:**

| Version | Date       | Changes                            | Author              |
| ------- | ---------- | ---------------------------------- | ------------------- |
| 1.0     | 5 nov 2025 | PRD inicial                        | Equipo Entre Amigas |
| 1.1     | 6 nov 2025 | Actualización: Cloudinary → AWS S3 | Equipo Entre Amigas |

**Last Updated:** 6 de noviembre, 2025  
**Next Review:** Cada 3 meses o cambio mayor  
**Maintained by:** Equipo Entre Amigas

---

**FIN DEL PRD**
