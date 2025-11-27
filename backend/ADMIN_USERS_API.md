# Admin Users API - Entre Amigas

## Endpoints de Gestión de Usuarios (Admin)

Todos los endpoints requieren:
- Autenticación válida (Bearer token)
- Rol de administrador (`role: 'admin'`)

Base URL: `http://localhost:8000/api/v1/admin/users`

---

## 1. GET /api/v1/admin/users

**Descripción**: Obtener todos los usuarios con paginación y búsqueda

**Acceso**: Admin only

### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 20 | Usuarios por página (máx: 100) |
| `search` | string | - | Busca en fullName, preferredName, email |
| `role` | string | - | Filtrar por rol: 'user' o 'admin' |
| `isActive` | string | - | Filtrar por estado: 'true' o 'false' |
| `isVerified` | string | - | Filtrar por verificación: 'true' o 'false' |
| `sortBy` | string | 'createdAt' | Campo para ordenar |
| `sortOrder` | string | 'desc' | Orden: 'asc' o 'desc' |

### Ejemplo Request

```bash
GET /api/v1/admin/users?page=1&limit=20&search=maria&role=user&isActive=true
Authorization: Bearer <token>
```

### Ejemplo Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "691f8f73a406673e689da04b",
        "fullName": "Maria Garcia",
        "preferredName": "Mari",
        "email": "maria@example.com",
        "phone": "+1234567890",
        "birthday": "1990-05-15T00:00:00.000Z",
        "city": "Toronto",
        "role": "user",
        "isVerified": true,
        "isActive": true,
        "authProvider": "local",
        "profileImage": null,
        "bio": "",
        "lastLogin": "2025-11-25T10:30:00.000Z",
        "createdAt": "2025-11-20T08:00:00.000Z",
        "updatedAt": "2025-11-25T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 9,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 2. GET /api/v1/admin/users/:id

**Descripción**: Obtener un usuario específico por ID

**Acceso**: Admin only

### Parámetros

- `id` (string) - MongoDB ObjectId del usuario

### Ejemplo Request

```bash
GET /api/v1/admin/users/691f8f73a406673e689da04b
Authorization: Bearer <token>
```

### Ejemplo Response

```json
{
  "success": true,
  "data": {
    "_id": "691f8f73a406673e689da04b",
    "fullName": "Maria Garcia",
    "preferredName": "Mari",
    "email": "maria@example.com",
    "phone": "+1234567890",
    "birthday": "1990-05-15T00:00:00.000Z",
    "city": "Toronto",
    "role": "user",
    "isVerified": true,
    "isActive": true,
    "authProvider": "local",
    "profileImage": null,
    "bio": "Hola soy Maria!",
    "lastLogin": "2025-11-25T10:30:00.000Z",
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
}
```

### Errores

- **404 Not Found**: Usuario no encontrado
- **400 Bad Request**: ID de usuario inválido

---

## 3. PUT /api/v1/admin/users/:id

**Descripción**: Actualizar usuario (datos personales, rol, estado)

**Acceso**: Admin only

### Parámetros

- `id` (string) - MongoDB ObjectId del usuario

### Request Body (todos opcionales)

```json
{
  "fullName": "Maria del Carmen Garcia",
  "preferredName": "Mari",
  "phone": "+1234567890",
  "city": "Toronto",
  "bio": "Mi biografía actualizada",
  "role": "admin",
  "isActive": true,
  "isVerified": true,
  "profileImage": "https://s3.amazonaws.com/..."
}
```

### Campos Permitidos

- `fullName` (string)
- `preferredName` (string)
- `phone` (string)
- `city` (string)
- `bio` (string)
- `role` (string) - 'user' o 'admin'
- `isActive` (boolean)
- `isVerified` (boolean)
- `profileImage` (string)

### Campos NO Permitidos

Los siguientes campos NO se pueden modificar desde este endpoint:
- `email`
- `password`
- `authProvider`
- `googleId`

### Restricciones

1. El admin NO puede cambiar su propio rol a 'user'
2. El admin NO puede desactivarse a sí mismo (`isActive: false`)

### Ejemplo Request

```bash
PUT /api/v1/admin/users/691f8f73a406673e689da04b
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin",
  "isVerified": true,
  "bio": "Usuario promovido a administrador"
}
```

### Ejemplo Response

```json
{
  "success": true,
  "data": {
    "_id": "691f8f73a406673e689da04b",
    "fullName": "Maria Garcia",
    "preferredName": "Mari",
    "email": "maria@example.com",
    "role": "admin",
    "isVerified": true,
    "isActive": true,
    "bio": "Usuario promovido a administrador",
    "updatedAt": "2025-11-25T15:45:00.000Z"
  },
  "message": "Usuario actualizado exitosamente"
}
```

### Errores

