import BlogPost from '../models/BlogPost.js';

/**
 * Genera un slug único a partir de un texto
 * @param {String} text - Texto para convertir a slug
 * @param {String} excludeId - ID del documento a excluir (para updates)
 * @returns {Promise<String>} - Slug único
 */
export const generateUniqueSlug = async (text, excludeId = null) => {
  // Generar slug base desde el texto
  let slug = text
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Eliminar guiones duplicados

  // Verificar si el slug ya existe
  let uniqueSlug = slug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug: uniqueSlug };

    // Si estamos actualizando, excluir el documento actual
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingPost = await BlogPost.findOne(query);

    if (!existingPost) {
      exists = false;
    } else {
      // Si existe, agregar contador al final
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }

  return uniqueSlug;
};

/**
 * Valida que un slug tenga el formato correcto
 * @param {String} slug - Slug a validar
 * @returns {Boolean}
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
