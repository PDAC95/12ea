import { useAuth } from '../../auth/context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import WelcomeSection from '../components/WelcomeSection';
import NavigationCards from '../components/NavigationCards';
import EventsPreview from '../components/EventsPreview';

/**
 * DashboardPage - Página principal del dashboard
 *
 * Ruta: /dashboard (protegida)
 *
 * Features:
 * - Muestra información del usuario autenticado
 * - Layout responsive con sidebar/navbar
 * - Sección de bienvenida personalizada
 * - Cards de navegación a secciones principales
 * - Preview de próximos eventos
 *
 * Sprint 2 - US-003: Dashboard Principal de Usuaria ✅ COMPLETADO
 * - Task 3.1 ✅ Layout Base del Dashboard implementado
 * - Task 3.2 ✅ Sección de Bienvenida Personalizada implementada
 * - Task 3.3 ✅ Cards de Navegación Principal implementadas
 * - Task 3.4 ✅ Preview de Próximos Eventos implementado
 * - Task 3.5 ✅ Protected Route Setup implementado
 * - Task 3.6 ✅ Responsive & Polish Final completado
 *
 * @returns {JSX.Element} Dashboard principal
 */
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Welcome Section - Task 3.2 */}
      <WelcomeSection />

      {/* Navigation Cards - Task 3.3 */}
      <NavigationCards />

      {/* Events Preview - Task 3.4 */}
      <EventsPreview />

      {/* Debug Info (Solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Info</h3>
          <pre className="text-xs bg-white p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
