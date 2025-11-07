import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../config/aws.js';
import crypto from 'crypto';
import path from 'path';

/**
 * Genera un nombre único para el archivo
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  return `${sanitizedName}_${timestamp}_${randomString}${extension}`;
};

/**
 * Sube un archivo a S3
 * @param {Object} file - Archivo de multer (req.file)
 * @param {String} folder - Carpeta en S3 (users, events, etc.)
 * @param {String} subfolder - Subcarpeta opcional (userId, eventId, etc.)
 * @returns {Promise<Object>} - Información del archivo subido
 */
export const uploadToS3 = async (file, folder, subfolder = '') => {
  try {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }

    // Generar nombre único
    const uniqueFileName = generateUniqueFileName(file.originalname);

    // Construir key (path) del archivo en S3
    const key = subfolder
      ? `${folder}/${subfolder}/${uniqueFileName}`
      : `${folder}/${uniqueFileName}`;

    // Parámetros para subir a S3
    const params = {
      Bucket: s3Config.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'private', // Por defecto es privado, usaremos signed URLs
    };

    // Subir archivo a S3
    const command = new PutObjectCommand(params);
    await s3Config.client.send(command);

    // Construir URL del archivo
    const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;

    return {
      success: true,
      key,
      url: fileUrl,
      bucket: s3Config.bucket,
      fileName: uniqueFileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };

  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    throw new Error(`Error al subir archivo: ${error.message}`);
  }
};

/**
 * Elimina un archivo de S3
 * @param {String} key - Key (path) del archivo en S3
 * @returns {Promise<Boolean>}
 */
export const deleteFromS3 = async (key) => {
  try {
    if (!key) {
      throw new Error('No se proporcionó la key del archivo');
    }

    const params = {
      Bucket: s3Config.bucket,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Config.client.send(command);

    return true;

  } catch (error) {
    console.error('Error al eliminar archivo de S3:', error);
    throw new Error(`Error al eliminar archivo: ${error.message}`);
  }
};

/**
 * Genera una URL firmada temporal para acceder a un archivo privado
 * @param {String} key - Key (path) del archivo en S3
 * @param {Number} expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 * @returns {Promise<String>} - URL firmada
 */
export const getSignedUrlForFile = async (key, expiresIn = 3600) => {
  try {
    if (!key) {
      throw new Error('No se proporcionó la key del archivo');
    }

    const params = {
      Bucket: s3Config.bucket,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Config.client, command, { expiresIn });

    return signedUrl;

  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    throw new Error(`Error al generar URL firmada: ${error.message}`);
  }
};

/**
 * Sube múltiples archivos a S3
 * @param {Array} files - Array de archivos de multer (req.files)
 * @param {String} folder - Carpeta en S3
 * @param {String} subfolder - Subcarpeta opcional
 * @returns {Promise<Array>} - Array de información de archivos subidos
 */
export const uploadMultipleToS3 = async (files, folder, subfolder = '') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No se proporcionaron archivos');
    }

    const uploadPromises = files.map(file => uploadToS3(file, folder, subfolder));
    const results = await Promise.all(uploadPromises);

    return results;

  } catch (error) {
    console.error('Error al subir múltiples archivos:', error);
    throw new Error(`Error al subir archivos: ${error.message}`);
  }
};

/**
 * Reemplaza un archivo (elimina el anterior y sube el nuevo)
 * @param {String} oldKey - Key del archivo anterior
 * @param {Object} newFile - Nuevo archivo
 * @param {String} folder - Carpeta en S3
 * @param {String} subfolder - Subcarpeta opcional
 * @returns {Promise<Object>}
 */
export const replaceFileInS3 = async (oldKey, newFile, folder, subfolder = '') => {
  try {
    // Eliminar archivo anterior si existe
    if (oldKey) {
      await deleteFromS3(oldKey);
    }

    // Subir nuevo archivo
    const result = await uploadToS3(newFile, folder, subfolder);

    return result;

  } catch (error) {
    console.error('Error al reemplazar archivo:', error);
    throw new Error(`Error al reemplazar archivo: ${error.message}`);
  }
};
