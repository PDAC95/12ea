# 📧 Email Service - Resend

Servicio de envío de emails transaccionales usando Resend para la plataforma Entre Amigas.

## 📋 Configuración

### Variables de Entorno Requeridas

```env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@entreamigas.com
FRONTEND_URL=http://localhost:5173
```

### Instalación

Las dependencias ya están instaladas en el proyecto:

```bash
npm install resend
```

## 🚀 Uso

### Importar el Servicio

```javascript
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from './services/email.service.js';
```

### Funciones Disponibles

#### 1. Email de Bienvenida

Envía un email de bienvenida a un nuevo usuario.

```javascript
await sendWelcomeEmail(
  'usuario@example.com',  // Email del destinatario
  'María García'          // Nombre del usuario
);
```

**Características:**
- ✨ Template HTML responsive
- 💜 Diseño con gradiente morado (branding)
- 📱 Botón CTA para explorar la comunidad
- 📋 Lista de características de la plataforma
- 📧 Footer con links legales

---

#### 2. Email de Verificación de Cuenta

Envía un email con un link para verificar la cuenta del usuario.

```javascript
await sendVerificationEmail(
  'usuario@example.com',  // Email del destinatario
  'María García',         // Nombre del usuario
  'token-verificacion'    // Token único de verificación
);
```

**Características:**
- 🔐 Link de verificación con token
- ⚠️ Advertencia de expiración (24 horas)
- 📋 URL completa visible para copiar/pegar
- ✅ Botón CTA principal
- 🔒 Mensaje de seguridad

**Link generado:**
```
http://localhost:5173/verify-email?token=TOKEN_AQUI
```

---

#### 3. Email de Recuperación de Contraseña

Envía un email con un link para resetear la contraseña.

```javascript
await sendPasswordResetEmail(
  'usuario@example.com',  // Email del destinatario
  'María García',         // Nombre del usuario
  'token-reset'           // Token único de reset
);
```

**Características:**
- 🔑 Link de reset con token
- ⚠️ Advertencia de expiración (1 hora)
- 🛡️ Mensaje de seguridad destacado
- 📋 URL completa visible
- 💼 Gradiente rojo/rosado (urgencia)

**Link generado:**
```
http://localhost:5173/reset-password?token=TOKEN_AQUI
```

---

#### 4. Email de Confirmación de Cambio de Contraseña

Envía un email de confirmación después de cambiar la contraseña.

```javascript
await sendPasswordChangedEmail(
  'usuario@example.com',  // Email del destinatario
  'María García'          // Nombre del usuario
);
```

**Características:**
- ✅ Confirmación visual con gradiente verde
- 📅 Fecha y hora del cambio
- ⚠️ Alerta de seguridad si no fue el usuario
- 🆘 Botón para contactar soporte
- 📧 Sin información sensible

---

## 🧪 Testing

### Script de Prueba Simple

Para probar el envío de un email de bienvenida:

```bash
cd backend
node test-email-simple.js
```

### Script de Prueba Completo

Para probar diferentes tipos de emails:

```bash
# Email de bienvenida
node src/scripts/test-email.js dev@jappi.ca welcome

# Email de verificación
node src/scripts/test-email.js dev@jappi.ca verification

# Email de reset de contraseña
node src/scripts/test-email.js dev@jappi.ca reset

# Email de confirmación de cambio
node src/scripts/test-email.js dev@jappi.ca changed

# Todos los emails
node src/scripts/test-email.js dev@jappi.ca all
```

## 📦 Estructura de Respuesta

Todas las funciones retornan una promesa con:

```javascript
{
  success: true,
  emailId: "abc123..." // ID del email en Resend
}
```

## 🛠️ Manejo de Errores

Las funciones lanzan un error si falla el envío:

```javascript
try {
  await sendWelcomeEmail('usuario@example.com', 'Juan Pérez');
  console.log('✅ Email enviado exitosamente');
} catch (error) {
  console.error('❌ Error al enviar email:', error.message);
}
```

## 🎨 Personalización de Templates

Los templates HTML están embebidos en el servicio. Para personalizar:

1. Editar `src/services/email.service.js`
2. Modificar la variable `html` dentro de cada función
3. Mantener el estilo inline para compatibilidad con clientes de email
4. Probar en múltiples clientes (Gmail, Outlook, Apple Mail, etc.)

### Colores del Branding

```css
/* Gradiente principal (morado) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Gradiente secundario (rojo/rosado) */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Gradiente de éxito (verde) */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

## 📚 Documentación Resend

- [Documentación oficial](https://resend.com/docs)
- [Guía de Node.js](https://resend.com/docs/send-with-nodejs)
- [API Reference](https://resend.com/docs/api-reference/introduction)

## 🔐 Seguridad

- ✅ API Key almacenada en variables de entorno
- ✅ Validación de variables al inicializar
- ✅ Tokens de verificación únicos y con expiración
- ✅ Links con protocolo HTTPS en producción
- ✅ Sin información sensible en logs

## 📊 Monitoreo

Los emails enviados se pueden monitorear en el dashboard de Resend:
https://resend.com/emails

**Métricas disponibles:**
- Emails enviados
- Tasa de entrega
- Bounces (rebotes)
- Quejas de spam
- Aperturas (si está habilitado el tracking)

## 🚨 Troubleshooting

### Email no llega

1. **Revisar spam/junk:** Los emails pueden llegar a spam inicialmente
2. **Verificar dominio:** Asegurarse de que el dominio esté verificado en Resend
3. **Check API key:** Verificar que la API key sea válida
4. **Ver logs:** Revisar los logs de Resend dashboard

### Variables de entorno no cargadas

Si ves el error `RESEND_API_KEY no está definida`:

1. Verificar que el archivo `.env` existe
2. Verificar que las variables están correctamente definidas
3. El servicio carga automáticamente `.env` al importarse

### Testing en desarrollo

Para testing local, puedes usar emails de prueba:
- dev@jappi.ca (configurado en el proyecto)
- Tu email personal

## 📝 Changelog

### v1.0.0 (2025-01-07)

- ✅ Configuración inicial de Resend
- ✅ Email de bienvenida con template HTML
- ✅ Email de verificación de cuenta
- ✅ Email de recuperación de contraseña
- ✅ Email de confirmación de cambio de contraseña
- ✅ Scripts de testing
- ✅ Documentación completa

## 👥 Contacto

Para soporte o preguntas sobre el servicio de email:
- Email: dev@jappi.ca
- Proyecto: Entre Amigas
