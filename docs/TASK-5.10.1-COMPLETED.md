# Task 5.10.1: Crear Modal de Proponer Evento - COMPLETADO

**Sprint:** 5
**User Story:** US-5.10 - User Submission Workflows
**Fecha de Completación:** 2025-01-20
**Estimated Time:** 2 horas
**Actual Time:** 1.5 horas
**Priority:** MEDIUM
**Assignee:** Frontend
**Status:** ✅ COMPLETADO

---

## 📋 RESUMEN EJECUTIVO

Se creó el componente **ProposeEventModal** que permite a las usuarias proponer nuevos eventos a la comunidad. El modal incluye un formulario completo con validaciones usando React Hook Form + Yup, envía la propuesta al endpoint backend `/api/v1/events/propose`, y crea el evento con status `"pending"` para que un administrador lo revise antes de publicarlo.

### Cambios Principales
- ✅ Creado ProposeEventModal.jsx con formulario completo (475 líneas)
- ✅ Validación con Yup (campos requeridos, formatos, validaciones condicionales)
- ✅ Botón "Proponer Evento" agregado en EventsPage (desktop + mobile)
- ✅ Submit crea evento con status "pending" y isActive=false
- ✅ Toast de confirmación al enviar propuesta
- ✅ Integración con endpoint backend existente
- ✅ Responsive design

---

## ✅ ACCEPTANCE CRITERIA - TODOS CUMPLIDOS

| Criterio | Status | Implementación |
|----------|--------|----------------|
| Botón "Proponer Evento" en página eventos | ✅ DONE | Botón en header (desktop) y full-width (mobile) |
| Modal con form simplificado | ✅ DONE | Modal con 8 campos + validaciones |
| Campos: título, descripción, fecha, lugar | ✅ DONE | + hora, modalidad, link, capacidad |
| Submit crea evento con status "pending" | ✅ DONE | POST `/api/v1/events/propose` → status: "pending", isActive: false |

---

## 📂 ARCHIVOS CREADOS

### 1. ProposeEventModal.jsx
**Ubicación:** `frontend/src/features/events/components/ProposeEventModal.jsx` (NUEVO - 475 líneas)

**Características:**
```javascript
// Schema de validación con Yup
const proposeEventSchema = yup.object({
  title: yup.string().required().min(5).max(100),
  description: yup.string().required().min(20).max(1000),
  date: yup.date().required().min(new Date()),
  time: yup.string().required().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  mode: yup.string().required().oneOf(['virtual', 'presencial', 'híbrido']),

  // Validación condicional: location requerido para presencial/híbrido
  location: yup.string().when('mode', {
    is: (mode) => mode === 'presencial' || mode === 'híbrido',
    then: (schema) => schema.required('La ubicación es requerida'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Validación condicional: link requerido para virtual/híbrido
  link: yup.string().when('mode', {
    is: (mode) => mode === 'virtual' || mode === 'híbrido',
    then: (schema) => schema.required().url(),
    otherwise: (schema) => schema.notRequired(),
  }),

  capacity: yup.number().required().min(1).max(1000),
});

const ProposeEventModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(proposeEventSchema),
    mode: 'onBlur',
  });

  // Watch mode para mostrar/ocultar campos condicionales
  const selectedMode = watch('mode');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        mode: data.mode,
        location: data.location || null,
        link: data.link || null,
        capacity: parseInt(data.capacity),
      };

      const response = await api.post('/events/propose', eventData);

      showToast(
        response.data.message || 'Propuesta enviada. Será revisada por un administrador.',
        'success'
      );

      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar propuesta';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <Lightbulb /> Proponer Evento
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Campos del formulario */}
        </form>
      </div>
    </div>
  );
};
```

**Features:**
- ✅ Modal overlay con backdrop blur
- ✅ Header con gradiente purple-500 a pink-500
- ✅ Formulario con React Hook Form
- ✅ Validación con Yup
- ✅ 8 campos de entrada:
  - title (text, required, 5-100 chars)
  - description (textarea, required, 20-1000 chars)
  - date (date, required, future only)
  - time (time, required, HH:MM format)
  - mode (select, required, virtual/presencial/híbrido)
  - location (text, conditional: required for presencial/híbrido)
  - link (url, conditional: required for virtual/híbrido)
  - capacity (number, required, 1-1000)
