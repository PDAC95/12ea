# ✅ Auth Controller - Entre Amigas

Controlador completo de autenticación con registro, login, verificación de email y reset de contraseña.

## 📋 Índice

- [Funciones Implementadas](#-funciones-implementadas)
- [Rutas Disponibles](#-rutas-disponibles)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Flujos Completos](#-flujos-completos)
- [Testing](#-testing)
- [Manejo de Errores](#-manejo-de-errores)

---

## 🎯 Funciones Implementadas

### 1. **register** - Registro de Usuario

Crea un nuevo usuario en el sistema con validación completa.

**Características:**
- ✅ Validación de datos con express-validator
- ✅ Verificación de email duplicado (409 Conflict)
- ✅ Hash automático de contraseña (bcrypt)
- ✅ Generación automática de verificationToken
- ✅ Envío de emails de bienvenida y verificación
- ✅ Retorna perfil público del usuario

**Request:**
```javascript
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "María García López",
  "preferredName": "María",
  "email": "maria@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "phone": "+52 55 1234 5678",
  "birthday": "1990-05-15",
  "city": "Ciudad de México"
}
```

**Response 201 (Success):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente. Por favor verifica tu email.",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "fullName": "María García López",
      "preferredName": "María",
      "email": "maria@example.com",
      "city": "Ciudad de México",
      "role": "user",
      "isVerified": false,
      "createdAt": "2025-01-07T10:30:00.000Z"
    }
  }
}
```

**Response 409 (Email Duplicado):**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "field": "email"
}
```

---

### 2. **login** - Inicio de Sesión

Autentica usuario y genera token JWT.

**Características:**
- ✅ Validación de credenciales con bcrypt
- ✅ Verificación de cuenta activa
- ✅ Actualización de lastLogin
- ✅ Generación de JWT token (7 días)
- ✅ Advertencia si cuenta no verificada

**Request:**
```javascript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "maria@example.com",
  "password": "Password123"
}
```

**Response 200 (Success):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "fullName": "María García López",
      "preferredName": "María",
      "email": "maria@example.com",
      "city": "Ciudad de México",
      "role": "user",
      "isVerified": true,
      "createdAt": "2025-01-07T10:30:00.000Z"
    }
  },
  "warning": undefined
}
```

**Response 401 (Credenciales Inválidas):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Response 403 (Cuenta Desactivada):**
```json
{
  "success": false,
  "message": "La cuenta ha sido desactivada. Contacta al administrador."
}
```

---

### 3. **verifyEmail** - Verificación de Email

Verifica el email del usuario con el token enviado por correo.

**Características:**
- ✅ Validación de token de verificación
- ✅ Verificación de expiración (24 horas)
- ✅ Marca usuario como verificado
- ✅ Genera token JWT automáticamente
- ✅ Limpia tokens de verificación

**Request:**
```javascript
GET /api/v1/auth/verify-email/:token

// Token viene del email enviado al registrarse
```

**Response 200 (Success):**
```json
{
  "success": true,
  "message": "¡Email verificado exitosamente! Tu cuenta está activa.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "fullName": "María García López",
      "preferredName": "María",
      "email": "maria@example.com",
      "isVerified": true
    }
  }
}
```

**Response 400 (Token Inválido/Expirado):**
```json
{
  "success": false,
  "message": "Token de verificación inválido o expirado"
}
```

---

### 4. **forgotPassword** - Solicitar Reset de Contraseña

Genera token de reset y envía email con instrucciones.

**Características:**
- ✅ Busca usuario por email
- ✅ Genera token único de reset (SHA256)
- ✅ Expira en 1 hora
- ✅ Envía email con link de reset
- ✅ No revela si email existe (seguridad)

**Request:**
```javascript
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "maria@example.com"
}
```

**Response 200 (Success):**
```json
{
  "success": true,
  "message": "Instrucciones enviadas a tu email para restablecer tu contraseña"
}
```

**Response 403 (Cuenta Desactivada):**
```json
{
  "success": false,
  "message": "La cuenta ha sido desactivada. Contacta al administrador."
}
```

---

### 5. **resetPassword** - Restablecer Contraseña

Cambia la contraseña con el token de reset.

**Características:**
- ✅ Valida token hasheado (SHA256)
- ✅ Verifica que no haya expirado (1 hora)
- ✅ Hash automático de nueva contraseña
- ✅ Limpia tokens de reset
- ✅ Envía email de confirmación
- ✅ Genera nuevo JWT token

**Request:**
```javascript
POST /api/v1/auth/reset-password/:token
Content-Type: application/json

