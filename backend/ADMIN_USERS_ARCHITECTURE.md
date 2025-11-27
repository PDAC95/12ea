# Admin Users Management - Arquitectura

## Flujo de Request/Response

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                  │
│                    /admin/users (React)                           │
│                                                                   │
│  - AdminUsersPage.jsx                                            │
│  - Usa fetch() para llamar API                                   │
│  - Headers: Authorization: Bearer <token>                        │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                               │
│                   http://localhost:8000                           │
│                                                                   │
│  server.js                                                        │
│    │                                                              │
│    └──> app.js                                                    │
│          │                                                        │
│          └──> routes/index.js                                     │
│                │                                                  │
│                └──> router.use('/admin/users', adminUserRoutes)  │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                 ADMIN USER ROUTES                                 │
│         src/routes/admin.user.routes.js                          │
│                                                                   │
│  Middleware Stack:                                               │
│  1. router.use(protect)         → Verifica JWT token             │
│  2. router.use(authorize('admin')) → Verifica rol admin          │
│                                                                   │
│  Rutas:                                                          │
│  - GET    /               → getAllUsers                          │
│  - GET    /:id            → getUserById                          │
│  - PUT    /:id            → updateUser                           │
│  - DELETE /:id            → deleteUser                           │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│              AUTH MIDDLEWARE                                      │
│         src/middleware/auth.middleware.js                        │
│                                                                   │
│  protect():                                                      │
│  1. Extrae token del header Authorization                       │
│  2. Verifica token JWT                                           │
│  3. Decodifica payload (id, email, role)                        │
│  4. Agrega req.user = { id, email, role }                       │
│                                                                   │
│  authorize('admin'):                                             │
│  1. Verifica que req.user existe                                │
│  2. Verifica que req.user.role === 'admin'                      │
│  3. Si no, retorna 403 Forbidden                                │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│              ADMIN USER CONTROLLER                                │
│         src/controllers/admin.user.controller.js                 │
│                                                                   │
│  getAllUsers(req, res):                                          │
│  ├─ Extrae query params (page, limit, search, filters)          │
│  ├─ Construye query de búsqueda                                 │
│  ├─ Ejecuta User.find() con paginación                          │
│  ├─ Excluye campos sensibles                                    │
│  └─ Retorna { success, data: { users, pagination } }            │
│                                                                   │
│  getUserById(req, res):                                          │
│  ├─ Extrae ID de params                                         │
│  ├─ Busca User.findById(id)                                     │
│  ├─ Excluye campos sensibles                                    │
│  └─ Retorna { success, data: user }                             │
│                                                                   │
│  updateUser(req, res):                                           │
│  ├─ Valida campos permitidos vs prohibidos                      │
│  ├─ Verifica no auto-modificación (rol, isActive)               │
│  ├─ Ejecuta User.findByIdAndUpdate()                            │
│  └─ Retorna { success, data: updatedUser, message }             │
│                                                                   │
│  deleteUser(req, res):                                           │
│  ├─ Verifica no auto-eliminación                                │
│  ├─ Soft delete: isActive = false (default)                     │
│  ├─ Hard delete: User.findByIdAndDelete() (if ?hard=true)       │
│  └─ Retorna { success, data, message }                          │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      USER MODEL                                   │
│              src/models/User.js                                  │
│                                                                   │
│  Schema Fields:                                                  │
│  - fullName, preferredName, email                               │
│  - password (select: false)                                      │
│  - phone, birthday, city                                         │
│  - role (user | admin)                                           │
│  - isVerified, isActive                                          │
│  - authProvider (local | google)                                 │
│  - profileImage, bio                                             │
│  - createdAt, updatedAt                                          │
│                                                                   │
│  Indices:                                                        │
│  - email (unique)                                                │
│  - role, city, isActive, isVerified                              │
│                                                                   │
│  Methods:                                                        │
│  - comparePassword()                                             │
│  - getPublicProfile()                                            │
│                                                                   │
│  Statics:                                                        │
│  - findByEmail()                                                 │
│  - findActiveByCity()                                            │
│  - countVerified()                                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                             │
│                                                                   │
│  Collection: users                                               │
│  Total documents: 9                                              │
│                                                                   │
│  Operaciones:                                                    │
│  - find() con paginación                                         │
│  - findById()                                                    │
│  - findByIdAndUpdate()                                           │
│  - findByIdAndDelete()                                           │
│  - countDocuments()                                              │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ Response
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                  │
│                    Recibe respuesta JSON                          │
│                                                                   │
│  Success:                                                        │
│  {                                                               │
│    success: true,                                                │
│    data: { users, pagination } | user | updatedUser             │
│  }                                                               │
│                                                                   │
│  Error:                                                          │
│  {                                                               │
│    success: false,                                               │
│    message: "...",                                               │
│    code: "ERROR_CODE"                                            │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                          │
│  - React Components (/admin/users)                           │
│  - HTTP Client (fetch API)                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP/JSON
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  ROUTING LAYER                                               │
│  - Express Router                                            │
│  - Route Definitions (admin.user.routes.js)                  │
│  - Endpoint Mapping                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  MIDDLEWARE LAYER                                            │
│  - Authentication (protect)                                  │
│  - Authorization (requireAdmin)                              │
│  - Validation (Mongoose validators)                          │
│  - Error Handling                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                                        │
│  - Controllers (admin.user.controller.js)                    │
│  - Business Rules:                                           │
│    * Paginación y búsqueda                                   │
│    * Validación de campos permitidos/prohibidos              │
│    * Protección de auto-modificación                         │
│    * Soft delete / Hard delete                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  DATA ACCESS LAYER                                           │
│  - Mongoose Models (User.js)                                 │
│  - Schema Definitions                                        │
│  - Validation Rules                                          │
│  - Indices                                                   │
│  - Model Methods & Statics                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ MongoDB Wire Protocol
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE LAYER                                              │
│  - MongoDB Database                                          │
│  - Collection: users                                         │
│  - 9 documents                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Autenticación y Autorización

```
1. CLIENT
   │
   ├─> Login: POST /api/v1/auth/login
   │   Body: { email, password }
   │
   │   ▼
   └─> Recibe: { success: true, data: { token, user } }
       │
       │ Guarda token en localStorage/memory
       │
       ▼

2. REQUESTS SUBSECUENTES
   │
   ├─> Incluye token en header:
   │   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   │
   │   ▼
   └─> SERVER VALIDA:

       ┌────────────────────────────────────┐
       │  protect() middleware              │
       │  1. Extrae token del header        │
       │  2. Verifica firma JWT             │
       │  3. Verifica expiración            │
       │  4. Decodifica payload             │
       │  5. Agrega req.user                │
       └────────────┬───────────────────────┘
                    │
                    ▼
       ┌────────────────────────────────────┐
       │  requireAdmin() middleware         │
       │  1. Verifica req.user existe       │
       │  2. Verifica req.user.role         │
       │  3. Si !== 'admin' → 403           │
       │  4. Si === 'admin' → next()        │
       └────────────┬───────────────────────┘
                    │
                    ▼
       ┌────────────────────────────────────┐
       │  Controller ejecuta lógica         │
       │  req.user contiene:                │
       │  - id (MongoDB ObjectId)           │
       │  - email                           │
       │  - role ('admin')                  │
       └────────────────────────────────────┘
```

---

## Flujo de Validaciones

```
PUT /api/v1/admin/users/:id
Body: { email: "hack@bad.com", role: "admin" }

                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│  updateUser() Controller                            │
│                                                      │
│  VALIDACIÓN 1: Campos Prohibidos                    │
│  ├─ forbiddenFields = [email, password, ...]       │
│  ├─ Verifica si req.body contiene alguno            │
│  └─ Si SÍ → 400 Bad Request                         │
│                                                      │
│  VALIDACIÓN 2: Campos Permitidos                    │
│  ├─ allowedFields = [fullName, role, ...]          │
│  ├─ Filtra solo campos permitidos                   │
│  └─ Si ninguno → 400 "No valid fields"              │
│                                                      │
│  VALIDACIÓN 3: Auto-Modificación                    │
│  ├─ Si isActive === false && id === req.user.id     │
│  └─> 400 "Cannot deactivate self"                   │
│  ├─ Si role === 'user' && id === req.user.id        │
│  └─> 400 "Cannot change own role"                   │
│                                                      │
│  VALIDACIÓN 4: Mongoose Validators                  │
│  ├─ User.findByIdAndUpdate(..., { runValidators })  │
│  └─ Schema validations:                             │
│      - fullName: minLength, maxLength               │
│      - role: enum ['user', 'admin']                 │
│      - etc.                                          │
│                                                      │
│  SI TODO OK → 200 Success                           │
└─────────────────────────────────────────────────────┘
```

---

## Flujo de Paginación

```
GET /api/v1/admin/users?page=2&limit=5&search=maria

                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│  getAllUsers() Controller                           │
│                                                      │
│  1. Parse Query Params                              │
│     - page = 2                                       │
│     - limit = 5 (max 100)                           │
│     - skip = (page - 1) * limit = 5                 │
│     - search = "maria"                               │
│                                                      │
│  2. Build Query                                      │
│     query = {                                        │
│       $or: [                                         │
│         { fullName: /maria/i },                     │
│         { preferredName: /maria/i },                │
│         { email: /maria/i }                         │
│       ]                                              │
│     }                                                │
│                                                      │
│  3. Execute Queries (Parallel)                      │
│     Promise.all([                                   │
│       User.find(query)                              │
│         .select('-password -tokens...')             │
│         .sort({ createdAt: -1 })                   │
│         .skip(5)                                    │
│         .limit(5)                                   │
│         .lean(),                                    │
│       User.countDocuments(query)                   │
│     ])                                              │
│                                                      │
│  4. Calculate Pagination                            │
│     - total = 12 (count result)                     │
│     - totalPages = Math.ceil(12 / 5) = 3            │
│     - hasNext = page < totalPages = true            │
│     - hasPrev = page > 1 = true                     │
│                                                      │
│  5. Return Response                                  │
│     {                                                │
│       success: true,                                │
│       data: {                                        │
│         users: [...5 users...],                     │
│         pagination: {                                │
│           page: 2,                                   │
│           limit: 5,                                  │
│           total: 12,                                 │
│           totalPages: 3,                             │
│           hasNext: true,                             │
│           hasPrev: true                              │
│         }                                            │
│       }                                              │
│     }                                                │
└─────────────────────────────────────────────────────┘
```

---

## Seguridad - Campos Sensibles

```
┌─────────────────────────────────────────────────────┐
│  Mongoose Schema (User.js)                          │
│                                                      │
│  Fields with select: false                          │
│  - password           (NEVER return)                │
│  - googleId           (NEVER return)                │
│  - verificationToken  (NEVER return)                │
│  - resetPasswordToken (NEVER return)                │
│  - verificationTokenExpires (NEVER return)          │
│  - resetPasswordExpires (NEVER return)              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Controller Query                                    │
│                                                      │
│  User.find(query)                                   │
│    .select('-password -verificationToken ...')      │
│                                                      │
│  DOUBLE PROTECTION:                                 │
│  1. Schema level (select: false)                    │
│  2. Query level (.select('-field'))                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Schema Transformation                              │
│                                                      │
│  userSchema.set('toJSON', {                         │
│    transform: (doc, ret) => {                       │
│      delete ret.password;                           │
│      delete ret.verificationToken;                  │
│      delete ret.resetPasswordToken;                 │
│      // ...                                          │
│      return ret;                                     │
│    }                                                 │
│  })                                                  │
│                                                      │
│  TRIPLE PROTECTION:                                 │
│  3. Transform on JSON serialization                 │
└─────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Controller throws error
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  try-catch block                                     │
│                                                      │
│  catch (error) {                                    │
│    console.error('❌ Error in controller:', error); │
│                                                      │
│    // Specific error handling                       │
│    if (error.name === 'ValidationError') {          │
│      return 400 with validation errors              │
│    }                                                 │
│                                                      │
│    if (error.name === 'CastError') {                │
│      return 400 with "Invalid ID"                   │
│    }                                                 │
│                                                      │
│    // Generic error                                  │
│    return 500 {                                     │
│      success: false,                                │
│      message: "Error message",                      │
│      code: "ERROR_CODE",                            │
│      error: NODE_ENV === 'dev' ? error.message : undefined │
│    }                                                 │
│  }                                                   │
└─────────────────────────────────────────────────────┘
```

---

## Database Indices Strategy

```
┌─────────────────────────────────────────────────────┐
│  User Schema Indices                                 │
│                                                      │
│  1. email (unique)                                  │
│     - Primary lookup for auth                       │
│     - Ensures uniqueness                            │
│                                                      │
│  2. role                                             │
│     - Filter by user/admin                          │
│     - Used in queries                               │
│                                                      │
│  3. isActive                                         │
│     - Filter active/inactive users                  │
│     - Common in queries                             │
│                                                      │
│  4. isVerified                                       │
│     - Filter verified users                         │
│     - Analytics queries                             │
│                                                      │
│  5. city                                             │
│     - Location-based queries                        │
│     - User search                                   │
│                                                      │
│  6. { city: 1, isActive: 1 } (compound)             │
│     - Optimized for city + active queries           │
│     - Common use case                               │
└─────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

1. **Lean Queries**: `.lean()` para mejor performance (no hydrate Mongoose docs)
2. **Parallel Queries**: `Promise.all()` para find + count simultáneos
3. **Field Selection**: Solo campos necesarios (excluir sensibles)
4. **Indices**: Campos comunes indexados
5. **Paginación**: Límite máximo de 100 documentos por request
6. **Case-Insensitive Search**: Indices con collation o regex optimizado

---

## Deployment Checklist

- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET seguro y aleatorio
- [ ] MongoDB connection string actualizada
- [ ] CORS configurado apropiadamente
- [ ] Rate limiting en producción
- [ ] Logs de producción configurados
- [ ] Error tracking (Sentry, etc.)
- [ ] Backups de base de datos configurados
- [ ] SSL/TLS en producción
- [ ] Helmet.js para security headers