- **400 Bad Request**:
  - Campos prohibidos enviados
  - Sin campos válidos para actualizar
  - Rol inválido
  - Intento de cambiar propio rol
  - Intento de desactivarse a sí mismo
- **404 Not Found**: Usuario no encontrado

---

## 4. DELETE /api/v1/admin/users/:id

**Descripción**: Eliminar usuario (soft delete por defecto, hard delete opcional)

**Acceso**: Admin only

### Parámetros

- `id` (string) - MongoDB ObjectId del usuario

### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `hard` | string | 'false' | Si es 'true', elimina permanentemente |

### Soft Delete (Recomendado)

El soft delete marca al usuario como inactivo (`isActive: false`) pero mantiene sus datos.

**Ejemplo Request:**

```bash
DELETE /api/v1/admin/users/691f8f73a406673e689da04b
Authorization: Bearer <token>
```

**Ejemplo Response:**

```json
{
  "success": true,
  "message": "Usuario desactivado exitosamente",
  "data": {
    "user": {
      "_id": "691f8f73a406673e689da04b",
      "fullName": "Maria Garcia",
      "email": "maria@example.com",
      "isActive": false,
      "updatedAt": "2025-11-25T15:50:00.000Z"
    },
    "deletionType": "soft"
  }
}
```

### Hard Delete (Permanente)

El hard delete elimina permanentemente al usuario de la base de datos.

**Ejemplo Request:**

```bash
DELETE /api/v1/admin/users/691f8f73a406673e689da04b?hard=true
Authorization: Bearer <token>
```

**Ejemplo Response:**

```json
{
  "success": true,
  "message": "Usuario eliminado permanentemente",
  "data": {
    "deletedUserId": "691f8f73a406673e689da04b",
    "deletionType": "hard"
  }
}
```

### Restricciones

- El admin NO puede eliminarse a sí mismo

### Errores

- **400 Bad Request**:
  - Intento de eliminarse a sí mismo
  - ID de usuario inválido
- **404 Not Found**: Usuario no encontrado

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| `GET_USERS_ERROR` | Error al obtener lista de usuarios |
| `GET_USER_ERROR` | Error al obtener usuario específico |
| `USER_NOT_FOUND` | Usuario no encontrado |
| `INVALID_USER_ID` | ID de usuario inválido (CastError) |
| `FORBIDDEN_FIELDS` | Intento de modificar campos prohibidos |
| `NO_VALID_FIELDS` | No se proporcionaron campos válidos |
| `INVALID_ROLE` | Rol inválido (debe ser 'user' o 'admin') |
| `CANNOT_DEACTIVATE_SELF` | Admin intenta desactivarse |
| `CANNOT_CHANGE_OWN_ROLE` | Admin intenta cambiar su propio rol |
| `CANNOT_DELETE_SELF` | Admin intenta eliminarse |
| `VALIDATION_ERROR` | Error de validación de Mongoose |
| `UPDATE_USER_ERROR` | Error al actualizar usuario |
| `DELETE_USER_ERROR` | Error al eliminar usuario |

---

## Campos Excluidos en Respuestas

Por seguridad, los siguientes campos NUNCA se incluyen en las respuestas:

- `password`
- `verificationToken`
- `resetPasswordToken`
- `verificationTokenExpires`
- `resetPasswordExpires`

---

## Testing con cURL

### 1. Login como Admin

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@jappi.ca",
    "password": "Password123"
  }'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### 2. Obtener Todos los Usuarios

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Buscar Usuarios

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?search=maria&role=user&isActive=true" \
  -H "Authorization: Bearer <token>"
```

### 4. Actualizar Usuario

```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "isVerified": true
  }'
```

### 5. Desactivar Usuario (Soft Delete)

```bash
curl -X DELETE http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>"
```

### 6. Eliminar Usuario Permanentemente (Hard Delete)

```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b?hard=true" \
  -H "Authorization: Bearer <token>"
```

---

## Logs del Servidor

El controlador genera los siguientes logs:

```
✅ Usuario 691f8f73a406673e689da04b actualizado por admin 691f8f73a406673e689da04c
⚠️  Usuario 691f8f73a406673e689da04b desactivado (soft delete) por admin 691f8f73a406673e689da04c
🗑️  Usuario 691f8f73a406673e689da04b eliminado PERMANENTEMENTE por admin 691f8f73a406673e689da04c
❌ Error en getAllUsers (admin): <error>
```

---

## Integración con Frontend

El frontend ubicado en `/admin/users` espera esta estructura exacta de respuesta:

```javascript
// Respuesta de GET /api/v1/admin/users
{
  success: true,
  data: {
    users: [...],
    pagination: {
      page: 1,
      limit: 20,
      total: 9,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  }
}
```

Los campos de paginación son críticos:
- `hasNext` (no `hasNextPage`)
- `hasPrev` (no `hasPrevPage`)
