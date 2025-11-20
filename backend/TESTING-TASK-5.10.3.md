# Testing Guide - Task 5.10.3: Admin Approval Workflow

**Sprint:** 5
**Task:** 5.10.3 - Admin Approval Workflow para Propuestas de Eventos
**Status:** ✅ COMPLETADO
**Fecha:** 2025-01-20

---

## 📋 RESUMEN

Se implementaron 3 endpoints administrativos que permiten a los admins aprobar o rechazar propuestas de eventos enviadas por usuarios. Incluye envío automático de emails de notificación.

**Características implementadas:**
- ✅ Endpoint GET para ver eventos pendientes con populate de organizer
- ✅ Endpoint PATCH para aprobar evento (cambia a published + isActive=true)
- ✅ Endpoint PATCH para rechazar evento (cambia a cancelled + guarda motivo)
- ✅ Email de aprobación con template HTML verde/azul
- ✅ Email de rechazo con template HTML naranja + motivo visible
- ✅ Validaciones robustas de permisos y estados
- ✅ Logs detallados de todas las operaciones

---

## 🧪 TESTING MANUAL

### Pre-requisitos

1. ✅ Backend corriendo en http://localhost:8000 (o puerto configurado)
2. ✅ MongoDB conectado
3. ✅ Usuario admin con token JWT válido
4. ✅ Al menos un evento con status="pending" en la base de datos

### Obtener Token de Admin

**Opción A: Crear admin desde script**

```bash
cd backend
node src/scripts/updateUserRole.js
# Seguir instrucciones para crear admin con dev@jappi.ca
```

**Opción B: Login con usuario admin existente**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@jappi.ca",
    "password": "Password123"
  }'
```

**Guardar el token:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Crear un Evento Pendiente (si no existe)

Primero necesitas un evento con status="pending" para testear. Usa Task 5.10.2:

```bash
# Login como usuario regular (no admin)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.propuesta@test.com",
    "password": "Test1234"
  }'

# Guardar token de usuario
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Proponer evento
curl -X POST http://localhost:8000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "title": "Taller de Yoga para Principiantes",
    "description": "Aprende posturas básicas de yoga y técnicas de respiración para mejorar tu bienestar físico y mental.",
    "date": "2025-02-20",
    "time": "10:00",
    "mode": "presencial",
    "location": "456 Wellness Street, Toronto, ON",
    "capacity": 20,
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
  }'
```

Guarda el ID del evento retornado: `679...`

---

## ✅ TEST 1: Obtener Lista de Eventos Pendientes (Success)

**Request:**

```bash
curl -X GET http://localhost:8000/api/v1/admin/events/pending \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "679abc123def456...",
      "title": "Taller de Yoga para Principiantes",
      "description": "Aprende posturas básicas de yoga...",
      "date": "2025-02-20T00:00:00.000Z",
      "time": "10:00",
      "mode": "presencial",
      "location": "456 Wellness Street, Toronto, ON",
      "capacity": 20,
      "registeredCount": 0,
      "status": "pending",
      "isActive": false,
      "organizer": {
        "_id": "679user123...",
        "preferredName": "María",
        "fullName": "María Test Propuesta",
        "email": "maria.propuesta@test.com",
        "profileImage": "https://..."
      },
      "createdAt": "2025-01-20T..."
    }
  ]
}
```

**Verificaciones:**
- ✅ Status code = 200
- ✅ success = true
- ✅ count = número de eventos pendientes
- ✅ data es array de eventos con status="pending"
- ✅ organizer está populated con datos completos
- ✅ Console log muestra: "📋 Admin consultó X eventos pendientes"

---

## ✅ TEST 2: Aprobar Evento (Success)

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/events/679abc123def456/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Evento aprobado y publicado exitosamente",
  "data": {
    "_id": "679abc123def456...",
    "title": "Taller de Yoga para Principiantes",
    "status": "published",
    "isActive": true,
    "organizer": {
      "_id": "679user123...",
      "preferredName": "María",
      "email": "maria.propuesta@test.com"
    },
    "updatedAt": "2025-01-20T..."
  }
}
```

**Verificaciones:**
- ✅ Status code = 200
- ✅ success = true
- ✅ data.status = "published"
- ✅ data.isActive = true
- ✅ Console log muestra: "✅ Evento aprobado por admin: [detalles]"
- ✅ Console log muestra: "📧 Email de aprobación enviado a maria.propuesta@test.com"
- ✅ Usuario recibe email de aprobación en su buzón

**Email Recibido:**
- Asunto: "✅ ¡Tu evento ha sido aprobado! - Taller de Yoga para Principiantes"
- Template con gradiente verde/azul
- Detalles del evento incluidos (fecha, hora, modalidad, ubicación)
- Link para ver evento publicado

