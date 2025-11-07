# ARCHITECTURE.md - Entre Amigas

**Version:** 1.1  
**Created:** 5 de noviembre, 2025  
**Last Updated:** 6 de noviembre, 2025  
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
┌──────────────────────────────────────────────────┐
│                   USUARIO FINAL                      │
│              (Navegador Web - Mobile/Desktop)        │
└──────────────────┬───────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────┐
│                 CDN (Cloudflare)                     │
│              (Assets estáticos + Cache)              │
└──────────────────┬───────────────────────────────┘
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
             ┌─────────────────────────┼──────────────────┐
             │                         │                  │
             ▼                         ▼                  ▼
     ┌──────────────┐          ┌──────────────┐  ┌──────────────┐
     │   MongoDB    │          │   AWS S3     │  │ Resend/Brevo │
     │    Atlas     │          │  (Imágenes)  │  │   (Emails)   │
     └──────────────┘          └──────────────┘  └──────────────┘
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
Icons: Lucide React 0.445.x (o React Icons)
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
File Upload: Multer 1.4.x + AWS SDK v3
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
File Storage: AWS S3 (tier gratuito 5GB)
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
│   │   │   │       ├── EventDetailPage.jsx
│   │   │   │       └── MyEventsPage.jsx
│   │   │   │
│   │   │   ├── business/                # Directorio de negocios
│   │   │   │   ├── components/
│   │   │   │   │   ├── BusinessCard.jsx
│   │   │   │   │   ├── BusinessList.jsx
│   │   │   │   │   ├── BusinessFilters.jsx
│   │   │   │   │   └── BusinessDetail.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── businessService.js
│   │   │   │   └── pages/
│   │   │   │       ├── BusinessPage.jsx
│   │   │   │       └── BusinessDetailPage.jsx
│   │   │   │
│   │   │   ├── services/                # Directorio de servicios
│   │   │   │   ├── components/
│   │   │   │   │   ├── ServiceCard.jsx
│   │   │   │   │   ├── ServiceList.jsx
│   │   │   │   │   ├── ServiceFilters.jsx
│   │   │   │   │   └── ServiceDetail.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── serviceService.js
│   │   │   │   └── pages/
│   │   │   │       ├── ServicesPage.jsx
│   │   │   │       └── ServiceDetailPage.jsx
│   │   │   │
│   │   │   ├── blog/                    # Blog
│   │   │   │   ├── components/
│   │   │   │   │   ├── BlogCard.jsx
│   │   │   │   │   ├── BlogList.jsx
│   │   │   │   │   ├── BlogFilters.jsx
│   │   │   │   │   └── BlogPost.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── blogService.js
│   │   │   │   └── pages/
│   │   │   │       ├── BlogPage.jsx
│   │   │   │       └── BlogPostPage.jsx
│   │   │   │
│   │   │   ├── admin/                   # Panel de administración
│   │   │   │   ├── components/
│   │   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   │   ├── EventForm.jsx
│   │   │   │   │   ├── BusinessForm.jsx
│   │   │   │   │   ├── ServiceForm.jsx
│   │   │   │   │   ├── BlogEditor.jsx
│   │   │   │   │   └── DataTable.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── adminService.js
│   │   │   │   └── pages/
│   │   │   │       ├── AdminDashboard.jsx
│   │   │   │       ├── ManageEvents.jsx
│   │   │   │       ├── ManageBusiness.jsx
│   │   │   │       ├── ManageServices.jsx
│   │   │   │       └── ManageBlog.jsx
│   │   │   │
│   │   │   ├── landing/                 # Landing page pública
│   │   │   │   ├── components/
│   │   │   │   │   ├── Hero.jsx
│   │   │   │   │   ├── Features.jsx
│   │   │   │   │   ├── Testimonials.jsx
│   │   │   │   │   ├── CallToAction.jsx
│   │   │   │   │   └── Footer.jsx
│   │   │   │   └── pages/
│   │   │   │       └── LandingPage.jsx
│   │   │   │
│   │   │   └── profile/                 # Perfil de usuaria
│   │   │       ├── components/
│   │   │       │   ├── ProfileForm.jsx
│   │   │       │   └── ProfileSettings.jsx
│   │   │       └── pages/
│   │   │           └── ProfilePage.jsx
│   │   │
│   │   ├── shared/                      # Compartido entre features
│   │   │   ├── components/              # Componentes UI reutilizables
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Input.jsx
│   │   │   │   │   ├── Card.jsx
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   ├── Dropdown.jsx
│   │   │   │   │   └── Spinner.jsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   └── Layout.jsx
│   │   │   │   └── common/
│   │   │   │       ├── ErrorBoundary.jsx
│   │   │   │       ├── LoadingScreen.jsx
│   │   │   │       └── NotFound.jsx
│   │   │   │
│   │   │   ├── hooks/                   # Custom hooks
│   │   │   │   ├── useDebounce.js
│   │   │   │   ├── useLocalStorage.js
│   │   │   │   ├── useForm.js
│   │   │   │   └── useApi.js
│   │   │   │
│   │   │   └── utils/                   # Utilidades
│   │   │       ├── api.js               # Axios config
│   │   │       ├── validators.js        # Validaciones Yup
│   │   │       ├── formatters.js        # Formato de fechas, texto
│   │   │       ├── constants.js         # Constantes globales
│   │   │       └── helpers.js           # Funciones helper
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
│   │   │   ├── aws.js                   # AWS S3 config
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
│   │   │   └── upload.service.js        # AWS S3 uploads
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
│       └── deploy.yml                   # CI/CD pipeline
│
└── README.md                            # Documentación principal
```

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String (required),
  preferredName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  phone: String (required),
  birthday: Date (required),
  city: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isVerified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Event Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  date: Date (required),
  time: String (required),
  modality: String (enum: ['virtual', 'presencial'], required),
  location: String (required if presencial),
  meetingLink: String (required if virtual),
  maxCapacity: Number (optional),
  currentRegistrations: Number (default: 0),
  imageUrl: String (optional),
  status: String (enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming'),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### EventRegistration Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  eventId: ObjectId (ref: 'Event', required),
  registeredAt: Date (auto),
  status: String (enum: ['registered', 'cancelled'], default: 'registered'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Unique compound index: [userId, eventId]
```

