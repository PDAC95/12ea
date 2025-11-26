import express from 'express';
import {
  getProfile,
  updateProfile,
  getMyBusinesses,
  getMyServices,
  getMyEvents,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadSingleImage, handleMulterError } from '../middleware/upload.middleware.js';

/**
 * User Routes - Entre Amigas
 * Rutas para gestión de perfil de usuario
 */

const router = express.Router();

// ============================================
// RUTAS DE PERFIL DE USUARIO
// ============================================
// TODAS las rutas requieren autenticación (protect)

/**
 * @route   GET /api/v1/users/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Private
 * @body    FormData: { preferredName, phone, city, bio, profileImage (file) }
 * @note    Usa multer para manejar multipart/form-data con imagen opcional
 */
router.put(
  '/profile',
  protect,
  uploadSingleImage('profileImage', 5 * 1024 * 1024), // 5MB max
  handleMulterError,
  updateProfile
);

/**
 * @route   GET /api/v1/users/my-businesses
 * @desc    Obtener todos los negocios del usuario (pending, approved, rejected)
 * @access  Private
 */
router.get('/my-businesses', protect, getMyBusinesses);

/**
 * @route   GET /api/v1/users/my-services
 * @desc    Obtener todos los servicios del usuario (pending, approved, rejected)
 * @access  Private
 */
router.get('/my-services', protect, getMyServices);

/**
 * @route   GET /api/v1/users/my-events
 * @desc    Obtener eventos próximos del usuario (registrados y confirmados)
 * @access  Private
 */
router.get('/my-events', protect, getMyEvents);

export default router;
