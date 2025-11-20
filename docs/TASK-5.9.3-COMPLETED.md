# Task 5.9.3: Crear Sección Mi Perfil - COMPLETADO

**Sprint:** 5
**User Story:** US-5.9 - Dashboard Content Updates
**Fecha de Completación:** 2025-01-20
**Estimated Time:** 2 horas
**Actual Time:** 1.5 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ COMPLETADO

---

## 📋 RESUMEN EJECUTIVO

Se creó la página **ProfilePage** (`/dashboard/profile`) que permite a las usuarias ver su información personal completa, eventos en los que están registradas, y negocios que han publicado en el directorio. La página incluye estados de loading, error y empty states profesionales para una mejor experiencia de usuario.

### Cambios Principales
- ✅ Creada página ProfilePage con información personal completa
- ✅ Sección "Mis Eventos Registrados" con API real (`/api/v1/events/my-registrations`)
- ✅ Sección "Mis Negocios" con API real (`/api/v1/businesses/my/list`)
- ✅ Botón "Editar Perfil" (disabled por ahora - próxima funcionalidad)
- ✅ Estados de loading, error y empty para ambas secciones
- ✅ Ruta agregada a AppRoutes (`/dashboard/profile`)
- ✅ Diseño responsive y consistente con el resto del dashboard

---

## ✅ ACCEPTANCE CRITERIA - TODOS CUMPLIDOS

| Criterio | Status | Implementación |
|----------|--------|----------------|
| Muestra nombre, email, foto | ✅ DONE | Card de perfil con avatar, fullName, preferredName, email, phone, birthday, city |
| Botón "Editar Perfil" | ✅ DONE | Botón presente pero disabled (título: "Próximamente disponible") |
| Sección "Mis Eventos Registrados" | ✅ DONE | Fetch de `/events/my-registrations`, muestra EventCard grid |
| Sección "Mis Negocios" | ✅ DONE | Fetch de `/businesses/my/list`, muestra BusinessCard grid |

---

## 📂 ARCHIVOS CREADOS

### 1. ProfilePage.jsx
**Ubicación:** `frontend/src/features/profile/pages/ProfilePage.jsx` (NUEVO - 341 líneas)

**Características:**
```javascript
const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para eventos registrados
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [errorRegistrations, setErrorRegistrations] = useState(null);

  // Estados para negocios del usuario
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [errorBusinesses, setErrorBusinesses] = useState(null);

  // Fetch eventos registrados
  useEffect(() => {
    const fetchRegistrations = async () => {
      const response = await api.get('/events/my-registrations', {
        params: { status: 'confirmed', upcoming: true },
      });
      setRegistrations(response.data.data || []);
    };
    fetchRegistrations();
  }, []);

  // Fetch negocios del usuario
  useEffect(() => {
    const fetchBusinesses = async () => {
      const response = await api.get('/businesses/my/list');
      setBusinesses(response.data.data || []);
    };
    fetchBusinesses();
  }, []);

  return (
    <DashboardLayout>
      {/* Card de Información Personal */}
      {/* Sección: Mis Eventos Registrados */}
      {/* Sección: Mis Negocios */}
    </DashboardLayout>
  );
};
```

**Features:**
- ✅ Card de información personal con gradiente y avatar
- ✅ Muestra: fullName, preferredName, email, phone, birthday (formateada), city
- ✅ Botón "Editar Perfil" (disabled)
- ✅ Fetch de eventos registrados con loading/error/empty states
- ✅ Fetch de negocios del usuario con loading/error/empty states
- ✅ Reutiliza EventCard y BusinessCard existentes
- ✅ Navegación a `/dashboard/events` y `/dashboard/businesses`
- ✅ Grid responsive (1/2/3 columns)
- ✅ Lucide React icons (User, Mail, Calendar, MapPin, Phone, Edit3, CalendarDays, Briefcase, Loader2, AlertCircle)

---

## 📂 ARCHIVOS MODIFICADOS

### 1. AppRoutes.jsx
**Ubicación:** `frontend/src/routes/AppRoutes.jsx`

**Cambios realizados:**

#### Import agregado:
```javascript
import ProfilePage from '../features/profile/pages/ProfilePage';
```

#### Ruta agregada:
```javascript
{/* Profile Page - Sprint 5 US-5.9 Task 5.9.3 */}
<Route
  path="/dashboard/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

#### Documentación actualizada:
```javascript
/**
 * Rutas Protegidas (requieren autenticación):
 * - /dashboard → DashboardPage
 * - /dashboard/businesses → BusinessDirectoryPage
 * - /dashboard/services → ServiceDirectoryPage
 * - /dashboard/events → EventsPage
 * - /dashboard/my-events → MyEventsPage
 * - /dashboard/blog → BlogPage
 * - /dashboard/blog/:slug → BlogPostPage
 * - /dashboard/profile → ProfilePage  ← NUEVO
 */
