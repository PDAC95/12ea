# ARCHITECTURE.md - Entre Amigas

**Version:** 1.0  
**Created:** 5 de noviembre, 2025  
**Last Updated:** 5 de noviembre, 2025  
**Maintained by:** Equipo Entre Amigas

---

## Project Overview

**Product:** Entre Amigas  
**Type:** Web Application (SPA + REST API)  
**Status:** 🟡 Planning

**MVP Scope:**
Plataforma comunitaria para mujeres migrantes hispanas en Canadá que incluye:

- Landing page pública
- Sistema de autenticación completo
- Dashboard con navegación
- Módulo de eventos (ver, registrar, gestionar)
- Directorio de negocios con filtros
- Directorio de servicios esenciales
- Blog con artículos categorizados
- Panel de administración completo

**Target Launch:** 8 semanas (Enero 2026)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO FINAL                      │
│              (Navegador Web - Mobile/Desktop)        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│                 CDN (Cloudflare)                     │
│              (Assets estáticos + Cache)              │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                              │
        ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│   Frontend SPA   │          │   Backend API    │
│   React + Vite   │◄────────►│  Node + Express  │
│  (Vercel/Netlify)│   API    │   (Railway)      │
└──────────────────┘  Calls   └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │   MongoDB    │  │  Cloudinary  │  │ Resend/Brevo │
            │    Atlas     │  │  (Imágenes)  │  │   (Emails)   │
            └──────────────┘  └──────────────┘  └──────────────┘
