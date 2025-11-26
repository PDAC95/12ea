import PropTypes from 'prop-types';
import { Store, Loader2, AlertCircle, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

/**
 * MyBusinessesList - Lista de negocios registrados por el usuario
 *
 * Features:
 * - Cards de negocios con logo, nombre, categoría, status
 * - Badges de status: pending (amarillo), approved (verde), rejected (rojo)
 * - Loading state
 * - Error state
 * - Empty state
 * - Información de contacto
 *
 * Sprint 5+ - Sistema de Perfil de Usuario
 *
 * @param {Object} props
 * @param {Array} props.businesses - Lista de negocios
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @returns {JSX.Element} Lista de negocios
 */
const MyBusinessesList = ({ businesses, loading, error }) => {
  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pendiente',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Aprobado',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rechazado',
      },
    };

    return badges[status] || badges.pending;
  };

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">Cargando tus negocios...</p>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium mb-2">Error al cargar negocios</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  /**
   * Empty State
   */
  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2 font-medium">No has registrado negocios aún</p>
        <p className="text-sm text-gray-500">
          Registra tu negocio y compártelo con la comunidad
        </p>
      </div>
    );
  }

  /**
   * Businesses Grid
   */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => {
        const statusBadge = getStatusBadge(business.status);

        return (
          <div
            key={business._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header with Logo */}
            <div className="relative h-40 bg-gradient-to-br from-primary-50 to-secondary-50">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="w-16 h-16 text-primary-300" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text} shadow-sm`}
                >
                  {statusBadge.label}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              {/* Name */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {business.name}
              </h3>

              {/* Category */}
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                {business.category}
              </div>

              {/* Description */}
              {business.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {business.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {/* City */}
                {business.city && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{business.city}</span>
                  </div>
                )}

                {/* Phone */}
                {business.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${business.phone}`}
                      className="hover:text-primary-600 truncate"
                    >
                      {business.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {business.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${business.email}`}
                      className="hover:text-primary-600 truncate"
                    >
                      {business.email}
                    </a>
                  </div>
                )}

                {/* Website */}
                {business.website && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 truncate"
                    >
                      Sitio web
                    </a>
                  </div>
                )}
              </div>

              {/* Rejection Reason (if rejected) */}
              {business.status === 'rejected' && business.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-semibold text-red-800 mb-1">
                    Razón del rechazo:
                  </p>
                  <p className="text-xs text-red-700">{business.rejectionReason}</p>
                </div>
              )}

              {/* Submission Date */}
              {business.createdAt && (
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Enviado el {new Date(business.createdAt).toLocaleDateString('es-CA')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

MyBusinessesList.propTypes = {
  businesses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
      category: PropTypes.string.isRequired,
      description: PropTypes.string,
      city: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      website: PropTypes.string,
      status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
      rejectionReason: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default MyBusinessesList;
