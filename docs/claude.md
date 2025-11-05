# CLAUDE.md - Entre Amigas Development Rules

**Version:** 1.0  
**Last Updated:** 2025-11-05  
**Current Sprint:** Sprint 1  
**Sprint Goal:** Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora

---

## 🎯 CURRENT SPRINT CONTEXT (Updated each sprint)

### Sprint Information

- **Sprint Number:** 1
- **Sprint Goal:** Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora que explica el proyecto
- **Sprint Duration:** [Fecha Inicio] a [Fecha Inicio + 2 semanas]
- **Days Remaining:** 10 días
- **Current Day:** Día 1 de 10

### Active User Stories

1. **US-001:** Sistema de Autenticación Completo - 8 SP - Status: Sin Empezar
2. **US-002:** Landing Page Pública - 5 SP - Status: Sin Empezar

### Next Priority Tasks

**P0 - CRÍTICO (Hacer primero en orden):**

1. **[TASK-001]** Crear modelo User en Mongoose

   - Priority: P0
   - Estimated: 45 min
   - Files: `backend/src/models/User.js`

2. **[TASK-002]** Configurar servicio de email con Resend

   - Priority: P0
   - Estimated: 30 min
   - Files: `backend/src/config/email.js`, `backend/src/services/email.service.js`

3. **[TASK-003]** Crear servicio de tokens JWT
   - Priority: P0
   - Estimated: 30 min
   - Files: `backend/src/services/token.service.js`

### Sprint Health

- Progress: 0% complete (Día 1)
- Status: 🟢 On Track
- Blockers: 0 active
- Total Tasks: 47 tareas
- Estimated Hours: 52-60 hrs

---

## 🚀 MANDATORY WORKFLOW

### START OF EVERY SESSION

**CRITICAL: Read files in this EXACT order:**

