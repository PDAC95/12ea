# Sprint 2 - Detailed Tasks Breakdown

**Sprint:** 2  
**Duration:** 2 semanas  
**Goal:** Dashboard + Directorios funcionales  
**Total Story Points:** 15

---

## Task Organization

```
US-003 (Dashboard) → 5 pts → 6 tasks
US-005 (Negocios)  → 5 pts → 8 tasks
US-006 (Servicios) → 5 pts → 7 tasks
Total: 21 tasks
```

---

## 📊 US-003: Dashboard Principal de Usuaria

### Task 3.1: Layout Base del Dashboard

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Crear la estructura principal del dashboard con sidebar/navbar responsive y header.

**Acceptance Criteria:**

- [x] Layout con sidebar en desktop, navbar en móvil
- [x] Header fijo con logo y botón logout
- [x] Container principal para contenido
- [x] Responsive (colapsa sidebar en móvil)
- [x] Estructura lista para recibir componentes

**Technical Details:**

```javascript
// Estructura de archivos
frontend/src/features/dashboard/
├── DashboardLayout.jsx      // Layout principal
├── Header.jsx              // Header con logo y logout
├── Sidebar.jsx             // Sidebar desktop
├── MobileNav.jsx           // Navbar móvil
└── index.js                // Exports
```

**Implementation Steps:**

1. Crear carpeta `features/dashboard`
2. Implementar DashboardLayout con CSS Grid
3. Crear Header con logo y botón logout
4. Implementar Sidebar con navegación
5. Crear MobileNav con hamburger menu
6. Configurar responsive breakpoints
7. Testing en móvil y desktop

**Dependencies:**

- React Router configurado
- TailwindCSS instalado

---

### Task 3.2: Sección de Bienvenida Personalizada

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Mostrar mensaje de bienvenida con el nombre preferido del usuario.

**Acceptance Criteria:**

- [x] Obtiene nombre del usuario desde auth context
- [x] Muestra "¡Hola, [nombre]!"
- [x] Diseño acogedor con gradiente suave
- [x] Responsive

**Technical Details:**

```javascript
// WelcomeSection.jsx
- Usar useContext para obtener user data
- Fallback si no hay nombre: "¡Hola!"
- Gradient background con TailwindCSS
```

**Implementation Steps:**

1. Crear WelcomeSection.jsx
2. Obtener usuario desde AuthContext
3. Diseñar con gradiente y tipografía grande
4. Testing con diferentes nombres

**Dependencies:**

- Task 3.1 completado
- AuthContext disponible

---

### Task 3.3: Cards de Navegación Principal

**Estimated:** 3 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
5 cards clickeables para navegar a secciones principales.

**Acceptance Criteria:**

- [x] 5 cards: Eventos, Negocios, Servicios, Blog, Perfil
- [x] Cada card tiene: icono, título, descripción breve
- [x] Hover effects suaves
- [x] Click navega a ruta correspondiente
- [x] Grid responsive (3 cols desktop, 2 cols tablet, 1 col móvil)

**Technical Details:**

```javascript
// NavigationCards.jsx
const cards = [
  {
    title: "Eventos",
    icon: "Calendar",
    description: "Encuentra actividades comunitarias",
    path: "/dashboard/events",
    color: "from-purple-400 to-pink-400",
  },
  // ... más cards
];
```

**Implementation Steps:**

1. Crear NavigationCards.jsx
2. Definir array de cards con data
3. Crear NavigationCard component individual
4. Implementar grid con TailwindCSS
5. Agregar iconos de Lucide React
6. Implementar hover effects (scale, shadow)
7. Conectar con React Router

**Dependencies:**

- Task 3.1 completado
- Lucide React instalado

---

### Task 3.4: Preview de Próximos Eventos

**Estimated:** 2 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Mostrar los próximos 3 eventos en formato de timeline o cards.

**Acceptance Criteria:**

- [x] Muestra 3 eventos próximos (mock data por ahora)
- [x] Cada evento: imagen, título, fecha, modalidad (virtual/presencial)
- [x] Diseño tipo timeline horizontal o cards
- [x] Link "Ver todos los eventos"
- [x] Responsive

