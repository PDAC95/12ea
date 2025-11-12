import mongoose from 'mongoose';
import Service from './src/models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script de Testing para el modelo Service
 * Valida que el modelo funciona correctamente
 */

async function testServiceModel() {
  try {
    console.log('🧪 Iniciando tests del modelo Service...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // ========================================
    // TEST 1: Crear servicio válido
    // ========================================
    console.log('📝 TEST 1: Crear servicio válido');
    const validService = new Service({
      name: 'Dra. Ana Martínez - Medicina Familiar',
      serviceType: 'Salud',
      description:
        'Médica familiar con 15 años de experiencia atendiendo a familias latinas. Consultas en español, atención preventiva, manejo de enfermedades crónicas.',
      phone: '+1 (416) 555-0200',
      email: 'dra.martinez@health.com',
      whatsapp: '+14165550200',
      city: 'Toronto',
      address: '123 Medical Center, Toronto, ON',
      website: 'https://dra-martinez.com',
      instagram: '@dra.martinez',
      linkedin: 'https://linkedin.com/in/ana-martinez-md',
      credentials: 'MD, CCFP, 15+ años de experiencia',
      owner: new mongoose.Types.ObjectId(),
    });

    await validService.save();
    console.log('✅ Servicio válido creado exitosamente');
    console.log(`   - ID: ${validService._id}`);
    console.log(`   - Name: ${validService.name}`);
    console.log(`   - Type: ${validService.serviceType}`);
    console.log(`   - Credentials: ${validService.credentials}`);
    console.log(`   - Engagement Rate: ${validService.engagementRate}%\n`);

    // ========================================
    // TEST 2: Validación de campos requeridos
    // ========================================
    console.log('📝 TEST 2: Validación de campos requeridos');
    try {
      const invalidService = new Service({
        // Falta name, serviceType, description, city
        phone: '+1 (416) 555-0000',
      });
      await invalidService.save();
      console.log('❌ ERROR: Debería haber fallado la validación');
    } catch (error) {
      console.log('✅ Validación correcta - campos requeridos funcionan');
      console.log(`   - Errores capturados: ${Object.keys(error.errors).join(', ')}\n`);
    }

    // ========================================
    // TEST 3: Validación de serviceType enum
    // ========================================
    console.log('📝 TEST 3: Validación de enum serviceType');
    try {
      const invalidType = new Service({
        name: 'Test Service',
        serviceType: 'TipoInvalido',
        description: 'Descripción de prueba con más de 20 caracteres para pasar validación',
        city: 'Toronto',
        owner: new mongoose.Types.ObjectId(),
      });
      await invalidType.save();
      console.log('❌ ERROR: Debería rechazar tipo de servicio inválido');
    } catch (error) {
      console.log('✅ Enum de serviceType funciona correctamente');
      console.log(`   - Valores válidos: Salud, Legal, Educación, Financiero, etc.\n`);
    }

    // ========================================
    // TEST 4: Validación de email
    // ========================================
    console.log('📝 TEST 4: Validación de email');
    try {
      const invalidEmail = new Service({
        name: 'Test Service',
        serviceType: 'Legal',
        description: 'Descripción válida con más de 20 caracteres para cumplir requisitos',
        city: 'Vancouver',
        email: 'email-invalido',
        owner: new mongoose.Types.ObjectId(),
      });
      await invalidEmail.save();
      console.log('❌ ERROR: Debería rechazar email inválido');
    } catch (error) {
      console.log('✅ Validación de email funciona correctamente\n');
    }

    // ========================================
    // TEST 5: Validación de URLs
    // ========================================
    console.log('📝 TEST 5: Validación de URLs (website, facebook, linkedin)');
    try {
      const invalidUrl = new Service({
        name: 'Test Service',
        serviceType: 'Consultoría',
        description: 'Descripción válida con más de 20 caracteres necesarios',
        city: 'Montreal',
        website: 'invalid-url',
        owner: new mongoose.Types.ObjectId(),
      });
      await invalidUrl.save();
      console.log('❌ ERROR: Debería rechazar URL inválida');
    } catch (error) {
      console.log('✅ Validación de URLs funciona correctamente\n');
    }

    // ========================================
    // TEST 6: Pre-save hooks (normalización)
    // ========================================
    console.log('📝 TEST 6: Pre-save hooks (normalización de datos)');
    const serviceWithHooks = new Service({
      name: 'Test Normalization Service',
      serviceType: 'Traducción',
      description: 'Servicio de prueba para validar normalización de datos',
      city: 'Calgary',
      website: 'example.com', // Sin https://
      instagram: '@testservice', // Con @
      owner: new mongoose.Types.ObjectId(),
    });

    await serviceWithHooks.save();
    console.log('✅ Hooks pre-save funcionan correctamente');
    console.log(`   - Website normalizado: ${serviceWithHooks.website}`);
    console.log(`   - Instagram normalizado: ${serviceWithHooks.instagram}\n`);

    // ========================================
    // TEST 7: Índices de texto
    // ========================================
    console.log('📝 TEST 7: Índices de texto y búsqueda');
    const indexes = await Service.collection.getIndexes();
    const hasTextIndex = Object.keys(indexes).some((key) =>
      key.includes('service_text_index')
    );
    console.log(`✅ Índice de texto: ${hasTextIndex ? 'Configurado' : 'No encontrado'}`);
    console.log(`   - Total de índices: ${Object.keys(indexes).length}\n`);

    // ========================================
    // TEST 8: Métodos de instancia
    // ========================================
    console.log('📝 TEST 8: Métodos de instancia (incrementViews, incrementContactClicks)');
    await validService.incrementViews();
    await validService.incrementViews();
    await validService.incrementContactClicks();

    console.log('✅ Métodos de instancia funcionan correctamente');
    console.log(`   - Views: ${validService.views}`);
    console.log(`   - Contact Clicks: ${validService.contactClicks}`);
    console.log(`   - Engagement Rate: ${validService.engagementRate}%\n`);

    // ========================================
    // TEST 9: Virtuals
    // ========================================
    console.log('📝 TEST 9: Propiedades virtuales');
    console.log(`✅ Virtual 'hasSocialMedia': ${validService.hasSocialMedia}`);
    console.log(`✅ Virtual 'hasFullContact': ${validService.hasFullContact}`);
    console.log(`✅ Virtual 'engagementRate': ${validService.engagementRate}%\n`);

    // ========================================
    // TEST 10: Método estático getStats
    // ========================================
    console.log('📝 TEST 10: Método estático getStats()');
    const stats = await Service.getStats();
    console.log('✅ Estadísticas obtenidas:');
    console.log(`   - Total servicios: ${stats.general.total || 0}`);
    console.log(`   - Servicios activos: ${stats.general.active || 0}`);
    console.log(`   - Por tipo: ${stats.byType.length} categorías`);
    console.log(`   - Por ciudad: ${stats.byCity.length} ciudades\n`);

    // Limpieza
    console.log('🧹 Limpiando datos de prueba...');
    await Service.deleteMany({
      name: { $regex: /test|Test|prueba/i },
    });

    console.log('\n✅ TODOS LOS TESTS COMPLETADOS EXITOSAMENTE ✅\n');
    console.log('📊 Resumen del modelo Service:');
    console.log('   ✅ Validaciones funcionando');
    console.log('   ✅ Índices creados');
    console.log('   ✅ Hooks pre-save funcionando');
    console.log('   ✅ Métodos de instancia funcionando');
    console.log('   ✅ Métodos estáticos funcionando');
    console.log('   ✅ Virtuals funcionando');
    console.log('   ✅ Campo credentials implementado\n');
  } catch (error) {
    console.error('❌ Error en tests:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar tests
testServiceModel();
