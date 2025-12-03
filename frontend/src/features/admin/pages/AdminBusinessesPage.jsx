import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Store, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import BusinessForm from '../components/BusinessForm';
import ConfirmDialog from '../../../shared/components/common/ConfirmDialog';
import useAdminBusinesses from '../../../shared/hooks/useAdminBusinesses';
import { formValuesToBusinessData } from '../validation/businessSchema';
import api from '../../../shared/utils/api';

/**
 * AdminBusinessesPage - Página de gestión de negocios para admin
 *
 * Features:
 * - Lista de negocios con tabla responsive
 * - Búsqueda en tiempo real
 * - Crear nuevo negocio (modal con BusinessForm)
 * - Editar negocio existente (modal con BusinessForm)
 * - Eliminar negocio (modal de confirmación)
 * - Paginación
 * - Estados de loading, error, empty
 *
 * Sprint 3 - US-009: Panel Admin
 * Task 9.7 - AdminBusinessList
 *
 * @returns {JSX.Element} Admin businesses page
 */
const AdminBusinessesPage = () => {
  const navigate = useNavigate();
  const {
    businesses,
    pagination,
    loading,
    error,
    searchQuery,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    handleSearch,
    handlePageChange,
    setError,
  } = useAdminBusinesses();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Pending businesses count
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPendingCount, setLoadingPendingCount] = useState(true);

  /**
   * Fetch pending businesses count on mount
   */
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        setLoadingPendingCount(true);
        const response = await api.get('/admin/businesses/pending');
        const count = response.data?.count || 0;
        setPendingCount(count);
      } catch (err) {
        console.error('Error fetching pending count:', err);
        setPendingCount(0);
      } finally {
        setLoadingPendingCount(false);
      }
    };

    fetchPendingCount();
  }, []);

  /**
   * Navigate to pending businesses page
   */
  const handleViewPending = () => {
    navigate('/admin/businesses/pending');
  };

  /**
   * Handler para crear negocio
   */
  const handleCreate = async (formData) => {
    setFormLoading(true);
    setFormError(null);

    const businessData = formValuesToBusinessData(formData);
    const result = await createBusiness(businessData);

    setFormLoading(false);

    if (result.success) {
      setIsCreateModalOpen(false);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handler para editar negocio
   */
  const handleEdit = async (formData) => {
    if (!selectedBusiness) return;

    setFormLoading(true);
    setFormError(null);

    const businessData = formValuesToBusinessData(formData);
    const result = await updateBusiness(selectedBusiness._id, businessData);

    setFormLoading(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedBusiness(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handler para eliminar negocio
   */
  const handleDelete = async () => {
    if (!selectedBusiness) return;

    const result = await deleteBusiness(selectedBusiness._id);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedBusiness(null);
    }
  };

  /**
   * Abrir modal de edición
   */
  const openEditModal = (business) => {
    setSelectedBusiness(business);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  /**
   * Abrir modal de eliminación
   */
  const openDeleteModal = (business) => {
    setSelectedBusiness(business);
    setIsDeleteModalOpen(true);
  };

  /**
   * Cerrar modales
   */
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBusiness(null);
    setFormError(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Negocios</h1>
            <p className="text-gray-600 mt-1">
              {pagination.total} negocios registrados en total
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Pending Businesses Button */}
            <button
              onClick={handleViewPending}
              disabled={loadingPendingCount}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors relative disabled:opacity-50"
            >
              <Clock className="w-5 h-5" />
              <span>Negocios Pendientes</span>
              {!loadingPendingCount && pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </button>

            {/* Create New Business Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Negocio
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría, ciudad..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900">Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando negocios...</p>
          </div>
        ) : businesses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron negocios' : 'No hay negocios registrados'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'Comienza creando el primer negocio'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Crear Primer Negocio
              </button>
            )}
          </div>
        ) : (
          /* Table */
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Negocio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ciudad
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
                    {businesses.map((business) => (
                      <tr key={business._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{business.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {business.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {business.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{business.city}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {business.phone && <div>{business.phone}</div>}
                            {business.email && <div>{business.email}</div>}
                            {!business.phone && !business.email && (
                              <span className="text-gray-400">Sin contacto</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(business)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(business)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
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
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                <div className="text-sm text-gray-600">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                  {pagination.total} negocios
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Negocio</h2>
                <button
                  onClick={closeModals}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <BusinessForm
                onSubmit={handleCreate}
                onCancel={closeModals}
                isLoading={formLoading}
                submitError={formError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedBusiness && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Editar Negocio</h2>
                <button
                  onClick={closeModals}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <BusinessForm
                initialData={selectedBusiness}
                onSubmit={handleEdit}
                onCancel={closeModals}
                isLoading={formLoading}
                submitError={formError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDelete}
        title="Eliminar Negocio"
        message={`¿Estás seguro de que deseas eliminar "${selectedBusiness?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={loading}
      />
    </AdminLayout>
  );
};

export default AdminBusinessesPage;
