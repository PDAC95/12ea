import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Business from '../models/Business.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para Business con Sistema de Aprobación - Entre Amigas
 * Crea negocios con diferentes estados: pending, approved, rejected
 */

const seedPendingBusinesses = async () => {
  try {
    console.log('\n🌱 Iniciando seed de negocios con sistema de aprobación...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar usuarios (dev y admin)
    let testUser = await User.findOne({ email: 'dev@jappi.ca' });
    let adminUser = await User.findOne({ role: 'admin' });

    if (!testUser) {
      console.log('⚠️  Usuario de prueba no encontrado, creando uno nuevo...');
      testUser = await User.create({
        fullName: 'Usuario de Desarrollo',
        preferredName: 'Dev User',
        email: 'dev@jappi.ca',
        password: 'Password123',
        phone: '+1234567890',
        birthday: new Date('1990-01-01'),
        city: 'Toronto',
        authProvider: 'local',
        isVerified: true,
        role: 'user',
      });
      console.log(`✅ Usuario de prueba creado: ${testUser.email}\n`);
    } else {
      console.log(`✅ Usuario de prueba encontrado: ${testUser.email}\n`);
    }

    if (!adminUser) {
      console.log('⚠️  Usuario admin no encontrado, usando usuario de prueba como admin...');
      adminUser = testUser;
    } else {
      console.log(`✅ Usuario admin encontrado: ${adminUser.email}\n`);
    }

    // 3. Limpiar solo los negocios de prueba (status pending/rejected)
    const deleteCount = await Business.countDocuments({
      $or: [
        { status: 'pending' },
        { status: 'rejected' },
        { name: { $regex: /Propuesta|Test/ } }
      ]
    });

    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} negocios de prueba anteriores...`);
      await Business.deleteMany({
        $or: [
          { status: 'pending' },
          { status: 'rejected' },
          { name: { $regex: /Propuesta|Test/ } }
        ]
      });
      console.log('✅ Negocios de prueba anteriores eliminados\n');
    }

    // 4. Crear negocios con diferentes estados
    const pendingBusinesses = [
      // ========================================
      // NEGOCIOS PENDIENTES (3)
      // ========================================
      {
        name: 'Panadería Artesanal La Esperanza',
        category: 'Gastronomía',
        description: 'Panadería artesanal especializada en pan dulce mexicano, conchas, orejas, polvorones y pan de muerto en temporada. Todos nuestros productos son elaborados con ingredientes naturales y recetas tradicionales transmitidas de generación en generación.',
        phone: '+1 (416) 555-9001',
        email: 'info@panaderiaesperanza.ca',
        whatsapp: '+14165559001',
        city: 'Toronto',
        address: '1234 Dundas St W, Toronto, ON M6J 1X5',
        website: 'panaderiaesperanza.ca',
        instagram: '@panaderia_esperanza',
        facebook: 'panaderiaesperanza',
        owner: testUser._id,
        submittedBy: testUser._id,
        status: 'pending',
        isActive: false,
        isVerified: false,
        isFeatured: false,
      },
      {
        name: 'Centro de Yoga y Meditación Namaste',
        category: 'Belleza y Bienestar',
        description: 'Centro de yoga y meditación con enfoque holístico para el bienestar integral. Ofrecemos clases de Hatha Yoga, Vinyasa, Yoga prenatal y meditación guiada. Instructoras certificadas con más de 10 años de experiencia. Primera clase gratis.',
        phone: '+1 (604) 555-9002',
        email: 'contacto@yoganamaste.ca',
        whatsapp: '+16045559002',
        city: 'Vancouver',
        address: '567 Main St, Vancouver, BC V6A 2V1',
        website: 'https://www.yoganamaste.ca',
        instagram: 'yoganamaste_van',
        owner: testUser._id,
        submittedBy: testUser._id,
        status: 'pending',
        isActive: false,
        isVerified: false,
        isFeatured: false,
      },
      {
        name: 'Asesoría Legal para Inmigrantes',
        category: 'Consultoría',
        description: 'Servicios legales especializados en inmigración canadiense: permisos de trabajo, residencia permanente, reunificación familiar, solicitudes de refugio y ciudadanía. Abogada certificada RCIC con 15 años de experiencia. Consulta inicial sin costo.',
        phone: '+1 (514) 555-9003',
        email: 'abogada@inmigracioncanada.ca',
        whatsapp: '+15145559003',
        city: 'Montreal',
        address: '890 Rue Saint-Jacques, Montreal, QC H3C 1G1',
        website: 'https://inmigracioncanada.ca',
        instagram: '@asesoria_legal_mtl',
        facebook: 'https://facebook.com/asesorialegalinmigrantes',
        owner: testUser._id,
        submittedBy: testUser._id,
        status: 'pending',
        isActive: false,
        isVerified: false,
        isFeatured: false,
      },

      // ========================================
      // NEGOCIOS APROBADOS (2)
      // ========================================
      {
        name: 'Florería Jardín de Rosas',
        category: 'Artesanías',
        description: 'Florería boutique con arreglos florales personalizados para toda ocasión: bodas, cumpleaños, aniversarios y eventos corporativos. Flores frescas importadas y locales. Servicio de entrega a domicilio en el mismo día.',
        phone: '+1 (416) 555-9004',
        email: 'pedidos@jardinderosas.ca',
        whatsapp: '+14165559004',
        city: 'Toronto',
        address: '2345 Queen St E, Toronto, ON M4E 1G3',
        website: 'https://www.jardinderosas.ca',
        instagram: '@jardin_de_rosas',
        facebook: 'jardinderosastoronto',
        logo: 'https://entre-amigas-dev.s3.us-east-1.amazonaws.com/defaults/business-placeholder.png',
        owner: testUser._id,
        submittedBy: testUser._id,
        approvedBy: adminUser._id,
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Aprobado hace 5 días
        status: 'approved',
        isActive: true,
        isVerified: true,
        isFeatured: false,
        views: 87,
        contactClicks: 12,
      },
      {
        name: 'Estudio de Fotografía Momentos',
        category: 'Fotografía y Video',
        description: 'Estudio profesional de fotografía especializado en sesiones familiares, retratos, eventos y fotografía de producto. Fotógrafa con 8 años de experiencia. Paquetes personalizados que incluyen edición profesional y álbum digital. Sesión de prueba con descuento.',
        phone: '+1 (604) 555-9005',
        email: 'hola@estudiomomemtos.ca',
        whatsapp: '+16045559005',
        city: 'Vancouver',
        address: '678 Commercial Dr, Vancouver, BC V5L 3Y2',
        website: 'estudiomomentos.ca',
        instagram: '@estudio_momentos',
        owner: testUser._id,
        submittedBy: testUser._id,
        approvedBy: adminUser._id,
        approvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Aprobado hace 10 días
        status: 'approved',
        isActive: true,
        isVerified: false,
        isFeatured: false,
        views: 123,
        contactClicks: 21,
      },

      // ========================================
      // NEGOCIO RECHAZADO (1)
      // ========================================
      {
        name: 'Venta de Productos Varios',
        category: 'Moda y Accesorios',
        description: 'Venta de ropa usada y accesorios. Precios bajos. Contactar por WhatsApp.',
        phone: '+1 (514) 555-9006',
        whatsapp: '+15145559006',
        city: 'Montreal',
        owner: testUser._id,
        submittedBy: testUser._id,
        approvedBy: adminUser._id,
        approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Rechazado hace 3 días
        status: 'rejected',
        rejectionReason: 'La descripción del negocio no proporciona suficiente información sobre los productos y servicios ofrecidos. Por favor, incluye detalles específicos sobre qué tipo de ropa y accesorios vendes, marcas, condiciones, política de devoluciones, etc. También falta información de contacto completa (email, dirección física o virtual).',
        isActive: false,
        isVerified: false,
        isFeatured: false,
      },
    ];

    // 5. Insertar negocios en la base de datos
    console.log('📝 Insertando negocios...\n');
    const insertedBusinesses = await Business.insertMany(pendingBusinesses);

    // 6. Mostrar resumen
    console.log('✅ Seed completado exitosamente!\n');
    console.log('📊 RESUMEN DE NEGOCIOS CREADOS:\n');

    const pendingCount = insertedBusinesses.filter(b => b.status === 'pending').length;
    const approvedCount = insertedBusinesses.filter(b => b.status === 'approved').length;
    const rejectedCount = insertedBusinesses.filter(b => b.status === 'rejected').length;

    console.log(`   ⏳ Pendientes:  ${pendingCount} negocios`);
    console.log(`   ✅ Aprobados:   ${approvedCount} negocios`);
    console.log(`   ❌ Rechazados:  ${rejectedCount} negocios`);
    console.log(`   📦 TOTAL:       ${insertedBusinesses.length} negocios\n`);

    // Mostrar detalles por estado
    console.log('📋 NEGOCIOS PENDIENTES:');
    insertedBusinesses
      .filter(b => b.status === 'pending')
      .forEach(b => {
        console.log(`   - ${b.name} (${b.category}) - ${b.city}`);
      });

    console.log('\n✅ NEGOCIOS APROBADOS:');
    insertedBusinesses
      .filter(b => b.status === 'approved')
      .forEach(b => {
        console.log(`   - ${b.name} (${b.category}) - ${b.city}`);
      });

    console.log('\n❌ NEGOCIOS RECHAZADOS:');
    insertedBusinesses
      .filter(b => b.status === 'rejected')
      .forEach(b => {
        console.log(`   - ${b.name} (${b.category}) - ${b.city}`);
        console.log(`     Razón: ${b.rejectionReason.substring(0, 80)}...`);
      });

    console.log('\n✨ Seed finalizado correctamente!\n');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error('\nDetalles del error:');
    console.error(error.message);

    if (error.errors) {
      console.error('\nErrores de validación:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }

    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar seed
seedPendingBusinesses();
