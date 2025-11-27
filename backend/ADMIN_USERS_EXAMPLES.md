# Admin Users API - Ejemplos Prácticos

## Casos de Uso Comunes

### 1. Obtener Todos los Usuarios (Primera Página)

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
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
        "bio": "Hola, soy Maria!",
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

### 2. Buscar Usuarios por Nombre o Email

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?search=maria" \
  -H "Authorization: Bearer <token>"
```

**Búsqueda case-insensitive en:**
- fullName
- preferredName
- email

**Response:**
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
        "role": "user",
        "isActive": true
      },
      {
        "_id": "691f8f73a406673e689da04c",
        "fullName": "Ana Maria Lopez",
        "preferredName": "Ana",
        "email": "ana@example.com",
        "role": "user",
        "isActive": true
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3. Filtrar Solo Administradores

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?role=admin" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "691f8f73a406673e689da050",
        "fullName": "Admin User",
        "preferredName": "Admin",
        "email": "dev@jappi.ca",
        "role": "admin",
        "isVerified": true,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 4. Filtrar Usuarios Inactivos

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?isActive=false" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "691f8f73a406673e689da04d",
        "fullName": "Inactive User",
        "email": "inactive@example.com",
        "role": "user",
        "isActive": false,
        "isVerified": true
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 5. Filtrar Usuarios No Verificados

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?isVerified=false" \
  -H "Authorization: Bearer <token>"
```

**Uso:** Encontrar usuarios que necesitan verificar su email

---

### 6. Búsqueda Combinada

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?search=maria&role=user&isActive=true&isVerified=true" \
  -H "Authorization: Bearer <token>"
```

**Encuentra:** Usuarios activos, verificados, con rol 'user', cuyo nombre o email contenga 'maria'

---

### 7. Ordenar por Fecha de Creación (Más Recientes Primero)

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <token>"
```

---

### 8. Ordenar por Nombre Alfabéticamente

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?sortBy=fullName&sortOrder=asc" \
  -H "Authorization: Bearer <token>"
```

---

### 9. Paginación (Página 2, 5 usuarios por página)

**Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?page=2&limit=5" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [ ... 5 usuarios ... ],
    "pagination": {
      "page": 2,
      "limit": 5,
      "total": 9,
      "totalPages": 2,
      "hasNext": false,
      "hasPrev": true
    }
  }
}
```

---

### 10. Obtener Usuario Específico por ID

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>"
```

**Response:**
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
    "bio": "Hola, soy Maria!",
    "lastLogin": "2025-11-25T10:30:00.000Z",
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
}
```

---

### 11. Promover Usuario a Administrador

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "isVerified": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "691f8f73a406673e689da04b",
    "fullName": "Maria Garcia",
    "email": "maria@example.com",
    "role": "admin",
    "isVerified": true,
    "updatedAt": "2025-11-25T15:45:00.000Z"
  },
  "message": "Usuario actualizado exitosamente"
}
```

**Logs del Servidor:**
```
✅ Usuario 691f8f73a406673e689da04b actualizado por admin 691f8f73a406673e689da050
```

---

### 12. Verificar Usuario Manualmente

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isVerified": true
  }'
```

**Uso:** Verificar usuario sin que pase por el flujo de email

---

### 13. Actualizar Información Personal del Usuario

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Maria del Carmen Garcia",
    "phone": "+1234567891",
    "city": "Vancouver",
    "bio": "Biografía actualizada por admin"
  }'
```

---

### 14. Desactivar Usuario (Soft Delete)

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>"
```

**Response:**
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

**Logs del Servidor:**
```
⚠️  Usuario 691f8f73a406673e689da04b desactivado (soft delete) por admin 691f8f73a406673e689da050
```

**Notas:**
- El usuario NO se elimina de la base de datos
- Se marca como `isActive: false`
- Puede reactivarse con `PUT /admin/users/:id { isActive: true }`
- El usuario NO podrá iniciar sesión

---

