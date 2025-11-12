import PropTypes from 'prop-types';
import DirectoryCard from '../../../shared/components/common/DirectoryCard';

/**
 * BusinessCard - Wrapper de DirectoryCard para negocios
 *
 * Features:
 * - Wrapper específico para el directorio de negocios
 * - Usa DirectoryCard genérico internamente
 * - Mantiene la misma API para compatibilidad
 *
 * Sprint 2 - Task 5.4 + 5.6 + Task 6.4 (Refactored)
 *
 * @param {Object} props
 * @param {Object} props.business - Datos del negocio
 * @param {Function} props.onClick - Callback al hacer click en la card
 * @returns {JSX.Element} Tarjeta de negocio
 */
const BusinessCard = ({ business, onClick }) => {
  return (
    <DirectoryCard
      item={business}
      type="business"
      onClick={onClick}
    />
  );
};

BusinessCard.propTypes = {
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
  }).isRequired,
  onClick: PropTypes.func,
};

export default BusinessCard;
