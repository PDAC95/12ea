# Product Requirements Document (PRD)

**Product:** Entre Amigas  
**Version:** 1.0  
**Date:** 5 de noviembre, 2025  
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

## 3. Core User Stories

### 🎯 Must Have (MVP)

**US-001: Registro e Ingreso**
Como usuaria nueva, quiero registrarme con datos básicos para acceder a la comunidad

- **AC:** Formulario solicita: nombre completo, nombre preferido, email, teléfono, cumpleaños, ciudad
- **AC:** Sistema envía email de verificación
- **AC:** Usuaria puede hacer login con email y contraseña
- **AC:** Sistema permite recuperación de contraseña

**US-002: Landing Page Informativa**
Como visitante, quiero entender qué es Entre Amigas antes de registrarme para decidir si unirme

- **AC:** Landing page explica misión y valores del proyecto
- **AC:** Muestra beneficios de unirse a la comunidad
- **AC:** Tiene call-to-action claro para registrarse
- **AC:** Es responsive (funciona en móvil y desktop)

**US-003: Dashboard Principal**
Como usuaria registrada, quiero ver un dashboard con todas las opciones disponibles para navegar fácilmente

- **AC:** Dashboard muestra bienvenida con nombre preferido
- **AC:** Menú claro con acceso a: Eventos, Directorio Negocios, Directorio Servicios, Blog
- **AC:** Vista rápida de próximos eventos destacados
- **AC:** Navegación intuitiva entre secciones

**US-004: Ver y Registrarse en Eventos**
Como usuaria, quiero ver eventos disponibles y registrarme para participar en actividades de la comunidad

- **AC:** Lista muestra eventos próximos con fecha, hora y modalidad (virtual/presencial)
- **AC:** Cada evento muestra detalles completos (descripción, ubicación/link, cupos)
- **AC:** Botón claro de "Registrarme" en cada evento
- **AC:** Sistema envía email de confirmación al registrarse
- **AC:** Usuaria puede ver "Mis Eventos Registrados" en su perfil
- **AC:** Filtros básicos: virtual/presencial, fecha

**US-005: Directorio de Negocios**
Como usuaria, quiero encontrar negocios y emprendimientos de otras latinas para apoyar a la comunidad

- **AC:** Lista muestra negocios con nombre, categoría, descripción breve, contacto
- **AC:** Filtros por categoría y ciudad
- **AC:** Búsqueda por palabra clave
- **AC:** Información de contacto visible (teléfono, email)
- **AC:** Estructura preparada para múltiples ciudades

**US-006: Directorio de Servicios Esenciales**
Como usuaria, quiero encontrar servicios importantes (médicos, dentistas, etc.) para acceder a recursos locales

- **AC:** Directorios organizados por categorías (Salud, Dental, Legal, Emergencias, etc.)
- **AC:** Cada servicio muestra: nombre, especialidad, teléfono, dirección, notas relevantes
- **AC:** Filtros por categoría y ciudad
- **AC:** Búsqueda por palabra clave
- **AC:** Indica servicios en español o con atención a latinos

**US-007: Blog y Consejos**
Como usuaria, quiero leer artículos sobre wellness, amistad y migración para sentirme acompañada e informada

- **AC:** Lista de artículos con imagen destacada y extracto
- **AC:** Filtros por categoría (Wellness, Amistad, Migración, etc.)
- **AC:** Artículo completo con formato rico (títulos, imágenes, párrafos)
- **AC:** Diseño legible y acogedor

**US-008: Panel Admin - Gestión de Eventos**
Como administradora, quiero crear y gestionar eventos fácilmente para mantener la comunidad activa

- **AC:** Panel admin protegido por login
- **AC:** Formulario simple para crear evento (título, descripción, fecha/hora, modalidad, ubicación/link, cupos)
- **AC:** Ver lista de eventos creados
- **AC:** Editar o cancelar eventos
- **AC:** Ver lista de usuarias registradas por evento

**US-009: Panel Admin - Gestión de Directorios**
Como administradora, quiero agregar negocios y servicios a los directorios para mantener la información actualizada

- **AC:** Formulario simple para agregar negocio (nombre, categoría, descripción, contacto, ciudad)
- **AC:** Formulario simple para agregar servicio (nombre, categoría, contacto, dirección, notas, ciudad)
- **AC:** Editar y eliminar entradas
- **AC:** Interface intuitiva sin conocimiento técnico

