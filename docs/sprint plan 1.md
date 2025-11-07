# Planeación de Sprint - Sprint 0 (Preparación)

**Producto:** Entre Amigas  
**Número de Sprint:** 0 (Preparación/Fundación)  
**Duración del Sprint:** 7-10 días  
**Fecha de Planeación:** 5 de noviembre, 2025  
**Última Actualización:** 6 de noviembre, 2025  
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

#### ✅ INFRA-003: Configuración de AWS S3

**Descripción:** Configurar servicio de almacenamiento de imágenes AWS S3 (tier gratuito)

**Tareas:**

- [ ] Crear cuenta en AWS (si no existe)
- [ ] Crear bucket S3 con nombre único (ej: entre-amigas-dev)
- [ ] Configurar permisos del bucket (public-read para imágenes públicas o private con signed URLs)
- [ ] Crear usuario IAM con permisos específicos para S3
- [ ] Obtener credenciales (Access Key ID y Secret Access Key)
- [ ] Configurar CORS policy en el bucket para permitir uploads desde aplicación
- [ ] Configurar lifecycle rules (opcional para optimizar costos)
- [ ] Probar upload de imagen de prueba usando AWS CLI o SDK
- [ ] Documentar credenciales en archivo seguro

**Estimación:** 1.5-2 horas  
**Prioridad:** 3  
**Dependencias:** INFRA-001

**Criterio de Terminado:**

- [ ] Bucket S3 creado y configurado
- [ ] Usuario IAM con credenciales obtenidas
- [ ] CORS configurado correctamente
- [ ] Upload de prueba exitoso
- [ ] URL pública de imagen de prueba accesible
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
  npm install express mongoose dotenv cors helmet express-rate-limit bcryptjs jsonwebtoken express-validator multer @aws-sdk/client-s3 resend
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
- INFRA-003: AWS S3 (1.5-2 hrs)
- INFRA-004: Resend (2-3 hrs)

**Entregable:** Todas las cuentas creadas y credenciales documentadas

---

### Día 3-4: Setup de Proyectos

**Horas disponibles:** 6-8 hrs

**Enfoque:**

- INFRA-005: Frontend React + Vite (3-4 hrs)
- INFRA-006: Backend Node + Express (3-4 hrs)

**Entregable:** Ambos servidores corriendo localmente sin errores

---

### Día 5-6: Integración y Testing

**Horas disponibles:** 4-6 hrs

**Enfoque:**

- Configurar variables de entorno en ambos proyectos
- Probar conexión frontend → backend
- Probar upload a AWS S3
- Probar envío de email
- Crear primer commit completo
- Documentar troubleshooting común

**Entregable:** Sistema integrado funcionando end-to-end

---

### Día 7: Buffer y Documentación

**Horas disponibles:** 2-4 hrs

**Enfoque:**

- Resolver cualquier issue pendiente
- Completar README.md con instrucciones detalladas
- Crear .env.example completo
- Verificar que todo corra en máquina limpia

**Entregable:** Sprint 0 completado y documentado

---

## Checklist de Completitud (Sprint 0)

Antes de marcar Sprint 0 como terminado:

- [ ] ✅ Repositorio GitHub creado con estructura completa
- [ ] ✅ MongoDB Atlas conectando sin errores
- [ ] ✅ AWS S3 bucket configurado y funcionando
- [ ] ✅ Resend enviando emails de prueba
- [ ] ✅ Frontend corriendo en localhost:5173
- [ ] ✅ Backend corriendo en localhost:5000
- [ ] ✅ Endpoint /api/health respondiendo
- [ ] ✅ Todas las credenciales documentadas de forma segura
- [ ] ✅ README.md con instrucciones claras de setup
- [ ] ✅ .gitignore configurado (no sube .env, node_modules, etc.)
- [ ] ✅ Primer commit exitoso a GitHub

**Al completar todo lo anterior, estamos listos para Sprint 1** 🚀

---

---

# Planeación de Sprint - Sprint 1