1. **CLAUDE.md** (this file - you're reading it now ✅)
2. **ARCHITECTURE.md** - Technical setup and conventions
3. **TASKS.md** - Find next P0 task to work on
4. **Sprint Planning** - Current sprint context

**Then announce your work plan:**

```
📋 Archivos cargados exitosamente.

Sprint Actual: Sprint 1 - Autenticación + Landing Page
Próxima Tarea: [TASK-XXX] - [Título]
Prioridad: P0/P1/P2
Tiempo Estimado: X minutos/horas
Archivos a modificar: [Lista]

Comenzando trabajo...
```

### DURING DEVELOPMENT

#### Before Writing ANY Code

1. **Verify you're working on correct task:**

   - Is it the next P0 task from TASKS.md?
   - Or explicitly requested by user?
   - Never skip P0 to work on P1/P2

2. **Announce what you'll do:**

```
Modificando: [ruta/completa/al/archivo.ext]
Componente/Función: [nombre]
Propósito: [qué y por qué]
User Story: US-XX
Tarea: [TASK-XXX]
```

3. **Check constraints:**
   - Does it follow ARCHITECTURE.md conventions?
   - Does it respect folder structure?
   - Does it use correct naming (camelCase, PascalCase)?
   - Security considerations addressed?
   - Commits in Spanish?

#### While Coding

**ALWAYS:**

- Use try-catch for async operations
- Validate and sanitize ALL inputs (frontend + backend)
- Check for null/undefined before accessing properties
- Follow exact conventions from ARCHITECTURE.md
- Add inline comments for complex logic IN SPANISH
- Use environment variables for all config (.env)
- Implement proper error handling
- Follow API response format (see below)
- Hash passwords with bcrypt (NEVER plain text)
- Use express-validator for backend validation
- Use React Hook Form + Yup for frontend validation
- All user-facing text in Spanish

**NEVER:**

- Skip error handling
- Use console.log in production code (use logger if needed)
- Hardcode credentials, API keys, or secrets
- Delete code without commenting why
- Ignore ESLint/Prettier errors
- Work outside current task scope
- Add npm packages without mentioning it
- Store passwords in plain text
- Skip input validation
- Mix languages (código en inglés, mensajes en español)

#### After Each Change

1. **Test immediately:**

   - Run the code (npm run dev)
   - Verify expected behavior
   - Check console for errors
   - Test edge cases
   - Verify in browser/Postman

2. **If error occurs:**
   - STOP
   - Copy EXACT error message
   - Note file and line number
   - Attempt to fix
   - If can't fix in 10 minutes → mark task as blocked

### END OF SESSION OR TASK COMPLETION

#### When Task is Complete

1. **Update TASKS.md immediately:**

```markdown
- ✅ [2025-11-05 14:30] [TASK-XXX] [US-XX] Descripción de tarea - Actual: 45min
  - Notas: [Detalles importantes de implementación]
```

2. **Move completed task to "Tareas Completadas" section in TASKS.md**

3. **Announce completion:**

```
✅ Tarea [TASK-XXX] completada

Qué se hizo:
- [Cambio 1]
- [Cambio 2]

Archivos modificados:
- [archivo1]
- [archivo2]

Testing: [Qué se probó]
Listo para: [Próxima tarea o revisión]
```

#### Session Summary

At end of work session, provide:

```
📊 Resumen de Sesión

Duración: X horas
Tareas Completadas: [Número]
- [TASK-XXX]: [Breve descripción]
- [TASK-YYY]: [Breve descripción]

Tareas En Progreso: [Número]
- [TASK-ZZZ]: X% completo - Siguiente: [Qué se necesita]

Bloqueadores Encontrados: [Número]
- [Descripción si hay]

Prioridad Próxima Sesión:
1. [Tarea con la que empezar]
2. [Tarea después]

Progreso del Sprint: 0% → X% (incrementó Z%)
```

---

## 💻 TECHNICAL STANDARDS

### Technology Stack

**CRITICAL: Use ONLY these technologies**

#### Frontend

- **Framework:** React 18.3.1
- **Language:** JavaScript (ES2022+)
- **Build Tool:** Vite 5.4.x
- **UI Library:** TailwindCSS 3.4.x
- **State Management:** React Context API
- **HTTP Client:** Axios 1.7.x
- **Router:** React Router DOM 6.26.x
- **Form Handling:** React Hook Form 7.53.x
- **Form Validation:** Yup 1.4.x
- **Icons:** Lucide React 0.445.x
- **Date Handling:** date-fns 3.6.x

#### Backend

- **Runtime:** Node.js 20.x LTS
- **Framework:** Express.js 4.19.x
- **Language:** JavaScript (ES2022+ with CommonJS)
- **Database:** MongoDB 7.0.x
- **ODM:** Mongoose 8.6.x
- **Authentication:** jsonwebtoken 9.0.x + bcryptjs 2.4.x
- **Validation:** express-validator 7.2.x
- **File Upload:** Multer 1.4.x + Cloudinary SDK
- **Email Service:** @resend/node 4.0.x
- **Security:** helmet 7.x, cors 2.8.x, express-rate-limit 7.x
- **Environment:** dotenv 16.4.x

### File Structure

**CRITICAL: Follow this structure exactly**

```
entre-amigas/
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── context/
│   │   │   │   ├── services/
│   │   │   │   └── pages/
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── business/
│   │   │   ├── services/
│   │   │   ├── blog/
│   │   │   ├── admin/
│   │   │   ├── landing/
│   │   │   └── profile/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── layout/
│   │   │   │   └── common/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── routes/
│   │   ├── assets/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │   └── server.js
│   └── package.json
│
└── docs/
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── BACKLOG.md
    └── sprints/
        └── sprint-1/
            ├── planning.md
            └── tasks.md
```

### Naming Conventions

**CRITICAL: Follow these naming rules**

#### Components & Files

```javascript
// Components: PascalCase
LoginForm.jsx
EventCard.jsx
DashboardPage.jsx

// Functions & Variables: camelCase
const getUserData = async (userId) => { ... }
const isAuthenticated = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000/api/v1';
const MAX_FILE_SIZE = 5242880;

// Hooks: camelCase con prefijo 'use'
const useAuth = () => { ... }
const useForm = () => { ... }

// Context: PascalCase con sufijo 'Context'
const AuthContext = createContext();

// Services: camelCase con sufijo 'Service'
const authService = { login, register, logout };

// Boolean variables: is/has/should prefixes
const isLoading = false;
const hasPermission = true;
const shouldRender = false;
```

#### Backend

```javascript
// Models: PascalCase singular
const User = mongoose.model("User", userSchema);
const Event = mongoose.model("Event", eventSchema);

// Controllers: camelCase
const authController = { register, login, logout };

// Routes: kebab-case en archivos
auth.routes.js;
events.routes.js;

// Middleware: camelCase con sufijo .middleware.js
authMiddleware;
validateMiddleware;
```

### API Response Format

**CRITICAL: ALL API responses must follow this format**

```javascript
// Success Response
{
  "success": true,
  "data": {
    // actual data here
  },
  "message": "Operación exitosa" // Mensaje en español
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación", // Mensaje en español
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}

// Paginated Response
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

### Git Commit Convention

**CRITICAL: Commits en ESPAÑOL usando Conventional Commits**

```bash
# Formato: <tipo>: <descripción corta>

# Tipos principales:
feat: agregar funcionalidad de registro de usuarios
fix: corregir validación de email en formulario
docs: actualizar README con instrucciones
style: formatear código con prettier
refactor: reorganizar estructura de auth
test: agregar tests para login
chore: actualizar dependencias
perf: optimizar consulta de eventos

# Ejemplos buenos:
feat: implementar sistema de autenticación JWT
fix: corregir envío de email de verificación
refactor: simplificar lógica de validación
docs: documentar API de eventos
```

### Code Style

**JavaScript/React:**

```javascript
// Use const/let, never var
const user = { name: 'María' };
let count = 0;

// Arrow functions preferidas
const handleClick = () => { ... };

// Destructuring
const { email, password } = req.body;
const { user, isLoading } = useAuth();

// Template literals
const message = `Bienvenida ${user.preferredName}`;

// Optional chaining
const userName = user?.profile?.name;

// Nullish coalescing
const title = post.title ?? 'Sin título';

// Async/await sobre promises
const data = await fetchData();

// Try-catch siempre con async
try {
  const result = await operation();
} catch (error) {
  console.error('Error:', error);
}
```

---

## 🚫 FORBIDDEN ACTIONS

**NEVER DO THESE - NO EXCEPTIONS:**

1. **Skip Error Handling**

   - Every async function needs try-catch
   - Every API call needs error handling
   - Every form needs validation

2. **Hardcode Sensitive Data**

   - No API keys in code
   - No passwords in code
   - No URLs hardcoded (use .env)

3. **Ignore Security**

   - Always validate inputs
   - Always sanitize data
   - Always use HTTPS in production
   - Always hash passwords

4. **Break Folder Structure**

   - Files must go in correct feature folder
   - Follow ARCHITECTURE.md structure exactly

5. **Work Outside Task Scope**

   - Only code what's in current TASK
   - Don't "improve" other code while working
   - Don't add features not in task

6. **Skip Testing**

   - Test every change manually
   - Verify all acceptance criteria
   - Check for regressions

7. **Poor Communication**

   - Don't work silently
   - Always announce what you're doing
   - Always report blockers

8. **Add Dependencies Without Notice**
   - Must announce any npm install
   - Explain why the package is needed
   - Check for lighter alternatives first

---

## ✅ REQUIRED ACTIONS

**ALWAYS DO THESE:**

1. **Read Context First**

   - CLAUDE.md → ARCHITECTURE.md → TASKS.md
   - Every session, every time

2. **Follow Priority Order**

   - P0 tasks ALWAYS first
   - Finish P0 before moving to P1
   - Never skip ahead

3. **Update TASKS.md**

   - After every completion
   - When blocking occurs
   - When starting new task

4. **Test Everything**

   - Manual testing required
   - Check all acceptance criteria
   - Verify edge cases

5. **Handle Errors**

   - try-catch for async
   - Meaningful error messages in Spanish
   - Log errors appropriately

6. **Validate Inputs**

   - Frontend: React Hook Form + Yup
   - Backend: express-validator
   - Both sides always

7. **Follow Conventions**

   - Naming from ARCHITECTURE.md
   - Code style from ARCHITECTURE.md
   - Git commits in Spanish

8. **Communicate Clearly**
   - Announce actions
   - Report progress
   - Explain decisions

---

## 🎯 TASK PRIORITY SYSTEM

### Priority Levels

**P0 - CRÍTICO (Always First)**

- Blockers para otras tareas
- Setup necesario
- Dependencias críticas
- Bugs de producción

**Current P0 Tasks:**

1. TASK-001: Crear modelo User
2. TASK-002: Configurar email service
3. TASK-003: Crear servicio JWT
4. TASK-004: Crear auth middleware
5. TASK-005: Crear AuthContext
6. TASK-006: Configurar axios interceptor

**P1 - IMPORTANTE (After All P0)**

- Core features del Sprint Goal
- Funcionalidades principales
- Tasks que desbloquean otras

**P2 - NICE TO HAVE (Only If No P0/P1)**

- Testing
- Refactoring
- Documentation
- Polish/UI improvements

### Working Order

```
1. Check TASKS.md for next P0 task
2. Complete ALL P0 tasks before P1
3. Complete ALL P1 tasks before P2
4. Never skip priorities
```

---

## 🐛 ERROR HANDLING PROTOCOL

### Backend Error Handling Pattern

```javascript
// Controller Pattern
const register = async (req, res) => {
  try {
    // Validar datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Error de validación",
          details: errors.array(),
        },
      });
    }

    // Lógica de negocio
    const user = await User.create(req.body);

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      data: { user },
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Error interno del servidor",
      },
    });
  }
};
```

### Frontend Error Handling Pattern

```javascript
// Service Pattern
const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error del servidor
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // No hay respuesta
      throw new Error("No se pudo conectar con el servidor");
    } else {
      // Error al configurar request
      throw new Error("Error al enviar la solicitud");
    }
  }
};

