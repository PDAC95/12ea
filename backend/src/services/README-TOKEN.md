# 🔐 Token Service - JWT & Random Tokens

Servicio completo de generación y verificación de tokens para autenticación en la plataforma Entre Amigas.

## 📋 Configuración

### Variables de Entorno Requeridas

```env
JWT_SECRET=tu_secreto_minimo_32_caracteres_requerido
JWT_EXPIRE=7d
```

### Dependencias

Ya están instaladas en el proyecto:

```bash
npm install jsonwebtoken
```

El módulo `crypto` de Node.js se usa nativamente (no requiere instalación).

---

## 🚀 Uso

### Importar el Servicio

```javascript
import {
  generateAuthToken,
  verifyToken,
  generateVerificationToken,
  generateResetToken,
  hashToken,
  generateRefreshToken,
  decodeToken,
  getTokenExpiration,
} from './services/token.service.js';
```

---

## 🔑 Funciones Disponibles

### 1. **generateAuthToken(userId, additionalPayload)**

Genera un token JWT de autenticación con expiración de 7 días (configurable).

**Parámetros:**
- `userId` (string, requerido): ID del usuario (MongoDB ObjectId)
- `additionalPayload` (object, opcional): Datos adicionales para incluir en el token

**Retorna:** `string` - Token JWT firmado

**Ejemplo:**

```javascript
// Token básico
const token = generateAuthToken('507f1f77bcf86cd799439011');

// Token con datos adicionales
const token = generateAuthToken('507f1f77bcf86cd799439011', {
  role: 'admin',
  email: 'admin@example.com',
  permissions: ['read', 'write', 'delete']
});

// Enviar en respuesta HTTP
res.json({
  success: true,
  token,
  user: { id: userId, role: 'user' }
});
```

**Payload del token:**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "type": "auth",
  "role": "admin",
  "email": "admin@example.com",
  "iat": 1762543593,
  "exp": 1763148393
}
```

---

### 2. **verifyToken(token)**

Verifica un token JWT y retorna el payload decodificado.

**Parámetros:**
- `token` (string, requerido): Token JWT a verificar

**Retorna:** `object` - Payload decodificado del token

**Throws:** `Error` - Si el token es inválido o ha expirado

**Ejemplo:**

```javascript
try {
  const decoded = verifyToken(token);
  console.log('Usuario autenticado:', decoded.id);
  console.log('Role:', decoded.role);

  // Usar en middleware de autenticación
  req.user = decoded;
  next();
} catch (error) {
  if (error.message === 'Token expirado') {
    return res.status(401).json({ message: 'Sesión expirada' });
  }
  return res.status(401).json({ message: 'Token inválido' });
}
```

---

### 3. **generateVerificationToken()**

Genera un token random seguro de 64 caracteres para verificación de email.

**Parámetros:** Ninguno

**Retorna:** `string` - Token hexadecimal de 64 caracteres

**Ejemplo:**

```javascript
// En registro de usuario
const user = await User.create({ email, password, name });

// Generar token de verificación
const verificationToken = generateVerificationToken();

// Hashear token para guardar en DB (seguridad)
const hashedToken = hashToken(verificationToken);

// Guardar en DB
user.verificationToken = hashedToken;
user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
await user.save();

// Enviar token original por email (no el hash)
await sendVerificationEmail(user.email, user.name, verificationToken);

// Token generado: "a1b2c3d4e5f6..." (64 caracteres hex)
```

---

### 4. **generateResetToken()**

Genera un token random seguro de 64 caracteres para reset de contraseña.

**Parámetros:** Ninguno

**Retorna:** `string` - Token hexadecimal de 64 caracteres

**Ejemplo:**

```javascript
// En "forgot password"
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({ message: 'Usuario no encontrado' });
}

// Generar token de reset
const resetToken = generateResetToken();

// Hashear token para guardar en DB
const hashedToken = hashToken(resetToken);

// Guardar en DB
user.resetPasswordToken = hashedToken;
user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
await user.save();

// Enviar token original por email
await sendPasswordResetEmail(user.email, user.name, resetToken);

// Token generado: "x9y8z7w6v5u4..." (64 caracteres hex)
```

---

### 5. **hashToken(token)**

Hashea un token usando SHA256 para almacenamiento seguro en base de datos.

**Parámetros:**
- `token` (string, requerido): Token a hashear

**Retorna:** `string` - Hash SHA256 del token (64 caracteres hex)

**Ejemplo:**

```javascript
// Generar y hashear token
const verificationToken = generateVerificationToken();
const hashedToken = hashToken(verificationToken);

// Guardar hash en DB (no el token original)
user.verificationToken = hashedToken;
await user.save();

// Enviar token original por email
await sendVerificationEmail(user.email, user.name, verificationToken);

// Verificar token cuando el usuario hace clic en el link
const receivedToken = req.query.token;
const hashedReceivedToken = hashToken(receivedToken);