**US-010: Panel Admin - Gestión de Blog**
Como administradora, quiero publicar artículos fácilmente para compartir contenido con la comunidad

- **AC:** Editor de texto rico (negritas, títulos, listas, imágenes)
- **AC:** Asignar categoría al artículo
- **AC:** Subir imagen destacada
- **AC:** Publicar, editar o archivar artículos
- **AC:** Preview antes de publicar

### 📈 Should Have (Post-MVP)

- Como usuaria, quiero cancelar mi registro a un evento si no puedo asistir
- Como usuaria, quiero ver perfiles básicos de otras miembras para conocer más de la comunidad
- Como usuaria, quiero comentar en artículos del blog para participar en conversaciones
- Como usuaria, quiero recibir notificaciones de nuevos eventos por email
- Como administradora, quiero ver estadísticas básicas (usuarias activas, eventos populares)

### 💡 Could Have (Futuro)

- Sistema de chat o mensajería entre usuarias
- Foro de discusión o preguntas
- Las usuarias pueden crear sus propios eventos
- Las usuarias pueden agregar sus negocios al directorio
- App móvil nativa
- Notificaciones push
- Sistema de mentorías
- Grupos por intereses o ciudades

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
- **File Storage:** Cloudinary (tier gratuito para imágenes)

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
- **Cloudinary:** Almacenamiento y optimización de imágenes (blog, eventos)
- **MongoDB Atlas:** Base de datos cloud
- **Google Fonts:** Tipografías (opcional)

---

## 6. Data Model

### Core Entities