// Component Pattern
const handleSubmit = async (data) => {
  try {
    setIsLoading(true);
    await authService.register(data);
    setSuccess("Registro exitoso. Revisa tu email.");
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📋 QUALITY CHECKLIST

**Before marking ANY task as complete:**

### Code Quality

- [ ] Code follows naming conventions
- [ ] No console.log in production code
- [ ] No hardcoded values (use .env)
- [ ] Proper error handling implemented
- [ ] Input validation on both sides (if applicable)
- [ ] Comments added for complex logic (in Spanish)
- [ ] No ESLint/Prettier errors

### Functionality

- [ ] Feature works as expected
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] Error cases handled
- [ ] Loading states implemented (if applicable)
- [ ] Success/error messages clear (in Spanish)

### Security

- [ ] No sensitive data exposed
- [ ] Inputs validated and sanitized
- [ ] Authentication/authorization checked (if applicable)
- [ ] Passwords hashed (never plain text)
- [ ] CORS configured properly
- [ ] Rate limiting considered

### Testing

- [ ] Manually tested in browser/Postman
- [ ] Tested happy path
- [ ] Tested error cases
- [ ] Tested edge cases
- [ ] No regressions introduced
- [ ] Responsive tested (mobile + desktop if frontend)

### Documentation

- [ ] TASKS.md updated with completion
- [ ] Comments added where needed
- [ ] API endpoints documented (if new)
- [ ] Complex logic explained

---

## 🔐 SECURITY STANDARDS

**CRITICAL SECURITY RULES:**

### Authentication & Authorization

- Use JWT tokens with 7-day expiration
- Store tokens in localStorage (frontend)
- Include token in Authorization header: `Bearer <token>`
- Verify token in auth middleware on protected routes
- Hash passwords with bcrypt (salt rounds: 10)
- Never store plain text passwords

### Input Validation

**Backend (express-validator):**

```javascript
const registerValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password mínimo 8 caracteres"),
  body("fullName").trim().notEmpty().withMessage("Nombre requerido"),
];
```

**Frontend (Yup):**

```javascript
const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .required("Password requerido"),
});
```

### Environment Variables

**NEVER commit these files:**

- `.env`
- `.env.local`
- `.env.production`

**Always use .env.example as template**

**Critical variables:**

```bash
# Backend
JWT_SECRET=minimum_32_characters_random_string
MONGODB_URI=mongodb+srv://...
RESEND_API_KEY=re_...
CLOUDINARY_API_KEY=...

# Frontend
VITE_API_URL=http://localhost:5000/api/v1
```

### API Security

- Rate limiting: 100 requests/15min per IP
- CORS: Only allowed origins
- Helmet for security headers
- Sanitize all inputs (prevent XSS, SQL injection)
- No sensitive data in responses
- HTTPS in production (HTTP in dev OK)

### Data Protection

- Hash passwords before saving
- Don't log sensitive data
- Sanitize user inputs
- Validate file uploads (type, size)
- Use parameterized queries (Mongoose does this)

---

## 📝 COMMON CODE PATTERNS

### Model Pattern (Mongoose)

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
  },
  {
    timestamps: true, // createdAt, updatedAt automáticos
  }
);

