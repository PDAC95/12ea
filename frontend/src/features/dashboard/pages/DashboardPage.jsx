import { useAuth } from '../../auth/context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import WelcomeSection from '../components/WelcomeSection';
import NavigationCards from '../components/NavigationCards';
import EventsPreview from '../components/EventsPreview';
import BlogPreview from '../components/BlogPreview';

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
 * - Preview de últimos posts del blog
 *
 * Sprint 2 - US-003: Dashboard Principal de Usuaria ✅ COMPLETADO
 * - Task 3.1 ✅ Layout Base del Dashboard implementado
 * - Task 3.2 ✅ Sección de Bienvenida Personalizada implementada
 * - Task 3.3 ✅ Cards de Navegación Principal implementadas
 * - Task 3.4 ✅ Preview de Próximos Eventos implementado
 * - Task 3.5 ✅ Protected Route Setup implementado
 * - Task 3.6 ✅ Responsive & Polish Final completado
 *
 * Sprint 5 - US-5.9: Dashboard Content Updates
 * - Task 5.9.1 ✅ Actualizar tarjeta de eventos con API real
 * - Task 5.9.2 ✅ Actualizar tarjeta de blog con API real
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

      {/* Events Preview - Task 3.4 + Task 5.9.1 */}
      <EventsPreview />

      {/* Blog Preview - Task 5.9.2 */}
      <BlogPreview />

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
