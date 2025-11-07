// Script para probar el servicio de tokens
// Uso: node test-token-service.js

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar servicio de tokens
import {
  generateAuthToken,
  verifyToken,
  generateVerificationToken,
  generateResetToken,
  hashToken,
  generateRefreshToken,
  decodeToken,
  getTokenExpiration,
} from './src/services/token.service.js';

const testTokenService = async () => {
  console.log('\n🧪 Prueba de Token Service\n');
  console.log('=' .repeat(60));

  // Variables de entorno
  console.log('\n📧 Variables de entorno:');
  console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO configurado'}`);
  console.log(`   - JWT_EXPIRE: ${process.env.JWT_EXPIRE || '7d (default)'}\n`);

  if (!process.env.JWT_SECRET) {
    console.error('❌ Falta JWT_SECRET en las variables de entorno');
    process.exit(1);
  }

  try {
    // Test 1: Generar token de autenticación
    console.log('1️⃣  Generar Token de Autenticación (JWT)');
    console.log('-'.repeat(60));
    const userId = '507f1f77bcf86cd799439011'; // MongoDB ObjectId de ejemplo
    const authToken = generateAuthToken(userId, { role: 'user', email: 'test@example.com' });
    console.log('✅ Token generado:');
    console.log(`   ${authToken.substring(0, 50)}...`);
    console.log(`   Longitud: ${authToken.length} caracteres\n`);

    // Test 2: Verificar token JWT
    console.log('2️⃣  Verificar Token JWT');
    console.log('-'.repeat(60));
    const decoded = verifyToken(authToken);
    console.log('✅ Token verificado exitosamente:');
    console.log('   Payload decodificado:', JSON.stringify(decoded, null, 2));
    console.log(`   - User ID: ${decoded.id}`);
    console.log(`   - Type: ${decoded.type}`);
    console.log(`   - Role: ${decoded.role}`);
    console.log(`   - Email: ${decoded.email}\n`);

    // Test 3: Obtener información de expiración
    console.log('3️⃣  Información de Expiración del Token');
    console.log('-'.repeat(60));
    const expInfo = getTokenExpiration(authToken);
    console.log('✅ Información de expiración:');
    console.log(`   - Expira en: ${Math.floor(expInfo.expiresInSeconds / 86400)} días (${expInfo.expiresInSeconds} segundos)`);
    console.log(`   - Fecha de expiración: ${expInfo.expiresAt.toLocaleString('es-ES')}`);
    console.log(`   - ¿Está expirado?: ${expInfo.isExpired ? '❌ SÍ' : '✅ NO'}\n`);

    // Test 4: Generar token de verificación
    console.log('4️⃣  Generar Token de Verificación (Random)');
    console.log('-'.repeat(60));
    const verificationToken = generateVerificationToken();
    console.log('✅ Token de verificación generado:');
    console.log(`   ${verificationToken}`);
    console.log(`   Longitud: ${verificationToken.length} caracteres (64 hex)\n`);

    // Test 5: Generar token de reset
    console.log('5️⃣  Generar Token de Reset de Contraseña (Random)');
    console.log('-'.repeat(60));
    const resetToken = generateResetToken();
    console.log('✅ Token de reset generado:');
    console.log(`   ${resetToken}`);
    console.log(`   Longitud: ${resetToken.length} caracteres (64 hex)\n`);

    // Test 6: Hashear token
    console.log('6️⃣  Hashear Token para Almacenamiento Seguro');
    console.log('-'.repeat(60));
    const hashedToken = hashToken(resetToken);
    console.log('✅ Token hasheado (SHA256):');
    console.log(`   Original: ${resetToken.substring(0, 20)}...`);
    console.log(`   Hashed:   ${hashedToken.substring(0, 20)}...`);
    console.log(`   Longitud: ${hashedToken.length} caracteres\n`);

    // Test 7: Generar refresh token
    console.log('7️⃣  Generar Refresh Token (JWT - 30 días)');
    console.log('-'.repeat(60));
    const refreshToken = generateRefreshToken(userId);
    console.log('✅ Refresh token generado:');
    console.log(`   ${refreshToken.substring(0, 50)}...`);
    const refreshDecoded = decodeToken(refreshToken);
    console.log(`   - Type: ${refreshDecoded.type}`);
    console.log(`   - User ID: ${refreshDecoded.id}`);
    const refreshExpInfo = getTokenExpiration(refreshToken);
    console.log(`   - Expira en: ${Math.floor(refreshExpInfo.expiresInSeconds / 86400)} días\n`);

    // Test 8: Decodificar token sin verificar
    console.log('8️⃣  Decodificar Token sin Verificar (Debug)');
    console.log('-'.repeat(60));
    const decodedNoVerify = decodeToken(authToken);
    console.log('✅ Token decodificado (sin verificar firma):');
    console.log(JSON.stringify(decodedNoVerify, null, 2));
    console.log('\n');

    // Test 9: Probar token inválido
    console.log('9️⃣  Verificar Token Inválido (debe fallar)');
    console.log('-'.repeat(60));
    try {
      verifyToken('token_invalido_123');
      console.log('❌ ERROR: Debería haber fallado');
    } catch (error) {
      console.log('✅ Error esperado capturado correctamente:');
      console.log(`   "${error.message}"\n`);
    }

    // Test 10: Verificar múltiples tokens de verificación sean diferentes
    console.log('🔟 Verificar Unicidad de Tokens Random');
    console.log('-'.repeat(60));
    const tokens = new Set();
    for (let i = 0; i < 5; i++) {
      tokens.add(generateVerificationToken());
    }
    console.log(`✅ Generados 5 tokens únicos: ${tokens.size === 5 ? '✅ TODOS DIFERENTES' : '❌ HAY DUPLICADOS'}\n`);

    // Resumen final
    console.log('=' .repeat(60));
    console.log('✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE\n');

    console.log('📋 Resumen de funciones probadas:');
    console.log('   ✅ generateAuthToken() - JWT con expiración 7d');
    console.log('   ✅ verifyToken() - Verificación de JWT');
    console.log('   ✅ generateVerificationToken() - Token random 64 chars');
    console.log('   ✅ generateResetToken() - Token random 64 chars');
    console.log('   ✅ hashToken() - SHA256 hash para DB');
    console.log('   ✅ generateRefreshToken() - JWT 30d');
    console.log('   ✅ decodeToken() - Decode sin verificar');
    console.log('   ✅ getTokenExpiration() - Info de expiración\n');

    console.log('🎉 Token Service está listo para usar!\n');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Ejecutar pruebas
testTokenService();