{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response 200 (Success):**
```json
{
  "success": true,
  "message": "Contraseña restablecida exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "fullName": "María García López",
      "email": "maria@example.com"
    }
  }
}
```

**Response 400 (Token Inválido/Expirado):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

## 🛣️ Rutas Disponibles

Todas las rutas están en `/api/v1/auth`:

| Método | Ruta | Descripción | Auth Requerido |
|--------|------|-------------|----------------|
| POST | `/register` | Registrar nuevo usuario | ❌ No |
| POST | `/login` | Iniciar sesión | ❌ No |
| GET | `/verify-email/:token` | Verificar email | ❌ No |
| POST | `/forgot-password` | Solicitar reset de contraseña | ❌ No |
| POST | `/reset-password/:token` | Restablecer contraseña | ❌ No |

---

## 📚 Ejemplos de Uso

### Ejemplo 1: Registro y Login Completo

```javascript
// 1. Registrar usuario
const registerResponse = await fetch('http://localhost:5000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'María García',
    preferredName: 'María',
    email: 'maria@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    phone: '+52 55 1234 5678',
    birthday: '1990-05-15',
    city: 'Ciudad de México'
  })
});

const registerData = await registerResponse.json();
console.log(registerData.message); // "Usuario registrado exitosamente..."

// 2. Usuario recibe email con token de verificación
// 3. Usuario hace clic en link del email

// 4. Verificar email
const verifyResponse = await fetch(`http://localhost:5000/api/v1/auth/verify-email/${token}`, {
  method: 'GET'
});

const verifyData = await verifyResponse.json();
const authToken = verifyData.data.token; // Token JWT automático

// 5. Login (también funciona sin verificar)
const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'maria@example.com',
    password: 'Password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 6. Usar token para requests autenticados
const protectedResponse = await fetch('http://localhost:5000/api/v1/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Ejemplo 2: Reset de Contraseña

```javascript
// 1. Usuario olvidó contraseña
const forgotResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'maria@example.com'
  })
});

const forgotData = await forgotResponse.json();
console.log(forgotData.message); // "Instrucciones enviadas a tu email..."

// 2. Usuario recibe email con token de reset
// 3. Usuario hace clic en link del email

// 4. Restablecer contraseña
const resetResponse = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${resetToken}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    password: 'NewPassword123',
    confirmPassword: 'NewPassword123'
  })
});

const resetData = await resetResponse.json();
const newToken = resetData.data.token; // Token JWT automático

// 5. Usuario ya puede hacer login con nueva contraseña
```

---

## 🔄 Flujos Completos

### Flujo 1: Registro Exitoso

```
1. Usuario → POST /register con datos
2. Backend → Valida datos (express-validator)
3. Backend → Verifica email no duplicado
4. Backend → Crea usuario (password se hashea automático)
5. Backend → Genera verificationToken automático
6. Backend → Envía email de bienvenida
7. Backend → Envía email de verificación con token
8. Backend → Retorna 201 con perfil público
9. Usuario → Recibe emails
10. Usuario → Hace clic en link de verificación
11. Usuario → GET /verify-email/:token
12. Backend → Marca como verificado, retorna JWT token
13. Usuario → Login con token o credenciales
```

### Flujo 2: Login

```
1. Usuario → POST /login con email y password
2. Backend → Busca usuario por email
3. Backend → Compara password con bcrypt
4. Backend → Verifica cuenta activa
5. Backend → Actualiza lastLogin
6. Backend → Genera JWT token (7 días)
7. Backend → Retorna 200 con token y perfil
8. Usuario → Guarda token en localStorage/cookies
9. Usuario → Usa token en todas las requests
```

### Flujo 3: Reset de Contraseña

```
1. Usuario → POST /forgot-password con email
2. Backend → Busca usuario por email
3. Backend → Genera resetToken (crypto random)
4. Backend → Hashea token con SHA256 y guarda
5. Backend → Envía email con token sin hashear
6. Backend → Retorna 200 (no revela si email existe)
7. Usuario → Recibe email con link + token
8. Usuario → POST /reset-password/:token con nueva password
9. Backend → Hashea token recibido con SHA256
10. Backend → Busca usuario con token hasheado
11. Backend → Verifica que no haya expirado (1h)
12. Backend → Actualiza password (se hashea automático)
13. Backend → Limpia tokens de reset
14. Backend → Envía email de confirmación
15. Backend → Genera nuevo JWT token
16. Backend → Retorna 200 con nuevo token
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# En una terminal: iniciar servidor
npm start

# En otra terminal: ejecutar tests
npm run test:controller

# O directamente
node test-auth-controller.js
```

### Tests Incluidos

El script `test-auth-controller.js` incluye 8 tests:

1. ✅ Registro exitoso con datos válidos
2. ✅ Registro duplicado (debe fallar con 409)
3. ✅ Registro con datos inválidos (debe fallar con 400)
4. ✅ Login exitoso con credenciales correctas
5. ✅ Login con credenciales incorrectas (debe fallar con 401)
6. ✅ Forgot password con email válido
7. ✅ Verificación con token inválido (debe fallar con 400)
8. ✅ Reset password con token inválido (debe fallar con 400)

**Resultado Esperado:**
```
🧪 Testing Auth Controller - Entre Amigas
======================================================================

✅ Tests exitosos: 8/8
❌ Tests fallidos: 0/8

🎉 ¡TODOS LOS TESTS DEL AUTH CONTROLLER PASARON!

📋 Funcionalidades probadas:
   ✅ Registro de usuarios
   ✅ Validación de duplicados
   ✅ Validación de datos de entrada
   ✅ Login con JWT
   ✅ Validación de credenciales
   ✅ Forgot password
   ✅ Validación de tokens
   ✅ Reset password

✨ Auth Controller está listo para usar!
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado | Cuándo Ocurre |
|--------|-------------|---------------|
| **200** | OK | Login exitoso, email verificado, password reseteado |
| **201** | Created | Usuario registrado exitosamente |
| **400** | Bad Request | Datos inválidos, token expirado, contraseñas no coinciden |
| **401** | Unauthorized | Credenciales incorrectas |
| **403** | Forbidden | Cuenta desactivada |
| **409** | Conflict | Email duplicado |
| **500** | Server Error | Error interno del servidor |

### Formato de Errores

Todos los errores siguen el mismo formato:

```json
{
  "success": false,
  "message": "Descripción del error en español",
  "errors": [
    {
      "field": "email",
      "message": "Debe proporcionar un email válido",
      "value": "email-invalido"
    }
  ]
}
```

### Errores Comunes

**1. Email Duplicado (409)**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "field": "email"
}
```

**2. Validación Fallida (400)**
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 8 caracteres"
    }
  ]
}
```

**3. Credenciales Incorrectas (401)**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**4. Token Inválido/Expirado (400)**
```json
{
  "success": false,
  "message": "Token de verificación inválido o expirado"
}
```

---

## 🔐 Seguridad

### Medidas Implementadas

1. **Passwords:**
   - Hash con bcrypt (10 rounds)
   - Nunca se retornan en responses
   - Validación de fuerza (8+ caracteres, mayúsculas, minúsculas, números)

2. **Tokens:**
   - JWT con HS256 y secret seguro
   - Expiración: 7 días (auth), 24h (verification), 1h (reset)
   - Reset tokens hasheados con SHA256 en DB

3. **Rate Limiting:**
   - 100 requests por 15 minutos por IP
   - Configurado en `server.js`

4. **CORS:**
   - Solo permite origen del frontend
   - Credentials: true

5. **Helmet:**
   - Headers de seguridad automáticos

6. **Validación:**
   - express-validator en todas las rutas
   - Sanitización de inputs
   - Normalización de emails

7. **Emails:**
   - No revelar si email existe (forgot password)
   - Templates seguros sin XSS

---

## 📦 Dependencias

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de passwords
- **jsonwebtoken** - Generación de JWT
- **express-validator** - Validación de inputs
- **crypto** - Generación de tokens seguros
- **resend** - Envío de emails
- **dotenv** - Variables de entorno

---

## 🛠️ Troubleshooting

### Error: "Email ya está registrado"
```bash
# Verificar si el email existe en la DB
mongosh
use entreamigas
db.users.findOne({ email: "maria@example.com" })

