import express from 'express';
import {
  getAllTips,
  getTipById,
  likeTip,
} from '../controllers/tipController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * =====================================
 * RUTAS PÚBLICAS - TIPS
 * =====================================
 */

/**
 * GET /api/v1/tips
 * Lista de tips aprobados (públicos)
 * Query params:
 *   - category: filtrar por categoría
 *   - page: número de página (default: 1)
 *   - limit: resultados por página (default: 20, max: 50)
 */
router.get('/', getAllTips);

/**
 * GET /api/v1/tips/:id
 * Detalle de un tip por ID
 * - Solo muestra tips aprobados
 * - Incrementa el contador de vistas
 */
router.get('/:id', getTipById);

/**
 * POST /api/v1/tips/:id/like
 * Like/unlike a un tip (toggle)
 * - Requiere autenticación
 */
router.post('/:id/like', protect, likeTip);

export default router;
