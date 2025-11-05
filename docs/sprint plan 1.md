# Planeación de Sprint - Sprint 0 (Preparación)

**Producto:** Entre Amigas  
**Número de Sprint:** 0 (Preparación/Fundación)  
**Duración del Sprint:** 7-10 días  
**Fecha de Planeación:** 5 de noviembre, 2025  
**Responsable:** Equipo Entre Amigas

---

## Resumen del Sprint

### Objetivo del Sprint 🎯

**"Establecer la infraestructura completa del proyecto y ambiente de desarrollo listo para comenzar Sprint 1"**

Este es un sprint técnico de preparación. No hay funcionalidades de usuario, solo configuración inicial.

### Métricas del Sprint

- **Duración:** 1 semana (7 días calendario, ~5 días laborables)
- **Capacidad Disponible:** 20-25 horas
- **Tareas Comprometidas:** 6 tareas de infraestructura
- **Velocidad Esperada:** N/A (sprint de preparación)
- **Criterio de Éxito:** Ambiente completo funcionando, primer commit exitoso

---

## Backlog del Sprint (Sprint 0)

### Tareas de Infraestructura

---

#### ✅ INFRA-001: Configuración de Repositorio y Estructura

**Descripción:** Crear repositorio GitHub con estructura de carpetas completa para frontend y backend

**Tareas:**

- [ ] Crear repositorio en GitHub "entre-amigas"
- [ ] Crear estructura de carpetas según ARCHITECTURE.md:
  - `/frontend` con estructura React
  - `/backend` con estructura Node.js
  - `/.github/workflows` para CI/CD
- [ ] Inicializar Git con .gitignore adecuado
- [ ] Crear README.md principal con instrucciones básicas
- [ ] Configurar ramas: `main` (producción) y `develop` (desarrollo)
- [ ] Proteger rama `main` (requiere pull request)

**Estimación:** 2-3 horas  
**Prioridad:** 1 (hacer primero)  
**Dependencias:** Ninguna

**Criterio de Terminado:**

- [ ] Repositorio creado y accesible
- [ ] Estructura de carpetas completa
- [ ] README con instrucciones de setup
- [ ] Ramas configuradas

---

#### ✅ INFRA-002: Configuración de MongoDB Atlas

**Descripción:** Configurar base de datos MongoDB Atlas (tier gratuito) y establecer conexión

**Tareas:**

- [ ] Crear cuenta en MongoDB Atlas (si no existe)
- [ ] Crear cluster gratuito M0
- [ ] Configurar usuario de base de datos
- [ ] Agregar IP a whitelist (0.0.0.0/0 para desarrollo)
- [ ] Obtener connection string
- [ ] Crear base de datos "entreamigas-dev"
- [ ] Probar conexión con MongoDB Compass
- [ ] Documentar credenciales en archivo seguro

**Estimación:** 1-2 horas  
**Prioridad:** 2  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Cluster MongoDB creado y funcionando
- [ ] Conexión probada exitosamente
- [ ] Connection string guardada de forma segura
- [ ] Base de datos creada

---

#### ✅ INFRA-003: Configuración de Cloudinary

**Descripción:** Configurar servicio de almacenamiento de imágenes Cloudinary (tier gratuito)

**Tareas:**

- [ ] Crear cuenta en Cloudinary
- [ ] Obtener credenciales (cloud_name, api_key, api_secret)
- [ ] Crear carpeta "entre-amigas" en Cloudinary
- [ ] Configurar presets de upload (límites de tamaño, formatos)
- [ ] Probar upload de imagen de prueba
- [ ] Documentar credenciales en archivo seguro

**Estimación:** 1 hora  
**Prioridad:** 3  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Cuenta Cloudinary creada
- [ ] Credenciales obtenidas
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
- [ ] Instalar dependencias base:
  ```bash
  npm install react-router-dom axios react-hook-form yup date-fns lucide-react
  ```
- [ ] Instalar Tailwind CSS:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configurar tailwind.config.js
- [ ] Configurar ESLint y Prettier
- [ ] Crear archivo .env.example con variables necesarias
- [ ] Configurar vite.config.js (puerto, proxy si necesario)
- [ ] Probar que el servidor de desarrollo corre: `npm run dev`
- [ ] Crear componente "Hello World" de prueba

