import multer from 'multer';
import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from '../config/aws.js';

/**
 * Configuración de multer para almacenar archivos en memoria
 * Los archivos se guardan en buffer para luego subirlos a S3
 */
const storage = multer.memoryStorage();

/**
 * Filtro de archivos
 * @param {String} allowedTypes - 'images', 'documents', o 'all'
 */
const fileFilter = (allowedTypes = 'images') => {
  return (req, file, cb) => {
    let allowedMimeTypes;

    switch (allowedTypes.toLowerCase()) {
      case 'images':
        allowedMimeTypes = ALLOWED_FILE_TYPES.IMAGES;
        break;
      case 'documents':
        allowedMimeTypes = ALLOWED_FILE_TYPES.DOCUMENTS;
        break;
      case 'all':
        allowedMimeTypes = ALLOWED_FILE_TYPES.ALL;
        break;
      default:
        allowedMimeTypes = ALLOWED_FILE_TYPES.IMAGES;
    }

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedMimeTypes.join(', ')}`), false);
    }
  };
};

/**
 * Middleware para subir una sola imagen
 * @param {String} fieldName - Nombre del campo en el formulario
 * @param {Number} maxSize - Tamaño máximo en bytes
 */
export const uploadSingleImage = (fieldName = 'image', maxSize = FILE_SIZE_LIMITS.IMAGE) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter('images'),
  }).single(fieldName);
};

/**
 * Middleware para subir múltiples imágenes
 * @param {String} fieldName - Nombre del campo en el formulario
 * @param {Number} maxCount - Número máximo de archivos
 * @param {Number} maxSize - Tamaño máximo por archivo
 */
export const uploadMultipleImages = (fieldName = 'images', maxCount = 5, maxSize = FILE_SIZE_LIMITS.IMAGE) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter('images'),
  }).array(fieldName, maxCount);
};

/**
 * Middleware para subir un solo documento
 * @param {String} fieldName - Nombre del campo
 * @param {Number} maxSize - Tamaño máximo
 */
export const uploadSingleDocument = (fieldName = 'document', maxSize = FILE_SIZE_LIMITS.DOCUMENT) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter('documents'),
  }).single(fieldName);
};

/**
 * Middleware para subir cualquier tipo de archivo permitido
 * @param {String} fieldName - Nombre del campo
 * @param {Number} maxSize - Tamaño máximo
 */
export const uploadSingleFile = (fieldName = 'file', maxSize = FILE_SIZE_LIMITS.DEFAULT) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter('all'),
  }).single(fieldName);
};

/**
 * Middleware para manejar múltiples campos con archivos
 * Ejemplo: [{ name: 'avatar', maxCount: 1 }, { name: 'photos', maxCount: 5 }]
 */
export const uploadFields = (fields, maxSize = FILE_SIZE_LIMITS.IMAGE) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter('images'),
  }).fields(fields);
};

/**
 * Manejo de errores de multer
 * Usar después del middleware de upload
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande',
        maxSize: err.limit,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos',
        maxCount: err.limit,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado',
        field: err.field,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Error al procesar el archivo',
      error: err.message,
    });
  }

  if (err) {
    // Otro tipo de error (como fileFilter)
    return res.status(400).json({
      success: false,
      message: err.message || 'Error al subir archivo',
    });
  }

  next();
};
