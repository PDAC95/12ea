import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { hasValidSession, getStoredToken, isTokenExpired } from '../shared/utils/jwtHelper';
import { useEffect } from 'react';

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 *
 * Uso:
 * ```jsx
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 * ```
 *
 * Features:
 * - Verifica JWT en localStorage
 * - Valida estructura y expiración del token
 * - Verifica autenticación usando AuthContext
 * - Muestra loading spinner mientras verifica autenticación
 * - Redirige a /login si no está autenticado o token inválido
 * - Preserva la ruta original in location.state para redirect después de login
 * - Renderiza children si está autenticado
 * - Logout automático si el token expira
 *
 * Sprint 2 - Task 3.5 ✅
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes a renderizar si está autenticado
 * @returns {JSX.Element} Children o redirect a login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  // Verificación adicional: Comprobar token JWT en localStorage
  useEffect(() => {
    const token = getStoredToken();

    // Si hay token pero está expirado, hacer logout automático
    if (token && isTokenExpired(token)) {
      console.warn('Token JWT expirado. Cerrando sesión automáticamente...');
      logout();
    }
  }, [logout]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Verificar token JWT en localStorage
  const hasValidToken = hasValidSession();

  // Si NO hay token válido O NO está autenticado, redirigir a login
  if (!hasValidToken || !isAuthenticated) {
    // Si había token pero ya no es válido, limpiarlo
    if (!hasValidToken && isAuthenticated) {
      console.warn('No se encontró token válido. Redirigiendo a login...');
      logout(); // Limpia localStorage
    }

    // Guardar la ruta original para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado Y tiene token válido, renderizar children
  return children;
};

export default ProtectedRoute;