```

### Architecture Principles

- **Separation of Concerns:** Frontend/Backend/Database claramente separados
- **Stateless Design:** Backend no mantiene estado de sesión (JWT en cliente)
- **API-First:** Backend expone API RESTful consumida por frontend
- **Security by Default:** Autenticación JWT en todos los endpoints protegidos
- **Scalability:** Diseñado para escalar horizontalmente en ambos layers
- **Simplicity:** Stack probado y documentado (MERN) para mantenimiento fácil

---

## Technology Stack

### Frontend

```yaml
Framework: React 18.3.1
Language: JavaScript (ES2022+)
Build Tool: Vite 5.4.x
UI Library: TailwindCSS 3.4.x
State Management: React Context API
HTTP Client: Axios 1.7.x
Router: React Router DOM 6.26.x
Form Handling: React Hook Form 7.53.x
Form Validation: Yup 1.4.x
Date Handling: date-fns 3.6.x
Icons: Lucide React 0.index445.x (o React Icons)
Testing: Vitest 2.0.x + React Testing Library 16.x
Linting: ESLint 9.x + Prettier 3.3.x
Package Manager: npm
Node Version: 20.x LTS
```

### Backend

```yaml
Runtime: Node.js 20.x LTS
Framework: Express.js 4.19.x
Language: JavaScript (ES2022+ with CommonJS)
Database: MongoDB 7.0.x
ODM: Mongoose 8.6.x
Authentication: jsonwebtoken 9.0.x + bcryptjs 2.4.x
Validation: express-validator 7.2.x
File Upload: Multer 1.4.x + Cloudinary SDK
Email Service: @resend/node 4.0.x (o Brevo SDK)
Security: helmet 7.x, cors 2.8.x, express-rate-limit 7.x
Environment Variables: dotenv 16.4.x
Logging: winston 3.14.x (opcional para producción)
Testing: Jest 29.7.x + Supertest 7.0.x
API Documentation: Swagger/OpenAPI (opcional post-MVP)
```

### DevOps & Infrastructure

```yaml
Version Control: Git + GitHub
Hosting Frontend: Vercel (opción 1) / Netlify (opción 2)
Hosting Backend: Railway (opción 1) / Render (opción 2)
Database Hosting: MongoDB Atlas (tier gratuito M0)
File Storage: Cloudinary (tier gratuito)
Email Service: Resend (5k emails/mes gratis) / Brevo (300/día gratis)
CI/CD: GitHub Actions
Monitoring: Sentry (opcional post-MVP)
Analytics: Google Analytics 4 (opcional)
CDN: Cloudflare (incluido en Vercel/Netlify)
Domain & DNS: Cloudflare (gratuito)
SSL: Let's Encrypt (automático en Vercel/Railway)
```

---

## Project Structure

### Complete Folder Structure

```
entre-amigas/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── og-image.jpg
│   │
│   ├── src/
│   │   ├── features/                    # Módulos por funcionalidad
│   │   │   │
│   │   │   ├── auth/                    # Autenticación
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   └── ForgotPasswordForm.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── services/
│   │   │   │   │   └── authService.js
│   │   │   │   ├── context/
│   │   │   │   │   └── AuthContext.jsx
│   │   │   │   └── pages/
│   │   │   │       ├── LoginPage.jsx
│   │   │   │       ├── RegisterPage.jsx
│   │   │   │       └── ForgotPasswordPage.jsx
│   │   │   │
│   │   │   ├── dashboard/               # Dashboard principal
│   │   │   │   ├── components/
│   │   │   │   │   ├── DashboardCard.jsx
│   │   │   │   │   └── QuickStats.jsx
│   │   │   │   └── pages/
│   │   │   │       └── DashboardPage.jsx
│   │   │   │
│   │   │   ├── events/                  # Eventos
│   │   │   │   ├── components/
│   │   │   │   │   ├── EventCard.jsx
│   │   │   │   │   ├── EventList.jsx
│   │   │   │   │   ├── EventDetail.jsx
│   │   │   │   │   ├── EventCalendar.jsx
│   │   │   │   │   └── MyEvents.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── eventService.js
│   │   │   │   └── pages/
│   │   │   │       ├── EventsPage.jsx
│   │   │   │       └── EventDetailPage.jsx
│   │   │   │
│   │   │   ├── business/                # Directorio Negocios
│   │   │   │   ├── components/
│   │   │   │   │   ├── BusinessCard.jsx
│   │   │   │   │   ├── BusinessList.jsx
│   │   │   │   │   └── BusinessFilters.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── businessService.js
│   │   │   │   └── pages/
│   │   │   │       └── BusinessPage.jsx
│   │   │   │
│   │   │   ├── services/                # Directorio Servicios
│   │   │   │   ├── components/
│   │   │   │   │   ├── ServiceCard.jsx
│   │   │   │   │   ├── ServiceList.jsx
│   │   │   │   │   └── ServiceFilters.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── serviceDirectoryService.js
│   │   │   │   └── pages/
│   │   │   │       └── ServicesPage.jsx
│   │   │   │
│   │   │   ├── blog/                    # Blog
│   │   │   │   ├── components/
│   │   │   │   │   ├── BlogCard.jsx
│   │   │   │   │   ├── BlogList.jsx
│   │   │   │   │   └── BlogPost.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── blogService.js
│   │   │   │   └── pages/
│   │   │   │       ├── BlogPage.jsx
│   │   │   │       └── BlogPostPage.jsx
│   │   │   │
│   │   │   ├── admin/                   # Panel Admin
│   │   │   │   ├── components/
│   │   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   │   ├── AdminStats.jsx
│   │   │   │   │   ├── EventForm.jsx
│   │   │   │   │   ├── BusinessForm.jsx
│   │   │   │   │   ├── ServiceForm.jsx
│   │   │   │   │   └── BlogPostEditor.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── adminService.js
│   │   │   │   └── pages/
│   │   │   │       ├── AdminDashboard.jsx
│   │   │   │       ├── ManageEvents.jsx
│   │   │   │       ├── ManageBusiness.jsx
│   │   │   │       ├── ManageServices.jsx
│   │   │   │       └── ManageBlog.jsx
│   │   │   │
│   │   │   ├── landing/                 # Landing Page
│   │   │   │   ├── components/
│   │   │   │   │   ├── Hero.jsx
│   │   │   │   │   ├── Features.jsx
│   │   │   │   │   ├── Testimonials.jsx
│   │   │   │   │   └── CTA.jsx
│   │   │   │   └── pages/
│   │   │   │       └── LandingPage.jsx
│   │   │   │
│   │   │   └── profile/                 # Perfil Usuario
│   │   │       ├── components/
│   │   │       │   ├── ProfileInfo.jsx
│   │   │       │   └── MyRegisteredEvents.jsx
│   │   │       └── pages/
│   │   │           └── ProfilePage.jsx
│   │   │
│   │   ├── shared/                      # Componentes compartidos
│   │   │   ├── components/
│   │   │   │   ├── ui/                  # Componentes UI base
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Input.jsx
│   │   │   │   │   ├── Card.jsx
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   ├── Spinner.jsx
│   │   │   │   │   ├── Alert.jsx
│   │   │   │   │   └── Badge.jsx
│   │   │   │   ├── layout/              # Layout components
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── Container.jsx
│   │   │   │   └── common/              # Componentes comunes
│   │   │   │       ├── LoadingScreen.jsx
│   │   │   │       ├── ErrorBoundary.jsx
│   │   │   │       └── NotFound.jsx
│   │   │   │
│   │   │   ├── hooks/                   # Custom hooks
│   │   │   │   ├── useForm.js
│   │   │   │   ├── useDebounce.js
│   │   │   │   ├── useLocalStorage.js
│   │   │   │   └── useToast.js
│   │   │   │
│   │   │   └── utils/                   # Utilidades
│   │   │       ├── api.js               # Axios config
│   │   │       ├── constants.js
│   │   │       ├── formatters.js        # Date, currency, etc
│   │   │       └── validators.js
│   │   │
│   │   ├── routes/                      # Configuración de rutas
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   │
│   │   ├── assets/                      # Assets estáticos
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   │
│   │   ├── styles/                      # Estilos globales
│   │   │   ├── index.css                # Imports Tailwind
│   │   │   └── custom.css               # Custom styles
│   │   │
│   │   ├── App.jsx                      # Componente raíz
│   │   └── main.jsx                     # Entry point
│   │
│   ├── .env.example                     # Variables de entorno ejemplo
│   ├── .env.local                       # Variables locales (git ignored)
│   ├── .eslintrc.cjs                    # ESLint config
│   ├── .prettierrc                      # Prettier config
│   ├── index.html                       # HTML template
│   ├── package.json
│   ├── postcss.config.js                # PostCSS para Tailwind
│   ├── tailwind.config.js               # Tailwind config
│   ├── vite.config.js                   # Vite config
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/                      # Configuraciones
│   │   │   ├── database.js              # MongoDB connection
│   │   │   ├── email.js                 # Email service config
│   │   │   ├── cloudinary.js            # Cloudinary config
│   │   │   └── constants.js             # Constantes del sistema
│   │   │
│   │   ├── models/                      # Modelos de datos (Mongoose)
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── EventRegistration.js
│   │   │   ├── Business.js
│   │   │   ├── Service.js
│   │   │   └── BlogPost.js
│   │   │
│   │   ├── routes/                      # Definición de rutas
│   │   │   ├── index.js                 # Router principal
│   │   │   ├── auth.routes.js
│   │   │   ├── events.routes.js
│   │   │   ├── business.routes.js
│   │   │   ├── services.routes.js
│   │   │   ├── blog.routes.js
│   │   │   └── admin.routes.js
│   │   │
│   │   ├── controllers/                 # Lógica de negocio
│   │   │   ├── auth.controller.js
│   │   │   ├── events.controller.js
│   │   │   ├── business.controller.js
│   │   │   ├── services.controller.js
│   │   │   ├── blog.controller.js
│   │   │   └── admin.controller.js
│   │   │
│   │   ├── middleware/                  # Middlewares
│   │   │   ├── auth.middleware.js       # Verificar JWT
│   │   │   ├── admin.middleware.js      # Verificar rol admin
│   │   │   ├── validate.middleware.js   # Validación de datos
│   │   │   ├── upload.middleware.js     # Multer para archivos
│   │   │   ├── errorHandler.js          # Error handling global
│   │   │   └── rateLimit.middleware.js  # Rate limiting
│   │   │
│   │   ├── services/                    # Servicios auxiliares
│   │   │   ├── email.service.js         # Envío de emails
│   │   │   ├── token.service.js         # JWT tokens
│   │   │   └── upload.service.js        # Cloudinary uploads
│   │   │
│   │   ├── utils/                       # Utilidades
│   │   │   ├── asyncHandler.js          # Wrapper para async
│   │   │   ├── ApiError.js              # Custom error class
│   │   │   └── slugify.js               # Slugs para URLs
│   │   │
│   │   ├── validators/                  # Esquemas de validación
│   │   │   ├── auth.validator.js
│   │   │   ├── event.validator.js
│   │   │   ├── business.validator.js
│   │   │   ├── service.validator.js
│   │   │   └── blog.validator.js
│   │   │
│   │   └── server.js                    # Entry point del servidor
│   │
│   ├── .env.example                     # Variables de entorno ejemplo
│   ├── .env                             # Variables reales (git ignored)
│   ├── .eslintrc.cjs                    # ESLint config
│   ├── .prettierrc                      # Prettier config
│   ├── package.json
│   └── README.md
│
├── .gitignore                           # Git ignore global
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions CI/CD
│
└── README.md                            # Documentación principal
```

---

## Naming Conventions

### JavaScript/React

```javascript
// Components: PascalCase
// Archivo: LoginForm.jsx
export const LoginForm = () => { ... }