### Business Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  owner: String (required),
  category: String (enum: ['Comida', 'Belleza', 'Salud', 'Educación', 'Servicios', 'Otro'], required),
  description: String (required),
  phone: String (required),
  email: String (optional),
  city: String (required),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Service Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  category: String (enum: ['Salud', 'Dental', 'Salud Mental', 'Legal', 'Educación', 'Emergencias', 'Gobierno'], required),
  specialty: String (optional),
  phone: String (required),
  address: String (required),
  website: String (optional),
  notes: String (optional),
  city: String (required),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### BlogPost Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  excerpt: String (required),
  content: String (required),
  featuredImage: String (optional),
  category: String (enum: ['Wellness', 'Amistad', 'Amor Propio', 'Migración', 'Consejos', 'Historias'], required),
  status: String (enum: ['draft', 'published', 'archived'], default: 'draft'),
  publishedAt: Date (optional),
  author: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## API Design

### API Versioning

- Base URL: `/api/v1`
- Version in URL path
- Current version: v1

### REST Conventions

```
GET    /api/v1/resource       - List all
GET    /api/v1/resource/:id   - Get one
POST   /api/v1/resource       - Create
PUT    /api/v1/resource/:id   - Update (full)
PATCH  /api/v1/resource/:id   - Update (partial)
DELETE /api/v1/resource/:id   - Delete
```

### Authentication Endpoints

```
POST   /api/v1/auth/register              - Registro de usuario
POST   /api/v1/auth/login                 - Login
GET    /api/v1/auth/verify-email/:token   - Verificar email
POST   /api/v1/auth/forgot-password       - Solicitar reset
POST   /api/v1/auth/reset-password/:token - Resetear password
GET    /api/v1/auth/me                    - Obtener usuario actual
PUT    /api/v1/auth/update-profile        - Actualizar perfil
```

### Events Endpoints

```
GET    /api/v1/events                - Listar eventos (público)
GET    /api/v1/events/:id            - Ver detalle de evento
POST   /api/v1/events/:id/register   - Registrarse a evento (auth)
GET    /api/v1/events/my-events      - Mis eventos registrados (auth)
```

### Business Endpoints

```
GET    /api/v1/business              - Listar negocios
GET    /api/v1/business/:id          - Ver detalle de negocio
```

### Services Endpoints

```
GET    /api/v1/services              - Listar servicios
GET    /api/v1/services/:id          - Ver detalle de servicio
```

### Blog Endpoints

```
GET    /api/v1/blog                  - Listar artículos publicados
GET    /api/v1/blog/:slug            - Ver artículo por slug
```

### Admin Endpoints (Protected - Admin Only)

```
POST   /api/v1/admin/events          - Crear evento
PUT    /api/v1/admin/events/:id      - Editar evento
DELETE /api/v1/admin/events/:id      - Eliminar evento
GET    /api/v1/admin/events/:id/registrations - Ver registros

POST   /api/v1/admin/business        - Crear negocio
PUT    /api/v1/admin/business/:id    - Editar negocio
DELETE /api/v1/admin/business/:id    - Eliminar negocio

POST   /api/v1/admin/services        - Crear servicio
PUT    /api/v1/admin/services/:id    - Editar servicio
DELETE /api/v1/admin/services/:id    - Eliminar servicio

POST   /api/v1/admin/blog            - Crear artículo
PUT    /api/v1/admin/blog/:id        - Editar artículo
DELETE /api/v1/admin/blog/:id        - Eliminar artículo
```

