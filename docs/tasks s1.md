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

- ✅ **Completadas:** 1 tarea (Sprint 0: 1/7 = 14%)
- 🔄 **En Progreso:** 0 tareas
- ⏸️ **Bloqueadas:** 0 tareas
- 📋 **Sin Empezar:** 6 tareas Sprint 0 + 47 tareas Sprint 1

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

- [ ] **[INFRA-002]** Configuración de MongoDB Atlas - S (1 hr)
  - **Descripción:** Configurar cluster gratuito M0, crear database, obtener connection string
  - **Archivos:** .env (backend), .mcp.json
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[INFRA-003]** Configuración de AWS S3 - S (1-1.5 hrs)
  - **Descripción:** Crear bucket, configurar IAM user, obtener credenciales, configurar CORS
  - **Archivos:** .env (backend)
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[INFRA-004]** Configuración de Resend - S (2-3 hrs)
  - **Descripción:** Crear cuenta, obtener API key, crear templates de email
  - **Archivos:** .env (backend)
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[INFRA-005]** Configuración Frontend React + Vite - M (2 hrs)
  - **Descripción:** Inicializar proyecto Vite, instalar dependencias, configurar Tailwind
  - **Archivos:** package.json, vite.config.js, tailwind.config.js, .env.local
  - **Dependencias:** INFRA-001
  - **Status:** 📋 Sin Empezar

---

- [ ] **[INFRA-006]** Configuración Backend Node + Express - M (2-3 hrs)
  - **Descripción:** Inicializar proyecto, instalar dependencias, configurar server.js, conectar MongoDB
  - **Archivos:** package.json, server.js, .env, config/database.js
  - **Dependencias:** INFRA-001, INFRA-002
  - **Status:** 📋 Sin Empezar

---

- [ ] **[INFRA-007]** Configuración AWS S3 Upload Service - S (2 hrs)
  - **Descripción:** Crear servicio de upload con AWS SDK, configurar multer
  - **Archivos:** services/upload.service.js, middleware/upload.middleware.js, config/aws.js
  - **Dependencias:** INFRA-003, INFRA-006
  - **Status:** 📋 Sin Empezar

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

- [ ] **[TASK-001]** Crear modelo User en Mongoose

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-002]** Configurar servicio de email con Resend

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Archivos:** `backend/src/config/email.js`, `backend/src/services/email.service.js`
  - **Descripción:**
    - Importar y configurar Resend SDK
    - Crear función sendWelcomeEmail con template HTML básico
    - Crear función sendVerificationEmail con link y token
    - Crear función sendPasswordResetEmail
    - Manejar errores de envío
    - Probar envío con email de prueba
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-003]** Crear servicio de tokens JWT

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Archivos:** `backend/src/services/token.service.js`
  - **Descripción:**
    - Función generateAuthToken(userId) - genera JWT con expiración 7d
    - Función generateVerificationToken() - genera token random para email
    - Función generateResetToken() - genera token para password reset
    - Función verifyToken(token) - verifica JWT
    - Usar JWT_SECRET del .env
  - **Dependencias:** Ninguna
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-004]** Crear middleware de autenticación

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Archivos:** `backend/src/middleware/auth.middleware.js`
  - **Descripción:**
    - Extraer token del header Authorization
    - Verificar token con JWT
    - Buscar usuario en DB
    - Agregar req.user con datos del usuario
    - Manejar errores: token inválido, expirado, usuario no existe
    - Retornar 401 si no autenticado
  - **Dependencias:** TASK-003
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-005]** Crear AuthContext en React

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-006]** Configurar axios con interceptor

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
  - **Status:** 📋 Sin Empezar

---

##### 🟡 P1 - Implementación Core

**BACKEND - Endpoints de Autenticación**

---

