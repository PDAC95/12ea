import express from 'express';
import {
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  toggleFeatureBlogPost,
  getBlogStats,
} from '../controllers/blogController.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

/**
 * Admin Blog Routes - Entre Amigas
 * Rutas protegidas para administración de artículos del blog
 * Todas requieren autenticación + role admin
 */

const router = express.Router();

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(protect);
router.use(requireAdmin);

/**
 * @route   GET /api/v1/admin/blog/stats
 * @desc    Obtener estadísticas del blog
 * @access  Private/Admin
 * @returns Estadísticas: total, published, drafts, featured, by category, total views, avg read time
 */
router.get('/stats', getBlogStats);

/**
 * @route   GET /api/v1/admin/blog
 * @desc    Listar todos los artículos (incluye drafts)
 * @access  Private/Admin
 * @query   status (all/draft/published), category, search, page, limit, sort
 * @returns Lista paginada de artículos
 */
router.get('/', getAllBlogPosts);

/**
 * @route   POST /api/v1/admin/blog
 * @desc    Crear nuevo artículo
 * @access  Private/Admin
 * @body    title, content, excerpt, featuredImage, category, tags, status, metaDescription, metaKeywords, isFeatured, allowComments
 * @returns Artículo creado
 */
router.post('/', createBlogPost);

/**
 * @route   GET /api/v1/admin/blog/:id
 * @desc    Obtener artículo por ID (para edición)
 * @access  Private/Admin
 * @returns Artículo completo
 */
router.get('/:id', getBlogPostById);

/**
 * @route   PUT /api/v1/admin/blog/:id
 * @desc    Actualizar artículo
 * @access  Private/Admin
 * @body    Campos a actualizar
 * @returns Artículo actualizado
 */
router.put('/:id', updateBlogPost);

/**
 * @route   PATCH /api/v1/admin/blog/:id/publish
 * @desc    Publicar artículo (cambiar status a published)
 * @access  Private/Admin
 * @returns Artículo publicado
 */
router.patch('/:id/publish', publishBlogPost);

/**
 * @route   PATCH /api/v1/admin/blog/:id/unpublish
 * @desc    Despublicar artículo (cambiar status a draft)
 * @access  Private/Admin
 * @returns Artículo despublicado
 */
router.patch('/:id/unpublish', unpublishBlogPost);

/**
 * @route   PATCH /api/v1/admin/blog/:id/feature
 * @desc    Destacar/quitar destacado de artículo
 * @access  Private/Admin
 * @body    featured (boolean)
 * @returns Artículo actualizado
 */
router.patch('/:id/feature', toggleFeatureBlogPost);

/**
 * @route   DELETE /api/v1/admin/blog/:id
 * @desc    Eliminar artículo (permanente)
 * @access  Private/Admin
 * @returns Confirmación de eliminación
 */
router.delete('/:id', deleteBlogPost);

export default router;