### Query Parameters (Common)

```javascript
// Pagination
?page=1&limit=20

// Filtering
?city=Toronto&category=Salud

// Search
?search=palabra

// Sorting
?sort=date&order=asc
```

---

## Authentication & Authorization

### JWT Token Structure

```javascript
{
  header: {
    alg: 'HS256',
    typ: 'JWT'
  },
  payload: {
    userId: '64f5a1b2c3d4e5f6g7h8i9j0',
    email: 'usuario@example.com',
    role: 'user',
    iat: 1699123456,
    exp: 1699728256  // 7 días
  },
  signature: '...'
}
```

### Authentication Flow

1. User submits credentials → `/api/v1/auth/login`
2. Backend validates credentials
3. Backend generates JWT token
4. Token sent to client
5. Client stores token in localStorage
6. Client includes token in Authorization header: `Bearer <token>`
7. Backend middleware verifies token on protected routes

### Password Security

- Hashed with bcrypt
- Salt rounds: 10
- Never stored in plain text
- Never sent in responses

### Protected Routes Pattern

```javascript
// Backend middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ error: "No autorizado" });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
};

// Usage
router.get("/profile", authMiddleware, getProfile);
router.post("/admin/events", authMiddleware, adminMiddleware, createEvent);
```

---

## File Upload Strategy (AWS S3)

### AWS S3 Configuration

```javascript
// backend/src/config/aws.js
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3Client };
```

### Upload Service

```javascript
// backend/src/services/upload.service.js
const { s3Client } = require("../config/aws");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const uploadToS3 = async (file, folder = "uploads") => {
  try {
    // Generate unique filename
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${crypto
      .randomBytes(16)
      .toString("hex")}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // or 'private' if using signed URLs
    });

    await s3Client.send(command);

    // Return public URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      url: fileUrl,
      key: fileName,
    };
  } catch (error) {
    throw new Error(`Error uploading to S3: ${error.message}`);
  }
};

const deleteFromS3 = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    throw new Error(`Error deleting from S3: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
```

### Multer Configuration

```javascript
// backend/src/middleware/upload.middleware.js
const multer = require("multer");

// Use memory storage to pass buffer to S3
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de archivo no válido. Solo se permiten imágenes (jpg, png, webp)"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

module.exports = upload;
```

### Usage in Controller

```javascript
// Example: Upload event image
const createEvent = async (req, res) => {
  try {
    const eventData = req.body;

    // If image was uploaded
    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "events");
      eventData.imageUrl = uploadResult.url;
      eventData.imageKey = uploadResult.key; // Store key for deletion
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      data: event,
      message: "Evento creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: error.message,
      },
    });
  }
};
```

### AWS S3 Bucket Structure

```
entre-amigas-bucket/
├── events/
│   ├── abc123def456.jpg
│   └── xyz789ghi012.png
├── blog/
│   ├── post1_featured.jpg
│   └── post2_content_img.jpg
├── business/
│   └── logo_business1.png
└── profile/
    └── avatar_user1.jpg
```

---

## Email Service (Resend)

### Email Configuration

```javascript
// backend/src/config/email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const emailConfig = {
  from: process.env.EMAIL_FROM || "noreply@entreamigas.com",
  replyTo: process.env.EMAIL_REPLY_TO || "hola@entreamigas.com",
};

module.exports = { resend, emailConfig };
```

### Email Service

```javascript
// backend/src/services/email.service.js
const { resend, emailConfig } = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error al enviar email");
  }
};

