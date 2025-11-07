# 🔐 Authentication Middleware - Entre Amigas

Middleware de autenticación y autorización para proteger rutas y verificar permisos de usuarios.

## 📋 Configuración

### Dependencias

- `token.service.js` - Servicio de tokens JWT (TASK-003)
- `User` model - Modelo de usuario Mongoose (TASK-005 - pendiente)

### Variables de Entorno

```env
JWT_SECRET=tu_secreto_minimo_32_caracteres_requerido
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🚀 Middlewares Disponibles

### 1. **protect()** - Autenticación Requerida

Protege rutas que requieren autenticación. Verifica el token JWT y agrega el usuario a `req.user`.

**Uso:**

```javascript
import { protect } from './middleware/auth.middleware.js';

// Proteger una ruta
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/posts/:id', protect, deletePost);
```

**Funcionamiento:**

1. Extrae el token del header `Authorization: Bearer <token>`
2. Verifica el token JWT con `verifyToken()`
3. Busca el usuario en la base de datos (cuando el modelo esté disponible)
4. Agrega el usuario a `req.user`
5. Llama a `next()` si todo es correcto

**Respuestas de Error:**

```javascript
// Sin token
{
  "success": false,
  "message": "No autorizado. Token no proporcionado.",
  "code": "NO_TOKEN"
}

// Token inválido
{
  "success": false,
  "message": "Token inválido.",
  "code": "INVALID_TOKEN"
}

// Token expirado
{
  "success": false,
  "message": "Token expirado. Por favor inicia sesión nuevamente.",
  "code": "TOKEN_EXPIRED"
}

// Usuario no encontrado
{
  "success": false,
  "message": "Usuario no encontrado. Token inválido.",
  "code": "USER_NOT_FOUND"
}

// Tipo de token incorrecto (refresh en lugar de auth)
{
  "success": false,
  "message": "Tipo de token inválido.",
  "code": "INVALID_TOKEN_TYPE"
}
```

---

### 2. **authorize(...roles)** - Verificación de Roles

Verifica que el usuario autenticado tenga uno de los roles especificados. Debe usarse después de `protect()`.

**Uso:**

```javascript
import { protect, authorize } from './middleware/auth.middleware.js';

// Solo admin
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Admin o moderador
router.put('/posts/:id', protect, authorize('admin', 'moderator'), updatePost);

// Múltiples roles
router.get('/dashboard', protect, authorize('admin', 'staff', 'manager'), getDashboard);
```

**Funcionamiento:**

1. Verifica que `req.user` exista (debe haber pasado por `protect()`)
2. Compara `req.user.role` con los roles permitidos
3. Retorna 403 si el usuario no tiene ninguno de los roles requeridos
4. Llama a `next()` si el usuario está autorizado

**Respuestas de Error:**

```javascript
// Usuario no autenticado (protect no ejecutado)
{
  "success": false,
  "message": "No autenticado. Use el middleware protect() antes de authorize().",
  "code": "NOT_AUTHENTICATED"
}

// Usuario sin permisos
{
  "success": false,
  "message": "Acceso denegado. Se requiere uno de los siguientes roles: admin, moderator",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["admin", "moderator"],
  "userRole": "user"
}
```

**Roles Comunes:**

```javascript
'admin'      // Administrador (acceso total)
'moderator'  // Moderador (gestión de contenido)
'user'       // Usuario regular (default)
'guest'      // Invitado (acceso limitado)
```

---

### 3. **optionalAuth()** - Autenticación Opcional

Similar a `protect()`, pero no falla si no hay token. Útil para rutas públicas que tienen funcionalidad extra para usuarios autenticados.

**Uso:**

```javascript
import { optionalAuth } from './middleware/auth.middleware.js';

