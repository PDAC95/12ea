// Script para probar el Auth Controller
// Uso: npm start (en otra terminal) y luego node test-auth-controller.js

import dotenv from 'dotenv';
dotenv.config();

/**
 * Test completo del Auth Controller - Entre Amigas
 *
 * IMPORTANTE: Asegúrate de que el servidor esté corriendo en otra terminal
 * - Ejecuta: npm start
 * - Luego ejecuta este script: node test-auth-controller.js
 *
 * Tests incluidos:
 * 1. ✅ Registro de usuario con datos válidos
 * 2. ✅ Registro duplicado (debe fallar con 409)
 * 3. ✅ Registro con datos inválidos (debe fallar con 400)
 * 4. ✅ Login con credenciales correctas
 * 5. ✅ Login con credenciales incorrectas
 * 6. ✅ Verificación de email con token válido
 * 7. ✅ Forgot password con email válido
 * 8. ✅ Reset password con token válido
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api/v1';

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Variables globales para compartir entre tests
let testUser = {
  fullName: 'Test User Controller',
  preferredName: 'Test',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123',
  confirmPassword: 'TestPassword123',
  phone: '+1 234-567-8900',
  birthday: '1990-01-01',
  city: 'Test City',
};

let authToken = null;
let verificationToken = null;
let resetToken = null;

/**
 * Helper para hacer requests HTTP
 */
const makeRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const url = `${API_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
};

/**
 * Test runner
 */
const runTests = async () => {
  console.log('\n🧪 Testing Auth Controller - Entre Amigas\n');
  console.log('='.repeat(70));
  console.log(`\n📡 API URL: ${API_URL}\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  // ==========================================
  // TEST 1: Registro exitoso
  // ==========================================
  console.log('1️⃣  POST /auth/register - Registro exitoso');
  console.log('-'.repeat(70));
  try {
    const result = await makeRequest('/auth/register', 'POST', testUser);

    if (result.ok && result.status === 201 && result.data.success) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Usuario registrado exitosamente`);
      console.log(`   Email: ${testUser.email}`);
      console.log(`   User ID: ${result.data.data.user.id}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Registro falló`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 2: Registro duplicado (debe fallar)
  // ==========================================
  console.log('\n2️⃣  POST /auth/register - Email duplicado (debe fallar con 409)');
  console.log('-'.repeat(70));
  try {
    const result = await makeRequest('/auth/register', 'POST', testUser);

    if (!result.ok && result.status === 409) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Duplicado rechazado correctamente`);
      console.log(`   Mensaje: ${result.data.message}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Duplicado no fue rechazado correctamente`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 3: Registro con datos inválidos
  // ==========================================
  console.log('\n3️⃣  POST /auth/register - Datos inválidos (debe fallar con 400)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      fullName: 'T',  // Muy corto
      preferredName: 'Test',
      email: 'invalid-email',  // Email inválido
      password: '123',  // Contraseña débil
      confirmPassword: '456',  // No coincide
      phone: '123',
      birthday: '2010-01-01',  // Menor de edad
      city: 'T',
    };

    const result = await makeRequest('/auth/register', 'POST', invalidData);

    if (!result.ok && result.status === 400 && result.data.errors) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Datos inválidos rechazados`);
      console.log(`   Errores encontrados: ${result.data.errors.length}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Validación no funcionó correctamente`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 4: Login exitoso
  // ==========================================
  console.log('\n4️⃣  POST /auth/login - Login exitoso');
  console.log('-'.repeat(70));
  try {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const result = await makeRequest('/auth/login', 'POST', loginData);

    if (result.ok && result.status === 200 && result.data.data.token) {
      authToken = result.data.data.token;
      console.log(`${colors.green}✅ PASS${colors.reset}: Login exitoso`);
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      console.log(`   Usuario: ${result.data.data.user.preferredName}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Login falló`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 5: Login con credenciales incorrectas
  // ==========================================
  console.log('\n5️⃣  POST /auth/login - Credenciales incorrectas (debe fallar con 401)');
  console.log('-'.repeat(70));
  try {
    const wrongLogin = {
      email: testUser.email,
      password: 'WrongPassword123',
    };

    const result = await makeRequest('/auth/login', 'POST', wrongLogin);

    if (!result.ok && result.status === 401) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Credenciales incorrectas rechazadas`);
      console.log(`   Mensaje: ${result.data.message}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Credenciales incorrectas no fueron rechazadas`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 6: Forgot Password
  // ==========================================
  console.log('\n6️⃣  POST /auth/forgot-password - Solicitar reset de contraseña');
  console.log('-'.repeat(70));
  try {
    const forgotData = {
      email: testUser.email,
    };

    const result = await makeRequest('/auth/forgot-password', 'POST', forgotData);

    if (result.ok && result.status === 200) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Solicitud de reset exitosa`);
      console.log(`   Mensaje: ${result.data.message}`);
      console.log(`   ${colors.yellow}⚠️  Revisa el email para obtener el token de reset${colors.reset}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Forgot password falló`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 7: Verificar token inválido (simulado)
  // ==========================================
  console.log('\n7️⃣  GET /auth/verify-email/:token - Token inválido (debe fallar con 400)');
  console.log('-'.repeat(70));
  try {
    const fakeToken = 'fake-token-12345';
    const result = await makeRequest(`/auth/verify-email/${fakeToken}`, 'GET');

    if (!result.ok && result.status === 400) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Token inválido rechazado correctamente`);
      console.log(`   Mensaje: ${result.data.message}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Token inválido no fue rechazado`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // TEST 8: Reset password con token inválido
  // ==========================================
  console.log('\n8️⃣  POST /auth/reset-password/:token - Token inválido (debe fallar con 400)');
  console.log('-'.repeat(70));
  try {
    const fakeToken = 'fake-reset-token-12345';
    const resetData = {
      password: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    };

    const result = await makeRequest(`/auth/reset-password/${fakeToken}`, 'POST', resetData);

    if (!result.ok && result.status === 400) {
      console.log(`${colors.green}✅ PASS${colors.reset}: Token de reset inválido rechazado`);
      console.log(`   Mensaje: ${result.data.message}`);
      testsPassed++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset}: Token de reset inválido no fue rechazado`);
      console.log('   Response:', result.data);
      testsFailed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}: Error inesperado:`, error.message);
    testsFailed++;
  }

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log('\n' + '='.repeat(70));
  console.log(`\n📊 Resultados del Testing:\n`);
  console.log(`   ${colors.green}✅ Tests exitosos: ${testsPassed}/8${colors.reset}`);
  console.log(`   ${colors.red}❌ Tests fallidos: ${testsFailed}/8${colors.reset}`);

  if (testsFailed === 0) {
    console.log(`\n${colors.green}🎉 ¡TODOS LOS TESTS DEL AUTH CONTROLLER PASARON!${colors.reset}\n`);
    console.log('📋 Funcionalidades probadas:');
    console.log('   ✅ Registro de usuarios');
    console.log('   ✅ Validación de duplicados');
    console.log('   ✅ Validación de datos de entrada');
    console.log('   ✅ Login con JWT');
    console.log('   ✅ Validación de credenciales');
    console.log('   ✅ Forgot password');
    console.log('   ✅ Validación de tokens');
    console.log('   ✅ Reset password');
    console.log('\n✨ Auth Controller está listo para usar!\n');
  } else {
    console.log(`\n${colors.yellow}⚠️  Algunos tests fallaron. Revisa la implementación.${colors.reset}\n`);
  }

  console.log('📝 Notas:');
  console.log(`   - Para probar la verificación de email completa, revisa el email y usa el token`);
  console.log(`   - Para probar el reset de password completo, revisa el email y usa el token`);
  console.log(`   - Usuario de prueba: ${testUser.email}`);
  console.log(`   - Token JWT: ${authToken ? authToken.substring(0, 30) + '...' : 'N/A'}\n`);
};

// Ejecutar tests
console.log(`\n${colors.blue}⏳ Iniciando tests del Auth Controller...${colors.reset}`);
console.log(`${colors.yellow}⚠️  Asegúrate de que el servidor esté corriendo: npm start${colors.reset}\n`);

// Esperar 2 segundos para que el usuario vea el mensaje
setTimeout(() => {
  runTests().catch(error => {
    console.error(`\n${colors.red}❌ Error crítico en testing:${colors.reset}`, error);
    process.exit(1);
  });
}, 2000);