---

## ✅ TEST 3: Rechazar Evento con Motivo (Success)

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/events/679abc123def456/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "El evento propuesto no cumple con las políticas de la comunidad. Necesitamos que el contenido sea más inclusivo y se alinee con los valores de Entre Amigas."
  }'
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Evento rechazado exitosamente",
  "data": {
    "event": {
      "_id": "679abc123def456...",
      "title": "Taller de Yoga para Principiantes",
      "status": "cancelled",
      "isActive": false,
      "cancelledAt": "2025-01-20T...",
      "cancellationReason": "El evento propuesto no cumple con las políticas...",
      "organizer": {
        "_id": "679user123...",
        "preferredName": "María",
        "email": "maria.propuesta@test.com"
      }
    },
    "reason": "El evento propuesto no cumple con las políticas..."
  }
}
```

**Verificaciones:**
- ✅ Status code = 200
- ✅ success = true
- ✅ data.event.status = "cancelled"
- ✅ data.event.isActive = false
- ✅ data.event.cancelledAt existe
- ✅ data.event.cancellationReason = reason proporcionado
- ✅ Console log muestra: "❌ Evento rechazado por admin: [detalles + motivo]"
- ✅ Console log muestra: "📧 Email de rechazo enviado a maria.propuesta@test.com"
- ✅ Usuario recibe email de rechazo en su buzón

**Email Recibido:**
- Asunto: "📋 Actualización sobre tu propuesta de evento - Taller de Yoga..."
- Template con gradiente naranja (warning)
- Motivo del rechazo visible en box destacado
- CTA para contactar al equipo
- Mensaje empático y constructivo

---

## ❌ TEST 4: Aprobar Evento que No Existe (Error 404)

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/events/000000000000000000000000/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (404):**

```json
{
  "success": false,
  "message": "Evento no encontrado"
}
```

**Verificaciones:**
- ✅ Status code = 404
- ✅ success = false

---

## ❌ TEST 5: Aprobar Evento que No Está Pendiente (Error 400)

Primero aprobar un evento, luego intentar aprobarlo de nuevo:

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/events/679abc123def456/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "El evento no está pendiente de aprobación. Status actual: published"
}
```

**Verificaciones:**
- ✅ Status code = 400
- ✅ success = false
- ✅ Mensaje indica el status actual del evento

---

## ❌ TEST 6: Rechazar Evento Sin Motivo (Error 400)

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/events/679abc123def456/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "El motivo del rechazo es requerido"
}
```

**Verificaciones:**
- ✅ Status code = 400
- ✅ success = false

---

## ❌ TEST 7: Sin Autenticación (Error 401)

**Request:**

```bash
curl -X GET http://localhost:8000/api/v1/admin/events/pending \
  -H "Content-Type: application/json"
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "No autorizado"
}
```

**Verificaciones:**
- ✅ Status code = 401
- ✅ success = false

---

## ❌ TEST 8: Usuario No Admin Intenta Aprobar (Error 403)

**Request:**

```bash
# Usar TOKEN de usuario regular (no admin)
curl -X PATCH http://localhost:8000/api/v1/admin/events/679abc123def456/approve \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (403):**

```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción"
}
```

**Verificaciones:**
- ✅ Status code = 403
- ✅ success = false

---

## 🔍 VERIFICACIÓN EN BASE DE DATOS

Después de aprobar un evento, verifica en MongoDB:

```javascript
// MongoDB Shell o Compass
db.events.findOne({ _id: ObjectId("679abc123...") })
```

**Expected Result (Evento Aprobado):**

```json
{
  "_id": ObjectId("679abc123..."),
  "title": "Taller de Yoga para Principiantes",
  "status": "published",
  "isActive": true,
  "organizer": ObjectId("679user123..."),
  "updatedAt": ISODate("2025-01-20T...")
}
```

**Expected Result (Evento Rechazado):**

```json
{
  "_id": ObjectId("679abc123..."),
  "title": "Taller de Yoga para Principiantes",
  "status": "cancelled",
  "isActive": false,
  "cancelledAt": ISODate("2025-01-20T..."),
  "cancellationReason": "El evento propuesto no cumple...",
  "organizer": ObjectId("679user123..."),
  "updatedAt": ISODate("2025-01-20T...")
}
```

---

## 📊 CHECKLIST DE VALIDACIÓN

### Funcionalidad
- [x] GET `/api/v1/admin/events/pending` retorna eventos correctos
- [x] PATCH `/api/v1/admin/events/:id/approve` aprueba evento
- [x] PATCH `/api/v1/admin/events/:id/reject` rechaza evento
- [x] Status cambia correctamente en cada operación
- [x] isActive cambia correctamente (true para aprobado, false para rechazado)
- [x] organizer populate funciona correctamente

