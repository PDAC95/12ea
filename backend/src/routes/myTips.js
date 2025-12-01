import express from 'express';
import {
  createTip,
  getMyTips,
  updateMyTip,
  deleteMyTip,
} from '../controllers/tipController.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  proposeTipValidator,
  updateTipValidator,
} from '../validators/tipValidator.js';
import { validationResult } from 'express-validator';

const router = express.Router();

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

/**
 * =====================================
 * RUTAS AUTENTICADAS - MIS TIPS
 * Todas requieren protect (requireAuth)
 * =====================================
 */

/**
 * POST /api/v1/tips/my/propose
 * Proponer un nuevo tip
 * - Crea tip con status='pending'
 * - author=req.user.id
 */
router.post(
  '/propose',
  protect,
  proposeTipValidator,
  handleValidationErrors,
  createTip
);

/**
 * GET /api/v1/tips/my/list
 * Obtener mis tips (del usuario logueado)
 */
router.get('/list', protect, getMyTips);

/**
 * PUT /api/v1/tips/my/:id
 * Actualizar mi tip
 * - Solo si status='pending'
 * - Solo el autor puede editar
 */
router.put(
  '/:id',
  protect,
  updateTipValidator,
  handleValidationErrors,
  updateMyTip
);

/**
 * DELETE /api/v1/tips/my/:id
 * Eliminar mi tip
 * - Solo si status='pending'
 * - Solo el autor puede eliminar
 */
router.delete('/:id', protect, deleteMyTip);

export default router;
