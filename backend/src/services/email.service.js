import resend, { emailConfig } from '../config/email.js';

/**
 * Email Service - Entre Amigas
 * Servicio para envío de emails transaccionales usando Resend
 */

/**
 * Enviar email genérico
 * @param {Object} options - Opciones del email
 * @param {string} options.to - Email destinatario
 * @param {string} options.subject - Asunto del email
 * @param {string} options.html - Contenido HTML del email
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
      reply_to: emailConfig.replyTo,
    });

    console.log('✅ Email enviado exitosamente:', data.id);
    return {
      success: true,
      emailId: data.id,
    };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw new Error(`Error al enviar email: ${error.message}`);
  }
};

/**
 * Enviar email de bienvenida
 * @param {string} to - Email del usuario
 * @param {string} name - Nombre del usuario
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendWelcomeEmail = async (to, name) => {
  const subject = '¡Bienvenida a Entre Amigas!';

  const html = `
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
            <a href="${emailConfig.frontendUrl}/dashboard" class="cta-button">
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de verificación de cuenta
 * @param {string} to - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} verificationToken - Token de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendVerificationEmail = async (to, name, verificationToken) => {
  const verificationUrl = `${emailConfig.frontendUrl}/verify-email/${verificationToken}`;
  const subject = 'Verifica tu cuenta - Entre Amigas';

  const html = `
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de recuperación de contraseña
 * @param {string} to - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} resetToken - Token para resetear contraseña
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendPasswordResetEmail = async (to, name, resetToken) => {
  const resetUrl = `${emailConfig.frontendUrl}/reset-password/${resetToken}`;
  const subject = 'Recuperación de contraseña - Entre Amigas 🔑';

  // Log para debugging (eliminar en producción)
  console.log('🔗 URL de reset generada:', resetUrl);
  console.log('🔑 Token:', resetToken);

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperación de Contraseña - Entre Amigas</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #f3e8ff 100%);
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
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15), 0 8px 24px rgba(236, 72, 153, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          padding: 60px 40px;
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
          animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .header-icon {
          font-size: 72px;
          margin-bottom: 20px;
          display: block;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 48px 40px;
          color: #1a202c;
        }
        .logo-text {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 32px;
          display: inline-block;
        }
        .content h2 {
          color: #2d3748;
          font-size: 26px;
          margin-bottom: 20px;
          font-weight: 700;
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
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35), 0 4px 12px rgba(139, 92, 246, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(236, 72, 153, 0.45), 0 6px 16px rgba(139, 92, 246, 0.35);
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
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-left: 5px solid #3b82f6;
          padding: 24px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
        .info-box strong {
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
        }
        .info-box p {
          margin: 0;
          font-size: 15px;
          color: #1e3a8a;
          line-height: 1.7;
        }
        .secondary-cta {
          text-align: center;
          margin: 24px 0;
        }
        .secondary-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          color: #4a5568 !important;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .secondary-button:hover {
          background: #ffffff;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }
        .help-text {
          text-align: center;
          font-size: 14px;
          color: #718096;
          margin: 20px 0;
          font-style: italic;
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
          color: #ec4899;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #f472b6;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #ec4899;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header Premium -->
        <div class="header">
          <div class="badge">
            ✨ Entre Amigas
          </div>
          <span class="header-icon">🔐</span>
          <h1>Recuperación de Contraseña</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="logo-text">Entre Amigas</div>

          <h2>¡Hola ${name}!</h2>

          <p>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en
            <strong>Entre Amigas</strong>. No te preocupes, estamos aquí para ayudarte <span class="heart">💜</span>
          </p>

          <p>
            Haz clic en el botón de abajo para crear tu nueva contraseña de forma segura:
          </p>

          <!-- CTA Button Premium -->
          <div class="cta-container">
            <a href="${resetUrl}" class="cta-button">
              🔑 Restablecer mi Contraseña
            </a>
          </div>

          <!-- Alert Box Premium -->
          <div class="alert-box">
            <strong>⏰ Tiempo límite</strong>
            <p>
              Este enlace es válido por <strong>1 hora</strong> por razones de seguridad.
              Si expira, puedes solicitar uno nuevo fácilmente desde la página de login.
            </p>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <!-- Secondary CTA -->
          <p class="help-text">¿El botón no funciona?</p>
          <div class="secondary-cta">
            <a href="${resetUrl}" class="secondary-button">
              📋 Copiar enlace alternativo
            </a>
          </div>

          <!-- Security Info Premium -->
          <div class="info-box">
            <strong>🛡️ Nota de Seguridad</strong>
            <p>
              Si <strong>NO</strong> solicitaste este cambio, puedes ignorar este email de forma segura.
              Tu contraseña actual permanecerá sin cambios. Si sospechas actividad inusual en tu cuenta,
              contáctanos inmediatamente.
            </p>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            Con cariño,<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💜</span></strong>
          </p>
        </div>

        <!-- Footer Premium -->
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de confirmación de cambio de contraseña
 * @param {string} to - Email del usuario
 * @param {string} name - Nombre del usuario
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendPasswordChangedEmail = async (to, name) => {
  const subject = 'Tu contraseña ha sido cambiada - Entre Amigas ✅';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          padding: 40px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: #11998e;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          margin: 16px 0;
          font-size: 16px;
        }
        .success-box {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .success-box p {
          margin: 5px 0;
          font-size: 14px;
          color: #155724;
        }
        .security-box {
          background-color: #ffe8e8;
          border-left: 4px solid #f5576c;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .security-box p {
          margin: 5px 0;
          font-size: 14px;
          color: #721c24;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          color: #888888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Contraseña Cambiada</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>

          <div class="success-box">
            <p><strong>✅ Contraseña actualizada exitosamente</strong></p>
            <p>Tu contraseña de <strong>Entre Amigas</strong> ha sido cambiada correctamente.</p>
          </div>

          <p>
            Este es un email de confirmación para informarte que la contraseña de tu cuenta
            ha sido modificada el día <strong>${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</strong>.
          </p>

          <div class="security-box">
            <p><strong>⚠️ ¿No fuiste tú?</strong></p>
            <p>
              Si <strong>NO</strong> realizaste este cambio, contacta inmediatamente a nuestro
              equipo de soporte para proteger tu cuenta.
            </p>
          </div>

          <p style="text-align: center;">
            <a href="${emailConfig.frontendUrl}/contact" class="cta-button">
              Contactar Soporte
            </a>
          </p>

          <p>
            Saludos,<br>
            <strong>El equipo de Entre Amigas</strong>
          </p>
        </div>
        <div class="footer">
          <p>
            © ${new Date().getFullYear()} Entre Amigas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de confirmación de registro a evento
 * @param {string} to - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} event - Datos del evento
 * @param {Object} registration - Datos del registro
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendEventConfirmationEmail = async (to, userName, event, registration) => {
  const subject = `✅ Confirmación de registro: ${event.title}`;

  // Formatear fecha y hora
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determinar icono por modalidad
  const modeIcon = {
    virtual: '💻',
    presencial: '📍',
    híbrido: '🔄'
  }[event.mode] || '📅';

  // Determinar color por modalidad
  const modeColor = {
    virtual: '#3b82f6',
    presencial: '#10b981',
    híbrido: '#8b5cf6'
  }[event.mode] || '#667eea';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Evento - Entre Amigas</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #f3e8ff 100%);
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
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15), 0 8px 24px rgba(236, 72, 153, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, ${modeColor} 0%, #ec4899 100%);
          padding: 60px 40px;
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
          animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .header-icon {
          font-size: 72px;
          margin-bottom: 20px;
          display: block;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 48px 40px;
          color: #1a202c;
        }
        .logo-text {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 32px;
          display: inline-block;
        }
        .content h2 {
          color: #2d3748;
          font-size: 26px;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .content p {
          margin: 20px 0;
          font-size: 16px;
          color: #4a5568;
          line-height: 1.8;
        }
        .event-card {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-left: 5px solid ${modeColor};
          padding: 32px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .event-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .event-details {
          display: grid;
          gap: 16px;
        }
        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .detail-icon {
          font-size: 20px;
          min-width: 28px;
          text-align: center;
        }
        .detail-content {
          flex: 1;
        }
        .detail-label {
          font-size: 13px;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 16px;
          color: #2d3748;
          font-weight: 500;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(135deg, ${modeColor} 0%, #ec4899 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35), 0 4px 12px rgba(139, 92, 246, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(236, 72, 153, 0.45), 0 6px 16px rgba(139, 92, 246, 0.35);
        }
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-left: 5px solid #3b82f6;
          padding: 24px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
        .info-box strong {
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
        }
        .info-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #1e3a8a;
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
          color: #ec4899;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #f472b6;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #ec4899;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }
        .mode-badge {
          display: inline-block;
          padding: 6px 14px;
          background: ${modeColor};
          color: white;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header Premium -->
        <div class="header">
          <div class="badge">
            ✨ Entre Amigas
          </div>
          <span class="header-icon">🎉</span>
          <h1>¡Registro Confirmado!</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="logo-text">Entre Amigas</div>

          <h2>¡Hola ${userName}!</h2>

          <p>
            ¡Excelentes noticias! Tu registro al evento ha sido confirmado exitosamente.
            Nos emociona mucho que formes parte de esta experiencia <span class="heart">💜</span>
          </p>

          <!-- Event Card -->
          <div class="event-card">
            <div class="event-title">
              ${modeIcon} ${event.title}
            </div>

            <div class="event-details">
              <div class="detail-row">
                <span class="detail-icon">📅</span>
                <div class="detail-content">
                  <div class="detail-label">Fecha</div>
                  <div class="detail-value">${formattedDate}</div>
                </div>
              </div>

              <div class="detail-row">
                <span class="detail-icon">🕒</span>
                <div class="detail-content">
                  <div class="detail-label">Hora</div>
                  <div class="detail-value">${event.time}</div>
                </div>
              </div>

              <div class="detail-row">
                <span class="detail-icon">${modeIcon}</span>
                <div class="detail-content">
                  <div class="detail-label">Modalidad</div>
                  <div class="detail-value">
                    <span class="mode-badge">${event.mode}</span>
                  </div>
                </div>
              </div>

              ${event.location ? `
              <div class="detail-row">
                <span class="detail-icon">📍</span>
                <div class="detail-content">
                  <div class="detail-label">Ubicación</div>
                  <div class="detail-value">${event.location}</div>
                </div>
              </div>
              ` : ''}

              ${event.link ? `
              <div class="detail-row">
                <span class="detail-icon">🔗</span>
                <div class="detail-content">
                  <div class="detail-label">Enlace de acceso</div>
                  <div class="detail-value">
                    <a href="${event.link}" style="color: ${modeColor}; text-decoration: underline;">${event.link}</a>
                  </div>
                </div>
              </div>
              ` : ''}
            </div>
          </div>

          <!-- CTA Button Premium -->
          <div class="cta-container">
            <a href="${emailConfig.frontendUrl}/events/${event._id}" class="cta-button">
              📝 Ver Detalles del Evento
            </a>
          </div>

          <!-- Info Box Premium -->
          <div class="info-box">
            <strong>💡 Recordatorios Importantes</strong>
            <p>
              • Recibirás un recordatorio 24 horas antes del evento<br>
              • Puedes cancelar tu registro desde tu perfil si cambias de planes<br>
              • Si tienes preguntas, contáctanos en cualquier momento
            </p>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            ¡Nos vemos pronto!<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💜</span></strong>
          </p>
        </div>

        <!-- Footer Premium -->
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/events">Ver Eventos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de aprobación de evento
 * @param {string} to - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} event - Datos del evento aprobado
 * @returns {Promise<Object>} Resultado del envío
 * Sprint 5 - Task 5.10.3
 */
