import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

/**
 * DashboardLayout - Layout principal del dashboard
 *
 * Features:
 * - Layout con sidebar en desktop, navbar en móvil
 * - Header fijo sticky
 * - Container responsive para contenido
 * - Manejo de estado del mobile nav
 * - Outlet para nested routes
 *
 * Estructura:
 * - Desktop (lg+): Header + Sidebar lateral + Main content
 * - Mobile (< lg): Header + Mobile drawer + Main content
 *
 * Usage:
 * ```jsx
 * <DashboardLayout>
 *   <YourPageComponent />
 * </DashboardLayout>
 * ```
 *
 * O con React Router:
 * ```jsx
 * <Route element={<DashboardLayout />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 * ```
 *
 * @param {React.ReactNode} children - Contenido del dashboard (opcional, usa Outlet si no se pasa)
 * @returns {JSX.Element} Layout del dashboard
 */
const DashboardLayout = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleOpenMobileNav = () => {
    setIsMobileNavOpen(true);
  };

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky top */}
      <Header onMenuClick={handleOpenMobileNav} />

      {/* Layout Container */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop only */}
        <Sidebar />

        {/* Mobile Nav - Mobile only */}
        <MobileNav isOpen={isMobileNavOpen} onClose={handleCloseMobileNav} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Render children si se pasan, sino usar Outlet para nested routes */}
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
