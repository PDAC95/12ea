import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Eye, User, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import TipCard from '../components/TipCard';
import api from '../../../shared/utils/api';
import { getCategoryColor } from '../../../shared/constants/tipCategories';
import { format } from 'date-fns';

/**
 * TipDetailPage - Vista individual de un tip
 *
 * Features:
 * - Muestra contenido completo del tip
 * - Layout con sidebar (stats, autor, categoría)
 * - Botón de Like/Unlike animado
 * - Contador de views
 * - Tips relacionados (misma categoría, max 3)
 * - Breadcrumb de navegación
 * - Loading states
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const TipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // State
  const [tip, setTip] = useState(null);
  const [relatedTips, setRelatedTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  /**
   * Fetch tip y tips relacionados
   */
  const fetchTip = async () => {
    try {
      setLoading(true);

      // Fetch tip principal
      const response = await api.get(`/tips/${id}`);
      const tipData = response.data.data.tip;
      setTip(tipData);
      setLikesCount(tipData.likesCount || 0);

      // Verificar si el usuario dio like
      if (isAuthenticated && user) {
        setIsLiked(tipData.likedBy?.includes(user.id) || false);
      }

      // Fetch tips relacionados (misma categoría, max 3)
      const relatedResponse = await api.get('/tips', {
        params: {
          status: 'approved',
          category: tipData.category,
          limit: 4, // Traer 4 para excluir el actual y quedar con 3
        },
      });

      // Filtrar tip actual de los relacionados
      const related = (relatedResponse.data.data.tips || [])
        .filter(t => t._id !== id)
        .slice(0, 3);

      setRelatedTips(related);
    } catch (error) {
      console.error('Error fetching tip:', error);
      showToast('error', 'Error al cargar el tip');
      navigate('/dashboard/tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, [id]);

  /**
   * Handler para like/unlike
   */
  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast('warning', 'Debes iniciar sesión para dar like');
      return;
    }

    try {
      setIsLiking(true);

      if (isLiked) {
        // Unlike
        await api.delete(`/tips/${id}/like`);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        showToast('success', 'Like removido');
      } else {
        // Like
        await api.post(`/tips/${id}/like`);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        showToast('success', '¡Te gustó este tip!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      showToast('error', 'Error al procesar tu like');
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!tip) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="hover:text-primary-600 transition-colors"
        >
          Dashboard
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => navigate('/dashboard/tips')}
          className="hover:text-primary-600 transition-colors"
        >
          Tips
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-none">
          {tip.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryColor(tip.category)}`}>
              {tip.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {tip.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{tip.author?.preferredName || tip.author?.fullName || 'Anónimo'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(tip.createdAt), 'PPP')}</span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {tip.content}
              </p>
            </div>
          </div>

          {/* Botón de Like */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={handleLike}
              disabled={isLiking || !isAuthenticated}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
              />
              <span>
                {isLiked ? 'Te gusta este tip' : 'Me gusta'}
              </span>
              <span className="text-sm">({likesCount})</span>
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Inicia sesión para dar like a los tips
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm">Likes</span>
                </div>
                <span className="font-semibold text-gray-900">{likesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Vistas</span>
                </div>
                <span className="font-semibold text-gray-900">{tip.viewsCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Autor Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Compartido por</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                {(tip.author?.preferredName || tip.author?.fullName || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {tip.author?.preferredName || tip.author?.fullName || 'Anónimo'}
                </p>
                <p className="text-sm text-gray-500">Miembro de la comunidad</p>
              </div>
            </div>
          </div>

          {/* Tips Relacionados */}
          {relatedTips.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tips Relacionados</h3>
              <div className="space-y-4">
                {relatedTips.map((relatedTip) => (
                  <div
                    key={relatedTip._id}
                    onClick={() => navigate(`/dashboard/tips/${relatedTip._id}`)}
                    className="cursor-pointer group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-sm line-clamp-2 mb-1">
                      {relatedTip.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Heart className="w-3 h-3" />
                      <span>{relatedTip.likesCount || 0}</span>
                      <Eye className="w-3 h-3 ml-2" />
                      <span>{relatedTip.viewsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TipDetailPage;
