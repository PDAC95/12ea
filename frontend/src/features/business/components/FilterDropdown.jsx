import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * FilterDropdown - Dropdown reutilizable para filtros
 *
 * Features:
 * - Select nativo estilizado
 * - Placeholder personalizable
 * - Label opcional
 * - Opciones dinámicas
 * - Icono de chevron
 * - Responsive design
 *
 * Sprint 2 - Task 5.5
 *
 * @param {Object} props
 * @param {string} props.value - Valor seleccionado
 * @param {Function} props.onChange - Callback cuando cambia el valor
 * @param {Array} props.options - Array de opciones [{value, label}]
 * @param {string} props.placeholder - Placeholder del dropdown
 * @param {string} props.label - Label opcional para el dropdown
 * @returns {JSX.Element} Dropdown de filtro
 */
const FilterDropdown = ({ value, onChange, options, placeholder = 'Seleccionar...', label }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label (opcional) */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        {/* Select Input */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 bg-white cursor-pointer"
        >
          {/* Placeholder option */}
          <option value="">{placeholder}</option>

          {/* Dynamic options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

FilterDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

export default FilterDropdown;
