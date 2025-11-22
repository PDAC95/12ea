import mongoose from 'mongoose';
import Business from '../models/Business.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener el directorio raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: join(rootDir, '.env') });

/**
 * Script de Migración: Aprobar negocios existentes
 *
 * Este script actualiza todos los negocios que NO tienen el campo status
 * o que están en 'pending' para marcarlos como 'approved'.
 *
 * Útil para migrar negocios creados antes de implementar el sistema de aprobación.
 */

const migrateBusinesses = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    console.log('🔄 Iniciando migración de negocios...\n');

    // Contar negocios antes
    const totalBefore = await Business.countDocuments();
    const approvedBefore = await Business.countDocuments({ status: 'approved' });
    const pendingBefore = await Business.countDocuments({ status: 'pending' });

    console.log('📊 ESTADO ANTES DE LA MIGRACIÓN:');
    console.log('='.repeat(60));
    console.log(`Total de negocios:      ${totalBefore}`);
    console.log(`✅ Aprobados:           ${approvedBefore}`);
    console.log(`⏳ Pendientes:          ${pendingBefore}`);
    console.log('='.repeat(60));
    console.log('');

    // Actualizar todos los negocios 'pending' a 'approved'
    // EXCEPTO los que fueron explícitamente rechazados o aprobados recientemente
    const result = await Business.updateMany(
      {
        status: 'pending',
        // Solo migrar negocios viejos (creados antes de hoy)
        createdAt: { $lt: new Date(new Date().setHours(0, 0, 0, 0)) }
      },
      {
        $set: {
          status: 'approved',
          // Opcional: agregar nota de migración
          // migrated: true
        }
      }
    );

    console.log(`✅ Migración completada:`);
    console.log(`   - ${result.modifiedCount} negocios actualizados a 'approved'\n`);

    // Contar negocios después
    const totalAfter = await Business.countDocuments();
    const approvedAfter = await Business.countDocuments({ status: 'approved' });
    const pendingAfter = await Business.countDocuments({ status: 'pending' });

    console.log('📊 ESTADO DESPUÉS DE LA MIGRACIÓN:');
    console.log('='.repeat(60));
    console.log(`Total de negocios:      ${totalAfter}`);
    console.log(`✅ Aprobados:           ${approvedAfter}`);
    console.log(`⏳ Pendientes:          ${pendingAfter}`);
    console.log('='.repeat(60));
    console.log('');

    console.log('✨ Los negocios aprobados ya deberían aparecer en la vista pública\n');

    await mongoose.connection.close();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar migración
migrateBusinesses();
