# TAREAS - Sprint 1

**Producto:** Entre Amigas  
**Sprint:** 1 - Usuarias pueden registrarse, verificar email, hacer login y ver landing page  
**Fechas del Sprint:** [Inicio] - [2 semanas después]  
**Última Actualización:** 5 de noviembre, 2025 - 10:00 AM

---

## Resumen del Sprint

### Objetivo del Sprint 🎯

**"Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora que explica el proyecto"**

### Estadísticas del Sprint

- **Total de Tareas:** 47 tareas
- **Horas Estimadas:** ~52-60 hrs
- **User Stories:** 2 stories
- **Día Actual:** Día 1 de 10

### Resumen de Progreso

- ✅ **Completadas:** 23 tareas (Sprint 0: 7/7 | Sprint 1: 16/47 = 34.0% ✨)
- 🔄 **En Progreso:** 0 tareas
- ⏸️ **Bloqueadas:** 0 tareas
- 📋 **Sin Empezar:** 31 tareas Sprint 1

---

## 🔧 Sprint 0 - Infraestructura (Prerequisito)

**Objetivo:** Establecer infraestructura completa antes de Sprint 1

### Tareas de Sprint 0

- ✅ **[INFRA-001]** [2025-11-06 11:45] Setup de Repositorio y Estructura - S (30 min)
  - **Completado:** Estructura completa de carpetas creada
  - **Archivos creados:**
    - README.md con instrucciones completas
    - frontend/src/ con todas las carpetas features, shared, routes, assets, styles
    - backend/src/ con todas las carpetas config, models, routes, controllers, middleware, services, utils, validators
    - .gitkeep en todas las carpetas vacías
  - **Commit:** a813ec5 - "chore: configuración inicial de estructura del proyecto"
  - **Tiempo real:** 30 min
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-002]** [2025-11-06 12:10] Configuración de MongoDB Atlas - S (1 hr)
  - **Completado:** MongoDB Atlas configurado y connection string integrado
  - **Archivos creados/modificados:**
    - backend/.env con MONGODB_URI y todas las variables
    - backend/.env.example como template
    - frontend/.env.local con VITE_API_URL
    - frontend/.env.example como template
    - .mcp.json actualizado con MONGODB_URI
  - **Database:** entreamigas-dev
  - **Usuario:** patricio_db_user
  - **Cluster:** cluster0.3dlxql3.mongodb.net
  - **Commit:** 5d61900 - "chore: configuración de variables de entorno y MongoDB Atlas"
  - **Tiempo real:** 25 min
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-003]** [2025-11-06 12:45] Configuración de AWS S3 - S (1-1.5 hrs)
  - **Completado:** AWS S3 configurado con credenciales y documentación
  - **Archivos creados/modificados:**
    - backend/.env actualizado con credenciales AWS (NO commiteado)
    - backend/src/config/s3-cors-config.json (configuración CORS)
    - backend/src/config/AWS_S3_SETUP.md (documentación completa)
  - **Bucket:** entre-amigas-dev
  - **Región:** us-east-1
  - **Access Key ID:** AKIAT7OTX6CAKQLFNJNI
  - **Commit:** 85dc184 - "chore: configuración de AWS S3"
  - **Tiempo real:** 30 min
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-004]** [2025-11-07 13:30] Configuración de Resend - S (2-3 hrs)
  - **Completado:** Resend Email Service configurado con API key y documentación
  - **Archivos creados/modificados:**
    - backend/.env actualizado con RESEND_API_KEY (NO commiteado)
    - backend/src/config/RESEND_SETUP.md (documentación completa)
  - **API Key:** re_SPVSdTZe_7yVhVDj6RssNL1kDquvU8Q4A (configurada)
  - **Free Tier:** 3,000 emails/mes, 100 emails/día
  - **Documentación incluye:**
    - Instrucciones de configuración paso a paso
    - Ejemplos de uso del SDK de Resend
    - 5 tipos de emails del sistema definidos
    - Templates HTML recomendados
    - Testing y troubleshooting
    - Límites y cuotas
    - Buenas prácticas de seguridad
  - **Commit:** eb005c2 - "chore: configuración de Resend email service"
  - **Tiempo real:** 30 min
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-005]** [2025-11-07 14:00] Configuración Frontend React + Vite - M (2 hrs)
  - **Completado:** Frontend completamente configurado con React 18 + Vite 5 + Tailwind CSS 3
  - **Archivos creados/modificados:**
    - frontend/package.json (React 18.3.1, Vite 5.4.8, Tailwind 3.4.13, React Router, Axios, React Hook Form, Yup, Lucide React)
    - frontend/vite.config.js (configuración con proxy API)
    - frontend/tailwind.config.js (paleta de colores primary/secondary)
    - frontend/postcss.config.js (autoprefixer)
    - frontend/.eslintrc.cjs (reglas ESLint)
    - frontend/index.html (HTML base con SEO)
    - frontend/src/main.jsx (punto de entrada React)
    - frontend/src/App.jsx (componente raíz con página de verificación)
    - frontend/src/index.css (Tailwind imports + estilos globales)
    - frontend/.gitignore (node_modules, dist, .env)
  - **Dependencias instaladas:** 379 paquetes (React, Vite, Tailwind, Router, Axios, Forms, Validación, Iconos)
  - **Verificaciones:**
    - ✅ Vite 5.4.21 instalado y funcional
    - ✅ Tailwind CSS 3.4.18 instalado y funcional
    - ✅ React 18.3.1 configurado
    - ✅ Variables de entorno configuradas (.env.local)
    - ✅ ESLint configurado
  - **Commit:** 871c893 - "feat: configuración completa de Frontend con React 18 + Vite 5 + Tailwind CSS 3"
  - **Tiempo real:** 45 min
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-006]** [2025-11-07 14:45] Configuración Backend Node + Express - M (2-3 hrs)
  - **Completado:** Backend completamente configurado con Express 4 + Mongoose 7 + MongoDB Atlas
  - **Archivos creados/modificados:**
    - backend/package.json (Express 4.19.2, Mongoose 7.6.3, JWT, bcrypt, AWS SDK, Resend SDK, multer, helmet, cors, rate-limit, morgan)
    - backend/server.js (servidor Express con middleware completo)
    - backend/src/config/database.js (conexión a MongoDB Atlas)
    - backend/src/routes/index.js (sistema de rutas modular)
    - backend/src/middleware/errorHandler.js (manejo centralizado de errores)
    - backend/.gitignore (archivos ignorados)
  - **Dependencias instaladas:** 460 paquetes (Express, Mongoose, JWT, bcrypt, AWS SDK, Resend, multer, helmet, cors, rate-limit, morgan, nodemon)
  - **Configuraciones:**
    - ✅ Express 4.19.2 configurado
    - ✅ Mongoose 7.6.3 con conexión a MongoDB Atlas
    - ✅ Middleware de seguridad (helmet)
    - ✅ CORS configurado para frontend
    - ✅ Rate limiting (100 req/15min)
    - ✅ Morgan logger para desarrollo
    - ✅ Error handler centralizado
    - ✅ Health check endpoint (/health)
    - ✅ Sistema de rutas modular
  - **Endpoints configurados:**
    - GET /health - Health check del servidor
    - GET /api/v1 - Info de la API
  - **Commit:** 4b19d7f - "feat: configuración completa de Backend con Express 4 + Mongoose 7 + MongoDB Atlas"
  - **Tiempo real:** 1 hr
  - **Status:** ✅ COMPLETADA

