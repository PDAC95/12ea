// Script de debugging para Resend
import dotenv from 'dotenv';
dotenv.config();

import { Resend } from 'resend';

const testResendDirect = async () => {
  console.log('\n🔍 Debugging Resend API\n');
  console.log('📧 Configuración:');
  console.log(`   - API Key: ${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : '❌ NO configurada'}`);
  console.log(`   - Email From: ${process.env.EMAIL_FROM}`);
  console.log(`   - Email To: pdmckinster@gmail.com\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no configurada');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('📤 Enviando email de prueba...\n');

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: ['pdmckinster@gmail.com'],
      subject: 'Test Email - Entre Amigas',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #FF69B4;">🌸 Test Email</h1>
          <p>Este es un email de prueba desde Entre Amigas.</p>
          <p>Si recibes este email, significa que Resend está funcionando correctamente.</p>
          <p style="color: #666; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      console.error('Detalles completos:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('✅ Respuesta de Resend:');
    console.log('   - data:', data);
    console.log('   - data.id:', data?.id);
    console.log('\nRespuesta completa (JSON):');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n🔍 Revisa tu inbox: pdmckinster@gmail.com');
    console.log('💡 Si no ves el email, revisa spam\n');
  } catch (error) {
    console.error('\n❌ Error al enviar:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

testResendDirect();