```

#### TODO actualizado:
```javascript
{/* TODO: Agregar más rutas protegidas en futuros sprints:
    - /events/:id → EventDetailPage
    - /businesses/:id → BusinessDetailPage
    // - /profile → ProfilePage  ← REMOVIDO (ya implementado)
*/}
```

---

## 🎨 ESTRUCTURA DEL COMPONENTE

### 1. Card de Información Personal

```javascript
<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  {/* Header con gradiente primary-500 a primary-600 */}
  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 text-white">
    <div className="flex items-center justify-between">
      {/* Avatar + Nombre */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-white/20 rounded-full ring-4 ring-white/30">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.preferredName} />
          ) : (
            <User className="w-10 h-10 text-white" />
          )}
        </div>
        <div>
          <h2>{user?.preferredName}</h2>
          <p>{user?.fullName}</p>
        </div>
      </div>

      {/* Botón Editar Perfil (disabled) */}
      <button disabled title="Próximamente disponible">
        <Edit3 /> Editar Perfil
      </button>
    </div>
  </div>

  {/* Body con grid de información */}
  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Email */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-primary-50 rounded-lg">
        <Mail className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">Email</p>
        <p className="text-gray-900">{user?.email}</p>
      </div>
    </div>

    {/* Teléfono, Cumpleaños, Ciudad (condicionales) */}
    {user?.phone && <PhoneDisplay />}
    {user?.birthday && <BirthdayDisplay />}
    {user?.city && <CityDisplay />}
  </div>
</div>
```

**Features:**
- ✅ Gradiente atractivo en header
- ✅ Avatar con placeholder si no hay profileImage
- ✅ Icons con colores distintivos por tipo de dato
- ✅ Grid responsive (1 col móvil, 2 cols desktop)
- ✅ Campos condicionales (solo muestran si existen)

---

### 2. Sección: Mis Eventos Registrados

```javascript
<section className="py-4">
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg">
      <CalendarDays className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2>Mis Eventos Registrados</h2>
      <p className="text-sm text-gray-600">Eventos próximos en los que estás registrada</p>
    </div>
  </div>

  {/* Loading State */}
  {loadingRegistrations && (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
      <p className="text-gray-600 font-medium">Cargando tus eventos...</p>
    </div>
  )}

  {/* Error State */}
  {!loadingRegistrations && errorRegistrations && (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-medium mb-2">Error al cargar eventos</p>
      <p className="text-red-600 text-sm">{errorRegistrations}</p>
    </div>
  )}

  {/* Empty State */}
  {!loadingRegistrations && !errorRegistrations && registrations.length === 0 && (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2 font-medium">No tienes eventos registrados</p>
      <p className="text-sm text-gray-500 mb-4">
        Explora nuestros eventos y regístrate en los que te interesen
      </p>
      <button onClick={() => navigate('/dashboard/events')}>
        Ver eventos disponibles
      </button>
    </div>
  )}

  {/* Events Grid */}
  {!loadingRegistrations && !errorRegistrations && registrations.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {registrations.map((registration) => (
        <EventCard
          key={registration._id}
          event={registration.event}
          onClick={() => navigate('/dashboard/events')}
        />
      ))}
    </div>
  )}
</section>
```

**API Endpoint usado:**
- `GET /api/v1/events/my-registrations?status=confirmed&upcoming=true`

**Response esperado:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "registration_id",
      "event": {
        "_id": "event_id",
        "title": "Taller de Emprendimiento",
        "date": "2025-02-15",
        "time": "18:00",
        "mode": "presencial",
        "location": "Toronto",
        "image": "https://...",
        "capacity": 50,
        "currentRegistrations": 23
      },
      "status": "confirmed",
      "registeredAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Sección: Mis Negocios

```javascript
<section className="py-4">
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg">
      <Briefcase className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2>Mis Negocios</h2>
      <p className="text-sm text-gray-600">Negocios que has registrado en el directorio</p>
    </div>
  </div>

  {/* Loading State */}
  {loadingBusinesses && <LoadingSpinner />}

  {/* Error State */}
  {!loadingBusinesses && errorBusinesses && <ErrorMessage />}

  {/* Empty State */}
  {!loadingBusinesses && !errorBusinesses && businesses.length === 0 && (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2 font-medium">No tienes negocios registrados</p>
      <p className="text-sm text-gray-500 mb-4">
        Registra tu negocio y compártelo con la comunidad
      </p>
      <button onClick={() => navigate('/dashboard/businesses')}>
        Explorar directorio de negocios
      </button>
    </div>
  )}

  {/* Businesses Grid */}
  {!loadingBusinesses && !errorBusinesses && businesses.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business._id} business={business} />
      ))}
    </div>
  )}
