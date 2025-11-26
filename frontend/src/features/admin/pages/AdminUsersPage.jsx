import { useState } from 'react';
import { Search, Edit2, Trash2, X, AlertCircle, Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import UserEditModal from '../components/UserEditModal';
import ConfirmDialog from '../../../shared/components/common/ConfirmDialog';
import useAdminUsers from '../../../shared/hooks/useAdminUsers';

/**
 * AdminUsersPage - Página de gestión de usuarios para admin
 *
 * Features:
 * - Lista de usuarios con tabla responsive
 * - Búsqueda en tiempo real por nombre/email
 * - Editar usuario (role, isActive, isVerified)
 * - Eliminar usuario (modal de confirmación)
 * - Paginación
 * - Estados de loading, error, empty
 * - Badges de role y status
 *
 * Sprint 5+ - Panel Admin de Usuarios
 *
 * @returns {JSX.Element} Admin users page
 */
const AdminUsersPage = () => {
  const {
    users,
    pagination,
    loading,
    error,
    searchQuery,
    updateUser,
    deleteUser,
    handleSearch,
    handlePageChange,
    setError,
  } = useAdminUsers();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  /**
   * Handler para editar usuario
   */
  const handleEdit = async (formData) => {
    if (!selectedUser) return;

    setFormLoading(true);
    setFormError(null);

    const result = await updateUser(selectedUser._id, formData);

    setFormLoading(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handler para eliminar usuario
   */
  const handleDelete = async () => {
    if (!selectedUser) return;

    const result = await deleteUser(selectedUser._id);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  /**
   * Abrir modal de edición
   */
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  /**
   * Abrir modal de eliminación
   */
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  /**
   * Cerrar modales
   */
  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    setFormError(null);
  };

  /**
   * Get role badge styling
   */
  const getRoleBadge = (role) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-gray-100 text-gray-800';
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">
              {pagination.total} usuarios registrados en total
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
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
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'Los usuarios aparecerán aquí cuando se registren'}
            </p>
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
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.preferredName || user.email}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold text-sm">
                                  {(user.preferredName || user.email).charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            {/* Name & Email */}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.preferredName || user.fullName || 'Sin nombre'}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                            >
                              {user.role === 'admin' && <Shield className="w-3 h-3" />}
                              {user.role === 'admin' ? 'Admin' : 'Usuario'}
                            </span>
                          </div>
                        </td>

                        {/* Status Badges */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {/* Active/Inactive */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusBadge(user.isActive)}`}
                            >
                              {user.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Activo
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Inactivo
                                </>
                              )}
                            </span>

                            {/* Verified */}
                            {user.isVerified && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Verificado
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('es-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
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
                  {pagination.total} usuarios
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

      {/* Edit Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={closeModals}
        onSubmit={handleEdit}
        isLoading={formLoading}
        submitError={formError}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.email}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={loading}
      />
    </AdminLayout>
  );
};

export default AdminUsersPage;