// Functions & Variables: camelCase
const getUserData = async (userId) => { ... }
const isAuthenticated = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5242880;

// Hooks: camelCase con prefijo 'use'
const useAuth = () => { ... }

// Context: PascalCase con sufijo 'Context'
const AuthContext = createContext();

// Services: camelCase con sufijo 'Service'
const authService = { login, register, logout };

// Handlers: camelCase con prefijo 'handle'
const handleSubmit = (e) => { ... }
const handleChange = (e) => { ... }

// Boolean variables: is/has/should prefixes
const isLoading = false;
const hasPermission = true;
const shouldRender = false;
```

### Files & Folders

```bash
# Components: PascalCase.jsx
LoginForm.jsx
EventCard.jsx

# Pages: PascalCase + Page.jsx
LoginPage.jsx
EventsPage.jsx

# Utilities & Services: camelCase.js
authService.js
formatDate.js

# Hooks: camelCase.js con prefijo 'use'
useAuth.js
useForm.js

# Folders: kebab-case o camelCase (consistente)
auth/
events/
shared/components/
```

### Backend (Node.js/Express)

```javascript
// Models: PascalCase singular
// Archivo: User.js
const User = mongoose.model('User', userSchema);

// Controllers: camelCase con sufijo Controller
// Archivo: auth.controller.js
const authController = { register, login, logout };

