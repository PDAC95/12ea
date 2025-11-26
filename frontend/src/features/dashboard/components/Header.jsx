import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import PropTypes from 'prop-types';
import logo from '../../../assets/images/logo/logo.png';

/**
 * Header - Componente de encabezado del dashboard
 *
 * Features:
 * - Logo de la aplicación
 * - Botón de logout con confirmación
 * - Hamburger menu para móvil (toggle sidebar)
 * - Responsive design
 * - Sticky position
 *
 * @param {Function} onMenuClick - Callback para toggle del sidebar móvil
 * @returns {JSX.Element} Header del dashboard
 */
const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás segura de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - Solo visible en móvil */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Entre Amigas"
              className="h-10 w-auto"
            />
            <h1 className="hidden sm:block text-xl font-bold text-gray-900">
              Entre Amigas
            </h1>
          </div>
        </div>

        {/* Right Section: User Info + Logout */}
        <div className="flex items-center gap-3">
          {/* User Greeting - Hidden en móvil pequeño */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.preferredName || user?.fullName || 'Usuaria'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;
