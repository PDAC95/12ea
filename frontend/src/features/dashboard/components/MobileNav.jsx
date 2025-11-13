import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Building2,
  Briefcase,
  BookOpen,
  User,
  X,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

/**
 * MobileNav - Navegación móvil con overlay
 *
 * Features:
 * - Drawer lateral que se desliza desde la izquierda
 * - Overlay oscuro de fondo
 * - Mismo contenido que Sidebar
 * - Cierra al hacer click en overlay o en un link
 * - Animaciones suaves
 * - Solo visible en móvil (< lg)
 *
 * @param {boolean} isOpen - Estado de apertura del drawer
 * @param {Function} onClose - Callback para cerrar el drawer
 * @returns {JSX.Element} Navegación móvil
 */
const MobileNav = ({ isOpen, onClose }) => {
  // Definición de items de navegación (mismo que Sidebar)
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
      badge: 'Próximamente',
    },
  ];

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // No renderizar nada si está cerrado
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay de fondo */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col">
        {/* Header del Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Entre Amigas</h2>
          </div>

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
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
                onClick={onClose} // Cerrar drawer al hacer click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
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
                        isActive ? 'text-primary-600' : 'text-gray-400'
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

        {/* Footer del Drawer */}
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
    </>
  );
};

MobileNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileNav;
