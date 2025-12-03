import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Eye,
  Send,
  Trash2,
  Loader2,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react';
import api from '../../../shared/utils/api';
import AdminLayout from '../components/AdminLayout';
import BlogPostForm from './BlogPostForm';

/**
 * AdminBlogList - Lista de gestión de artículos de blog para admin
 * Task 10.5 - Sprint 4
 *
 * Features:
 * - Lista/tabla de artículos con columnas: imagen, título, categoría, estado, fecha, acciones
 * - Filtros: por estado (todos/borradores/publicados/archivados), por categoría, búsqueda por título
 * - Paginación: 10 artículos por página
 * - 4 acciones: Editar, Ver, Publicar (solo draft), Archivar
 * - Modales: CreateModal, EditModal, ConfirmArchiveModal
 * - Integración con BlogPostForm (Task 10.4)
 * - CRUD completo: GET, POST, PUT (edit), PATCH (publish/archive)
 * - Badge system: Status badges (Borrador/Publicado/Archivado) y Category badges
 * - Loading states y empty states
 * - Responsive design
 */
const AdminBlogList = () => {
  // ===== STATE =====
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [statusFilter, setStatusFilter] = useState('all'); // all, draft, published, archived
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const itemsPerPage = 10;

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * Categorías disponibles (same as BlogPostForm)
   */
  const CATEGORIES = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'emprendimiento', label: 'Emprendimiento' },
    { value: 'educacion', label: 'Educación' },
    { value: 'salud', label: 'Salud y Bienestar' },
    { value: 'legal', label: 'Legal e Inmigración' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'cultura', label: 'Cultura y Comunidad' },
    { value: 'finanzas', label: 'Finanzas Personales' },
    { value: 'familia', label: 'Familia y Maternidad' },
    { value: 'otro', label: 'Otros Temas' },
  ];

  // ===== EFFECTS =====
  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter, currentPage, searchQuery]);

  // ===== FETCH =====
  /**
   * Fetch posts desde backend
   */
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await api.get(`/admin/blog?${params.toString()}`);

      // Backend retorna: { success, count, total, page, pages, data: [posts array] }
      const responseData = response.data || {};
      const fetchedPosts = Array.isArray(responseData.data) ? responseData.data : [];
      const totalPages = responseData.pages || 1;
      const totalCount = responseData.total || 0;

      setPosts(fetchedPosts);
      setTotalPages(totalPages);
      setTotalPosts(totalCount);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar artículos';
      setError(errorMessage);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLERS =====
  /**
   * Handler para crear nuevo post
   */
  const handleCreatePost = async (data, isDraft) => {
    try {
      await api.post('/admin/blog', data);
      setShowCreateModal(false);
      fetchPosts();
      alert(isDraft ? 'Borrador guardado exitosamente' : 'Artículo publicado exitosamente');
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.message || 'Error al crear el artículo');
    }
  };

  /**
   * Handler para editar post
   */
  const handleEditPost = async (data, isDraft) => {
    try {
      await api.put(`/admin/blog/${selectedPost._id}`, data);
      setShowEditModal(false);
      setSelectedPost(null);
      fetchPosts();
      alert(isDraft ? 'Borrador actualizado exitosamente' : 'Artículo actualizado exitosamente');
    } catch (err) {
      console.error('Error updating post:', err);
      alert(err.response?.data?.message || 'Error al actualizar el artículo');
    }
  };

  /**
   * Handler para publicar un borrador
   */
  const handlePublishDraft = async (post) => {
    if (!confirm(`¿Publicar el artículo "${post.title}"?`)) return;

    try {
      await api.patch(`/admin/blog/${post._id}/publish`);
      fetchPosts();
      alert('Artículo publicado exitosamente');
    } catch (err) {
      console.error('Error publishing post:', err);
      alert(err.response?.data?.message || 'Error al publicar el artículo');
    }
  };

  /**
   * Handler para eliminar post
   */
  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
      await api.delete(`/admin/blog/${selectedPost._id}`);
      setShowArchiveModal(false);
      setSelectedPost(null);
      fetchPosts();
      alert('Artículo eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.message || 'Error al eliminar el artículo');
    }
  };

  /**
   * Handler para ver preview del post
   */
  const handleViewPost = (post) => {
    // Abrir en nueva pestaña el preview
    window.open(`/blog/${post.slug}`, '_blank');
  };

  /**
   * Formatear fecha
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin publicar';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get badge color for status
   */
  const getStatusBadge = (status) => {
    const badges = {
      draft: { label: 'Borrador', className: 'bg-yellow-100 text-yellow-800' },
      published: { label: 'Publicado', className: 'bg-green-100 text-green-800' },
    };
    return badges[status] || badges.draft;
  };

  /**
   * Get badge color for category
   */
  const getCategoryBadge = (category) => {
    const badges = {
      emprendimiento: 'bg-purple-100 text-purple-800',
      educacion: 'bg-blue-100 text-blue-800',
      salud: 'bg-green-100 text-green-800',
      legal: 'bg-red-100 text-red-800',
      tecnologia: 'bg-indigo-100 text-indigo-800',
      cultura: 'bg-pink-100 text-pink-800',
      finanzas: 'bg-yellow-100 text-yellow-800',
      familia: 'bg-orange-100 text-orange-800',
      otro: 'bg-gray-100 text-gray-800',
    };
    return badges[category] || badges.otro;
  };

  // ===== RENDER =====
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artículos del Blog</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los artículos y contenido del blog de la comunidad
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Crear Nuevo Artículo
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por Estado */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borradores</option>
              <option value="published">Publicados</option>
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Búsqueda */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Buscar por título..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && (!posts || posts.length === 0) && !error && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay artículos
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No se encontraron artículos con "${searchQuery}"`
              : statusFilter !== 'all'
              ? `No hay artículos con estado "${statusFilter}"`
              : categoryFilter !== 'all'
              ? `No hay artículos en la categoría "${categoryFilter}"`
              : 'Comienza creando tu primer artículo para el blog'}
          </p>
          {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Artículo
            </button>
          )}
        </div>
      )}

      {/* Tabla de Artículos */}
      {!loading && posts && posts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => {
                  const statusBadge = getStatusBadge(post.status);
                  const categoryBadge = getCategoryBadge(post.category);

                  return (
                    <tr key={post._id} className="hover:bg-gray-50 transition">
                      {/* Artículo (imagen + título) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {post.excerpt?.substring(0, 60)}
                              {post.excerpt?.length > 60 ? '...' : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryBadge}`}
                        >
                          {CATEGORIES.find((c) => c.value === post.category)?.label ||
                            post.category}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(post.publishedAt)}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* Editar */}
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Ver */}
                          <button
                            onClick={() => handleViewPost(post)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Publicar (solo para drafts) */}
                          {post.status === 'draft' && (
                            <button
                              onClick={() => handlePublishDraft(post)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Publicar"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {/* Eliminar */}
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowArchiveModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, totalPosts)} de {totalPosts} artículos
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Crear Artículo */}
      {showCreateModal && (
        <Modal title="Crear Nuevo Artículo" onClose={() => setShowCreateModal(false)}>
          <BlogPostForm
            mode="create"
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Modal Editar Artículo */}
      {showEditModal && selectedPost && (
        <Modal title="Editar Artículo" onClose={() => setShowEditModal(false)}>
          <BlogPostForm
            mode="edit"
            initialData={selectedPost}
            onSubmit={handleEditPost}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedPost(null);
            }}
          />
        </Modal>
      )}

      {/* Modal Confirmar Eliminación */}
      {showArchiveModal && selectedPost && (
        <ConfirmArchiveModal
          post={selectedPost}
          onConfirm={handleDeletePost}
          onCancel={() => {
            setShowArchiveModal(false);
            setSelectedPost(null);
          }}
        />
      )}
      </div>
    </AdminLayout>
  );
};

/**
 * Modal Component
 */
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

/**
 * Modal de Confirmación de Eliminación
 */
const ConfirmArchiveModal = ({ post, onConfirm, onCancel }) => {
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
            <h3 className="text-lg font-semibold text-gray-900">Eliminar Artículo</h3>
            <p className="text-sm text-gray-600 mt-1">
              ¿Estás segura de que deseas eliminar este artículo?
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-900">{post.title}</p>
          <p className="text-xs text-gray-600 mt-1">
            {post.excerpt?.substring(0, 100)}
            {post.excerpt?.length > 100 ? '...' : ''}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ Esta acción no se puede deshacer. El artículo será eliminado permanentemente de la base de datos.
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

export default AdminBlogList;
