# Auth Service - Servicio de Autenticación

## Descripción

Servicio centralizado para todas las operaciones de autenticación del frontend. Se comunica con los endpoints del backend usando la instancia de axios configurada (con interceptors JWT automáticos).

## Funciones Disponibles

### 1. register(userData)

Registra un nuevo usuario en la plataforma.

**Parámetros:**
```javascript
{
  fullName: string,        // Nombre completo (2-100 caracteres)
  preferredName: string,   // Nombre preferido (2-50 caracteres)
  email: string,           // Email válido
  password: string,        // Contraseña (mínimo 8 caracteres)
  confirmPassword: string, // Confirmación de contraseña
  phone: string,           // Teléfono
  birthday: string,        // Fecha de nacimiento (YYYY-MM-DD, mayor de 18 años)
  city: string            // Ciudad
}
```

**Ejemplo de uso:**
```javascript
import authService from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ ... });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.register(formData);
      setSuccess(response.message || 'Registro exitoso. Revisa tu email.');
    } catch (error) {
      setError(error.message);
    }
  };

  // ... resto del componente
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  message: "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
  data: {
    user: {
      _id: "...",
      fullName: "María García",
      email: "maria@example.com",
      // ... otros campos sin password
    }
  }
}
```

---

### 2. login(email, password)

Inicia sesión y obtiene el JWT token.

**Parámetros:**
- `email` (string): Email del usuario
- `password` (string): Contraseña

**Ejemplo de uso:**
```javascript
import authService from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      // Guardar token y usuario en contexto (localStorage)
      login(token, user);

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  // ... resto del componente
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  message: "Inicio de sesión exitoso",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      _id: "...",
      fullName: "María García",
      preferredName: "Mary",
      email: "maria@example.com",
      city: "Vancouver",
      role: "user",
      isVerified: true
    }
  }
}
```

---

### 3. verifyEmail(token)

Verifica el email del usuario con el token recibido por correo.

**Parámetros:**
- `token` (string): Token de verificación del email

**Ejemplo de uso:**
```javascript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import authService from '@/features/auth/services/authService';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verificado exitosamente');
      } catch (error) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  // ... renderizar según status
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  message: "Email verificado exitosamente. Ya puedes iniciar sesión."
}
```

---

### 4. forgotPassword(email)

Solicita un email de recuperación de contraseña.

**Parámetros:**
- `email` (string): Email del usuario

**Ejemplo de uso:**
```javascript
import authService from '@/features/auth/services/authService';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      setSuccess(
        response.message || 'Revisa tu email para restablecer tu contraseña'
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // ... resto del componente
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  message: "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña."
}
```

---

### 5. resetPassword(token, password, confirmPassword)

Restablece la contraseña con el token recibido por email.

**Parámetros:**
- `token` (string): Token de restablecimiento del email
- `password` (string): Nueva contraseña (mínimo 8 caracteres)
- `confirmPassword` (string): Confirmación de la nueva contraseña

**Ejemplo de uso:**
```javascript
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '@/features/auth/services/authService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      alert(response.message || 'Contraseña restablecida exitosamente');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  // ... resto del componente
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  message: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión."
}
```

---

### 6. getMe()

Obtiene los datos del usuario autenticado actual.

**Parámetros:** Ninguno (usa el JWT token de localStorage automáticamente)

**Ejemplo de uso:**
```javascript
import { useEffect, useState } from 'react';
import authService from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/context/AuthContext';

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getMe();
        const user = response.data;

        // Actualizar contexto con datos frescos del servidor
        updateUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // ... resto del componente
};
```

**Respuesta exitosa:**
```javascript
{
  success: true,
  data: {
    _id: "...",
    fullName: "María García",
    preferredName: "Mary",
    email: "maria@example.com",
    phone: "+1234567890",
    city: "Vancouver",
    birthday: "1990-05-15T00:00:00.000Z",
    role: "user",
    isVerified: true,
    isActive: true,
    createdAt: "2025-01-07T10:00:00.000Z"
  }
}
```

---

## Manejo de Errores

Todas las funciones del servicio **lanzan errores** (`throw new Error()`), por lo que debes usar **try-catch** para manejarlos:

```javascript
try {
  const response = await authService.login(email, password);
  // Manejar éxito
} catch (error) {
  // error.message contiene el mensaje de error en español
  console.error('Error:', error.message);
  setError(error.message);
}
```

### Tipos de Errores

1. **Errores del servidor (400-500)**:
   - Mensaje del backend en español
   - Ejemplo: "Email o contraseña incorrectos"

2. **Sin respuesta del servidor**:
   - "No se pudo conectar con el servidor"

3. **Error de configuración**:
   - "Error al procesar la solicitud"

### Errores de Validación

Cuando hay errores de validación múltiples (registro), se concatenan:

```javascript
try {
  await authService.register(userData);
} catch (error) {
  // error.message = "El email es inválido, La contraseña debe tener al menos 8 caracteres"
  setError(error.message);
}
```

---

## Integración con AuthContext

El `authService` trabaja en conjunto con el `AuthContext`:

```javascript
import authService from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      // 1. Llamar al backend con authService
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      // 2. Guardar en contexto (localStorage + state)
      login(token, user);

      // 3. El axios interceptor usará este token automáticamente
      // en todas las peticiones futuras
    } catch (error) {
      console.error(error.message);
    }
  };
};
```

---

## JWT Automático

**No necesitas pasar el JWT manualmente**. El axios interceptor (TASK-006) lo agrega automáticamente:

```javascript
// ✅ Correcto - El token se agrega automáticamente
const response = await authService.getMe();

// ❌ Incorrecto - No hagas esto
const response = await authService.getMe(token);
```

---

## Testing

Para testing, puedes mockear el servicio:

```javascript
// En tus tests
import authService from '@/features/auth/services/authService';

jest.mock('@/features/auth/services/authService');

// Mockear respuesta exitosa
authService.login.mockResolvedValue({
  success: true,
  data: {
    token: 'fake-token',
    user: { id: '1', email: 'test@example.com' }
  }
});

// Mockear error
authService.login.mockRejectedValue(
  new Error('Email o contraseña incorrectos')
);
```

---

## Endpoints del Backend

Estas son las URLs que el servicio usa (relativas a `VITE_API_URL`):

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/verify-email/:token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `GET /auth/me`

---

## Características

✅ 6 funciones completas de autenticación
✅ Manejo de errores robusto en 3 niveles
✅ Mensajes de error en español del backend
✅ Documentación JSDoc completa
✅ Errores de validación concatenados
✅ Compatible con axios interceptors (JWT automático)
✅ Compatible con AuthContext
✅ Fácil de testear con mocks

---

## Próximos Pasos

Ahora que tienes el `authService`, puedes crear:
- **RegisterForm** (TASK-016)
- **LoginForm** (TASK-018)
- **VerifyEmailPage** (TASK-020)
- **ForgotPasswordForm** (TASK-021)
- **ResetPasswordForm** (TASK-023)

Todos estos componentes usarán este servicio para comunicarse con el backend.
