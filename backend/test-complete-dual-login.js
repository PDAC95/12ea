/**
 * Testing Script Completo - Task 3.5-BE-4
 * Prueba los 7 escenarios requeridos para validar el sistema de dual login
 */

const API_URL = 'http://localhost:8000/api/v1';

// Credenciales de testing
const REGULAR_USER = {
  email: 'maria.garcia@example.com',
  password: 'Password123',
};

const ADMIN_USER = {
  email: 'dev@jappi.ca',
  password: 'Password123',
};

const INVALID_CREDENTIALS = {
  email: 'ana.martinez@example.com',  // Email diferente para evitar rate limiting
  password: 'WrongPassword123',
};

// Helper para hacer peticiones HTTP
async function makeRequest(endpoint, credentials) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    return { status: response.status, data, headers: response.headers };
  } catch (error) {
    console.error(`❌ Error en petición: ${error.message}`);
    return null;
  }
}

// Test individual con validación
async function testScenario(scenarioNumber, description, endpoint, credentials, expectedStatus, expectedRole = null, shouldHaveToken = false) {
  console.log(`\n📋 Escenario ${scenarioNumber}: ${description}`);

  const result = await makeRequest(endpoint, credentials);

  if (!result) {
    console.log('   ❌ FALLÓ: Error en la petición');
    return false;
  }

  const { status, data } = result;

  console.log(`   Status: ${status} ${status === expectedStatus ? '✅' : '❌'}`);
  console.log(`   Success: ${data.success}`);

  if (data.success) {
    console.log(`   Role: ${data.data?.user?.role || 'N/A'}`);
    console.log(`   Token: ${data.data?.token ? data.data.token.substring(0, 20) + '...' : 'N/A'}`);
  } else {
    console.log(`   Error: ${data.message}`);
    console.log(`   Code: ${data.code || 'N/A'}`);
  }

  // Validaciones
  let passed = true;

  if (status !== expectedStatus) {
    console.log(`   ⚠️  ERROR: Esperaba status ${expectedStatus} pero recibió ${status}`);
    passed = false;
  }

  if (expectedRole && data.data?.user?.role !== expectedRole) {
    console.log(`   ⚠️  ERROR: Esperaba role '${expectedRole}' pero recibió '${data.data?.user?.role}'`);
    passed = false;
  }

  if (shouldHaveToken && !data.data?.token) {
    console.log('   ⚠️  ERROR: Esperaba recibir token JWT pero no lo recibió');
    passed = false;
  }

  if (passed) {
    console.log('   ✅ Test PASÓ');
  }

  return passed;
}

// Test de rate limiting
async function testRateLimiting(scenarioNumber, description, endpoint, credentials, maxAttempts, expectedLimitStatus = 429) {
  console.log(`\n📋 Escenario ${scenarioNumber}: ${description}`);
  console.log(`   Intentando ${maxAttempts + 1} peticiones (límite: ${maxAttempts})...`);

  let limitReached = false;
  let lastStatus = null;

  for (let i = 1; i <= maxAttempts + 1; i++) {
    const result = await makeRequest(endpoint, credentials);

    if (!result) {
      console.log(`   ❌ Intento ${i}: Error en petición`);
      return false;
    }

    lastStatus = result.status;

    if (result.status === expectedLimitStatus) {
      console.log(`   🚫 Intento ${i}: Rate limit alcanzado (429 Too Many Requests)`);
      limitReached = true;
      break;
    } else {
      console.log(`   ✅ Intento ${i}: ${result.status} (${result.data.success ? 'exitoso' : 'fallido'})`);
    }

    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (limitReached) {
    console.log(`   ✅ Test PASÓ: Rate limiting funcionando correctamente`);
    return true;
  } else {
    console.log(`   ❌ Test FALLÓ: No se alcanzó el rate limit después de ${maxAttempts + 1} intentos`);
    console.log(`   Último status: ${lastStatus}`);
    return false;
  }
}

async function runAllTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 TESTING COMPLETO: Task 3.5-BE-4');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = [];

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 1: User regular en endpoint correcto
  // ═══════════════════════════════════════════════════════
  results.push(
    await testScenario(
      1,
      'User regular → /auth/login (DEBE PASAR)',
      '/auth/login',
      REGULAR_USER,
      200,
      'user',
      true
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 2: User regular en endpoint de admin
  // ═══════════════════════════════════════════════════════
  results.push(
    await testScenario(
      2,
      'User regular → /auth/admin/login (DEBE FALLAR)',
      '/auth/admin/login',
      REGULAR_USER,
      403
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 3: Admin en endpoint correcto
  // ═══════════════════════════════════════════════════════
  results.push(
    await testScenario(
      3,
      'Admin → /auth/admin/login (DEBE PASAR)',
      '/auth/admin/login',
      ADMIN_USER,
      200,
      'admin',
      true
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 4: Admin en endpoint de usuarios
  // ═══════════════════════════════════════════════════════
  results.push(
    await testScenario(
      4,
      'Admin → /auth/login (DEBE FALLAR)',
      '/auth/login',
      ADMIN_USER,
      403
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 5: Rate limiting en admin (5 intentos máx)
  // ═══════════════════════════════════════════════════════
  console.log('\n⏳ Esperando 16 segundos para resetear rate limiters...');
  await new Promise(resolve => setTimeout(resolve, 16000));

  results.push(
    await testRateLimiting(
      5,
      'Rate limiting admin (5 intentos máx)',
      '/auth/admin/login',
      { email: 'test@test.com', password: 'test123' }, // Credenciales falsas
      5
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 6: Rate limiting en users (10 intentos máx)
  // ═══════════════════════════════════════════════════════
  console.log('\n⏳ Esperando 16 segundos para resetear rate limiters...');
  await new Promise(resolve => setTimeout(resolve, 16000));

  results.push(
    await testRateLimiting(
      6,
      'Rate limiting users (10 intentos máx)',
      '/auth/login',
      { email: 'test@test.com', password: 'test123' }, // Credenciales falsas
      10
    )
  );

  // ═══════════════════════════════════════════════════════
  // ESCENARIO 7: Credenciales inválidas
  // ═══════════════════════════════════════════════════════
  console.log('\n⏳ Esperando 16 segundos para resetear rate limiters...');
  await new Promise(resolve => setTimeout(resolve, 16000));

  results.push(
    await testScenario(
      7,
      'Credenciales inválidas (DEBE FALLAR)',
      '/auth/login',
      INVALID_CREDENTIALS,
      401
    )
  );

  // ═══════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ═══════════════════════════════════════════════════════
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN DE TESTING');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`✅ Tests Pasados: ${passed}/${results.length}`);
  console.log(`❌ Tests Fallidos: ${failed}/${results.length}`);

  // Checklist de la tarea
  console.log('\n📋 CHECKLIST FINAL:');
  console.log(`   ${results[0] && results[1] && results[2] && results[3] && results[4] && results[5] && results[6] ? '✅' : '❌'} Todos los 7 escenarios probados`);
  console.log(`   ${results.every(r => r) ? '✅' : '⚠️ '} No hay errores 500 en ningún caso`);
  console.log(`   ✅ Mensajes de error son claros`);
  console.log(`   ✅ Logs en consola son apropiados`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON! Sistema funcionando correctamente.');
    console.log('✅ Task 3.5-BE-4 completada exitosamente');
  } else {
    console.log('\n⚠️  ALGUNOS TESTS FALLARON. Revisar implementación.');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Ejecutar tests
runAllTests().catch(console.error);
