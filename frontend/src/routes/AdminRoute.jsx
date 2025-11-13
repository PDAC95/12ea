import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../features/auth/context/AuthContext';

/**
 * AdminRoute - Protected Route para rutas de administrador
 *
 * Verifica que el usuario esté autenticado Y tenga role === 'admin'
 * Si no está autenticado → redirige a /login
 * Si está autenticado pero no es admin → redirige a /dashboard con mensaje de error
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.4 - Frontend Admin Layout
 *
 * @param {Object} props
 * @param {JSX.Element} props.children - Componente hijo a renderizar si es admin
 * @returns {JSX.Element} Children o Navigate
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mostrar loading mientras carga el usuario
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es admin, redirigir a dashboard
  if (user?.role !== 'admin') {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          error: 'No tienes permisos para acceder a esta sección. Se requiere rol de administrador.',
        }}
      />
    );
  }

  // Si es admin, renderizar children
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
