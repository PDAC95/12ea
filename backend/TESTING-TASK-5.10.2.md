# Testing Guide - Task 5.10.2: Backend Endpoint para Propuestas

**Sprint:** 5
**Task:** 5.10.2 - Backend Endpoint para Propuestas de Eventos
**Status:** ✅ COMPLETADO
**Fecha:** 2025-01-20

---

## 📋 RESUMEN

Se implementó endpoint POST `/api/v1/events/propose` que permite a usuarios autenticados proponer eventos para revisión de admin.

**Características implementadas:**
- ✅ Endpoint protegido con autenticación JWT
- ✅ Validación completa de campos requeridos y condicionales
- ✅ Evento creado con status "pending" y isActive=false
- ✅ Organizer = usuario autenticado
- ✅ Manejo robusto de errores

---

## 🧪 TESTING MANUAL

### Pre-requisitos

1. ✅ Backend corriendo en http://localhost:5000 (o puerto configurado)
2. ✅ MongoDB conectado
3. ✅ Usuario registrado con token JWT válido

### Obtener Token JWT

**Opción A: Registrar nuevo usuario**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "María Test Propuesta",
    "preferredName": "María",
    "email": "maria.propuesta@test.com",
    "phone": "+1 (519) 123-4567",
    "birthday": "1990-01-01",
    "city": "Toronto",
    "password": "Test1234",
    "confirmPassword": "Test1234"
  }'
```

**Opción B: Login con usuario existente**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
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

---

## ✅ TEST 1: Propuesta de Evento Presencial (Success)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Taller de Emprendimiento para Mujeres",
    "description": "Aprende a iniciar tu negocio en Canadá con mentoras experimentadas. Cubriremos: plan de negocios, registro legal, impuestos y marketing digital.",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "presencial",
    "location": "123 Main Street, Toronto, ON",
    "capacity": 30,
    "image": "https://images.unsplash.com/photo-1521791136064-7986c2920216"
  }'
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Propuesta de evento enviada exitosamente. Será revisada por un administrador.",
  "data": {
    "_id": "679abc123def456...",
    "title": "Taller de Emprendimiento para Mujeres",
    "description": "Aprende a iniciar tu negocio en Canadá...",
    "date": "2025-02-15T00:00:00.000Z",
    "time": "14:00",
    "mode": "presencial",
    "location": "123 Main Street, Toronto, ON",
    "link": null,
    "capacity": 30,
    "image": "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    "status": "pending",
    "isActive": false,
    "organizer": "679user123...",
    "createdAt": "2025-01-20T..."
  }
}
```

**Verificaciones:**
- ✅ Status code = 201
- ✅ success = true
- ✅ data.status = "pending"
- ✅ data.isActive = false
- ✅ data.organizer = ID del usuario autenticado
- ✅ Console log del backend muestra: "📝 Nueva propuesta de evento recibida..."

---

## ✅ TEST 2: Propuesta de Evento Virtual (Success)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Conversatorio: Salud Mental en la Migración",
    "description": "Conversemos sobre los desafíos emocionales de migrar y estrategias de autocuidado.",
    "date": "2025-03-10",
    "time": "19:00",
    "mode": "virtual",
    "link": "https://zoom.us/j/123456789",
    "capacity": 50
  }'
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Propuesta de evento enviada exitosamente. Será revisada por un administrador.",
  "data": {
    "_id": "...",
    "title": "Conversatorio: Salud Mental en la Migración",
    "mode": "virtual",
    "link": "https://zoom.us/j/123456789",
    "location": null,
    "status": "pending",
    "isActive": false
  }
}
```

**Verificaciones:**
- ✅ Status code = 201
- ✅ data.mode = "virtual"
- ✅ data.link existe y es correcto
- ✅ data.location = null (no requerido para virtual)

---

## ❌ TEST 3: Campos Requeridos Faltantes (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento sin descripción",
    "date": "2025-02-15"
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Campos requeridos faltantes",
  "details": {
    "required": ["title", "description", "date", "time", "mode", "capacity"],
    "received": ["title", "date"]
  }
}
```

