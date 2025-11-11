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
  const subject = '¡Bienvenida a Entre Amigas! 🌸';

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          color: #667eea;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          margin: 16px 0;
          font-size: 16px;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .features {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .features ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .features li {
          margin: 8px 0;
          color: #555555;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          color: #888888;
          font-size: 14px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Entre Amigas</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>¡Bienvenida a <strong>Entre Amigas</strong>! 🎉</p>
          <p>
            Estamos muy emocionadas de que formes parte de nuestra comunidad de mujeres migrantes.
            Este es un espacio creado para apoyarnos, conectarnos y crecer juntas.
          </p>

          <div class="features">
            <p><strong>En Entre Amigas podrás:</strong></p>
            <ul>
              <li>✨ Conectar con otras mujeres que comparten tu experiencia</li>
              <li>📅 Participar en eventos y actividades comunitarias</li>
              <li>💼 Descubrir negocios locales de otras mujeres migrantes</li>
              <li>📰 Leer historias inspiradoras en nuestro blog</li>
              <li>🤝 Acceder a recursos y apoyo para tu proceso migratorio</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="${emailConfig.frontendUrl}" class="cta-button">
              Explorar la Comunidad
            </a>
          </p>

          <p>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
            ¡Estamos aquí para apoyarte! 💜
          </p>

          <p>
            Con cariño,<br>
            <strong>El equipo de Entre Amigas</strong>
          </p>
        </div>
        <div class="footer">
          <p>
            © ${new Date().getFullYear()} Entre Amigas. Todos los derechos reservados.
          </p>
          <p>
            <a href="${emailConfig.frontendUrl}/privacy">Política de Privacidad</a> |
            <a href="${emailConfig.frontendUrl}/terms">Términos de Uso</a>
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
  const subject = 'Verifica tu cuenta - Entre Amigas 🔐';

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          color: #667eea;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          margin: 16px 0;
          font-size: 16px;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .alert-box {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert-box p {
          margin: 5px 0;
          font-size: 14px;
          color: #856404;
        }
        .token-box {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 14px;
          word-break: break-all;
          margin: 15px 0;
          border: 1px dashed #cccccc;
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
          <h1>🔐 Verificación de Cuenta</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>
            Gracias por registrarte en <strong>Entre Amigas</strong>.
            Para completar tu registro y acceder a todas las funciones de la comunidad,
            necesitamos verificar tu dirección de correo electrónico.
          </p>

          <p style="text-align: center;">
            <a href="${verificationUrl}" class="cta-button">
              ✅ Verificar mi cuenta
            </a>
          </p>

          <div class="alert-box">
            <p><strong>⚠️ Importante:</strong></p>
            <p>Este enlace es válido por <strong>24 horas</strong>. Si no verificas tu cuenta en ese tiempo, deberás solicitar un nuevo enlace de verificación.</p>
          </div>

          <p><strong>¿No puedes hacer clic en el botón?</strong></p>
          <p>Copia y pega el siguiente enlace en tu navegador:</p>
          <div class="token-box">
            ${verificationUrl}
          </div>

          <p>
            Si no creaste esta cuenta, puedes ignorar este email de forma segura.
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

// Export default con todas las funciones
export default {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};
