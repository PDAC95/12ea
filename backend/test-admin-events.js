/**
 * Testing Script - Admin Events Endpoints
 * Prueba los endpoints CRUD de /api/admin/events
 */

const API_URL = 'http://localhost:8000/api/v1';

// Credenciales del admin
const ADMIN_USER = {
  email: 'dev@jappi.ca',
  password: 'Password123',
};

let adminToken = null;
let createdEventId = null;

// Helper para hacer peticiones HTTP
async function makeRequest(method, endpoint, body = null, token = null) {
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

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`❌ Error en ${method} ${endpoint}:`, error.message);
    return null;
  }
}

// Step 1: Login como admin
async function loginAdmin() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 PASO 1: Login como Admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await makeRequest('POST', '/auth/admin/login', ADMIN_USER);

  if (!result || result.status !== 200) {
    console.log('❌ Login falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  adminToken = result.data.data.token;
  console.log('✅ Login exitoso');
  console.log('Token:', adminToken.substring(0, 20) + '...');
  return true;
}

// Step 2: Crear evento
async function createEvent() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 PASO 2: POST /admin/events - Crear Evento');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventData = {
    title: 'Test Admin Event - ' + Date.now(),
    description: 'Este es un evento de prueba creado por el script de testing del sistema admin.',
    date: tomorrow.toISOString(),
    time: '18:00',
    mode: 'híbrido',
    location: 'Toronto Community Center',
    link: 'https://zoom.us/test',
    capacity: 50,
    category: 'networking',
    status: 'published',
  };

  const result = await makeRequest('POST', '/admin/events', eventData, adminToken);

  if (!result || result.status !== 201) {
    console.log('❌ Crear evento falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  createdEventId = result.data.data._id;
  console.log('✅ Evento creado exitosamente');
  console.log('ID:', createdEventId);
  console.log('Título:', result.data.data.title);
  return true;
}

// Step 3: Listar todos los eventos (admin)
async function getAllEventsAdmin() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 PASO 3: GET /admin/events - Listar Todos (incluye cancelled)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await makeRequest('GET', '/admin/events?status=all&limit=5', null, adminToken);

  if (!result || result.status !== 200) {
    console.log('❌ Listar eventos falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  console.log('✅ Eventos listados exitosamente');
  console.log('Total:', result.data.total);
  console.log('Eventos en página:', result.data.count);
  console.log('\nPrimeros 3 eventos:');
  result.data.data.slice(0, 3).forEach((event, index) => {
    console.log(`  ${index + 1}. ${event.title} - ${event.isActive ? 'Activo' : 'Cancelado'} (${event.registeredCount || 0} registrados)`);
  });
  return true;
}

// Step 4: Actualizar evento
async function updateEvent() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✏️  PASO 4: PUT /admin/events/:id - Actualizar Evento');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const updateData = {
    title: 'Test Admin Event - ACTUALIZADO',
    capacity: 75,
  };

  const result = await makeRequest('PUT', `/admin/events/${createdEventId}`, updateData, adminToken);

  if (!result || result.status !== 200) {
    console.log('❌ Actualizar evento falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  console.log('✅ Evento actualizado exitosamente');
  console.log('Nuevo título:', result.data.data.title);
  console.log('Nueva capacidad:', result.data.data.capacity);
  return true;
}

// Step 5: Ver registraciones del evento
async function getEventRegistrations() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👥 PASO 5: GET /admin/events/:id/registrations - Ver Registrados');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await makeRequest('GET', `/admin/events/${createdEventId}/registrations`, null, adminToken);

  if (!result || result.status !== 200) {
    console.log('❌ Obtener registraciones falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  console.log('✅ Registraciones obtenidas exitosamente');
  console.log('Total registrados:', result.data.count);
  return true;
}

// Step 6: Cancelar evento (soft delete)
async function deleteEvent() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🗑️  PASO 6: DELETE /admin/events/:id - Cancelar Evento (Soft Delete)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await makeRequest('DELETE', `/admin/events/${createdEventId}`, null, adminToken);

  if (!result || result.status !== 200) {
    console.log('❌ Cancelar evento falló');
    console.log('Status:', result?.status);
    console.log('Message:', result?.data?.message);
    return false;
  }

  console.log('✅ Evento cancelado exitosamente');
  console.log('isActive:', result.data.data.isActive);
  console.log('status:', result.data.data.status);
  return true;
}

// Step 7: Verificar que evento cancelado aparece en listado admin
async function verifyCancelledEvent() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 PASO 7: GET /admin/events?status=cancelled - Verificar Cancelados');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await makeRequest('GET', '/admin/events?status=cancelled&limit=5', null, adminToken);

  if (!result || result.status !== 200) {
    console.log('❌ Listar cancelados falló');
    return false;
  }

  const found = result.data.data.some(event => event._id === createdEventId);

  console.log('✅ Listado de cancelados obtenido');
  console.log('Total cancelados:', result.data.total);
  console.log('Evento de prueba encontrado en lista:', found ? '✅ SÍ' : '❌ NO');
  return found;
}

// Main test runner
async function runAllTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 TESTING: Admin Events Endpoints - Task 8.1');
  console.log('═══════════════════════════════════════════════════');

  const tests = [
    { name: 'Login Admin', fn: loginAdmin },
    { name: 'Crear Evento', fn: createEvent },
    { name: 'Listar Eventos Admin', fn: getAllEventsAdmin },
    { name: 'Actualizar Evento', fn: updateEvent },
    { name: 'Ver Registraciones', fn: getEventRegistrations },
    { name: 'Cancelar Evento', fn: deleteEvent },
    { name: 'Verificar Cancelado', fn: verifyCancelledEvent },
  ];

  const results = [];

  for (const test of tests) {
    const passed = await test.fn();
    results.push({ name: test.name, passed });

    if (!passed && test.name === 'Login Admin') {
      console.log('\n⚠️  Login falló, no se pueden continuar los tests');
      break;
    }
  }

  // Resumen
  console.log('\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 RESUMEN DE TESTING');
  console.log('═══════════════════════════════════════════════════\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });

  console.log(`\n✅ Tests Pasados: ${passed}/${results.length}`);
  console.log(`❌ Tests Fallidos: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('✅ Task 8.1 completada exitosamente\n');
  } else {
    console.log('\n⚠️  ALGUNOS TESTS FALLARON. Revisar implementación.\n');
  }

  console.log('═══════════════════════════════════════════════════\n');
}

// Ejecutar tests
runAllTests().catch(console.error);