- ✅ Campos condicionales: location y link se muestran/ocultan según modalidad
- ✅ Loading state durante submit (Loader2 spinner)
- ✅ Botón "Cancelar" y "Enviar Propuesta"
- ✅ Info box: "Tu propuesta será revisada por un administrador"
- ✅ Icons de Lucide React (Lightbulb, Calendar, Clock, MapPin, LinkIcon, Users, X, Loader2)

---

## 📂 ARCHIVOS MODIFICADOS

### 1. EventsPage.jsx
**Ubicación:** `frontend/src/features/events/pages/EventsPage.jsx`

**Cambios realizados:**

#### Imports agregados:
```javascript
import { Calendar, Lightbulb } from 'lucide-react';
import { EventList, EventDetailModal, ProposeEventModal } from '../components';
```

#### Estados agregados:
```javascript
// Estado para modal de proponer evento
const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

const handleOpenProposeModal = () => {
  setIsProposeModalOpen(true);
};

const handleCloseProposeModal = () => {
  setIsProposeModalOpen(false);
};
```

#### UI actualizado - Header con botón:
```javascript
{/* Header Section */}
<div className="mb-8">
  {/* Icon + Title + Botón Proponer Evento */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
        <Calendar className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1>Eventos Comunitarios</h1>
        <p>Conecta con otras mujeres en talleres, webinars y eventos presenciales</p>
      </div>
    </div>

    {/* Botón Proponer Evento - Desktop */}
    <button
      onClick={handleOpenProposeModal}
      className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
    >
      <Lightbulb className="w-5 h-5" />
      Proponer Evento
    </button>
  </div>

  {/* Botón Proponer Evento - Móvil */}
  <button
    onClick={handleOpenProposeModal}
    className="md:hidden flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
  >
    <Lightbulb className="w-5 h-5" />
    Proponer Evento
  </button>
</div>
```

#### Modal agregado:
```javascript
{/* Propose Event Modal */}
<ProposeEventModal
  isOpen={isProposeModalOpen}
  onClose={handleCloseProposeModal}
/>
```

#### Documentación actualizada:
```javascript
/**
 * Sprint 5 - US-5.10: User Submission Workflows
 * - Task 5.10.1 ✅ Frontend - ProposeEventModal Component
 */
```

---

### 2. index.js
**Ubicación:** `frontend/src/features/events/components/index.js`

**Cambios:**
```javascript
export { default as EventList } from './EventList';
export { default as EventDetailModal } from './EventDetailModal';
export { default as MyEventsSection } from './MyEventsSection';
export { default as ProposeEventModal } from './ProposeEventModal'; // ✅ NUEVO
```

---

## 🔧 BACKEND ENDPOINT UTILIZADO

### POST /api/v1/events/propose

**Endpoint:** Ya existente en el backend
**Controller:** `backend/src/controllers/event.controller.js` (línea 824)
**Route:** `backend/src/routes/event.routes.js` (línea 67)
**Auth:** Protected (requiere usuario autenticado)

**Request Body:**
```json
{
  "title": "Taller de Emprendimiento para Latinas",
  "description": "Aprende a crear tu plan de negocios...",
  "date": "2025-02-15",
  "time": "18:00",
  "mode": "presencial",
  "location": "Toronto Public Library - 789 Yonge St",
  "link": null,
  "capacity": 50
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Propuesta de evento enviada exitosamente. Será revisada por un administrador.",
  "data": {
    "_id": "event_id",
    "title": "Taller de Emprendimiento para Latinas",
    "description": "Aprende a crear tu plan de negocios...",
    "date": "2025-02-15T00:00:00.000Z",
    "time": "18:00",
    "mode": "presencial",
    "location": "Toronto Public Library - 789 Yonge St",
    "link": null,
    "capacity": 50,
    "status": "pending",
    "isActive": false,
    "organizer": "user_id",
    "createdAt": "2025-01-20T..."
  }
}
```

**Validaciones Backend:**
- ✅ Campos requeridos: title, description, date, time, mode, capacity
- ✅ Modalidad válida: virtual, presencial, híbrido
- ✅ Location requerido para presencial/híbrido
- ✅ Link requerido para virtual/híbrido
- ✅ Fecha futura
- ✅ Capacidad entre 1-1000
- ✅ Evento creado con status="pending" e isActive=false
- ✅ Organizer = usuario autenticado

