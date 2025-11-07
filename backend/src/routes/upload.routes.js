import express from 'express';
import {
  uploadTestImage,
  uploadUserProfile,
  uploadMultipleImages,
  deleteFile,
  getSignedUrl,
} from '../controllers/upload.controller.js';
import {
  uploadSingleImage,
  uploadMultipleImages as uploadMultipleMiddleware,
  handleMulterError,
} from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/v1/upload/test
 * @desc    Subir imagen de prueba a carpeta temp
 * @access  Public (en producción debería ser Private)
 */
router.post('/test', uploadSingleImage('image'), handleMulterError, uploadTestImage);

/**
 * @route   POST /api/v1/upload/user/profile
 * @desc    Subir foto de perfil de usuario
 * @access  Private (requiere autenticación - agregar middleware auth)
 */
router.post('/user/profile', uploadSingleImage('image'), handleMulterError, uploadUserProfile);

/**
 * @route   POST /api/v1/upload/multiple
 * @desc    Subir múltiples imágenes
 * @access  Public (en producción debería ser Private)
 */
router.post('/multiple', uploadMultipleMiddleware('images', 5), handleMulterError, uploadMultipleImages);

/**
 * @route   DELETE /api/v1/upload/:key
 * @desc    Eliminar archivo de S3
 * @access  Private (requiere autenticación y validación de permisos)
 * @param   key - Key del archivo en formato folder/subfolder/filename.ext (URL encoded)
 */
router.delete('/:key(*)', deleteFile);

/**
 * @route   GET /api/v1/upload/signed-url/:key
 * @desc    Obtener URL firmada temporal para acceder a archivo privado
 * @access  Private (requiere autenticación)
 * @param   key - Key del archivo
 * @query   expiresIn - Tiempo de expiración en segundos (default: 3600)
 */
router.get('/signed-url/:key(*)', getSignedUrl);

export default router;
