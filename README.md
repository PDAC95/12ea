# Entre Amigas - Plataforma Comunitaria

**Versión:** 1.0
**Sprint Actual:** Sprint 0 - Preparación de Infraestructura
**Stack:** MERN (MongoDB + Express + React + Node.js)

---

## 📋 Descripción

Entre Amigas es una plataforma web comunitaria diseñada para mujeres migrantes de habla hispana en Canadá. La plataforma centraliza eventos, directorios de negocios y servicios, blog y conexiones en un espacio seguro y estructurado.

---

## 🛠️ Stack Tecnológico

### Frontend
- React 18.3.1 + Vite 5.4.x
- TailwindCSS 3.4.x
- React Router DOM 6.26.x
- React Hook Form 7.53.x + Yup 1.4.x
- Axios 1.7.x

### Backend
- Node.js 20.x LTS + Express.js 4.19.x
- MongoDB 7.0.x + Mongoose 8.6.x
- JWT Authentication + bcryptjs
- Express-validator 7.2.x

### Servicios Externos
- MongoDB Atlas (base de datos cloud)
- AWS S3 (almacenamiento de imágenes)
- Resend (emails transaccionales)

---

## 📁 Estructura del Proyecto

```
entre-amigas/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── features/     # Módulos por funcionalidad
│   │   ├── shared/       # Componentes compartidos
│   │   ├── routes/       # Configuración de rutas
│   │   └── assets/       # Assets estáticos
│   └── package.json
│
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── models/       # Modelos Mongoose
│   │   ├── routes/       # Rutas de API
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Middlewares
│   │   ├── services/     # Servicios auxiliares
│   │   └── utils/        # Utilidades
│   └── package.json
│
└── docs/              # Documentación
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── BACKLOG.md
    └── sprints/
```

---

## 🚀 Instalación y Setup

### Prerequisitos
- Node.js 20.x LTS
- npm o yarn
- MongoDB Atlas account
- AWS S3 account
- Resend account

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/entre-amigas.git
cd entre-amigas
```

### Paso 2: Configurar variables de entorno

**Backend (.env):**
```bash
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/entreamigas-dev

# JWT
JWT_SECRET=tu_secreto_minimo_32_caracteres
JWT_EXPIRE=7d

# Email (Resend)
RESEND_API_KEY=re_tu_api_key
EMAIL_FROM=noreply@entreamigas.com

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=entre-amigas-dev

# Frontend URL
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env.local):**
```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Entre Amigas
VITE_ENV=development
```

### Paso 3: Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Paso 4: Ejecutar en desarrollo

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:5173
```

---

## 📚 Documentación

Toda la documentación del proyecto se encuentra en la carpeta `docs/`:

- **PRD.md** - Product Requirements Document
- **ARCHITECTURE.md** - Arquitectura técnica y convenciones
- **BACKLOG.md** - Product Backlog completo
- **SPRINT PLAN 1.md** - Planeación de Sprint 1
- **TASKS S1.md** - Tareas detalladas de Sprint 1
- **CLAUDE.md** - Reglas de desarrollo para Claude

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

---

## 🔒 Seguridad

- **NUNCA** commitear archivos `.env`
- Passwords hasheados con bcrypt (salt rounds: 10)
- JWT tokens con expiración de 7 días
- Validación dual: frontend (Yup) + backend (express-validator)
- Rate limiting en endpoints críticos
- HTTPS en producción

---

## 📝 Convenciones de Código

### Git Commits (en español)
```bash
feat: agregar sistema de autenticación
fix: corregir validación de email
docs: actualizar README
refactor: reorganizar estructura de carpetas
```

### Naming Conventions
- **Components:** PascalCase (LoginForm.jsx)
- **Functions/Variables:** camelCase (getUserData)
- **Constants:** UPPER_SNAKE_CASE (API_BASE_URL)
- **Booleans:** is/has/should prefixes (isLoading)

---

## 🎯 Roadmap

### Sprint 0 (Actual) - Infraestructura
- Setup de repositorio y estructura
- Configuración de servicios externos
- Inicialización de proyectos

### Sprint 1 - Autenticación + Landing Page
- Sistema de autenticación completo
- Landing page pública
- Dashboard básico

### Sprint 2 - Eventos
- Vista de eventos
- Registro a eventos
- Panel admin de eventos

### Sprint 3 - Directorios
- Directorio de negocios
- Directorio de servicios
- Búsqueda y filtros

### Sprint 4 - Blog y Polish
- Blog con artículos
- Panel admin de blog
- Testing y optimización

---

## 👥 Equipo

**Equipo Entre Amigas**
Contacto: [tu-email@example.com]

---

## 📄 Licencia

[Definir licencia del proyecto]

---

## 🆘 Troubleshooting

### MongoDB connection timeout
- Verificar IP whitelist en MongoDB Atlas
- Verificar connection string en .env

### CORS errors
- Verificar CORS_ORIGIN en backend .env
- Verificar que frontend corre en puerto correcto

### AWS S3 access denied
- Verificar IAM permissions
- Verificar bucket policy

### Emails no llegan
- Verificar API key de Resend
- Revisar carpeta de spam
- Verificar logs del servidor

---

**Última actualización:** 6 de noviembre, 2025
**Mantenido por:** Equipo Entre Amigas
