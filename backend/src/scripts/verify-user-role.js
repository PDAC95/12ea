import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config';

/**
 * Script de Verificación: Campo role en User Model
 * Verifica que el campo role cumple con todos los criterios de Task 3.5-DB-1
 */

const verifyUserRole = async () => {
  try {
    console.log('\n🔍 VERIFICANDO CAMPO ROLE EN USER MODEL\n');
    console.log('='.repeat(60));

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener el schema de User
    const schema = User.schema.obj;
    const roleField = schema.role;

    console.log('📋 CRITERIOS DE ACEPTACIÓN:\n');

    // Criterio 1: Campo role existe
    const criterion1 = roleField !== undefined;
    console.log(`${criterion1 ? '✅' : '❌'} 1. Campo role existe: ${criterion1}`);

    // Criterio 2: Enum correcto
    const hasCorrectEnum =
      roleField?.enum?.values?.includes('user') &&
      roleField?.enum?.values?.includes('admin') &&
      roleField?.enum?.values?.length === 2;
    console.log(`${hasCorrectEnum ? '✅' : '❌'} 2. Enum ['user', 'admin']: ${hasCorrectEnum}`);
    if (hasCorrectEnum) {
      console.log(`   → Valores: [${roleField.enum.values.map(v => `'${v}'`).join(', ')}]`);
    }

    // Criterio 3: Default correcto
    const hasCorrectDefault = roleField?.default === 'user';
    console.log(`${hasCorrectDefault ? '✅' : '❌'} 3. Default 'user': ${hasCorrectDefault}`);

    // Criterio 4: Campo es requerido
    const isRequired =
      roleField?.required === true ||
      (Array.isArray(roleField?.required) && roleField.required[0] === true);
    console.log(`${isRequired ? '✅' : '❌'} 4. Campo es requerido: ${isRequired}`);

    console.log('\n' + '='.repeat(60));

    // Resumen
    const allPassed = criterion1 && hasCorrectEnum && hasCorrectDefault && isRequired;

    if (allPassed) {
      console.log('✅ TODOS LOS CRITERIOS CUMPLIDOS\n');
    } else {
      console.log('❌ ALGUNOS CRITERIOS NO SE CUMPLEN\n');
      process.exit(1);
    }

    // Testing práctico: Intentar crear usuario sin role (debe usar default)
    console.log('🧪 TESTING PRÁCTICO:\n');

    // Test 1: Usuario sin especificar role (debe usar default 'user')
    console.log('Test 1: Crear usuario sin especificar role...');
    const testUser1 = new User({
      fullName: 'Test User Default Role',
      preferredName: 'Test',
      email: 'test-role-default@test.com',
      password: 'TestPassword123',
      phone: '1234567890',
      birthday: new Date('1990-01-01'),
      city: 'Toronto',
    });

    await testUser1.validate(); // Solo validar, no guardar
    console.log(`✅ Role asignado automáticamente: '${testUser1.role}' (esperado: 'user')`);

    // Test 2: Usuario con role 'admin'
    console.log('\nTest 2: Crear usuario con role admin...');
    const testUser2 = new User({
      fullName: 'Test Admin User',
      preferredName: 'Admin',
      email: 'test-role-admin@test.com',
      password: 'AdminPassword123',
      phone: '0987654321',
      birthday: new Date('1985-05-15'),
      city: 'Vancouver',
      role: 'admin',
    });

    await testUser2.validate();
    console.log(`✅ Role asignado correctamente: '${testUser2.role}' (esperado: 'admin')`);

    // Test 3: Intentar crear usuario con role inválido (debe fallar)
    console.log('\nTest 3: Intentar crear usuario con role inválido...');
    try {
      const testUser3 = new User({
        fullName: 'Test Invalid Role',
        preferredName: 'Invalid',
        email: 'test-role-invalid@test.com',
        password: 'InvalidPassword123',
        phone: '5555555555',
        birthday: new Date('1992-03-20'),
        city: 'Calgary',
        role: 'superadmin', // Rol inválido
      });

      await testUser3.validate();
      console.log('❌ FALLO: Debió rechazar rol inválido');
      process.exit(1);
    } catch (error) {
      console.log(`✅ Validación correcta: ${error.message}`);
    }

    // Test 4: Intentar crear usuario con role null (debe fallar porque es required)
    console.log('\nTest 4: Intentar crear usuario con role null...');
    try {
      const testUser4 = new User({
        fullName: 'Test Null Role',
        preferredName: 'Null',
        email: 'test-role-null@test.com',
        password: 'NullPassword123',
        phone: '4444444444',
        birthday: new Date('1988-08-08'),
        city: 'Montreal',
        role: null, // Explícitamente null
      });

      await testUser4.validate();
      console.log('❌ FALLO: Debió rechazar role null (campo requerido)');
      process.exit(1);
    } catch (error) {
      console.log(`✅ Validación correcta: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TODOS LOS TESTS PASARON EXITOSAMENTE\n');

    // Detalles del schema completo
    console.log('📄 CONFIGURACIÓN FINAL DEL CAMPO ROLE:\n');
    console.log(JSON.stringify({
      type: 'String',
      enum: roleField.enum.values,
      default: roleField.default,
      required: Array.isArray(roleField.required) ? roleField.required[0] : roleField.required,
      message: roleField.enum.message,
    }, null, 2));

    console.log('\n✅ VERIFICACIÓN COMPLETA - Task 3.5-DB-1 CUMPLIDA\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante verificación:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar verificación
verifyUserRole();
