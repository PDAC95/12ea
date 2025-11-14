/**
 * Testing Script - Dual Login System
 * Prueba los endpoints /api/auth/login y /api/auth/admin/login
 */

const API_URL = 'http://localhost:8000/api/v1';

// Credenciales de testing
const REGULAR_USER = {
  email: 'maria.garcia@example.com',  // Usuario regular verificado
  password: 'Password123',             // Password del seed
};

const ADMIN_USER = {
  email: 'dev@jappi.ca',               // Admin verificado
  password: 'Password123',             // Password conocido
};

async function testEndpoint(endpoint, credentials, expectedRole, shouldFail = false) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    console.log(`\n${shouldFail ? '❌' : '✅'} Test: ${endpoint}`);
    console.log(`   Email: ${credentials.email}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);

    if (data.success) {
      console.log(`   Role: ${data.data?.user?.role}`);
      console.log(`   Token: ${data.data?.token?.substring(0, 20)}...`);
    } else {
      console.log(`   Error: ${data.message}`);
      console.log(`   Code: ${data.code || 'N/A'}`);
    }

    // Validar resultado esperado
    if (shouldFail && data.success) {
      console.log('   ⚠️  ERROR: Debería haber fallado pero fue exitoso');
      return false;
    }

    if (!shouldFail && !data.success) {
      console.log('   ⚠️  ERROR: Debería haber sido exitoso pero falló');
      return false;
    }

    if (!shouldFail && data.data?.user?.role !== expectedRole) {
      console.log(`   ⚠️  ERROR: Role esperado '${expectedRole}' pero recibió '${data.data?.user?.role}'`);
      return false;
    }

    console.log('   ✅ Test PASÓ');
    return true;
  } catch (error) {
    console.error(`\n❌ Error en test ${endpoint}:`, error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 TESTING: Sistema de Dos Logins Separados');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = [];

  // Test 1: Usuario regular en endpoint correcto ✅
  console.log('\n📋 Test 1: Usuario regular → /auth/login (DEBE PASAR)');
  results.push(await testEndpoint('/auth/login', REGULAR_USER, 'user', false));

  // Test 2: Usuario regular en endpoint admin ❌
  console.log('\n📋 Test 2: Usuario regular → /auth/admin/login (DEBE FALLAR)');
  results.push(await testEndpoint('/auth/admin/login', REGULAR_USER, null, true));

  // Test 3: Admin en endpoint admin ✅
  console.log('\n📋 Test 3: Admin → /auth/admin/login (DEBE PASAR)');
  results.push(await testEndpoint('/auth/admin/login', ADMIN_USER, 'admin', false));

  // Test 4: Admin en endpoint regular ❌
  console.log('\n📋 Test 4: Admin → /auth/login (DEBE FALLAR)');
  results.push(await testEndpoint('/auth/login', ADMIN_USER, null, true));

  // Resumen
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN DE TESTING');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`✅ Tests Pasados: ${passed}/${results.length}`);
  console.log(`❌ Tests Fallidos: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON! Sistema funcionando correctamente.');
  } else {
    console.log('\n⚠️  ALGUNOS TESTS FALLARON. Revisar implementación.');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Ejecutar tests
runAllTests().catch(console.error);
