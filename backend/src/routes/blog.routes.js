import express from 'express';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogStats,
} from '../controllers/blog.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// =====================================
// PUBLIC ROUTES
// =====================================

/**
 * GET /api/v1/blog
 * Lista pública de artículos del blog (solo publicados)
 * Query params:
 *   - category: Wellness|Amistad|Amor Propio|Migración|Consejos|Historias
 *   - page: número de página (default: 1)
 *   - limit: resultados por página (default: 10, max: 50)
 *   - featured: true para artículos destacados
 *   - search: keyword para búsqueda de texto
 */
router.get('/', getAllBlogPosts);

/**
 * GET /api/v1/blog/:slug
 * Detalle de un artículo por slug
 * - Solo muestra artículos publicados
 * - Incrementa el contador de vistas
 * - Incluye artículos relacionados (misma categoría)
 */
router.get('/:slug', getBlogPostBySlug);

// =====================================
// ADMIN ROUTES (Future Sprints)
// =====================================

/**
 * GET /api/v1/blog/admin/stats
 * Obtener estadísticas del blog (Admin only)
 * IMPORTANTE: Esta ruta debe ir ANTES de '/:slug' para evitar conflictos
 */
// router.get('/admin/stats', protect, requireAdmin, getBlogStats);

/**
 * POST /api/v1/blog
 * Crear nuevo artículo (Admin only)
 * Body:
 *   - title: string (required)
 *   - content: string (required)
 *   - excerpt: string (required)
 *   - featuredImage: string URL (required)
 *   - category: enum (required)
 *   - tags: array of strings (optional)
 *   - status: draft|published (default: draft)
 *   - isFeatured: boolean (optional)
 */
// router.post('/', protect, requireAdmin, createBlogPost);

/**
 * PUT /api/v1/blog/:slug
 * Actualizar artículo existente (Admin only)
 */
// router.put('/:slug', protect, requireAdmin, updateBlogPost);

/**
 * DELETE /api/v1/blog/:slug
 * Eliminar artículo (Admin only)
 */
// router.delete('/:slug', protect, requireAdmin, deleteBlogPost);

export default router;