// Routes: camelCase con sufijo .routes.js
// Archivo: auth.routes.js
router.post('/register', register);

// Middleware: camelCase con sufijo .middleware.js
// Archivo: auth.middleware.js
const authMiddleware = (req, res, next) => { ... }

// Services: camelCase con sufijo .service.js
// Archivo: email.service.js
const emailService = { sendWelcome, sendConfirmation };
```

### Database (MongoDB)

```javascript
// Collections: PascalCase singular en código, plural en DB
User -> users (collection)
Event -> events (collection)

// Fields: camelCase
{
  fullName: String,
  preferredName: String,
  createdAt: Date
}

// IDs: _id (Mongo default)
```

### Git Commits (Español - Conventional Commits)

```bash
# Formato: <tipo>: <descripción corta>

# Tipos principales:
feat: nueva funcionalidad de eventos
fix: corregir validación de email
docs: actualizar README
style: formatear código con prettier
refactor: reorganizar estructura de carpetas
test: agregar tests para auth
chore: actualizar dependencias
perf: optimizar consulta de eventos

# Ejemplos:
feat: agregar registro a eventos
fix: corregir envío de email de confirmación
docs: documentar API de eventos
refactor: simplificar lógica de autenticación
```

### API Endpoints

```bash
# RESTful conventions
GET    /api/v1/events              # Listar todos
GET    /api/v1/events/:id          # Obtener uno
POST   /api/v1/events              # Crear
PUT    /api/v1/events/:id          # Actualizar completo
PATCH  /api/v1/events/:id          # Actualizar parcial
DELETE /api/v1/events/:id          # Eliminar

# Nested resources
POST   /api/v1/events/:id/register         # Registrarse a evento
GET    /api/v1/users/:id/events            # Eventos de un usuario

# Auth endpoints
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/verify-email/:token
```

---

## API Design

### API Architecture

**Type:** RESTful API  
**Base URL:** `https://api.entreamigas.com/api/v1/`  
**Content-Type:** `application/json`  
**Authentication:** Bearer Token (JWT)

### Standard Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operación exitosa"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### HTTP Status Codes

```yaml
200 OK: Solicitud exitosa (GET, PUT, PATCH)
201 Created: Recurso creado exitosamente (POST)
204 No Content: Solicitud exitosa sin contenido (DELETE)
400 Bad Request: Datos inválidos o malformados
401 Unauthorized: No autenticado o token inválido
403 Forbidden: No autorizado (sin permisos)
404 Not Found: Recurso no encontrado
409 Conflict: Conflicto (ej: email ya existe)
429 Too Many Requests: Rate limit excedido
500 Internal Server Error: Error del servidor
```

### Authentication Flow

```
1. Register/Login
   POST /api/v1/auth/register
   POST /api/v1/auth/login
   → Returns: { token, user }

2. Store token in client
   localStorage.setItem('token', token)

3. Include token in headers for protected routes
   Authorization: Bearer <token>

4. Backend verifies token in middleware
   jwt.verify(token, SECRET_KEY)

5. Attach user to request
   req.user = decodedToken
```

### API Endpoints Documentation

#### Authentication

```http
POST /api/v1/auth/register
Body: { fullName, preferredName, email, password, phone, birthday, city }
Response: { success, data: { token, user }, message }

POST /api/v1/auth/login
Body: { email, password }
Response: { success, data: { token, user }, message }

POST /api/v1/auth/forgot-password
Body: { email }
Response: { success, message }

POST /api/v1/auth/reset-password/:token
Body: { password }
Response: { success, message }

GET /api/v1/auth/verify-email/:token
Response: { success, message }

GET /api/v1/auth/me (Protected)
Headers: Authorization: Bearer <token>
Response: { success, data: user }
```

#### Events

```http
GET /api/v1/events
Query: ?page=1&limit=20&modality=virtual&city=Toronto
Response: { success, data: [events], pagination }

GET /api/v1/events/:id
Response: { success, data: event }

POST /api/v1/events (Admin only)
Headers: Authorization: Bearer <token>
Body: { title, description, date, time, modality, location, virtualLink, maxCapacity, imageUrl }
Response: { success, data: event, message }

PUT /api/v1/events/:id (Admin only)
Headers: Authorization: Bearer <token>
Body: { ... }
Response: { success, data: event, message }

DELETE /api/v1/events/:id (Admin only)
Headers: Authorization: Bearer <token>
Response: { success, message }

POST /api/v1/events/:id/register (Protected)
Headers: Authorization: Bearer <token>
Response: { success, data: registration, message }

GET /api/v1/events/my-events (Protected)
Headers: Authorization: Bearer <token>
Response: { success, data: [events] }
```

