import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Briefcase,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import logo from '../../../assets/images/logo/logo.png';

/**
 * AdminLayout - Layout principal para el panel de administración
 *
 * Features:
 * - Sidebar con navegación admin
 * - Topbar con usuario y logout
 * - Responsive (sidebar colapsable en mobile)
 * - Active state en navegación
 * - Diseño limpio estilo dashboard moderno
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.4 - Frontend Admin Layout
 *
 * @param {Object} props
 * @param {JSX.Element} props.children - Contenido de la página
 * @returns {JSX.Element} Layout admin
 */
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Navegación del sidebar
   */
  const navigation = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      description: 'Resumen general',
    },
    {
      name: 'Negocios',
      path: '/admin/businesses',
      icon: Store,
      description: 'Gestión de negocios',
    },
    {
      name: 'Eventos',
      path: '/admin/events',
      icon: Calendar,
      description: 'Gestión de eventos',
    },
    {
      name: 'Servicios',
      path: '/admin/services',
      icon: Briefcase,
      description: 'Gestión de servicios',
    },
    {
      name: 'Blog',
      path: '/admin/blog',
      icon: FileText,
      description: 'Gestión del blog',
    },
    {
      name: 'Usuarios',
      path: '/admin/users',
      icon: Users,
      description: 'Gestión de usuarios',
    },
  ];

  /**
   * Handler para cerrar sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Toggle sidebar en mobile
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Verificar si ruta está activa
   */
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Entre Amigas" className="h-10 w-auto" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Entre Amigas</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${active ? 'text-primary-900' : ''}`}>
                    {item.name}
                  </div>
                  {active && (
                    <div className="text-xs text-primary-600 mt-0.5">{item.description}</div>
                  )}
                </div>
                {active && <ChevronRight className="w-4 h-4 text-primary-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded mt-1">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={toggleSidebar}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Entre Amigas" className="h-10 w-auto" />
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Entre Amigas</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                      ${
                        active
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${active ? 'text-primary-900' : ''}`}>
                        {item.name}
                      </div>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-primary-600" />}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Info */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded mt-1">
                    Admin
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Panel de Administración</h1>
            <p className="text-sm text-gray-500">Gestiona el contenido de la plataforma</p>
          </div>

          {/* Desktop User Info (simple) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
