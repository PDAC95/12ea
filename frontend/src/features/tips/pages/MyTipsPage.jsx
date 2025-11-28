import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Loader2, Eye, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import ProposeTipModal from '../components/ProposeTipModal';
import api from '../../../shared/utils/api';
import { getCategoryColor } from '../../../shared/constants/tipCategories';
import { format } from 'date-fns';

/**
 * MyTipsPage - Vista de tips del usuario autenticado
 *
 * Features:
 * - Lista de tips propios (todos los estados)
 * - Tabla con: Título, Categoría, Estado, Fecha, Acciones
 * - Estados: Pending (amarillo), Approved (verde), Rejected (rojo)
 * - Si rejected: mostrar rejectionReason en tooltip
 * - Acciones: Ver, Editar (solo pending), Eliminar (solo pending)
 * - Empty state si no tiene tips
 * - Botón para crear nuevo tip
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const MyTipsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Fetch tips del usuario
   */
  const fetchMyTips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tips/my');
      setTips(response.data.data.tips || []);
    } catch (error) {
      console.error('Error fetching my tips:', error);
      showToast('error', 'Error al cargar tus tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTips();
  }, []);

  /**
   * Handler para eliminar tip
   */
  const handleDelete = async (tipId) => {
    if (!window.confirm('¿Estás segura de eliminar este tip?')) {
      return;
    }

    try {
      setDeletingId(tipId);
      await api.delete(`/tips/my/${tipId}`);
      showToast('success', 'Tip eliminado exitosamente');
      fetchMyTips(); // Refetch
    } catch (error) {
      console.error('Error deleting tip:', error);
      showToast('error', 'Error al eliminar el tip');
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Handler para success en propuesta
   */
  const handleProposalSuccess = () => {
    setIsModalOpen(false);
    fetchMyTips(); // Refetch
  };

  /**
   * Obtener badge de estado
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pendiente',
      },
      approved: {
        color: 'bg-green-100 text-green-800',
        text: 'Aprobado',
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        text: 'Rechazado',
      },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-900">Mis Tips</h1>
            </div>
            <p className="text-gray-600">
              Gestiona los tips que has compartido con la comunidad
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 justify-center"
          >
            <Lightbulb className="w-5 h-5" />
            Compartir Nuevo Tip
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : tips.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No has compartido tips aún
          </h3>
          <p className="text-gray-500 mb-6">
            Comparte tu experiencia y conocimientos con la comunidad
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Lightbulb className="w-5 h-5" />
            Compartir Mi Primer Tip
          </button>
        </div>
      ) : (
        /* Tabla de Tips */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tips.map((tip) => (
                  <tr key={tip._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">
                          {tip.title}
                        </p>
                        {tip.status === 'rejected' && tip.rejectionReason && (
                          <div className="flex items-start gap-1 mt-1 text-xs text-red-600 group relative">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{tip.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
                        {tip.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tip.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(tip.createdAt), 'PP')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ver */}
                        {tip.status === 'approved' && (
                          <button
                            onClick={() => navigate(`/dashboard/tips/${tip._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver tip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Editar (solo pending) */}
                        {tip.status === 'pending' && (
                          <button
                            onClick={() => showToast('info', 'Edición próximamente disponible')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar tip"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Eliminar (solo pending) */}
                        {tip.status === 'pending' && (
                          <button
                            onClick={() => handleDelete(tip._id)}
                            disabled={deletingId === tip._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar tip"
                          >
                            {deletingId === tip._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {tips.map((tip) => (
              <div key={tip._id} className="p-4 space-y-3">
                <div>
                  <p className="font-medium text-gray-900 mb-1">{tip.title}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
                      {tip.category}
                    </span>
                    {getStatusBadge(tip.status)}
                  </div>
                  {tip.status === 'rejected' && tip.rejectionReason && (
                    <div className="flex items-start gap-1 mt-2 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{tip.rejectionReason}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {format(new Date(tip.createdAt), 'PP')}
                  </span>
                  <div className="flex items-center gap-2">
                    {tip.status === 'approved' && (
                      <button
                        onClick={() => navigate(`/dashboard/tips/${tip._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {tip.status === 'pending' && (
                      <>
                        <button
                          onClick={() => showToast('info', 'Edición próximamente disponible')}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tip._id)}
                          disabled={deletingId === tip._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deletingId === tip._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Propuesta */}
      <ProposeTipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProposalSuccess}
      />
    </DashboardLayout>
  );
};

export default MyTipsPage;