**Producto:** Entre Amigas  
**Número de Sprint:** 1  
**Duración del Sprint:** 2 semanas (10 días laborables)  
**Fechas del Sprint:** [Inicio] - [Fin +2 semanas]  
**Fecha de Planeación:** 5 de noviembre, 2025  
**Responsable:** Equipo Entre Amigas

---

## Resumen del Sprint

### Objetivo del Sprint 🎯

**"Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora que explica el proyecto"**

Establecemos las bases de autenticación y presencia pública.

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
- [ ] Crear middleware/auth.middleware.js para verificar JWT
- [ ] Crear services/token.service.js para generar tokens
- [ ] Crear services/email.service.js para envío de emails
- [ ] Implementar hash de passwords con bcrypt
- [ ] Testing manual con Postman/Thunder Client

**Frontend (8-10 hrs):**

- [ ] Crear AuthContext.jsx para manejar estado de auth
- [ ] Crear services/authService.js para llamadas a API
- [ ] Crear LoginForm.jsx con React Hook Form + Yup
- [ ] Crear RegisterForm.jsx con validaciones
- [ ] Crear ForgotPasswordForm.jsx
- [ ] Crear páginas: LoginPage, RegisterPage, ForgotPasswordPage
- [ ] Implementar ProtectedRoute.jsx para rutas protegidas
- [ ] Configurar axios interceptor para JWT token
- [ ] Guardar token en localStorage
- [ ] Testing manual del flujo completo

**Integration (2-3 hrs):**

- [ ] Probar registro → email → verificación → login
- [ ] Probar recuperación de contraseña end-to-end
- [ ] Verificar protected routes funcionando
- [ ] Testing en móvil y desktop

---

#### ✅ US-002: Landing Page Pública

**Del Product Backlog:** Epic Experiencia Pública  
**Historia:** Como visitante nueva, quiero entender qué es Entre Amigas y cómo puedo unirme

**Criterios de Aceptación:**

- [ ] Hero section con título claro y call to action "Únete a la Comunidad"
- [ ] Sección "Quiénes Somos" explicando el propósito (2-3 párrafos)
- [ ] Sección "Qué Ofrecemos" con íconos y descripciones (Eventos, Directorios, Blog, Comunidad)
- [ ] Sección "Cómo Funciona" en 3 pasos simples con numeración
- [ ] Footer con información de contacto (email, redes sociales placeholders)
- [ ] Diseño acogedor con paleta de colores cálida
- [ ] Responsive perfecto en móvil y desktop
- [ ] Imágenes optimizadas (stock photos o ilustraciones)
- [ ] Botón CTA lleva a página de registro

**Story Points:** 5 (Medium)  
**Estimación en Horas:** 12-15 hrs  
**Prioridad en Sprint:** 2 (puede hacerse en paralelo)  
**Dependencias:** Ninguna (independiente)  
**Responsable:** Equipo Entre Amigas

**Tareas Técnicas:**

**Preparación de Contenido (2 hrs):**

- [ ] Escribir copy para todas las secciones
- [ ] Seleccionar íconos (Lucide React)
- [ ] Encontrar 2-3 imágenes stock apropiadas
- [ ] Definir paleta de colores (usar Tailwind colors como base)

**Frontend (8-10 hrs):**

- [ ] Crear componentes:
  - Hero.jsx
  - AboutSection.jsx
  - FeaturesSection.jsx
  - HowItWorks.jsx
  - Footer.jsx
- [ ] Crear LandingPage.jsx que compone todo
- [ ] Implementar diseño responsive con Tailwind
- [ ] Optimizar imágenes (lazy loading)
- [ ] Agregar animaciones sutiles (opcional)

**Polish (2-3 hrs):**

- [ ] Revisar espaciado y alineación
- [ ] Testing responsive exhaustivo
- [ ] Optimización de performance
- [ ] Agregar meta tags básicos para SEO
- [ ] Testing en diferentes navegadores

---

## Calendario del Sprint 1

### Semana 1 (Días 1-5): Enfoque en Backend + Frontend Auth

