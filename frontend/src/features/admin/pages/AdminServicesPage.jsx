import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, Edit2, Trash2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../../shared/context/ToastContext';
import api from '../../../shared/utils/api';

/**
 * AdminServicesPage - Página de gestión completa de servicios para admin
 *
 * Features:
 * - Lista de TODOS los servicios (approved, pending, rejected)
 * - Búsqueda en tiempo real
 * - Botón arriba para ver servicios pendientes de aprobación
 * - Editar servicio (TODO: implementar modal)
 * - Eliminar servicio
 * - Paginación
 * - Estados de loading, error, empty
 *
 * Similar a AdminBusinessesPage
 * Ruta: /admin/services
 *
 * @returns {JSX.Element} Admin services page
 */
const AdminServicesPage = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  /**
   * Fetch todos los servicios
   */
  const fetchServices = async () => {
    try {
      setLoading(true);
      // Usar la ruta pública para obtener todos los servicios
      const response = await api.get('/services', {
        params: {
          limit: 100, // Obtener todos
          page: 1,
        },
      });

      const allServices = response.data.data?.items || [];
      setServices(allServices);

      // Calcular stats
      setStats({
        total: allServices.length,
        pending: allServices.filter(s => s.status === 'pending').length,
        approved: allServices.filter(s => s.status === 'approved').length,
        rejected: allServices.filter(s => s.status === 'rejected').length,
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast('error', 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /**
   * Filtrar servicios por búsqueda
   */
  const filteredServices = services.filter((service) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.name?.toLowerCase().includes(searchLower) ||
      service.serviceType?.toLowerCase().includes(searchLower) ||
      service.city?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Handler para eliminar servicio
   */
  const handleDelete = async (service) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${service.name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.delete(`/services/${service._id}`);
      showToast('success', `Servicio "${service.name}" eliminado exitosamente`);
      fetchServices(); // Refrescar lista
    } catch (error) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el servicio';
      showToast('error', errorMessage);
    }
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', text: 'Aprobado', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rechazado', icon: AlertCircle },
    };
    return badges[status] || badges.pending;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
            <p className="text-gray-600 mt-1">
              {stats.total} servicios registrados en total
            </p>
          </div>
          <Link
            to="/admin/services/pending"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Clock className="w-5 h-5" />
            Servicios Pendientes ({stats.pending})
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rechazados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, tipo de servicio, ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando servicios...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron servicios' : 'No hay servicios registrados'}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? 'Intenta con otro término de búsqueda' : 'Los servicios propuestos aparecerán aquí'}
            </p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredServices.map((service) => {
                    const statusBadge = getStatusBadge(service.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {service.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {service.serviceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{service.city}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {service.phone && <div>{service.phone}</div>}
                            {service.email && <div>{service.email}</div>}
                            {!service.phone && !service.email && (
                              <span className="text-gray-400">Sin contacto</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => showToast('info', 'Función de edición en desarrollo')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServicesPage;