// Índices
userSchema.index({ email: 1 });

// Hook: Hash password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método de instancia
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

### Controller Pattern

```javascript
const register = async (req, res) => {
  try {
    // 1. Validar
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Error de validación",
          details: errors.array(),
        },
      });
    }

    // 2. Lógica de negocio
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "USER_EXISTS",
          message: "El email ya está registrado",
        },
      });
    }

    const user = await User.create({ fullName, email, password });

    // 3. Respuesta exitosa
    return res.status(201).json({
      success: true,
      data: { user },
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Error interno del servidor",
      },
    });
  }
};
```

### React Component Pattern

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().min(8, "Mínimo 8 caracteres").required("Requerido"),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      await authService.login(data);
      // Redirect or update state
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};
```

### Service Pattern (Frontend)

```javascript
import api from "../shared/utils/api";

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message || "Error al registrar"
      );
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message || "Error al iniciar sesión"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authService;
```

---

## 🎯 SPRINT COMMITMENT

**Sprint Goal:**

> Usuarias pueden registrarse, verificar su email, hacer login y ver una landing page acogedora que explica el proyecto

**To achieve this goal, we must complete:**

1. **US-001:** Sistema de Autenticación Completo (8 SP) - CRÍTICO
2. **US-002:** Landing Page Pública (5 SP) - CRÍTICO

**Current progress toward goal:** 0% (Día 1)

**Days remaining:** 10 días

**Blockers to goal:** Ninguno

**Critical path:**

1. Backend auth must be done first (US-001 tasks 1-14)
2. Frontend auth depends on backend (US-001 tasks 15-26)
3. Landing page can be done in parallel after content prep (US-002)

---

## 📚 QUICK REFERENCE

### File Reading Order (Every Session)

1. **CLAUDE.md** (this file)
2. **ARCHITECTURE.md**
3. **TASKS.md**
4. **Sprint Planning**
5. **Latest Progress**

### Priority Order (STRICT)

1. **P0 (Critical)** - ALWAYS first, no exceptions
2. **P1 (Important)** - After ALL P0 complete
3. **P2 (Nice to have)** - Only if NO P0/P1 remain

### Update Requirements

- ✅ TASKS.md after EVERY task completion
- ✅ Session summary at end of work
- ✅ Blockers IMMEDIATELY when discovered
- ✅ Progress notes daily

### Quality Gates

- All items in Quality Checklist ✅
- Code tested and working
- Conventions followed exactly
- Documentation/comments updated

---

## 🔄 DOCUMENT UPDATES

**This document is updated:**

- At start of each new sprint (Sprint context section)
- When ARCHITECTURE.md changes (Technical standards)
- When project-specific rules change
- When major blockers or learnings occur

**Last Sprint Update:** Sprint 1 - 2025-11-05  
**Next Scheduled Update:** Sprint 2 - [Fecha + 2 semanas]

---

## 🆘 WHEN STUCK PROTOCOL

### First 10 Minutes

- Re-read error message carefully
- Check ARCHITECTURE.md for similar patterns
- Review similar working code in project
- Google the exact error message
- Try obvious fixes (restart server, clear cache)

### After 10 Minutes (Still Stuck)

```
🤔 INVESTIGANDO BLOQUEADOR

