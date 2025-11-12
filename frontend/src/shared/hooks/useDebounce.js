import { useState, useEffect } from 'react';

/**
 * useDebounce - Custom hook para debouncing de valores
 *
 * Retrasa la actualización de un valor hasta que el usuario deje de escribir
 * por un período de tiempo específico (delay).
 *
 * Útil para:
 * - Search bars (evitar fetch en cada tecla)
 * - Auto-save (evitar guardar en cada cambio)
 * - Validaciones en tiempo real
 *
 * Sprint 2 - Task 5.5
 *
 * @param {any} value - Valor a hacer debounce
 * @param {number} delay - Tiempo de espera en milisegundos (default: 300ms)
 * @returns {any} Valor debounced
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Hacer fetch aquí
 *   }
 * }, [debouncedSearchTerm]);
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Crear timer que actualiza debouncedValue después de delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar timer si value cambia antes de que se cumpla el delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