**Technical Details:**

```javascript
// EventsPreview.jsx
const mockEvents = [
  {
    id: 1,
    title: "Taller de Finanzas Personales",
    date: "2025-11-20",
    time: "18:00",
    mode: "virtual",
    image: "/placeholder-event.jpg",
  },
  // ... 2 más
];
```

**Implementation Steps:**

1. Crear EventsPreview.jsx
2. Definir mock data de eventos
3. Diseñar layout (timeline o cards horizontales)
4. Agregar imágenes placeholder
5. Formatear fechas con date-fns o similar
6. Implementar link "Ver todos"
7. Testing responsive

**Dependencies:**

- Task 3.1 completado

---

### Task 3.5: Protected Route Setup

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Implementar lógica de rutas protegidas que requieren autenticación.

**Acceptance Criteria:**

- [x] Verifica JWT en localStorage
- [x] Redirect a /login si no hay token o es inválido
- [x] Permite acceso si token es válido
- [x] Funciona para todas las rutas de dashboard

**Technical Details:**

```javascript
// shared/components/ProtectedRoute.jsx
- Verificar token en localStorage
- Decodificar y verificar expiración
- Redirect con <Navigate to="/login" />
```

**Implementation Steps:**

1. Crear ProtectedRoute.jsx en shared/components
2. Implementar verificación de token
3. Agregar redirect si no autenticado
4. Envolver rutas del dashboard en App.jsx
5. Testing: intentar acceder sin login

**Dependencies:**

- Sistema de auth (US-001) funcionando
- React Router configurado

---

### Task 3.6: Responsive & Polish Final

**Estimated:** 2 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Refinar diseño responsive y ajustes finales de UI.

**Acceptance Criteria:**

- [x] Funciona perfecto en móvil (< 768px)
- [x] Funciona perfecto en tablet (768-1024px)
- [x] Funciona perfecto en desktop (> 1024px)
- [x] Espaciados consistentes
- [x] Colores y tipografía refinados
- [x] Sin bugs visuales

**Implementation Steps:**

1. Testing en Chrome DevTools (responsive mode)
2. Ajustar breakpoints si necesario
3. Verificar que sidebar colapsa correctamente
4. Revisar espaciados y padding
5. Pulir hover states y transiciones
6. Testing en dispositivo real (móvil)
7. Fixes finales

**Dependencies:**

- Tasks 3.1 a 3.5 completados

---

## 🏢 US-005: Directorio de Negocios

### Task 5.1: Backend - Modelo Business

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Backend + DB
**Status:** ✅ Done

**Descripción:**
Crear schema de Mongoose para negocios.

**Acceptance Criteria:**

- [x] Schema definido con todos los campos requeridos
- [x] Validaciones básicas implementadas
- [x] Índices para búsqueda de texto
- [x] Timestamps automáticos

**Technical Details:**

```javascript
// backend/src/models/Business.js
const businessSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    city: { type: String, required: true },
    website: { type: String },
    logo: { type: String, default: "https://placeholder.url" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index para búsqueda
businessSchema.index({ name: "text", description: "text" });
```

**Implementation Steps:**

1. Crear archivo Business.js en models/
2. Definir schema con campos
3. Agregar validaciones
4. Crear índice de texto
5. Exportar modelo
6. Testing: crear un negocio manualmente en MongoDB

**Dependencies:**

- MongoDB conectado

---

### Task 5.2: Backend - Endpoints API

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Done

**Descripción:**
Crear endpoints para listar y obtener detalles de negocios.

**Acceptance Criteria:**

- [x] GET /api/business - Lista con paginación
- [x] GET /api/business/:id - Detalle individual
- [x] Query params: search, category, city, page, limit
- [x] Paginación funcional (20 items default)
- [x] Text search funcional
- [x] Response en formato estándar

**Technical Details:**

