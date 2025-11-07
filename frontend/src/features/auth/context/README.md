# AuthContext - Contexto de Autenticación

## Descripción

Sistema de gestión de estado global para autenticación de usuarios usando React Context API.

## Uso

### 1. Configurar el AuthProvider en App.jsx

```jsx
import { AuthProvider } from './features/auth/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Tu aplicación aquí */}
      <AppRoutes />
    </AuthProvider>
  );
}
```

### 2. Usar el hook useAuth en componentes

```jsx
import { useAuth } from '../features/auth/context/AuthContext';

function LoginForm() {
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      // Guardar token y usuario en contexto
      login(token, user);

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al hacer login:', error);
    }
  };

  return (
    // ... tu formulario
  );
}
```

### 3. Ejemplo de Protected Route

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### 4. Ejemplo de Logout

```jsx
import { useAuth } from '../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <p>Bienvenida, {user?.preferredName || user?.fullName}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </header>
  );
}
```

## API del Contexto

### Estado

- **user** (object | null): Datos del usuario autenticado
- **token** (string | null): Token JWT de autenticación
- **isAuthenticated** (boolean): Indica si hay un usuario autenticado
- **isLoading** (boolean): Indica si está cargando datos de localStorage

### Funciones

- **login(token, userData)**: Guarda token y usuario en localStorage y state
- **logout()**: Limpia token y usuario de localStorage y state
- **loadUser()**: Carga usuario desde localStorage (se ejecuta automáticamente al montar)
- **updateUser(updatedUserData)**: Actualiza los datos del usuario (útil para editar perfil)

## Características

✅ Persistencia en localStorage
✅ Auto-login al recargar página
✅ Manejo de errores robusto
✅ Optimización con useCallback
✅ PropTypes para validación
✅ Documentación JSDoc completa
✅ Función extra updateUser para editar perfil

## Notas de Seguridad

- El token se guarda en localStorage (no en cookies)
- El token debe incluirse en headers de Axios (ver `api.js`)
- La validación real se hace en el backend con JWT
- El token expira en 7 días (configurado en backend)