```javascript
User {
  _id: ObjectId,
  fullName: String,
  preferredName: String,
  email: String (unique, required),
  password: String (hashed),
  phone: String,
  birthday: Date,
  city: String,
  role: String (enum: ['user', 'admin']),
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}

Event {
  _id: ObjectId,
  title: String (required),
  description: String,
  date: Date (required),
  time: String,
  modality: String (enum: ['virtual', 'presencial']),
  location: String (si presencial),
  virtualLink: String (si virtual),
  maxCapacity: Number (opcional),
  currentRegistrations: Number,
  imageUrl: String,
  status: String (enum: ['upcoming', 'completed', 'cancelled']),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}

EventRegistration {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  registeredAt: Date,
  status: String (enum: ['registered', 'cancelled'])
}

Business {
  _id: ObjectId,
  businessName: String (required),
  ownerName: String,
  category: String (required),
  description: String,
  phone: String,
  email: String,
  city: String (required),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}

Service {
  _id: ObjectId,
  serviceName: String (required),
  category: String (required), // Salud, Dental, Legal, etc.
  specialty: String,
  phone: String (required),
  address: String,
  website: String,
  notes: String, // "Habla español", "Acepta X seguro"
  city: String (required),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}

BlogPost {
  _id: ObjectId,
  title: String (required),
  slug: String (unique),
  content: String (rich text/HTML),
  excerpt: String,
  category: String (required), // Wellness, Amistad, Migración, etc.
  featuredImage: String (URL),
  author: ObjectId (ref: User),
  status: String (enum: ['draft', 'published', 'archived']),
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Key Relationships

- **User ↔ Event:** Many-to-Many via EventRegistration (una usuaria puede registrarse en múltiples eventos)
- **User → Business/Service/BlogPost/Event:** One-to-Many (admin crea contenido)
- **Event ↔ EventRegistration:** One-to-Many (un evento tiene múltiples registros)

### Indexes Críticos

- User: `email` (unique), `role`
- Event: `date`, `status`, `city`
- Business: `category`, `city`
- Service: `category`, `city`
- BlogPost: `slug` (unique), `category`, `status`, `publishedAt`
- EventRegistration: compound index `[userId, eventId]`

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

| Risk                                           | Impact    | Mitigation                                                                                                                                                         |
| ---------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Admin UI demasiado compleja**                | 🔴 High   | Diseñar panel admin extremadamente simple con tutoriales integrados. Priorizar UX sobre features avanzadas. Hacer pruebas de usabilidad con la administradora.     |
| **Envío de emails falla o va a spam**          | 🔴 High   | Usar servicio confiable (Resend/Brevo). Configurar SPF/DKIM correctamente. Incluir opción de ver confirmación en web si email falla. Testing exhaustivo.           |
| **Datos de usuarias no seguros**               | 🔴 High   | Implementar mejores prácticas: HTTPS, passwords hasheados, JWT seguros, validación estricta. Revisar permisos de MongoDB. No guardar datos sensibles innecesarios. |
| **8 semanas es muy ajustado**                  | 🟡 Medium | Priorizar features core primero. Usar componentes UI pre-hechos (TailwindUI, shadcn). Considerar extender 2 semanas si necesario. Hacer testing continuo.          |
| **Costos de hosting aumentan con crecimiento** | 🟡 Medium | Empezar con tiers gratuitos. Monitorear uso mensualmente. Tener plan B (cambiar a Railway Pro ~$5/mes si necesario). Optimizar consultas DB.                       |
| **Baja adopción inicial**                      | 🟡 Medium | Lanzar con grupo semilla de 20-30 usuarias conocidas. Crear eventos presenciales para engagement. Marketing boca a boca.                                           |

---

## 9. Release Plan

### Phase 1: Foundation (Semanas 1-3)

**Sprint 1-2:**

- Setup de proyecto (repos, entornos)
- Configuración MERN stack completo
- Modelo de datos y schemas MongoDB
- Sistema de autenticación completo (registro, login, JWT, emails)
- Landing page básica funcional

**Entregables:**

- Repositorio configurado
- Base de datos en MongoDB Atlas
- Una persona puede registrarse y hacer login
- Landing page deployada

### Phase 2: Core Features (Semanas 4-6)

**Sprint 3-4:**

- Dashboard usuaria con navegación
- Módulo de Eventos completo (admin + usuaria)
- Sistema de emails para eventos
- Directorio de Servicios completo
- Panel admin para eventos y servicios

**Sprint 4-5:**

- Directorio de Negocios completo
- Blog completo (admin + usuaria)
- Panel admin para negocios y blog
- Filtros y búsquedas en directorios

**Entregables:**

- Todas las funcionalidades core funcionando
- Panel admin usable
- Emails automatizados activos

### Phase 3: Polish & Launch (Semanas 7-8)

**Sprint 6:**

- Diseño y UX refinamiento
- Responsive testing exhaustivo
- Testing de seguridad
- Optimización de performance
- Contenido inicial (3-5 artículos, 5-10 servicios)
- Documentación para admin

**Sprint 7-8:**

- Testing con usuarias reales (beta)
- Corrección de bugs
- Ajustes finales de UX basados en feedback
- Deploy a producción
- Lanzamiento suave con grupo semilla

**Entregables:**

- Plataforma completamente funcional
- Contenido inicial publicado
- Documentación de uso para admin
- MVP en producción

---

## 10. Success Tracking

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
      /layout (Header, Footer, Dashboard)
      /events (EventCard, EventList, EventDetail)
      /business (BusinessCard, BusinessList)
      /services (ServiceCard, ServiceList)
      /blog (BlogCard, BlogList, BlogPost)
      /admin (AdminPanel, CreateEvent, CreateBlog, etc.)
    /pages
      /Landing
      /Auth (Login, Register, ForgotPassword)
      /Dashboard
      /Events
      /Business
      /Services
      /Blog
      /Profile
      /Admin
    /hooks (useAuth, useEvents, useForm)
    /context (AuthContext, UIContext)
    /utils (api, validation, formatters)
    /styles
```

### Backend Structure

```
/server
  /src
    /models (User, Event, EventRegistration, Business, Service, BlogPost)
    /routes (auth, events, business, services, blog, admin)
    /controllers (authController, eventController, etc.)
    /middleware (authMiddleware, errorHandler, validation)
    /utils (emailService, jwt, passwordHash)
    /config (database, email, env)
    server.js
```

### Environment Variables Needed

```
# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_random_secret
JWT_EXPIRE=7d
EMAIL_SERVICE_API_KEY=resend_or_brevo_key
EMAIL_FROM=noreply@entreamigas.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://entreamigas.vercel.app

# Frontend
VITE_API_URL=https://api-entreamigas.railway.app
```

---

**Fin del PRD v1.0**

_Este documento será actualizado conforme el proyecto evolucione. Última actualización: 5 de noviembre, 2025_
