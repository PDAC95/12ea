import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Business from './src/models/Business.js';
import User from './src/models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Script de Testing para Business Model
 * Prueba la creación de un negocio en MongoDB
 */

const testBusinessModel = async () => {
  try {
    console.log('\n🧪 Iniciando test del modelo Business...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar o crear un usuario de prueba (owner del negocio)
    console.log('📝 Paso 1: Buscando usuario de prueba...');
    let testUser = await User.findOne({ email: 'dev@jappi.ca' });

    if (!testUser) {
      console.log('⚠️  Usuario de prueba no encontrado, creando uno nuevo...');
      testUser = await User.create({
        fullName: 'Usuario de Prueba',
        preferredName: 'Test User',
        email: 'dev@jappi.ca',
        password: 'Password123',
        phone: '+1234567890',
        birthday: new Date('1990-01-01'),
        city: 'Toronto',
        authProvider: 'local',
        isVerified: true,
      });
      console.log(`✅ Usuario creado: ${testUser.email} (${testUser._id})\n`);
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email} (${testUser._id})\n`);
    }

    // 2. Crear un negocio de prueba
    console.log('📝 Paso 2: Creando negocio de prueba...');
    const testBusiness = new Business({
      name: 'Sabores de Casa',
      category: 'Gastronomía',
      description:
        'Restaurante familiar que ofrece auténtica comida latinoamericana preparada con recetas tradicionales. Especializados en empanadas, arepas y platos típicos de Colombia y Venezuela.',
      phone: '+1 (416) 555-0123',
      email: 'sabores@example.com',
      whatsapp: '+14165550123',
      city: 'Toronto',
      address: '123 Queen St W, Toronto, ON M5H 2M9',
      website: 'saboresdecasa.com',
      instagram: '@saboresdecasa',
      facebook: 'https://facebook.com/saboresdecasa',
      logo: 'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/logos/sabores-logo.png',
      images: [
        'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/images/sabores-1.jpg',
        'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/images/sabores-2.jpg',
      ],
      owner: testUser._id,
      isActive: true,
      isVerified: true,
      isFeatured: true,
    });

    const savedBusiness = await testBusiness.save();
    console.log(`✅ Negocio creado exitosamente: ${savedBusiness.name} (${savedBusiness._id})\n`);

    // 3. Verificar que el negocio fue guardado correctamente
    console.log('📝 Paso 3: Verificando datos guardados...');
    const foundBusiness = await Business.findById(savedBusiness._id).populate(
      'owner',
      'preferredName email'
    );

    console.log('✅ Negocio encontrado en DB:');
    console.log(`   - Nombre: ${foundBusiness.name}`);
    console.log(`   - Categoría: ${foundBusiness.category}`);
    console.log(`   - Ciudad: ${foundBusiness.city}`);
    console.log(`   - Owner: ${foundBusiness.owner.preferredName} (${foundBusiness.owner.email})`);
    console.log(`   - Activo: ${foundBusiness.isActive}`);
    console.log(`   - Verificado: ${foundBusiness.isVerified}`);
    console.log(`   - Destacado: ${foundBusiness.isFeatured}`);
    console.log(`   - Vistas: ${foundBusiness.views}`);
    console.log(`   - Clics: ${foundBusiness.contactClicks}\n`);

    // 4. Probar métodos de instancia
    console.log('📝 Paso 4: Probando métodos de instancia...');
    await foundBusiness.incrementViews();
    await foundBusiness.incrementContactClicks();
    console.log(`✅ Vistas incrementadas: ${foundBusiness.views}`);
    console.log(`✅ Clics incrementados: ${foundBusiness.contactClicks}\n`);

    // 5. Probar métodos estáticos
    console.log('📝 Paso 5: Probando métodos estáticos...');
    const businessesByCity = await Business.findActiveByCity('Toronto');
    console.log(`✅ Negocios activos en Toronto: ${businessesByCity.length}`);

    const businessesByCategory = await Business.findActiveByCategory('Gastronomía');
    console.log(`✅ Negocios en categoría Gastronomía: ${businessesByCategory.length}`);

    const featuredBusinesses = await Business.findFeatured(3);
    console.log(`✅ Negocios destacados: ${featuredBusinesses.length}`);

    const ownerBusinesses = await Business.findByOwner(testUser._id);
    console.log(`✅ Negocios del owner: ${ownerBusinesses.length}\n`);

    // 6. Probar búsqueda de texto
    console.log('📝 Paso 6: Probando búsqueda de texto...');
    const searchResults = await Business.searchText('empanadas');
    console.log(`✅ Resultados de búsqueda "empanadas": ${searchResults.length}\n`);

    // 7. Obtener estadísticas
    console.log('📝 Paso 7: Obteniendo estadísticas...');
    const stats = await Business.getStats();
    console.log('✅ Estadísticas de negocios:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Activos: ${stats.active}`);
    console.log(`   - Verificados: ${stats.verified}`);
    console.log(`   - Destacados: ${stats.featured}`);
    console.log('   - Por categoría:', stats.byCategory);
    console.log('   - Por ciudad:', stats.byCity);
    console.log('\n');

    // 8. Probar virtuals
    console.log('📝 Paso 8: Probando virtuals...');
    console.log(`✅ Tasa de engagement: ${foundBusiness.engagementRate}%`);
    console.log(`✅ Tiene redes sociales: ${foundBusiness.hasSocialMedia}`);
    console.log(`✅ Tiene info de contacto completa: ${foundBusiness.hasFullContact}\n`);

    // 9. Probar getPublicProfile
    console.log('📝 Paso 9: Probando getPublicProfile...');
    const publicProfile = foundBusiness.getPublicProfile();
    console.log('✅ Perfil público:', JSON.stringify(publicProfile, null, 2));
    console.log('\n');

    console.log('✅ TODOS LOS TESTS PASARON EXITOSAMENTE ✅\n');

    // Cleanup (opcional - comentar si quieres mantener los datos)
    console.log('🧹 Limpiando datos de prueba...');
    await Business.findByIdAndDelete(savedBusiness._id);
    console.log('✅ Negocio de prueba eliminado\n');

  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('👋 Conexión a MongoDB cerrada\n');
    process.exit(0);
  }
};

// Ejecutar test
testBusinessModel();
