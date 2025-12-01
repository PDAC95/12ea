import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Check, X, User, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import api from '../../../shared/utils/api';
import { getCategoryColor } from '../../../shared/constants/tipCategories';
import { format } from 'date-fns';

/**
 * AdminTipsPendingPage - Dashboard admin para gestionar tips pendientes
 *
 * Features:
 * - Lista de tips con status='pending'
 * - Cada item muestra: title, author, category, excerpt, fecha
 * - Botones: Aprobar (verde), Rechazar (rojo)
 * - Modal de rechazo con rejectionReason (min 10 chars)
 * - PUT /api/v1/admin/tips/:id/approve
 * - PUT /api/v1/admin/tips/:id/reject
 * - Auto-refresh después de cada acción
 * - Loading states
 * - Toast notifications
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const AdminTipsPendingPage = () => {
  const { showToast } = useToast();

  // State
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  /**
   * Fetch tips pendientes
   */
  const fetchPendingTips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/tips/pending');
      setTips(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending tips:', error);
      showToast('error', 'Error al cargar tips pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTips();
  }, []);

  /**
   * Handler para aprobar tip
   */
  const handleApprove = async (tip) => {
    if (!window.confirm(`¿Aprobar el tip "${tip.title}"?`)) {
      return;
    }

    try {
      setProcessingId(tip._id);
      await api.put(`/admin/tips/${tip._id}/approve`);
      showToast('success', `Tip "${tip.title}" aprobado exitosamente`);
      fetchPendingTips(); // Refetch
    } catch (error) {
      console.error('Error approving tip:', error);
      const errorMessage =
        error.response?.data?.error?.message || 'Error al aprobar el tip';
      showToast('error', errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Handler para abrir modal de rechazo
   */
  const handleOpenRejectModal = (tip) => {
    setSelectedTip(tip);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  /**
   * Handler para rechazar tip
   */
  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      showToast('warning', 'La razón del rechazo debe tener al menos 10 caracteres');
      return;
    }

    try {
      setProcessingId(selectedTip._id);
      await api.put(`/admin/tips/${selectedTip._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      showToast('success', `Tip "${selectedTip.title}" rechazado`);
      setRejectModalOpen(false);
      setSelectedTip(null);
      setRejectionReason('');
      fetchPendingTips(); // Refetch
    } catch (error) {
      console.error('Error rejecting tip:', error);
      const errorMessage =
        error.response?.data?.error?.message || 'Error al rechazar el tip';
      showToast('error', errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Tips Pendientes</h1>
        </div>
        <p className="text-gray-600">
          Revisa y aprueba los tips compartidos por la comunidad
        </p>
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
            No hay tips pendientes de aprobación
          </h3>
          <p className="text-gray-500">
            Todos los tips han sido revisados
          </p>
        </div>
      ) : (
        /* Lista de Tips Pendientes */
        <div className="space-y-4">
          {tips.map((tip) => {
            const excerpt =
              tip.content.length > 200
                ? tip.content.substring(0, 200) + '...'
                : tip.content;

            const isProcessing = processingId === tip._id;

            return (
              <div
                key={tip._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Contenido Principal */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Header */}
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(tip.category)}`}>
                        {tip.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tip.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {tip.author?.preferredName || tip.author?.fullName || 'Anónimo'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(tip.createdAt), 'PPP')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Sidebar - Acciones */}
                  <div className="flex flex-col gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                      <p className="text-xs text-blue-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Revisa el contenido y aprueba si es relevante y útil para la comunidad
                        </span>
                      </p>
                    </div>

                    {/* Botón Aprobar */}
                    <button
                      onClick={() => handleApprove(tip)}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Aprobar
                        </>
                      )}
                    </button>

                    {/* Botón Rechazar */}
                    <button
                      onClick={() => handleOpenRejectModal(tip)}
                      disabled={isProcessing}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Rechazo */}
      {rejectModalOpen && selectedTip && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              if (!processingId) {
                setRejectModalOpen(false);
                setSelectedTip(null);
                setRejectionReason('');
              }
            }}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                  <X className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Rechazar Tip
                  </h2>
                </div>
                <button
                  onClick={() => {
                    if (!processingId) {
                      setRejectModalOpen(false);
                      setSelectedTip(null);
                      setRejectionReason('');
                    }
                  }}
                  disabled={processingId}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Tip:</p>
                  <p className="text-gray-700">{selectedTip.title}</p>
                </div>

                <div>
                  <label
                    htmlFor="rejectionReason"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Razón del rechazo *
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    disabled={processingId}
                    rows={4}
                    placeholder="Explica por qué este tip no puede ser aprobado (mínimo 10 caracteres)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none disabled:bg-gray-50"
                  />
                  <p className={`text-xs mt-1 ${rejectionReason.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {rejectionReason.length}/10 caracteres mínimo
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-lg">
                <button
                  onClick={() => {
                    if (!processingId) {
                      setRejectModalOpen(false);
                      setSelectedTip(null);
                      setRejectionReason('');
                    }
                  }}
                  disabled={processingId}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={processingId || rejectionReason.trim().length < 10}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingId ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Rechazando...
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Rechazar Tip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTipsPendingPage;
