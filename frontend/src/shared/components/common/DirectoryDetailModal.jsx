import { useEffect } from 'react';
import { X, MapPin, Phone, Mail, Globe, Building2, Award } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCategoryColor } from '../../constants/categories';

/**
 * DirectoryDetailModal - Modal genérico reutilizable para directorios
 *
 * Features:
 * - Funciona para Business y Service
 * - Overlay oscuro con click para cerrar
 * - Modal centrado responsive
 * - Header con logo grande
 * - Información completa del item
 * - Botones de contacto funcionales (tel:, mailto:, website)
 * - Botón cerrar (X) y click fuera del modal
 * - Bloquea scroll del body
 * - Animaciones suaves de entrada/salida
 * - Responsive design (fullscreen en móvil)
 *
 * Sprint 2 - Task 6.4
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.item - Datos completos del item (business o service)
 * @param {string} props.type - Tipo de directorio: 'business' o 'service'
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
const DirectoryDetailModal = ({ isOpen, onClose, item, type = 'business' }) => {
  // Si no está abierto o no hay item, no renderizar nada
  if (!isOpen || !item) return null;

  const {
    name,
    category,        // Para businesses
    serviceType,     // Para services
    description,
    credentials,     // Para services (certificaciones profesionales)
    phone,
    email,
    city,
    website,
    logo,
  } = item;

  // Determinar la categoría/tipo según el tipo de directorio
  const displayCategory = type === 'business' ? category : serviceType;

  // Generar avatar si no hay logo
  const logoUrl = logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=f0568c&color=ffffff&bold=true`;

  // Obtener colores de categoría desde constantes
  const categoryColorClass = getCategoryColor(displayCategory);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handler para cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Header con Logo */}
            <div className="relative h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-t-2xl overflow-hidden">
              <img
                src={logoUrl}
                alt={`Logo de ${name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=f0568c&color=ffffff&bold=true`;
                }}
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${categoryColorClass} shadow-lg`}>
                  {displayCategory}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Name */}
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {name}
              </h2>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{city}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary-600" />
                  {type === 'business' ? 'Acerca de este negocio' : 'Acerca de este servicio'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Credentials Section - Solo para servicios */}
              {type === 'service' && credentials && (
                <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary-600" />
                    Credenciales y Certificaciones
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {credentials}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de contacto
                </h3>

                <div className="space-y-3">
                  {/* Phone */}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <Phone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium text-gray-900">{phone}</p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                        <Mail className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{email}</p>
                      </div>
                    </a>
                  )}

                  {/* Website */}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                        <Globe className="w-5 h-5 text-accent-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">Sitio web</p>
                        <p className="font-medium text-gray-900 truncate">{website}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DirectoryDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,       // Para businesses
    serviceType: PropTypes.string,    // Para services
    description: PropTypes.string.isRequired,
    credentials: PropTypes.string,    // Para services (certificaciones)
    phone: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string.isRequired,
    website: PropTypes.string,
    logo: PropTypes.string,
  }),
  type: PropTypes.oneOf(['business', 'service']),
};

export default DirectoryDetailModal;