**Log en Backend:**
```
📝 Nueva propuesta de evento recibida:
  - ID: 507f1f77bcf86cd799439011
  - Título: Taller de Emprendimiento para Latinas
  - Propuesto por: 507f191e810c19729de860ea (maria@example.com)
  - Fecha: 2025-02-15
  - Modalidad: presencial
```

---

## 🎨 ESTRUCTURA DEL FORMULARIO

### Campos del Modal

```javascript
// 1. Título *
<input
  {...register('title')}
  type="text"
  placeholder="Ej: Taller de Emprendimiento para Latinas"
  className="..."
/>

// 2. Descripción *
<textarea
  {...register('description')}
  rows={4}
  placeholder="Describe el evento: qué se hará, qué aprenderán..."
  className="..."
/>

// 3. Fecha * (date picker con min=today)
<input
  {...register('date')}
  type="date"
  min={new Date().toISOString().split('T')[0]}
  className="..."
/>

// 4. Hora * (time picker)
<input
  {...register('time')}
  type="time"
  className="..."
/>

// 5. Modalidad * (select)
<select {...register('mode')} className="...">
  <option value="">Selecciona una modalidad</option>
  <option value="virtual">Virtual</option>
  <option value="presencial">Presencial</option>
  <option value="híbrido">Híbrido (Virtual + Presencial)</option>
</select>

// 6. Ubicación * (condicional: solo si mode = presencial o híbrido)
{(selectedMode === 'presencial' || selectedMode === 'híbrido') && (
  <input
    {...register('location')}
    type="text"
    placeholder="Ej: Toronto Public Library - 789 Yonge St"
    className="..."
  />
)}

// 7. Link * (condicional: solo si mode = virtual o híbrido)
{(selectedMode === 'virtual' || selectedMode === 'híbrido') && (
  <input
    {...register('link')}
    type="url"
    placeholder="https://zoom.us/j/123456789"
    className="..."
  />
)}

// 8. Capacidad *
<input
  {...register('capacity')}
  type="number"
  min="1"
  max="1000"
  placeholder="Ej: 50"
  className="..."
/>
```

---

## 🧪 TESTING MANUAL

### Pre-requisitos
- ✅ Frontend: `http://localhost:5173`
- ✅ Backend: `http://localhost:5000`
- ✅ Usuario autenticado

### Test 1: Abrir Modal
**Pasos:**
1. Login como usuario regular
2. Navegar a `/dashboard/events`
3. Hacer click en botón "Proponer Evento"

**Resultado Esperado:**
- ✅ Botón visible en header (desktop)
- ✅ Botón full-width visible arriba del divider (mobile)
- ✅ Click abre modal con backdrop blur
- ✅ Modal centrado y responsive
- ✅ Header con gradiente purple-pink visible
- ✅ Icon de Lightbulb visible

---

### Test 2: Validación de Campos Requeridos
**Pasos:**
1. Abrir modal
2. Click en "Enviar Propuesta" sin llenar nada
3. Observar mensajes de error

**Resultado Esperado:**
- ✅ Error en title: "El título es requerido"
- ✅ Error en description: "La descripción es requerida"
- ✅ Error en date: "La fecha es requerida"
- ✅ Error en time: "La hora es requerida"
- ✅ Error en mode: "La modalidad es requerida"
- ✅ Error en capacity: "La capacidad es requerida"
- ✅ Mensajes de error en rojo debajo de cada campo
- ✅ Bordes de inputs en rojo

---

### Test 3: Validaciones de Formato
**Pasos:**
1. Llenar title con "abc" (< 5 chars)
2. Llenar description con "test" (< 20 chars)
3. Llenar time con "25:99" (formato inválido)
4. Llenar capacity con "0" (< 1)

**Resultado Esperado:**
- ✅ Error title: "El título debe tener al menos 5 caracteres"
- ✅ Error description: "La descripción debe tener al menos 20 caracteres"
- ✅ Error time: "Formato de hora inválido (HH:MM)"
- ✅ Error capacity: "La capacidad mínima es 1 persona"

---

### Test 4: Campos Condicionales - Modalidad Presencial
**Pasos:**
1. Seleccionar mode="presencial"
2. Observar campos que aparecen/desaparecen

