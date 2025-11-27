/**
 * Script de prueba para Admin Users API
 * Ejecutar: node test-admin-users.js
 *
 * Prerequisitos:
 * - Servidor backend corriendo en http://localhost:8000
 * - Usuario admin: dev@jappi.ca / Password123
 */

const BASE_URL = 'http://localhost:8000/api/v1';

let authToken = '';
let testUserId = '';

// Helper para hacer requests
async function request(method, endpoint, body = null, useAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
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
}

// Test 1: Login como admin
async function testLogin() {
  console.log('\n🔐 Test 1: Login como Admin');
  console.log('=====================================');

  const result = await request('POST', '/auth/login', {
    email: 'dev@jappi.ca',
    password: 'Password123',
  }, false);

  if (result.ok && result.data.success) {
    authToken = result.data.data.token;
    console.log('✅ Login exitoso');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    console.log(`   User: ${result.data.data.user.email}`);
    console.log(`   Role: ${result.data.data.user.role}`);
    return true;
  } else {
    console.log('❌ Login fallido');
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 2: Obtener todos los usuarios
async function testGetAllUsers() {
  console.log('\n📋 Test 2: Obtener Todos los Usuarios');
  console.log('=====================================');

  const result = await request('GET', '/admin/users?page=1&limit=20');

  if (result.ok && result.data.success) {
    console.log('✅ Usuarios obtenidos exitosamente');
    console.log(`   Total: ${result.data.data.pagination.total} usuarios`);
    console.log(`   Página: ${result.data.data.pagination.page}/${result.data.data.pagination.totalPages}`);
    console.log(`   Usuarios en esta página: ${result.data.data.users.length}`);

    if (result.data.data.users.length > 0) {
      testUserId = result.data.data.users[0]._id;
      console.log(`\n   Primer usuario:`);
      console.log(`   - ID: ${testUserId}`);
      console.log(`   - Nombre: ${result.data.data.users[0].fullName}`);
      console.log(`   - Email: ${result.data.data.users[0].email}`);
      console.log(`   - Role: ${result.data.data.users[0].role}`);
    }

    return true;
  } else {
    console.log('❌ Error al obtener usuarios');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 3: Buscar usuarios
async function testSearchUsers() {
  console.log('\n🔍 Test 3: Buscar Usuarios');
  console.log('=====================================');

  const result = await request('GET', '/admin/users?search=dev&role=admin');

  if (result.ok && result.data.success) {
    console.log('✅ Búsqueda exitosa');
    console.log(`   Resultados encontrados: ${result.data.data.users.length}`);

    result.data.data.users.forEach((user, index) => {
      console.log(`\n   Usuario ${index + 1}:`);
      console.log(`   - Nombre: ${user.fullName}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role: ${user.role}`);
    });

    return true;
  } else {
    console.log('❌ Error en búsqueda');
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 4: Obtener usuario por ID
async function testGetUserById() {
  console.log('\n👤 Test 4: Obtener Usuario por ID');
  console.log('=====================================');

  if (!testUserId) {
    console.log('⚠️  Saltando test - No hay userId disponible');
    return false;
  }

  const result = await request('GET', `/admin/users/${testUserId}`);

  if (result.ok && result.data.success) {
    console.log('✅ Usuario obtenido exitosamente');
    const user = result.data.data;
    console.log(`   - ID: ${user._id}`);
    console.log(`   - Nombre: ${user.fullName}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Verificado: ${user.isVerified ? 'Sí' : 'No'}`);
    console.log(`   - Activo: ${user.isActive ? 'Sí' : 'No'}`);
    console.log(`   - Provider: ${user.authProvider}`);

    // Verificar que NO se incluyan campos sensibles
    const sensitiveFields = ['password', 'verificationToken', 'resetPasswordToken'];
    const foundSensitive = sensitiveFields.filter(field => user[field] !== undefined);

    if (foundSensitive.length > 0) {
      console.log(`\n   ⚠️  ALERTA: Campos sensibles encontrados: ${foundSensitive.join(', ')}`);
    } else {
      console.log(`\n   ✅ Campos sensibles excluidos correctamente`);
    }

    return true;
  } else {
    console.log('❌ Error al obtener usuario');
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 5: Actualizar usuario (solo bio, para no alterar datos importantes)
async function testUpdateUser() {
  console.log('\n✏️  Test 5: Actualizar Usuario');
  console.log('=====================================');

  if (!testUserId) {
    console.log('⚠️  Saltando test - No hay userId disponible');
    return false;
  }

  const updateData = {
    bio: `Actualizado por test script - ${new Date().toISOString()}`,
  };

  const result = await request('PUT', `/admin/users/${testUserId}`, updateData);

  if (result.ok && result.data.success) {
    console.log('✅ Usuario actualizado exitosamente');
    console.log(`   - Bio actualizada: ${result.data.data.bio}`);
    console.log(`   - Updated At: ${result.data.data.updatedAt}`);
    return true;
  } else {
    console.log('❌ Error al actualizar usuario');
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 6: Intentar actualizar campos prohibidos (debe fallar)
async function testForbiddenFields() {
  console.log('\n🚫 Test 6: Validar Campos Prohibidos');
  console.log('=====================================');

  if (!testUserId) {
    console.log('⚠️  Saltando test - No hay userId disponible');
    return false;
  }

  const updateData = {
    email: 'hacker@example.com', // Campo prohibido
    password: 'hackingAttempt', // Campo prohibido
  };

  const result = await request('PUT', `/admin/users/${testUserId}`, updateData);

  if (!result.ok && result.data.code === 'FORBIDDEN_FIELDS') {
    console.log('✅ Validación de campos prohibidos funciona correctamente');
    console.log(`   - Campos bloqueados: ${result.data.forbiddenFields.join(', ')}`);
    return true;
  } else {
    console.log('❌ ALERTA: Los campos prohibidos NO están siendo validados');
    console.log(`   Respuesta: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Test 7: Paginación
async function testPagination() {
  console.log('\n📄 Test 7: Paginación');
  console.log('=====================================');

  const result = await request('GET', '/admin/users?page=1&limit=3');

  if (result.ok && result.data.success) {
    const { pagination } = result.data.data;
    console.log('✅ Paginación funcionando');
    console.log(`   - Página actual: ${pagination.page}`);
    console.log(`   - Límite: ${pagination.limit}`);
    console.log(`   - Total: ${pagination.total}`);
    console.log(`   - Total páginas: ${pagination.totalPages}`);
    console.log(`   - Tiene siguiente: ${pagination.hasNext ? 'Sí' : 'No'}`);
    console.log(`   - Tiene anterior: ${pagination.hasPrev ? 'Sí' : 'No'}`);

    // Verificar estructura correcta
    if (pagination.hasNext !== undefined && pagination.hasPrev !== undefined) {
      console.log(`   ✅ Estructura correcta (hasNext/hasPrev)`);
    } else {
      console.log(`   ⚠️  Estructura incorrecta - Revisar nombres de campos`);
    }

    return true;
  } else {
    console.log('❌ Error en paginación');
    console.log(`   Error: ${JSON.stringify(result.data)}`);
    return false;
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   ADMIN USERS API - TEST SUITE            ║');
  console.log('╚════════════════════════════════════════════╝');

  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Search Users', fn: testSearchUsers },
    { name: 'Get User by ID', fn: testGetUserById },
    { name: 'Update User', fn: testUpdateUser },
    { name: 'Forbidden Fields', fn: testForbiddenFields },
    { name: 'Pagination', fn: testPagination },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
    } catch (error) {
      console.log(`\n❌ Error en ${test.name}:`, error.message);
      results.push({ name: test.name, passed: false });
    }
  }

  // Resumen final
  console.log('\n\n╔════════════════════════════════════════════╗');
  console.log('║   RESUMEN DE TESTS                        ║');
  console.log('╚════════════════════════════════════════════╝\n');

  results.forEach((result, index) => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${index + 1}. ${result.name.padEnd(30)} ${status}`);
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log('\n─────────────────────────────────────────────');
  console.log(`Total: ${passed}/${total} tests passed (${percentage}%)`);
  console.log('─────────────────────────────────────────────\n');

  if (passed === total) {
    console.log('🎉 TODOS LOS TESTS PASARON! 🎉\n');
  } else {
    console.log('⚠️  Algunos tests fallaron. Revisar logs arriba.\n');
  }
}

// Ejecutar
runAllTests().catch(console.error);
