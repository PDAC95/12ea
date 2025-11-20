import { useState } from 'react';
import { Calendar, Lightbulb } from 'lucide-react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { EventList, EventDetailModal, ProposeEventModal } from '../components';

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
 * - Botón "Proponer Evento" para que usuarios sugieran eventos
 * - Layout responsive con DashboardLayout
 * - Navegación integrada en sidebar
 *
 * Sprint 3 - US-004: Ver y Registrarse en Eventos
 * - Task 4.6 ✅ Frontend - EventList Component
 * - Task 4.7 ✅ Frontend - EventDetail Component
 *
 * Sprint 5 - US-5.10: User Submission Workflows
 * - Task 5.10.1 ✅ Frontend - ProposeEventModal Component
 *
 * @returns {JSX.Element} Página de eventos
 */
const EventsPage = () => {
  // Estado para evento seleccionado y modal de detalle
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para modal de proponer evento
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  /**
   * Handler para cuando se hace click en un evento
   * Abre el modal de detalle
   */
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  /**
   * Handler para cerrar el modal de detalle
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Limpiar selectedEvent después de la animación de cierre
    setTimeout(() => setSelectedEvent(null), 300);
  };

  /**
   * Handler para abrir modal de proponer evento
   */
  const handleOpenProposeModal = () => {
    setIsProposeModalOpen(true);
  };

  /**
   * Handler para cerrar modal de proponer evento
   */
  const handleCloseProposeModal = () => {
    setIsProposeModalOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        {/* Icon + Title + Botón Proponer Evento */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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

          {/* Botón Proponer Evento - Desktop */}
          <button
            onClick={handleOpenProposeModal}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            <Lightbulb className="w-5 h-5" />
            Proponer Evento
          </button>
        </div>

        {/* Botón Proponer Evento - Móvil */}
        <button
          onClick={handleOpenProposeModal}
          className="md:hidden flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg mb-4"
        >
          <Lightbulb className="w-5 h-5" />
          Proponer Evento
        </button>

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

      {/* Propose Event Modal */}
      <ProposeEventModal
        isOpen={isProposeModalOpen}
        onClose={handleCloseProposeModal}
      />
    </DashboardLayout>
  );
};

export default EventsPage;
