import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../config/aws.js';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Guarda archivo localmente (modo desarrollo - fallback cuando S3 no está disponible)
 * @param {Object} file - Archivo de multer
 * @param {String} folder - Carpeta
 * @param {String} subfolder - Subcarpeta opcional
 * @returns {Promise<Object>}
 */
const saveFileLocally = async (file, folder, subfolder = '') => {
  try {
    const uniqueFileName = generateUniqueFileName(file.originalname);
    const uploadsDir = path.join(__dirname, '../../uploads', folder);

    // Crear directorio si no existe
    if (subfolder) {
      const subfolderDir = path.join(uploadsDir, subfolder);
      if (!fs.existsSync(subfolderDir)) {
        fs.mkdirSync(subfolderDir, { recursive: true });
      }
    } else {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    }

    // Construir path del archivo
    const filePath = subfolder
      ? path.join(uploadsDir, subfolder, uniqueFileName)
      : path.join(uploadsDir, uniqueFileName);

    // Guardar archivo
    fs.writeFileSync(filePath, file.buffer);

    // Construir URL relativa
    const key = subfolder
      ? `${folder}/${subfolder}/${uniqueFileName}`
      : `${folder}/${uniqueFileName}`;

    const fileUrl = `http://localhost:${process.env.PORT || 8000}/uploads/${key}`;

    console.log(`📁 Archivo guardado localmente (modo dev): ${key}`);

    return {
      success: true,
      key,
      url: fileUrl,
      bucket: 'local-dev',
      fileName: uniqueFileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      mode: 'local-dev',
    };
  } catch (error) {
    console.error('Error al guardar archivo localmente:', error);
    throw new Error(`Error al guardar archivo: ${error.message}`);
  }
};

/**
 * Sube un archivo a S3 (con fallback local en desarrollo)
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

    // Verificar si AWS S3 está configurado
    if (!s3Config.bucket || s3Config.bucket === '' || s3Config.bucket === 'undefined') {
      console.log('⚠️  AWS S3 no configurado. Usando almacenamiento local (modo desarrollo)');
      return await saveFileLocally(file, folder, subfolder);
    }

    // Generar nombre único
    const uniqueFileName = generateUniqueFileName(file.originalname);

    // Construir key (path) del archivo en S3
    const key = subfolder
      ? `${folder}/${subfolder}/${uniqueFileName}`
      : `${folder}/${uniqueFileName}`;

    // Parámetros para subir a S3
    // Nota: No usamos ACL. El acceso público se controla mediante Bucket Policy
    const params = {
      Bucket: s3Config.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      // Subir archivo a S3
      console.log(`🔄 Intentando subir a S3...`);
      console.log(`   Bucket: ${s3Config.bucket}`);
      console.log(`   Region: ${s3Config.region}`);
      console.log(`   Key: ${key}`);

      const command = new PutObjectCommand(params);
      const result = await s3Config.client.send(command);

      // Construir URL del archivo
      const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;

      console.log(`✅ ÉXITO: Archivo subido a S3: ${key}`);
      console.log(`   ETag: ${result.ETag}`);
      console.log(`   URL: ${fileUrl}`);

      return {
        success: true,
        key,
        url: fileUrl,
        bucket: s3Config.bucket,
        fileName: uniqueFileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        mode: 's3',
      };
    } catch (s3Error) {
      // Si falla S3, usar almacenamiento local como fallback
      console.error(`❌ ERROR AL SUBIR A S3:`);
      console.error(`   Error: ${s3Error.message}`);
      console.error(`   Code: ${s3Error.code || 'N/A'}`);
      console.error(`   StatusCode: ${s3Error.$metadata?.httpStatusCode || 'N/A'}`);
      console.error(`   Stack: ${s3Error.stack}`);
      console.log(`⚠️  Usando almacenamiento local como fallback...`);
      return await saveFileLocally(file, folder, subfolder);
    }

  } catch (error) {
    console.error('Error al subir archivo:', error);
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
