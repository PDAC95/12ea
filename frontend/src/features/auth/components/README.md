# Auth Components - Componentes de Autenticación

## RegisterForm

Formulario completo de registro con validación robusta usando React Hook Form + Yup.

### Características

✅ 8 campos validados:
- Nombre Completo (2-100 caracteres, solo letras)
- Nombre Preferido (2-50 caracteres)
- Email (validación de formato)
- Teléfono (formato flexible)
- Fecha de Nacimiento (mayor de 18 años)
- Ciudad (select con ciudades principales de Canadá)
- Contraseña (min 8 caracteres, mayúscula, minúscula, número)
- Confirmar Contraseña (debe coincidir)

✅ UX/UI:
- Validación en tiempo real (onBlur)
- Mostrar/ocultar contraseñas con iconos
- Loading state en botón con spinner
- Mensajes de error claros en español
- Mensaje de éxito después de registro
- Diseño responsive con Tailwind CSS
- Inputs disabled durante submit

✅ Seguridad:
- Validaciones en frontend Y backend
- Passwords hasheados en backend
- Email de verificación obligatorio

### Uso Básico

```jsx
import RegisterForm from '@/features/auth/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Únete a Entre Amigas
        </h1>
        <RegisterForm />
        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
};
```

### Props

El componente no recibe props. Es auto-contenido.

### Estados Internos

- `isSubmitting`: Indica si el formulario se está enviando
- `submitError`: Error general del backend (si hay)
- `submitSuccess`: Indica si el registro fue exitoso
- `showPassword`: Controla visibilidad de contraseña
- `showConfirmPassword`: Controla visibilidad de confirmación

### Validaciones de Yup

```javascript
// Ejemplo de validaciones implementadas:
fullName: min 2, max 100, solo letras
preferredName: min 2, max 50
email: formato válido, lowercase, trim
phone: formato flexible con símbolos
birthday: mayor de 18 años, no futuro
city: requerido, min 2 caracteres
password: min 8, mayúscula + minúscula + número
confirmPassword: debe coincidir con password
```

### Flujo de Registro

1. **Usuario llena formulario**
   - Validación en tiempo real al perder foco
   - Mensajes de error claros

2. **Usuario hace submit**
   - Botón cambia a estado "loading"
   - Validación final de Yup
   - Llamada a `authService.register()`

3. **Casos de respuesta:**

   **a) Éxito (201):**
   - Formulario se limpia
   - Se muestra mensaje de éxito
   - Usuario debe revisar email

   **b) Error del backend (400/409/500):**
   - Mensaje de error se muestra arriba del formulario
   - Usuario puede corregir e intentar de nuevo

   **c) Error de red:**
   - Mensaje: "No se pudo conectar con el servidor"

### Ejemplo de Respuesta Exitosa

```javascript
{
  success: true,
  message: "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
  data: {
    user: {
      _id: "...",
      fullName: "María García",
      email: "maria@example.com",
      // ... otros campos
    }
  }
}
```

### Ejemplo de Error

```javascript
// Error: Email ya existe
{
  success: false,
  error: {
    code: "USER_EXISTS",
    message: "El email ya está registrado"
  }
}

// Error: Validación múltiple
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Error de validación",
    details: [
      { msg: "El email es inválido" },
      { msg: "La contraseña debe tener al menos 8 caracteres" }
    ]
  }
}
// Se muestra: "El email es inválido, La contraseña debe tener al menos 8 caracteres"
```

### Ciudades Disponibles

El select de ciudad incluye las principales ciudades de Canadá:
- Vancouver
- Toronto
- Montreal
- Calgary
- Edmonton
- Ottawa
- Winnipeg
- Quebec
- Hamilton
- Otra (para ciudades no listadas)

### Iconos Usados

- `Eye` / `EyeOff`: Mostrar/ocultar contraseña (Lucide React)
- `Loader2`: Spinner de loading (Lucide React)
- ✓: Checkmark de éxito (emoji)

### Accesibilidad

- Labels asociados a inputs con `htmlFor`
- Mensajes de error con `aria-invalid` implícito
- Botón disabled durante submit
- Tab order correcto
- Placeholders informativos

### Responsive Design

- Desktop: Formulario centrado con max-w-md
- Mobile: Padding lateral para evitar overflow
- Inputs con width 100%
- Botón full-width en mobile

### Testing

Para testear el componente:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';

// Mockear authService
jest.mock('../services/authService');

test('muestra mensaje de éxito después de registro exitoso', async () => {
  authService.register.mockResolvedValue({ success: true });

  render(<RegisterForm />);

  // Llenar formulario...
  fireEvent.click(screen.getByText('Crear Cuenta'));

  await waitFor(() => {
    expect(screen.getByText(/Registro Exitoso/i)).toBeInTheDocument();
  });
});