export const sendEventApprovalEmail = async (to, userName, event) => {
  const subject = `✅ ¡Tu evento ha sido aprobado! - ${event.title}`;

  // Formatear fecha
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
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
          box-shadow: 0 10px 40px -5px rgba(16, 185, 129, 0.15), 0 20px 25px -5px rgba(59, 130, 246, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
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
        .header-icon {
          font-size: 72px;
          margin-bottom: 20px;
          display: block;
          position: relative;
          z-index: 1;
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
        .success-box {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-left: 5px solid #10b981;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }
        .success-box strong {
          color: #065f46;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .success-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #064e3b;
          line-height: 1.7;
        }
        .event-details {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
        }
        .event-details p {
          margin: 8px 0;
          font-size: 15px;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35), 0 4px 12px rgba(59, 130, 246, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
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
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #34d399;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #10b981;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>¡Evento Aprobado!</h1>
          <p>Tu evento ha sido publicado exitosamente</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">¡Hola ${userName}! 🎉</h2>

          <div class="success-box">
            <strong>✅ ¡Excelentes noticias!</strong>
            <p>
              Tu evento <strong>"${event.title}"</strong> ha sido aprobado por nuestro equipo
              y ahora está publicado en la plataforma.
            </p>
          </div>

          <p>
            Gracias por contribuir a nuestra comunidad de <strong>Entre Amigas</strong>.
            Tu evento ya está visible para todas las usuarias y pueden registrarse.
          </p>

          <div class="event-details">
            <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
            <p><strong>🕒 Hora:</strong> ${event.time}</p>
            <p><strong>📍 Modalidad:</strong> ${event.mode}</p>
            ${event.location ? `<p><strong>📌 Ubicación:</strong> ${event.location}</p>` : ''}
            ${event.link ? `<p><strong>🔗 Link:</strong> ${event.link}</p>` : ''}
          </div>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${emailConfig.frontendUrl}/events/${event._id}" class="cta-button">
              👀 Ver mi Evento Publicado
            </a>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Puedes gestionar tu evento desde el panel de administración.
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            ¡Gracias por ser parte de nuestra comunidad!<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💚</span></strong>
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💚</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de rechazo de evento
 * @param {string} to - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} event - Datos del evento rechazado
 * @param {string} reason - Motivo del rechazo
 * @returns {Promise<Object>} Resultado del envío
 * Sprint 5 - Task 5.10.3
 */
export const sendEventRejectionEmail = async (to, userName, event, reason) => {
  const subject = `📋 Actualización sobre tu propuesta de evento - ${event.title}`;

  // Formatear fecha
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
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
          box-shadow: 0 10px 40px -5px rgba(245, 158, 11, 0.15), 0 20px 25px -5px rgba(249, 115, 22, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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
        .warning-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 5px solid #f59e0b;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }
        .warning-box strong {
          color: #92400e;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .warning-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #78350f;
          line-height: 1.7;
        }
        .reason-box {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
          border-left: 4px solid #6b7280;
        }
        .reason-box strong {
          display: block;
          margin-bottom: 12px;
          color: #1f2937;
          font-size: 16px;
        }
        .reason-box p {
          margin: 0;
          font-size: 15px;
          color: #374151;
          font-style: italic;
        }
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-left: 5px solid #3b82f6;
          padding: 24px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
        .info-box strong {
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
        }
        .info-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #1e3a8a;
          line-height: 1.7;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35), 0 4px 12px rgba(249, 115, 22, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
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
          color: #f59e0b;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #fbbf24;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #f59e0b;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>Actualización de Propuesta</h1>
          <p>Revisión de tu evento propuesto</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">Hola ${userName},</h2>

          <p>
            Gracias por tu interés en organizar un evento en <strong>Entre Amigas</strong>.
            Hemos revisado tu propuesta para el evento <strong>"${event.title}"</strong>.
          </p>

          <div class="warning-box">
            <strong>📋 Estado de la Propuesta</strong>
            <p>
              Después de revisar cuidadosamente tu propuesta, en este momento no podemos aprobar
              el evento para publicación en la plataforma.
            </p>
          </div>

          <div class="reason-box">
            <strong>💬 Motivo de la decisión:</strong>
            <p>"${reason}"</p>
          </div>

          <div class="info-box">
            <strong>💡 ¿Qué puedes hacer?</strong>
            <p>
              • Puedes revisar los detalles del evento y ajustarlos según la retroalimentación<br>
              • Si tienes preguntas sobre esta decisión, contáctanos directamente<br>
              • Estamos aquí para ayudarte a organizar eventos exitosos en el futuro
            </p>
          </div>

          <p style="margin-top: 32px;">
            <strong>Detalles del evento propuesto:</strong>
          </p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 16px 0;">
            <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
            <p><strong>🕒 Hora:</strong> ${event.time}</p>
            <p><strong>📍 Modalidad:</strong> ${event.mode}</p>
          </div>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${emailConfig.frontendUrl}/contact" class="cta-button">
              💬 Contactar al Equipo
            </a>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Valoramos tu participación en nuestra comunidad y esperamos poder trabajar contigo
            en futuros eventos que beneficien a todas nuestras miembros.
          </p>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            Con aprecio,<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">🧡</span></strong>
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">🧡</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

// Export default con todas las funciones
/**
 * Enviar email de aprobación de negocio
 * @param {string} to - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} business - Datos del negocio aprobado
 * @returns {Promise<Object>} Resultado del envío
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const sendBusinessApprovalEmail = async (to, userName, business) => {
  const subject = `✅ ¡Tu negocio ha sido aprobado! - ${business.name}`;

  const html = `
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
          box-shadow: 0 10px 40px -5px rgba(16, 185, 129, 0.15), 0 20px 25px -5px rgba(59, 130, 246, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
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
        .success-box {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-left: 5px solid #10b981;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }
        .success-box strong {
          color: #065f46;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .success-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #064e3b;
          line-height: 1.7;
        }
        .business-details {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
        }
        .business-details p {
          margin: 8px 0;
          font-size: 15px;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35), 0 4px 12px rgba(59, 130, 246, 0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
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
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #34d399;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #10b981;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>¡Negocio Aprobado!</h1>
          <p>Tu negocio ha sido publicado exitosamente</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">¡Hola ${userName}! 🎉</h2>

          <div class="success-box">
            <strong>✅ ¡Excelentes noticias!</strong>
            <p>
              Tu negocio <strong>"${business.name}"</strong> ha sido aprobado por nuestro equipo
              y ahora está publicado en el directorio de negocios.
            </p>
          </div>

          <p>
            Gracias por contribuir a nuestra comunidad de <strong>Entre Amigas</strong>.
            Tu negocio ya está visible para todas las usuarias en la plataforma.
          </p>

          <div class="business-details">
            <p><strong>📍 Ciudad:</strong> ${business.city}</p>
            <p><strong>🏷️ Categoría:</strong> ${business.category}</p>
          </div>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${emailConfig.frontendUrl}/businesses/${business._id}" class="cta-button">
              👀 Ver mi Negocio Publicado
            </a>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Puedes gestionar tu negocio desde tu panel de usuario.
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>

          <p style="margin-top: 32px; text-align: center; font-size: 15px;">
            ¡Gracias por ser parte de nuestra comunidad!<br>
            <strong style="font-size: 17px;">El equipo de Entre Amigas <span class="heart">💚</span></strong>
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💚</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Enviar email de rechazo de negocio
 * @param {string} to - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} business - Datos del negocio rechazado
 * @param {string} reason - Motivo del rechazo
 * @returns {Promise<Object>} Resultado del envío
 * Sistema de Propuesta de Negocios - PLAN-BUSINESS-PROPOSAL-SYSTEM
 */
export const sendBusinessRejectionEmail = async (to, userName, business, reason) => {
  const subject = `📋 Actualización sobre tu propuesta de negocio - ${business.name}`;

  const html = `
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
          box-shadow: 0 10px 40px -5px rgba(251, 113, 133, 0.15), 0 20px 25px -5px rgba(249, 115, 22, 0.1);
        }
        .header {
          position: relative;
          background: linear-gradient(135deg, #fb7185 0%, #f97316 100%);
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
        .warning-box {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-left: 5px solid #ef4444;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
        }
        .warning-box strong {
          color: #7f1d1d;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .warning-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #991b1b;
          line-height: 1.7;
        }
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-left: 5px solid #3b82f6;
          padding: 28px;
          margin: 32px 0;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
        .info-box strong {
          color: #1e3a8a;
          display: block;
          margin-bottom: 16px;
          font-size: 17px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .info-box p {
          margin: 8px 0;
          font-size: 15px;
          color: #1e40af;
          line-height: 1.7;
        }
        .reason-box {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
          border: 2px solid #e5e7eb;
        }
        .reason-box strong {
          color: #374151;
          display: block;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .reason-box p {
          margin: 0;
          font-size: 15px;
          color: #6b7280;
          font-style: italic;
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
          color: #fb7185;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer a:hover {
          color: #f43f5e;
        }
        .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .heart {
          display: inline-block;
          color: #fb7185;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <img src="https://entre-amigas-dev.s3.us-east-1.amazonaws.com/temp/logo.png" alt="Entre Amigas Logo" />
          </div>
          <h1>Actualización de Propuesta</h1>
          <p>Revisión de tu negocio</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 class="greeting">Hola ${userName},</h2>

          <p>
            Gracias por tu interés en formar parte del directorio de negocios de <strong>Entre Amigas</strong>.
            Hemos revisado tu propuesta de negocio <strong>"${business.name}"</strong>.
          </p>

          <div class="warning-box">
            <strong>📋 Estado de tu propuesta</strong>
            <p>
              Lamentablemente, en este momento no podemos aprobar tu negocio para su publicación
              en nuestro directorio.
            </p>
          </div>

          <div class="reason-box">
            <strong>💬 Motivo del rechazo:</strong>
            <p>"${reason}"</p>
          </div>

          <div class="info-box">
            <strong>💡 ¿Qué puedes hacer ahora?</strong>
            <p>
              Puedes revisar la información de tu negocio y realizar los cambios necesarios
              según el motivo indicado arriba. Luego, puedes enviar una nueva propuesta
              desde tu panel de usuario.
            </p>
          </div>

          <p>
            Estamos comprometidas a mantener la calidad de nuestro directorio para beneficio
            de toda la comunidad. Si tienes dudas sobre este rechazo, no dudes en contactarnos.
          </p>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${emailConfig.frontendUrl}/dashboard/businesses" class="cta-button">
              🔄 Enviar Nueva Propuesta
            </a>
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <p style="font-size: 14px; color: #718096;">
            Apreciamos tu comprensión y esperamos contar con tu negocio en nuestra plataforma pronto.
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
            <a href="${emailConfig.frontendUrl}/privacy">Privacidad</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/terms">Términos</a>
            <span style="color: #4a5568; margin: 0 8px;">·</span>
            <a href="${emailConfig.frontendUrl}/contact">Contacto</a>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #718096;">
            Hecho con <span class="heart">💜</span> en Canadá
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEventConfirmationEmail,
  sendEventApprovalEmail,
  sendEventRejectionEmail,
  sendBusinessApprovalEmail,
  sendBusinessRejectionEmail,
};