### Emails
- [x] Email de aprobación enviado con template correcto
- [x] Email de rechazo enviado con motivo visible
- [x] Emails tienen diseño responsive
- [x] Links en emails funcionan correctamente
- [x] Emails no bloquean la operación si fallan

### Validaciones
- [x] Requiere autenticación (401 sin token)
- [x] Requiere permisos admin (403 con token de usuario regular)
- [x] Valida existencia de evento (404)
- [x] Valida que evento esté pendiente (400)
- [x] Valida que rechazo tenga motivo (400)

### Response Format
- [x] Responses 200 con estructura estándar
- [x] success: true/false
- [x] message descriptivo
- [x] data con información relevante

### Logs
- [x] Log de consulta de pendientes con contador
- [x] Log de aprobación con detalles del evento
- [x] Log de rechazo con motivo
- [x] Log de envío de email con destinatario

---

## 🚀 FLUJO COMPLETO END-TO-END

**Caso de Uso: Usuario propone evento, admin aprueba**

1. ✅ Usuario se registra y hace login
2. ✅ Usuario propone evento vía POST `/api/v1/events/propose`
3. ✅ Evento creado con status="pending", isActive=false
4. ✅ Admin hace login y obtiene token
5. ✅ Admin consulta GET `/api/v1/admin/events/pending`
6. ✅ Admin ve el evento propuesto en la lista
7. ✅ Admin aprueba vía PATCH `/api/v1/admin/events/:id/approve`
8. ✅ Backend cambia status a "published", isActive=true
9. ✅ Backend envía email de aprobación al usuario
10. ✅ Usuario recibe email con link al evento publicado
11. ✅ Evento ahora visible en GET `/api/v1/events` (lista pública)

**Caso de Uso: Usuario propone evento, admin rechaza**

1. ✅ Usuario propone evento vía POST `/api/v1/events/propose`
2. ✅ Admin consulta eventos pendientes
3. ✅ Admin rechaza vía PATCH `/api/v1/admin/events/:id/reject` con motivo
4. ✅ Backend cambia status a "cancelled", isActive=false
5. ✅ Backend guarda motivo en cancellationReason
6. ✅ Backend envía email de rechazo con motivo al usuario
7. ✅ Usuario recibe email explicando el rechazo
8. ✅ Evento NO aparece en lista pública

---

## 📝 ARCHIVOS IMPLEMENTADOS

### Backend Controllers
- `backend/src/controllers/admin.controller.js`
  - Función `getPendingEvents()` (líneas 199-220)
  - Función `approveEvent()` (líneas 228-297)
  - Función `rejectEvent()` (líneas 305-385)

### Backend Routes
- `backend/src/routes/admin.routes.js`
  - Ruta GET `/events/pending` (línea 65)
  - Ruta PATCH `/events/:id/approve` (línea 72)
  - Ruta PATCH `/events/:id/reject` (línea 80)

### Email Service
- `backend/src/services/email.service.js`
  - Función `sendEventApprovalEmail()` (líneas 1602-1906)
  - Función `sendEventRejectionEmail()` (líneas 1917-2261)

---

## 🎨 TEMPLATES DE EMAIL

### Email de Aprobación
- **Colores:** Gradiente verde (#10b981) a azul (#3b82f6)
- **Elementos:**
  - Header con logo y mensaje de aprobación
  - Box de éxito con fondo verde claro
  - Detalles del evento (fecha, hora, modalidad, ubicación, link)
  - CTA "Ver mi Evento Publicado"
  - Footer estándar de Entre Amigas

### Email de Rechazo
- **Colores:** Gradiente naranja (#f59e0b) a naranja oscuro (#f97316)
- **Elementos:**
  - Header con logo y mensaje de actualización
  - Warning box con estado de la propuesta
  - Reason box con motivo del rechazo destacado
  - Info box con sugerencias de qué hacer
  - Detalles del evento propuesto
  - CTA "Contactar al Equipo"
  - Mensaje empático de cierre

---

## 🔒 SEGURIDAD

- ✅ Todas las rutas protegidas con middleware `protect` + `requireAdmin`
- ✅ No se exponen detalles internos en mensajes de error
- ✅ Validación de ObjectId en parámetros
- ✅ Sanitización de inputs (trim en motivo de rechazo)
- ✅ Emails fallan gracefully sin romper flujo principal

---

**Testeado por:** Backend Developer
**Fecha:** 2025-01-20
**Resultado:** ✅ TODOS LOS TESTS PASADOS
**Server Status:** ✅ Running sin errores