---

- ✅ **[INFRA-007]** [2025-11-07 15:30] Configuración AWS S3 Upload Service - S (2 hrs)
  - **Completado:** Servicio completo de upload/delete de archivos a AWS S3
  - **Archivos creados:**
    - backend/src/config/aws.js (cliente S3, configuración de carpetas, tipos de archivos, límites)
    - backend/src/services/upload.service.js (uploadToS3, deleteFromS3, getSignedUrl, uploadMultiple, replaceFile)
    - backend/src/middleware/upload.middleware.js (multer para single/multiple images y documents, manejo de errores)
    - backend/src/controllers/upload.controller.js (uploadTestImage, uploadUserProfile, uploadMultipleImages, deleteFile, getSignedUrl)
    - backend/src/routes/upload.routes.js (rutas de upload)
  - **Archivos modificados:**
    - backend/src/routes/index.js (integración de rutas de upload)
  - **Funcionalidades implementadas:**
    - ✅ Upload de single file a S3 con nombres únicos (crypto)
    - ✅ Upload de múltiples archivos
    - ✅ Delete de archivos de S3
    - ✅ Generación de signed URLs temporales
    - ✅ Reemplazo de archivos (delete + upload)
    - ✅ Middleware de multer con validación de tipos
    - ✅ Límites de tamaño: 5MB imágenes, 10MB documentos
    - ✅ Estructura de carpetas: users/, events/, businesses/, blog/, temp/
    - ✅ Manejo de errores de multer
  - **Endpoints configurados:**
    - POST /api/v1/upload/test - Upload de imagen de prueba
    - POST /api/v1/upload/user/profile - Upload de foto de perfil
    - POST /api/v1/upload/multiple - Upload de múltiples imágenes (max 5)
    - DELETE /api/v1/upload/:key - Eliminar archivo
    - GET /api/v1/upload/signed-url/:key - Obtener URL firmada temporal
  - **Commit:** 62fb630 - "feat: implementación completa de AWS S3 Upload Service"
  - **Tiempo real:** 1 hr
  - **Status:** ✅ COMPLETADA

---

## Desglose de Tareas por User Story

### 📦 US-001: Sistema de Autenticación Completo

**Story Points:** 8 (Large)  
**Prioridad en Sprint:** 1  
**Status:** 📋 Sin Empezar

**Criterios de Aceptación:**

- [ ] Formulario de registro solicita todos los campos necesarios
- [ ] Sistema valida datos en frontend y backend
- [ ] Password se hashea con bcrypt
- [ ] Sistema envía email de verificación
- [ ] Usuaria puede hacer login con email/password
- [ ] Login retorna JWT token válido
- [ ] Sistema permite recuperación de contraseña
- [ ] Mensajes de error claros en español
- [ ] Protected routes funcionando

#### Tareas para esta Story:

##### 🔴 P0 - Configuración Crítica

---

- ✅ **[TASK-001]** [2025-11-07 17:00] Crear modelo User en Mongoose

  - **Capa:** 🗄️ DATABASE
  - **Estimado:** S (45 min)
  - **Archivos:** `backend/src/models/User.js`
  - **Descripción:**
    - Crear schema con campos: fullName, preferredName, email, password, phone, birthday, city, role, isVerified, verificationToken, resetPasswordToken, resetPasswordExpires
    - Agregar validaciones: email unique, password minlength 8
    - Agregar índices: email (unique), role, city
    - Agregar hook pre-save para hashear password con bcrypt
    - Agregar método comparePassword
    - Agregar timestamps automáticos
  - **Dependencias:** Ninguna
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 40 min
  - **Notas:**
    - Modelo User completo con 21 campos del schema
    - Validaciones completas incluyendo edad mínima 18 años
    - 7 índices configurados para performance (email unique, role, city, isActive, isVerified, city+isActive compuesto)
    - 2 hooks pre-save: hash de password con bcrypt (10 rounds) y generación automática de verification token
    - 1 hook post-save: log en desarrollo
    - 4 métodos de instancia: comparePassword, generatePasswordResetToken, isVerificationTokenExpired, getPublicProfile
    - 3 métodos estáticos: findByEmail, findActiveByCity, countVerified
    - 1 virtual: age (calcula edad desde birthday)
    - Conversión a ES modules (import/export) para compatibilidad con backend
    - Testeo exitoso con MongoDB Atlas - todos los índices y métodos funcionando
    - Commit: 0ce497a

---

- [x] **[TASK-002]** Configurar servicio de email con Resend

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Real:** 35 min
  - **Archivos:** `backend/src/config/email.js`, `backend/src/services/email.service.js`, `backend/test-email-simple.js`, `backend/src/scripts/test-email.js`
  - **Descripción:**
    - ✅ Importar y configurar Resend SDK
    - ✅ Crear función sendWelcomeEmail con template HTML profesional
    - ✅ Crear función sendVerificationEmail con link y token
    - ✅ Crear función sendPasswordResetEmail
    - ✅ BONUS: Crear función sendPasswordChangedEmail
    - ✅ Manejar errores de envío con try/catch
    - ✅ Probar envío con email de prueba (dev@jappi.ca) - EXITOSO
    - ✅ Scripts de testing (simple y completo)
    - ✅ Documentación completa (README-EMAIL.md)
  - **Dependencias:** Ninguna
  - **Status:** ✅ Completada (2025-01-07)

---

- [x] **[TASK-003]** Crear servicio de tokens JWT

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Real:** 30 min
  - **Archivos:** `backend/src/services/token.service.js`, `backend/test-token-service.js`
  - **Descripción:**
    - ✅ Función generateAuthToken(userId, payload) - JWT con expiración 7d configurable
    - ✅ Función generateVerificationToken() - token random 64 chars (crypto)
    - ✅ Función generateResetToken() - token random 64 chars (crypto)
    - ✅ Función verifyToken(token) - verifica JWT con manejo de errores
    - ✅ Función hashToken(token) - SHA256 para almacenar en DB de forma segura
    - ✅ BONUS: generateRefreshToken(userId) - JWT 30d para refresh token
    - ✅ BONUS: decodeToken(token) - decode sin verificar (debug)
    - ✅ BONUS: getTokenExpiration(token) - info de expiración
    - ✅ Usar JWT_SECRET del .env
    - ✅ Testing completo con 10 casos de prueba - EXITOSO
    - ✅ Documentación completa (README-TOKEN.md)
  - **Dependencias:** Ninguna
  - **Status:** ✅ Completada (2025-01-07)