Tarea: [TASK-XXX]
Issue: [Descripción clara del problema]
Tiempo invertido: 10 minutos

Intenté:
1. [Fix 1 - resultado]
2. [Fix 2 - resultado]
3. [Fix 3 - resultado]

Error exacto: [Mensaje de error completo]

Siguiente: [Qué intentaré ahora]
```

### After 20 Minutes (Can't Resolve)

```
🚧 MARCANDO COMO BLOQUEADA

Tarea [TASK-XXX] está bloqueada.
Razón: [Explicación clara]
Impacto: [Qué no se puede hacer]

Moviéndome a: [TASK-YYY] (próxima tarea P1)

Acción necesaria del usuario: [Qué debe investigar el usuario]
```

**Update TASKS.md:**

```markdown
⏸️ [TASK-XXX] [US-XX] Descripción - P1 - M (1hr)

- **Bloqueada por:** [Razón específica]
- **Intentado:** [Qué se intentó]
- **Necesita:** [Qué se necesita para desbloquear]
- **Acción:** [Próximo paso]
- **Fecha Bloqueada:** 2025-11-05
```

---

## 📈 SUCCESS METRICS

**You're doing great when:**

- ✅ Completing P0 tasks in order
- ✅ TASKS.md always reflects current reality
- ✅ No errors introduced in working code
- ✅ All code follows conventions exactly
- ✅ Sprint progressing on schedule (10% per day)
- ✅ All completions tested manually
- ✅ Communication is clear and frequent
- ✅ Commits in Spanish with good messages
- ✅ Security standards maintained

**Signs you need to adjust:**

- ⚠️ P0 tasks skipped for P1/P2
- ⚠️ TASKS.md not updated after completions
- ⚠️ Bugs being introduced
- ⚠️ Sprint falling behind schedule
- ⚠️ Convention violations
- ⚠️ Skipping testing
- ⚠️ Working silently without communication
- ⚠️ English commits or messages

---

## 💬 COMMUNICATION STYLE

### Good Communication (Examples)

```
✅ "Implementando autenticación de usuarios en backend/src/controllers/auth.controller.js"
✅ "Error específico: Cannot read property 'id' of undefined en línea 45 de User.js"
✅ "Agregué validación null check antes de acceder a user.id"
✅ "Completadas 3 tareas (TASK-001, 002, 003), 2 en progreso (TASK-004, 005)"
✅ "Bloqueador: Resend API key no funciona. Necesito nueva key del usuario."
```

### Poor Communication (Avoid)

```
❌ "Trabajando en cosas"
❌ "Hay un error en algún lado"
❌ "Lo arreglé"
❌ "Listo"
❌ "No funciona"
```

**Always be:**

- **Específico** sobre qué estás haciendo
- **Claro** sobre problemas encontrados
- **Honesto** sobre progreso y bloqueadores
- **Proactivo** haciendo preguntas de clarificación
- **Detallado** en anuncios y resúmenes

---

## 🎓 LEARNING MODE

### When Working with New Technology

If you encounter a library/pattern you're not familiar with:

1. **Acknowledge:**

```
📚 NUEVO TERRITORIO