**Estimación:** 3-4 horas  
**Prioridad:** 5  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Proyecto React iniciado y corriendo
- [ ] Todas las dependencias instaladas
- [ ] Tailwind CSS configurado y funcionando
- [ ] ESLint y Prettier configurados
- [ ] Servidor de desarrollo corriendo en http://localhost:5173

---

#### ✅ INFRA-006: Configuración de Proyecto Backend (Node.js + Express)

**Descripción:** Inicializar proyecto Node.js con Express y configurar dependencias base

**Tareas:**

- [ ] Inicializar proyecto: `npm init -y` en carpeta /backend
- [ ] Instalar dependencias:
  ```bash
  npm install express mongoose dotenv cors helmet express-rate-limit bcryptjs jsonwebtoken express-validator multer cloudinary resend
  ```
- [ ] Instalar dependencias de desarrollo:
  ```bash
  npm install -D nodemon
  ```
- [ ] Crear estructura de carpetas según ARCHITECTURE.md:
  - /src/config
  - /src/models
  - /src/routes
  - /src/controllers
  - /src/middleware
  - /src/services
  - /src/utils
  - /src/validators
- [ ] Crear server.js básico con Express
- [ ] Configurar scripts en package.json:
  ```json
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
  ```
- [ ] Crear archivo .env.example con todas las variables
- [ ] Configurar conexión a MongoDB
- [ ] Probar que el servidor corre: `npm run dev`
- [ ] Crear endpoint de prueba GET /api/health

**Estimación:** 3-4 horas  
**Prioridad:** 6  
**Dependencias:** INFRA-001, INFRA-002

**Criterio de Terminado:**

- [ ] Proyecto Node.js iniciado
- [ ] Todas las dependencias instaladas
- [ ] Estructura de carpetas creada
- [ ] Servidor Express corriendo en http://localhost:5000
- [ ] Conexión a MongoDB funcionando
- [ ] Endpoint /api/health respondiendo

---

## Calendario del Sprint 0

### Día 1-2: Configuración de Cuentas y Servicios

**Horas disponibles:** 6-8 hrs

**Enfoque:**

- INFRA-001: Repositorio y estructura (2-3 hrs)
- INFRA-002: MongoDB Atlas (1-2 hrs)
- INFRA-003: Cloudinary (1 hr)
- INFRA-004: Resend (2-3 hrs)

**Entregable:** Todas las cuentas creadas y credenciales documentadas

---

### Día 3-4: Configuración de Proyectos

**Horas disponibles:** 8-10 hrs

**Enfoque:**

- INFRA-005: Frontend completo (3-4 hrs)
- INFRA-006: Backend completo (3-4 hrs)
- Testing de ambos ambientes (1-2 hrs)

**Entregable:** Frontend y Backend corriendo localmente

---

### Día 5: Verificación y Documentación

**Horas disponibles:** 4-6 hrs

**Enfoque:**

- Verificar que todo funciona end-to-end
- Hacer primer commit y push a GitHub
- Actualizar README con instrucciones de instalación
- Crear archivo SETUP.md con credenciales (git ignored)
- Preparar ambiente para Sprint 1

**Entregable:** Sprint 0 completo, listo para desarrollo

---

## Riesgos y Mitigaciones (Sprint 0)

### Riesgos Identificados

| Riesgo                                           | Probabilidad | Impacto  | Plan de Mitigación                                                         |
| ------------------------------------------------ | ------------ | -------- | -------------------------------------------------------------------------- |
| Problemas con MongoDB Atlas (firewall, permisos) | 🟡 Media     | 🔴 Alto  | Tener plan B con MongoDB local. Documentar troubleshooting común           |
| Límites de servicios gratuitos no claros         | 🟢 Baja      | 🟡 Media | Leer documentación de límites antes. Considerar alternativas               |
| Conflictos de versiones de dependencias          | 🟡 Media     | 🟡 Media | Usar versiones exactas en package.json. Documentar versiones que funcionan |
| Tiempo subestimado para setup                    | 🟡 Media     | 🟡 Media | Este sprint puede extenderse 2-3 días si necesario sin afectar timeline    |

---

## Consideraciones Técnicas

### Decisiones de Arquitectura a Resolver

- [x] Stack tecnológico definido: MERN
- [x] Estructura de carpetas definida
- [x] Servicios externos seleccionados
- [ ] Convenciones de código aplicadas (ESLint/Prettier configs)

### Dependencias Externas

