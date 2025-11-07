import {
  uploadToS3,
  deleteFromS3,
  getSignedUrlForFile,
  uploadMultipleToS3,
  replaceFileInS3,
} from '../services/upload.service.js';
import { S3_FOLDERS } from '../config/aws.js';

/**
 * Controlador de prueba para subir una imagen
 * POST /api/v1/upload/test
 * Body: form-data con campo "image"
 */
export const uploadTestImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo',
      });
    }

    // Subir a carpeta temporal
    const result = await uploadToS3(req.file, S3_FOLDERS.TEMP);

    res.status(200).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Subir imagen de perfil de usuario
 * POST /api/v1/upload/user/profile
 * Body: form-data con campo "image"
 * Requiere autenticación
 */
export const uploadUserProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen',
      });
    }

    // req.user vendría del middleware de autenticación
    const userId = req.user?._id || 'demo-user';

    // Subir a carpeta users/{userId}
    const result = await uploadToS3(req.file, S3_FOLDERS.USERS, userId);

    res.status(200).json({
      success: true,
      message: 'Foto de perfil subida exitosamente',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Subir múltiples imágenes
 * POST /api/v1/upload/multiple
 * Body: form-data con campo "images" (múltiple)
 */
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron archivos',
      });
    }

    const results = await uploadMultipleToS3(req.files, S3_FOLDERS.TEMP);

    res.status(200).json({
      success: true,
      message: `${results.length} archivo(s) subido(s) exitosamente`,
      data: results,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar archivo de S3
 * DELETE /api/v1/upload/:key
 * Key debe estar en formato: folder/subfolder/filename.ext
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó la key del archivo',
      });
    }

    // Decodificar key (por si viene URL encoded)
    const decodedKey = decodeURIComponent(key);

    await deleteFromS3(decodedKey);

    res.status(200).json({
      success: true,
      message: 'Archivo eliminado exitosamente',
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener URL firmada temporal
 * GET /api/v1/upload/signed-url/:key
 */
export const getSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { expiresIn = 3600 } = req.query; // Default 1 hora

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó la key del archivo',
      });
    }

    const decodedKey = decodeURIComponent(key);
    const signedUrl = await getSignedUrlForFile(decodedKey, parseInt(expiresIn));

    res.status(200).json({
      success: true,
      data: {
        signedUrl,
        expiresIn: parseInt(expiresIn),
      },
    });

  } catch (error) {
    next(error);
  }
};
