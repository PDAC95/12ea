import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para Events - Entre Amigas
 * Crea eventos de ejemplo en la base de datos
 */

const seedEvents = async () => {
  try {
    console.log('\n🌱 Iniciando seed de eventos...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar o crear usuario de prueba (organizador de los eventos)
    let testUser = await User.findOne({ email: 'dev@jappi.ca' });

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
        role: 'admin',
      });
      console.log(`✅ Usuario creado: ${testUser.email}\n`);
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email}\n`);
    }

    // 3. Limpiar eventos existentes (opcional - comentar si no quieres eliminar)
    const deleteCount = await Event.countDocuments();
    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} eventos existentes...`);
      await Event.deleteMany({});
      console.log('✅ Eventos anteriores eliminados\n');
    }

    // 4. Calcular fechas futuras para los eventos
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const twoWeeks = new Date(today);
    twoWeeks.setDate(twoWeeks.getDate() + 14);

    const threeWeeks = new Date(today);
    threeWeeks.setDate(threeWeeks.getDate() + 21);

    const oneMonth = new Date(today);
    oneMonth.setMonth(oneMonth.getMonth() + 1);

    // 5. Definir eventos de ejemplo
    const events = [
      // ========================================
      // EVENTOS VIRTUALES
      // ========================================
      {
        title: 'Círculo de Mujeres: Encuentro de Conexión y Sanación',
        description: 'Únete a nuestro círculo mensual donde mujeres migrantes se reúnen para compartir experiencias, conectar desde el corazón y apoyarse mutuamente. Un espacio seguro para expresar emociones, celebrar logros y encontrar hermandad. Incluye meditación guiada, sharing circle y ejercicios de gratitud. Facilitado por María González, coach de bienestar emocional.',
        date: nextWeek,
        time: '19:00',
        mode: 'virtual',
        location: null,
        link: 'https://zoom.us/j/123456789',
        capacity: 25,
        registeredCount: 12,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: true,
        views: 145,
      },
      {
        title: 'Taller de Finanzas Personales para Mujeres Emprendedoras',
        description: 'Aprende a manejar las finanzas de tu negocio de manera efectiva. Temas: presupuesto, ahorro, inversión, impuestos en Canadá, cuentas bancarias para negocios y estrategias de crecimiento financiero. Ideal para emprendedoras que quieren llevar su negocio al siguiente nivel. Impartido por Laura Martínez, contadora certificada.',
        date: twoWeeks,
        time: '18:30',
        mode: 'virtual',
        location: null,
        link: 'https://meet.google.com/abc-defg-hij',
        capacity: 30,
        registeredCount: 8,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: false,
        views: 78,
      },
      {
        title: 'Yoga y Meditación: Encuentra tu Paz Interior',
        description: 'Sesión de yoga suave y meditación mindfulness diseñada especialmente para mujeres que necesitan un momento de pausa y autocuidado. Apto para todos los niveles, no se requiere experiencia previa. Incluye técnicas de respiración, posturas restaurativas y meditación guiada. Trae tu mat y ropa cómoda. Facilitado por Sofía Ramírez, instructora certificada.',
        date: tomorrow,
        time: '08:00',
        mode: 'virtual',
        location: null,
        link: 'https://zoom.us/j/987654321',
        capacity: 20,
        registeredCount: 18,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: true,
        views: 203,
      },

      // ========================================
      // EVENTOS PRESENCIALES
      // ========================================
      {
        title: 'Networking Brunch: Conecta con Mujeres Profesionales',
        description: 'Disfruta de un delicioso brunch mientras conectas con otras mujeres profesionales y emprendedoras. Ambiente relajado para hacer networking, compartir oportunidades laborales y crear alianzas. Incluye coffee break, actividades rompe-hielo y sesión de speed networking. ¡Trae tus tarjetas de presentación!',
        date: threeWeeks,
        time: '10:00',
        mode: 'presencial',
        location: 'The Social Café, 123 Queen St W, Toronto, ON',
        link: null,
        capacity: 40,
        registeredCount: 22,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: true,
        views: 167,
      },
      {
        title: 'Clase de Salsa y Bachata: Baila y Libera el Estrés',
        description: 'Ven a bailar salsa y bachata en un ambiente divertido y sin juicios. No necesitas pareja ni experiencia previa. Aprenderás pasos básicos, giros y coreografías sencillas mientras te diviertes y haces ejercicio. Perfecto para socializar y conocer nuevas amigas. Instructor: Carlos Reyes, bailarín profesional.',
        date: nextWeek,
        time: '19:30',
        mode: 'presencial',
        location: 'Dance Studio Toronto, 456 Dundas St E, Toronto, ON',
        link: null,
        capacity: 35,
        registeredCount: 28,
        image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: false,
        views: 134,
      },
      {
        title: 'Mercadito de Emprendedoras: Vende y Compra Local',
        description: 'Evento mensual donde emprendedoras latinas pueden vender sus productos: comida, artesanías, joyería, ropa, servicios de belleza y más. Si quieres tener un puesto, contáctanos. Si quieres apoyar negocios de mujeres, ¡ven a comprar! Ambiente familiar, música latina y food trucks. ¡Entrada gratuita!',
        date: oneMonth,
        time: '11:00',
        mode: 'presencial',
        location: 'Trinity Bellwoods Park, 790 Queen St W, Toronto, ON',
        link: null,
        capacity: 100,
        registeredCount: 45,
        image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: false,
        views: 289,
      },

      // ========================================
      // EVENTOS HÍBRIDOS
      // ========================================
      {
        title: 'Charla: Navegando el Sistema de Inmigración Canadiense',
        description: 'Sesión informativa sobre procesos de inmigración en Canadá: permisos de trabajo, residencia permanente, sponsorship familiar y ciudadanía. Abogada de inmigración responderá preguntas en vivo. Disponible presencial en Toronto o virtual vía Zoom. Incluye material descargable con recursos útiles y checklist.',
        date: twoWeeks,
        time: '18:00',
        mode: 'híbrido',
        location: 'Toronto Public Library - Reference Library, 789 Yonge St, Toronto, ON',
        link: 'https://zoom.us/j/555666777',
        capacity: 60,
        registeredCount: 32,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: false,
        views: 198,
      },
      {
        title: 'Taller de Cocina Latinoamericana: Arepas y Empanadas',
        description: 'Aprende a preparar arepas venezolanas y empanadas argentinas desde cero. Clase práctica donde cocinaremos juntas (presencial) o desde tu cocina (virtual). Incluye recetas, tips para hacer masa perfecta y rellenos deliciosos. Al final, compartiremos lo que cocinamos. ¡Una experiencia culinaria única!',
        date: threeWeeks,
        time: '16:00',
        mode: 'híbrido',
        location: 'Community Kitchen, 321 College St, Toronto, ON',
        link: 'https://meet.google.com/xyz-abcd-efg',
        capacity: 25,
        registeredCount: 15,
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
        organizer: testUser._id,
        status: 'published',
        isActive: true,
        isFeatured: false,
        views: 112,
      },
    ];

    // 6. Insertar eventos en la base de datos
    console.log('📝 Insertando eventos...\n');
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ ${insertedEvents.length} eventos insertados exitosamente\n`);

    // 7. Mostrar resumen de eventos creados
    console.log('📊 Resumen de eventos creados:\n');
    insertedEvents.forEach((event, index) => {
      const spots = event.capacity - event.registeredCount;
      const occupancy = ((event.registeredCount / event.capacity) * 100).toFixed(0);
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   📅 Fecha: ${event.date.toLocaleDateString()} a las ${event.time}`);
      console.log(`   📍 Modalidad: ${event.mode}`);
      console.log(`   👥 Ocupación: ${event.registeredCount}/${event.capacity} (${occupancy}%) - ${spots} cupos disponibles`);
      console.log(`   ${event.isFeatured ? '⭐ DESTACADO' : ''}`);
      console.log('');
    });

    // 8. Mostrar estadísticas generales
    const stats = await Event.getStats();
    console.log('📈 Estadísticas generales:');
    console.log(`   Total de eventos: ${stats.total}`);
    console.log(`   Eventos próximos: ${stats.upcoming}`);
    console.log(`   Eventos pasados: ${stats.past}`);
    console.log('');
    console.log('   Por modalidad:');
    stats.byMode.forEach(mode => {
      console.log(`   - ${mode._id}: ${mode.count} eventos`);
    });
    console.log('');
    console.log(`   Capacidad total: ${stats.capacity.total} personas`);
    console.log(`   Registros totales: ${stats.capacity.registered} personas`);
    console.log(`   Cupos disponibles: ${stats.capacity.total - stats.capacity.registered} personas`);
    console.log('');

    console.log('✅ Seed de eventos completado exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar seed
seedEvents();
