import express from 'express';
import {
  getPendingTips,
  approveTip,
  rejectTip,
} from '../controllers/tipController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { rejectTipValidator } from '../validators/tipValidator.js';
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
 * RUTAS ADMIN - TIPS
 * Todas requieren protect + authorize('admin')
 * =====================================
 */

/**
 * GET /api/v1/admin/tips/pending
 * Obtener tips pendientes de aprobación
 * - status='pending'
 */
router.get('/pending', protect, authorize('admin'), getPendingTips);

/**
 * PUT /api/v1/admin/tips/:id/approve
 * Aprobar un tip
 * - Cambia status a 'approved'
 * - Agrega approvedBy y approvedAt
 */
router.put('/:id/approve', protect, authorize('admin'), approveTip);

/**
 * PUT /api/v1/admin/tips/:id/reject
 * Rechazar un tip
 * - Cambia status a 'rejected'
 * - Agrega rejectionReason
 */
router.put(
  '/:id/reject',
  protect,
  authorize('admin'),
  rejectTipValidator,
  handleValidationErrors,
  rejectTip
);

export default router;