test('muestra error del backend', async () => {
  authService.register.mockRejectedValue(
    new Error('El email ya está registrado')
  );

  render(<RegisterForm />);

  // Llenar formulario...
  fireEvent.click(screen.getByText('Crear Cuenta'));

  await waitFor(() => {
    expect(screen.getByText('El email ya está registrado')).toBeInTheDocument();
  });
});
```

### Mejoras Futuras

- [ ] Agregar campo de "Cómo te enteraste de nosotras"
- [ ] Validación de fuerza de contraseña visual
- [ ] Auto-completar ciudad basado en geolocalización
- [ ] Input de teléfono con formato automático
- [ ] Agregar captcha para prevenir spam
- [ ] Permitir registro con Google/Facebook

### Dependencias

- `react-hook-form`: ^7.53.0
- `@hookform/resolvers`: (viene con react-hook-form)
- `yup`: ^1.4.0
- `lucide-react`: ^0.445.0
- `authService`: Servicio de autenticación (TASK-015)

### Notas Importantes

1. **No guardar token aquí**: El formulario solo registra. El login se hace en LoginForm.

2. **Email de verificación**: El backend envía un email. El usuario NO puede hacer login hasta verificar.

3. **Validación dual**: Aunque validamos en frontend, el backend SIEMPRE valida de nuevo por seguridad.

4. **Ciudad "Otra"**: Si el usuario selecciona "Otra", podríamos agregar un input text condicional en el futuro.

5. **Formato de birthday**: El input type="date" retorna formato YYYY-MM-DD que el backend acepta.

---

## LoginForm

Formulario de inicio de sesión con validación usando React Hook Form + Yup e integración completa con AuthContext.

### Características

✅ 2 campos validados:
- Email (validación de formato)
- Contraseña (mínimo 6 caracteres)

✅ Funcionalidades:
- Checkbox "Recordarme" (opcional)
- Link a "¿Olvidaste tu contraseña?"
- Mostrar/ocultar contraseña con icono
- Loading state en botón con spinner
- Mensajes de error claros en español
- Validación en tiempo real (onBlur)
- Diseño responsive con Tailwind CSS
- Inputs disabled durante submit

✅ Integración:
- Usa `authService.login()` para autenticación
- Guarda token y usuario con `useAuth().login()`
- Redirige automáticamente a `/dashboard` después de login exitoso
- Manejo de errores del backend (401, 403, 500)

### Uso Básico

```jsx
import LoginForm from '@/features/auth/components/LoginForm';
import { AuthProvider } from '@/features/auth/context/AuthContext';

const LoginPage = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            Iniciar Sesión
          </h1>
          <LoginForm />
          <p className="text-center mt-6 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </AuthProvider>
  );
};
```

### Props

El componente no recibe props. Es auto-contenido.

### Estados Internos

- `isSubmitting`: Indica si el formulario se está enviando
- `submitError`: Error general del backend (si hay)
- `showPassword`: Controla visibilidad de contraseña

### Validaciones de Yup

```javascript
// Schema de validación:
email: formato válido, lowercase, trim
password: mínimo 6 caracteres
rememberMe: boolean (opcional)
```

### Flujo de Login

1. **Usuario llena formulario**
   - Validación en tiempo real al perder foco
   - Mensajes de error claros

2. **Usuario hace submit**
   - Botón cambia a estado "loading"
   - Validación final de Yup
   - Llamada a `authService.login(email, password)`

3. **Casos de respuesta:**

   **a) Éxito (200):**
   - `authService.login()` retorna `{ token, user }`
   - `useAuth().login(token, user)` guarda en localStorage + state
   - Axios interceptor usará este token en futuras peticiones
   - Redirect automático a `/dashboard`

   **b) Error del backend (400/401/403):**
   - Mensaje de error se muestra arriba del formulario
   - Ejemplos:
     * "Email o contraseña incorrectos"
     * "Debes verificar tu email antes de iniciar sesión"
     * "Tu cuenta ha sido desactivada"

   **c) Error de red:**
   - Mensaje: "No se pudo conectar con el servidor"

### Ejemplo de Respuesta Exitosa

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
      isVerified: true,
      isActive: true
    }
  }
}
```

### Ejemplo de Error

```javascript
// Error: Credenciales incorrectas
{
  success: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Email o contraseña incorrectos"
  }
}

// Error: Email no verificado
{
  success: false,
  error: {
    code: "EMAIL_NOT_VERIFIED",
    message: "Debes verificar tu email antes de iniciar sesión"
  }
}

// Error: Cuenta desactivada
{
  success: false,
  error: {
    code: "ACCOUNT_INACTIVE",
    message: "Tu cuenta ha sido desactivada. Contacta a soporte."
  }
}
```

