import { sendPasswordResetEmail } from './src/services/email.service.js';

/**
 * Script de prueba para email de recuperación de contraseña
 * Ejecutar: node test-password-reset-email.js
 */

const testEmail = async () => {
  try {
    console.log('📧 Enviando email de prueba de recuperación de contraseña...\n');

    const result = await sendPasswordResetEmail(
      'patricio@ac95.ca',
      'Patricio',
      'test-reset-token-123456'
    );

    console.log('✅ Email enviado exitosamente!');
    console.log('📨 ID del email:', result.emailId);
    console.log('\n📬 Revisa tu bandeja de entrada en patricio@ac95.ca');
    console.log('🎨 El email ahora tiene el diseño similar a la landing page');
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    process.exit(1);
  }
};

testEmail();