# Eliminar usuario de prueba
db.users.deleteOne({ email: "maria@example.com" })
```

### Error: "Token inválido o expirado"
```bash
# Verificar tokens en la DB
db.users.findOne(
  { email: "maria@example.com" },
  { verificationToken: 1, verificationTokenExpires: 1 }
)

# Generar nuevo token
# Re-registrar usuario o usar forgot-password
```

### Error: "Credenciales inválidas"
```bash
# Verificar usuario existe
db.users.findOne({ email: "maria@example.com" })

# Verificar campo password existe (es select: false por defecto)
db.users.findOne(
  { email: "maria@example.com" },
  { email: 1, password: 1 }
)
```

### Tests fallan con "fetch is not defined"
```bash
# Node 18+ tiene fetch nativo
node --version  # Debe ser >= 18.0.0

# Si usas Node < 18, instalar node-fetch
npm install node-fetch

# Y agregar en test-auth-controller.js:
import fetch from 'node-fetch';
```

---

## 📝 Changelog

### v1.0.0 (2025-01-07)

- ✅ `register()` - Registro completo con validación y emails
- ✅ `login()` - Login con JWT y validación de credenciales
- ✅ `verifyEmail()` - Verificación de email con token
- ✅ `forgotPassword()` - Solicitud de reset con email
- ✅ `resetPassword()` - Reset de contraseña con token
- ✅ Rutas configuradas en `/api/v1/auth`
- ✅ Validaciones con express-validator
- ✅ Testing completo con 8 tests
- ✅ Documentación completa
- ✅ Manejo de errores robusto
- ✅ Seguridad implementada

---

## 👥 Contacto

Para soporte o preguntas sobre el Auth Controller:
- Email: dev@jappi.ca
- Proyecto: Entre Amigas

---

## 📖 Referencias

- [User Model Documentation](../models/README-USER-MODEL.md)
- [Auth Validators Documentation](../validators/README-VALIDATORS.md)
- [Token Service Documentation](../services/README-TOKEN-SERVICE.md)
- [Email Service Documentation](../services/README-EMAIL-SERVICE.md)
- [Auth Middleware Documentation](../middleware/README-AUTH-MIDDLEWARE.md)