### Iconos Usados

- `Eye` / `EyeOff`: Mostrar/ocultar contraseña (Lucide React)
- `Loader2`: Spinner de loading (Lucide React)

### Accesibilidad

- Labels asociados a inputs con `htmlFor`
- Mensajes de error con `aria-invalid` implícito
- Botón disabled durante submit
- Tab order correcto
- Placeholders informativos
- `autoComplete="email"` y `autoComplete="current-password"` para mejor UX

### Responsive Design

- Desktop: Formulario centrado con max-w-md
- Mobile: Padding lateral para evitar overflow
- Inputs con width 100%
- Botón full-width en mobile
- Checkbox "Recordarme" y link "Olvidaste" en misma fila (flex)

### Testing

Para testear el componente:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthProvider } from '../context/AuthContext';

// Mockear authService y useNavigate
jest.mock('../services/authService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

test('redirige a /dashboard después de login exitoso', async () => {
  authService.login.mockResolvedValue({
    success: true,
    data: {
      token: 'fake-token',
      user: { id: '1', email: 'test@example.com' }
    }
  });

  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/Contraseña/i), {
    target: { value: 'Password123' }
  });
  fireEvent.click(screen.getByText('Iniciar Sesión'));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

test('muestra error del backend cuando credenciales son incorrectas', async () => {
  authService.login.mockRejectedValue(
    new Error('Email o contraseña incorrectos')
  );

  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: 'wrong@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/Contraseña/i), {
    target: { value: 'wrongpass' }
  });
  fireEvent.click(screen.getByText('Iniciar Sesión'));

  await waitFor(() => {
    expect(screen.getByText('Email o contraseña incorrectos')).toBeInTheDocument();
  });
});

test('permite mostrar/ocultar contraseña', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );

  const passwordInput = screen.getByLabelText(/Contraseña/i);
  const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

  // Por defecto es type="password"
  expect(passwordInput).toHaveAttribute('type', 'password');

  // Click en el icono para mostrar
  fireEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute('type', 'text');

  // Click de nuevo para ocultar
  fireEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute('type', 'password');
});
```

### Mejoras Futuras

- [ ] Implementar "Recordarme" guardando en localStorage con expiración de 30 días
- [ ] Agregar opción de login con Google/Facebook
- [ ] Rate limiting visual (bloquear después de 5 intentos fallidos)
- [ ] Mostrar indicador de "Caps Lock activado"
- [ ] Auto-focus en input de email al cargar la página
- [ ] Agregar animación de "shake" en el formulario al fallar

### Dependencias

- `react-hook-form`: ^7.53.0
- `@hookform/resolvers`: (viene con react-hook-form)
- `yup`: ^1.4.0
- `lucide-react`: ^0.445.0
- `react-router-dom`: ^6.26.0
- `authService`: Servicio de autenticación (TASK-015)
- `AuthContext`: Contexto de autenticación (TASK-005)

### Notas Importantes

1. **Token automático en axios**: Después de `login()`, el axios interceptor (TASK-006) agrega el JWT en TODAS las peticiones futuras automáticamente.

2. **Validación de email no verificado**: Si el usuario NO ha verificado su email, el backend retorna 403 con mensaje claro.

3. **Redirect a dashboard**: Después de login exitoso, siempre redirigimos a `/dashboard`. En el futuro, podríamos implementar redirect a la página de origen.

4. **"Recordarme"**: Actualmente el checkbox no hace nada. En el futuro, podríamos implementar tokens de larga duración (30 días) vs tokens de sesión (7 días).

5. **Link a recuperar contraseña**: Usa `<a href>` en lugar de `<Link>` para mantener simplicidad. Cambiar a `<Link>` si se implementa React Router en toda la app.

---

## ForgotPasswordForm

Formulario simple para solicitar recuperación de contraseña. Envía un email con instrucciones para restablecer.

### Características

✅ 1 campo validado:
- Email (validación de formato)

✅ Funcionalidades:
- Validación en tiempo real (onBlur)
- Loading state en botón con spinner
- Mensajes de error claros en español
- Mensaje de éxito después de envío
- Instrucciones claras para el usuario
- Link de regreso a login
- Diseño responsive con Tailwind CSS
- Input disabled durante submit
- autoFocus en el campo de email

✅ UX/UI:
- Banner informativo azul con instrucciones
- Mensaje de éxito con CheckCircle icon verde
- Reset del formulario después de éxito
- Botón para volver a login después de éxito

### Uso Básico

```jsx
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          ¿Olvidaste tu Contraseña?
        </h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
