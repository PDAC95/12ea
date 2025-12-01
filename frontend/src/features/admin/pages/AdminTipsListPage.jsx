import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowLeft, CheckCircle, XCircle, Eye, Heart, User, Calendar, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import EditTipModal from '../components/EditTipModal';
import api from '../../../shared/utils/api';
import { getCategoryColor } from '../../../shared/constants/tipCategories';
import { format } from 'date-fns';

/**
 * AdminTipsListPage - Lista de tips filtrados por status
 *
 * Features:
 * - Lee query param ?status= de la URL
 * - Fetch a GET /admin/tips
 * - Filtra localmente por status (approved o rejected)
 * - Tabla con: Título, Categoría, Autor, Vistas, Likes, Fecha
 * - Columna adicional "Razón de Rechazo" si status=rejected
 * - Loading states, empty states
 * - Breadcrumb para volver a /admin/tips
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const AdminTipsListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const status = searchParams.get('status'); // 'approved' o 'rejected'

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);

  // Títulos según status
  const titles = {
    approved: 'Tips Aprobados',
    rejected: 'Tips Rechazados',
  };

  /**
   * Fetch tips y filtrar por status
   */
  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/tips');
      const allTips = response.data.data || [];

      // Filtrar por status
      const filtered = allTips.filter(tip => tip.status === status);
      setTips(filtered);
    } catch (error) {
      console.error('Error fetching tips:', error);
      showToast('error', 'Error al cargar los tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Validar que status sea válido
    if (!status || !['approved', 'rejected'].includes(status)) {
      navigate('/admin/tips');
      return;
    }
    fetchTips();
  }, [status]);

  /**
   * Handler para borrar tip
   */
  const handleDelete = async (tip) => {
    if (!window.confirm(`¿Estás seguro de eliminar el tip "${tip.title}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingId(tip._id);
      await api.delete(`/admin/tips/${tip._id}`);
      showToast('success', `Tip "${tip.title}" eliminado exitosamente`);
      fetchTips(); // Refrescar lista
    } catch (error) {
      console.error('Error deleting tip:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el tip';
      showToast('error', errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Handler para abrir modal de edición
   */
  const handleEdit = (tip) => {
    setSelectedTip(tip);
    setEditModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/admin/tips"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard de Tips
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {status === 'approved' ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <XCircle className="w-8 h-8 text-red-600" />
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {titles[status]}
          </h1>
        </div>
        <p className="text-gray-600">
          {status === 'approved'
            ? 'Tips publicados en la plataforma'
            : 'Tips que no cumplieron los criterios de publicación'
          }
        </p>
      </div>

      {/* Count */}
      <div className="mb-6">
        <p className="text-gray-700 font-medium">
          Total: <span className="text-gray-900">{tips.length}</span> {tips.length === 1 ? 'tip' : 'tips'}
        </p>
      </div>

      {/* Lista de tips */}
      {tips.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay tips {status === 'approved' ? 'aprobados' : 'rechazados'}
          </h3>
          <p className="text-gray-600">
            {status === 'approved'
              ? 'Aún no se han aprobado tips de la comunidad'
              : 'No se han rechazado tips hasta el momento'
            }
          </p>
        </div>
      ) : (
        /* Tabla de Tips */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  {status === 'rejected' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Razón de Rechazo
                    </th>
                  )}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tips.map((tip) => (
                  <tr key={tip._id} className="hover:bg-gray-50 transition-colors">
                    {/* Título y Contenido */}
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tip.content.substring(0, 120)}...
                        </p>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
                        {tip.category}
                      </span>
                    </td>

                    {/* Autor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tip.author?.profileImage ? (
                          <img
                            src={tip.author.profileImage}
                            alt={tip.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {tip.author?.name || 'Usuario'}
                        </span>
                      </div>
                    </td>

                    {/* Stats (Vistas + Likes) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{tip.viewsCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{tip.likesCount || 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(tip.createdAt), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </td>

                    {/* Razón de rechazo (solo rejected) */}
                    {status === 'rejected' && (
                      <td className="px-6 py-4">
                        <p className="text-sm text-red-700 max-w-xs">
                          {tip.rejectionReason || 'Sin razón especificada'}
                        </p>
                      </td>
                    )}

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEdit(tip)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Editar tip"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </button>

                        {/* Botón Borrar */}
                        <button
                          onClick={() => handleDelete(tip)}
                          disabled={deletingId === tip._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar tip"
                        >
                          {deletingId === tip._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      <EditTipModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tip={selectedTip}
        onSuccess={fetchTips}
      />
    </AdminLayout>
  );
};

export default AdminTipsListPage;