#### Business Directory

```http
GET /api/v1/business
Query: ?category=gastronomia&city=Toronto&search=keyword
Response: { success, data: [businesses] }

GET /api/v1/business/:id
Response: { success, data: business }

POST /api/v1/business (Admin only)
Headers: Authorization: Bearer <token>
Body: { businessName, ownerName, category, description, phone, email, city }
Response: { success, data: business, message }

PUT /api/v1/business/:id (Admin only)
Headers: Authorization: Bearer <token>
Body: { ... }
Response: { success, data: business, message }

DELETE /api/v1/business/:id (Admin only)
Headers: Authorization: Bearer <token>
Response: { success, message }
```

#### Services Directory

```http
GET /api/v1/services
Query: ?category=salud&city=Toronto&search=keyword
Response: { success, data: [services] }

GET /api/v1/services/:id
Response: { success, data: service }

POST /api/v1/services (Admin only)
Headers: Authorization: Bearer <token>
Body: { serviceName, category, specialty, phone, address, website, notes, city }
Response: { success, data: service, message }

PUT /api/v1/services/:id (Admin only)
Headers: Authorization: Bearer <token>
Body: { ... }
Response: { success, data: service, message }

DELETE /api/v1/services/:id (Admin only)
Headers: Authorization: Bearer <token>
Response: { success, message }
```

#### Blog

```http
GET /api/v1/blog
Query: ?category=wellness&page=1&limit=10
Response: { success, data: [posts], pagination }

GET /api/v1/blog/:slug
Response: { success, data: post }

POST /api/v1/blog (Admin only)
Headers: Authorization: Bearer <token>
Body: { title, content, excerpt, category, featuredImage, status }
Response: { success, data: post, message }

PUT /api/v1/blog/:id (Admin only)
Headers: Authorization: Bearer <token>
Body: { ... }
Response: { success, data: post, message }

DELETE /api/v1/blog/:id (Admin only)
Headers: Authorization: Bearer <token>
Response: { success, message }
```

---

## Database Schema

### User Model

```javascript
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    preferredName: {
      type: String,
      required: [true, "El nombre preferido es requerido"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: 8,
      select: false, // No incluir en queries por defecto
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, "La fecha de nacimiento es requerida"],
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ city: 1 });

// Hooks: Hash password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### Event Model

```javascript
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    time: {
      type: String,
      required: [true, "La hora es requerida"],
    },
    modality: {
      type: String,
      enum: ["virtual", "presencial"],
      required: [true, "La modalidad es requerida"],
    },
    location: {
      type: String,
      required: function () {
        return this.modality === "presencial";
      },
    },
    virtualLink: {
      type: String,
      required: function () {
        return this.modality === "virtual";
      },
    },
    maxCapacity: {
      type: Number,
      min: 0,
    },
    currentRegistrations: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ modality: 1 });
eventSchema.index({ createdBy: 1 });
```

### EventRegistration Model

```javascript
const eventRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index para evitar registros duplicados
eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
```

### Business Model

```javascript
const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "El nombre del negocio es requerido"],
      trim: true,
      maxlength: 150,
    },
    ownerName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, "La categoría es requerida"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
businessSchema.index({ category: 1 });
businessSchema.index({ city: 1 });
businessSchema.index({ businessName: "text", description: "text" }); // Text search
```

### Service Model

```javascript
const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "El nombre del servicio es requerido"],
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: [true, "La categoría es requerida"],
      enum: [
        "salud",
        "dental",
        "salud-mental",
        "legal",
        "educacion",
        "emergencias",
        "gobierno",
        "otros",
      ],
    },
    specialty: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    website: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ category: 1 });
serviceSchema.index({ city: 1 });
serviceSchema.index({ serviceName: "text", notes: "text" }); // Text search
```

### BlogPost Model

```javascript
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es requerido"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    category: {
      type: String,
      required: [true, "La categoría es requerida"],
      enum: [
        "wellness",
        "amistad",
        "amor-propio",
        "migracion",
        "consejos",
        "historias",
      ],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ publishedAt: -1 });

// Hook: Generar slug antes de guardar
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});
```

---

## Security Implementation

### Authentication & Authorization

```javascript
// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET; // Strong random string
const JWT_EXPIRE = "7d";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Verify JWT Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "No autorizado - Token no proporcionado" },
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Usuario no encontrado" },
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: "Token inválido o expirado" },
    });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Acceso denegado - Solo administradores" },
    });
  }
  next();
};
```

### Password Hashing

```javascript
// Using bcryptjs
const bcrypt = require("bcryptjs");

