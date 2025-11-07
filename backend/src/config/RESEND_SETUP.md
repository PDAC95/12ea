# Configuración de Resend Email Service para Entre Amigas

## Información del Servicio

- **Proveedor:** Resend (resend.com)
- **API Key:** Configurada en `.env` (NO commitear)
- **Email From:** noreply@entreamigas.com
- **Plan:** Free Tier
- **Límite Free Tier:** 3,000 emails/mes

---

## Pasos de Configuración

### 1. Crear Cuenta en Resend

1. Ir a https://resend.com
2. Crear cuenta con email
3. Verificar email de confirmación
4. Acceder al Dashboard

---

### 2. Obtener API Key

1. En el Dashboard, ir a **API Keys**
2. Click en **Create API Key**
3. Nombre: `Entre Amigas Development`
4. Permissions: **Full Access** (o **Sending access** mínimo)
5. Click **Create**
6. Copiar la API Key (empieza con `re_`)
7. Agregar a `backend/.env`:
   ```bash
   RESEND_API_KEY=re_tu_api_key_aqui
   ```

---

### 3. Verificar Dominio (Opcional para Producción)

**Para desarrollo:** NO es necesario verificar dominio. Resend permite enviar emails de prueba sin verificación.

**Para producción:**
1. Dashboard → **Domains**
2. Click **Add Domain**
3. Ingresar dominio: `entreamigas.com`
4. Seguir instrucciones para agregar registros DNS:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **DMARC Record** (TXT)
5. Esperar verificación (5-10 minutos)

---

## Uso del SDK de Resend

### Instalación

```bash
cd backend
npm install resend
```

### Ejemplo Básico

```javascript
// backend/src/services/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to, userName) {
  try {
    const data = await resend.emails.send({
      from: 'Entre Amigas <noreply@entreamigas.com>',
      to: [to],
      subject: '¡Bienvenida a Entre Amigas!',
      html: `
        <h1>¡Hola ${userName}!</h1>
        <p>Bienvenida a nuestra comunidad de mujeres latinas en Canadá.</p>
        <p>Estamos emocionadas de tenerte con nosotras.</p>
      `
    });

    console.log('Email enviado:', data);
    return data;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
}
```

---

## Tipos de Emails del Sistema

### 1. Email de Bienvenida
- **Trigger:** Registro exitoso de usuario
- **Template:** Saludo personalizado + instrucciones iniciales
- **Prioridad:** Alta

### 2. Email de Verificación
- **Trigger:** Registro de nuevo usuario
- **Template:** Link de verificación con token JWT
- **Expiración:** 24 horas
- **Prioridad:** Alta

### 3. Email de Recuperación de Contraseña
- **Trigger:** Usuario solicita reset password
- **Template:** Link de reset con token temporal
- **Expiración:** 1 hora
- **Prioridad:** Alta

### 4. Notificación de Nuevo Evento
- **Trigger:** Usuario sigue categoría y se crea evento
- **Template:** Detalles del evento + link directo
- **Prioridad:** Media

### 5. Notificación de Comentario
- **Trigger:** Alguien comenta en post del usuario
- **Template:** Extracto del comentario + link
- **Prioridad:** Baja

---

## Templates Recomendados

### Estructura Base HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #D97706;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      background-color: #fff;
      padding: 30px;
    }
    .button {
      display: inline-block;
      background-color: #D97706;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Entre Amigas</h1>
    </div>
    <div class="content">
      <!-- Contenido del email aquí -->
    </div>
    <div class="footer">
      <p>Entre Amigas - Comunidad de Mujeres Latinas en Canadá</p>
      <p>Este es un email automático, por favor no respondas.</p>
    </div>
  </div>
</body>
</html>
```

---

## Testing de Emails

### 1. Testing Local

```bash
# Crear archivo de test
touch backend/src/services/email.test.js
```

```javascript
// backend/src/services/email.test.js
import { sendWelcomeEmail } from './email.service.js';

async function testEmail() {
  try {
    await sendWelcomeEmail('tu-email@ejemplo.com', 'María');
    console.log('✅ Email de prueba enviado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail();
```

```bash
# Ejecutar test
node backend/src/services/email.test.js
```

### 2. Verificar en Dashboard

1. Ir a Resend Dashboard → **Emails**
2. Ver historial de emails enviados
3. Ver status: `sent`, `delivered`, `bounced`, etc.
4. Ver logs de errores

---

## Límites y Cuotas

### Free Tier
- **3,000 emails/mes**
- **100 emails/día**
- Sin límite de destinatarios
- Sin límite de dominios

### Paid Plans (si se necesita)
- **Pro:** $20/mes → 50,000 emails/mes
- **Business:** $80/mes → 500,000 emails/mes

### Rate Limiting Recomendado

```javascript
// backend/src/middleware/emailRateLimit.js
import rateLimit from 'express-rate-limit';

export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 emails por hora por IP
  message: 'Demasiados emails enviados. Intenta de nuevo más tarde.'
});
```

---

## Seguridad

### ✅ Buenas Prácticas Implementadas

- ✅ API Key en archivo `.env` (NO commiteado)
- ✅ Rate limiting en endpoints que envían emails
- ✅ Validación de email con Yup antes de enviar
- ✅ No exponer API Key en logs o respuestas
- ✅ Usar templates HTML sanitizados

### ⚠️ NUNCA hacer:

- ❌ Commitear API Key al repositorio
- ❌ Enviar emails sin validación previa
- ❌ Permitir envío masivo sin rate limit
- ❌ Exponer datos sensibles en emails (passwords, tokens completos)
- ❌ Usar emails como único método de verificación crítica

---

## Troubleshooting

### Error: "Invalid API key"
- Verificar que la API Key en `.env` es correcta
- Verificar que la API Key no ha sido revocada
- Regenerar API Key en Dashboard si es necesario

### Error: "Rate limit exceeded"
- Has alcanzado el límite diario (100 emails)
- Espera 24 horas o actualiza a plan pagado
- Considera implementar cola de emails con Bull/BullMQ

### Email no llega a destinatario
- Verificar carpeta de SPAM
- Verificar que el email del destinatario es válido
- Verificar logs en Resend Dashboard
- Para producción: verificar dominio está configurado correctamente

### Error: "Domain not verified"
- Solo aplica en producción con dominio custom
- Seguir pasos de verificación de dominio
- En desarrollo, usar emails sin dominio verificado

---

## Próximos Pasos (Post INFRA-004)

1. **INFRA-006:** Instalar SDK de Resend en backend
   ```bash
   npm install resend
   ```

2. **US-001:** Implementar email de verificación en auth
   - Generar token JWT de verificación
   - Enviar email con link de verificación
   - Crear endpoint para verificar token

3. **US-001:** Implementar email de recuperación de contraseña
   - Generar token temporal
   - Enviar email con link de reset
   - Crear endpoint para reset password

4. **Futuro:** Implementar sistema de plantillas con React Email
   ```bash
   npm install react-email @react-email/components
   ```

---

**Última actualización:** 7 de noviembre, 2025
**Mantenido por:** Equipo Entre Amigas
