# Admin Users Management - Setup & Testing

## Archivos Implementados

### 1. Controlador
**Ubicación**: `src/controllers/admin.user.controller.js`

Contiene 4 funciones principales:
- `getAllUsers()` - Listar usuarios con paginación y búsqueda
- `getUserById()` - Obtener usuario específico
- `updateUser()` - Actualizar usuario
- `deleteUser()` - Eliminar usuario (soft/hard delete)

### 2. Rutas
**Ubicación**: `src/routes/admin.user.routes.js`

Rutas registradas:
- `GET /api/v1/admin/users` - Listar usuarios
- `GET /api/v1/admin/users/:id` - Ver usuario
- `PUT /api/v1/admin/users/:id` - Actualizar usuario
- `DELETE /api/v1/admin/users/:id` - Eliminar usuario

### 3. Registro en Index
**Ubicación**: `src/routes/index.js` (línea 79)

```javascript
router.use('/admin/users', adminUserRoutes);
```

---

## Instalación y Ejecución

### Prerequisitos

1. MongoDB corriendo (local o Atlas)
2. Variables de entorno configuradas (`.env`)
3. Dependencias instaladas

### Pasos

```bash
# 1. Navegar al directorio backend
cd c:\dev\12ea\backend

# 2. Instalar dependencias (si no están instaladas)
npm install

# 3. Copiar .env.example a .env (si no existe)
cp .env.example .env

# 4. Configurar variables de entorno en .env
# - MONGODB_URI
# - JWT_SECRET
# - PORT (default: 8000)

# 5. Iniciar servidor
npm run dev
```

### Verificar que el servidor arrancó correctamente

Deberías ver:
```
🔐 Token Service configurado
⏱️  JWT expira en: 7d
📧 Resend Email Service configurado
🚀 Servidor corriendo en http://localhost:8000
✅ MongoDB conectado: <nombre-db>
```

---

## Testing

### Opción 1: Script de Prueba Automatizado

```bash
# Con el servidor corriendo en otra terminal:
node test-admin-users.js
```

Este script ejecuta 7 tests:
1. Login como admin
2. Obtener todos los usuarios
3. Buscar usuarios
4. Obtener usuario por ID
5. Actualizar usuario
6. Validar campos prohibidos
7. Verificar paginación

### Opción 2: Testing Manual con cURL

#### 1. Login como Admin

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"dev@jappi.ca\",\"password\":\"Password123\"}"
```

Copiar el `token` de la respuesta y usarlo en los siguientes requests.

#### 2. Obtener Todos los Usuarios

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 3. Buscar Usuarios

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?search=maria&role=user" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 4. Obtener Usuario por ID

```bash
curl -X GET http://localhost:8000/api/v1/admin/users/USER_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 5. Actualizar Usuario

```bash
curl -X PUT http://localhost:8000/api/v1/admin/users/USER_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"bio\":\"Actualizado desde cURL\"}"
```

#### 6. Desactivar Usuario (Soft Delete)

```bash
curl -X DELETE http://localhost:8000/api/v1/admin/users/USER_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 7. Eliminar Usuario Permanentemente

```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/users/USER_ID?hard=true" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Opción 3: Testing con Postman/Insomnia

1. Importar la colección desde `ADMIN_USERS_API.md`
2. Configurar variable de entorno `{{baseUrl}}` = `http://localhost:8000/api/v1`
3. Hacer login y guardar token en variable `{{authToken}}`
4. Ejecutar requests

---

## Estructura de Respuestas

### Éxito

```json
{
  "success": true,
  "data": { ... },
  "message": "Usuario actualizado exitosamente" // Opcional
}
```

### Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "errors": [...] // Opcional (validaciones)
}
```

---

## Validaciones Implementadas

### GET /admin/users
- Paginación: `limit` máximo de 100
- Búsqueda: case-insensitive en fullName, preferredName, email
- Filtros: role, isActive, isVerified
- Ordenamiento: configurable

### GET /admin/users/:id
- Validación de ObjectId válido
- Usuario debe existir

### PUT /admin/users/:id
- Solo campos permitidos: fullName, preferredName, phone, city, bio, role, isActive, isVerified, profileImage
- Campos prohibidos: email, password, authProvider, googleId
- Rol válido: 'user' o 'admin'
- No puede cambiar su propio rol
- No puede desactivarse a sí mismo
- Al menos 1 campo para actualizar

### DELETE /admin/users/:id
- No puede eliminarse a sí mismo
- Usuario debe existir
- Soft delete por defecto (isActive: false)
- Hard delete opcional con ?hard=true

---

## Seguridad

### Campos Sensibles Excluidos

Los siguientes campos NUNCA se retornan en las respuestas:
- `password`
- `verificationToken`
- `resetPasswordToken`
- `verificationTokenExpires`
- `resetPasswordExpires`

### Protecciones

- Todas las rutas requieren autenticación (JWT token válido)
- Todas las rutas requieren rol de admin
- Admin no puede eliminarse/desactivarse a sí mismo
- Admin no puede cambiar su propio rol
- Validaciones de Mongoose en todas las actualizaciones

---

## Logs del Servidor

El servidor genera logs informativos:

```
✅ Usuario 691f8f73a406673e689da04b actualizado por admin 691f8f73a406673e689da04c
⚠️  Usuario 691f8f73a406673e689da04b desactivado (soft delete) por admin 691f8f73a406673e689da04c
🗑️  Usuario 691f8f73a406673e689da04b eliminado PERMANENTEMENTE por admin 691f8f73a406673e689da04c
❌ Error en getAllUsers (admin): <mensaje de error>
```

---

## Troubleshooting

### Error: "Cannot find module 'express'"

```bash
npm install
```

### Error: "EADDRINUSE: address already in use :::8000"

Puerto 8000 ya está en uso. Opciones:
1. Cerrar proceso existente
2. Cambiar puerto en `.env`: `PORT=8001`

### Error: "MongoServerError: Authentication failed"

Verificar credenciales de MongoDB en `.env`:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
```

### Error: "No autorizado. Token no proporcionado"

Verificar que el header `Authorization` incluye el token:
```
Authorization: Bearer <token>
```

### Error: "Acceso denegado. Se requiere rol: admin"

El usuario no tiene rol de admin. Verificar en la base de datos:
```javascript
// MongoDB Shell
db.users.updateOne(
  { email: "dev@jappi.ca" },
  { $set: { role: "admin" } }
)
```

### Error: "Usuario no encontrado"

El ID proporcionado no existe o es inválido. Verificar:
```bash
# Listar usuarios para obtener IDs válidos
curl -X GET "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer TOKEN"
```

---

## Próximos Pasos

1. Ejecutar tests: `node test-admin-users.js`
2. Verificar frontend en `/admin/users`
3. Probar integración completa
4. Revisar logs para validar funcionamiento

---

## Contacto y Soporte

Para reportar bugs o solicitar mejoras, revisar:
- Documentación completa en `ADMIN_USERS_API.md`
- Código fuente en `src/controllers/admin.user.controller.js`
- Rutas en `src/routes/admin.user.routes.js`