// Hash password (en modelo User)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    success: false,
    error: { message: "Demasiadas solicitudes, intenta más tarde" },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints limiter (más restrictivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  message: {
    success: false,
    error: { message: "Demasiados intentos de inicio de sesión" },
  },
});

// Apply
app.use("/api/v1/", apiLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
```

### Input Validation

```javascript
// Using express-validator
const { body, validationResult } = require("express-validator");

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Error de validación",
        details: errors.array(),
      },
    });
  };
};

// Example: Register validation
const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("El nombre completo es requerido")
    .isLength({ min: 2, max: 100 }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("phone").trim().notEmpty().withMessage("El teléfono es requerido"),
  body("birthday")
    .notEmpty()
    .withMessage("La fecha de nacimiento es requerida")
    .isISO8601()
    .withMessage("Fecha inválida"),
  body("city").trim().notEmpty().withMessage("La ciudad es requerida"),
];

// Use in route
router.post("/register", validate(registerValidation), authController.register);
```

### CORS Configuration

```javascript
const cors = require("cors");

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://entreamigas.com", "https://www.entreamigas.com"]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

### Helmet (Security Headers)

```javascript
const helmet = require("helmet");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.API_URL],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
```

### Data Sanitization

```javascript
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Prevent MongoDB injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
```

---

## Performance Optimization

### Backend Performance

```javascript
// Database query optimization
// ❌ Bad: Fetch all fields and all documents
const events = await Event.find();

// ✅ Good: Select only needed fields, limit, paginate
const events = await Event.find({ status: "upcoming" })
  .select("title date modality location imageUrl")
  .limit(20)
  .skip((page - 1) * 20)
  .sort({ date: 1 })
  .lean(); // Return plain JS objects (faster)

// Populate optimization
// ❌ Bad: Populate all fields
const event = await Event.findById(id).populate("createdBy");

// ✅ Good: Select specific fields in populate
const event = await Event.findById(id).populate(
  "createdBy",
  "fullName preferredName"
);

// Aggregation for complex queries
const stats = await Event.aggregate([
  { $match: { status: "upcoming" } },
  {
    $group: {
      _id: "$modality",
      count: { $sum: 1 },
    },
  },
]);
```

### Frontend Performance

```javascript
// Code splitting & lazy loading
import { lazy, Suspense } from "react";

const EventsPage = lazy(() => import("./features/events/pages/EventsPage"));
const BlogPage = lazy(() => import("./features/blog/pages/BlogPage"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Suspense>
  );
}

// Memoization
import { useMemo } from "react";

const EventList = ({ events, filters }) => {
  const filteredEvents = useMemo(() => {
    return events.filter((event) => event.modality === filters.modality);
  }, [events, filters.modality]);

  return <div>{/* render */}</div>;
};

// Debouncing search
import { useDebounce } from "../shared/hooks/useDebounce";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);
};

// Image optimization
<img src={event.imageUrl} alt={event.title} loading="lazy" decoding="async" />;
```

### Caching Strategy

```javascript
// API Response caching (simple in-memory for MVP)
const cache = new Map();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const { timestamp, data } = cachedResponse;
      if (Date.now() - timestamp < duration) {
        return res.json(data);
      }
      cache.delete(key);
    }

    res.originalJson = res.json;
    res.json = (data) => {
      cache.set(key, { timestamp: Date.now(), data });
      res.originalJson(data);
    };

    next();
  };
};

// Use in routes (cache por 5 minutos)
router.get("/events", cacheMiddleware(5 * 60 * 1000), getEvents);
```

### Performance Targets

```yaml
Backend API:
  Response Time (p95): < 200ms
  Response Time (p99): < 500ms
  Uptime: > 99.5%

Frontend:
  First Contentful Paint: < 1.5s
  Largest Contentful Paint: < 2.5s
  Time to Interactive: < 3.5s
  Cumulative Layout Shift: < 0.1
  Page Load (3G): < 5s

Database:
  Query Time: < 100ms (indexed queries)
  Connection Pool: 10-20 connections
```

---

## Environment Configuration

### Development Environment

```bash
# frontend/.env.local
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Entre Amigas
VITE_ENV=development
```

```bash
# backend/.env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/entreamigas
# O MongoDB Atlas para desarrollo
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/entreamigas-dev

# JWT
JWT_SECRET=your_super_secret_development_key_min_32_chars
JWT_EXPIRE=7d

# Email (Resend)
EMAIL_SERVICE=resend
RESEND_API_KEY=re_123456789
EMAIL_FROM=noreply@entreamigas.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Production Environment

```bash
# frontend/.env.production (Vercel)
VITE_API_URL=https://api.entreamigas.com/api/v1
VITE_APP_NAME=Entre Amigas
VITE_ENV=production
```

```bash
# backend/.env (Railway)
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://prod_user:strong_pass@cluster.mongodb.net/entreamigas-prod?retryWrites=true&w=majority

