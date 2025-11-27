import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Building2,
  Briefcase,
  BookOpen,
  User,
} from 'lucide-react';

/**
 * Sidebar - Navegación lateral para desktop
 *
 * Features:
 * - Navegación principal del dashboard
 * - Iconos visuales con Lucide React
 * - Active states con React Router
 * - Solo visible en desktop (lg+)
 * - Fixed position
 *
 * Navigation Items:
 * - Dashboard (home)
 * - Eventos
 * - Mis Eventos
 * - Negocios
 * - Servicios
 * - Blog
 * - Perfil
 *
 * @returns {JSX.Element} Sidebar de navegación
 */
const Sidebar = () => {
  // Definición de items de navegación
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Panel principal',
    },
    {
      name: 'Eventos',
      path: '/dashboard/events',
      icon: Calendar,
      description: 'Actividades comunitarias',
    },
    {
      name: 'Mis Eventos',
      path: '/dashboard/my-events',
      icon: Heart,
      description: 'Eventos registrados',
    },
    {
      name: 'Negocios',
      path: '/dashboard/businesses',
      icon: Building2,
      description: 'Directorio de negocios',
    },
    {
      name: 'Servicios',
      path: '/dashboard/services',
      icon: Briefcase,
      description: 'Directorio de servicios',
    },
    {
      name: 'Blog',
      path: '/dashboard/blog',
      icon: BookOpen,
      description: 'Artículos y recursos',
    },
    {
      name: 'Mi Perfil',
      path: '/dashboard/profile',
      icon: User,
      description: 'Configuración personal',
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Navegación
        </h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{item.name}</span>
                    {item.description && (
                      <span className="block text-xs text-gray-500 truncate">
                        {item.description}
                      </span>
                    )}
                  </div>

                  {/* Badge (si existe) */}
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-900 mb-1">
            Comunidad Entre Amigas
          </p>
          <p className="text-xs text-gray-600">
            Conectando mujeres latinas en Canadá
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
