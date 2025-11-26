/**
 * Script de prueba para verificar funcionalidad Remember Me
 *
 * Este script realiza dos logins y compara las fechas de expiración de los tokens:
 * 1. Login SIN Remember Me (debería expirar en 7 días)
 * 2. Login CON Remember Me (debería expirar en 30 días)
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:8000/api/v1';

// Credenciales de prueba (usa las del admin de desarrollo)
const TEST_EMAIL = 'dev@jappi.ca';
const TEST_PASSWORD = 'Password123';

/**
 * Decodificar token y mostrar información de expiración
 */
function analyzeToken(token, label) {
  const decoded = jwt.decode(token);

  if (!decoded || !decoded.exp) {
    console.log(`❌ ${label}: Token no tiene información de expiración`);
    return;
  }

  const expiresAt = new Date(decoded.exp * 1000);
  const now = new Date();
  const expiresInDays = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24));
  const expiresInHours = Math.floor((expiresAt - now) / (1000 * 60 * 60));

  console.log(`\n📊 ${label}:`);
  console.log(`   Token ID: ${decoded.id}`);
  console.log(`   Email: ${decoded.email}`);
  console.log(`   Rol: ${decoded.role}`);
  console.log(`   Emitido: ${new Date(decoded.iat * 1000).toLocaleString('es-MX')}`);
  console.log(`   Expira: ${expiresAt.toLocaleString('es-MX')}`);
  console.log(`   ⏱️  Duración: ${expiresInDays} días (${expiresInHours} horas)`);
  console.log(`   Verificado: ${decoded.isVerified}`);

  return expiresInDays;
}

/**
 * Test principal
 */
async function testRememberMe() {
  console.log('🧪 TEST: Funcionalidad Remember Me\n');
  console.log('='.repeat(60));

  try {
    // TEST 1: Login SIN Remember Me
    console.log('\n1️⃣  TEST 1: Login SIN "Recordarme" (rememberMe: false)');
    console.log('-'.repeat(60));

    const loginWithoutRememberMe = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      rememberMe: false,
    });

    const tokenWithout = loginWithoutRememberMe.data.data.token;
    const daysWithout = analyzeToken(tokenWithout, 'Token SIN Remember Me');

    // TEST 2: Login CON Remember Me
    console.log('\n2️⃣  TEST 2: Login CON "Recordarme" (rememberMe: true)');
    console.log('-'.repeat(60));

    const loginWithRememberMe = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      rememberMe: true,
    });

    const tokenWith = loginWithRememberMe.data.data.token;
    const daysWith = analyzeToken(tokenWith, 'Token CON Remember Me');

    // COMPARACIÓN
    console.log('\n📈 COMPARACIÓN Y RESULTADOS:');
    console.log('='.repeat(60));
    console.log(`   SIN Remember Me: ~${daysWithout} días de duración`);
    console.log(`   CON Remember Me: ~${daysWith} días de duración`);
    console.log(`   Diferencia: ${daysWith - daysWithout} días adicionales`);

    // VALIDACIÓN
    console.log('\n✅ VALIDACIÓN:');
    console.log('='.repeat(60));

    if (daysWithout >= 6 && daysWithout <= 8) {
      console.log('   ✅ Token sin Remember Me expira en ~7 días (CORRECTO)');
    } else {
      console.log(`   ❌ Token sin Remember Me expira en ${daysWithout} días (esperado: ~7 días)`);
    }

    if (daysWith >= 29 && daysWith <= 31) {
      console.log('   ✅ Token con Remember Me expira en ~30 días (CORRECTO)');
    } else {
      console.log(`   ❌ Token con Remember Me expira en ${daysWith} días (esperado: ~30 días)`);
    }

    if (daysWith > daysWithout) {
      console.log('   ✅ Remember Me extiende la duración del token (CORRECTO)');
    } else {
      console.log('   ❌ Remember Me NO extiende la duración del token (ERROR)');
    }

    console.log('\n🎉 CONCLUSIÓN:');
    console.log('='.repeat(60));
    if (daysWithout >= 6 && daysWithout <= 8 && daysWith >= 29 && daysWith <= 31) {
      console.log('   ✅ La funcionalidad Remember Me está funcionando correctamente');
      console.log('   ✅ Los usuarios pueden mantener su sesión activa por 30 días');
    } else {
      console.log('   ❌ Hay problemas con la funcionalidad Remember Me');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('='.repeat(60));

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Mensaje: ${error.response.data?.message || 'Sin mensaje'}`);
      console.error(`   Datos:`, error.response.data);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
      console.error('   Verifica que el backend esté corriendo en http://localhost:8000');
    } else {
      console.error('   Error:', error.message);
    }

    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
}

// Ejecutar test
testRememberMe();