</section>
```

**API Endpoint usado:**
- `GET /api/v1/businesses/my/list`

**Response esperado:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "business_id",
      "name": "Café Entre Amigas",
      "category": "Gastronomía",
      "description": "Cafetería latina en el corazón de Toronto",
      "city": "Toronto",
      "phone": "+1 416-123-4567",
      "logo": "https://...",
      "isActive": true,
      "isVerified": false,
      "owner": "user_id"
    }
  ]
}
```

---

## 🔧 DEPENDENCIAS REUTILIZADAS

### 1. AuthContext - useAuth()
**Ubicación:** `frontend/src/features/auth/context/AuthContext.jsx`

**Datos del usuario disponibles:**
```javascript
const { user } = useAuth();

// user object:
{
  _id: string,
  fullName: string,
  preferredName: string,
  email: string,
  phone?: string,
  birthday?: Date,
  city?: string,
  profileImage?: string,
  role: 'user' | 'admin',
  isVerified: boolean,
  authProvider: 'local' | 'google'
}
```

### 2. Componente: EventCard
**Ubicación:** `frontend/src/features/dashboard/components/EventCard.jsx`

**Props esperadas:**
```javascript
<EventCard
  event={{
    _id: string,
    title: string,
    date: Date,
    time: string,
    mode: 'virtual' | 'presencial' | 'híbrido',
    location?: string,
    link?: string,
    image: string,
    capacity: number,
    currentRegistrations: number
  }}
  onClick={() => navigate('/dashboard/events')}
/>
```

### 3. Componente: BusinessCard
**Ubicación:** `frontend/src/features/business/components/BusinessCard.jsx`

**Props esperadas:**
```javascript
<BusinessCard
  business={{
    _id: string,
    name: string,
    category: string,
    description: string,
    city: string,
    phone?: string,
    email?: string,
    whatsapp?: string,
    website?: string,
    logo?: string,
    isVerified: boolean
  }}
/>
```

### 4. API Utility
**Ubicación:** `frontend/src/shared/utils/api.js`

**Uso:**
```javascript
import api from '../../../shared/utils/api';

// Auto-incluye Authorization header con token de AuthContext
const response = await api.get('/events/my-registrations', {
  params: { status: 'confirmed', upcoming: true }
});
```

---

## 🧪 TESTING MANUAL

### Pre-requisitos
- ✅ Frontend: `http://localhost:5173`
- ✅ Backend: `http://localhost:5000`
- ✅ Usuario autenticado (local o Google OAuth)
- ✅ MongoDB con datos seeded

### Test 1: Acceso a Página de Perfil
**Pasos:**
1. Login como usuario regular
2. Navegar manualmente a `/dashboard/profile`

**Resultado Esperado:**
- ✅ URL actualiza a `/dashboard/profile`
- ✅ Página carga sin errores
- ✅ Card de información personal visible
- ✅ Avatar muestra foto o placeholder
- ✅ Nombre completo y preferido visibles
- ✅ Email, teléfono, birthday, ciudad visibles

---

### Test 2: Información Personal Completa
**Pasos:**
1. Verificar que todos los datos del usuario se muestran correctamente
2. Inspeccionar cada campo de información

**Resultado Esperado:**
- ✅ Email con icono de Mail (primary-600)
- ✅ Teléfono con icono de Phone (green-600) si existe
- ✅ Birthday formateada en español ("15 de enero de 1990")
- ✅ Ciudad con icono de MapPin (blue-600) si existe
- ✅ Botón "Editar Perfil" visible pero disabled
- ✅ Tooltip "Próximamente disponible" al hover

---

### Test 3: Eventos Registrados - Con Datos
**Pasos:**
1. Usuario debe tener al menos 1 evento registrado
2. Navegar a `/dashboard/profile`
3. Scroll a sección "Mis Eventos Registrados"

**Resultado Esperado:**
- ✅ Loading spinner aparece brevemente
- ✅ Grid de EventCard se muestra
- ✅ Cada evento muestra: imagen, título, fecha, hora, modalidad, ubicación
- ✅ Click en EventCard navega a `/dashboard/events`
- ✅ Grid responsive: 1/2/3 columnas

---

