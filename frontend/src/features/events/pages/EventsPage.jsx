import { useState } from 'react';
import { Calendar } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { EventList, EventDetailModal } from '../components';

/**
 * EventsPage - Página principal de eventos
 *
 * Ruta: /dashboard/events (protegida)
 *
 * Features:
 * - Header con título y descripción
 * - EventList con filtros por modalidad
 * - Grid responsive de eventos
 * - Paginación
 * - Modal de detalle al hacer click en evento
 * - Registro a eventos con confirmación por email
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * - Task 4.6 ✅ Frontend - EventList Component
 * - Task 4.7 ✅ Frontend - EventDetail Component
 *
 * @returns {JSX.Element} Página de eventos
 */
const EventsPage = () => {
  // Estado para evento seleccionado y modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventos Comunitarios</h1>
            <p className="text-gray-600 mt-1">
              Conecta con otras mujeres en talleres, webinars y eventos presenciales
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      {/* Event List con filtros */}
      <EventList onEventClick={handleEventClick} />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default EventsPage;