**Días 1-2: Backend Auth Setup**

- Horas: 10-12 hrs
- Focus: Modelo User, rutas, controladores, servicios
- Entregable: API de auth funcionando

**Días 3-4: Frontend Auth + Email Testing**

- Horas: 10-12 hrs
- Focus: Formularios, context, pages, integración
- Entregable: Flujo de registro completo

**Día 5: Testing Auth + Inicio de Landing**

- Horas: 6-8 hrs
- Focus: Testing exhaustivo de auth, comenzar landing
- Entregable: Auth sin bugs + landing iniciada

---

### Semana 2 (Días 6-10): Landing Page + Polish + Testing Final

**Días 6-7: Completar Landing Page**

- Horas: 12-14 hrs
- Focus: Componentes de landing, diseño, responsive
- Entregable: Landing page completa

**Día 8: Testing Completo**

- Horas: 6-8 hrs
- Focus: Testing de ambas stories, fix bugs
- Entregable: Ambas stories funcionando al 100%

**Día 9: Polish y Preparación de Demo**

- Horas: 4-6 hrs
- Focus: Últimos ajustes, optimización, screenshots
- Entregable: Todo listo para demo

**Día 10: Sprint Review + Retrospective**

- Horas: 2-3 hrs
- Focus: Demo funcional, documentar learnings
- Entregable: Sprint completado, velocity calculada

---

## Daily Scrum Template

**Fecha:** [DD/MM/YYYY]  
**Sprint Day:** X de 10

### ✅ ¿Qué completé ayer?

_[Listar tareas completadas con checkmark]_

### 🎯 ¿Qué haré hoy?

_[Listar tareas planeadas para hoy]_

### 🚫 ¿Tengo bloqueadores?

_[Ninguno / Describir bloqueador específico]_

### 📊 Progreso del Sprint

- Stories completadas: X/2
- Puntos completados: X/13
- En track: ✅ Sí / ⚠️ Atención / ❌ No

---

## Sprint Burndown (Tracking Manual)

| Día | Puntos Restantes | Notas                          |
| --- | ---------------- | ------------------------------ |
| 0   | 13               | Sprint iniciado                |
| 1   | 13               | Backend auth iniciado          |
| 2   | 11               | Modelo User + routes completos |
| 3   | 9                | Auth backend ~80% completo     |
| 4   | 6                | Frontend auth iniciado         |
| 5   | 4                | Auth completo, landing inicio  |
| 6   | 3                | Landing 50% completo           |
| 7   | 1                | Landing 90% completo           |
| 8   | 0                | Ambas stories completas ✅     |
| 9   | 0                | Polish y testing               |
| 10  | 0                | Sprint Review                  |

**Velocity del Sprint 1:** [Calcular al final]

---

## Definition of Ready (DoR)

Una User Story está lista para el sprint cuando:

- [x] Tiene descripción clara y criterios de aceptación específicos
- [x] Está estimada (Story Points)
- [x] Dependencias identificadas y resueltas
- [x] No tiene bloqueadores técnicos
- [x] Equipo (tú) la entiende completamente

**Ambas US-001 y US-002 cumplen DoR ✅**

---

## Definition of Done (DoD)

Una User Story está terminada cuando:

- [ ] Todos los criterios de aceptación cumplidos al 100%
- [ ] Código funcional sin errores ni warnings en consola
- [ ] Testing manual exhaustivo completado
- [ ] Responsive (funciona perfecto en móvil y desktop)
- [ ] Sin bugs críticos (bugs menores se documentan)
- [ ] Mensajes en español correctos (sin typos)
- [ ] Validaciones funcionando correctamente
- [ ] Commits con mensajes descriptivos
- [ ] Code limpio siguiendo convenciones de ARCHITECTURE.md
- [ ] Listo para demo

---

## Risk Register

### Riesgos Identificados para Sprint 1

