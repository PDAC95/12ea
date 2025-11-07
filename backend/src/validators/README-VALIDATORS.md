# ✅ Auth Validators - express-validator

Validaciones completas para autenticación y registro de usuarios usando express-validator.

## 📋 Configuración

### Dependencias

Ya instalado en el proyecto:

```bash
npm install express-validator
```

### Importar Validadores

```javascript
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors,
} from './validators/auth.validator.js';
```

---

## 🚀 Validadores Disponibles

### 1. **registerValidation** - Registro de Usuario

Valida todos los campos requeridos para el registro de un nuevo usuario.

**Campos validados:**

| Campo | Requerido | Validación | Mensaje de Error |
|-------|-----------|------------|------------------|
| `fullName` | ✅ | 2-100 caracteres, solo letras y espacios | "El nombre completo debe tener entre 2 y 100 caracteres" |
| `preferredName` | ✅ | 2-50 caracteres, solo letras y espacios | "El nombre preferido debe tener entre 2 y 50 caracteres" |
| `email` | ✅ | Email válido | "Debe proporcionar un email válido" |
| `password` | ✅ | Mín 8 caracteres, 1 mayúscula, 1 minúscula, 1 número | "La contraseña debe contener al menos una mayúscula, una minúscula y un número" |
| `confirmPassword` | ✅ | Debe coincidir con password | "Las contraseñas no coinciden" |
| `phone` | ✅ | 10-20 caracteres, formato teléfono | "El formato del teléfono no es válido" |
| `birthday` | ✅ | Fecha ISO8601, mayor de 18 años | "Debes ser mayor de 18 años para registrarte" |
| `city` | ✅ | 2-100 caracteres | "La ciudad es requerida" |

**Uso en Rutas:**

```javascript
import { registerValidation, handleValidationErrors } from './validators/auth.validator.js';

router.post('/register',
  registerValidation,           // Ejecutar validaciones
  handleValidationErrors,       // Manejar errores
  authController.register       // Controller
);
```

**Ejemplo de Request Válido:**

```json
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

**Ejemplo de Respuesta de Error:**

```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      "value": "password"
    },
    {
      "field": "birthday",
      "message": "Debes ser mayor de 18 años para registrarte",
      "value": "2010-01-01"
    }
  ]
}
```

---

### 2. **loginValidation** - Login de Usuario

Valida credenciales de inicio de sesión.

**Campos validados:**

| Campo | Requerido | Validación | Mensaje de Error |
|-------|-----------|------------|------------------|
| `email` | ✅ | Email válido | "Debe proporcionar un email válido" |
| `password` | ✅ | No vacío | "La contraseña es requerida" |

**Uso en Rutas:**

```javascript
router.post('/login',
  loginValidation,
  handleValidationErrors,
  authController.login
);
```

**Ejemplo de Request:**

```json
{
  "email": "maria@example.com",
  "password": "Password123"
}
```

---

### 3. **forgotPasswordValidation** - Recuperar Contraseña

Valida solicitud de recuperación de contraseña.

**Campos validados:**

| Campo | Requerido | Validación | Mensaje de Error |
|-------|-----------|------------|------------------|
| `email` | ✅ | Email válido | "Debe proporcionar un email válido" |

**Uso en Rutas:**

```javascript
router.post('/forgot-password',
  forgotPasswordValidation,
  handleValidationErrors,
  authController.forgotPassword
);
```

**Ejemplo de Request:**

```json
{
  "email": "maria@example.com"
}
```

---

### 4. **resetPasswordValidation** - Resetear Contraseña

Valida el reseteo de contraseña con token.

**Campos validados:**

| Campo | Requerido | Validación | Mensaje de Error |
|-------|-----------|------------|------------------|
| `password` | ✅ | Mín 8 caracteres, 1 mayúscula, 1 minúscula, 1 número | "La contraseña debe contener..." |
| `confirmPassword` | ✅ | Debe coincidir con password | "Las contraseñas no coinciden" |

**Uso en Rutas:**

```javascript
router.post('/reset-password',
  resetPasswordValidation,
  handleValidationErrors,
  authController.resetPassword
);
```

**Ejemplo de Request:**

```json
{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123",
  "token": "abc123..."
}
```

---

### 5. **updateProfileValidation** ⭐ BONUS - Actualizar Perfil

Valida actualización de perfil de usuario. Todos los campos son opcionales, pero si se proporcionan deben ser válidos.

**Campos validados (todos opcionales):**

| Campo | Validación | Mensaje de Error |
|-------|------------|------------------|
| `fullName` | 2-100 caracteres, solo letras | "El nombre completo debe tener entre 2 y 100 caracteres" |
| `preferredName` | 2-50 caracteres, solo letras | "El nombre preferido debe tener entre 2 y 50 caracteres" |
| `phone` | 10-20 caracteres, formato teléfono | "El formato del teléfono no es válido" |
| `city` | 2-100 caracteres | "La ciudad debe tener entre 2 y 100 caracteres" |
| `bio` | Máximo 500 caracteres | "La biografía no puede exceder 500 caracteres" |

**Uso en Rutas:**

```javascript
router.put('/profile',
  protect,                        // Autenticación requerida
  updateProfileValidation,
  handleValidationErrors,
  userController.updateProfile
);
```

---

### 6. **changePasswordValidation** ⭐ BONUS - Cambiar Contraseña

Valida cambio de contraseña cuando el usuario está autenticado.

**Campos validados:**

| Campo | Requerido | Validación | Mensaje de Error |
|-------|-----------|------------|------------------|
| `currentPassword` | ✅ | No vacío | "La contraseña actual es requerida" |
| `newPassword` | ✅ | Mín 8 caracteres, diferente a la actual | "La nueva contraseña debe ser diferente a la actual" |
| `confirmNewPassword` | ✅ | Debe coincidir con newPassword | "Las contraseñas no coinciden" |

**Uso en Rutas:**

```javascript
router.put('/change-password',
  protect,                        // Autenticación requerida
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);
```

**Ejemplo de Request:**

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456",
  "confirmNewPassword": "NewPassword456"
}
```

