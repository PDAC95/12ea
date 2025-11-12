import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * NavigationCard - Card individual de navegación
 *
 * Features:
 * - Click navega a ruta específica
 * - Icono dinámico
 * - Gradiente personalizable
 * - Hover effects suaves (scale, shadow, arrow)
 * - Badge opcional
 * - Diseño responsive
 *
 * @param {string} title - Título de la card
 * @param {string} description - Descripción breve
 * @param {React.ComponentType} icon - Componente de icono de Lucide
 * @param {string} path - Ruta de navegación
 * @param {string} gradient - Clases de gradiente Tailwind
 * @param {string} badge - Badge opcional (ej: "Próximamente")
 * @returns {JSX.Element} Card de navegación
 */
const NavigationCard = ({ title, description, icon: Icon, path, gradient, badge }) => {
  return (
    <Link
      to={path}
      className="group relative block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      {/* Card Content */}
      <div className="p-6">
        {/* Icon Container */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          {badge && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Arrow - Appears on hover */}
        <div className="flex items-center text-primary-600 text-sm font-medium">
          <span className="group-hover:mr-2 transition-all duration-300">Explorar</span>
          <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
};

NavigationCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
  badge: PropTypes.string,
};

export default NavigationCard;
