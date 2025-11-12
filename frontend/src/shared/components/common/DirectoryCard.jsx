import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCategoryColor } from '../../constants/categories';

/**
 * DirectoryCard - Tarjeta genérica reutilizable para directorios
 *
 * Features:
 * - Funciona para Business y Service
 * - Logo con fallback a avatar generado
 * - Información principal: nombre, categoría/tipo, ciudad
 * - Descripción truncada (2 líneas)
 * - Iconos de contacto (teléfono, email, website)
 * - Hover effects con elevación
 * - Badge de categoría/tipo con color
 * - Click en card ejecuta callback
 * - Responsive design
 *
 * Sprint 2 - Task 6.4
 *
 * @param {Object} props
 * @param {Object} props.item - Datos del item (business o service)
 * @param {string} props.type - Tipo de directorio: 'business' o 'service'
 * @param {Function} props.onClick - Callback al hacer click en la card
 * @returns {JSX.Element} Tarjeta de directorio
 */
const DirectoryCard = ({ item, type = 'business', onClick }) => {
  // Destructuring genérico que funciona para ambos tipos
  const {
    _id,
    name,
    category,        // Para businesses
    serviceType,     // Para services
    description,
    phone,
    email,
    city,
    website,
    logo,
  } = item;

  // Determinar la categoría/tipo según el tipo de directorio
  const displayCategory = type === 'business' ? category : serviceType;

  // Generar avatar si no hay logo
  const logoUrl = logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=f0568c&color=ffffff&bold=true`;

  // Obtener colores de categoría desde constantes (funciona para ambos)
  const categoryColorClass = getCategoryColor(displayCategory);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 cursor-pointer"
    >
      {/* Logo Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        <img
          src={logoUrl}
          alt={`Logo de ${name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=f0568c&color=ffffff&bold=true`;
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColorClass} shadow-sm`}>
            {displayCategory}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="text-sm">{city}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Contact Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title={`Llamar a ${name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-5 h-5" />
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title={`Enviar email a ${name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-5 h-5" />
            </a>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title={`Visitar sitio web de ${name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-5 h-5" />
            </a>
          )}

          {/* Spacer para empujar el botón a la derecha */}
          <div className="flex-1"></div>

          {/* Ver más link */}
          <button
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            aria-label={`Ver detalles de ${name}`}
          >
            Ver más →
          </button>
        </div>
      </div>
    </div>
  );
};

DirectoryCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,      // Para businesses
    serviceType: PropTypes.string,   // Para services
    description: PropTypes.string.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string.isRequired,
    website: PropTypes.string,
    logo: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['business', 'service']),
  onClick: PropTypes.func,
};

export default DirectoryCard;