const user = await User.findOne({
  verificationToken: hashedReceivedToken,
  verificationTokenExpires: { $gt: Date.now() }
});

if (!user) {
  return res.status(400).json({ message: 'Token inválido o expirado' });
}

// Token válido - marcar como verificado
user.isVerified = true;
user.verificationToken = undefined;
user.verificationTokenExpires = undefined;
await user.save();
```

**¿Por qué hashear?**
- 🔒 Si la base de datos es comprometida, los tokens no son utilizables directamente
- ✅ Similar a cómo se hashean las contraseñas con bcrypt
- 🛡️ Mejor práctica de seguridad

---

### 6. **generateRefreshToken(userId)** ⭐ BONUS

Genera un refresh token JWT con expiración de 30 días.

**Parámetros:**
- `userId` (string, requerido): ID del usuario

**Retorna:** `string` - Refresh token JWT

**Ejemplo:**

```javascript
// En login exitoso
const authToken = generateAuthToken(user._id, { role: user.role });
const refreshToken = generateRefreshToken(user._id);

// Guardar refresh token en DB o en cookie HTTP-only
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
});

res.json({
  success: true,
  token: authToken,
  expiresIn: '7d'
});
```

**Implementar endpoint de refresh:**

```javascript
// POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    // Generar nuevo access token
    const newAuthToken = generateAuthToken(decoded.id);

    res.json({
      success: true,
      token: newAuthToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
```

---

### 7. **decodeToken(token)** 🐛 Debug Only

Decodifica un token JWT sin verificar la firma. **Solo para debugging.**

⚠️ **ADVERTENCIA:** No usar para autenticación, ya que no verifica la firma.

**Parámetros:**
- `token` (string, requerido): Token JWT

**Retorna:** `object` - Payload decodificado (sin verificar)

**Ejemplo:**

```javascript
// Para debugging o logging
const decoded = decodeToken(token);
console.log('Token info (sin verificar):', decoded);
console.log('User ID:', decoded.id);
console.log('Expira:', new Date(decoded.exp * 1000));
```

---

### 8. **getTokenExpiration(token)**

Obtiene información sobre la expiración de un token.

**Parámetros:**
- `token` (string, requerido): Token JWT

**Retorna:** `object` - Información de expiración

```typescript
{
  expiresAt: Date,          // Fecha de expiración
  expiresInSeconds: number, // Segundos hasta expiración
  isExpired: boolean        // true si ya expiró
}
```

**Ejemplo:**

```javascript
const expInfo = getTokenExpiration(token);

console.log('Expira en:', Math.floor(expInfo.expiresInSeconds / 86400), 'días');
console.log('Fecha de expiración:', expInfo.expiresAt.toLocaleString());

if (expInfo.isExpired) {
  console.log('❌ Token expirado');
} else {
  console.log('✅ Token válido');
}

// Avisar al usuario si el token está próximo a expirar
if (expInfo.expiresInSeconds < 3600) { // Menos de 1 hora
  res.json({
    ...data,
    warning: 'Tu sesión expirará pronto'
  });
}
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Desde backend/
npm run test:tokens

# O directamente
node test-token-service.js
```

### Resultado Esperado

```
🧪 Prueba de Token Service
============================================================

📧 Variables de entorno:
   - JWT_SECRET: ✅ Configurado
   - JWT_EXPIRE: 7d

1️⃣  Generar Token de Autenticación (JWT)
✅ Token generado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

2️⃣  Verificar Token JWT
✅ Token verificado exitosamente

... (todas las pruebas) ...

✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE
```

---

## 🔄 Flujo Completo de Autenticación

### Registro de Usuario

```javascript
// POST /api/auth/register
export const register = async (req, res) => {
  const { email, password, name } = req.body;

  // 1. Crear usuario
  const user = await User.create({ email, password, name });

  // 2. Generar token de verificación
  const verificationToken = generateVerificationToken();
  const hashedToken = hashToken(verificationToken);

  user.verificationToken = hashedToken;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  // 3. Enviar email de verificación
  await sendVerificationEmail(user.email, user.name, verificationToken);

  res.status(201).json({
    success: true,
    message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.'
  });
};
```

### Verificar Email

```javascript
// GET /api/auth/verify-email?token=xxx
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  // 1. Hashear el token recibido
  const hashedToken = hashToken(token);

  // 2. Buscar usuario con el token
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }

  // 3. Marcar como verificado
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // 4. Generar token de autenticación
  const authToken = generateAuthToken(user._id, {
    role: user.role,
    email: user.email
  });

  // 5. Enviar email de bienvenida
  await sendWelcomeEmail(user.email, user.name);

  res.json({
    success: true,
    message: 'Email verificado exitosamente',
    token: authToken
  });
};
```

### Login

```javascript
// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Buscar usuario
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // 2. Verificar que el email esté verificado
  if (!user.isVerified) {
    return res.status(401).json({
      message: 'Por favor verifica tu email antes de iniciar sesión'
    });
  }

  // 3. Generar tokens
  const authToken = generateAuthToken(user._id, {
    role: user.role,
    email: user.email
  });

  const refreshToken = generateRefreshToken(user._id);

  // 4. Guardar refresh token en cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    token: authToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
};
```

### Forgot Password

```javascript
// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Por seguridad, no revelar si el email existe
    return res.json({
      success: true,
      message: 'Si el email existe, recibirás un link de recuperación'
    });
  }

  // 1. Generar token de reset
  const resetToken = generateResetToken();
  const hashedToken = hashToken(resetToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
  await user.save();

  // 2. Enviar email de reset
  await sendPasswordResetEmail(user.email, user.name, resetToken);

  res.json({
    success: true,
    message: 'Si el email existe, recibirás un link de recuperación'
  });
};
```

### Reset Password

```javascript
// POST /api/auth/reset-password?token=xxx
export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  // 1. Hashear el token recibido
  const hashedToken = hashToken(token);

  // 2. Buscar usuario con el token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }

  // 3. Actualizar contraseña
  user.password = password; // El modelo lo hasheará con bcrypt
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // 4. Enviar email de confirmación
  await sendPasswordChangedEmail(user.email, user.name);

  res.json({
    success: true,
    message: 'Contraseña actualizada exitosamente'
  });
};
```

---

## 🔐 Seguridad

### Mejores Prácticas Implementadas

✅ **JWT Secret fuerte:** Mínimo 32 caracteres
✅ **Tokens hasheados en DB:** Los tokens de verificación y reset se hashean con SHA256
✅ **Expiración corta para auth tokens:** 7 días por defecto
✅ **Refresh tokens de larga duración:** 30 días con tipo específico
✅ **Verificación de firma JWT:** Siempre verificar con `verifyToken()`
✅ **Tokens random seguros:** Usa `crypto.randomBytes()` (32 bytes)
✅ **Type checks:** Los tokens incluyen un campo `type` para diferenciar auth/refresh

### Recomendaciones Adicionales

1. **Rotar JWT_SECRET en producción** periódicamente
2. **Usar HTTPS** en producción para proteger tokens en tránsito
3. **Implementar blacklist de tokens** si se requiere logout forzado
4. **Rate limiting** en endpoints de auth (login, register, forgot-password)
5. **Logging de intentos fallidos** para detectar ataques
6. **2FA opcional** para usuarios admin

---

## 📊 Estructura de Tokens

### Auth Token (JWT)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "type": "auth",
  "role": "user",
  "email": "user@example.com",
  "iat": 1762543593,
  "exp": 1763148393
}
```

