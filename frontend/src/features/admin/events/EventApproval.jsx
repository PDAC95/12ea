import { useState, useEffect } from 'react';
import { useEventApproval } from '../hooks/useEventApproval';
import { useToast } from '../../../shared/context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import {
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Loader2,
  Clock,
  Link as LinkIcon,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * EventApproval - Interfaz admin para aprobar/rechazar eventos propuestos
 *
 * Features:
 * - Tabla con eventos pendientes de aprobación
 * - Botones "Aprobar" y "Rechazar" por cada evento
 * - Modal de confirmación para aprobar
 * - Modal con textarea para rechazar (con razón opcional)
 * - Loading, error y empty states
 * - Paginación
 * - Notificación por email automática al aprobar/rechazar
 *
 * Sprint 5 - US-5.10: User Submission Workflows
 * Task 5.10.3 - Admin Approval Workflow
 *
 * Ruta: /admin/events/pending (protegida, solo admin)
 *
 * @returns {JSX.Element} Componente de aprobación de eventos
 */
const EventApproval = () => {
  const { events, loading, error, pagination, fetchPendingEvents, approveEvent, rejectEvent } =
    useEventApproval();
  const { showToast } = useToast();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  /**
   * Handler para abrir modal de aprobación
   */
  const handleApprove = (event) => {
    setSelectedEvent(event);
    setShowApproveModal(true);
  };

  /**
   * Handler para confirmar aprobación
   */
  const confirmApprove = async () => {
    if (!selectedEvent) return;

    try {
      setActionLoading(true);
      await approveEvent(selectedEvent._id);
      showToast(`Evento "${selectedEvent.title}" aprobado exitosamente`, 'success');
      setShowApproveModal(false);
      setSelectedEvent(null);
      fetchPendingEvents(); // Refresh lista
    } catch (error) {
      showToast(error.message || 'Error al aprobar evento', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handler para abrir modal de rechazo
   */
  const handleReject = (event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
  };

  /**
   * Handler para confirmar rechazo
   */
  const confirmReject = async () => {
    if (!selectedEvent) return;

    try {
      setActionLoading(true);
      await rejectEvent(selectedEvent._id, rejectReason);
      showToast(`Evento "${selectedEvent.title}" rechazado`, 'success');
      setShowRejectModal(false);
      setSelectedEvent(null);
      setRejectReason('');
      fetchPendingEvents(); // Refresh lista
    } catch (error) {
      showToast(error.message || 'Error al rechazar evento', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Helper para obtener badge de modalidad
   */
  const getModeBadge = (mode) => {
    const badges = {
      virtual: 'bg-blue-100 text-blue-700 border-blue-200',
      presencial: 'bg-green-100 text-green-700 border-green-200',
      híbrido: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          badges[mode] || 'bg-gray-100 text-gray-700 border-gray-200'
        }`}
      >
        {mode}
      </span>
    );
  };

  /**
   * Helper para formatear fecha
   */
  const formatDate = (date) => {
    try {
      return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventos Pendientes</h1>
            <p className="text-gray-600 mt-1">Revisar y aprobar propuestas de la comunidad</p>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-gray-600">Cargando eventos...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && events && events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
            No hay eventos pendientes
          </h3>
          <p className="text-gray-600">¡Genial! Todas las propuestas han sido revisadas.</p>
        </div>
      )}

      {/* Tabla de Eventos */}
      {!loading && events && events.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organizador
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Modalidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {event.organizer?.preferredName || event.organizer?.email || 'Anónimo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getModeBadge(event.mode)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{event.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(event)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(event)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event._id} className="p-4">
                {/* Título y Descripción */}
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                {/* Organizador */}
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {event.organizer?.preferredName || event.organizer?.email || 'Anónimo'}
                  </span>
                </div>

                {/* Fecha y Hora */}
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{formatDate(event.date)}</span>
                  <Clock className="w-4 h-4 text-gray-400 ml-2" />
                  <span className="text-sm text-gray-500">{event.time}</span>
                </div>

                {/* Modalidad y Capacidad */}
                <div className="flex items-center gap-3 mb-3">
                  {getModeBadge(event.mode)}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.capacity}</span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(event)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleReject(event)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Aprobación */}
      {showApproveModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="font-display text-2xl font-bold mb-4 text-gray-900">
              ¿Aprobar este evento?
            </h3>
            <p className="text-gray-700 font-medium mb-2">{selectedEvent.title}</p>
            <p className="text-sm text-gray-500 mb-6">
              El evento será publicado y el organizador recibirá un email de confirmación.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Aprobando...
                  </>
                ) : (
                  'Sí, aprobar'
                )}
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="font-display text-2xl font-bold mb-4 text-gray-900">
              ¿Rechazar este evento?
            </h3>
            <p className="text-gray-700 font-medium mb-4">{selectedEvent.title}</p>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Razón del rechazo (opcional):
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 h-24 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: Falta información sobre la ubicación exacta..."
            />
            <div className="flex gap-3">
              <button
                onClick={confirmReject}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rechazando...
                  </>
                ) : (
                  'Rechazar'
                )}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default EventApproval;
