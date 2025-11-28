import { Heart, Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCategoryColor } from '../../../shared/constants/tipCategories';

/**
 * TipCard - Card de tip para grid
 *
 * Features:
 * - Muestra título, excerpt, categoría, autor, stats
 * - Hover effect con scale y shadow
 * - Badge de categoría con color único
 * - Click para navegar a detalle
 *
 * @param {Object} props
 * @param {Object} props.tip - Objeto tip
 * @returns {JSX.Element}
 */
const TipCard = ({ tip }) => {
  const navigate = useNavigate();

  // Crear excerpt (primeros 150 caracteres)
  const excerpt = tip.content.length > 150
    ? tip.content.substring(0, 150) + '...'
    : tip.content;

  const handleClick = () => {
    navigate(`/dashboard/tips/${tip._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group"
    >
      {/* Header con Categoría */}
      <div className="p-6 pb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
          {tip.category}
        </span>
      </div>

      {/* Contenido */}
      <div className="px-6 pb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {tip.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {excerpt}
        </p>
      </div>

      {/* Footer con Stats */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[120px]">
              {tip.author?.preferredName || tip.author?.fullName || 'Anónimo'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" title="Likes">
              <Heart className="w-4 h-4 text-red-400" />
              <span>{tip.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1" title="Vistas">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{tip.viewsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TipCard.propTypes = {
  tip: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    author: PropTypes.shape({
      preferredName: PropTypes.string,
      fullName: PropTypes.string,
    }),
    likesCount: PropTypes.number,
    viewsCount: PropTypes.number,
  }).isRequired,
};

export default TipCard;