### 15. Reactivar Usuario Desactivado

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "691f8f73a406673e689da04b",
    "isActive": true,
    "updatedAt": "2025-11-25T16:00:00.000Z"
  },
  "message": "Usuario actualizado exitosamente"
}
```

---

### 16. Eliminar Usuario Permanentemente (Hard Delete)

**Request:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b?hard=true" \
  -H "Authorization: Bearer <token>"
```

**Response:**
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

**Logs del Servidor:**
```
🗑️  Usuario 691f8f73a406673e689da04b eliminado PERMANENTEMENTE por admin 691f8f73a406673e689da050
```

**ADVERTENCIA:**
- Acción IRREVERSIBLE
- Todos los datos del usuario se pierden
- Usar solo en casos excepcionales
- Recomendación: Usar soft delete en su lugar

---

## Casos de Error

### Error 1: Intento de Cambiar Email (Campo Prohibido)

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Los siguientes campos no pueden ser modificados: email",
  "code": "FORBIDDEN_FIELDS",
  "forbiddenFields": ["email"]
}
```

---

### Error 2: Admin Intenta Desactivarse a Sí Mismo

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da050 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "No puedes desactivar tu propia cuenta",
  "code": "CANNOT_DEACTIVATE_SELF"
}
```

---

### Error 3: Admin Intenta Cambiar Su Propio Rol

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da050 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "No puedes cambiar tu propio rol de administrador",
  "code": "CANNOT_CHANGE_OWN_ROLE"
}
```

---

### Error 4: Admin Intenta Eliminarse a Sí Mismo

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da050 \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": false,
  "message": "No puedes eliminar tu propia cuenta",
  "code": "CANNOT_DELETE_SELF"
}
```

---

### Error 5: Usuario No Encontrado

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da999 \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "code": "USER_NOT_FOUND"
}
```

---

### Error 6: ID Inválido

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users/invalid-id \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": false,
  "message": "ID de usuario inválido",
  "code": "INVALID_USER_ID"
}
```

---

### Error 7: Sin Token de Autenticación

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users
```

**Response:**
```json
{
  "success": false,
  "message": "No autorizado. Token no proporcionado.",
  "code": "NO_TOKEN"
}
```

---

### Error 8: Usuario Sin Permisos de Admin

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer <token-de-usuario-normal>"
```

**Response:**
```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere uno de los siguientes roles: admin",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["admin"],
  "userRole": "user"
}
```

---

### Error 9: Rol Inválido

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/691f8f73a406673e689da04b \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "superadmin"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Rol inválido. Debe ser \"user\" o \"admin\"",
  "code": "INVALID_ROLE"
}
```

---

## JavaScript/TypeScript Examples

### Fetch API (Frontend)

```javascript
// 1. Login
async function login() {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'dev@jappi.ca',
      password: 'Password123',
    }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('authToken', data.data.token);
    return data.data.token;
  }
}

// 2. Obtener usuarios
async function getUsers(page = 1, limit = 20, search = '') {
  const token = localStorage.getItem('authToken');
  const url = new URL('http://localhost:8000/api/v1/admin/users');
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);
  if (search) url.searchParams.set('search', search);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
}

// 3. Actualizar usuario
async function updateUser(userId, updates) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return await response.json();
}

// 4. Desactivar usuario
async function deactivateUser(userId) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
}
```

### Axios (Node.js Backend)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all users
const users = await api.get('/admin/users', {
  params: {
    page: 1,
    limit: 20,
    search: 'maria',
  },
});

// Update user
const updated = await api.put(`/admin/users/${userId}`, {
  role: 'admin',
  isVerified: true,
});

// Delete user
const deleted = await api.delete(`/admin/users/${userId}`);
```

---

## React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchUsers = async (page = 1, limit = 20, search = '') => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const url = new URL('http://localhost:8000/api/v1/admin/users');
      url.searchParams.set('page', page);
      url.searchParams.set('limit', limit);
      if (search) url.searchParams.set('search', search);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
  };
}

// Usage
function AdminUsersPage() {
  const { users, loading, error, pagination, fetchUsers } = useAdminUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users ({pagination?.total})</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.fullName} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
