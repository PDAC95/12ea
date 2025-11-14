import { useState, useEffect } from 'react';
import { X, Users, Download, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../shared/utils/api';

/**
 * EventRegistrations - Modal para ver lista de registradas a un evento
 * Task 8.6 - Sprint 4
 *
 * Props:
 * - eventId: ID del evento (required)
 * - eventTitle: Título del evento para mostrar en header (required)
 * - isOpen: Boolean para controlar visibilidad del modal (required)
 * - onClose: Función para cerrar el modal (required)
 */
const EventRegistrations = ({ eventId, eventTitle, isOpen, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetch registrations cuando se abre el modal
   */
  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    }
  }, [isOpen, eventId]);

  /**
   * Fetch de registrations desde el backend
   */
  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      setRegistrations(response.data.data.registrations || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.response?.data?.message || 'Error al cargar las registraciones');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exportar registrations a CSV (generación desde frontend)
   */
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('No hay registros para exportar');
      return;
    }

    try {
      // Crear contenido CSV
      const headers = ['Nombre', 'Email', 'Fecha de Registro'];
      const rows = registrations.map((reg) => [
        reg.name || 'Sin nombre',
        reg.email || 'Sin email',
        formatDate(reg.registeredAt),
      ]);

      // Combinar headers y rows
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // Crear BOM para compatibilidad con Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // Crear blob y descarga
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evento-${eventId}-registradas.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('CSV exported successfully');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Error al exportar CSV');
    }
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Cerrar modal
   */
  const handleClose = () => {
    setRegistrations([]);
    setError('');
    onClose();
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Registradas al Evento</h2>
              <p className="text-sm text-primary-100">{eventTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-primary-700 p-2 rounded-lg transition"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Cargando registraciones...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchRegistrations}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && registrations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aún no hay personas registradas
              </h3>
              <p className="text-gray-600">
                Cuando alguien se registre al evento, aparecerá aquí.
              </p>
            </div>
          )}

          {/* Registrations List */}
          {!loading && !error && registrations.length > 0 && (
            <div>
              {/* Counter */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-700 font-medium">
                  <span className="text-2xl font-bold text-primary-600">
                    {registrations.length}
                  </span>{' '}
                  {registrations.length === 1 ? 'persona registrada' : 'personas registradas'}
                </p>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

              {/* Table - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Registro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration, index) => (
                      <tr key={registration._id || index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {registration.name || 'Sin nombre'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{registration.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(registration.registeredAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards - Mobile */}
              <div className="md:hidden space-y-3">
                {registrations.map((registration, index) => (
                  <div
                    key={registration._id || index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {registration.name || 'Sin nombre'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{registration.email}</p>
                    <p className="text-xs text-gray-500">
                      Registrado: {formatDate(registration.registeredAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;
