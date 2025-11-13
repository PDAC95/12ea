import { generateAuthToken } from './src/services/token.service.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script de Testing para Endpoints de Registro de Eventos
 * Task 4.4 - Sprint 3
 */

// Simular usuario autenticado (dev@jappi.ca)
const userId = '691253ed10e3376ba8e88366'; // ID del usuario dev@jappi.ca del seed

// Generar token JWT con payload adicional
const token = generateAuthToken(userId, {
  role: 'admin',
  email: 'dev@jappi.ca',
});

console.log('🔐 TOKEN DE AUTENTICACIÓN GENERADO\n');
console.log('Token JWT:');
console.log(token);
console.log('\n---\n');

console.log('📝 USO DEL TOKEN:\n');
console.log('Para probar los endpoints protegidos, usa el siguiente header:\n');
console.log('Authorization: Bearer ' + token);
console.log('\n---\n');

console.log('🧪 COMANDOS DE TESTING:\n');

// ID de un evento del seed (usar el primero que no esté lleno)
const eventId = '6915f6a4271a6e949ea97454'; // Taller de Finanzas (8/30 registros)

console.log('1️⃣ REGISTRAR A UN EVENTO (exitoso):\n');
console.log(`curl -X POST http://localhost:8000/api/v1/events/${eventId}/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d "{\\"notes\\":\\"Interesada en aprender más sobre finanzas\\"}" | python -m json.tool\n`);

console.log('2️⃣ INTENTAR REGISTRAR DE NUEVO (duplicado):\n');
console.log(`curl -X POST http://localhost:8000/api/v1/events/${eventId}/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" | python -m json.tool\n`);

console.log('3️⃣ VER MIS REGISTROS:\n');
console.log(`curl -X GET http://localhost:8000/api/v1/events/my-registrations \\
  -H "Authorization: Bearer ${token}" | python -m json.tool\n`);

console.log('4️⃣ CANCELAR REGISTRO:\n');
console.log(`curl -X DELETE http://localhost:8000/api/v1/events/${eventId}/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d "{\\"reason\\":\\"Cambio de planes\\"}" | python -m json.tool\n`);

console.log('5️⃣ INTENTAR REGISTRAR EN EVENTO LLENO (validación capacidad):\n');
const fullEventId = '6915f6a4271a6e949ea97455'; // Yoga (18/20 registros, casi lleno)
console.log(`curl -X POST http://localhost:8000/api/v1/events/${fullEventId}/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" | python -m json.tool\n`);

console.log('6️⃣ VER DETALLE DE EVENTO (como usuario autenticado):\n');
console.log(`curl -X GET http://localhost:8000/api/v1/events/${eventId} \\
  -H "Authorization: Bearer ${token}" | python -m json.tool\n`);

console.log('\n✅ Script de testing generado exitosamente');
console.log('📋 Copia y pega los comandos en la terminal para probar los endpoints\n');
