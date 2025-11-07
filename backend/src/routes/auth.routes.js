import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  handleValidationErrors,
} from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * Auth Routes - Entre Amigas
 * Rutas de autenticación con validaciones y controladores
 */

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 * @body    { fullName, preferredName, email, password, confirmPassword, phone, birthday, city }
 */
router.post(
  '/register',
  registerValidation,       // 1. Validar datos de entrada
  handleValidationErrors,   // 2. Manejar errores de validación
  register                  // 3. Ejecutar controlador
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 * @body    { email, password }
 */
router.post(
  '/login',
  loginValidation,          // 1. Validar credenciales
  handleValidationErrors,   // 2. Manejar errores
  login                     // 3. Ejecutar login
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verificar email con token
 * @access  Public
 * @params  token - Token de verificación enviado por email
 */
router.get(
  '/verify-email/:token',
  verifyEmail               // No requiere validación de body
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reset de contraseña
 * @access  Public
 * @body    { email }
 */
router.post(
  '/forgot-password',
  forgotPasswordValidation,  // 1. Validar email
  handleValidationErrors,    // 2. Manejar errores
  forgotPassword             // 3. Enviar email de reset
);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Restablecer contraseña con token
 * @access  Public
 * @params  token - Token de reset enviado por email
 * @body    { password, confirmPassword }
 */
router.post(
  '/reset-password/:token',
  resetPasswordValidation,   // 1. Validar nueva contraseña
  handleValidationErrors,    // 2. Manejar errores
  resetPassword              // 3. Actualizar contraseña
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado actual
 * @access  Private (requiere token JWT)
 * @headers Authorization: Bearer {token}
 */
router.get(
  '/me',
  protect,                   // 1. Verificar token JWT y autenticar
  getMe                      // 2. Retornar información del usuario
);

export default router;
