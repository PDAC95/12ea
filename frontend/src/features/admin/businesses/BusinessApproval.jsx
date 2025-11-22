import { useState, useEffect } from 'react';
import { useBusinessApproval } from '../hooks/useBusinessApproval';
import { useToast } from '../../../shared/context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import {
  CheckCircle,
  XCircle,
  Store,
  MapPin,
  User,
  Loader2,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCategoryColor } from '../../../shared/constants/categories';

/**
 * BusinessApproval - Interfaz admin para aprobar/rechazar negocios propuestos
 *
 * Features:
 * - Tabla con negocios pendientes de aprobación
 * - Botones "Aprobar" y "Rechazar" por cada negocio
 * - Modal de confirmación para aprobar
 * - Modal con textarea para rechazar (con razón requerida)
 * - Loading, error y empty states
 * - Paginación
 * - Notificación por email automática al aprobar/rechazar
 * - Responsive (desktop: tabla, mobile: cards)
 *
 * Sprint 5+ - Business Proposal System
 * PLAN-BUSINESS-PROPOSAL-SYSTEM.md - PARTE 2
 *
 * Ruta: /admin/businesses/pending (protegida, solo admin)
 *
 * @returns {JSX.Element} Componente de aprobación de negocios
 */
const BusinessApproval = () => {
  const { businesses, loading, error, pagination, fetchPendingBusinesses, approveBusiness, rejectBusiness } =
    useBusinessApproval();
  const { showToast } = useToast();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingBusinesses();
  }, []);

  /**
   * Handler para abrir modal de aprobación
   */
  const handleApprove = (business) => {
    setSelectedBusiness(business);
    setShowApproveModal(true);
  };

  /**
   * Handler para confirmar aprobación
   */
  const confirmApprove = async () => {
    if (!selectedBusiness) return;

    try {
      setActionLoading(true);
      await approveBusiness(selectedBusiness._id);
      showToast('success', `Negocio "${selectedBusiness.name}" aprobado exitosamente`);
      setShowApproveModal(false);
      setSelectedBusiness(null);
      fetchPendingBusinesses(); // Refresh lista
    } catch (error) {
      showToast('error', error.message || 'Error al aprobar negocio');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handler para abrir modal de rechazo
   */
  const handleReject = (business) => {
    setSelectedBusiness(business);
    setRejectReason('');
    setShowRejectModal(true);
  };

  /**
   * Handler para confirmar rechazo
   */
  const confirmReject = async () => {
    if (!selectedBusiness) return;

    // Validar razón
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      showToast('warning', 'La razón del rechazo debe tener al menos 10 caracteres');
      return;
    }

    try {
      setActionLoading(true);
      await rejectBusiness(selectedBusiness._id, rejectReason);
      showToast('success', `Negocio "${selectedBusiness.name}" rechazado`);
      setShowRejectModal(false);
      setSelectedBusiness(null);
      setRejectReason('');
      fetchPendingBusinesses(); // Refresh lista
    } catch (error) {
      showToast('error', error.message || 'Error al rechazar negocio');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Loading skeleton
   */
  if (loading && businesses.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Negocios Pendientes</h1>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={48} />
          </div>
        </div>
      </AdminLayout>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Negocios Pendientes</h1>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchPendingBusinesses()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /**
   * Empty state
   */
  if (businesses.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Negocios Pendientes</h1>
          <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
            <Store className="mx-auto text-green-500 mb-4" size={64} />
            <h2 className="text-xl font-bold text-green-900 mb-2">
              ¡No hay negocios pendientes de revisión! 🎉
            </h2>
            <p className="text-green-700">
              Todos los negocios propuestos han sido procesados.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Negocios Pendientes</h1>
            <p className="text-gray-600 mt-1">
              Revisa y aprueba propuestas de la comunidad ({pagination.total} pendientes)
            </p>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Negocio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Propuesto por
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {businesses.map((business) => (
                <tr key={business._id} className="hover:bg-gray-50 transition-colors">
                  {/* Logo */}
                  <td className="px-6 py-4">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt={business.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Store className="text-gray-400" size={24} />
                      </div>
                    )}
                  </td>

                  {/* Negocio */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{business.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <User size={14} />
                      {business.owner?.preferredName || business.owner?.fullName || 'Dueña'}
                    </div>
                    {business.phone && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={14} />
                        {business.phone}
                      </div>
                    )}
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        business.category
                      )}`}
                    >
                      {business.category}
                    </span>
                  </td>

                  {/* Propuesto por */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {business.submittedBy?.preferredName || business.submittedBy?.fullName || 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Mail size={12} />
                      {business.submittedBy?.email}
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock size={14} />
                      {format(new Date(business.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(business)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <CheckCircle size={16} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(business)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        <XCircle size={16} />
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards Mobile */}
        <div className="lg:hidden space-y-4">
          {businesses.map((business) => (
            <div key={business._id} className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
              {/* Header del Card */}
              <div className="flex items-start gap-4">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Store className="text-gray-400" size={28} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{business.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <User size={14} />
                    {business.owner?.preferredName || business.owner?.fullName || 'Dueña'}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(
                      business.category
                    )}`}
                  >
                    {business.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-600">
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {business.phone}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>
                    {business.submittedBy?.preferredName || business.submittedBy?.fullName || 'Usuario'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {format(new Date(business.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApprove(business)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                >
                  <CheckCircle size={18} />
                  Aprobar
                </button>
                <button
                  onClick={() => handleReject(business)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  <XCircle size={18} />
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación (si hay más de 1 página) */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => fetchPendingBusinesses(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {pagination.page} de {pagination.pages}
            </span>
            <button
              onClick={() => fetchPendingBusinesses(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de Aprobación */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !actionLoading && setShowApproveModal(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-soft-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Aprobar Negocio</h2>
              <p className="text-gray-600 mb-6">
                ¿Estás segura que quieres aprobar <strong>"{selectedBusiness?.name}"</strong>? Se enviará un email al usuario notificándole la aprobación.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmApprove}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Aprobando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Sí, Aprobar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !actionLoading && setShowRejectModal(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-soft-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rechazar Negocio</h2>
              <p className="text-gray-600 mb-4">
                Por favor indica la razón del rechazo para <strong>"{selectedBusiness?.name}"</strong>:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej: Falta información de contacto válida"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={actionLoading}
              />
              <p className="text-xs text-gray-500 mt-2">Mínimo 10 caracteres</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReject}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Rechazando...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Rechazar
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

export default BusinessApproval;