Trabajando con: [Tecnología/Patrón]
Nivel de confianza: Bajo/Medio/Alto

Plan: [Enfoque que tomaré]
```

2. **Research approach:**

   - Check official documentation first
   - Look for patterns in existing project code
   - Start with simplest implementation
   - Test thoroughly before expanding
   - Ask for clarification if really uncertain

3. **Document learnings:**
   - Add comment explaining the implementation
   - Note any gotchas discovered
   - Reference documentation links in comments

Example:

```javascript
// Using React Hook Form con Yup para validación
// Docs: https://react-hook-form.com/get-started
// NOTA: resolver debe ser yupResolver, no validationSchema
const { register, handleSubmit } = useForm({
  resolver: yupResolver(schema),
});
```

---

## ⚡ TL;DR - CRITICAL RULES

**If you remember ONLY these 10 rules:**

1. 📖 **Read CLAUDE.md, ARCHITECTURE.md, TASKS.md at every session start**
2. 🔴 **P0 tasks ALWAYS come first - never skip**
3. ✍️ **Update TASKS.md after EVERY completion**
4. 🎯 **Stay focused on Sprint Goal**
5. 🏗️ **Follow ARCHITECTURE.md conventions exactly**
6. 🧪 **Test everything before marking complete**
7. 🚫 **Never skip error handling**
8. 💬 **Communicate clearly and specifically**
9. ⏸️ **Mark blockers immediately after 20min stuck**
10. ✅ **Complete Quality Checklist before task done**

---

## 📞 PROJECT-SPECIFIC RULES

### Critical Business Rules

1. **Email Verification Required:**

   - Users must verify email before login
   - isVerified flag must be true
   - Verification token expires in 24 hours

2. **Password Requirements:**

   - Minimum 8 characters
   - Must be hashed with bcrypt (never plain text)
   - Salt rounds: 10

3. **JWT Token:**

   - Expiration: 7 days
   - Stored in localStorage (frontend)
   - Included in Authorization header: Bearer <token>

4. **User Roles:**

   - 'user' (default)
   - 'admin' (manual assignment only)

5. **Spanish Language:**
   - ALL user-facing text in Spanish
   - Error messages in Spanish
   - Success messages in Spanish
   - Email templates in Spanish

### External Services Configuration

**MongoDB Atlas:**

- Connection string in MONGODB_URI env variable
- Database: entreamigas-dev (development)
- Collections: users, events, businesses, services, blogposts, eventregistrations

**Resend (Email Service):**

- API key in RESEND_API_KEY env variable
- From: noreply@entreamigas.com
- Templates needed: welcome, verification, password-reset, event-confirmation

**Cloudinary (Images):**

- Cloud name, API key, API secret in env variables
- Folder: entre-amigas/
- Max file size: 5MB
- Allowed formats: jpg, jpeg, png, webp

### Areas of Code That Are Delicate

**NONE YET** - This is Sprint 1, everything is new

As project grows, delicate areas will be documented here.

### Development Preferences

- **Commits:** After each completed task
- **Testing:** Manual testing required for every task
- **Documentation:** Inline comments for complex logic only
- **Console.log:** Remove before marking task complete
- **Code review:** Self-review before marking complete

---

## 📊 CURRENT SPRINT STATUS

**Sprint 1 Progress Tracker**

```
Week 1 (Days 1-5):
- Target: 50% complete (US-001 done)
- Current: 0% (Día 1)
- On track: 🟢 Yes

Week 2 (Days 6-10):
- Target: 100% complete (US-002 done + polish)
- Current: 0%
- On track: ⏳ TBD
```

**Daily Targets:**

- Día 1-2: Backend auth setup (TASK-001 to TASK-004)
- Día 3-4: Backend auth controllers (TASK-007 to TASK-014)
- Día 5: Frontend auth setup + forms start
- Día 6-7: Frontend auth complete + landing prep
- Día 8-9: Landing page complete
- Día 10: Testing + Sprint Review

---

**"Código de calidad, bien documentado, entregado a tiempo. Ese es el estándar."**

---

**Sprint Actual:** Sprint 1  
**Meta del Sprint:** Autenticación + Landing Page  
**Días Restantes:** 10  
**Próxima Tarea P0:** TASK-001 - Crear modelo User

---

_Este es tu fuente de verdad. Síguelo estrictamente. Cuando tengas dudas, consulta este documento._