---

## 🛠️ Middleware de Manejo de Errores

### **handleValidationErrors**

Middleware que procesa los errores de validación y retorna una respuesta consistente.

**Funcionamiento:**

1. Extrae errores de `validationResult(req)`
2. Si hay errores, retorna 400 con lista de errores
3. Si no hay errores, llama a `next()`

**Formato de Respuesta de Error:**

```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "email",
      "message": "Debe proporcionar un email válido",
      "value": "email-invalido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 8 caracteres",
      "value": "123"
    }
  ]
}
```

**Uso:**

```javascript
// SIEMPRE usar después de las validaciones
router.post('/endpoint',
  validationArray,        // 1. Validaciones
  handleValidationErrors, // 2. Manejo de errores
  controller             // 3. Controller
);
```

---

## 📚 Ejemplos de Uso Completo

### Rutas de Autenticación

```javascript
// routes/auth.routes.js
import express from 'express';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  handleValidationErrors,
} from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Registro
router.post('/register',
  registerValidation,
  handleValidationErrors,
  authController.register
);

// Login
router.post('/login',
  loginValidation,
  handleValidationErrors,
  authController.login
);

// Forgot Password
router.post('/forgot-password',
  forgotPasswordValidation,
  handleValidationErrors,
  authController.forgotPassword
);

// Reset Password
router.post('/reset-password',
  resetPasswordValidation,
  handleValidationErrors,
  authController.resetPassword
);

// Change Password (requiere autenticación)
router.put('/change-password',
  protect,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);

export default router;
```

### Rutas de Usuario

```javascript
// routes/user.routes.js
import express from 'express';
import { updateProfileValidation, handleValidationErrors } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Actualizar perfil
router.put('/profile',
  protect,
  updateProfileValidation,
  handleValidationErrors,
  userController.updateProfile
);

export default router;
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Desde backend/
npm run test:validators

# O directamente
node test-validators.js
```

### Casos de Prueba

El script de testing verifica:

1. ✅ Registro con datos válidos (debe pasar)
2. ✅ Registro con fullName muy corto (debe fallar)
3. ✅ Registro con email inválido (debe fallar)
4. ✅ Registro con contraseña débil (debe fallar)
5. ✅ Registro con contraseñas no coincidentes (debe fallar)
6. ✅ Registro con menor de 18 años (debe fallar)
7. ✅ Login con datos válidos (debe pasar)
8. ✅ Login con campos vacíos (debe fallar)
9. ✅ Forgot password con email válido (debe pasar)
10. ✅ Reset password con contraseñas válidas (debe pasar)

