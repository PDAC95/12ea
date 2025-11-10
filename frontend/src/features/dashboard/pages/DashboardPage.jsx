import { useAuth } from '../../auth/context/AuthContext';
import { LogOut, User } from 'lucide-react';

/**
 * DashboardPage - Página principal del dashboard (placeholder)
 *
 * Ruta: /dashboard (protegida)
 *
 * Features:
 * - Muestra información del usuario autenticado
 * - Botón de logout funcional
 * - Placeholder para futuras funcionalidades
 *
 * TODO: Implementar dashboard completo en Sprint 2
 *
 * @returns {JSX.Element} Dashboard placeholder
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard - Entre Amigas</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Bienvenida, {user?.preferredName || user?.fullName || 'Usuaria'}!
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ Autenticación funcionando correctamente
            </p>
            <p className="text-green-700 text-sm mt-1">
              Has iniciado sesión exitosamente. Este es un dashboard placeholder.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eventos</h3>
            <p className="text-gray-600 text-sm">Próximamente: Ver y crear eventos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Directorio</h3>
            <p className="text-gray-600 text-sm">Próximamente: Directorio de negocios</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
            <p className="text-gray-600 text-sm">Próximamente: Artículos de la comunidad</p>
          </div>
        </div>

        {/* Debug Info (Solo en desarrollo) */}
        {import.meta.env.DEV && (
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Info</h3>
            <pre className="text-xs bg-white p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
