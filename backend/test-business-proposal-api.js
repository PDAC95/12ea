/**
 * Test Script - Business Proposal System
 * Tests para validar endpoints de propuesta y aprobación de negocios
 */

const BASE_URL = 'http://localhost:5000/api/v1';
let userToken = '';
let adminToken = '';
let proposedBusinessId = '';

// Helper function para hacer requests
async function request(method, path, body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

// Test Suite
async function runTests() {
  console.log('\n🧪 ===== INICIANDO TESTS DE BUSINESS PROPOSAL SYSTEM =====\n');

  // ========================================
  // Test 1: Login como usuario regular
  // ========================================
  console.log('📋 Test 1: Login como usuario regular (dev@jappi.ca)');
  try {
    const loginRes = await request('POST', '/auth/login', {
      email: 'dev@jappi.ca',
      password: 'Password123',
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      userToken = loginRes.data.token;
      console.log('✅ PASS - Login exitoso');
      console.log(`   Token obtenido: ${userToken.substring(0, 20)}...`);
    } else {
      console.log('❌ FAIL - Login falló:', loginRes.data);
      return;
    }
  } catch (error) {
    console.log('❌ FAIL - Error en login:', error.message);
    return;
  }

  // ========================================
  // Test 2: Proponer negocio (sin logo)
  // ========================================
  console.log('\n📋 Test 2: Proponer negocio sin logo');
  try {
    const proposeRes = await request('POST', '/businesses/propose', {
      name: 'Panadería La Esquina - Test',
      category: 'Gastronomía',
      description: 'Panadería artesanal con recetas tradicionales latinoamericanas. Hacemos pan, pasteles y postres frescos todos los días. Usamos ingredientes de alta calidad.',
      phone: '416-555-0123',
      city: 'Toronto',
    }, userToken);

    if (proposeRes.status === 201 && proposeRes.data.success) {
      proposedBusinessId = proposeRes.data.data._id;
      console.log('✅ PASS - Negocio propuesto exitosamente');
      console.log(`   ID del negocio: ${proposedBusinessId}`);
      console.log(`   Status: ${proposeRes.data.data.status}`);
      console.log(`   Mensaje: ${proposeRes.data.message}`);

      // Verificar que status sea 'pending'
      if (proposeRes.data.data.status === 'pending') {
        console.log('✅ PASS - Status es "pending" como se esperaba');
      } else {
        console.log(`❌ FAIL - Status esperado "pending", recibido "${proposeRes.data.data.status}"`);
      }
    } else {
      console.log('❌ FAIL - Error al proponer negocio:', proposeRes.data);
    }
  } catch (error) {
    console.log('❌ FAIL - Error en propuesta:', error.message);
  }

  // ========================================
  // Test 3: Verificar que NO aparece en lista pública
  // ========================================
  console.log('\n📋 Test 3: Verificar que negocio pending NO aparece en lista pública');
  try {
    const publicListRes = await request('GET', '/businesses?limit=100');

    if (publicListRes.status === 200) {
      const businesses = publicListRes.data.data.items;
      const foundInPublic = businesses.find(b => b._id === proposedBusinessId);

      if (!foundInPublic) {
        console.log('✅ PASS - Negocio pending NO aparece en lista pública');
      } else {
        console.log('❌ FAIL - Negocio pending SÍ aparece en lista pública (no debería)');
      }
    }
  } catch (error) {
    console.log('❌ FAIL - Error en verificación:', error.message);
  }

  // ========================================
  // Test 4: Intentar aprobar sin ser admin (debe fallar)
  // ========================================
  console.log('\n📋 Test 4: Intentar aprobar con token de usuario regular (debe fallar 403)');
  try {
    const approveRes = await request('PATCH', `/admin/businesses/${proposedBusinessId}/approve`, null, userToken);

    if (approveRes.status === 403) {
      console.log('✅ PASS - Usuario regular no puede aprobar (403 Forbidden)');
    } else {
      console.log(`❌ FAIL - Se esperaba 403, se recibió ${approveRes.status}`);
    }
  } catch (error) {
    console.log('❌ FAIL - Error en test de permisos:', error.message);
  }

  // ========================================
  // Test 5: Login como admin
  // ========================================
  console.log('\n📋 Test 5: Intentar login como admin');
  console.log('⚠️  SKIP - No hay cuenta admin configurada en este test');
  console.log('   Instrucción: Crear admin con el comando:');
  console.log('   npm run admin:create');

  // ========================================
  // RESUMEN
  // ========================================
  console.log('\n📊 ===== RESUMEN DE TESTS =====');
  console.log('✅ Tests básicos completados');
  console.log('⚠️  Tests de admin requieren cuenta admin');
  console.log('\nPróximos pasos:');
  console.log('1. Crear cuenta admin: npm run admin:create');
  console.log('2. Ejecutar tests de aprobación/rechazo manualmente');
  console.log('3. Verificar que emails se envían correctamente');
  console.log('\n=====================================\n');
}

// Ejecutar tests
runTests().catch(console.error);
