import PropTypes from 'prop-types';
import { Briefcase, Loader2, AlertCircle, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

/**
 * MyServicesList - Lista de servicios registrados por el usuario
 *
 * Features:
 * - Cards de servicios con logo, nombre, tipo, status
 * - Badges de status: pending (amarillo), approved (verde), rejected (rojo)
 * - Loading state
 * - Error state
 * - Empty state
 * - Información de contacto
 *
 * Sprint 5+ - Sistema de Perfil de Usuario
 *
 * @param {Object} props
 * @param {Array} props.services - Lista de servicios
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @returns {JSX.Element} Lista de servicios
 */
const MyServicesList = ({ services, loading, error }) => {
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
   * Get service type badge color
   */
  const getTypeBadge = (type) => {
    const types = {
      presencial: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Presencial',
      },
      virtual: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Virtual',
      },
      hibrido: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        label: 'Híbrido',
      },
    };

    return types[type] || types.presencial;
  };

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">Cargando tus servicios...</p>
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
        <p className="text-red-700 font-medium mb-2">Error al cargar servicios</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  /**
   * Empty State
   */
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2 font-medium">No has registrado servicios aún</p>
        <p className="text-sm text-gray-500">
          Registra tu servicio profesional y compártelo con la comunidad
        </p>
      </div>
    );
  }

  /**
   * Services Grid
   */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const statusBadge = getStatusBadge(service.status);
        const typeBadge = getTypeBadge(service.serviceType);

        return (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header with Logo */}
            <div className="relative h-40 bg-gradient-to-br from-secondary-50 to-primary-50">
              {service.logo ? (
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-secondary-300" />
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
                {service.name}
              </h3>

              {/* Category & Type Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                  {service.category}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full ${typeBadge.bg} ${typeBadge.text} text-xs font-medium`}
                >
                  {typeBadge.label}
                </span>
              </div>

              {/* Description */}
              {service.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {/* City */}
                {service.city && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{service.city}</span>
                  </div>
                )}

                {/* Phone */}
                {service.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${service.phone}`}
                      className="hover:text-primary-600 truncate"
                    >
                      {service.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {service.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${service.email}`}
                      className="hover:text-primary-600 truncate"
                    >
                      {service.email}
                    </a>
                  </div>
                )}

                {/* Website */}
                {service.website && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={service.website}
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
              {service.status === 'rejected' && service.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-semibold text-red-800 mb-1">
                    Razón del rechazo:
                  </p>
                  <p className="text-xs text-red-700">{service.rejectionReason}</p>
                </div>
              )}

              {/* Submission Date */}
              {service.createdAt && (
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Enviado el {new Date(service.createdAt).toLocaleDateString('es-CA')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

MyServicesList.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
      category: PropTypes.string.isRequired,
      serviceType: PropTypes.oneOf(['presencial', 'virtual', 'hibrido']),
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

export default MyServicesList;