# JWT
JWT_SECRET=super_strong_production_secret_min_64_chars_random_string
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=resend
RESEND_API_KEY=re_prod_key_here
EMAIL_FROM=noreply@entreamigas.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=prod_cloud_name
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret

# Frontend URL
FRONTEND_URL=https://entreamigas.com

# CORS
CORS_ORIGIN=https://entreamigas.com,https://www.entreamigas.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Deployment Architecture

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy Entre Amigas

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Run linter
        working-directory: ./frontend
        run: npm run lint
      - name: Run tests
        working-directory: ./frontend
        run: npm run test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      - name: Run linter
        working-directory: ./backend
        run: npm run lint
      - name: Run tests
        working-directory: ./backend
        run: npm run test

  deploy-frontend:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: "--prod"

  deploy-backend:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://api.entreamigas.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

### Deployment Checklist

```markdown
## Pre-Deployment

- [ ] Todos los tests pasan (frontend + backend)
- [ ] Code review aprobado
- [ ] Variables de entorno actualizadas en producción
- [ ] Migraciones de base de datos preparadas (si aplica)
- [ ] Backup de base de datos tomado
- [ ] Changelog actualizado con cambios
- [ ] Documentación actualizada (si aplica)

## Deployment

- [ ] Merge a rama main
- [ ] CI/CD pipeline ejecutado exitosamente
- [ ] Frontend deployado a Vercel
- [ ] Backend deployado a Railway
- [ ] DNS apuntando correctamente

## Post-Deployment

- [ ] Smoke tests manuales ejecutados:
  - [ ] Landing page carga correctamente
  - [ ] Registro de nuevo usuario funciona
  - [ ] Login funciona
  - [ ] Ver eventos funciona
  - [ ] Panel admin accesible
- [ ] Logs de errores revisados (sin errores críticos)
- [ ] Performance metrics aceptables (< 3s load time)
- [ ] Email de confirmación funciona
- [ ] Notificación a equipo enviada
```

---

## Monitoring & Error Tracking

### Error Handling

```javascript
// Backend: Global error handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Error de validación",
        details: Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_ERROR",
        message: `El ${field} ya existe`,
      },
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Token inválido",
      },
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || "SERVER_ERROR",
      message: err.message || "Error interno del servidor",
    },
  });
};

app.use(errorHandler);
```

### Logging Strategy

```javascript
// Winston logger configuration
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Usage
logger.info("Usuario creado", { userId: user._id, email: user.email });
logger.error("Error al crear evento", {
  error: error.message,
  stack: error.stack,
});
logger.warn("Rate limit excedido", { ip: req.ip });
```

### Health Check Endpoint

```javascript
// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Database health check
router.get("/health/db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({
      success: true,
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      database: "disconnected",
      error: error.message,
    });
  }
});
```

### Monitoring Metrics (Manual MVP)

```yaml
Key Metrics to Track:

Infrastructure:
  - Server uptime (Railway dashboard)
  - API response times (Railway metrics)
  - Database connections (MongoDB Atlas)
  - Memory usage (Railway)

Application:
  - Total usuarios registrados
  - Nuevos registros por día/semana
  - Eventos creados
  - Registros a eventos
  - Posts publicados en blog
  - Visitas a landing page (Google Analytics)

Errors:
  - 4xx errors (client errors)
  - 5xx errors (server errors)
  - Failed email sends
  - Database connection failures
```

---

## Testing Strategy

### Unit Tests (Backend)

```javascript
// Example: auth.service.test.js
const authService = require("../services/auth.service");
const User = require("../models/User");

describe("AuthService", () => {
  describe("registerUser", () => {
    it("debería crear un usuario con contraseña hasheada", async () => {
      const userData = {
        fullName: "Test User",
        preferredName: "Test",
        email: "test@example.com",
        password: "password123",
        phone: "1234567890",
        birthday: new Date("1990-01-01"),
        city: "Toronto",
      };

      const user = await authService.registerUser(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Debe estar hasheada
      expect(user.role).toBe("user");
    });

    it("debería fallar con email duplicado", async () => {
      await expect(
        authService.registerUser({ email: "existing@example.com" })
      ).rejects.toThrow();
    });
  });
});
```

### Integration Tests (Backend)

```javascript
// Example: events.routes.test.js
const request = require("supertest");
const app = require("../server");

describe("Events API", () => {
  let authToken;

  beforeAll(async () => {
    // Login para obtener token
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "password123" });

    authToken = response.body.data.token;
  });

  describe("GET /api/v1/events", () => {
    it("debería retornar lista de eventos", async () => {
      const response = await request(app).get("/api/v1/events").expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/events/:id/register", () => {
    it("debería registrar usuario a evento", async () => {
      const response = await request(app)
        .post("/api/v1/events/123/register")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("registrado");
    });
  });
});
```

### Component Tests (Frontend)