- [ ] **[TASK-007]** Crear validaciones para registro

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Archivos:** `backend/src/validators/auth.validator.js`
  - **Descripción:**
    - Usar express-validator
    - Validar registerValidation: fullName (2-100), preferredName (2-50), email (válido), password (min 8), phone (requerido), birthday (fecha válida), city (requerido)
    - Validar loginValidation: email, password
    - Validar forgotPasswordValidation: email
    - Validar resetPasswordValidation: password
    - Mensajes de error en español
  - **Dependencias:** TASK-001
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-008]** Implementar controlador de registro

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1.5 hrs)
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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-009]** Implementar controlador de login

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1 hr)
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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-010]** Implementar controlador de verificación de email

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (45 min)
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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-011]** Implementar controlador de forgot password

  - **Capa:** 🔧 BACKEND
  - **Estimado:** M (1 hr)
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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-012]** Implementar controlador de reset password

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (45 min)
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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-013]** Implementar controlador de /me (get current user)

  - **Capa:** 🔧 BACKEND
  - **Estimado:** XS (15 min)
  - **Archivos:** `backend/src/controllers/auth.controller.js`
  - **Descripción:**
    - Función getMe(req, res):
      - Retornar req.user (viene del auth middleware)
      - Formato: { success: true, data: user }
  - **Dependencias:** TASK-004
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-014]** Crear rutas de autenticación

  - **Capa:** 🔧 BACKEND
  - **Estimado:** S (30 min)
  - **Archivos:** `backend/src/routes/auth.routes.js`
  - **Descripción:**
    - POST /api/v1/auth/register - con registerValidation
    - POST /api/v1/auth/login - con loginValidation
    - GET /api/v1/auth/verify-email/:token
    - POST /api/v1/auth/forgot-password - con forgotPasswordValidation
    - POST /api/v1/auth/reset-password/:token - con resetPasswordValidation
    - GET /api/v1/auth/me - con authMiddleware
    - Importar en routes/index.js
  - **Dependencias:** TASK-008 hasta TASK-013
  - **Status:** 📋 Sin Empezar

---

**FRONTEND - Formularios y Páginas de Autenticación**

---

- [ ] **[TASK-015]** Crear servicio de autenticación en frontend

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-016]** Crear componente RegisterForm

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-017]** Crear página RegisterPage

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-018]** Crear componente LoginForm

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-019]** Crear página LoginPage

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
  - **Status:** 📋 Sin Empezar

---

- [ ] **[TASK-020]** Crear página VerifyEmailPage

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
  - **Status:** 📋 Sin Empezar

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

1. [ ] [TASK-001] - P0 - Crear modelo User en Mongoose (45min) 🗄️
2. [ ] [TASK-002] - P0 - Configurar servicio de email (30min) 🔧
3. [ ] [TASK-003] - P0 - Crear servicio de tokens JWT (30min) 🔧
4. [ ] [TASK-004] - P0 - Crear middleware de autenticación (30min) 🔧
5. [ ] [TASK-007] - P1 - Crear validaciones para registro (30min) 🔧
6. [ ] [TASK-008] - P1 - Implementar controlador de registro (1.5hrs) 🔧

**Meta para hoy:** Backend de registro funcionando end-to-end. Poder registrar un usuario y que llegue el email.

---

## Vista Plana de Todas las Tareas

### 🔴 P0 - Crítico (Hacer Primero)

**Backend Setup:**

- [ ] [TASK-001] [US-001] 🗄️ Crear modelo User - S (45min)
- [ ] [TASK-002] [US-001] 🔧 Configurar servicio de email - S (30min)
- [ ] [TASK-003] [US-001] 🔧 Crear servicio de tokens JWT - S (30min)
- [ ] [TASK-004] [US-001] 🔧 Crear middleware de autenticación - S (30min)

**Frontend Setup:**

- [ ] [TASK-005] [US-001] 🎨 Crear AuthContext - S (45min)
- [ ] [TASK-006] [US-001] 🎨 Configurar axios con interceptor - S (30min)

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

- [ ] [TASK-015] [US-001] 🎨 Crear servicio de autenticación - S (45min)
- [ ] [TASK-016] [US-001] 🎨 Crear componente RegisterForm - M (2hrs)
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
