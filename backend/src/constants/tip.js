/**
 * Tip Categories - Entre Amigas
 * Categorías oficiales para los tips comunitarios
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
