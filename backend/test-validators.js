// Script para probar las validaciones de autenticación
// Uso: node test-validators.js

import express from 'express';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors,
} from './src/validators/auth.validator.js';

/**
 * Helper para simular una request de Express
 */
const simulateRequest = async (validationChain, body) => {
  const app = express();
  app.use(express.json());

  let result = null;

  app.post('/test', validationChain, handleValidationErrors, (req, res) => {
    result = { success: true };
    res.json(result);
  });

  // Simular request
  const req = {
    body,
    method: 'POST',
    url: '/test',
  };

  const res = {
    statusCode: 200,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      result = { success: this.statusCode === 200, ...data };
      return this;
    },
  };

  // Ejecutar validaciones manualmente
  for (const validation of validationChain) {
    await validation.run(req);
  }

  // Ejecutar handleValidationErrors
  handleValidationErrors(req, res, () => {
    result = { success: true };
  });

  return result;
};

/**
 * Test runner
 */
const runTests = async () => {
  console.log('\n🧪 Prueba de Validaciones de Autenticación\n');
  console.log('=' .repeat(70));

  let testsPass = 0;
  let testsFail = 0;

  // ==========================================
  // TEST 1: Registro válido
  // ==========================================
  console.log('\n1️⃣  registerValidation - Datos válidos (debe pasar)');
  console.log('-'.repeat(70));
  try {
    const validData = {
      fullName: 'María García López',
      preferredName: 'María',
      email: 'maria@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+1 234-567-8900',
      birthday: '1990-05-15',
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, validData);

    if (result.success) {
      console.log('✅ PASS: Datos válidos aceptados');
      testsPass++;
    } else {
      console.log('❌ FAIL: Datos válidos rechazados');
      console.log('Errores:', result.errors);
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 2: Registro - fullName muy corto
  // ==========================================
  console.log('\n2️⃣  registerValidation - fullName muy corto (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      fullName: 'M',  // Muy corto
      preferredName: 'María',
      email: 'maria@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+1 234-567-8900',
      birthday: '1990-05-15',
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, invalidData);

    if (!result.success && result.errors) {
      const hasError = result.errors.some(e => e.field === 'fullName');
      if (hasError) {
        console.log('✅ PASS: fullName muy corto rechazado correctamente');
        console.log(`   Error: ${result.errors.find(e => e.field === 'fullName').message}`);
        testsPass++;
      } else {
        console.log('❌ FAIL: No se detectó el error de fullName');
        testsFail++;
      }
    } else {
      console.log('❌ FAIL: Datos inválidos aceptados');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 3: Registro - email inválido
  // ==========================================
  console.log('\n3️⃣  registerValidation - Email inválido (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      fullName: 'María García',
      preferredName: 'María',
      email: 'email-invalido',  // Email inválido
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+1 234-567-8900',
      birthday: '1990-05-15',
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, invalidData);

    if (!result.success && result.errors) {
      const hasError = result.errors.some(e => e.field === 'email');
      if (hasError) {
        console.log('✅ PASS: Email inválido rechazado correctamente');
        console.log(`   Error: ${result.errors.find(e => e.field === 'email').message}`);
        testsPass++;
      } else {
        console.log('❌ FAIL: No se detectó el error de email');
        testsFail++;
      }
    } else {
      console.log('❌ FAIL: Email inválido aceptado');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 4: Registro - contraseña débil
  // ==========================================
  console.log('\n4️⃣  registerValidation - Contraseña débil (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      fullName: 'María García',
      preferredName: 'María',
      email: 'maria@example.com',
      password: 'password',  // Sin mayúsculas ni números
      confirmPassword: 'password',
      phone: '+1 234-567-8900',
      birthday: '1990-05-15',
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, invalidData);

    if (!result.success && result.errors) {
      const hasError = result.errors.some(e => e.field === 'password');
      if (hasError) {
        console.log('✅ PASS: Contraseña débil rechazada correctamente');
        console.log(`   Error: ${result.errors.find(e => e.field === 'password').message}`);
        testsPass++;
      } else {
        console.log('❌ FAIL: No se detectó el error de contraseña');
        testsFail++;
      }
    } else {
      console.log('❌ FAIL: Contraseña débil aceptada');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 5: Registro - contraseñas no coinciden
  // ==========================================
  console.log('\n5️⃣  registerValidation - Contraseñas no coinciden (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      fullName: 'María García',
      preferredName: 'María',
      email: 'maria@example.com',
      password: 'Password123',
      confirmPassword: 'Password456',  // No coincide
      phone: '+1 234-567-8900',
      birthday: '1990-05-15',
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, invalidData);

    if (!result.success && result.errors) {
      const hasError = result.errors.some(e => e.field === 'confirmPassword');
      if (hasError) {
        console.log('✅ PASS: Contraseñas no coinciden - rechazado correctamente');
        console.log(`   Error: ${result.errors.find(e => e.field === 'confirmPassword').message}`);
        testsPass++;
      } else {
        console.log('❌ FAIL: No se detectó que las contraseñas no coinciden');
        testsFail++;
      }
    } else {
      console.log('❌ FAIL: Contraseñas diferentes aceptadas');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 6: Registro - menor de edad
  // ==========================================
  console.log('\n6️⃣  registerValidation - Menor de 18 años (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const today = new Date();
    const minorBirthday = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

    const invalidData = {
      fullName: 'María García',
      preferredName: 'María',
      email: 'maria@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+1 234-567-8900',
      birthday: minorBirthday.toISOString().split('T')[0],  // Menor de edad
      city: 'Ciudad de México',
    };

    const result = await simulateRequest(registerValidation, invalidData);

    if (!result.success && result.errors) {
      const hasError = result.errors.some(e => e.field === 'birthday');
      if (hasError) {
        console.log('✅ PASS: Menor de edad rechazado correctamente');
        console.log(`   Error: ${result.errors.find(e => e.field === 'birthday').message}`);
        testsPass++;
      } else {
        console.log('❌ FAIL: No se detectó que es menor de edad');
        testsFail++;
      }
    } else {
      console.log('❌ FAIL: Menor de edad aceptado');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 7: Login válido
  // ==========================================
  console.log('\n7️⃣  loginValidation - Datos válidos (debe pasar)');
  console.log('-'.repeat(70));
  try {
    const validData = {
      email: 'maria@example.com',
      password: 'Password123',
    };

    const result = await simulateRequest(loginValidation, validData);

    if (result.success) {
      console.log('✅ PASS: Credenciales de login válidas aceptadas');
      testsPass++;
    } else {
      console.log('❌ FAIL: Credenciales válidas rechazadas');
      console.log('Errores:', result.errors);
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 8: Login - campos vacíos
  // ==========================================
  console.log('\n8️⃣  loginValidation - Campos vacíos (debe fallar)');
  console.log('-'.repeat(70));
  try {
    const invalidData = {
      email: '',
      password: '',
    };

    const result = await simulateRequest(loginValidation, invalidData);

    if (!result.success && result.errors && result.errors.length >= 2) {
      console.log('✅ PASS: Campos vacíos rechazados correctamente');
      console.log(`   Errores encontrados: ${result.errors.length}`);
      testsPass++;
    } else {
      console.log('❌ FAIL: Campos vacíos no detectados correctamente');
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 9: Forgot Password - email válido
  // ==========================================
  console.log('\n9️⃣  forgotPasswordValidation - Email válido (debe pasar)');
  console.log('-'.repeat(70));
  try {
    const validData = {
      email: 'maria@example.com',
    };

    const result = await simulateRequest(forgotPasswordValidation, validData);

    if (result.success) {
      console.log('✅ PASS: Email válido aceptado');
      testsPass++;
    } else {
      console.log('❌ FAIL: Email válido rechazado');
      console.log('Errores:', result.errors);
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // TEST 10: Reset Password - contraseñas válidas
  // ==========================================
  console.log('\n🔟 resetPasswordValidation - Contraseñas válidas (debe pasar)');
  console.log('-'.repeat(70));
  try {
    const validData = {
      password: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    };

    const result = await simulateRequest(resetPasswordValidation, validData);

    if (result.success) {
      console.log('✅ PASS: Contraseñas de reset válidas aceptadas');
      testsPass++;
    } else {
      console.log('❌ FAIL: Contraseñas válidas rechazadas');
      console.log('Errores:', result.errors);
      testsFail++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error inesperado:', error.message);
    testsFail++;
  }

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log('\n' + '=' .repeat(70));
  console.log(`\n📊 Resultados de Testing:\n`);
  console.log(`   ✅ Tests exitosos: ${testsPass}/10`);
  console.log(`   ❌ Tests fallidos: ${testsFail}/10`);

  if (testsFail === 0) {
    console.log('\n🎉 ¡TODAS LAS VALIDACIONES FUNCIONAN CORRECTAMENTE!\n');
    console.log('📋 Validaciones probadas:');
    console.log('   ✅ registerValidation - Registro completo');
    console.log('   ✅ loginValidation - Login de usuario');
    console.log('   ✅ forgotPasswordValidation - Recuperación de contraseña');
    console.log('   ✅ resetPasswordValidation - Reset de contraseña');
    console.log('\n✨ Auth Validators están listos para usar!\n');
  } else {
    console.log('\n⚠️  Algunas validaciones fallaron. Revisa la implementación.\n');
    process.exit(1);
  }
};

// Ejecutar tests
runTests().catch(error => {
  console.error('\n❌ Error crítico en testing:', error);
  process.exit(1);
});