```javascript
// Routes: backend/src/routes/business.js
// Controller: backend/src/controllers/businessController.js

GET /api/business?search=cafe&category=Restaurante&city=Toronto&page=1&limit=20

Response:
{
  success: true,
  data: {
    items: [...],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 45,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

**Implementation Steps:**

1. Crear businessRoutes.js
2. Crear businessController.js
3. Implementar getBusinesses() con filtros y paginación
4. Implementar getBusinessById()
5. Agregar rutas al server.js
6. Testing con Postman/Thunder Client
7. Validar response format

**Dependencies:**

- Task 5.1 completado

---

### Task 5.3: Backend - Seed Data Script

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Backend + DB
**Status:** ✅ Done

**Descripción:**
Script para poblar base de datos con negocios de ejemplo.

**Acceptance Criteria:**

- [x] Script crea 25-30 negocios variados
- [x] Mix de categorías realistas
- [x] Varias ciudades (Toronto, Vancouver, Montreal, Calgary)
- [x] Datos en español
- [x] Fácil de ejecutar

**Technical Details:**

```javascript
// backend/src/scripts/seedBusiness.js
const businesses = [
  {
    name: "La Cocina de María",
    category: "Restaurante",
    description: "Comida colombiana auténtica...",
    phone: "+1-416-555-0100",
    email: "info@cocinamaria.com",
    city: "Toronto",
    website: "https://cocinamaria.com",
    logo: "https://ui-avatars.com/api/?name=La+Cocina",
  },
  // ... más negocios
];

async function seedBusinesses() {
  await Business.deleteMany({}); // Limpiar primero
  await Business.insertMany(businesses);
  console.log("✅ Businesses seeded successfully");
}
```

**Implementation Steps:**

1. Crear carpeta scripts/
2. Crear seedBusiness.js
3. Definir array de 25-30 negocios
4. Categorías: Restaurante, Belleza, Consultoría, Ropa, Servicios del Hogar
5. Implementar función seed
6. Agregar comando en package.json
7. Ejecutar y verificar en MongoDB

**Dependencies:**

- Task 5.1 completado

---

### Task 5.4: Frontend - BusinessList Component

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Vista principal del directorio con grid de negocios.

**Acceptance Criteria:**

- [x] Grid responsive (3 cols desktop, 2 tablet, 1 móvil)
- [x] Fetch de datos desde API
- [x] Loading skeleton mientras carga
- [x] BusinessCard component para cada negocio
- [x] Error handling si falla la petición

**Technical Details:**

```javascript
// frontend/src/features/business/BusinessList.jsx
// frontend/src/features/business/BusinessCard.jsx

- useEffect para fetch inicial
- useState para businesses y loading
- Grid con TailwindCSS
- Loading skeletons (3-4 placeholders)
```

**Implementation Steps:**

1. Crear carpeta features/business/
2. Crear BusinessList.jsx
3. Crear BusinessCard.jsx
4. Implementar fetch de datos
5. Diseñar grid responsive
6. Agregar loading skeletons
7. Testing con data real

**Dependencies:**

- Task 5.2 completado (API funcionando)
- Task 3.1 completado (layout dashboard)

---

### Task 5.5: Frontend - Búsqueda y Filtros

**Estimated:** 2 horas
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Implementar barra de búsqueda y filtros por categoría y ciudad.

**Acceptance Criteria:**

- [x] Search bar con debounce (300ms)
- [x] Dropdown de categorías
- [x] Dropdown de ciudades
- [x] Botón "Limpiar filtros"
- [x] Actualiza resultados en tiempo real
- [ ] URL params se actualizan (opcional - no implementado)

**Technical Details:**

```javascript
// SearchBar.jsx, FilterDropdown.jsx

- useDebounce custom hook para search
- useState para cada filtro
- useEffect que hace fetch cuando cambian filtros
- Combinar query params en URL
```

**Implementation Steps:**

1. Crear SearchBar.jsx
2. Crear FilterDropdown.jsx reutilizable
3. Implementar useDebounce hook
4. Conectar filtros con fetch
5. Agregar botón limpiar
6. Testing: buscar "cafe" + filtrar por ciudad
7. Verificar que combina bien los filtros

**Dependencies:**

- Task 5.4 completado

---

### Task 5.6: Frontend - Vista Detallada

**Estimated:** 2 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Modal o página con información completa del negocio.

**Acceptance Criteria:**

- [x] Se abre al hacer click en card
- [x] Muestra todos los detalles del negocio
- [x] Botones de contacto: tel:, mailto: y website
- [x] Diseño limpio y scannable
- [x] Botón cerrar/volver (X + click fuera + Escape)
- [x] Responsive (fullscreen en móvil)

**Technical Details:**

```javascript
// BusinessDetail.jsx