### Test 4: Eventos Registrados - Sin Datos
**Pasos:**
1. Usuario sin eventos registrados
2. Navegar a `/dashboard/profile`
3. Verificar empty state

**Resultado Esperado:**
- ✅ Icono de CalendarDays (gray-400)
- ✅ Mensaje "No tienes eventos registrados"
- ✅ Texto descriptivo
- ✅ Botón "Ver eventos disponibles" clickeable
- ✅ Click en botón navega a `/dashboard/events`

---

### Test 5: Negocios del Usuario - Con Datos
**Pasos:**
1. Usuario debe tener al menos 1 negocio publicado
2. Navegar a `/dashboard/profile`
3. Scroll a sección "Mis Negocios"

**Resultado Esperado:**
- ✅ Loading spinner aparece brevemente
- ✅ Grid de BusinessCard se muestra
- ✅ Cada negocio muestra: logo, nombre, categoría, descripción, ciudad
- ✅ Badge "Verificado" si isVerified=true
- ✅ Click en BusinessCard abre modal de detalle
- ✅ Grid responsive: 1/2/3 columnas

---

### Test 6: Negocios del Usuario - Sin Datos
**Pasos:**
1. Usuario sin negocios registrados
2. Navegar a `/dashboard/profile`
3. Verificar empty state

**Resultado Esperado:**
- ✅ Icono de Briefcase (gray-400)
- ✅ Mensaje "No tienes negocios registrados"
- ✅ Texto descriptivo
- ✅ Botón "Explorar directorio de negocios" clickeable
- ✅ Click en botón navega a `/dashboard/businesses`

---

### Test 7: Error State - Backend Offline
**Pasos:**
1. Detener backend
2. Navegar a `/dashboard/profile`
3. Observar sección de eventos y negocios

**Resultado Esperado:**
- ✅ Loading spinner aparece primero
- ✅ Después de timeout, aparece error state en eventos
- ✅ Error state en negocios también aparece
- ✅ Icono de AlertCircle visible
- ✅ Mensaje "Error al cargar eventos" y "Error al cargar negocios"
- ✅ Mensaje de error específico del API

---

### Test 8: Responsive Design
**Pasos:**
1. Abrir `/dashboard/profile` en diferentes tamaños de pantalla
2. Observar layout de información personal y grids

**Resultado Esperado:**
- ✅ Mobile (< 768px):
  - Info personal: 1 columna
  - Events grid: 1 columna
  - Businesses grid: 1 columna
  - Avatar y nombre en mobile apilados
- ✅ Tablet (768px - 1024px):
  - Info personal: 2 columnas
  - Events grid: 2 columnas
  - Businesses grid: 2 columnas
- ✅ Desktop (> 1024px):
  - Info personal: 2 columnas
  - Events grid: 3 columnas
  - Businesses grid: 3 columnas

---

### Test 9: Usuario con Google OAuth (sin phone/birthday)
**Pasos:**
1. Login con Google OAuth (puede no tener phone/birthday)
2. Navegar a `/dashboard/profile`
3. Verificar que campos opcionales no rompen el layout

**Resultado Esperado:**
- ✅ Solo muestra campos que existen en el usuario
- ✅ Email siempre visible
- ✅ Phone solo si existe
- ✅ Birthday solo si existe
- ✅ City solo si existe
- ✅ Grid se adapta a número de campos disponibles

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### ANTES
| Feature | Estado |
|---------|--------|
| Página de perfil | ❌ No existía |
| Ver info personal | ❌ Solo en debug info |
| Ver eventos registrados | ❌ Solo en /dashboard/my-events (pendiente) |
| Ver mis negocios | ❌ No disponible |
| Editar perfil | ❌ No disponible |

### DESPUÉS
| Feature | Estado |
|---------|--------|
| Página de perfil | ✅ `/dashboard/profile` |
| Ver info personal | ✅ Card completa con avatar y todos los campos |
| Ver eventos registrados | ✅ Sección dedicada con grid de EventCard |
| Ver mis negocios | ✅ Sección dedicada con grid de BusinessCard |
| Editar perfil | 🔲 Botón presente (disabled - próxima implementación) |

---

## 🚀 IMPACTO EN UX

### Mejoras para Usuario
1. **Centralización:** Un solo lugar para ver toda su información
2. **Visibilidad:** Ve eventos y negocios sin navegar a otras páginas
3. **Navegación:** Un click para ir a páginas completas de eventos/negocios
4. **Profesionalismo:** Loading states y empty states con CTAs claros
5. **Confianza:** Información clara y bien estructurada

