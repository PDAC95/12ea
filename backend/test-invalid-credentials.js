/**
 * Test simple de credenciales inválidas
 * Ejecutar después de esperar 15 minutos desde el último test masivo
 */

const API_URL = 'http://localhost:8000/api/v1';

async function testInvalidCredentials() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 TEST: Credenciales Inválidas (Escenario 7)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'ana.martinez@example.com',
      password: 'WrongPassword123',
    }),
  });

  const data = await response.json();

  console.log(`Status: ${response.status}`);
  console.log(`Success: ${data.success}`);
  console.log(`Message: ${data.message}`);
  console.log(`Code: ${data.code || 'N/A'}\n`);

  if (response.status === 401 && !data.success) {
    console.log('✅ Test PASÓ: Credenciales inválidas rechazadas correctamente\n');
  } else if (response.status === 429) {
    console.log('⚠️  Rate limiter activo. Espera 15 minutos y ejecuta de nuevo.\n');
  } else {
    console.log('❌ Test FALLÓ: Comportamiento inesperado\n');
  }
}

testInvalidCredentials().catch(console.error);