**Verificaciones:**
- ✅ Status code = 400
- ✅ success = false
- ✅ Mensaje claro sobre campos faltantes

---

## ❌ TEST 4: Modalidad Inválida (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento con modalidad incorrecta",
    "description": "Descripción del evento",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "remoto",
    "capacity": 30
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Modalidad inválida. Debe ser: virtual, presencial, híbrido"
}
```

---

## ❌ TEST 5: Location Faltante en Evento Presencial (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento Presencial sin Location",
    "description": "Descripción del evento",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "presencial",
    "capacity": 30
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "La ubicación es requerida para eventos presenciales o híbridos"
}
```

---

## ❌ TEST 6: Link Faltante en Evento Virtual (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento Virtual sin Link",
    "description": "Descripción del evento",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "virtual",
    "capacity": 30
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "El link es requerido para eventos virtuales o híbridos"
}
```

---

## ❌ TEST 7: Fecha Pasada (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento con Fecha Pasada",
    "description": "Descripción del evento",
    "date": "2020-01-01",
    "time": "14:00",
    "mode": "virtual",
    "link": "https://zoom.us/j/123",
    "capacity": 30
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "La fecha del evento debe ser futura"
}
```

---

## ❌ TEST 8: Capacidad Inválida (Error 400)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Evento con Capacidad Inválida",
    "description": "Descripción del evento",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "virtual",
    "link": "https://zoom.us/j/123",
    "capacity": 2000
  }'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "La capacidad debe estar entre 1 y 1000 personas"
}
```

---

## ❌ TEST 9: Sin Autenticación (Error 401)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/events/propose \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Evento sin Token",
    "description": "Descripción del evento",
    "date": "2025-02-15",
    "time": "14:00",
    "mode": "virtual",
    "link": "https://zoom.us/j/123",
    "capacity": 30
  }'
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "No autorizado"
}
```

---

## 🔍 VERIFICACIÓN EN BASE DE DATOS

Después de crear una propuesta exitosa, verifica en MongoDB:

```javascript
// MongoDB Shell o Compass
db.events.find({ status: "pending" }).pretty()
```

**Expected Result:**

```json
{
  "_id": ObjectId("679abc123..."),
  "title": "Taller de Emprendimiento para Mujeres",
  "status": "pending",
  "isActive": false,
  "organizer": ObjectId("679user123..."),
  "date": ISODate("2025-02-15T00:00:00.000Z"),
  "createdAt": ISODate("2025-01-20T..."),
  "updatedAt": ISODate("2025-01-20T...")
}
```

---

## 📊 CHECKLIST DE VALIDACIÓN

### Funcionalidad
- [x] Endpoint POST /api/v1/events/propose responde correctamente
- [x] Requiere autenticación JWT (middleware protect)
- [x] Evento creado con status "pending"
- [x] Evento creado con isActive=false
- [x] organizer guardado correctamente

### Validaciones
- [x] Campos requeridos validados
- [x] Modalidad validada (virtual/presencial/híbrido)
- [x] Validación condicional de location (presencial/híbrido)
- [x] Validación condicional de link (virtual/híbrido)
- [x] Fecha futura validada
- [x] Capacidad validada (1-1000)

### Error Handling
- [x] 400 para campos faltantes
- [x] 400 para validaciones fallidas
- [x] 401 sin autenticación
- [x] Mensajes de error claros y descriptivos

### Response Format
- [x] Response 201 con estructura estándar
- [x] success: true/false
- [x] message descriptivo
- [x] data con evento creado

### Logs
- [x] Console log de nueva propuesta con detalles
- [x] Log incluye: ID, título, usuario, fecha, modalidad

---

## 🚀 PRÓXIMOS PASOS

Con el endpoint implementado, el siguiente paso es:

**Task 5.10.3: Admin Approval Workflow**
- Endpoint PATCH `/api/v1/admin/events/:id/approve`
- Endpoint PATCH `/api/v1/admin/events/:id/reject`
- Admin puede ver lista de eventos pendientes
- Sistema de notificaciones por email

---

**Testeado por:** Backend Developer
**Fecha:** 2025-01-20
**Resultado:** ✅ TODOS LOS TESTS PASADOS
