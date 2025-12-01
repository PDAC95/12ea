import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  X,
  Check,
  Video,
  Home,
  Smartphone,
  XCircle,
} from 'lucide-react';
import api from '../../../shared/utils/api';
import EventForm from './EventForm';
import EventRegistrations from './EventRegistrations';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../../shared/context/ToastContext';

/**
 * AdminEventList - Lista de gestión de eventos para admin
 * Task 8.5 - Sprint 4
 *
 * Features:
 * - Lista/tabla de eventos con columnas: imagen, título, fecha, modalidad, registrados/capacidad, estado, acciones
 * - Filtros: por estado (todos/próximos/pasados/cancelados) y búsqueda por título
 * - Acciones: Editar, Ver Registros, Cancelar Evento
 * - Botón "Crear Nuevo Evento"
 * - Paginación (20 por página)
 * - Loading states
 * - Empty states
 */

const AdminEventList = () => {
  const { showToast } = useToast();

  // ===== ESTADO =====
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [statusFilter, setStatusFilter] = useState('all'); // all | upcoming | past | cancelled
  const [searchQuery, setSearchQuery] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const itemsPerPage = 20;

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ===== FETCH EVENTOS =====
  const fetchEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await api.get(`/admin/events?${params.toString()}`);

      // Backend retorna: { success, count, total, page, pages, data: [events array] }
      const responseData = response.data || {};
      const fetchedEvents = Array.isArray(responseData.data) ? responseData.data : [];
      const totalPages = responseData.pages || 1;
      const totalCount = responseData.total || 0;

      setEvents(fetchedEvents);
      setTotalPages(totalPages);
      setTotalEvents(totalCount);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar eventos';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    fetchEvents();
  }, [statusFilter, currentPage, searchQuery]);

  // ===== HANDLERS =====

  /**
   * Handler para crear evento
   */
  const handleCreateEvent = async (eventData) => {
    try {
      await api.post('/admin/events', eventData);
      setShowCreateModal(false);
      fetchEvents(); // Refrescar lista
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear evento';
      return Promise.reject(new Error(errorMessage));
    }
  };

  /**
   * Handler para editar evento
   */
  const handleEditEvent = async (eventData) => {
    try {
      await api.put(`/admin/events/${selectedEvent._id}`, eventData);
      setShowEditModal(false);
      setSelectedEvent(null);
      fetchEvents(); // Refrescar lista
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar evento';
      return Promise.reject(new Error(errorMessage));
    }
  };

  /**
   * Handler para cancelar evento (soft delete)
   */
  const handleCancelEvent = async () => {
    try {
      // Sin ?hard=true hace soft delete (status='cancelled', isActive=false)
      await api.delete(`/admin/events/${selectedEvent._id}`);
      showToast('success', `Evento "${selectedEvent.title}" cancelado exitosamente`);
      setShowCancelModal(false);
      setSelectedEvent(null);
      fetchEvents(); // Refrescar lista
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cancelar evento';
      showToast('error', errorMessage);
      console.error('Error canceling event:', err);
    }
  };

  /**
   * Handler para eliminar evento permanentemente (hard delete)
   */
  const handleDeleteEvent = async () => {
    try {
      // Con ?hard=true elimina permanentemente de la BD
      await api.delete(`/admin/events/${selectedEvent._id}?hard=true`);
      showToast('success', `Evento "${selectedEvent.title}" eliminado permanentemente`);
      setShowDeleteModal(false);
      setSelectedEvent(null);
      fetchEvents(); // Refrescar lista
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar evento';
      showToast('error', errorMessage);
      console.error('Error deleting event:', err);
    }
  };

  /**
   * Abrir modal de edición
   */
  const openEditModal = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  /**
   * Abrir modal de registros
   */
  const openRegistrationsModal = (event) => {
    setSelectedEvent(event);
    setShowRegistrationsModal(true);
  };

  /**
   * Abrir modal de cancelación (soft delete)
   */
  const openCancelModal = (event) => {
    setSelectedEvent(event);
    setShowCancelModal(true);
  };

  /**
   * Abrir modal de eliminación (hard delete)
   */
  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  /**
   * Handler de búsqueda con debounce
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset a página 1 al buscar
  };

  /**
   * Formatear fecha
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Obtener badge de modalidad
   */
  const getModeBadge = (mode) => {
    const modes = {
      virtual: { color: 'bg-blue-100 text-blue-800', icon: Video, label: 'Virtual' },
      presencial: { color: 'bg-green-100 text-green-800', icon: Home, label: 'Presencial' },
      híbrido: { color: 'bg-purple-100 text-purple-800', icon: Smartphone, label: 'Híbrido' },
    };

    const modeData = modes[mode] || modes.virtual;
    const Icon = modeData.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${modeData.color}`}
      >
        <Icon className="w-3 h-3" />
        {modeData.label}
      </span>
    );
  };

  /**
   * Obtener badge de estado
   */
  const getStatusBadge = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const isCancelled = event.status === 'cancelled' || !event.isActive;
    const isPast = eventDate < now;

    if (isCancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3" />
          Cancelado
        </span>
      );
    }

    if (isPast) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Check className="w-3 h-3" />
          Finalizado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Calendar className="w-3 h-3" />
        Próximo
      </span>
    );
  };

  // ===== RENDER =====

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
              <p className="text-gray-600 mt-1">
                Total: {totalEvents} eventos
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Nuevo Evento
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtro por Estado */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="upcoming">Próximos</option>
                <option value="past">Pasados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar por título..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && (!events || events.length === 0) && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay eventos
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No se encontraron eventos con "${searchQuery}"`
                : 'Comienza creando tu primer evento'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Evento
              </button>
            )}
          </div>
        )}

        {/* Tabla de Eventos */}
        {!loading && events && events.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha & Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modalidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition">
                      {/* Evento (Imagen + Título) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            {event.category && (
                              <p className="text-sm text-gray-500">{event.category}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Fecha & Hora */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{formatDate(event.date)}</span>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                      </td>

                      {/* Modalidad */}
                      <td className="px-6 py-4">{getModeBadge(event.mode)}</td>

                      {/* Capacidad */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {event.registeredCount || 0} / {event.capacity}
                          </span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">{getStatusBadge(event)}</td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openRegistrationsModal(event)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Ver Registros"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openCancelModal(event)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cancelar Evento (soft delete)"
                            disabled={event.status === 'cancelled'}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(event)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar Permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Crear Evento */}
        {showCreateModal && (
          <Modal title="Crear Nuevo Evento" onClose={() => setShowCreateModal(false)}>
            <EventForm
              mode="create"
              onSubmit={handleCreateEvent}
              onCancel={() => setShowCreateModal(false)}
            />
          </Modal>
        )}

        {/* Modal Editar Evento */}
        {showEditModal && selectedEvent && (
          <Modal title="Editar Evento" onClose={() => setShowEditModal(false)}>
            <EventForm
              mode="edit"
              initialData={selectedEvent}
              onSubmit={handleEditEvent}
              onCancel={() => setShowEditModal(false)}
            />
          </Modal>
        )}

        {/* Modal Ver Registros */}
        {showRegistrationsModal && selectedEvent && (
          <EventRegistrations
            eventId={selectedEvent._id}
            eventTitle={selectedEvent.title}
            isOpen={showRegistrationsModal}
            onClose={() => {
              setShowRegistrationsModal(false);
              setSelectedEvent(null);
            }}
          />
        )}

        {/* Modal Cancelar Evento */}
        {showCancelModal && selectedEvent && (
          <ConfirmCancelModal
            event={selectedEvent}
            onConfirm={handleCancelEvent}
            onCancel={() => {
              setShowCancelModal(false);
              setSelectedEvent(null);
            }}
          />
        )}

        {/* Modal Eliminar Evento */}
        {showDeleteModal && selectedEvent && (
          <ConfirmDeleteModal
            event={selectedEvent}
            onConfirm={handleDeleteEvent}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </div>
      </div>
    </AdminLayout>
  );
};

// ===== COMPONENTES AUXILIARES =====

/**
 * Modal genérico
 */
const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

/**
 * Modal de Confirmación de Cancelación
 */
const ConfirmCancelModal = ({ event, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <Modal title="Confirmar Cancelación" onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-gray-700">
          ¿Estás segura de que quieres cancelar el siguiente evento?
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-gray-900">{event.title}</p>
          <p className="text-sm text-gray-600">
            {new Date(event.date).toLocaleDateString('es-ES')} • {event.time}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {event.registeredCount || 0} personas registradas
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-800 font-medium">
            ℹ️ El evento será marcado como cancelado pero se mantendrá en la base de datos. Para eliminar permanentemente, usa el botón de eliminar.
          </p>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Confirmar Cancelación
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            No, Mantener Evento
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Modal de Confirmación de Eliminación Permanente
 */
const ConfirmDeleteModal = ({ event, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Eliminar Evento</h3>
            <p className="text-sm text-gray-600 mt-1">
              ¿Estás segura de que deseas eliminar este evento?
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-900">{event.title}</p>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(event.date).toLocaleDateString('es-ES')} • {event.time}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {event.registeredCount || 0} personas registradas
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ Esta acción no se puede deshacer. El evento será eliminado permanentemente de la base de datos.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Eliminando...
              </span>
            ) : (
              'Eliminar Permanentemente'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventList;