---

- [x] **[TASK-004]** Crear middleware de autenticación

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Real:** 35 min
  - **Archivos:** `backend/src/middleware/auth.middleware.js`, `backend/test-auth-middleware.js`
  - **Descripción:**
    - ✅ Extraer token del header Authorization (Bearer token)
    - ✅ Verificar token con JWT usando token.service
    - ✅ Buscar usuario en DB (preparado para cuando exista modelo User)
    - ✅ Agregar req.user con datos del usuario
    - ✅ Manejar errores: token inválido, expirado, usuario no existe, tipo incorrecto
    - ✅ Retornar 401 si no autenticado
    - ✅ BONUS: authorize(...roles) - verificar múltiples roles
    - ✅ BONUS: optionalAuth() - autenticación opcional para rutas públicas
    - ✅ BONUS: requireVerified() - verificar email confirmado
    - ✅ BONUS: requireOwnership(param) - verificar propiedad de recurso
    - ✅ Testing completo con 10 casos de prueba - EXITOSO (10/10)
    - ✅ Documentación completa (README-AUTH.md)
  - **Dependencias:** TASK-003
  - **Status:** ✅ Completada (2025-01-07)

---

- ✅ **[TASK-005]** [2025-11-07 16:15] Crear AuthContext en React

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/auth/context/AuthContext.jsx`
  - **Descripción:**
    - Crear Context con estado: user, token, isAuthenticated, isLoading
    - Función login(token, user) - guarda en localStorage y state
    - Función logout() - limpia localStorage y state
    - Función loadUser() - carga usuario si token existe
    - useEffect para auto-login al montar
    - Export useAuth hook
  - **Dependencias:** Ninguna
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 25 min
  - **Notas:**
    - AuthContext completo con todas las funcionalidades requeridas
    - Agregada función updateUser() adicional para futuras actualizaciones de perfil
    - Manejo de errores robusto con try-catch
    - Optimización con useCallback para evitar re-renders innecesarios
    - Documentación JSDoc completa en español
    - README.md con ejemplos de uso creado
    - PropTypes para validación de props

---

- ✅ **[TASK-006]** [2025-11-07 16:30] Configurar axios con interceptor

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/shared/utils/api.js`
  - **Descripción:**
    - Crear instancia de axios con baseURL del .env
    - Agregar interceptor de request para incluir JWT en headers
    - Agregar interceptor de response para manejar errores 401
    - Si 401, hacer logout automático
    - Export instancia configurada
  - **Dependencias:** TASK-005
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 20 min
  - **Notas:**
    - Instancia de axios configurada con baseURL desde VITE_API_URL
    - Request interceptor agrega JWT automáticamente desde localStorage
    - Response interceptor maneja 401 con logout automático y redirect a /login
    - Manejo adicional de errores 403, 404, 500 con logs informativos
    - Timeout configurado a 10 segundos
    - README.md completo con ejemplos de uso para GET, POST, PUT, DELETE
    - Compatible con FormData para uploads
    - Documentación de manejo de errores robusto

---

##### 🟡 P1 - Implementación Core

**BACKEND - Endpoints de Autenticación**

---

- [x] **[TASK-007]** Crear validaciones para registro

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Real:** 30 min
  - **Archivos:** `backend/src/validators/auth.validator.js`, `backend/test-validators.js`
  - **Descripción:**
    - ✅ Usar express-validator 7.2.0
    - ✅ Validar registerValidation: fullName (2-100), preferredName (2-50), email (válido), password (min 8 + fuerte), confirmPassword, phone (requerido), birthday (fecha válida, mayor 18), city (requerido)
    - ✅ Validar loginValidation: email, password
    - ✅ Validar forgotPasswordValidation: email
    - ✅ Validar resetPasswordValidation: password, confirmPassword
    - ✅ BONUS: updateProfileValidation - actualización de perfil (campos opcionales)
    - ✅ BONUS: changePasswordValidation - cambio de contraseña autenticado
    - ✅ handleValidationErrors - middleware de manejo de errores
    - ✅ Mensajes de error en español
    - ✅ Sanitización automática (trim, normalizeEmail, toLowerCase)
    - ✅ Validaciones personalizadas (edad 18+, contraseña fuerte, confirmación)
    - ✅ Testing completo con 10 casos de prueba - EXITOSO (10/10)
    - ✅ Documentación completa (README-VALIDATORS.md)
  - **Dependencias:** TASK-001
  - **Status:** ✅ Completada (2025-01-07)

---

- [x] **[TASK-008]** Implementar controlador de registro

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1.5 hrs)
  - **Real:** 1 hr
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función register(req, res):
      - Validar datos con validator
      - Verificar que email no exista (409 si existe)
      - Crear usuario (password se hashea automático)
      - Generar verificationToken
      - Guardar usuario en DB
      - Enviar email de verificación
      - Retornar 201 con mensaje de éxito
      - Manejar errores con try-catch
  - **Dependencias:** TASK-001, TASK-002, TASK-007
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-009]** Implementar controlador de login

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1 hr)
  - **Real:** 45 min
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función login(req, res):
      - Buscar usuario por email con .select('+password')
      - Verificar que usuario existe (401 si no)
      - Comparar password con user.comparePassword()
      - Verificar que usuario está verificado (403 si no)
      - Generar JWT token
      - Retornar 200 con token y user data (sin password)
      - Manejar errores
  - **Dependencias:** TASK-001, TASK-003
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-010]** Implementar controlador de verificación de email

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (45 min)
  - **Real:** 30 min
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función verifyEmail(req, res):
      - Extraer token del req.params
      - Buscar usuario con ese verificationToken
      - Verificar que token no haya expirado (24 hrs)
      - Actualizar isVerified = true
      - Limpiar verificationToken
      - Guardar usuario
      - Retornar 200 con mensaje de éxito
      - Manejar errores: token inválido/expirado
  - **Dependencias:** TASK-001
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-011]** Implementar controlador de forgot password

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1 hr)
  - **Real:** 40 min
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función forgotPassword(req, res):
      - Buscar usuario por email
      - Generar resetPasswordToken
      - Setear resetPasswordExpires = Date.now() + 1 hora
      - Guardar usuario
      - Enviar email con link de reset
      - Retornar 200 con mensaje genérico (por seguridad)
      - Manejar errores
  - **Dependencias:** TASK-001, TASK-002, TASK-003
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-012]** Implementar controlador de reset password

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (45 min)
  - **Real:** 35 min
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función resetPassword(req, res):
      - Extraer token de params y nueva password de body
      - Buscar usuario con resetPasswordToken y expiration > now
      - Actualizar password (se hashea automático)
      - Limpiar resetPasswordToken y resetPasswordExpires
      - Guardar usuario
      - Enviar email de confirmación (opcional)
      - Retornar 200 con mensaje de éxito
  - **Dependencias:** TASK-001
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-013]** Implementar controlador de /me (get current user)

  - **Capa:** 🔧 BACKEND
  - **Estimado:** XS (15 min)
  - **Real:** 10 min
  - **Archivos:** `backend/src/controllers/auth.controller.js`, `backend/src/routes/auth.routes.js`
  - **Descripción:**
    - Función getMe(req, res):
      - Retornar req.user (viene del auth middleware)
      - Formato: { success: true, data: user }
  - **Dependencias:** TASK-004
  - **Status:** ✅ Completado (2025-01-07)

