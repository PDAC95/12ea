import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno si no están cargadas
if (!process.env.RESEND_API_KEY) {
  dotenv.config();
}

/**
 * Configuración de Resend Email Service
 * Documentación: https://resend.com/docs/send-with-nodejs
 */

// Validar que exista la API key
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY no está definida en las variables de entorno');
}

// Validar que exista el email de origen
if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM no está definido en las variables de entorno');
}

// Inicializar Resend con API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de emails
export const emailConfig = {
  from: process.env.EMAIL_FROM,
  replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validar conexión con Resend (opcional - solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('📧 Resend Email Service configurado');
  console.log(`📮 Email remitente: ${emailConfig.from}`);
}

export default resend;
