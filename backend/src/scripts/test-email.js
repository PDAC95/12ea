import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from '../services/email.service.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde la raíz del backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Script para probar el servicio de email con Resend
 * Uso: node src/scripts/test-email.js <email-destino> <tipo-email>
 *
 * Tipos de email disponibles:
 * - welcome: Email de bienvenida
 * - verification: Email de verificación de cuenta
 * - reset: Email de recuperación de contraseña
 * - changed: Email de confirmación de cambio de contraseña
 * - all: Enviar todos los emails (para testing completo)
 *
 * Ejemplo:
 * node src/scripts/test-email.js dev@jappi.ca welcome
 * node src/scripts/test-email.js dev@jappi.ca all
 */

const testEmail = async () => {
  // Obtener argumentos de línea de comandos
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('❌ Uso: node src/scripts/test-email.js <email-destino> <tipo-email>');
    console.log('\nTipos de email disponibles:');
    console.log('  - welcome: Email de bienvenida');
    console.log('  - verification: Email de verificación de cuenta');
    console.log('  - reset: Email de recuperación de contraseña');
    console.log('  - changed: Email de confirmación de cambio de contraseña');
    console.log('  - all: Enviar todos los emails');
    console.log('\nEjemplo:');
    console.log('  node src/scripts/test-email.js dev@jappi.ca welcome');
    console.log('  node src/scripts/test-email.js dev@jappi.ca all');
    process.exit(1);
  }

  const emailTo = args[0];
  const emailType = args[1].toLowerCase();

  console.log('\n🧪 Iniciando prueba de servicio de email...\n');
  console.log(`📧 Email destino: ${emailTo}`);
  console.log(`📨 Tipo de email: ${emailType}\n`);

  try {
    // Datos de prueba
    const testName = 'María García';
    const testToken = 'test-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    switch (emailType) {
      case 'welcome':
        console.log('📤 Enviando email de bienvenida...');
        const welcomeResult = await sendWelcomeEmail(emailTo, testName);
        console.log('✅ Email de bienvenida enviado:', welcomeResult);
        break;

      case 'verification':
        console.log('📤 Enviando email de verificación...');
        const verificationResult = await sendVerificationEmail(emailTo, testName, testToken);
        console.log('✅ Email de verificación enviado:', verificationResult);
        break;

      case 'reset':
        console.log('📤 Enviando email de recuperación de contraseña...');
        const resetResult = await sendPasswordResetEmail(emailTo, testName, testToken);
        console.log('✅ Email de recuperación enviado:', resetResult);
        break;

      case 'changed':
        console.log('📤 Enviando email de confirmación de cambio de contraseña...');
        const changedResult = await sendPasswordChangedEmail(emailTo, testName);
        console.log('✅ Email de confirmación enviado:', changedResult);
        break;

      case 'all':
        console.log('📤 Enviando TODOS los tipos de email...\n');

        console.log('1️⃣ Email de bienvenida...');
        const r1 = await sendWelcomeEmail(emailTo, testName);
        console.log('   ✅ Enviado:', r1.emailId, '\n');

        // Esperar 2 segundos entre cada email
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('2️⃣ Email de verificación...');
        const r2 = await sendVerificationEmail(emailTo, testName, testToken);
        console.log('   ✅ Enviado:', r2.emailId, '\n');

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('3️⃣ Email de recuperación de contraseña...');
        const r3 = await sendPasswordResetEmail(emailTo, testName, testToken);
        console.log('   ✅ Enviado:', r3.emailId, '\n');

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('4️⃣ Email de confirmación de cambio de contraseña...');
        const r4 = await sendPasswordChangedEmail(emailTo, testName);
        console.log('   ✅ Enviado:', r4.emailId, '\n');

        console.log('✅ Todos los emails enviados exitosamente!');
        break;

      default:
        console.error(`❌ Tipo de email no válido: "${emailType}"`);
        console.log('Tipos válidos: welcome, verification, reset, changed, all');
        process.exit(1);
    }

    console.log('\n✅ Prueba completada exitosamente!');
    console.log('🔍 Revisa tu bandeja de entrada:', emailTo);
    console.log('📬 No olvides revisar la carpeta de spam si no ves el email.\n');

  } catch (error) {
    console.error('\n❌ Error durante la prueba:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Ejecutar prueba
testEmail();
