import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 *
 * Uso:
 * ```jsx
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 * ```
 *
 * Features:
 * - Verifica si el usuario está autenticado usando AuthContext
 * - Muestra loading spinner mientras verifica autenticación
 * - Redirige a /login si no está autenticado
 * - Preserva la ruta original en location.state para redirect después de login
 * - Renderiza children si está autenticado
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes a renderizar si está autenticado
 * @returns {JSX.Element} Children o redirect a login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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

  // Si NO está autenticado, redirigir a login
  if (!isAuthenticated) {
    // Guardar la ruta original para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizar children
  return children;
};

export default ProtectedRoute;
