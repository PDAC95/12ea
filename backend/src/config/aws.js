import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar cliente de S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configuración de S3
export const s3Config = {
  client: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION,
};

// Estructura de carpetas en S3
export const S3_FOLDERS = {
  USERS: 'users',
  EVENTS: 'events',
  BUSINESSES: 'businesses',
  BLOG: 'blog',
  TEMP: 'temp',
};

// Tipos de archivos permitidos
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
};

// Límites de tamaño
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  DEFAULT: 5 * 1024 * 1024, // 5MB
};

export default s3Client;
