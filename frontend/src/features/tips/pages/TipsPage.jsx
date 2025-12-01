import { useState, useEffect, useCallback, useRef } from 'react';
import { Lightbulb, Filter, Search, Plus } from 'lucide-react';
import debounce from 'lodash.debounce';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import TipCard from '../components/TipCard';
import TipCardSkeleton from '../components/TipCardSkeleton';
import ProposeTipModal from '../components/ProposeTipModal';
import Pagination from '../../../shared/components/common/Pagination';
import api from '../../../shared/utils/api';
import { TIP_CATEGORIES } from '../../../shared/constants/tipCategories';

/**
 * TipsPage - Vista pública de tips aprobados
 *
 * Features:
 * - Grid responsive de tips aprobados
 * - Filtros por categoría con contador
 * - Búsqueda por texto
 * - Botón flotante para proponer tip
 * - Loading states con skeletons
 * - Empty states
 *
 * Sprint 5+ - Tips Comunitarios
 *
 * @returns {JSX.Element}
 */
const TipsPage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // State
  const [tips, setTips] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12; // 12 tips por página (grid 3x4)

  /**
   * Fetch tips aprobados con paginación
   */
  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tips', {
        params: {
          status: 'approved',
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: itemsPerPage,
        },
      });

      setTips(response.data.data.tips || []);
      setCategoryCounts(response.data.data.categoryCounts || {});

      // Actualizar info de paginación desde el backend
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      showToast('error', 'Error al cargar los tips');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Debounced fetch - espera 500ms después de la última búsqueda
   */
  const debouncedFetchTips = useRef(
    debounce(() => {
      fetchTips();
    }, 500)
  ).current;

  // Fetch tips cuando cambian los filtros o la página
  useEffect(() => {
    fetchTips();
  }, [selectedCategory, currentPage]);

  // Fetch tips con debounce cuando cambia el searchQuery
  useEffect(() => {
    // Reset a página 1 cuando cambian los filtros
    setCurrentPage(1);

    if (searchQuery === '') {
      // Si borra todo el texto, buscar inmediatamente
      fetchTips();
    } else {
      // Si está escribiendo, esperar 500ms
      debouncedFetchTips();
    }

    // Cleanup: cancelar debounce pendiente al desmontar
    return () => {
      debouncedFetchTips.cancel();
    };
  }, [searchQuery]);

  // Reset página cuando cambia la categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  /**
   * Handler para abrir modal
   */
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      showToast('warning', 'Debes iniciar sesión para compartir un tip');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    setIsModalOpen(true);
  };

  /**
   * Handler para éxito en propuesta
   */
  const handleProposalSuccess = () => {
    setIsModalOpen(false);
    showToast('success', '¡Gracias! Tu tip será revisado por nuestro equipo');
  };

  /**
   * Handler para cambio de página
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll suave al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Tips Comunitarios</h1>
        </div>
        <p className="text-gray-600">
          Consejos y experiencias compartidas por nuestra comunidad
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Categoría */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">
                Todas las categorías ({Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 0})
              </option>
              {TIP_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category} ({categoryCounts[category] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Tips */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TipCardSkeleton key={i} />
          ))}
        </div>
      ) : tips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay tips disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || selectedCategory !== 'all'
              ? 'No encontramos tips que coincidan con tu búsqueda'
              : 'Sé la primera en compartir un consejo con la comunidad'}
          </p>
          {isAuthenticated && (
            <button
              onClick={handleOpenModal}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Compartir Mi Tip
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tips.map((tip) => (
              <TipCard key={tip._id} tip={tip} />
            ))}
          </div>

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Botón Flotante - Compartir Mi Tip */}
      {isAuthenticated && (
        <button
          onClick={handleOpenModal}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 flex items-center gap-2"
          title="Compartir Mi Tip"
        >
          <Plus className="w-6 h-6" />
          <span className="hidden md:inline font-semibold pr-2">Compartir Mi Tip</span>
        </button>
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

export default TipsPage;
