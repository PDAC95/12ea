import PropTypes from 'prop-types';
import DirectoryDetailModal from '../../../shared/components/common/DirectoryDetailModal';

/**
 * BusinessDetailModal - Wrapper de DirectoryDetailModal para negocios
 *
 * Features:
 * - Wrapper específico para el directorio de negocios
 * - Usa DirectoryDetailModal genérico internamente
 * - Mantiene la misma API para compatibilidad
 *
 * Sprint 2 - Task 5.6 + Task 6.4 (Refactored)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.business - Datos completos del negocio
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
const BusinessDetailModal = ({ isOpen, onClose, business }) => {
  return (
    <DirectoryDetailModal
      isOpen={isOpen}
      onClose={onClose}
      item={business}
      type="business"
    />
  );
};

BusinessDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  business: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string.isRequired,
    website: PropTypes.string,
    logo: PropTypes.string,
  }),
};

export default BusinessDetailModal;
