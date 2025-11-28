/**
 * Tip Categories - Entre Amigas
 * Categorías oficiales para los tips comunitarios
 * DEBE ESTAR SINCRONIZADO CON backend/src/constants/tip.js
 */

export const TIP_CATEGORIES = [
  'Inmigración y Adaptación',
  'Emprendimiento',
  'Finanzas Personales',
  'Educación',
  'Salud y Bienestar',
  'Crianza y Familia',
  'Desarrollo Profesional',
  'Vivienda',
  'Recursos Legales',
  'Networking',
  'Idiomas',
  'Cultura y Tradiciones',
];

/**
 * Obtener categorías formateadas para select/dropdown
 * @returns {Array} Array de objetos { value, label }
 */
export const getCategoriesForSelect = () => {
  return TIP_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }));
};

/**
 * Colores para badges de categorías
 */
export const CATEGORY_COLORS = {
  'Inmigración y Adaptación': 'bg-blue-100 text-blue-800',
  'Emprendimiento': 'bg-purple-100 text-purple-800',
  'Finanzas Personales': 'bg-green-100 text-green-800',
  'Educación': 'bg-yellow-100 text-yellow-800',
  'Salud y Bienestar': 'bg-pink-100 text-pink-800',
  'Crianza y Familia': 'bg-red-100 text-red-800',
  'Desarrollo Profesional': 'bg-indigo-100 text-indigo-800',
  'Vivienda': 'bg-orange-100 text-orange-800',
  'Recursos Legales': 'bg-gray-100 text-gray-800',
  'Networking': 'bg-cyan-100 text-cyan-800',
  'Idiomas': 'bg-teal-100 text-teal-800',
  'Cultura y Tradiciones': 'bg-amber-100 text-amber-800',
};

/**
 * Obtener color de badge para una categoría
 * @param {string} category - Nombre de la categoría
 * @returns {string} Clases de Tailwind para el badge
 */
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';
};