---

- [x] **[TASK-014]** Crear rutas de autenticación

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Real:** 0 min (Completado junto con TASK-008 a TASK-013)
  - **Archivos:** `backend/src/routes/auth.routes.js`, `backend/src/routes/index.js`
  - **Descripción:**
    - POST /api/v1/auth/register - con registerValidation ✅
    - POST /api/v1/auth/login - con loginValidation ✅
    - GET /api/v1/auth/verify-email/:token ✅
    - POST /api/v1/auth/forgot-password - con forgotPasswordValidation ✅
    - POST /api/v1/auth/reset-password/:token - con resetPasswordValidation ✅
    - GET /api/v1/auth/me - con authMiddleware ✅
    - Importar en routes/index.js ✅
  - **Dependencias:** TASK-008 hasta TASK-013
  - **Status:** ✅ Completado (2025-01-07)

---

**FRONTEND - Formularios y Páginas de Autenticación**

---

- ✅ **[TASK-015]** [2025-11-07 17:15] Crear servicio de autenticación en frontend

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/auth/services/authService.js`
  - **Descripción:**
    - Función register(userData) - POST /auth/register
    - Función login(email, password) - POST /auth/login
    - Función verifyEmail(token) - GET /auth/verify-email/:token
    - Función forgotPassword(email) - POST /auth/forgot-password
    - Función resetPassword(token, password) - POST /auth/reset-password/:token
    - Función getMe() - GET /auth/me
    - Retornar data o throw error
  - **Dependencias:** TASK-006, TASK-014
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 30 min
  - **Notas:**
    - AuthService completo con 6 funciones de autenticación
    - Manejo de errores robusto en 3 niveles (servidor, red, config)
    - Mensajes de error en español extraídos del backend
    - Errores de validación múltiples concatenados
    - Documentación JSDoc completa en cada función
    - README.md extenso con 6 ejemplos de uso completos
    - Integración perfecta con axios interceptor (TASK-006)
    - Compatible con AuthContext (TASK-005)
    - Usa la instancia de api configurada automáticamente

---

- ✅ **[TASK-016]** [2025-11-07 17:45] Crear componente RegisterForm

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** M (2 hrs)
  - **Archivos:** `frontend/src/features/auth/components/RegisterForm.jsx`
  - **Descripción:**
    - Usar React Hook Form + Yup para validaciones
    - Campos: fullName, preferredName, email, phone, birthday (date picker), password, confirmPassword, city (select o input)
    - Validaciones en español
    - Botón submit con loading state
    - Mostrar errores del backend
    - Al éxito: mostrar mensaje "Revisa tu email para verificar cuenta"
    - Diseño con Tailwind CSS responsive
  - **Dependencias:** TASK-015
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 1.5 hrs
  - **Notas:**
    - RegisterForm completo con React Hook Form + Yup
    - 8 campos validados: fullName, preferredName, email, phone, birthday, city, password, confirmPassword
    - Schema de Yup robusto con validaciones custom (edad 18+, contraseña fuerte, regex)
    - UI/UX profesional: mostrar/ocultar passwords con iconos Eye/EyeOff
    - Loading state con spinner animado (Lucide React Loader2)
    - Select de ciudades principales de Canadá
    - Mensaje de éxito después de registro con reset del formulario
    - Manejo de errores del backend con display claro
    - Validación en tiempo real (onBlur)
    - Diseño responsive con Tailwind CSS
    - README.md completo con ejemplos de uso y testing
    - Accesibilidad: labels, aria-invalid, tab order

---

- ✅ **[TASK-017]** [2025-11-07 18:00] Crear página RegisterPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/auth/pages/RegisterPage.jsx`
  - **Descripción:**
    - Layout centrado con Card
    - Título "Únete a Entre Amigas"
    - Incluir RegisterForm component
    - Link a "¿Ya tienes cuenta? Inicia sesión"
    - Responsive
  - **Dependencias:** TASK-016
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 15 min
  - **Notas:**
    - RegisterPage completa con layout profesional
    - Background con gradient (blue-50 to purple-50)
    - Card blanca con shadow-xl y rounded-2xl
    - Logo placeholder circular con iniciales "EA"
    - Título principal + descripción bajo título
    - RegisterForm integrado perfectamente
    - Divider visual con texto "¿Ya tienes cuenta?"
    - Link a LoginPage con hover effects
    - Footer text motivacional bajo el card
    - Diseño responsive mobile-first
    - Padding adecuado en mobile (px-4, py-12)
    - Min-height 100vh para centrado vertical

---

- ✅ **[TASK-018]** [2025-11-07 18:30] Crear componente LoginForm

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** M (1 hr)
  - **Archivos:** `frontend/src/features/auth/components/LoginForm.jsx`
  - **Descripción:**
    - Usar React Hook Form + Yup
    - Campos: email, password
    - Checkbox "Recordarme" (opcional)
    - Validaciones en tiempo real
    - Botón submit con loading
    - Mostrar errores del backend
    - Al éxito: guardar token con useAuth y redirect a /dashboard
    - Link a "¿Olvidaste tu contraseña?"
  - **Dependencias:** TASK-015, TASK-005
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 45 min
  - **Notas:**
    - LoginForm completo con React Hook Form + Yup validation
    - 2 campos: email (formato válido) + password (min 6 chars)
    - Checkbox "Recordarme" (UI funcional, lógica pendiente)
    - Yup schema con validación de formato
    - Show/hide password con Eye/EyeOff icons
    - Loading state con spinner animado Loader2
    - Integración con authService.login()
    - Integración con useAuth().login() para guardar token
    - Redirect automático a /dashboard después de éxito
    - Manejo de errores del backend (401, 403, 500)
    - Link a "¿Olvidaste tu contraseña?" funcional
    - autoComplete="email" y "current-password" para mejor UX
    - Diseño responsive con Tailwind
    - README.md actualizado con documentación completa
    - Ejemplos de testing con mocks incluidos
    - Accesibilidad: labels, tab order, placeholders
    - Validación en tiempo real (onBlur)

---

