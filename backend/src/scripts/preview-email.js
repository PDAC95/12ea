import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para generar preview HTML de emails
 * Uso: node src/scripts/preview-email.js [tipo]
 *
 * Tipos disponibles:
 * - verification (default)
 * - welcome
 */

// Datos de prueba
const testData = {
  name: 'María García',
  email: 'maria.garcia@example.com',
  token: 'test-token-123456789',
  frontendUrl: 'https://entreamigas.ca',
};

// Template de Verification Email - ACTUALIZADO CON DISEÑO DE LANDING
const getVerificationEmailHTML = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #fef5f8 0%, #f9f6fe 100%);
          margin: 0;
          padding: 40px 20px;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px -5px rgba(240, 86, 140, 0.15), 0 20px 25px -5px rgba(160, 118, 231, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #f0568c 0%, #a076e7 100%);
          padding: 48px 40px;
          text-align: center;
          color: #ffffff;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        }
        .logo {
          position: relative;
          z-index: 1;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background-color: white;
          border-radius: 20px;
          padding: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .header h1 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header p {
          position: relative;
          z-index: 1;
          margin: 12px 0 0;
          font-size: 15px;
          opacity: 0.95;
          font-weight: 500;
        }
        .content {
          padding: 48px 40px;
          color: #1a202c;
        }
        .greeting {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 20px;
        }
        .content p {
          margin: 20px 0;
          font-size: 16px;
          color: #4a5568;
          line-height: 1.8;
        }
        .content strong {
          color: #2d3748;
          font-weight: 600;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(135deg, #f0568c 0%, #a076e7 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(240, 86, 140, 0.35), 0 4px 12px rgba(160, 118, 231, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .alert-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 5px solid #f59e0b;
          padding: 24px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }
        .alert-box strong {
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
        }
        .alert-box p {
          margin: 0;
          font-size: 15px;
          color: #78350f;
          line-height: 1.7;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent);
          margin: 40px 0;
        }
        .footer {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          padding: 40px;
          text-align: center;
          color: #cbd5e0;
        }
        .footer-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .footer-tagline {
          color: #a0aec0;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .footer p {
          margin: 8px 0;
          font-size: 14px;
          color: #a0aec0;
        }
        .footer a {
          color: #f0568c;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #de3370;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #f0568c;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header con Logo -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>Verificación de Cuenta</h1>
          <p>Estás a un paso de unirte a nuestra comunidad</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">¡Hola ${name}!</h2>

          <p>
            Gracias por registrarte en <strong>Entre Amigas</strong>, la comunidad de mujeres hispanas en Canadá.
            Estamos muy emocionadas de que formes parte de este espacio <span class="heart">💜</span>
          </p>

          <p>
            Para completar tu registro y acceder a todas las funciones de la plataforma,
            necesitamos verificar tu dirección de correo electrónico.
          </p>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${verificationUrl}" class="cta-button">
              ✅ Verificar mi Cuenta
            </a>
          </div>

          <!-- Alert Box -->
          <div class="alert-box">
            <strong>⏰ Tiempo límite</strong>
            <p>
              Este enlace es válido por <strong>24 horas</strong>. Si no verificas tu cuenta en ese tiempo,
              deberás solicitar un nuevo enlace de verificación desde la página de login.
            </p>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Si no creaste esta cuenta, puedes ignorar este email de forma segura.
            Tu información no será utilizada sin tu consentimiento.
          </p>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            Con cariño,<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💜</span></strong>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Entre Amigas</div>
          <p class="footer-tagline">Comunidad de mujeres hispanas en Canadá</p>

          <p style="margin: 20px 0;">
            Conecta con mujeres que comparten tu experiencia migratoria.<br>
            Encuentra apoyo, amistad y oportunidades.
          </p>

          <p style="margin-top: 24px; font-size: 13px;">
            © ${new Date().getFullYear()} Entre Amigas. Todos los derechos reservados.
          </p>

          <div class="footer-links">
            <a href="https://entreamigas.ca/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="https://entreamigas.ca/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="https://entreamigas.ca/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template de Welcome Email - CON DISEÑO DE LANDING
const getWelcomeEmailHTML = (name, dashboardUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
      <style>
        ${getVerificationEmailHTML('', '').match(/<style>([\s\S]*?)<\/style>/)[1]}
        .features {
          background: linear-gradient(135deg, #f0f9ff 0%, #fef3f8 100%);
          border-left: 5px solid #14b8a6;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.1);
        }
        .features strong {
          color: #0f766e;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .features ul {
          margin: 0;
          padding-left: 20px;
          list-style: none;
        }
        .features li {
          margin: 12px 0;
          font-size: 15px;
          color: #134e4a;
          line-height: 1.7;
          padding-left: 8px;
        }
        .features li::before {
          content: '✨ ';
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header con Logo -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>¡Bienvenida!</h1>
          <p>Tu cuenta está activa y lista para conectar</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">¡Hola ${name}!</h2>

          <p>
            ¡Bienvenida a <strong>Entre Amigas</strong>! <span class="heart">💜</span>
          </p>

          <p>
            Estamos muy emocionadas de que formes parte de nuestra comunidad de mujeres hispanas en Canadá.
            Este es un espacio creado para apoyarnos, conectarnos y crecer juntas.
          </p>

          <!-- Features Box -->
          <div class="features">
            <strong>En Entre Amigas podrás:</strong>
            <ul>
              <li>Conectar con otras mujeres que comparten tu experiencia migratoria</li>
              <li>Participar en eventos y actividades comunitarias</li>
              <li>Descubrir negocios y servicios de otras mujeres migrantes</li>
              <li>Leer historias inspiradoras en nuestro blog</li>
              <li>Acceder a recursos y apoyo para tu proceso migratorio</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${dashboardUrl}" class="cta-button">
              🚀 Explorar la Comunidad
            </a>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
            ¡Estamos aquí para apoyarte!
          </p>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            Con cariño,<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💜</span></strong>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Entre Amigas</div>
          <p class="footer-tagline">Comunidad de mujeres hispanas en Canadá</p>

          <p style="margin: 20px 0;">
            Conecta con mujeres que comparten tu experiencia migratoria.<br>
            Encuentra apoyo, amistad y oportunidades.
          </p>

          <p style="margin-top: 24px; font-size: 13px;">
            © ${new Date().getFullYear()} Entre Amigas. Todos los derechos reservados.
          </p>

          <div class="footer-links">
            <a href="https://entreamigas.ca/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="https://entreamigas.ca/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="https://entreamigas.ca/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Función principal
const generatePreview = (type = 'verification') => {
  let html = '';
  let filename = '';

  const verificationUrl = `${testData.frontendUrl}/verify-email/${testData.token}`;
  const dashboardUrl = `${testData.frontendUrl}/dashboard`;

  switch (type) {
    case 'verification':
      html = getVerificationEmailHTML(testData.name, verificationUrl);
      filename = 'email-preview-verification.html';
      break;

    case 'welcome':
      html = getWelcomeEmailHTML(testData.name, dashboardUrl);
      filename = 'email-preview-welcome.html';
      break;

    default:
      console.error(`❌ Tipo de email no reconocido: "${type}"`);
      console.log('Tipos disponibles: verification, welcome');
      process.exit(1);
  }

  // Guardar archivo
  const outputPath = path.join(__dirname, '../../', filename);
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log('\n✅ Preview generado exitosamente!');
  console.log(`📄 Archivo: ${filename}`);
  console.log(`📂 Ubicación: ${outputPath}`);
  console.log('\n🌐 Para ver el preview:');
  console.log(`   1. Abre el archivo en tu navegador`);
  console.log(`   2. O ejecuta: start ${filename}\n`);
};

// Ejecutar
const emailType = process.argv[2] || 'verification';
generatePreview(emailType);