// Ruta pública con contenido adicional para usuarios autenticados
router.get('/posts', optionalAuth, getPosts);
router.get('/events', optionalAuth, getEvents);
```

**Funcionamiento:**

1. Intenta extraer y verificar el token
2. Si hay token válido: agrega usuario a `req.user`
3. Si NO hay token o es inválido: `req.user = null`
4. SIEMPRE llama a `next()` (nunca falla)

**Ejemplo de Uso en Controller:**

```javascript
export const getPosts = async (req, res) => {
  // Si el usuario está autenticado, mostrar posts privados también
  const query = req.user
    ? { $or: [{ public: true }, { author: req.user.id }] }
    : { public: true };

  const posts = await Post.find(query);

  res.json({
    success: true,
    posts,
    isAuthenticated: !!req.user
  });
};
```

---

### 4. **requireVerified()** - Email Verificado Requerido

Verifica que el usuario haya confirmado su email. Debe usarse después de `protect()`.

**Uso:**

```javascript
import { protect, requireVerified } from './middleware/auth.middleware.js';

// Requiere email verificado
router.post('/posts', protect, requireVerified, createPost);
router.post('/events', protect, requireVerified, createEvent);
```

**Funcionamiento:**

1. Verifica que `req.user` exista
2. Verifica que `req.user.isVerified === true`
3. Retorna 403 si el email no está verificado
4. Llama a `next()` si está verificado

**Respuesta de Error:**

```javascript
{
  "success": false,
  "message": "Por favor verifica tu email antes de realizar esta acción.",
  "code": "EMAIL_NOT_VERIFIED"
}
```

**Nota:** Este middleware está preparado para cuando el modelo User tenga el campo `isVerified`. Por ahora, asume que todos los usuarios están verificados (modo temporal).

---

### 5. **requireOwnership(paramName)** - Verificar Propiedad de Recurso

Verifica que el usuario sea el propietario del recurso o sea admin. Compara `req.user.id` con `req.params[paramName]`.

**Uso:**

```javascript
import { protect, requireOwnership } from './middleware/auth.middleware.js';

// Solo el usuario puede ver/editar su propio perfil
router.get('/users/:userId/profile', protect, requireOwnership('userId'), getProfile);
router.put('/users/:userId/profile', protect, requireOwnership('userId'), updateProfile);

// Con parámetro personalizado
router.delete('/posts/:authorId/comment', protect, requireOwnership('authorId'), deleteComment);
```

**Funcionamiento:**

1. Verifica que `req.user` exista
2. Obtiene el ID del recurso de `req.params[paramName]`
3. Compara `req.user.id` con el ID del recurso
4. Permite acceso si:
   - El usuario es el propietario (`req.user.id === resourceOwnerId`)
   - O el usuario es admin (`req.user.role === 'admin'`)
5. Retorna 403 si no cumple ninguna condición

**Respuestas de Error:**

```javascript
// Parámetro no encontrado
{
  "success": false,
  "message": "Parámetro 'userId' no encontrado en la URL.",
  "code": "MISSING_PARAM"
}

// Usuario no es propietario ni admin
{
  "success": false,
  "message": "No tienes permiso para acceder a este recurso.",
  "code": "NOT_RESOURCE_OWNER"
}
```

---

## 📚 Ejemplos de Uso Combinado

### Rutas de Usuario

```javascript
import { protect, authorize, requireOwnership } from './middleware/auth.middleware.js';

// Perfil público (sin auth)
router.get('/users/:id/public-profile', getPublicProfile);

// Perfil completo (requiere auth y ownership)
router.get('/users/:userId/profile', protect, requireOwnership('userId'), getProfile);

// Actualizar perfil (requiere auth y ownership)
router.put('/users/:userId', protect, requireOwnership('userId'), updateUser);

// Listar todos los usuarios (solo admin)
router.get('/users', protect, authorize('admin'), getAllUsers);

// Eliminar usuario (solo admin)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
```

### Rutas de Posts/Blog

```javascript
import { protect, authorize, optionalAuth, requireVerified } from './middleware/auth.middleware.js';

// Ver posts (público, con info adicional si estás autenticado)
router.get('/posts', optionalAuth, getPosts);

// Ver un post
router.get('/posts/:id', optionalAuth, getPost);

// Crear post (requiere auth y email verificado)
router.post('/posts', protect, requireVerified, createPost);