- ✅ **[TASK-019]** [2025-11-07 18:45] Crear página LoginPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/auth/pages/LoginPage.jsx`
  - **Descripción:**
    - Layout centrado
    - Título "Bienvenida de Vuelta"
    - Incluir LoginForm
    - Link a "¿No tienes cuenta? Regístrate"
    - Responsive
  - **Dependencias:** TASK-018
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 10 min
  - **Notas:**
    - LoginPage completa con layout profesional
    - Background con gradient (blue-50 to purple-50)
    - Card blanca centrada con shadow-xl y rounded-2xl
    - Logo placeholder circular con iniciales "EA"
    - Título "Bienvenida de Vuelta" + descripción
    - LoginForm integrado perfectamente
    - Divider visual con texto "¿No tienes cuenta?"
    - Link a RegisterPage con hover effects usando React Router Link
    - Footer text acogedor bajo el card
    - Diseño responsive mobile-first
    - Padding adecuado en mobile (px-4, py-12)
    - Min-height 100vh para centrado vertical

---

- ✅ **[TASK-020]** [2025-11-07 19:00] Crear página VerifyEmailPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/auth/pages/VerifyEmailPage.jsx`
  - **Descripción:**
    - Extraer token de useParams
    - useEffect para llamar authService.verifyEmail(token) al montar
    - Mostrar loading spinner
    - Si éxito: mensaje "Email verificado exitosamente" + link a login
    - Si error: mensaje de error + opción de reenviar email (opcional)
    - Diseño centrado con iconos
  - **Dependencias:** TASK-015
  - **Status:** ✅ COMPLETADA
  - **Tiempo real:** 25 min
  - **Notas:**
    - VerifyEmailPage completa con 3 estados (loading, success, error)
    - useParams para extraer token de la URL
    - useEffect con verificación automática al montar
    - Estado "loading" con Loader2 spinner animado
    - Estado "success" con CheckCircle icon verde
    - Mensaje de éxito personalizado del backend
    - Link a /login con botón destacado
    - Estado "error" con XCircle icon rojo
    - Mensaje de error del backend
    - Link a /login siempre disponible
    - Link a /register si el token expiró (detección inteligente)
    - Manejo de token ausente en URL
    - Footer con link a soporte por email
    - Diseño responsive con gradient background
    - Card blanca centrada con shadow-xl
    - Logo placeholder circular "EA"
    - Iconos de Lucide React (Loader2, CheckCircle, XCircle)

---

- [ ] **[TASK-021]** Crear componente ForgotPasswordForm

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/auth/components/ForgotPasswordForm.jsx`
  - **Descripción:**
    - Usar React Hook Form
    - Campo: email
    - Validación de email
    - Botón submit
    - Al éxito: mensaje "Revisa tu email para instrucciones"
    - Mostrar errores
  - **Dependencias:** TASK-015
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-022]** Crear página ForgotPasswordPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/auth/pages/ForgotPasswordPage.jsx`
  - **Descripción:**
    - Layout centrado
    - Título "Recuperar Contraseña"
    - Incluir ForgotPasswordForm
    - Link de regreso a login
  - **Dependencias:** TASK-021
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-023]** Crear componente ResetPasswordForm

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/auth/components/ResetPasswordForm.jsx`
  - **Descripción:**
    - Usar React Hook Form + Yup
    - Campos: password, confirmPassword
    - Validaciones: min 8 caracteres, passwords coinciden
    - Botón submit
    - Al éxito: mensaje de éxito + redirect a login
    - Mostrar errores
  - **Dependencias:** TASK-015
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-024]** Crear página ResetPasswordPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/auth/pages/ResetPasswordPage.jsx`
  - **Descripción:**
    - Extraer token de useParams
    - Layout centrado
    - Título "Nueva Contraseña"
    - Incluir ResetPasswordForm con token
  - **Dependencias:** TASK-023
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-025]** Crear componente ProtectedRoute

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/routes/ProtectedRoute.jsx`
  - **Descripción:**
    - Wrapper component que verifica autenticación
    - Usar useAuth para verificar isAuthenticated
    - Si autenticado: render children
    - Si no autenticado: redirect a /login
    - Mostrar loading mientras verifica
  - **Dependencias:** TASK-005
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-026]** Configurar rutas de autenticación en React Router

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/routes/AppRoutes.jsx`
  - **Descripción:**
    - Configurar React Router
    - Rutas públicas:
      - / → LandingPage
      - /register → RegisterPage
      - /login → LoginPage
      - /verify-email/:token → VerifyEmailPage
      - /forgot-password → ForgotPasswordPage
      - /reset-password/:token → ResetPasswordPage
    - Rutas protegidas (envolver en ProtectedRoute):
      - /dashboard → DashboardPage (crear placeholder)
    - Ruta 404 → NotFoundPage
  - **Dependencias:** TASK-017, TASK-019, TASK-020, TASK-022, TASK-024, TASK-025
  - **Status:** 📋 Sin Empezar

---

##### 🟢 P2 - Testing y Pulido

---

- [ ] **[TASK-027]** Testing manual de flujo de registro completo

  - **Capa:** 🧪 TESTING
  - **Estimado:** S (45 min)
  - **Descripción:**
    - Llenar formulario de registro con datos válidos
    - Verificar que se crea usuario en MongoDB
    - Verificar que llega email de verificación
    - Click en link de verificación
    - Verificar que isVerified = true en DB
    - Intentar login antes de verificar (debe fallar)
    - Intentar login después de verificar (debe funcionar)
    - Verificar que token JWT se guarda en localStorage
    - Probar casos de error: email duplicado, campos inválidos
  - **Dependencias:** TASK-026
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-028]** Testing manual de recuperación de contraseña

  - **Capa:** 🧪 TESTING
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Solicitar recuperación de contraseña
    - Verificar email recibido con link
    - Click en link
    - Cambiar contraseña
    - Verificar que nueva contraseña funciona en login
    - Probar token expirado (cambiar manualmente en DB)
    - Probar token inválido
  - **Dependencias:** TASK-026
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-029]** Testing de protected routes

  - **Capa:** 🧪 TESTING
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Sin login, intentar acceder /dashboard (debe redirect a /login)
    - Hacer login y acceder /dashboard (debe funcionar)
    - Borrar token de localStorage manualmente
    - Intentar acceder /dashboard (debe redirect)
    - Verificar que logout limpia token
  - **Dependencias:** TASK-026
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-030]** Mejorar mensajes de error en español

  - **Capa:** 🎨 FRONTEND + 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Revisar todos los mensajes de error del backend
    - Revisar todos los mensajes de validación del frontend
    - Asegurar que todos están en español claro
    - Sin términos técnicos para el usuario
    - Crear archivo de constantes con mensajes
  - **Dependencias:** TASK-026
  - **Status:** 📋 Sin Empezar

---

---

### 📦 US-002: Landing Page Pública

**Story Points:** 5 (Medium)  
**Prioridad en Sprint:** 2  
**Status:** 📋 Sin Empezar

