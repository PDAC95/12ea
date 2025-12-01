import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import api from '../../../shared/utils/api';

/**
 * AdminTipsPage - Dashboard principal de administración de tips
 *
 * Features:
 * - Stats cards: Total, Pendientes, Aprobados, Rechazados
 * - Quick links a secciones principales
 * - Dashboard overview para admin
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const AdminTipsPage = () => {
  const { showToast } = useToast();

  // State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  /**
   * Fetch stats de tips
   */
  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch todos los tips para calcular stats
      // Backend retorna { success, data: [...], count, total }
      const response = await api.get('/admin/tips');
      const tips = response.data.data || []; // data es array directo

      setStats({
        total: tips.length,
        pending: tips.filter(t => t.status === 'pending').length,
        approved: tips.filter(t => t.status === 'approved').length,
        rejected: tips.filter(t => t.status === 'rejected').length,
      });
    } catch (error) {
      console.error('Error fetching tips stats:', error);
      showToast('error', 'Error al cargar estadísticas de tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Tips Comunitarios</h1>
        </div>
        <p className="text-gray-600">
          Gestiona los consejos compartidos por la comunidad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tips */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Tips</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Aprobados */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Aprobados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Rechazados */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Rechazados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links / Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tips Pendientes */}
          <Link
            to="/admin/tips/pending"
            className="block bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 hover:border-yellow-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-200 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Tips Pendientes
            </h3>
            <p className="text-yellow-700 text-sm mb-3">
              Revisa y modera los tips enviados por la comunidad
            </p>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 font-medium text-sm">
                {stats.pending} {stats.pending === 1 ? 'tip esperando' : 'tips esperando'}
              </span>
              {stats.pending > 0 && (
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                  ¡Acción requerida!
                </span>
              )}
            </div>
          </Link>

          {/* Tips Aprobados */}
          <Link
            to="/admin/tips/list?status=approved"
            className="block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Tips Aprobados
            </h3>
            <p className="text-green-700 text-sm mb-3">
              Visualiza todos los tips publicados en la plataforma
            </p>
            <span className="text-green-600 font-medium text-sm">
              {stats.approved} {stats.approved === 1 ? 'tip publicado' : 'tips publicados'}
            </span>
          </Link>

          {/* Tips Rechazados */}
          <Link
            to="/admin/tips/list?status=rejected"
            className="block bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 hover:border-red-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-red-200 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-700" />
              </div>
              <ArrowRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Tips Rechazados
            </h3>
            <p className="text-red-700 text-sm mb-3">
              Revisa tips que no cumplieron los criterios de publicación
            </p>
            <span className="text-red-600 font-medium text-sm">
              {stats.rejected} {stats.rejected === 1 ? 'tip rechazado' : 'tips rechazados'}
            </span>
          </Link>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Moderación de Tips Comunitarios
            </h3>
            <p className="text-blue-800 text-sm">
              Los tips compartidos por la comunidad son revisados antes de ser publicados.
              Asegúrate de que el contenido sea útil, relevante y apropiado para la comunidad.
              Los tips aprobados aparecerán automáticamente en la sección pública de Tips.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTipsPage;