Opción 1: Modal con librería (headlessui)
Opción 2: Página separada /business/:id

Botones de contacto:
<a href={`tel:${business.phone}`}>Llamar</a>
<a href={`mailto:${business.email}`}>Enviar email</a>
```

**Implementation Steps:**

1. Decidir: modal vs página separada (recomiendo modal)
2. Crear BusinessDetail.jsx
3. Implementar apertura desde BusinessCard
4. Diseñar layout de info completa
5. Agregar botones de contacto funcionales
6. Implementar cierre del modal
7. Testing en móvil y desktop

**Dependencies:**

- Task 5.4 completado

---

### Task 5.7: Frontend - Paginación

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Componente de paginación para navegar entre páginas.

**Acceptance Criteria:**

- [x] Muestra número de página actual
- [x] Botones Previous/Next
- [x] Deshabilita botones cuando no hay más páginas
- [ ] Actualiza URL con page param (no implementado - state management solo)
- [x] Scroll to top al cambiar página (con smooth behavior)

**Technical Details:**

```javascript
// shared/components/Pagination.jsx

Props:
- currentPage
- totalPages
- onPageChange

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(newPage) => setPage(newPage)}
/>
```

**Implementation Steps:**

1. Crear Pagination.jsx en shared/components
2. Implementar lógica de prev/next
3. Deshabilitar botones en límites
4. Agregar al BusinessList
5. Testing: navegar múltiples páginas
6. Verificar que filtros persisten entre páginas

**Dependencies:**

- Task 5.4 completado

---

### Task 5.8: Testing & Polish Final

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Testing completo y refinamiento visual.

**Acceptance Criteria:**

- [x] Búsqueda funciona correctamente
- [x] Filtros funcionan correctamente
- [x] Paginación funciona
- [x] Vista detallada funciona
- [x] Responsive en móvil y desktop
- [x] No hay errores en consola
- [x] Performance aceptable

**Implementation Steps:**

1. Testing de búsqueda con diferentes queries
2. Testing de filtros (solos y combinados)
3. Testing de paginación
4. Testing de vista detallada
5. Verificar responsive en múltiples dispositivos
6. Optimizar performance si necesario
7. Fixes finales

**Dependencies:**

- Tasks 5.4 a 5.7 completados

---

## 🏥 US-006: Directorio de Servicios

### Task 6.1: Backend - Modelo Service

**Estimated:** 45 minutos
**Priority:** HIGH
**Assignee:** Backend + DB
**Status:** ✅ Done

**Descripción:**
Schema de Mongoose para servicios (similar a Business).

**Acceptance Criteria:**

- [x] Schema definido con campos apropiados
- [x] Campo serviceType en vez de category
- [x] Validaciones y índices
- [x] Timestamps

**Technical Details:**

```javascript
// backend/src/models/Service.js
const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Salud",
        "Legal",
        "Educación",
        "Financiero",
        "Inmigración",
        "Traducción",
      ],
    },
    description: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    city: { type: String, required: true },
    website: { type: String },
    logo: { type: String, default: "https://placeholder.url" },
    credentials: { type: String }, // Opcional: certificaciones
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ name: "text", description: "text" });
```

**Implementation Steps:**

1. Copiar Business.js como base
2. Renombrar a Service.js
3. Cambiar category → serviceType
4. Agregar campo credentials (opcional)
5. Ajustar enum de tipos
6. Testing manual

**Dependencies:**

- Task 5.1 completado (para usar como referencia)

---

### Task 6.2: Backend - Endpoints API

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Backend
**Status:** ✅ Done

**Descripción:**
Endpoints para servicios (casi idénticos a Business).

**Acceptance Criteria:**

- [x] GET /api/services - Lista con filtros
- [x] GET /api/services/:id - Detalle
- [x] Misma estructura de response que /business
- [x] Paginación y búsqueda funcionales

**Technical Details:**

```javascript
// Routes: backend/src/routes/services.js
// Controller: backend/src/controllers/serviceController.js