### Refresh Token (JWT)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "type": "refresh",
  "iat": 1762543593,
  "exp": 1765135593
}
```

### Verification Token (Random)

```
Original: a1b2c3d4e5f6789... (64 chars hex)
Hashed:   9f8e7d6c5b4a321... (64 chars hex - guardado en DB)
```

### Reset Token (Random)

```
Original: x9y8z7w6v5u4t3s... (64 chars hex)
Hashed:   1a2b3c4d5e6f7g8... (64 chars hex - guardado en DB)
```

---

## 🚨 Troubleshooting

### Error: "JWT_SECRET no está definido"

Verifica que el archivo `.env` contenga:

```env
JWT_SECRET=tu_secreto_minimo_32_caracteres_requerido
```

### Error: "Token inválido"

- El token fue modificado
- El JWT_SECRET cambió
- El token no es un JWT válido

### Error: "Token expirado"

- El token superó su tiempo de expiración (default 7d para auth, 30d para refresh)
- Implementar refresh token rotation para renovar automáticamente

### Tokens de verificación no funcionan

- Asegúrate de hashear el token antes de buscarlo en DB
- Verifica que la expiración no haya pasado
- Compara el hash, no el token original

---

## 📝 Changelog

### v1.0.0 (2025-01-07)

- ✅ Función generateAuthToken() - JWT con expiración configurable
- ✅ Función verifyToken() - Verificación de JWT con manejo de errores
- ✅ Función generateVerificationToken() - Token random 64 chars
- ✅ Función generateResetToken() - Token random 64 chars
- ✅ Función hashToken() - SHA256 para almacenamiento seguro
- ✅ BONUS: generateRefreshToken() - JWT de 30 días
- ✅ BONUS: decodeToken() - Decode sin verificar (debug)
- ✅ BONUS: getTokenExpiration() - Info de expiración
- ✅ Testing completo con 10 casos de prueba
- ✅ Documentación completa

---

## 👥 Contacto

Para soporte o preguntas sobre el servicio de tokens:
- Email: dev@jappi.ca
- Proyecto: Entre Amigas
