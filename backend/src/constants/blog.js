/**
 * BLOG CATEGORIES - Entre Amigas
 *
 * Lista oficial de categorías para artículos de blog.
 * Estas categorías son compartidas entre frontend y backend.
 *
 * @constant {Array<Object>} BLOG_CATEGORIES
 * @property {string} id - Identificador único de la categoría (usado en DB)
 * @property {string} name - Nombre en español de la categoría
 * @property {string} emoji - Emoji representativo de la categoría
 * @property {string} description - Descripción breve de la categoría
 *
 * Last Updated: 2025-01-19
 * Sprint: Sprint 5 - Task 5.6.1
 */

export const BLOG_CATEGORIES = [
  {
    id: 'nosotras',
    name: 'Nosotras',
    emoji: '💖',
    description: 'Sobre Entre Amigas: nuestra misión, valores y comunidad'
  },
  {
    id: 'bienestar',
    name: 'Bienestar',
    emoji: '🧘‍♀️',
    description: 'Salud mental, física y emocional para mujeres'
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    emoji: '💰',
    description: 'Educación financiera, ahorro y planificación económica'
  },
  {
    id: 'maternidad',
    name: 'Maternidad',
    emoji: '👶',
    description: 'Crianza, embarazo y vida familiar'
  },
  {
    id: 'emprendimiento',
    name: 'Emprendimiento',
    emoji: '💼',
    description: 'Negocios, emprendimiento y desarrollo profesional'
  },
  {
    id: 'inmigracion',
    name: 'Inmigración',
    emoji: '🌍',
    description: 'Procesos migratorios, adaptación y vida en Canadá'
  },
  {
    id: 'comunidad',
    name: 'Comunidad',
    emoji: '🤝',
    description: 'Red de apoyo, eventos y conexiones entre mujeres'
  },
  {
    id: 'educacion',
    name: 'Educación',
    emoji: '📚',
    description: 'Formación académica, cursos y desarrollo personal'
  }
];

/**
 * Array de IDs de categorías válidos (para validación en Mongoose)
 * @constant {Array<string>}
 */
export const VALID_CATEGORY_IDS = BLOG_CATEGORIES.map(cat => cat.id);

/**
 * Mapa de categorías por ID (para acceso rápido)
 * @constant {Object}
 */
export const CATEGORIES_MAP = BLOG_CATEGORIES.reduce((map, category) => {
  map[category.id] = category;
  return map;
}, {});

/**
 * Obtener información de una categoría por su ID
 * @param {string} categoryId - ID de la categoría
 * @returns {Object|null} - Objeto de categoría o null si no existe
 */
export const getCategoryById = (categoryId) => {
  return CATEGORIES_MAP[categoryId] || null;
};

/**
 * Verificar si un ID de categoría es válido
 * @param {string} categoryId - ID de la categoría a verificar
 * @returns {boolean} - true si la categoría existe
 */
export const isValidCategory = (categoryId) => {
  return VALID_CATEGORY_IDS.includes(categoryId);
};

/**
 * Obtener todas las categorías en formato simplificado (solo id y name)
 * @returns {Array<Object>} - Array de objetos con id y name
 */
export const getCategoriesForSelect = () => {
  return BLOG_CATEGORIES.map(({ id, name, emoji }) => ({
    id,
    name,
    emoji
  }));
};

export default {
  BLOG_CATEGORIES,
  VALID_CATEGORY_IDS,
  CATEGORIES_MAP,
  getCategoryById,
  isValidCategory,
  getCategoriesForSelect
};