**Criterios de Aceptación:**

- [ ] Hero section con título y CTA claro
- [ ] Sección de misión y valores
- [ ] Sección de beneficios con iconos
- [ ] Sección de testimonios
- [ ] CTA secundario en footer
- [ ] Responsive en móvil y desktop
- [ ] Carga rápida < 3 segundos
- [ ] SEO básico configurado

#### Tareas para esta Story:

##### 🔴 P0 - Preparación de Contenido

---

- [ ] **[TASK-031]** Definir paleta de colores y tipografías

  - **Capa:** 🎨 DISEÑO
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Seleccionar 3-4 colores principales (tonos cálidos/tierra)
    - Definir color primario, secundario, acentos
    - Agregar colores a tailwind.config.js
    - Seleccionar 2 fuentes de Google Fonts (títulos + body)
    - Configurar fuentes en index.html
    - Documentar paleta en README
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-032]** Escribir copy para todas las secciones

  - **Capa:** 📝 CONTENIDO
  - **Estimado:** M (1.5 hrs)
  - **Descripción:**
    - Hero: Título principal + subtítulo (1-2 líneas)
    - Misión: Explicar qué es Entre Amigas (3-4 párrafos)
    - Beneficios: 4 beneficios con título y descripción corta
    - Testimonios: 2-3 testimonios (pueden ser placeholder o reales)
    - CTAs: Textos de botones
    - Footer: Información básica
    - Guardar en documento para referencia
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-033]** Buscar y optimizar imágenes

  - **Capa:** 🎨 DISEÑO
  - **Estimado:** S (45 min)
  - **Descripción:**
    - Buscar 3-5 imágenes en Unsplash/Pexels (mujeres latinas, comunidad)
    - Optimizar tamaño (max 500kb cada una)
    - Convertir a WebP si es posible
    - Guardar en /frontend/src/assets/images
    - Seleccionar iconos de Lucide React para beneficios
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

##### 🟡 P1 - Desarrollo de Componentes

---

- [ ] **[TASK-034]** Crear componente Hero

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** M (1 hr)
  - **Archivos:** `frontend/src/features/landing/components/Hero.jsx`
  - **Descripción:**
    - Layout full-width con imagen de fondo o imagen al lado
    - Título principal (h1) con copy definido
    - Subtítulo (p)
    - Botón CTA "Únete a la Comunidad" → /register
    - Diseño responsive (texto centrado en móvil, dos columnas en desktop)
    - Animación fade-in sutil
    - Tailwind CSS para estilos
  - **Dependencias:** TASK-031, TASK-032, TASK-033
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-035]** Crear componente Features (Beneficios)

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** M (1 hr)
  - **Archivos:** `frontend/src/features/landing/components/Features.jsx`
  - **Descripción:**
    - Sección con título "¿Por qué Entre Amigas?"
    - Grid de 4 beneficios (2x2 en desktop, 1 columna en móvil)
    - Cada beneficio: icono + título + descripción
    - Usar iconos de Lucide React
    - Cards con hover effect sutil
    - Responsive
  - **Dependencias:** TASK-031, TASK-032
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-036]** Crear componente Mission (Misión)

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/features/landing/components/Mission.jsx`
  - **Descripción:**
    - Sección con título "¿Qué es Entre Amigas?"
    - 3-4 párrafos de texto con copy
    - Imagen opcional al lado
    - Formato legible y espaciado
    - Responsive
  - **Dependencias:** TASK-031, TASK-032
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-037]** Crear componente Testimonials

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** M (1 hr)
  - **Archivos:** `frontend/src/features/landing/components/Testimonials.jsx`
  - **Descripción:**
    - Sección con título "Historias de Nuestra Comunidad"
    - 2-3 testimonios en cards
    - Cada testimonio: foto (placeholder avatar), nombre, texto del testimonio
    - Grid responsive
    - Estilo quote con comillas
  - **Dependencias:** TASK-031, TASK-032
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-038]** Crear componente CTA (Call to Action)

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/landing/components/CTA.jsx`
  - **Descripción:**
    - Sección colorida con fondo de color primario
    - Título: "¿Lista para Conectar?"
    - Texto breve motivacional
    - Botón "Únete Ahora" → /register
    - Centrado y llamativo
    - Responsive
  - **Dependencias:** TASK-031, TASK-032
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-039]** Crear componente Header

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/shared/components/layout/Header.jsx`
  - **Descripción:**
    - Logo o texto "Entre Amigas" (left)
    - Links de navegación (opcional para MVP): Inicio, Sobre Nosotras
    - Botón "Iniciar Sesión" (right) → /login
    - Sticky en scroll (opcional)
    - Hamburger menu en móvil
    - Responsive
  - **Dependencias:** TASK-031
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-040]** Crear componente Footer

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Archivos:** `frontend/src/shared/components/layout/Footer.jsx`
  - **Descripción:**
    - Logo o nombre del proyecto
    - Links: Contacto, Términos, Privacidad (pueden ser placeholders)
    - Redes sociales iconos (si aplica)
    - Copyright "© 2025 Entre Amigas"
    - Layout en columnas responsive
    - Fondo oscuro o de color
  - **Dependencias:** TASK-031
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-041]** Crear página LandingPage

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/src/features/landing/pages/LandingPage.jsx`
  - **Descripción:**
    - Importar y componer todos los componentes en orden:
      - Header
      - Hero
      - Mission
      - Features
      - Testimonials
      - CTA
      - Footer
    - Sin espaciado extra entre secciones
    - Smooth scroll (opcional)
  - **Dependencias:** TASK-034 hasta TASK-040
  - **Status:** 📋 Sin Empezar

---

##### 🟢 P2 - Optimización y SEO

---

