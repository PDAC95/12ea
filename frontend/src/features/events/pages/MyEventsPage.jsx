import { useState } from 'react';
import { Heart } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { MyEventsSection, EventDetailModal } from '../components';
import useMyEvents from '../../../shared/hooks/useMyEvents';

/**
 * MyEventsPage - Página de "Mis Eventos"
 *
 * Ruta: /dashboard/my-events (protegida)
 *
 * Features:
 * - Header con título y descripción
 * - MyEventsSection con tabs (próximos/pasados)
 * - Grid responsive de eventos registrados
 * - Click en card para ver detalle
 * - Modal de detalle integrado
 * - Loading states con skeletons
 * - Empty states personalizados
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * - Task 4.8 ✅ Frontend - MyEvents Section
 *
 * @returns {JSX.Element} Página de mis eventos
 */
const MyEventsPage = () => {
  // Estado para evento seleccionado y modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener eventos registrados usando custom hook
  const { upcomingEvents, pastEvents, loading, error } = useMyEvents();

  /**
   * Handler para cuando se hace click en un evento
   * Abre el modal de detalle
   */
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  /**
   * Handler para cerrar el modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Limpiar selectedEvent después de la animación de cierre
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Eventos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los eventos en los que estás registrada
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
      </div>

      {/* My Events Section con tabs */}
      <MyEventsSection
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default MyEventsPage;
