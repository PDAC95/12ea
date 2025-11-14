import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:8000/api/v1';

let adminToken = '';
let testEventId = '';

// Login admin
const loginAdmin = async () => {
  const response = await axios.post(`${API_URL}/auth/admin/login`, {
    email: 'dev@jappi.ca',
    password: 'Password123',
  });

  if (!response.data.success) {
    throw new Error('Login fallido');
  }

  adminToken = response.data.data.token;
  console.log('✅ Login admin exitoso');
  return response.data;
};

// Obtener primer evento con registraciones
const getEventWithRegistrations = async () => {
  const response = await axios.get(`${API_URL}/admin/events`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  if (!response.data.success || !response.data.data || response.data.data.length === 0) {
    throw new Error('No hay eventos disponibles');
  }

  // Buscar un evento con registraciones
  const eventWithRegs = response.data.data.find(event => event.registrationCount > 0);

  if (!eventWithRegs) {
    // Si no hay eventos con registraciones, usar el primero
    testEventId = response.data.data[0]._id;
    console.log(`⚠️  Usando evento sin registraciones: ${response.data.data[0].title}`);
  } else {
    testEventId = eventWithRegs._id;
    console.log(`✅ Evento encontrado: ${eventWithRegs.title} (${eventWithRegs.registrationCount} registraciones)`);
  }

  return testEventId;
};

// Test 1: Exportar CSV de evento con registraciones
const exportCSVWithRegistrations = async () => {
  const response = await axios.get(
    `${API_URL}/admin/events/${testEventId}/export-csv`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      responseType: 'blob', // Importante para recibir archivo
    }
  );

  // Verificar headers
  const contentType = response.headers['content-type'];
  const contentDisposition = response.headers['content-disposition'];

  if (!contentType.includes('text/csv')) {
    throw new Error(`Content-Type incorrecto: ${contentType}`);
  }

  if (!contentDisposition.includes('attachment')) {
    throw new Error(`Content-Disposition incorrecto: ${contentDisposition}`);
  }

  // Verificar que retorna data
  if (!response.data || response.data.size === 0) {
    throw new Error('CSV vacío');
  }

  // Guardar archivo para inspección
  const filename = `test-export-${testEventId}.csv`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, response.data);

  console.log(`✅ CSV exportado exitosamente`);
  console.log(`   Archivo guardado: ${filename}`);
  console.log(`   Tamaño: ${response.data.size} bytes`);
  console.log(`   Content-Type: ${contentType}`);

  // Leer y mostrar primeras líneas
  const csvContent = fs.readFileSync(filepath, 'utf-8');
  const lines = csvContent.split('\n').slice(0, 5);
  console.log(`   Primeras líneas:`);
  lines.forEach((line, i) => console.log(`   ${i + 1}. ${line}`));

  return response.data;
};

// Test 2: Exportar CSV sin autenticación (debe fallar)
const exportCSVWithoutAuth = async () => {
  try {
    await axios.get(`${API_URL}/admin/events/${testEventId}/export-csv`);
    throw new Error('Debería haber fallado sin autenticación');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Export sin auth correctamente rechazado (401)');
      return { status: 401 };
    }
    throw error;
  }
};

// Test 3: Exportar CSV de evento inexistente (debe fallar)
const exportCSVNonExistentEvent = async () => {
  try {
    const fakeId = '000000000000000000000000';
    await axios.get(
      `${API_URL}/admin/events/${fakeId}/export-csv`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    throw new Error('Debería haber fallado con evento inexistente');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✅ Evento inexistente correctamente rechazado (404)');
      return { status: 404 };
    }
    throw error;
  }
};

// Cleanup
const cleanup = () => {
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith('test-export-') && f.endsWith('.csv'));
  files.forEach(file => {
    const filepath = path.join(__dirname, file);
    fs.unlinkSync(filepath);
  });
  console.log(`\n🧹 ${files.length} archivo(s) CSV eliminados`);
};

// Runner
const runTests = async () => {
  console.log('\n🧪 TESTING: Task 8.3 - Export CSV Endpoint\n');
  console.log('='.repeat(60));

  const tests = [
    { name: '1. Login Admin', fn: loginAdmin },
    { name: '2. Obtener evento con registraciones', fn: getEventWithRegistrations },
    { name: '3. Exportar CSV', fn: exportCSVWithRegistrations },
    { name: '4. Export sin autenticación (debe fallar)', fn: exportCSVWithoutAuth },
    { name: '5. Export evento inexistente (debe fallar)', fn: exportCSVNonExistentEvent },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n${test.name}...`);
      await test.fn();
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name} falló:`);
      console.error(`   ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data:`, error.response.data);
      }
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 RESULTADOS: ${passed}/${tests.length} tests pasaron`);

  if (failed > 0) {
    console.log(`❌ ${failed} tests fallaron`);
  } else {
    console.log('✅ Todos los tests pasaron exitosamente');
  }

  cleanup();
};

runTests().catch(error => {
  console.error('Error fatal:', error);
  cleanup();
  process.exit(1);
});