**Resultado Esperado:**
- ✅ Campo "Ubicación" aparece (required)
- ✅ Campo "Link" NO aparece
- ✅ Submit sin ubicación muestra error: "La ubicación es requerida para eventos presenciales"

---

### Test 5: Campos Condicionales - Modalidad Virtual
**Pasos:**
1. Seleccionar mode="virtual"
2. Observar campos

**Resultado Esperado:**
- ✅ Campo "Link" aparece (required)
- ✅ Campo "Ubicación" NO aparece
- ✅ Submit sin link muestra error: "El link es requerido para eventos virtuales"
- ✅ Link inválido ("hola") muestra error: "El link debe ser una URL válida"

---

### Test 6: Campos Condicionales - Modalidad Híbrido
**Pasos:**
1. Seleccionar mode="híbrido"
2. Observar campos

**Resultado Esperado:**
- ✅ Campo "Ubicación" aparece (required)
- ✅ Campo "Link" aparece (required)
- ✅ Ambos campos requeridos para submit

---

### Test 7: Submit Exitoso - Modalidad Presencial
**Pasos:**
1. Llenar todos los campos:
   - title: "Taller de Emprendimiento"
   - description: "Aprende a crear tu plan de negocios desde cero y valida tu idea..."
   - date: mañana
   - time: "18:00"
   - mode: "presencial"
   - location: "Toronto Public Library"
   - capacity: "50"
2. Click en "Enviar Propuesta"

**Resultado Esperado:**
- ✅ Botón muestra "Enviando..." con spinner
- ✅ Request POST a `/api/v1/events/propose`
- ✅ Response 201 Created
- ✅ Toast verde: "Propuesta enviada exitosamente. Será revisada por un administrador."
- ✅ Modal se cierra automáticamente
- ✅ Formulario se resetea

---

### Test 8: Submit Exitoso - Modalidad Virtual
**Pasos:**
1. Llenar todos los campos para evento virtual
2. mode: "virtual"
3. link: "https://zoom.us/j/123456789"
4. Submit

**Resultado Esperado:**
- ✅ Submit exitoso
- ✅ location enviado como null al backend
- ✅ link enviado correctamente
- ✅ Toast de confirmación
- ✅ Modal se cierra

---

### Test 9: Error de Backend (fecha pasada)
**Pasos:**
1. Manipular campo date en DevTools para fecha pasada
2. Submit

**Resultado Esperado:**
- ✅ Response 400 Bad Request
- ✅ Toast rojo con mensaje: "La fecha del evento debe ser futura"
- ✅ Modal permanece abierto
- ✅ Usuario puede corregir y reintentar

---

### Test 10: Cerrar Modal
**Pasos:**
1. Abrir modal
2. Llenar algunos campos
3. Click en "X" en header
4. Reabrir modal

**Resultado Esperado:**
- ✅ Modal se cierra con animación
- ✅ Al reabrir, formulario está limpio (reset)
- ✅ Click en "Cancelar" también cierra y resetea

---

### Test 11: Responsive Design
**Pasos:**
1. Abrir modal en diferentes tamaños de pantalla

**Resultado Esperado:**
- ✅ Mobile (< 768px):
  - Modal ocupa casi toda la pantalla
  - Campos en 1 columna
  - Botón "Proponer Evento" full-width visible arriba
  - Botón desktop hidden
- ✅ Desktop (> 768px):
  - Modal max-width 2xl (672px)
  - Fecha y Hora en 2 columnas (grid)
  - Botón desktop visible en header
  - Botón móvil hidden

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### ANTES
| Feature | Estado |
|---------|--------|
| Proponer eventos | ❌ No disponible |
| Usuarios sugieren ideas | ❌ Solo vía email/forms externos |
| Admin crea todos los eventos | ✅ Único método |

### DESPUÉS
| Feature | Estado |
|---------|--------|
| Proponer eventos | ✅ Modal en página de eventos |
| Usuarios sugieren ideas | ✅ Formulario integrado con validaciones |
| Admin revisa propuestas | ✅ Eventos con status "pending" |
| Notificación al usuario | ✅ Toast de confirmación |

---

## 🚀 IMPACTO EN UX

