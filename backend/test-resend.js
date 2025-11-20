/**
 * Script de prueba para verificar configuración de Resend
 * Sprint 5 - Task 5.1.1
 *
 * Uso:
 * node test-resend.js
 */

import dotenv from 'dotenv';
import resend, { emailConfig } from './src/config/email.js';

// Cargar variables de entorno
dotenv.config();

console.log('\n========================================');
console.log('🧪 TEST DE CONFIGURACIÓN DE RESEND');
console.log('========================================\n');

// Paso 1: Verificar variables de entorno
console.log('📋 PASO 1: Verificando variables de entorno...\n');

const requiredVars = {
  'RESEND_API_KEY': process.env.RESEND_API_KEY,
  'EMAIL_FROM': process.env.EMAIL_FROM,
  'EMAIL_REPLY_TO': process.env.EMAIL_REPLY_TO,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'NODE_ENV': process.env.NODE_ENV,
};

let allVarsPresent = true;

Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    // Ocultar API key por seguridad
    const displayValue = key === 'RESEND_API_KEY'
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  } else {
    console.log(`❌ ${key}: NO CONFIGURADA`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ ERROR: Faltan variables de entorno requeridas');
  console.log('📝 Copia .env.example a .env y configura las variables faltantes\n');
  process.exit(1);
}

console.log('\n✅ Todas las variables de entorno están configuradas\n');

// Paso 2: Verificar configuración de email
console.log('📋 PASO 2: Verificando configuración de email...\n');
console.log(`📧 Email remitente: ${emailConfig.from}`);
console.log(`↩️  Email reply-to: ${emailConfig.replyTo}`);
console.log(`🌐 Frontend URL: ${emailConfig.frontendUrl}`);

// Paso 3: Test de envío
console.log('\n📋 PASO 3: Enviando email de prueba...\n');

const testEmail = {
  to: 'pdmckinster@gmail.com',
  from: emailConfig.from,
  subject: '🧪 Test de Configuración - Entre Amigas',
  html: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #f0568c 0%, #a076e7 100%);
          padding: 40px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
          color: #1a202c;
        }
        .content h2 {
          color: #2d3748;
          font-size: 22px;
          margin-bottom: 20px;
        }
        .content p {
          margin: 16px 0;
          font-size: 16px;
          color: #4a5568;
          line-height: 1.6;
        }
        .info-box {
          background-color: #edf2f7;
          border-left: 4px solid #14b8a6;
          padding: 20px;
          margin: 24px 0;
          border-radius: 8px;
        }
        .info-box strong {
          color: #0f766e;
          display: block;
          margin-bottom: 8px;
        }
        .info-box ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        .info-box li {
          margin: 6px 0;
          font-size: 14px;
          color: #134e4a;
        }
        .footer {
          background-color: #1a202c;
          padding: 30px;
          text-align: center;
          color: #a0aec0;
          font-size: 14px;
        }
        .success {
          color: #10b981;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧪 Test de Configuración</h1>
        </div>

        <div class="content">
          <h2>¡Email de Prueba Exitoso!</h2>

          <p class="success">✅ El servicio de Resend está funcionando correctamente.</p>

          <p>
            Este es un email de prueba para verificar que la configuración de Resend
            está correctamente implementada en el backend de Entre Amigas.
          </p>

          <div class="info-box">
            <strong>📋 Información de la Prueba:</strong>
            <ul>
              <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
              <li><strong>Email remitente:</strong> ${emailConfig.from}</li>
              <li><strong>Email reply-to:</strong> ${emailConfig.replyTo}</li>
              <li><strong>Frontend URL:</strong> ${emailConfig.frontendUrl}</li>
              <li><strong>Entorno:</strong> ${process.env.NODE_ENV || 'development'}</li>
            </ul>
          </div>

          <p>
            Si recibiste este email, significa que:
          </p>
          <ul>
            <li>✅ La API key de Resend es válida</li>
            <li>✅ El dominio está verificado</li>
            <li>✅ Las variables de entorno están correctamente configuradas</li>
            <li>✅ El servicio de email está listo para producción</li>
          </ul>

          <p style="margin-top: 32px; text-align: center;">
            <strong>Sprint 5 - Task 5.1.1</strong><br>
            Verificación de Configuración de Resend
          </p>
        </div>

        <div class="footer">
          <p>Entre Amigas - Test de Configuración</p>
          <p>© ${new Date().getFullYear()} Entre Amigas. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  reply_to: emailConfig.replyTo,
};

console.log(`📧 Enviando a: ${testEmail.to}`);
console.log(`📮 Desde: ${testEmail.from}`);
console.log(`📨 Asunto: ${testEmail.subject}\n`);

try {
  const result = await resend.emails.send(testEmail);

  console.log('\n========================================');
  console.log('✅ EMAIL ENVIADO EXITOSAMENTE');
  console.log('========================================\n');

  // Log del resultado completo para debugging
  console.log('📊 Resultado completo:', JSON.stringify(result, null, 2));

  if (result && result.data && result.data.id) {
    console.log(`\n🆔 ID del email: ${result.data.id}`);
  } else if (result && result.id) {
    console.log(`\n🆔 ID del email: ${result.id}`);
  }

  console.log(`📧 Destinatario: ${testEmail.to}`);
  console.log('\n📝 SIGUIENTE PASO:');
  console.log('1. Revisa tu bandeja de entrada en pdmckinster@gmail.com');
  console.log('2. Si no lo ves, revisa la carpeta de spam');
  console.log('3. Verifica el contenido del email');
  console.log('\n✅ Task 5.1.1 - COMPLETADA');
  console.log('📋 Próxima tarea: Task 5.1.2 (EmailVerificationToken model)\n');

} catch (error) {
  console.log('\n========================================');
  console.log('❌ ERROR AL ENVIAR EMAIL');
  console.log('========================================\n');
  console.log(`🚨 Error: ${error.message}\n`);

  // Diagnóstico del error
  if (error.message.includes('Domain not verified')) {
    console.log('📋 SOLUCIÓN:');
    console.log('1. Ve a https://resend.com/domains');
    console.log('2. Verifica que el dominio "entreamigas.ca" esté verificado');
    console.log('3. Si está "Pending", configura los records DNS en tu proveedor de dominio');
    console.log('4. Espera la propagación DNS (5-30 minutos)');
  } else if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
    console.log('📋 SOLUCIÓN:');
    console.log('1. Ve a https://resend.com/api-keys');
    console.log('2. Verifica que tu API key esté activa');
    console.log('3. Si está revocada, crea una nueva API key');
    console.log('4. Actualiza RESEND_API_KEY en tu archivo .env');
  } else if (error.message.includes('Quota exceeded')) {
    console.log('📋 SOLUCIÓN:');
    console.log('1. Ve a https://resend.com/overview');
    console.log('2. Verifica tu cuota de emails');
    console.log('3. Espera 24 horas (reset diario)');
    console.log('4. O considera upgrade a plan Pro');
  } else {
    console.log('📋 TROUBLESHOOTING:');
    console.log('1. Verifica todas las variables de entorno');
    console.log('2. Revisa los logs de Resend: https://resend.com/emails');
    console.log('3. Consulta la documentación: https://resend.com/docs');
  }

  console.log('\n❌ Task 5.1.1 - PENDIENTE');
  console.log('📝 Resuelve el error antes de continuar\n');
  process.exit(1);
}