```

### Props

El componente no recibe props. Es auto-contenido.

### Estados Internos

- `isSubmitting`: Indica si el formulario se está enviando
- `submitError`: Error general del backend (si hay)
- `submitSuccess`: Indica si la solicitud fue exitosa

### Validaciones de Yup

```javascript
// Schema de validación:
email: formato válido, lowercase, trim
```

### Flujo de Recuperación

1. **Usuario ingresa email**
   - Validación en tiempo real al perder foco
   - Mensaje de error si formato es inválido

2. **Usuario hace submit**
   - Botón cambia a estado "loading"
   - Validación final de Yup
   - Llamada a `authService.forgotPassword(email)`

3. **Casos de respuesta:**

   **a) Éxito (200):**
   - Formulario se limpia
   - Se muestra mensaje de éxito con CheckCircle icon
   - Botón para volver a login
   - Instrucción de revisar bandeja de entrada y spam

   **b) Error del backend (400/404/500):**
   - Mensaje de error se muestra arriba del formulario
   - Usuario puede corregir e intentar de nuevo

   **c) Error de red:**
   - Mensaje: "No se pudo conectar con el servidor"

### Ejemplo de Respuesta Exitosa

```javascript
{
  success: true,
  message: "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña."
}
```

### Ejemplo de Error

```javascript
// Error: Email inválido
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "El email no es válido"
  }
}

// Error: Servicio de email no disponible
{
  success: false,
  error: {
    code: "EMAIL_SERVICE_ERROR",
    message: "No se pudo enviar el email. Intenta de nuevo más tarde."
  }
}
```

### Iconos Usados

- `CheckCircle`: Confirmación de éxito (Lucide React)
- `Loader2`: Spinner de loading (Lucide React)

### Accesibilidad

- Label asociado al input con `htmlFor`
- Mensaje de error con `aria-invalid` implícito
- Botón disabled durante submit
- autoFocus en campo de email para mejor UX
- autoComplete="email" para sugerencias del navegador
- Placeholders informativos

### Responsive Design

- Desktop: Formulario centrado con max-w-md
- Mobile: Padding lateral para evitar overflow
- Input con width 100%
- Botón full-width en mobile
- Banner de instrucciones responsive

### Testing

Para testear el componente:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from './ForgotPasswordForm';

// Mockear authService
jest.mock('../services/authService');

test('muestra mensaje de éxito después de solicitud exitosa', async () => {
  authService.forgotPassword.mockResolvedValue({
    success: true,
    message: 'Email enviado'
  });

  render(<ForgotPasswordForm />);

  const emailInput = screen.getByLabelText(/Email/i);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Enviar Instrucciones'));

  await waitFor(() => {
    expect(screen.getByText(/Email Enviado/i)).toBeInTheDocument();
    expect(screen.getByText(/Volver al Inicio de Sesión/i)).toBeInTheDocument();
  });
});

test('muestra error del backend', async () => {
  authService.forgotPassword.mockRejectedValue(
    new Error('No se pudo enviar el email')
  );

  render(<ForgotPasswordForm />);

  const emailInput = screen.getByLabelText(/Email/i);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Enviar Instrucciones'));

  await waitFor(() => {
    expect(screen.getByText('No se pudo enviar el email')).toBeInTheDocument();
  });
});

test('valida formato de email', async () => {
  render(<ForgotPasswordForm />);

  const emailInput = screen.getByLabelText(/Email/i);
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.blur(emailInput);

  await waitFor(() => {
    expect(screen.getByText('El email no es válido')).toBeInTheDocument();
  });
});
```

### Mejoras Futuras

- [ ] Agregar rate limiting visual (máximo 3 intentos por hora)
- [ ] Agregar botón "Reenviar email" si el usuario no lo recibió
- [ ] Mostrar tiempo de expiración del link (ej: "El link expira en 1 hora")
- [ ] Agregar captcha para prevenir spam/bots
- [ ] Permitir copiar email ingresado al portapapeles

### Dependencias

- `react-hook-form`: ^7.53.0
- `@hookform/resolvers`: (viene con react-hook-form)
- `yup`: ^1.4.0
- `lucide-react`: ^0.445.0
- `authService`: Servicio de autenticación (TASK-015)

### Notas Importantes

1. **Mensaje genérico por seguridad**: El backend siempre retorna el mismo mensaje exitoso, independientemente de si el email existe o no. Esto previene enumeration attacks donde un atacante podría descubrir qué emails están registrados.

2. **No muestra si el email existe**: Por razones de seguridad, NUNCA decimos "Este email no existe" al usuario.

3. **Link de recuperación**: El backend genera un token JWT de corta duración (1 hora) que se envía por email.

4. **Limpieza del formulario**: Después de éxito, el formulario se limpia automáticamente con `reset()`.

5. **autoFocus**: El campo de email tiene autofocus para mejor UX al cargar la página.
