import { Search, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * SearchBar - Barra de búsqueda reutilizable
 *
 * Features:
 * - Input de búsqueda con icono
 * - Botón para limpiar (X) cuando hay texto
 * - Placeholder personalizable
 * - Responsive design
 * - Auto-focus opcional
 * - Debounce manejado por el componente padre
 *
 * Sprint 2 - Task 5.5 (Moved to shared in Task 6.5)
 *
 * @param {Object} props
 * @param {string} props.value - Valor actual del input
 * @param {Function} props.onChange - Callback cuando cambia el valor
 * @param {string} props.placeholder - Placeholder del input
 * @returns {JSX.Element} Barra de búsqueda
 */
const SearchBar = ({ value, onChange, placeholder = 'Buscar...' }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative flex-1">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