| Riesgo                                                | Probabilidad | Impacto  | Plan de Mitigación                                                                             |
| ----------------------------------------------------- | ------------ | -------- | ---------------------------------------------------------------------------------------------- |
| US-001 más complejo de lo estimado (primer sprint)    | 🟡 Media     | 🔴 Alto  | Si al día 7 no está terminado, simplificar: remover recuperación de password para Sprint 2     |
| Emails no funcionan o van a spam                      | 🟡 Media     | 🔴 Alto  | Configurar SPF/DKIM. Tener fallback: mostrar mensaje en app + opción de re-enviar              |
| Problemas con JWT en frontend (interceptors, storage) | 🟡 Media     | 🟡 Media | Revisar docs de axios interceptors. Usar ejemplos de proyectos similares                       |
| Diseño de Landing Page toma demasiado tiempo          | 🟢 Baja      | 🟡 Media | Usar template de Tailwind UI gratuito como base. Priorizar funcionalidad sobre diseño perfecto |
| Bugs difíciles de resolver al final                   | 🟡 Media     | 🟡 Media | Buffer de 1 día (Día 9). Si es crítico, extender sprint 2-3 días                               |
| Falta de tiempo por eventos inesperados               | 🟡 Media     | 🔴 Alto  | Proteger tiempo de desarrollo. Si surge urgencia, re-planificar y mover US-002 a Sprint 2      |
| Límites de servicios gratuitos no claros              | 🟢 Baja      | 🟡 Media | Leer documentación de límites antes. Considerar alternativas                                   |
| Conflictos de versiones de dependencias               | 🟡 Media     | 🟡 Media | Usar versiones exactas en package.json. Documentar versiones que funcionan                     |
| Tiempo subestimado para setup                         | 🟡 Media     | 🟡 Media | Este sprint puede extenderse 2-3 días si necesario sin afectar timeline                        |

---

## Consideraciones Técnicas

### Decisiones de Arquitectura a Resolver

- [x] Stack tecnológico definido: MERN
- [x] Estructura de carpetas definida
- [x] Servicios externos seleccionados
- [ ] Convenciones de código aplicadas (ESLint/Prettier configs)

### Dependencias Externas

- **MongoDB Atlas:** Cuenta gratuita M0 (512MB storage)
- **AWS S3:** Cuenta gratuita (5GB primer año)
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
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=entre-amigas-dev
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
- [ ] Resolver bloqueadores dentro de 24 horas
- [ ] Mantener calidad de código desde el inicio
- [ ] Estar listo para comenzar Sprint 1 sin problemas técnicos

**Éxito del Sprint 0 = Ambiente completo funcionando + primer commit exitoso**

---

## Herramientas Recomendadas

**Gestión de Tareas:**

- Notion, Trello, o GitHub Projects para Kanban
- Google Sheets para tracking de horas

**Desarrollo:**

- VSCode con extensiones: ESLint, Prettier, Tailwind IntelliSense
- Postman o Thunder Client para testing de API
- MongoDB Compass para visualizar datos
- Git GUI (opcional): GitKraken, SourceTree

**Comunicación:**

- Slack o Discord para notas rápidas (aunque trabajes solo)
- Google Docs para documentación

---

## Referencias Útiles

**Documentación:**

- MongoDB Atlas: https://docs.atlas.mongodb.com
- AWS S3: https://docs.aws.amazon.com/s3/
- Resend: https://resend.com/docs
- React + Vite: https://vitejs.dev/guide/
- Express.js: https://expressjs.com/
- Tailwind CSS: https://tailwindcss.com/docs

**Troubleshooting Común:**

- CORS errors → Verificar CORS_ORIGIN en backend .env
- MongoDB connection timeout → Verificar IP whitelist
- AWS S3 access denied → Verificar IAM permissions y bucket policy
- Email no llega → Verificar spam folder, API key correcto

---

**¡Éxito en tu Sprint 0 y Sprint 1! 🚀**

_Este documento es tu guía. Consúltalo frecuentemente._

---

**Última actualización:** 6 de noviembre, 2025  
**Próxima revisión:** Sprint Review (Día 10)  
**Responsable:** Equipo Entre Amigas