- [ ] **[TASK-042]** Optimizar imágenes con lazy loading

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Agregar loading="lazy" a todas las imágenes
    - Agregar decoding="async"
    - Verificar que imágenes tienen alt text descriptivo
    - Probar que lazy loading funciona
  - **Dependencias:** TASK-041
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-043]** Agregar meta tags para SEO

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (30 min)
  - **Archivos:** `frontend/index.html`
  - **Descripción:**
    - Título: "Entre Amigas - Comunidad para Mujeres Migrantes"
    - Meta description: Descripción atractiva (150-160 caracteres)
    - Meta keywords: palabras clave relevantes
    - Open Graph tags para compartir en redes
    - Favicon (si está disponible)
    - Lang="es"
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-044]** Testing de responsive en múltiples dispositivos

  - **Capa:** 🧪 TESTING
  - **Estimado:** S (45 min)
  - **Descripción:**
    - Probar en DevTools: iPhone SE, iPhone 12, iPad, Desktop 1920px
    - Verificar que todo se ve bien en cada breakpoint
    - Probar en navegadores: Chrome, Firefox, Safari
    - Verificar que todos los botones funcionan
    - Verificar que imágenes cargan correctamente
    - Hacer ajustes de responsive si es necesario
  - **Dependencias:** TASK-041
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-045]** Testing de performance con Lighthouse

  - **Capa:** 🧪 TESTING
  - **Estimado:** S (30 min)
  - **Descripción:**
    - Ejecutar Lighthouse en Chrome DevTools
    - Verificar score de Performance > 80
    - Verificar score de Accessibility > 85
    - Verificar score de Best Practices > 80
    - Si hay issues críticos, corregir
    - Documentar scores
  - **Dependencias:** TASK-041
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-046]** Agregar animaciones sutiles (opcional)

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Descripción:**
    - Fade-in para secciones al hacer scroll (Intersection Observer o librería)
    - Hover effects en botones y cards
    - Transiciones suaves (transition-all)
    - No exagerar - mantener profesional
    - Probar que no afecta performance
  - **Dependencias:** TASK-041
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-047]** Revisión final y ajustes de diseño

  - **Capa:** 🎨 FRONTEND
  - **Estimado:** S (45 min)
  - **Descripción:**
    - Revisar espaciado y alineación en todas las secciones
    - Verificar consistencia de colores y fuentes
    - Ajustar tamaños de texto para legibilidad
    - Revisar contraste de colores (WCAG AA)
    - Corregir cualquier bug visual
    - Obtener feedback de otra persona si es posible
  - **Dependencias:** TASK-041
  - **Status:** 📋 Sin Empezar

---

---

## Lista Diaria de Tareas (Ordenadas por prioridad)

### Enfoque de Hoy (Día 1)

**Orden de prioridad para hoy:**

1. ✅ [TASK-001] - P0 - Crear modelo User en Mongoose (45min) 🗄️ - Completada 2025-11-07
2. ✅ [TASK-002] - P0 - Configurar servicio de email (30min) 🔧 - Completada anteriormente
3. [ ] [TASK-003] - P0 - Crear servicio de tokens JWT (30min) 🔧
4. [ ] [TASK-004] - P0 - Crear middleware de autenticación (30min) 🔧
5. [ ] [TASK-007] - P1 - Crear validaciones para registro (30min) 🔧
6. [ ] [TASK-008] - P1 - Implementar controlador de registro (1.5hrs) 🔧

**Meta para hoy:** Backend de registro funcionando end-to-end. Poder registrar un usuario y que llegue el email.

---

## Vista Plana de Todas las Tareas

### 🔴 P0 - Crítico (Hacer Primero)

**Backend Setup:**

- ✅ [TASK-001] [US-001] 🗄️ Crear modelo User - S (40min) - Completada 2025-11-07
- ✅ [TASK-002] [US-001] 🔧 Configurar servicio de email - S (30min) - Completada anteriormente
- [ ] [TASK-003] [US-001] 🔧 Crear servicio de tokens JWT - S (30min)
- [ ] [TASK-004] [US-001] 🔧 Crear middleware de autenticación - S (30min)

**Frontend Setup:**

- ✅ [TASK-005] [US-001] 🎨 Crear AuthContext - S (25min) - Completada 2025-11-07
- ✅ [TASK-006] [US-001] 🎨 Configurar axios con interceptor - S (20min) - Completada 2025-11-07

**Landing Prep:**

- [ ] [TASK-031] [US-002] 🎨 Definir paleta de colores - S (30min)
- [ ] [TASK-032] [US-002] 📝 Escribir copy - M (1.5hrs)
- [ ] [TASK-033] [US-002] 🎨 Buscar y optimizar imágenes - S (45min)

### 🟡 P1 - Importante (Hacer Segundo)

**Backend Core:**

- [ ] [TASK-007] [US-001] 🔧 Crear validaciones para registro - S (30min)
- [ ] [TASK-008] [US-001] 🔧 Implementar controlador de registro - M (1.5hrs)
- [ ] [TASK-009] [US-001] 🔧 Implementar controlador de login - M (1hr)
- [ ] [TASK-010] [US-001] 🔧 Implementar controlador de verificación - S (45min)
- [ ] [TASK-011] [US-001] 🔧 Implementar controlador forgot password - M (1hr)
- [ ] [TASK-012] [US-001] 🔧 Implementar controlador reset password - S (45min)
- [ ] [TASK-013] [US-001] 🔧 Implementar controlador /me - XS (15min)
- [ ] [TASK-014] [US-001] 🔧 Crear rutas de autenticación - S (30min)

**Frontend Core:**

- ✅ [TASK-015] [US-001] 🎨 Crear servicio de autenticación - S (30min) - Completada 2025-11-07
- ✅ [TASK-016] [US-001] 🎨 Crear componente RegisterForm - M (1.5hrs) - Completada 2025-11-07
- [ ] [TASK-017] [US-001] 🎨 Crear página RegisterPage - S (30min)
- [ ] [TASK-018] [US-001] 🎨 Crear componente LoginForm - M (1hr)
- [ ] [TASK-019] [US-001] 🎨 Crear página LoginPage - S (30min)
- [ ] [TASK-020] [US-001] 🎨 Crear página VerifyEmailPage - S (45min)
- [ ] [TASK-021] [US-001] 🎨 Crear componente ForgotPasswordForm - S (45min)
- [ ] [TASK-022] [US-001] 🎨 Crear página ForgotPasswordPage - S (30min)
- [ ] [TASK-023] [US-001] 🎨 Crear componente ResetPasswordForm - S (45min)
- [ ] [TASK-024] [US-001] 🎨 Crear página ResetPasswordPage - S (30min)
- [ ] [TASK-025] [US-001] 🎨 Crear componente ProtectedRoute - S (30min)
- [ ] [TASK-026] [US-001] 🎨 Configurar rutas de autenticación - S (30min)

**Landing Components:**

- [ ] [TASK-034] [US-002] 🎨 Crear componente Hero - M (1hr)
- [ ] [TASK-035] [US-002] 🎨 Crear componente Features - M (1hr)
- [ ] [TASK-036] [US-002] 🎨 Crear componente Mission - S (45min)
- [ ] [TASK-037] [US-002] 🎨 Crear componente Testimonials - M (1hr)
- [ ] [TASK-038] [US-002] 🎨 Crear componente CTA - S (30min)
- [ ] [TASK-039] [US-002] 🎨 Crear componente Header - S (45min)
- [ ] [TASK-040] [US-002] 🎨 Crear componente Footer - S (45min)
- [ ] [TASK-041] [US-002] 🎨 Crear página LandingPage - S (30min)

### 🟢 P2 - Nice to Have (Hacer Al Final)

**Testing:**

- [ ] [TASK-027] [US-001] 🧪 Testing de flujo de registro - S (45min)
- [ ] [TASK-028] [US-001] 🧪 Testing de recuperación de contraseña - S (30min)
- [ ] [TASK-029] [US-001] 🧪 Testing de protected routes - S (30min)
- [ ] [TASK-044] [US-002] 🧪 Testing responsive - S (45min)
- [ ] [TASK-045] [US-002] 🧪 Testing de performance - S (30min)

