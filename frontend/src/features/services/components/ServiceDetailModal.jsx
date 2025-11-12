import PropTypes from 'prop-types';
import DirectoryDetailModal from '../../../shared/components/common/DirectoryDetailModal';

/**
 * ServiceDetailModal - Wrapper de DirectoryDetailModal para servicios
 *
 * Features:
 * - Wrapper específico para el directorio de servicios
 * - Usa DirectoryDetailModal genérico internamente
 * - Mantiene la misma API que BusinessDetailModal
 *
 * Sprint 2 - Task 6.5
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.service - Datos completos del servicio
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  return (
    <DirectoryDetailModal
      isOpen={isOpen}
      onClose={onClose}
      item={service}
      type="service"
    />
  );
};

ServiceDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string.isRequired,
    website: PropTypes.string,
    logo: PropTypes.string,
  }),
};

export default ServiceDetailModal;
