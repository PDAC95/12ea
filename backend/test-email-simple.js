// Script simple para probar el servicio de email
// Este script se ejecuta desde la raíz del backend
// Uso: node test-email-simple.js

import dotenv from 'dotenv';

// Cargar variables de entorno PRIMERO
dotenv.config();

// Ahora importar los servicios
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from './src/services/email.service.js';

const testEmail = async () => {
  console.log('\n🧪 Prueba de Servicio de Email con Resend\n');
  console.log('📧 Variables de entorno:');
  console.log(`   - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ NO configurada'}`);
  console.log(`   - EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ NO configurado'}`);
  console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ NO configurado'}\n`);

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.error('❌ Faltan variables de entorno necesarias');
    process.exit(1);
  }

  const emailTo = 'pdmckinster@gmail.com';
  const testName = 'Patricio (Test)';
  const testToken = 'test-token-' + Date.now();

  try {
    console.log('📤 Enviando email de bienvenida a:', emailTo);
    const result = await sendWelcomeEmail(emailTo, testName);
    console.log('✅ Email enviado exitosamente!');
    console.log('📬 ID del email:', result.emailId);
    console.log('\n🔍 Revisa tu bandeja de entrada:', emailTo);
    console.log('💡 Si no ves el email, revisa la carpeta de spam\n');
  } catch (error) {
    console.error('\n❌ Error al enviar email:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
};

testEmail();