### Mejoras para Usuario
1. **Empoderamiento:** Usuarios pueden proponer eventos sin contactar admin
2. **Feedback inmediato:** Toast de confirmación al enviar
3. **Validación en tiempo real:** Errores claros antes de submit
4. **Accesibilidad:** Botón visible y fácil de encontrar
5. **Flexibilidad:** Soporte para eventos virtuales, presenciales e híbridos

### Mejoras para Admin
1. **Curación de contenido:** Propuestas llegan con status "pending"
2. **Información completa:** Formulario captura todos los detalles necesarios
3. **Trazabilidad:** Campo "organizer" identifica quién propuso cada evento
4. **Log en backend:** Console log muestra nuevas propuestas en tiempo real

---

## 📝 PATRONES ESTABLECIDOS

Este componente establece el **patrón de user submissions**:

✅ **Estructura:**
- Modal overlay con backdrop blur
- Header con gradiente y icon descriptivo
- Formulario con React Hook Form + Yup
- Validaciones robustas (required, format, conditional)
- Loading states durante submit
- Toast de feedback (success/error)
- Integración con backend existente

✅ **Beneficios:**
- Código reutilizable para futuros modals de propuestas
- UX consistente con resto de la app
- Validación client-side + server-side
- Fácil de extender (agregar más campos)

---

## 🔗 REFERENCIAS

### Archivos Relacionados
- [ProposeEventModal.jsx](../frontend/src/features/events/components/ProposeEventModal.jsx) - Modal creado ✅
- [EventsPage.jsx](../frontend/src/features/events/pages/EventsPage.jsx) - Página actualizada ✅
- [index.js](../frontend/src/features/events/components/index.js) - Export agregado ✅

### Backend Endpoints
- [event.controller.js](../backend/src/controllers/event.controller.js) - proposeEvent controller (línea 824)
- [event.routes.js](../backend/src/routes/event.routes.js) - POST /propose route (línea 67)

### Backend Models
- [Event.js](../backend/src/models/Event.js) - Modelo de eventos

### Tasks Relacionadas
- [tasks s5.md](./tasks%20s5.md) - Task 5.10.1 líneas 1153-1176 ✅
- Task 5.10.2 - Backend Endpoint para Propuestas (ya existe ✅)

### User Stories
- US-5.10: User Submission Workflows (5 pts)
  - Task 5.10.1 ✅ DONE (Crear Modal de Proponer Evento)
  - Task 5.10.2 ✅ DONE (Backend endpoint ya existía)
  - Task 5.10.3 🔲 To Do (Modal Proponer Negocio - pendiente)
  - Task 5.10.4 🔲 To Do (Modal Proponer Servicio - pendiente)

---

## 🎯 PRÓXIMOS PASOS

### Próximas Tasks (US-5.10)
- [ ] Task 5.10.3: Crear Modal de Proponer Negocio
  - Similares campos a ProposeEventModal
  - POST `/api/v1/businesses` con status "pending"
- [ ] Task 5.10.4: Crear Modal de Proponer Servicio
  - Similar estructura
  - POST `/api/v1/services` con status "pending"

### Admin Panel (Sprint 6)
- [ ] Vista de propuestas pendientes en admin panel
- [ ] Botón "Aprobar" y "Rechazar" propuestas
- [ ] Notificación por email al usuario cuando propuesta es aprobada/rechazada
- [ ] Historial de propuestas del usuario

### Nice to Have
- [ ] Preview del evento antes de enviar
- [ ] Draft mode (guardar propuesta sin enviar)
- [ ] Sugerencia de horarios populares
- [ ] Validación de disponibilidad de ubicación

---

## 📊 BUILD STATUS

✅ **Build Exitoso** sin errores
- Vite build: `4.83s`
- Bundle size: `966.58 KB` (incremento de ~10KB vs Task 5.9.3)
- CSS: `57.56 KB`
- Módulos transformados: 1789

**Warning:**
- Chunk size > 500 KB (warning común, considerar code-splitting en Sprint 6)

---

**Completado por:** Claude (Frontend Developer - MERN Stack)
**Fecha:** 2025-01-20
**Status:** ✅ COMPLETADO - LISTO PARA TESTING
**Deploy:** Listo para commit y merge a main
**Issue:** Task 5.10.1 cerrado ✅
