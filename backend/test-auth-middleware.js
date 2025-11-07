// Script para probar el middleware de autenticación
// Uso: node test-auth-middleware.js

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar servicios y middleware
import { generateAuthToken, generateRefreshToken } from './src/services/token.service.js';
import { protect, authorize, optionalAuth, requireVerified, requireOwnership } from './src/middleware/auth.middleware.js';

/**
 * Mock de request/response de Express para testing
 */
const createMockRequest = (headers = {}, params = {}, user = null) => ({
  headers,
  params,
  user,
});

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    jsonData: null,
  };

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data) => {
    res.jsonData = data;
    return res;
  };

  return res;
};

const testAuthMiddleware = async () => {
  console.log('\n🧪 Prueba de Auth Middleware\n');
  console.log('=' .repeat(60));

  let testsPass = 0;
  let testsFail = 0;

  // Generar tokens de prueba
  const userId = '507f1f77bcf86cd799439011';
  const validAuthToken = generateAuthToken(userId, { role: 'user', email: 'user@example.com' });
  const validAdminToken = generateAuthToken(userId, { role: 'admin', email: 'admin@example.com' });
  const refreshToken = generateRefreshToken(userId);
  const invalidToken = 'invalid_token_123';

  console.log('\n📋 Tokens generados para testing:');
  console.log(`   - Valid Auth Token: ${validAuthToken.substring(0, 30)}...`);
  console.log(`   - Valid Admin Token: ${validAdminToken.substring(0, 30)}...`);
  console.log(`   - Refresh Token: ${refreshToken.substring(0, 30)}...`);
  console.log(`   - Invalid Token: ${invalidToken}\n`);

  // ==========================================
  // TEST 1: protect() - Sin token
  // ==========================================
  console.log('1️⃣  protect() - Request sin token (debe fallar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest();
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);

    if (res.statusCode === 401 && res.jsonData.code === 'NO_TOKEN' && !nextCalled) {
      console.log('✅ PASS: Retornó 401 sin token');
      testsPass++;
    } else {
      console.log('❌ FAIL: No retornó 401 correctamente');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 2: protect() - Token válido
  // ==========================================
  console.log('2️⃣  protect() - Request con token válido (debe pasar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${validAuthToken}` });
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);

    if (nextCalled && req.user && req.user.id === userId) {
      console.log('✅ PASS: Token válido, next() llamado, req.user asignado');
      console.log(`   Usuario autenticado: ${req.user.id} (${req.user.email})`);
      testsPass++;
    } else {
      console.log('❌ FAIL: No funcionó correctamente con token válido');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 3: protect() - Token inválido
  // ==========================================
  console.log('3️⃣  protect() - Request con token inválido (debe fallar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${invalidToken}` });
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);

    if (res.statusCode === 401 && res.jsonData.code === 'INVALID_TOKEN' && !nextCalled) {
      console.log('✅ PASS: Retornó 401 con token inválido');
      testsPass++;
    } else {
      console.log('❌ FAIL: No manejó token inválido correctamente');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 4: protect() - Refresh token (tipo incorrecto)
  // ==========================================
  console.log('4️⃣  protect() - Request con refresh token (debe fallar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${refreshToken}` });
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);

    if (res.statusCode === 401 && res.jsonData.code === 'INVALID_TOKEN_TYPE' && !nextCalled) {
      console.log('✅ PASS: Rechazó refresh token correctamente');
      testsPass++;
    } else {
      console.log('❌ FAIL: No rechazó refresh token');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 5: authorize() - Usuario con rol correcto
  // ==========================================
  console.log('5️⃣  authorize("admin") - Usuario admin (debe pasar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${validAdminToken}` });
    const res = createMockResponse();

    // Primero ejecutar protect para autenticar
    await protect(req, res, () => {});

    // Luego ejecutar authorize
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    const authMiddleware = authorize('admin');
    authMiddleware(req, res, next);

    if (nextCalled && res.statusCode !== 403) {
      console.log('✅ PASS: Usuario admin autorizado correctamente');
      testsPass++;
    } else {
      console.log('❌ FAIL: Usuario admin no fue autorizado');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 6: authorize() - Usuario sin rol requerido
  // ==========================================
  console.log('6️⃣  authorize("admin") - Usuario normal (debe fallar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${validAuthToken}` });
    const res = createMockResponse();

    // Primero ejecutar protect
    await protect(req, res, () => {});

    // Luego ejecutar authorize
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    const authMiddleware = authorize('admin');
    authMiddleware(req, res, next);

    if (res.statusCode === 403 && res.jsonData.code === 'INSUFFICIENT_PERMISSIONS' && !nextCalled) {
      console.log('✅ PASS: Usuario sin permisos rechazado con 403');
      testsPass++;
    } else {
      console.log('❌ FAIL: No rechazó usuario sin permisos');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 7: authorize() - Múltiples roles
  // ==========================================
  console.log('7️⃣  authorize("admin", "moderator") - Usuario normal (debe fallar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${validAuthToken}` });
    const res = createMockResponse();

    await protect(req, res, () => {});

    let nextCalled = false;
    const next = () => { nextCalled = true; };
    const authMiddleware = authorize('admin', 'moderator');
    authMiddleware(req, res, next);

    if (res.statusCode === 403 && !nextCalled) {
      console.log('✅ PASS: Usuario sin ninguno de los roles requeridos rechazado');
      testsPass++;
    } else {
      console.log('❌ FAIL: No manejó múltiples roles correctamente');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 8: optionalAuth() - Sin token (debe pasar)
  // ==========================================
  console.log('8️⃣  optionalAuth() - Request sin token (debe pasar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest();
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await optionalAuth(req, res, next);

    if (nextCalled && req.user === null) {
      console.log('✅ PASS: Continuó sin token, req.user es null');
      testsPass++;
    } else {
      console.log('❌ FAIL: No manejó ausencia de token correctamente');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 9: optionalAuth() - Con token válido
  // ==========================================
  console.log('9️⃣  optionalAuth() - Request con token válido (debe pasar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest({ authorization: `Bearer ${validAuthToken}` });
    const res = createMockResponse();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await optionalAuth(req, res, next);

    if (nextCalled && req.user && req.user.id === userId) {
      console.log('✅ PASS: Autenticó usuario opcional correctamente');
      console.log(`   Usuario autenticado: ${req.user.id}`);
      testsPass++;
    } else {
      console.log('❌ FAIL: No autenticó usuario opcional');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // TEST 10: requireOwnership() - Usuario es propietario
  // ==========================================
  console.log('🔟 requireOwnership() - Usuario es propietario (debe pasar)');
  console.log('-'.repeat(60));
  try {
    const req = createMockRequest(
      { authorization: `Bearer ${validAuthToken}` },
      { userId }
    );
    const res = createMockResponse();

    // Primero autenticar
    await protect(req, res, () => {});

    // Verificar ownership
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    const ownershipMiddleware = requireOwnership('userId');
    ownershipMiddleware(req, res, next);

    if (nextCalled && res.statusCode !== 403) {
      console.log('✅ PASS: Usuario propietario autorizado');
      testsPass++;
    } else {
      console.log('❌ FAIL: Usuario propietario no autorizado');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }
  console.log('');

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log('=' .repeat(60));
  console.log(`\n📊 Resultados de Testing:\n`);
  console.log(`   ✅ Tests exitosos: ${testsPass}/10`);
  console.log(`   ❌ Tests fallidos: ${testsFail}/10`);

  if (testsFail === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!\n');
    console.log('📋 Middlewares probados:');
    console.log('   ✅ protect() - Autenticación requerida');
    console.log('   ✅ authorize() - Verificación de roles');
    console.log('   ✅ optionalAuth() - Autenticación opcional');
    console.log('   ✅ requireOwnership() - Verificación de propiedad');
    console.log('\n✨ Auth Middleware está listo para usar!\n');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa la implementación.\n');
    process.exit(1);
  }
};

// Ejecutar tests
testAuthMiddleware().catch(error => {
  console.error('\n❌ Error crítico en testing:', error);
  process.exit(1);
});
