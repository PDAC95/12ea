import { BarChart3, Store, Briefcase, Users, TrendingUp } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

/**
 * AdminDashboardPage - Dashboard principal del panel de administración
 *
 * Features:
 * - Cards con estadísticas generales
 * - Placeholder para gráficos y métricas
 * - Diseño limpio y moderno
 * - 100% Responsive
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.4 - Frontend Admin Layout
 *
 * @returns {JSX.Element} Admin dashboard page
 */
const AdminDashboardPage = () => {
  /**
   * Estadísticas placeholder
   * TODO: Conectar con API en futuras tasks
   */
  const stats = [
    {
      name: 'Total Negocios',
      value: '0',
      icon: Store,
      change: '+0%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      name: 'Total Servicios',
      value: '0',
      icon: Briefcase,
      change: '+0%',
      changeType: 'increase',
      color: 'green',
    },
    {
      name: 'Total Usuarios',
      value: '1',
      icon: Users,
      change: '+0%',
      changeType: 'neutral',
      color: 'purple',
    },
    {
      name: 'Actividad Mensual',
      value: '0',
      icon: TrendingUp,
      change: '+0%',
      changeType: 'neutral',
      color: 'orange',
    },
  ];

  /**
   * Obtener color del ícono según tipo
   */
  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
    };
    return colors[color] || 'text-gray-600 bg-gray-100';
  };

  /**
   * Obtener color del cambio según tipo
   */
  const getChangeColor = (type) => {
    const colors = {
      increase: 'text-green-600',
      decrease: 'text-red-600',
      neutral: 'text-gray-600',
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen general de la plataforma Entre Amigas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${getIconColor(stat.color)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Placeholder para gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placeholder 1 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                <p className="text-sm text-gray-500">Últimos 30 días</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Gráfico de Actividad</p>
                <p className="text-xs text-gray-500 mt-1">Próximamente en futuras tasks</p>
              </div>
            </div>
          </div>

          {/* Placeholder 2 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Registros por Categoría</h3>
                <p className="text-sm text-gray-500">Distribución actual</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Gráfico de Distribución</p>
                <p className="text-xs text-gray-500 mt-1">Próximamente en futuras tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bienvenida al Panel de Administración
              </h3>
              <p className="text-gray-700 mb-4">
                Desde aquí podrás gestionar todos los contenidos de la plataforma Entre Amigas:
                negocios, servicios y usuarios registrados.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>Usa el menú lateral para navegar entre las secciones</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>Las estadísticas se actualizan en tiempo real</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>
                    Funcionalidades de gestión se implementarán en las siguientes tasks
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