```javascript
// Example: LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("debería renderizar campos de email y contraseña", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("debería mostrar errores de validación", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email requerido/i)).toBeInTheDocument();
    });
  });

  it("debería enviar formulario con datos válidos", async () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });
});
```

### Test Coverage Targets

```yaml
Backend:
  Statements: > 80%
  Branches: > 75%
  Functions: > 80%
  Lines: > 80%

Frontend:
  Statements: > 70%
  Branches: > 65%
  Functions: > 70%
  Lines: > 70%
```

---

## Maintenance & Updates

### Update Schedule

```yaml
Security Patches: Inmediato (cuando se descubren vulnerabilidades)
Dependencies: Mensual (revisar actualizaciones disponibles)
Framework Updates: Trimestral (React, Express, MongoDB)
Node.js: Semestral (seguir versiones LTS)
```

### Backup Strategy

```yaml
Database Backups:
  Frequency: Diario (automático en MongoDB Atlas)
  Retention: 30 días
  Location: MongoDB Atlas backups + export semanal a storage

Code Repository:
  Platform: GitHub
  Branches: main (producción), develop (desarrollo)
  Commits: Diarios durante desarrollo

Environment Variables:
  Storage: Documentado en archivo seguro (1Password, Bitwarden)
  Backup: Manual, actualizar cuando cambian
```

### Disaster Recovery Plan

```yaml
Database Failure:
  RTO: 4 horas
  RPO: 24 horas
  Action: Restaurar desde backup más reciente de MongoDB Atlas

Server Failure:
  RTO: 2 horas
  RPO: 0 (código en Git)
  Action: Re-deploy desde GitHub a nuevo servidor Railway

Data Corruption:
  RTO: 8 horas
  RPO: 24 horas
  Action: Investigar causa, restaurar desde backup limpio
```

---

## Documentation Standards

### Code Comments

```javascript
/**
 * Registra un usuario a un evento y envía email de confirmación
 *
 * @param {string} eventId - ID del evento
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Registro creado
 * @throws {Error} Si el evento está lleno o el usuario ya está registrado
 */
async function registerUserToEvent(eventId, userId) {
  // Verificar si el evento existe
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Evento no encontrado");
  }

  // Verificar capacidad
  if (event.maxCapacity && event.currentRegistrations >= event.maxCapacity) {
    throw new Error("Evento lleno");
  }

  // Crear registro
  const registration = await EventRegistration.create({
    eventId,
    userId,
    status: "registered",
  });

  // Actualizar contador
  event.currentRegistrations += 1;
  await event.save();

  // Enviar email
  await emailService.sendEventConfirmation(userId, eventId);

  return registration;
}
```

### API Documentation

````markdown
## POST /api/v1/events/:id/register

Registra al usuario autenticado en un evento específico.

### Authentication

Requiere Bearer token en header Authorization.

### Parameters

- `id` (path, required): ID del evento

### Response

**Success (200)**

```json
{
  "success": true,
  "data": {
    "_id": "64f5a...",
    "userId": "64f3b...",
    "eventId": "64f2c...",
    "registeredAt": "2025-01-15T10:30:00Z",
    "status": "registered"
  },
  "message": "Te has registrado exitosamente al evento"
}
```
````

**Error (400) - Evento lleno**

```json
{
  "success": false,
  "error": {
    "code": "EVENT_FULL",
    "message": "El evento ha alcanzado su capacidad máxima"
  }
}
```

**Error (409) - Ya registrado**

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_REGISTERED",
    "message": "Ya estás registrado en este evento"
  }
}
```

````

---

## Document Maintenance

**Review Frequency:** Trimestral o cuando hay cambios arquitectónicos mayores

**Update Triggers:**
- Adopción de nueva tecnología
- Cambios en stack técnico
- Refactoring mayor
- Nuevas integraciones externas
- Cambios en políticas de seguridad
- Actualizaciones de framework importantes

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 5 nov 2025 | Arquitectura inicial | Equipo Entre Amigas |

---

**Last Updated:** 5 de noviembre, 2025
**Next Review:** 5 de febrero, 2026
**Maintained by:** Equipo Entre Amigas

---

## Quick Reference

### Essential Commands

```bash
# Frontend Development
cd frontend
npm install
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run test             # Run tests

# Backend Development
cd backend
npm install
npm run dev              # Start with nodemon
npm start                # Start production
npm run lint             # Run ESLint
npm run test             # Run tests

# Database
mongosh                  # Connect to MongoDB shell
````

### Important URLs

```yaml
Development:
  Frontend: http://localhost:5173
  Backend: http://localhost:5000
  MongoDB: mongodb://localhost:27017

Production:
  Website: https://entreamigas.com
  API: https://api.entreamigas.com
  Admin: https://entreamigas.com/admin
```

---

**Fin del documento de arquitectura**
