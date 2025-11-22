import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * BlogCard - Card individual de blog post estilo Medium
 *
 * Features:
 * - Imagen featured con overlay
 * - Título y extracto
 * - Badge de categoría
 * - Metadata: autor y fecha
 * - Hover effect elegante
 * - Click para ver post completo
 *
 * Sprint 3 - US-007: Blog Comunitario
 * Task 7.3 - Frontend BlogList Component
 *
 * @param {Object} props
 * @param {Object} props.post - Datos del post
 * @param {string} props.post._id - ID del post
 * @param {string} props.post.title - Título del post
 * @param {string} props.post.excerpt - Extracto del post
 * @param {string} props.post.featuredImage - URL de la imagen
 * @param {string} props.post.category - Categoría del post
 * @param {Object} props.post.author - Objeto autor con _id, name, profileImage
 * @param {string} props.post.publishedAt - Fecha de publicación
 * @param {string} props.post.slug - Slug del post para la URL
 * @param {Function} props.onClick - Handler al hacer click
 * @returns {JSX.Element} Card de blog post
 */
const BlogCard = ({ post, onClick }) => {
  const navigate = useNavigate();

  /**
   * Handler para navegar al post completo
   */
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
    navigate(`/dashboard/blog/${post.slug}`);
  };

  /**
   * Formatear fecha de publicación
   * @param {string} dateStr - Fecha ISO
   * @returns {string} Fecha formateada (ej: "20 Nov 2025")
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha no disponible';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  /**
   * Obtener color de badge según categoría
   */
  const getCategoryColor = (category) => {
    const colors = {
      emprendimiento: 'bg-blue-100 text-blue-700',
      salud: 'bg-green-100 text-green-700',
      educacion: 'bg-purple-100 text-purple-700',
      cultura: 'bg-pink-100 text-pink-700',
      tecnologia: 'bg-indigo-100 text-indigo-700',
      comunidad: 'bg-orange-100 text-orange-700',
    };

    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Featured Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge - Overlay */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getCategoryColor(post.category)}`}
          >
            {post.category}
          </span>
        </div>

        {/* Gradient overlay al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Metadata + Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author & Date */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{post.author?.name || 'Anónimo'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Read More Link */}
          <div className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
            <span>Leer más</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};

BlogCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    featuredImage: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
    }),
    publishedAt: PropTypes.string, // Opcional - puede ser null si el post está en draft
    slug: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default BlogCard;