**Resultado Esperado:**

```
🎉 ¡TODAS LAS VALIDACIONES FUNCIONAN CORRECTAMENTE!

📋 Validaciones probadas:
   ✅ registerValidation - Registro completo
   ✅ loginValidation - Login de usuario
   ✅ forgotPasswordValidation - Recuperación de contraseña
   ✅ resetPasswordValidation - Reset de contraseña

✨ Auth Validators están listos para usar!
```

---

## 🎨 Validaciones Personalizadas

### Validación de Edad (18+)

```javascript
body('birthday')
  .isISO8601()
  .custom((value) => {
    const birthday = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthday.getFullYear();

    if (age < 18) {
      throw new Error('Debes ser mayor de 18 años');
    }

    if (age > 120) {
      throw new Error('Fecha inválida');
    }

    return true;
  })
```

### Validación de Contraseña Fuerte

```javascript
body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('La contraseña debe contener mayúscula, minúscula y número')
```

### Validación de Confirmación

```javascript
body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  })
```

---

## 🔐 Seguridad

### Sanitización de Datos

Todos los campos de texto se sanitizan automáticamente:

- **trim()** - Elimina espacios al inicio y final
- **normalizeEmail()** - Normaliza formato de email
- **toLowerCase()** - Convierte email a minúsculas

### Prevención de XSS

Los validadores NO permiten:
- HTML tags en nombres
- Scripts en campos de texto
- Caracteres especiales peligrosos

### Rate Limiting Recomendado

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos, intenta de nuevo más tarde'
});

router.post('/register', authLimiter, registerValidation, ...);
router.post('/login', authLimiter, loginValidation, ...);
```

---

## 🚨 Mensajes de Error en Español

Todos los mensajes están en español y son claros para el usuario final:

| Inglés | Español |
|--------|---------|
| "Email is required" | "El email es requerido" |
| "Password must be at least 8 characters" | "La contraseña debe tener al menos 8 caracteres" |
| "Passwords do not match" | "Las contraseñas no coinciden" |
| "Must be 18 years or older" | "Debes ser mayor de 18 años para registrarte" |

---

## 📊 Campos del Modelo User

Los validadores están alineados con el modelo User esperado:

```javascript
{
  fullName: String,       // Nombre completo
  preferredName: String,  // Nombre preferido
  email: String,          // Email único
  password: String,       // Contraseña hasheada
  phone: String,          // Teléfono
  birthday: Date,         // Fecha de nacimiento
  city: String,           // Ciudad
  bio: String,            // Biografía (opcional)
  role: String,           // Role (user, admin)
  isVerified: Boolean,    // Email verificado
  isActive: Boolean,      // Cuenta activa
}
```

---

## 🔧 Troubleshooting

### Error: "express-validator not found"

```bash
cd backend
npm install express-validator
```

### Las validaciones no funcionan

Verificar orden en las rutas:

```javascript
// ✅ Correcto
router.post('/register',
  validations,           // 1. Primero validaciones
  handleValidationErrors, // 2. Luego manejo de errores
  controller            // 3. Finalmente controller
);

// ❌ Incorrecto
router.post('/register',
  controller,           // ❌ Controller primero
  validations           // ❌ Validaciones después (nunca se ejecutan)
);
```

### Los errores no aparecen

Asegúrate de usar `handleValidationErrors`:

```javascript
// Sin este middleware, los errores no se procesan
router.post('/register',
  registerValidation,
  handleValidationErrors, // ⭐ IMPORTANTE
  controller
);
```

---

## 📝 Changelog

### v1.0.0 (2025-01-07)

- ✅ `registerValidation` - Validación completa de registro (8 campos)
- ✅ `loginValidation` - Validación de credenciales
- ✅ `forgotPasswordValidation` - Validación de recuperación
- ✅ `resetPasswordValidation` - Validación de reset
- ✅ BONUS: `updateProfileValidation` - Actualización de perfil
- ✅ BONUS: `changePasswordValidation` - Cambio de contraseña
- ✅ `handleValidationErrors` - Middleware de manejo de errores
- ✅ Testing completo con 10 casos de prueba
- ✅ Documentación completa en español
- ✅ Mensajes de error user-friendly

---

## 👥 Contacto

Para soporte o preguntas sobre los validadores:
- Email: dev@jappi.ca
- Proyecto: Entre Amigas