// Actualizar post (requiere auth y ser el autor)
router.put('/posts/:id', protect, checkPostOwnership, updatePost);

// Eliminar post (admin o autor)
router.delete('/posts/:id', protect, checkPostOwnership, deletePost);

// Destacar post (solo admin)
router.put('/posts/:id/feature', protect, authorize('admin'), featurePost);
```

### Rutas de Admin

```javascript
import { protect, authorize } from './middleware/auth.middleware.js';

// Dashboard (admin, staff, manager)
router.get('/admin/dashboard', protect, authorize('admin', 'staff', 'manager'), getDashboard);

// Gestión de usuarios (solo admin)
router.get('/admin/users', protect, authorize('admin'), getUsers);
router.put('/admin/users/:id/role', protect, authorize('admin'), changeUserRole);
router.post('/admin/users/:id/ban', protect, authorize('admin'), banUser);

// Estadísticas (admin y staff)
router.get('/admin/stats', protect, authorize('admin', 'staff'), getStatistics);
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Desde backend/
npm run test:auth

# O directamente
node test-auth-middleware.js
```

### Casos de Prueba

El script de testing verifica:

1. ✅ `protect()` sin token (debe fallar con 401)
2. ✅ `protect()` con token válido (debe pasar)
3. ✅ `protect()` con token inválido (debe fallar con 401)
4. ✅ `protect()` con refresh token (debe fallar - tipo incorrecto)
5. ✅ `authorize('admin')` con usuario admin (debe pasar)
6. ✅ `authorize('admin')` con usuario normal (debe fallar con 403)
7. ✅ `authorize('admin', 'moderator')` con usuario sin roles (debe fallar)
8. ✅ `optionalAuth()` sin token (debe pasar con `req.user = null`)
9. ✅ `optionalAuth()` con token válido (debe pasar con `req.user` asignado)
10. ✅ `requireOwnership()` con propietario (debe pasar)

**Resultado Esperado:**

```
🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!

📋 Middlewares probados:
   ✅ protect() - Autenticación requerida
   ✅ authorize() - Verificación de roles
   ✅ optionalAuth() - Autenticación opcional
   ✅ requireOwnership() - Verificación de propiedad