- **MongoDB Atlas:** Cuenta gratuita M0 (512MB storage)
- **Cloudinary:** Cuenta gratuita (25 créditos/mes)
- **Resend:** Cuenta gratuita (5,000 emails/mes)
- **GitHub:** Repositorio privado o público

### Configuración de Ambiente de Desarrollo

**Variables de Entorno Necesarias:**

**Frontend (.env.local):**

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Entre Amigas
```

**Backend (.env):**

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=dev_secret_key_min_32_characters
JWT_EXPIRE=7d
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@entreamigas.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## Definición de Terminado (Sprint 0)

El Sprint 0 está terminado cuando:

- [ ] Todos los servicios externos configurados y funcionando
- [ ] Frontend corre sin errores en localhost:5173
- [ ] Backend corre sin errores en localhost:5000
- [ ] Backend conecta exitosamente a MongoDB
- [ ] Endpoint de health check responde correctamente
- [ ] Todas las credenciales documentadas de forma segura
- [ ] Código inicial commiteado a GitHub
- [ ] README con instrucciones de instalación completas
- [ ] Estructura de carpetas completa según ARCHITECTURE.md
- [ ] Listo para comenzar desarrollo de features (Sprint 1)

---

## Checklist de Verificación Final

Antes de dar Sprint 0 como completo, verificar:

- [ ] `git clone` del repositorio funciona
- [ ] `npm install` funciona en /frontend y /backend
- [ ] `npm run dev` levanta ambos servidores sin errores
- [ ] Frontend accesible en navegador
- [ ] Backend responde a http://localhost:5000/api/health
- [ ] MongoDB Atlas muestra conexión activa
- [ ] Variables de entorno configuradas y documentadas
- [ ] .gitignore correcto (no sube .env ni node_modules)

---

## Compromiso

**Como desarrollador, me comprometo a:**

- [ ] Completar todas las tareas de infraestructura
- [ ] Documentar cada paso para referencia futura
- [ ] Probar que todo funciona antes de marcar como terminado
- [ ] No saltarme pasos por "ahorro de tiempo"
- [ ] Tener ambiente limpio y profesional desde el inicio

**Éxito del Sprint 0 = 100% de tareas completadas y ambiente funcionando**

---

## Recursos Útiles

**Documentación:**

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Resend Docs](https://resend.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)

**Tutoriales de Setup:**

- MongoDB Atlas Setup: Seguir wizard del dashboard
- Tailwind con Vite: https://tailwindcss.com/docs/guides/vite

---

---

# Planeación de Sprint - Sprint 1

**Producto:** Entre Amigas  
**Número de Sprint:** 1  
**Duración del Sprint:** 2 semanas (10 días laborables)  
**Fecha de Inicio:** [Después de completar Sprint 0]  
**Fecha de Fin:** [2 semanas después]  
**Fecha de Planeación:** 5 de noviembre, 2025  
**Responsable:** Equipo Entre Amigas

---

## Resumen del Sprint

### Objetivo del Sprint 🎯

**"Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora que explica el proyecto"**

Este es el primer sprint de desarrollo real. Establecemos las bases de autenticación y presencia pública.

### Métricas del Sprint

- **Duración:** 2 semanas (10 días laborables)
- **Capacidad Disponible:** 50-60 horas (25-30 hrs/semana)
- **Story Points Comprometidos:** 13 puntos (conservador para Sprint 1)
- **Número de Stories:** 2 User Stories
- **Velocidad Esperada:** Por definir (es el primer sprint)

**Conversión para planning:**

- L (Large) = 8 puntos
- M (Medium) = 5 puntos

---

## Backlog del Sprint

### User Stories Seleccionadas

---

#### ✅ US-001: Sistema de Autenticación Completo

**Del Product Backlog:** Epic Autenticación y Usuarios  
**Historia:** Como usuaria nueva, quiero registrarme con datos básicos para acceder a la comunidad

**Criterios de Aceptación:**

- [ ] Formulario de registro solicita: nombre completo, nombre preferido, email, teléfono, cumpleaños, ciudad
- [ ] Sistema valida datos en frontend (React Hook Form + Yup)
- [ ] Sistema valida datos en backend (express-validator)
- [ ] Password se hashea con bcrypt antes de guardar en DB
- [ ] Sistema envía email de verificación al registrarse (Resend)
- [ ] Email incluye link de verificación válido por 24 horas
- [ ] Usuaria puede hacer login con email y contraseña
- [ ] Login retorna JWT token válido por 7 días
- [ ] Sistema permite solicitar recuperación de contraseña por email
- [ ] Link de recuperación expira en 1 hora
- [ ] Formulario de cambio de contraseña funcional
- [ ] Mensajes de error claros en español
- [ ] Protected routes funcionando (redirige a login si no autenticado)

**Story Points:** 8 (Large)  
**Estimación en Horas:** 20-25 hrs  
**Prioridad en Sprint:** 1 (hacer primero - todo depende de esto)  
**Dependencias:** Ninguna (Sprint 0 completo)  
**Responsable:** Equipo Entre Amigas

**Tareas Técnicas:**

**Backend (10-12 hrs):**

- [ ] Crear modelo User en Mongoose con todos los campos
- [ ] Crear auth.routes.js con endpoints:
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - GET /api/v1/auth/verify-email/:token
  - POST /api/v1/auth/forgot-password
  - POST /api/v1/auth/reset-password/:token
  - GET /api/v1/auth/me
- [ ] Crear auth.controller.js con lógica de cada endpoint
- [ ] Crear auth.validator.js con validaciones (email, password strength, etc.)
- [ ] Implementar auth.middleware.js (verificar JWT)
- [ ] Crear token.service.js (generar y verificar JWT)
- [ ] Crear email.service.js con templates:
  - Template de bienvenida
  - Template de verificación
  - Template de recuperación
- [ ] Implementar hashing de password (bcrypt)
- [ ] Testing manual de todos los endpoints con Postman/Thunder Client

**Frontend (8-10 hrs):**

- [ ] Crear AuthContext para manejar estado de autenticación
- [ ] Crear páginas:
  - /register (RegisterPage.jsx)
  - /login (LoginPage.jsx)
  - /verify-email/:token (VerifyEmailPage.jsx)
  - /forgot-password (ForgotPasswordPage.jsx)
  - /reset-password/:token (ResetPasswordPage.jsx)
- [ ] Crear componentes de formularios:
  - RegisterForm.jsx (con React Hook Form + Yup)
  - LoginForm.jsx
  - ForgotPasswordForm.jsx
  - ResetPasswordForm.jsx
- [ ] Implementar validaciones en tiempo real
- [ ] Configurar axios interceptor para agregar JWT a headers
- [ ] Crear ProtectedRoute component
- [ ] Implementar manejo de errores global
- [ ] Guardar token en localStorage
- [ ] Auto-login si token válido al cargar app
- [ ] Testing manual de todos los flujos

**Testing (2-3 hrs):**

- [ ] Probar flujo completo: registro → email → verificación → login
- [ ] Probar recuperación de contraseña end-to-end
- [ ] Probar casos de error (email duplicado, password incorrecto, etc.)
- [ ] Verificar que protected routes funcionan
- [ ] Testing en diferentes navegadores
- [ ] Testing responsive (móvil y desktop)

**Riesgos Específicos:**

- ⚠️ Emails pueden ir a spam → Mitigación: Configurar SPF/DKIM en Resend, probar con múltiples proveedores
- ⚠️ JWT security → Mitigación: Usar secret fuerte, HTTPS en producción, expiración corta
- ⚠️ Primera vez implementando auth completo → Mitigación: Seguir arquitectura definida, revisar ejemplos de docs

---

#### ✅ US-002: Landing Page Pública

**Del Product Backlog:** Epic Experiencia Pública  
**Historia:** Como visitante, quiero entender qué es Entre Amigas antes de registrarme para decidir si unirme

**Criterios de Aceptación:**

- [ ] Hero section con título claro: "Entre Amigas - Comunidad para Mujeres Migrantes"
- [ ] Subtítulo que explica la propuesta de valor en 1-2 líneas
- [ ] Call-to-action principal: botón "Únete a la Comunidad" → /register
- [ ] Sección "¿Qué es Entre Amigas?" con misión y valores (3-4 párrafos)
- [ ] Sección "Beneficios" con iconos y texto:
  - Conoce amigas con experiencias similares
  - Accede a eventos y actividades
  - Encuentra recursos y servicios en español
  - Conecta con emprendedoras latinas
- [ ] Sección de testimonios (2-3 testimonios, pueden ser placeholder inicial)
- [ ] Call-to-action secundario en footer
- [ ] Diseño responsive (se ve bien en móvil, tablet, desktop)
- [ ] Imágenes optimizadas (carga rápida < 3 segundos)
- [ ] Paleta de colores acogedora y femenina
- [ ] Tipografía legible
- [ ] Link a "Iniciar Sesión" en header
- [ ] SEO básico: meta tags, título, descripción

**Story Points:** 5 (Medium)  
**Estimación en Horas:** 12-15 hrs  
**Prioridad en Sprint:** 2 (puede desarrollarse en paralelo con US-001)  
**Dependencias:** Ninguna  
**Responsable:** Equipo Entre Amigas

**Tareas Técnicas:**

**Diseño y Contenido (3-4 hrs):**

- [ ] Definir paleta de colores (sugerencia: tonos tierra, rosa suave, verde menta)
- [ ] Seleccionar tipografías (Google Fonts)
- [ ] Escribir copy para cada sección (misión, beneficios, CTAs)
- [ ] Buscar/crear imágenes (Unsplash, Pexels, o propias)
- [ ] Definir iconos (Lucide React)

**Desarrollo Frontend (8-10 hrs):**

- [ ] Crear LandingPage.jsx con estructura completa
- [ ] Crear componentes:
  - Hero.jsx
  - Features.jsx (beneficios)
  - Testimonials.jsx
  - CTA.jsx
  - Footer.jsx
- [ ] Implementar toda la maquetación con Tailwind CSS
- [ ] Hacer responsive con breakpoints de Tailwind
- [ ] Optimizar imágenes (lazy loading)
- [ ] Agregar meta tags en index.html
- [ ] Agregar animaciones sutiles (fade in, hover effects)

**Testing (1-2 hrs):**

- [ ] Verificar responsive en DevTools (mobile, tablet, desktop)
- [ ] Testing en Chrome, Firefox, Safari
- [ ] Verificar tiempos de carga con Lighthouse
- [ ] Verificar accesibilidad básica (contraste, alt text)
- [ ] Probar todos los links funcionan

**Riesgos Específicos:**

- ⚠️ Diseño puede tomar más tiempo de lo estimado → Mitigación: Usar componentes pre-hechos de Tailwind UI o shadcn si necesario
- ⚠️ Copy de texto puede requerir varias iteraciones → Mitigación: Preparar borrador antes del sprint

---

## Calendario del Sprint 1

### Semana 1 (Días 1-5)

**Días laborables:** Lunes - Viernes  
**Horas disponibles:** 25-30 hrs

**Enfoque Principal:**

- **Días 1-2:** Backend de Autenticación (modelos, rutas, controladores, email service)
- **Días 3-4:** Frontend de Autenticación (formularios, validaciones, context)
- **Día 5:** Testing de autenticación end-to-end, corrección de bugs

**Tareas Paralelas:**

- Comenzar diseño y contenido de Landing Page (Días 3-4)

**Daily Scrum:** 9:00 AM (5 min)

**Checkpoint Día 3 (Mid-Week):**

- ✅ Verificar: ¿Backend de auth funcionando?
- ✅ Verificar: ¿Al menos registro y login probados?

---

### Semana 2 (Días 6-10)

**Días laborables:** Lunes - Viernes  
**Horas disponibles:** 25-30 hrs

**Enfoque Principal:**

- **Días 6-7:** Desarrollo completo de Landing Page
- **Día 8:** Polish de Landing Page, optimizaciones
- **Día 9:** Testing final de ambas stories, corrección de bugs finales
- **Día 10:** Sprint Review (demo), Sprint Retrospective, preparar Sprint 2

**Daily Scrum:** 9:00 AM (5 min)

**Checkpoint Día 8 (Mid-Week):**

- ✅ Verificar: ¿Landing Page completa?
- ✅ Verificar: ¿Auth sin bugs críticos?
- ✅ Preparar: ¿Demo lista para día 10?

---

## Riesgos y Mitigaciones

### Riesgos Identificados

| Riesgo                                                | Probabilidad | Impacto  | Plan de Mitigación                                                                         |
| ----------------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------ |
| US-001 es más complejo de lo estimado (primer sprint) | 🟡 Media     | 🔴 Alto  | Si al día 7 no está terminado, simplificar: remover recuperación de password para Sprint 2 |
| Emails no funcionan correctamente                     | 🟡 Media     | 🔴 Alto  | Tener fallback: mostrar "verifica tu email" en pantalla con opción de re-enviar            |
| Diseño de Landing Page toma demasiado tiempo          | 🟢 Baja      | 🟡 Media | Usar template de Tailwind UI gratuito como base                                            |
| Bugs difíciles de resolver al final                   | 🟡 Media     | 🟡 Media | Buffer de 1 día en Semana 2. Si es crítico, extender sprint 2-3 días                       |

### Bloqueadores Anticipados

- [ ] Posible bloqueador: Configuración de DNS para emails → Plan: Usar dominio default de Resend primero
- [ ] Posible bloqueador: Problemas con JWT en frontend → Plan: Revisar docs de JWT + axios interceptors

---

## Consideraciones Técnicas

### Decisiones de Arquitectura a Resolver

- [ ] **Día 1:** Estructura exacta del modelo User (confirmar campos)
- [ ] **Día 2:** Formato exacto de respuestas de API (seguir ARCHITECTURE.md)
- [ ] **Día 3:** Dónde guardar token en frontend (localStorage vs sessionStorage) → Decidir: localStorage
- [ ] **Día 6:** Paleta de colores definitiva para Landing

### Dependencias Externas

- **Resend:** Debe estar funcionando para emails
- **MongoDB Atlas:** Debe estar accesible
- **Node.js 20.x:** Debe estar instalado localmente

### Configuración de Ambiente de Desarrollo

**Verificar antes de comenzar:**

- [ ] Frontend corre en localhost:5173
- [ ] Backend corre en localhost:5000
- [ ] MongoDB conecta sin errores
- [ ] Resend API key funciona
- [ ] .env configurados correctamente

---

## Definición de Terminado (Específica de Sprint 1)

Una User Story está Terminada cuando:

- [ ] Todos los criterios de aceptación cumplidos al 100%
- [ ] Código funcional sin errores en consola
- [ ] Testing manual exhaustivo completado
- [ ] Responsive (funciona perfecto en móvil y desktop)
- [ ] Sin bugs críticos (bugs menores se documentan para Sprint 2)
- [ ] Commits con mensajes descriptivos en español
- [ ] Code limpio y siguiendo convenciones de ARCHITECTURE.md
- [ ] Listo para demo en Sprint Review

**Objetivo Global del Sprint:** Completar 80%+ de los puntos comprometidos

**Stretch Goals (si terminamos antes del Día 9):**

- Agregar foto de perfil opcional al registro
- Mejorar animaciones en Landing Page
- Agregar botón "Resend verification email"

---

## Estructura de Daily Scrum

**Horario:** 9:00 AM cada día laborable  
**Duración:** Máximo 5 minutos  
**Formato:** Escrito en documento o Notion

**Cada día responder:**

1. ✅ **¿Qué completé ayer?**

   - Ejemplo: "Completé modelo User y rutas de registro"

2. 🎯 **¿Qué haré hoy?**

   - Ejemplo: "Hoy implementaré el servicio de emails"

3. 🚫 **¿Tengo algún bloqueador?**
   - Ejemplo: "No tengo bloqueadores" o "Necesito ayuda con JWT"

**Documentar en:** Google Docs o Notion (crear tabla por sprint)

---

## Preparación para Sprint Review

**Programado:** Día 10 del Sprint  
**Duración:** 30-60 minutos  
**Formato:** Demo + documentación

**Items a Demostrar:**

1. **US-001: Sistema de Autenticación**

   - Mostrar: Registro completo con email
   - Mostrar: Login exitoso
   - Mostrar: Email recibido con link de verificación
   - Mostrar: Recuperación de contraseña funcionando
   - Mostrar: Protected route redirigiendo si no autenticado

2. **US-002: Landing Page**
   - Mostrar: Landing page completa en desktop
   - Mostrar: Versión móvil responsive
   - Mostrar: Flujo de visitante → "Únete" → registro

**Stakeholders:** Equipo interno (tu esposa si aplica)

**Documentar:** Screenshots o grabación de pantalla de la demo

---

## Preparación para Sprint Retrospective

**Programado:** Después de Sprint Review (Día 10)  
**Duración:** 30 minutos

**Temas a Reflexionar:**

1. **¿Se cumplió el Sprint Goal?** (Objetivo de autenticación + landing)
2. **¿La estimación fue precisa?** (¿8+5 pts fue realista?)
3. **¿Qué bloqueó el progreso?** (¿Emails, JWT, diseño?)
4. **¿Qué funcionó bien?** (¿Qué mantener?)
5. **¿Qué mejorar para Sprint 2?** (Estimaciones, proceso, herramientas)

**Resultado:** Lista de acciones concretas para Sprint 2

---

## Compromiso del Sprint

**Como desarrollador, me comprometo a:**

- [ ] Trabajar en las stories seleccionadas en orden de prioridad
- [ ] Hacer Daily Scrum todos los días (aunque sea solo)
- [ ] Comunicar problemas inmediatamente (a mi mismo / equipo)
- [ ] No agregar scope nuevo sin re-planificar
- [ ] Mantener DoD como estándar mínimo de calidad
- [ ] Preparar demo funcional para Sprint Review
- [ ] Ser honesto sobre progreso y ajustar si necesario

**Éxito del Sprint 1 = 80%+ de puntos completados (mínimo US-001 al 100%)**

---

## Referencia Rápida

### 🚨 Si surge trabajo urgente no planeado:

1. **Evaluar:** ¿Es realmente urgente vs Sprint Goal?
2. **Si es crítico:** Re-planificar (quitar algo del sprint)
3. **Si no es crítico:** Agregarlo al Product Backlog para Sprint 2

### 📊 Verificar Salud del Sprint:

- **Día 3:** ¿Al menos 20% completado? (backend auth avanzado)
- **Día 5:** ¿Al menos 40% completado? (auth casi terminado)
- **Día 7:** ¿Al menos 60% completado? (landing avanzada)
- **Día 9:** ¿Al menos 90% completado? (ambas stories casi listas)

### ⚠️ Señales de Alerta (Red Flags):

- Story sin progreso por 2+ días → **Acción:** Pedir ayuda o dividir tarea
- Bloqueador no resuelto en 24 hrs → **Acción:** Buscar workaround o escalar
- Duda sobre AC de story → **Acción:** Clarificar inmediatamente
- Llegamos a Día 7 con <50% completado → **Acción:** Re-evaluar scope del sprint

---

## Herramientas y Setup

**Tablero Kanban Sugerido:**

Crear en GitHub Projects, Trello, o Notion con columnas:

- 📋 Backlog
- 🏗️ En Progreso
- 🧪 Testing
- ✅ Terminado

**Mover tasks a medida que avanzan**

**Herramientas de Desarrollo:**

- VSCode con extensiones: ESLint, Prettier, Tailwind CSS IntelliSense
- Postman o Thunder Client (testing API)
- MongoDB Compass (ver base de datos)
- Chrome DevTools (testing frontend)

---

## Checklist de Inicio de Sprint

Antes de comenzar desarrollo, verificar:

- [ ] Sprint 0 completado al 100%
- [ ] Ambiente de desarrollo funcionando
- [ ] Product Backlog revisado y claro
- [ ] Stories seleccionadas entendidas completamente
- [ ] Todos los criterios de aceptación claros
- [ ] Herramientas instaladas y funcionando
- [ ] Tiempo bloqueado en calendario (evitar interrupciones)
- [ ] Tablero Kanban creado y listo
- [ ] Daily Scrum document preparado

---

## Métricas de Éxito del Sprint 1

Al finalizar el sprint, mediremos:

✅ **Stories Completadas:** 2/2 (objetivo: 100%)  
✅ **Puntos Completados:** 13/13 (objetivo: 80%+)  
✅ **Bugs Críticos:** 0 (objetivo: 0)  
✅ **DoD Cumplido:** 100% de las stories terminadas  
✅ **Demo Exitosa:** Todas las funcionalidades demostrables  
✅ **Velocity Establecida:** [Se calculará al final para Sprint 2]

**Esta será nuestra baseline de velocity para futuros sprints.**

---

## Próximos Pasos (Después de Sprint 1)

1. **Inmediatamente:** Sprint Review + Retrospective
2. **Día siguiente:** Descanso o trabajo en bugs menores documentados
3. **Dentro de 2-3 días:** Sprint 2 Planning
   - Stories candidatas: US-003 (Dashboard), US-005 (Directorio Negocios), US-006 (Directorio Servicios)
   - Usar velocity de Sprint 1 para planificar mejor

---

**¡Éxito en tu Sprint 1! 🚀**

_Este documento es tu guía durante las próximas 2 semanas. Consúltalo diariamente._

---

**Última actualización:** 5 de noviembre, 2025  
**Próxima revisión:** Sprint Review (Día 10)  
**Responsable:** Equipo Entre Amigas
