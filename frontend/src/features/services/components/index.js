/**
 * Service Components - Barrel Exports
 *
 * Componentes del directorio de servicios:
 * - ServiceList: Vista principal con grid de servicios
 * - ServiceCard: Tarjeta individual de servicio (wrapper de DirectoryCard)
 * - ServiceFiltersBar: Barra de filtros (búsqueda + tipo + ciudad)
 * - ServiceDetailModal: Modal con detalles completos del servicio (wrapper de DirectoryDetailModal)
 *
 * Sprint 2 - Task 6.5
 */

export { default as ServiceList } from './ServiceList';
export { default as ServiceCard } from './ServiceCard';
export { default as ServiceFiltersBar } from './ServiceFiltersBar';
export { default as ServiceDetailModal } from './ServiceDetailModal';