GET /api/services?search=doctor&serviceType=Salud&city=Toronto&page=1
```

**Implementation Steps:**

1. Copiar businessRoutes.js → servicesRoutes.js
2. Copiar businessController.js → serviceController.js
3. Ajustar para modelo Service
4. Cambiar query params (serviceType vs category)
5. Agregar rutas al server.js
6. Testing con Postman

**Dependencies:**

- Task 6.1 completado

---

### Task 6.3: Backend - Seed Data Script

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Backend + DB
**Status:** ✅ Done

**Descripción:**
Poblar base de datos con servicios de ejemplo.

**Acceptance Criteria:**

- [x] 15-20 servicios variados (20 servicios creados)
- [x] Mix de tipos: Salud, Legal, Educación, etc. (8 tipos diferentes)
- [x] Múltiples ciudades (Toronto, Vancouver, Calgary, Montreal)
- [x] Datos realistas en español (credenciales profesionales, contacto completo)

**Technical Details:**

```javascript
// backend/src/scripts/seedServices.js
const services = [
  {
    name: "Dra. Ana Martínez - Medicina Familiar",
    serviceType: "Salud",
    description: "Médica familiar con 15 años de experiencia...",
    phone: "+1-416-555-0200",
    email: "contacto@dranamartinez.com",
    city: "Toronto",
    credentials: "MD, CCFP",
    logo: "https://ui-avatars.com/api/?name=Dra+Ana",
  },
  // ... más servicios
];
```

**Implementation Steps:**

1. Crear seedServices.js
2. Definir 15-20 servicios
3. Mix de tipos (médicos, abogados, contadores, traductores)
4. Implementar función seed
5. Ejecutar y verificar

**Dependencies:**

- Task 6.1 completado

---

### Task 6.4: Frontend - Refactor a DirectoryCard Genérico

**Estimated:** 1 hora
**Priority:** HIGH
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Refactorizar BusinessCard para que sea reutilizable.

**Acceptance Criteria:**

- [x] DirectoryCard funciona para Business y Service
- [x] Props flexibles (type, category vs serviceType)
- [x] Mismo diseño visual
- [x] Reutilizable en ambos directorios

**Technical Details:**

```javascript
// shared/components/DirectoryCard.jsx

<DirectoryCard
  item={business}
  type="business"
  onViewDetails={handleView}
/>

<DirectoryCard
  item={service}
  type="service"
  onViewDetails={handleView}
/>
```

**Implementation Steps:**

1. Crear DirectoryCard.jsx en shared/components
2. Hacer props genéricas
3. Refactorizar BusinessCard para usar DirectoryCard
4. Testing: verificar que negocios siguen funcionando
5. Preparar para reutilizar en servicios

**Dependencies:**

- Task 5.4 completado

---

### Task 6.5: Frontend - ServiceList Component

**Estimated:** 2 horas  
**Priority:** HIGH  
**Assignee:** Frontend  
**Status:** 🔲 To Do

**Descripción:**  
Vista del directorio de servicios (reutilizando componentes).

**Acceptance Criteria:**

- [ ] Misma estructura que BusinessList
- [ ] Usa DirectoryCard genérico
- [ ] Fetch de /api/services
- [ ] Filtros por serviceType
- [ ] Búsqueda funcional
- [ ] Loading states

**Technical Details:**

```javascript
// frontend/src/features/services/ServiceList.jsx

