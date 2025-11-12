import PropTypes from 'prop-types';
import DirectoryCard from '../../../shared/components/common/DirectoryCard';

/**
 * ServiceCard - Wrapper de DirectoryCard para servicios
 *
 * Features:
 * - Wrapper específico para el directorio de servicios
 * - Usa DirectoryCard genérico internamente
 * - Mantiene consistencia con BusinessCard
 *
 * Sprint 2 - Task 6.5
 *
 * @param {Object} props
 * @param {Object} props.service - Datos del servicio
 * @param {Function} props.onClick - Callback al hacer click en la card
 * @returns {JSX.Element} Tarjeta de servicio
 */
const ServiceCard = ({ service, onClick }) => {
  return (
    <DirectoryCard
      item={service}
      type="service"
      onClick={onClick}
    />
  );
};

ServiceCard.propTypes = {
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
  }).isRequired,
  onClick: PropTypes.func,
};

export default ServiceCard;