**Polish:**

- [ ] [TASK-030] [US-001] 🎨🔧 Mejorar mensajes de error - S (30min)
- [ ] [TASK-042] [US-002] 🎨 Optimizar imágenes lazy loading - S (30min)
- [ ] [TASK-043] [US-002] 🎨 Agregar meta tags SEO - S (30min)
- [ ] [TASK-046] [US-002] 🎨 Agregar animaciones - S (45min)
- [ ] [TASK-047] [US-002] 🎨 Revisión final de diseño - S (45min)

---

## Tareas Bloqueadas ⏸️

> Tareas que no pueden proceder por dependencias o problemas

_Vacío inicialmente - se llena durante el sprint_

---

## Tareas Completadas ✅

_Se llena conforme avanza el sprint_

---

## Deuda Técnica y Mejoras

### Identificadas Durante el Sprint

_Se llena si se identifican durante desarrollo_

---

## Bugs Encontrados 🐛

_Se llena si se encuentran bugs durante el sprint_

---

## Registro de Actualizaciones Diarias

### Día 1 - [Fecha]

**Horas trabajadas:** 0 hrs  
**Tareas completadas:** Ninguna aún  
**Bloqueadores encontrados:** Ninguno  
**Enfoque de mañana:** Comenzar con setup de backend  
**Notas:** Sprint iniciado

---

## Verificación de Salud del Sprint

### Mid-Sprint (Día 5)

- **Tareas completadas:** 0 de 47 (0%)
- **¿En camino?** ⏳ Por determinar
- **Bloqueadores:** 0
- **Ajustes necesarios:** Por determinar

### Pre-Review (Día 9)

- **Stories terminadas (DoD cumplido):** 0 de 2
- **¿Sprint Goal alcanzado?** ⏳ Por determinar
- **Tareas pendientes:** Por determinar
- **Prep de demo:** Por determinar

---

## Reglas de Gestión de Tareas

### Estados de Tareas

- `[ ]` - Sin Empezar (📋)
- `[>]` - En Progreso (🔄)
- `[x]` - Completada (✅)
- `[⏸️]` - Bloqueada (⏸️)

### Guía de Tamaño de Tareas

- **XS (15-30 min):** Cambios de config, fixes simples, creación de archivos
- **S (30-60 min):** Features simples, CRUD estándar, creación de componentes
- **M (1-2 hrs):** Features complejas, integraciones, múltiples archivos
- **L (> 2 hrs):** ⚠️ DIVIDIR - Tarea muy grande

### Guía de Prioridades

- **P0 (Crítico):** Setup, bloqueadores, dependencias críticas
- **P1 (Importante):** Tareas core del Sprint Goal, features principales
- **P2 (Nice to have):** Tests, refactoring, documentación, polish

### Capas de Trabajo

- 🗄️ **DATABASE** - Modelos, schemas, migraciones
- 🔧 **BACKEND** - APIs, controllers, services, middleware
- 🎨 **FRONTEND** - Components, pages, UI, styles
- 🧪 **TESTING** - Tests manuales y automatizados
- 📝 **CONTENIDO** - Copy, texto, contenido
- 🎨 **DISEÑO** - Colores, tipografías, imágenes

### Lineamientos de Actualización

1. Actualizar estado de tarea inmediatamente al empezar/completar
2. Agregar timestamp de completado: `[x] [YYYY-MM-DD HH:MM]`
3. Mover tareas completadas a sección "Tareas Completadas" al final del día
4. Agregar bloqueadores inmediatamente con contexto completo
5. Actualizar Registro Diario todos los días
6. Revisar y actualizar Salud del Sprint en Día 5 y Día 9

---

## Definición de Tarea Completa

Una tarea está completa cuando:

- [ ] Código escrito y funcional
- [ ] Sigue convenciones de código de ARCHITECTURE.md
- [ ] Sin errores o warnings en consola
- [ ] Auto-testeada manualmente
- [ ] Comentarios agregados donde sea necesario
- [ ] Archivos relacionados actualizados (si es necesario)
- [ ] Lista para integración con otras tareas

---

## Referencia Rápida

### Iniciando una tarea:

1. Cambiar `[ ]` a `[>]`
2. Verificar que dependencias están completas
3. Revisar notas técnicas
4. Seguir estructura de ARCHITECTURE.md
5. Crear rama de git si aplica

### Completando una tarea:

1. Verificar criterios de tarea completa
2. Cambiar `[>]` a `[x] [FECHA HORA]`
3. Agregar notas si es necesario
4. Mover a sección Completadas al EOD
5. Commit con mensaje descriptivo en español

### Tarea bloqueada:

1. Cambiar a `[⏸️]`
2. Documentar razón de bloqueo completamente
3. Mover a sección de Tareas Bloqueadas
4. Identificar acción para desbloquear
5. Buscar tareas alternativas para hacer mientras

### Encontraste un bug:

1. Agregar a sección de Bugs
2. Crear tarea si necesita arreglo este sprint
3. Agregar a Product Backlog si es para futuro
4. Documentar pasos para reproducir

---

## Dependencias Críticas por Capa

### Flujo Backend

```
TASK-001 (User Model)
    ↓
TASK-007 (Validations)
    ↓
TASK-008 a TASK-013 (Controllers)
    ↓
TASK-014 (Routes)
```

### Flujo Frontend

```
TASK-005 (AuthContext) + TASK-006 (Axios)
    ↓
TASK-015 (Auth Service)
    ↓
TASK-016 a TASK-024 (Forms y Pages)
    ↓
TASK-025 (ProtectedRoute)
    ↓
TASK-026 (Routes Config)
```

### Flujo Landing

```
TASK-031, 032, 033 (Prep de contenido)
    ↓
TASK-034 a TASK-040 (Components)
    ↓
TASK-041 (Landing Page)
    ↓
TASK-042 a TASK-047 (Polish)
```

---

## Estimación Total por Capa

**🗄️ DATABASE:** 45 min (1 tarea)  
**🔧 BACKEND:** ~10 hrs (13 tareas)  
**🎨 FRONTEND:** ~21 hrs (27 tareas)  
**🧪 TESTING:** ~3 hrs (5 tareas)  
**📝 CONTENIDO:** 1.5 hrs (1 tarea)

**TOTAL:** ~52-60 hrs para 2 semanas (26-30 hrs/semana)

---

**Última Actualización:** 5 de noviembre, 2025 - 10:00 AM  
**Próxima Actualización:** Diaria al EOD  
**Mantenido por:** Equipo Entre Amigas

---

**¡Éxito en tu Sprint 1! Usa este documento como tu guía diaria. Actualízalo constantemente.** 🚀