✨ Auth Middleware está listo para usar!
```

---

## 🔄 Flujo Completo de Autenticación

### 1. Usuario hace login

```javascript
// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Generar token de autenticación
  const token = generateAuthToken(user._id, {
    role: user.role,
    email: user.email
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
};
```

### 2. Frontend guarda el token

```javascript
// En el frontend (localStorage o secure cookie)
localStorage.setItem('token', token);

// O en HTTP-only cookie (más seguro)
// El backend ya lo haría con res.cookie()
```

### 3. Frontend envía el token en cada request

```javascript
// Axios
axios.get('/api/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// Fetch
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Axios interceptor (configurar una vez)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. Backend valida el token

```javascript
// En la ruta protegida
router.get('/profile', protect, async (req, res) => {
  // req.user ya está disponible (agregado por protect)
  const user = req.user;

  res.json({
    success: true,
    user
  });
});
```

---

## 🛡️ Seguridad

### Headers HTTP

El middleware espera el token en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**No usar:**
- Query parameters: `?token=xxx` ❌ (visible en logs)
- Body parameters: `{ token: 'xxx' }` ❌ (solo para POST)

### Verificación de Tipo de Token

El middleware verifica que el token sea de tipo `'auth'`:

```javascript
// Token válido para autenticación
{ id: 'xxx', type: 'auth', role: 'user' }

// Token de refresh (rechazado)
{ id: 'xxx', type: 'refresh' }
```

### Búsqueda en Base de Datos

Cuando el modelo User esté implementado, el middleware:

1. Verifica que el usuario exista en DB
2. Verifica que la cuenta esté activa (`isActive: true`)
3. Carga los datos frescos del usuario (no solo del token)

**Por qué es importante:**
- El usuario pudo haber sido eliminado
- El usuario pudo haber sido desactivado
- Los datos del usuario pudieron cambiar (role, etc.)

### Admin Bypass

En `requireOwnership()`, los admin siempre tienen acceso:

```javascript
const isAdmin = req.user.role === 'admin';

if (!isOwner && !isAdmin) {
  // Rechazar acceso
}
```

---

## 🚨 Troubleshooting

### Error: "No autorizado. Token no proporcionado"

**Causa:** El header `Authorization` no se está enviando.

**Solución:**
```javascript
// Verificar que el header se envíe correctamente
headers: {
  'Authorization': `Bearer ${token}` // Nota: "Bearer " con espacio
}
```

### Error: "Token inválido"

**Causas posibles:**
- Token mal formado
- JWT_SECRET diferente al usado para generar el token
- Token manipulado

**Solución:**
- Verificar que el JWT_SECRET sea el mismo en todos los entornos
- Generar un nuevo token con `generateAuthToken()`

### Error: "Token expirado"

**Causa:** El token superó su tiempo de expiración (default 7 días).

**Solución:**
- Implementar refresh tokens
- Solicitar al usuario que inicie sesión nuevamente

### Error: "Use el middleware protect() antes de authorize()"

**Causa:** Intentaste usar `authorize()` sin usar primero `protect()`.

**Solución:**
```javascript
// ❌ Incorrecto
router.delete('/users/:id', authorize('admin'), deleteUser);

// ✅ Correcto
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
```

### req.user es null o undefined

**Causa:** El middleware `protect()` no se ejecutó correctamente.

**Solución:**
- Verificar que `protect` esté en la cadena de middlewares
- Verificar que el token se esté enviando
- Verificar logs en modo desarrollo

---

## 📝 Notas de Implementación

### Estado Actual (Temporal)

Hasta que se implemente el modelo User (TASK-005), el middleware:

- ✅ Verifica y decodifica tokens JWT
- ✅ Verifica roles del payload del token
- ✅ Agrega `req.user` con datos del token
- ⏳ NO busca el usuario en la base de datos (preparado pero comentado)
- ⏳ NO verifica si el email está verificado (asume que sí)

### Cuando el Modelo User esté disponible

Descomentar las secciones marcadas con:

```javascript
// NOTA: Descomentar cuando el modelo User esté creado (TASK-005)
/*
const user = await User.findById(decoded.id).select('-password');
// ... resto del código
*/
```

Esto activará:
- ✅ Búsqueda de usuario en DB
- ✅ Verificación de cuenta activa
- ✅ Verificación de email confirmado
- ✅ Datos frescos del usuario en cada request

---

## 📊 Estructura de req.user

Después de pasar por `protect()` o `optionalAuth()`:

```javascript
req.user = {
  id: '507f1f77bcf86cd799439011',  // MongoDB ObjectId
  role: 'user',                      // Role del usuario
  email: 'user@example.com',         // Email del usuario
  _fromToken: true                   // Flag temporal (indica que viene del token)
}
```

Cuando el modelo User esté implementado:

```javascript
req.user = {
  _id: ObjectId('507f1f77bcf86cd799439011'),
  email: 'user@example.com',
  name: 'María García',
  role: 'user',
  isVerified: true,
  isActive: true,
  createdAt: Date,
  updatedAt: Date,
  // ... otros campos del modelo User
}
```

---

## 📚 Changelog

### v1.0.0 (2025-01-07)

- ✅ `protect()` - Middleware de autenticación requerida
- ✅ `authorize(...roles)` - Verificación de roles múltiples
- ✅ `optionalAuth()` - Autenticación opcional para rutas públicas
- ✅ `requireVerified()` - Verificar email confirmado
- ✅ `requireOwnership(paramName)` - Verificar propiedad de recurso con admin bypass
- ✅ Manejo completo de errores JWT (inválido, expirado, tipo incorrecto)
- ✅ Testing completo con 10 casos de prueba
- ✅ Documentación completa
- ✅ Preparado para integración con modelo User

---

## 👥 Contacto

Para soporte o preguntas sobre el middleware de autenticación:
- Email: dev@jappi.ca
- Proyecto: Entre Amigas