### Mejoras para Admin
1. **Trazabilidad:** Usuario puede verificar sus propios datos
2. **Reducción de soporte:** Usuarios ven su info sin contactar soporte
3. **Engagement:** Usuario ve sus actividades de forma visual

---

## 📝 PATRONES ESTABLECIDOS

Este componente establece el **patrón de página de perfil**:

✅ **Estructura:**
- DashboardLayout wrapper
- Card de información personal con gradiente
- Secciones con header + icon + descripción
- Loading/Error/Empty/Success states consistentes
- Reutilización de componentes existentes (EventCard, BusinessCard)
- Navegación con useNavigate()
- Grid responsive (1/2/3 columns)

✅ **Beneficios:**
- Código predecible y mantenible
- UX uniforme con resto del dashboard
- Fácil de extender para futuras funcionalidades (editar perfil, settings, etc.)
- Mismos estilos y animaciones

---

## 🔗 REFERENCIAS

### Archivos Relacionados
- [ProfilePage.jsx](../frontend/src/features/profile/pages/ProfilePage.jsx) - Componente creado ✅
- [AppRoutes.jsx](../frontend/src/routes/AppRoutes.jsx) - Routing actualizado ✅
- [EventCard.jsx](../frontend/src/features/dashboard/components/EventCard.jsx) - Card reutilizado
- [BusinessCard.jsx](../frontend/src/features/business/components/BusinessCard.jsx) - Card reutilizado
- [AuthContext.jsx](../frontend/src/features/auth/context/AuthContext.jsx) - Context usado

### API Endpoints Usados
- `GET /api/v1/events/my-registrations` - Eventos del usuario
- `GET /api/v1/businesses/my/list` - Negocios del usuario

### Backend Routes
- [event.routes.js](../backend/src/routes/event.routes.js) - `/my-registrations` endpoint (línea 46)
- [business.routes.js](../backend/src/routes/business.routes.js) - `/my/list` endpoint (línea 62)

### Backend Models
- [EventRegistration.js](../backend/src/models/EventRegistration.js) - Modelo de registros
- [Business.js](../backend/src/models/Business.js) - Modelo de negocios
- [User.js](../backend/src/models/User.js) - Modelo de usuario

### Tasks Relacionadas
- [tasks s5.md](./tasks%20s5.md) - Task 5.9.3 líneas 1099-1121 ✅
- [TASK-5.9.1-COMPLETED.md](./TASK-5.9.1-COMPLETED.md) - Patrón similar usado
- [TASK-5.9.2-COMPLETED.md](./TASK-5.9.2-COMPLETED.md) - Patrón similar usado

### User Stories
- US-5.9: Dashboard Content Updates (2 pts)
  - Task 5.9.1 ✅ DONE (Events Preview)
  - Task 5.9.2 ✅ DONE (Blog Preview)
  - Task 5.9.3 ✅ DONE (Mi Perfil)

---

## 🎯 PRÓXIMOS PASOS

### Futuras Mejoras (Sprint 6+)
- [ ] Implementar funcionalidad "Editar Perfil"
  - Formulario para actualizar fullName, preferredName, phone, city
  - Upload de profileImage
  - Validación con Yup
  - API endpoint: `PUT /api/v1/users/me`
- [ ] Página `/dashboard/my-events` (MyEventsPage)
  - Vista completa de eventos registrados
  - Filtros: upcoming/past
  - Botón "Cancelar registro"
- [ ] Sección "Configuración"
  - Cambiar contraseña
  - Notificaciones por email
  - Preferencias de privacidad
- [ ] Integración con NavigationCards
  - Agregar card "Mi Perfil" en dashboard

### Nice to Have
- [ ] Badge de "Perfil completo" (100% de campos llenos)
- [ ] Contador de actividad (eventos asistidos, negocios publicados)
- [ ] Timeline de actividad reciente
- [ ] Exportar datos personales (GDPR compliance)

---

## 📊 BUILD STATUS

✅ **Build Exitoso** sin errores
- Vite build: `4.29s`
- Bundle size: `956.68 KB` (incremento de ~9KB vs Task 5.9.2)
- CSS: `57.20 KB`
- Módulos transformados: 1788

**Warning:**
- Chunk size > 500 KB (warning común, no es bloqueante)
- Considerar code-splitting en Sprint 6 si bundle sigue creciendo

---

**Completado por:** Claude (Frontend Developer - MERN Stack)
**Fecha:** 2025-01-20
**Status:** ✅ COMPLETADO - LISTO PARA TESTING
**Deploy:** Listo para commit y merge a main
**Issue:** Task 5.9.3 cerrado ✅
