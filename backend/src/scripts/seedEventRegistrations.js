import dotenv from 'dotenv';
import mongoose from 'mongoose';
import EventRegistration from '../models/EventRegistration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para EventRegistrations - Entre Amigas
 * Crea registros de ejemplo para eventos
 *
 * NOTA: Este seed requiere que existan eventos y usuarios en la BD
 * Ejecutar primero: npm run seed:events
 */

const seedEventRegistrations = async () => {
  try {
    console.log('\n🌱 Iniciando seed de registros de eventos...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Verificar que existan eventos
    const events = await Event.find({ status: 'published', isActive: true }).limit(10);
    if (events.length === 0) {
      console.error('❌ No hay eventos en la base de datos.');
      console.log('   Por favor ejecuta primero: npm run seed:events\n');
      process.exit(1);
    }
    console.log(`✅ Encontrados ${events.length} eventos\n`);

    // 3. Buscar o crear usuarios de prueba
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
      });
      console.log(`✅ Usuario creado: ${testUser.email}\n`);
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email}\n`);
    }

    // Crear usuarios adicionales de prueba si no existen
    const additionalUsers = [
      {
        email: 'maria.garcia@example.com',
        fullName: 'María García',
        preferredName: 'María',
        password: 'Password123',
        phone: '+14165550101',
        birthday: new Date('1985-05-15'),
        city: 'Toronto',
      },
      {
        email: 'ana.martinez@example.com',
        fullName: 'Ana Martínez',
        preferredName: 'Ana',
        password: 'Password123',
        phone: '+14165550102',
        birthday: new Date('1992-08-20'),
        city: 'Toronto',
      },
      {
        email: 'lucia.rodriguez@example.com',
        fullName: 'Lucía Rodríguez',
        preferredName: 'Lucía',
        password: 'Password123',
        phone: '+14165550103',
        birthday: new Date('1988-03-10'),
        city: 'Toronto',
      },
      {
        email: 'sofia.hernandez@example.com',
        fullName: 'Sofía Hernández',
        preferredName: 'Sofía',
        password: 'Password123',
        phone: '+14165550104',
        birthday: new Date('1995-11-25'),
        city: 'Toronto',
      },
      {
        email: 'carmen.lopez@example.com',
        fullName: 'Carmen López',
        preferredName: 'Carmen',
        password: 'Password123',
        phone: '+14165550105',
        birthday: new Date('1990-07-08'),
        city: 'Toronto',
      },
    ];

    const users = [testUser];

    for (const userData of additionalUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create({
          ...userData,
          authProvider: 'local',
          isVerified: true,
        });
        console.log(`✅ Usuario adicional creado: ${user.email}`);
      }
      users.push(user);
    }
    console.log(`\n✅ Total de usuarios: ${users.length}\n`);

    // 4. Limpiar registros existentes (opcional - comentar si no quieres eliminar)
    const deleteCount = await EventRegistration.countDocuments();
    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} registros existentes...`);
      await EventRegistration.deleteMany({});

      // Resetear counters de eventos
      await Event.updateMany({}, { $set: { registeredCount: 0 } });
      console.log('✅ Registros anteriores eliminados y counters reseteados\n');
    }

    // 5. Crear registros de ejemplo para cada evento
    console.log('📝 Creando registros...\n');

    const registrations = [];
    let totalCreated = 0;

    for (const event of events) {
      // Calcular cuántos registros crear (basado en registeredCount del evento)
      const targetRegistrations = Math.min(
        event.registeredCount || Math.floor(Math.random() * event.capacity / 2),
        users.length,
        event.capacity
      );

      console.log(`📅 Evento: "${event.title}"`);
      console.log(`   Creando ${targetRegistrations} registros...`);

      // Seleccionar usuarios aleatorios para este evento
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
      const selectedUsers = shuffledUsers.slice(0, targetRegistrations);

      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];

        // Determinar status (90% confirmed, 10% cancelled)
        const status = Math.random() > 0.1 ? 'confirmed' : 'cancelled';

        // Fecha de registro (entre hace 1 y 30 días)
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const registeredAt = new Date();
        registeredAt.setDate(registeredAt.getDate() - daysAgo);

        const registration = {
          user: user._id,
          event: event._id,
          status,
          registeredAt,
        };

        // Si está cancelado, agregar fecha y razón de cancelación
        if (status === 'cancelled') {
          const cancelDaysAgo = Math.floor(Math.random() * daysAgo);
          const cancelledAt = new Date();
          cancelledAt.setDate(cancelledAt.getDate() - cancelDaysAgo);

          registration.cancelledAt = cancelledAt;
          registration.cancellationReason = [
            'Cambio de planes',
            'Conflicto de horario',
            'No puedo asistir',
            'Emergencia personal',
          ][Math.floor(Math.random() * 4)];
        }

        // Para eventos pasados, marcar asistencia aleatoria
        const eventDate = new Date(event.date);
        if (eventDate < new Date() && status === 'confirmed') {
          registration.attended = Math.random() > 0.2; // 80% asistieron
          if (registration.attended !== null) {
            registration.attendedAt = eventDate;
          }
        }

        // 30% de los registros confirmados tienen recordatorio enviado
        if (status === 'confirmed' && Math.random() > 0.7) {
          registration.reminderSent = true;
          const reminderDate = new Date(eventDate);
          reminderDate.setDate(reminderDate.getDate() - 1); // 1 día antes
          registration.reminderSentAt = reminderDate;
        }

        registrations.push(registration);
      }

      totalCreated += selectedUsers.length;
      console.log(`   ✅ ${selectedUsers.length} registros para "${event.title}"\n`);
    }

    // 6. Insertar registros en la base de datos
    // IMPORTANTE: Deshabilitar hooks para evitar duplicar incrementos
    // (los eventos ya tienen registeredCount del seed original)
    console.log('💾 Insertando registros en la base de datos...\n');

    // Insertar sin triggers de hooks
    const insertedRegistrations = await EventRegistration.insertMany(registrations, {
      ordered: false,
      rawResult: true
    });

    console.log(`✅ ${totalCreated} registros insertados exitosamente\n`);

    // 7. Mostrar resumen por evento
    console.log('📊 Resumen de registros por evento:\n');

    for (const event of events) {
      const stats = await EventRegistration.getAttendanceStats(event._id);
      const confirmedRegs = await EventRegistration.findByEvent(event._id, 'confirmed');

      console.log(`📅 ${event.title}`);
      console.log(`   Total registros: ${stats.total}`);
      console.log(`   Confirmados: ${stats.confirmed}`);
      console.log(`   Cancelados: ${stats.cancelled}`);

      if (stats.attended > 0 || stats.notAttended > 0) {
        console.log(`   Asistieron: ${stats.attended}`);
        console.log(`   No asistieron: ${stats.notAttended}`);
        console.log(`   Tasa asistencia: ${stats.attendanceRate}%`);
      }
      console.log('');
    }

    // 8. Mostrar estadísticas generales
    const generalStats = await EventRegistration.getStats();
    console.log('📈 Estadísticas generales:');
    console.log(`   Total registros: ${generalStats.total}`);
    console.log(`   Confirmados: ${generalStats.confirmed}`);
    console.log(`   Cancelados: ${generalStats.cancelled}`);
    console.log(`   Con recordatorio: ${generalStats.withReminder}`);
    console.log(`   Tasa cancelación: ${generalStats.cancellationRate}%`);
    console.log('');

    // 9. Mostrar registros del usuario de desarrollo
    console.log('👤 Registros del usuario dev@jappi.ca:\n');
    const userRegistrations = await EventRegistration.findByUser(testUser._id);

    userRegistrations.forEach((reg, index) => {
      if (reg.event) {
        console.log(`${index + 1}. ${reg.event.title}`);
        console.log(`   📅 Fecha: ${new Date(reg.event.date).toLocaleDateString()}`);
        console.log(`   ✅ Status: ${reg.status}`);
        console.log(`   📆 Registrado: ${new Date(reg.registeredAt).toLocaleDateString()}`);
        console.log('');
      }
    });

    console.log('✅ Seed de registros de eventos completado exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar seed
seedEventRegistrations();