Similar a BusinessList pero:
- Fetch desde /api/services
- Filtro usa serviceType
- Tipos: Salud, Legal, Educación, Financiero, Inmigración, Traducción
```

**Implementation Steps:**

1. Crear carpeta features/services/
2. Copiar BusinessList.jsx como base
3. Renombrar a ServiceList.jsx
4. Ajustar endpoint a /api/services
5. Cambiar filtros a serviceTypes
6. Reutilizar DirectoryCard
7. Testing

**Dependencies:**

- Task 6.4 completado
- Task 6.2 completado (API)

---

### Task 6.6: Frontend - Vista Detallada de Servicio

**Estimated:** 1 hora
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ Done

**Descripción:**
Reutilizar modal/página de detalle para servicios.

**Acceptance Criteria:**

- [x] Reutiliza BusinessDetail o crea componente genérico
- [x] Muestra credentials si existen
- [x] Botones de contacto funcionales
- [x] Diseño consistente

**Technical Details:**

```javascript
// Opción 1: Refactorizar BusinessDetail → DirectoryDetail
// Opción 2: Crear ServiceDetail separado

Si hay credentials, mostrarlas destacadas
```

**Implementation Steps:**

1. Evaluar si refactorizar o crear nuevo componente
2. Implementar vista detallada
3. Agregar display de credentials
4. Testing con diferentes servicios
5. Verificar responsive

**Dependencies:**

- Task 6.5 completado
- Task 5.6 completado (como referencia)

---

### Task 6.7: Testing & Polish Final

**Estimated:** 1 hora  
**Priority:** MEDIUM  
**Assignee:** Frontend  
**Status:** 🔲 To Do

**Descripción:**  
Testing completo del directorio de servicios.

**Acceptance Criteria:**

- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Vista detallada funciona
- [ ] Consistencia visual con Negocios
- [ ] Responsive
- [ ] No hay errores

**Implementation Steps:**

1. Testing de búsqueda
2. Testing de filtros por serviceType
3. Testing de paginación
4. Verificar consistencia con Business directory
5. Testing responsive
6. Fixes finales
7. Code review

**Dependencies:**

- Tasks 6.4 a 6.6 completados

---

## Task Summary

### By Priority

**HIGH Priority:** 10 tasks  
**MEDIUM Priority:** 11 tasks

### By Status

- 🔲 To Do: 9 tasks
- 🟡 In Progress: 0 tasks
- ✅ Done: 12 tasks (US-003: 6/6, US-005: 3/8, US-006: 3/7)

### Estimated Time

- US-003: 11 horas
- US-005: 12 horas
- US-006: 8.75 horas
- **Total:** ~32 horas (redondeado para 2 semanas con buffer)

---

## Daily Progress Tracking

### Week 1

**Day 1:**

- [ ] Task 3.1
- [ ] Task 3.2

**Day 2:**

- [ ] Task 3.3
- [ ] Task 3.4

**Day 3:**

- [ ] Task 3.5
- [ ] Task 3.6
- [ ] US-003 ✅ Done

**Day 4:**

- [x] Task 5.1
- [x] Task 5.2
- [x] Task 5.3

**Day 5:**

- [ ] Task 5.4
- [ ] Task 5.5

**Day 6:**

- [ ] Task 5.6
- [ ] Task 5.7

**Day 7:**

- [ ] Task 5.8
- [ ] US-005 ✅ Done

### Week 2

**Day 8:**

- [x] Task 6.1
- [x] Task 6.2
- [x] Task 6.3

**Day 9:**

- [ ] Task 6.4
- [ ] Task 6.5

**Day 10:**

- [ ] Task 6.6
- [ ] Task 6.7
- [ ] US-006 ✅ Done

**Day 11-14:**

- [ ] Testing integral
- [ ] Bug fixes
- [ ] Polish y refinamiento
- [ ] Documentación
- [ ] Sprint Review prep

---

## Blockers & Notes

### Potential Blockers

- [ ] API endpoints no funcionan correctamente
- [ ] Performance issues con muchos items
- [ ] Diseño responsive tiene problemas en ciertos dispositivos

### Notes Section

_Agregar notas durante el desarrollo..._

---

## Definition of Done Checklist

Para marcar una task como ✅ Done:

- [ ] Código funcional sin errores
- [ ] Cumple todos los acceptance criteria
- [ ] Testing manual completado
- [ ] Responsive verificado
- [ ] No hay console.errors
- [ ] Código commiteado con mensaje descriptivo
- [ ] Documentado si es necesario

---

**Created:** [Fecha]  
**Last Updated:** [Fecha]

**END OF SPRINT 2 TASKS**
