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
  const verificationUrl = `${emailConfig.frontendUrl}/verify-email?token=${verificationToken}`;
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
  const resetUrl = `${emailConfig.frontendUrl}/reset-password?token=${resetToken}`;
  const subject = 'Recuperación de contraseña - Entre Amigas 🔑';

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
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
          color: #f5576c;
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
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .alert-box {
          background-color: #ffe8e8;
          border-left: 4px solid #f5576c;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert-box p {
          margin: 5px 0;
          font-size: 14px;
          color: #721c24;
        }
        .security-box {
          background-color: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .security-box p {
          margin: 5px 0;
          font-size: 14px;
          color: #0d47a1;
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
          <h1>🔑 Recuperación de Contraseña</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en
            <strong>Entre Amigas</strong>.
          </p>

          <p>
            Si fuiste tú quien solicitó esto, haz clic en el siguiente botón para crear
            una nueva contraseña:
          </p>

          <p style="text-align: center;">
            <a href="${resetUrl}" class="cta-button">
              🔐 Restablecer Contraseña
            </a>
          </p>

          <div class="alert-box">
            <p><strong>⚠️ Importante:</strong></p>
            <p>Este enlace es válido por <strong>1 hora</strong>. Después de ese tiempo, deberás solicitar un nuevo enlace de recuperación.</p>
          </div>

          <p><strong>¿No puedes hacer clic en el botón?</strong></p>
          <p>Copia y pega el siguiente enlace en tu navegador:</p>
          <div class="token-box">
            ${resetUrl}
          </div>

          <div class="security-box">
            <p><strong>🛡️ Seguridad:</strong></p>
            <p>
              Si <strong>NO</strong> solicitaste este cambio, ignora este email y tu contraseña
              permanecerá sin cambios. Te recomendamos cambiar tu contraseña desde tu cuenta
              por seguridad.
            </p>
          </div>

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