const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const html = `
    <h1>¡Bienvenida a Entre Amigas!</h1>
    <p>Hola ${user.preferredName},</p>
    <p>Gracias por registrarte. Por favor verifica tu email haciendo click en el siguiente link:</p>
    <a href="${verificationUrl}">Verificar Email</a>
    <p>Este link expira en 24 horas.</p>
    <p>Si no creaste esta cuenta, ignora este email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verifica tu email - Entre Amigas",
    html,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <h1>Recuperación de contraseña</h1>
    <p>Hola ${user.preferredName},</p>
    <p>Recibimos una solicitud para resetear tu contraseña. Haz click aquí:</p>
    <a href="${resetUrl}">Resetear Contraseña</a>
    <p>Este link expira en 1 hora.</p>
    <p>Si no solicitaste esto, ignora este email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Recuperación de contraseña - Entre Amigas",
    html,
  });
};

const sendEventConfirmationEmail = async (user, event) => {
  const eventDetailsUrl = `${process.env.FRONTEND_URL}/events/${event._id}`;

  const html = `
    <h1>¡Te registraste exitosamente!</h1>
    <p>Hola ${user.preferredName},</p>
    <p>Confirmamos tu registro para el evento:</p>
    <h2>${event.title}</h2>
    <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString(
      "es-ES"
    )}</p>
    <p><strong>Hora:</strong> ${event.time}</p>
    <p><strong>Modalidad:</strong> ${event.modality}</p>
    ${
      event.modality === "presencial"
        ? `<p><strong>Ubicación:</strong> ${event.location}</p>`
        : `<p><strong>Link:</strong> <a href="${event.meetingLink}">${event.meetingLink}</a></p>`
    }
    <p><a href="${eventDetailsUrl}">Ver detalles del evento</a></p>
    <p>¡Nos vemos pronto!</p>
  `;

  await sendEmail({
    to: user.email,
    subject: `Confirmación de registro: ${event.title}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEventConfirmationEmail,
};
```

---

## Error Handling

### Global Error Handler

```javascript
// backend/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Recurso no encontrado";
    error = { statusCode: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Ya existe un recurso con esos datos";
    error = { statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || "SERVER_ERROR",
      message: error.message || "Error del servidor",
    },
  });
};

module.exports = errorHandler;
```

### Custom Error Class

```javascript
// backend/src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, code = "ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = ApiError;
```

### Async Handler Wrapper

```javascript
// backend/src/utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

---

## Security Best Practices

### Environment Variables

```bash
# NEVER commit .env files
# Always use .env.example as template

# backend/.env (NEVER commit this)
NODE_ENV=production
JWT_SECRET=super_long_random_string_min_64_chars
MONGODB_URI=mongodb+srv://...
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=entre-amigas-production
RESEND_API_KEY=re_...
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
        imgSrc: [
          "'self'",
          "data:",
          `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com`,
        ],
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

# AWS S3
AWS_ACCESS_KEY_ID=your_dev_access_key
AWS_SECRET_ACCESS_KEY=your_dev_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=entre-amigas-dev

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

# AWS S3
AWS_ACCESS_KEY_ID=your_prod_access_key
AWS_SECRET_ACCESS_KEY=your_prod_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=entre-amigas-production

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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run linter
        run: cd frontend && npm run lint
      - name: Run tests
        run: cd frontend && npm run test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run linter
        run: cd backend && npm run lint
      - name: Run tests
        run: cd backend && npm run test

  deploy-frontend:
    needs: [test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"

  deploy-backend:
    needs: [test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Deployment Checklist

**Pre-Deployment:**

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] Domain DNS configured
- [ ] SSL certificates active
- [ ] AWS S3 bucket configured
- [ ] Email service verified
- [ ] Rate limiting configured
- [ ] Error monitoring setup (Sentry)

**Post-Deployment:**

- [ ] Smoke tests passed
- [ ] Health check endpoint responding
- [ ] Database connections working
- [ ] Email sending working
- [ ] File uploads working (AWS S3)
- [ ] Authentication flow working
- [ ] Admin panel accessible
- [ ] Performance monitoring active

---

## Monitoring & Logging

### Health Check Endpoint

```javascript
// backend/src/routes/health.routes.js
router.get("/health", async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});
```

### Logging Strategy

```javascript
// Use winston for production logging
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
```

### Monitoring Metrics

```yaml
Key Metrics to Track:
  - API response times (p50, p95, p99)
  - Error rates by endpoint
  - Database query performance
  - User registrations per day
  - Event registrations per event
  - Email delivery success rate
  - AWS S3 upload success rate
  - Frontend page load times
  - Uptime percentage
```

---

## Backup & Recovery

### Database Backup Strategy

```yaml
Automated Backups (MongoDB Atlas):
  Frequency: Daily snapshots
  Retention: 30 days
  Location: MongoDB Atlas built-in

Manual Backups:
  Frequency: Weekly exports
  Format: JSON dumps
  Location: AWS S3 backup bucket
  Command: mongodump --uri="..." --out=/backup
```

### AWS S3 Backup

```yaml
Versioning: Enabled on production bucket
Lifecycle Rules:
  - Move to Glacier after 90 days
  - Delete after 365 days
Cross-Region Replication: Optional (consider for production)
```

### Code Repository Backup

```yaml
Primary: GitHub
Backup: None needed (following versioning)
Branches: main (production), develop (staging)
Tags: Version releases
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

| Version | Date         | Changes                                       | Author              |
| ------- | ------------ | --------------------------------------------- | ------------------- |
| 1.0     | 5 nov 2025   | Arquitectura inicial                          | Equipo Entre Amigas |
| 1.1     | 6 nov 2025   | Actualización: Cloudinary → AWS S3            | Equipo Entre Amigas |

---

**Last Updated:** 6 de noviembre, 2025
**Next Review:** 6 de febrero, 2026
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
