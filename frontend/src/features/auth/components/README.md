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
