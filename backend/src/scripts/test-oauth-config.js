import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

/**
 * Script de diagnóstico para Google OAuth
 * Verifica que toda la configuración esté correcta
 */

console.log('\n🔍 DIAGNÓSTICO DE GOOGLE OAUTH\n');
console.log('='.repeat(60));

// 1. Verificar variables de entorno
console.log('\n1️⃣ Variables de Entorno:');
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL',
  'JWT_SECRET',
];

let envOk = true;
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`);
  } else {
    console.log(`   ❌ ${varName}: NO CONFIGURADA`);
    envOk = false;
  }
});

// 2. Verificar formato de credenciales
console.log('\n2️⃣ Validación de Credenciales:');
if (process.env.GOOGLE_CLIENT_ID?.includes('.apps.googleusercontent.com')) {
  console.log('   ✅ Client ID tiene formato correcto');
} else {
  console.log('   ❌ Client ID no tiene formato correcto');
  envOk = false;
}

if (process.env.GOOGLE_CLIENT_SECRET?.startsWith('GOCSPX-')) {
  console.log('   ✅ Client Secret tiene formato correcto');
} else {
  console.log('   ❌ Client Secret no tiene formato correcto');
  envOk = false;
}

// 3. Verificar URLs
console.log('\n3️⃣ Configuración de URLs:');
console.log(`   Frontend URL: ${process.env.FRONTEND_URL}`);
console.log(`   Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
console.log(`   CORS Origin: ${process.env.CORS_ORIGIN}`);

// 4. Verificar que Passport pueda importarse
console.log('\n4️⃣ Importaciones de Passport:');
try {
  const passport = await import('passport');
  console.log('   ✅ passport importado correctamente');
} catch (error) {
  console.log('   ❌ Error al importar passport:', error.message);
  envOk = false;
}

try {
  const { Strategy } = await import('passport-google-oauth20');
  console.log('   ✅ passport-google-oauth20 importado correctamente');
} catch (error) {
  console.log('   ❌ Error al importar passport-google-oauth20:', error.message);
  envOk = false;
}

// 5. Verificar configuración de Passport
console.log('\n5️⃣ Configuración de Passport:');
try {
  const passportConfig = await import('../config/passport.js');
  console.log('   ✅ Configuración de Passport cargada correctamente');
} catch (error) {
  console.log('   ❌ Error al cargar configuración de Passport:', error.message);
  envOk = false;
}

// 6. Conectar a base de datos y verificar modelo User
console.log('\n6️⃣ Modelo de Usuario:');
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('   ✅ Conexión a MongoDB exitosa');

  const User = (await import('../models/User.js')).default;

  // Verificar que el modelo tenga los campos de OAuth
  const userSchema = User.schema.obj;
  const oauthFields = ['googleId', 'authProvider', 'profileImage'];

  oauthFields.forEach((field) => {
    if (userSchema[field]) {
      console.log(`   ✅ Campo ${field} existe en el modelo`);
    } else {
      console.log(`   ❌ Campo ${field} NO existe en el modelo`);
      envOk = false;
    }
  });

  await mongoose.connection.close();
  console.log('   ✅ Conexión a MongoDB cerrada');
} catch (error) {
  console.log('   ❌ Error con base de datos:', error.message);
  envOk = false;
}

// 7. Resumen final
console.log('\n' + '='.repeat(60));
if (envOk) {
  console.log('\n✅ DIAGNÓSTICO EXITOSO - Google OAuth está correctamente configurado\n');
  console.log('📋 PRÓXIMOS PASOS PARA PROBAR:');
  console.log('   1. Iniciar el backend: npm run dev');
  console.log('   2. Iniciar el frontend: npm run dev');
  console.log('   3. Ir a http://localhost:8080/register');
  console.log('   4. Hacer clic en "Continuar con Google"');
  console.log('   5. Deberías ser redirigido a la página de login de Google\n');
  console.log('🔗 URLS IMPORTANTES:');
  console.log(`   - OAuth Start: http://localhost:8000/api/v1/auth/google`);
  console.log(`   - OAuth Callback: ${process.env.GOOGLE_CALLBACK_URL}`);
  console.log(`   - Frontend Callback: ${process.env.FRONTEND_URL}/auth/callback\n`);
} else {
  console.log('\n❌ DIAGNÓSTICO FALLIDO - Revisa los errores anteriores\n');
  process.exit(1);
}

process.exit(0);
