import mongoose from 'mongoose';
import Service from '../models/Service.js';
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
 * Script de Migración: Aprobar servicios existentes
 *
 * Este script actualiza todos los servicios que NO tienen el campo status
 * o que están en 'pending' para marcarlos como 'approved'.
 *
 * Útil para migrar servicios creados antes de implementar el sistema de aprobación.
 */

const migrateServices = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    console.log('🔄 Iniciando migración de servicios...\n');

    // Contar servicios antes
    const totalBefore = await Service.countDocuments();
    const approvedBefore = await Service.countDocuments({ status: 'approved' });
    const pendingBefore = await Service.countDocuments({ status: 'pending' });

    console.log('📊 Estado ANTES de la migración:');
    console.log(`   Total servicios: ${totalBefore}`);
    console.log(`   Aprobados: ${approvedBefore}`);
    console.log(`   Pendientes: ${pendingBefore}\n`);

    // Servicios sin campo status (servicios antiguos)
    const servicesWithoutStatus = await Service.countDocuments({
      $or: [{ status: { $exists: false } }, { status: null }],
    });

    console.log(`🔍 Servicios sin status: ${servicesWithoutStatus}`);

    // Actualizar servicios antiguos a 'approved'
    const result = await Service.updateMany(
      {
        $or: [{ status: { $exists: false } }, { status: null }],
      },
      {
        $set: {
          status: 'approved',
          // No establecer approvedBy ni approvedAt para servicios antiguos
          // ya que no sabemos quién los aprobó ni cuándo
        },
      }
    );

    console.log(`\n✅ Migración completada:`);
    console.log(`   Servicios actualizados: ${result.modifiedCount}`);

    // Contar servicios después
    const totalAfter = await Service.countDocuments();
    const approvedAfter = await Service.countDocuments({ status: 'approved' });
    const pendingAfter = await Service.countDocuments({ status: 'pending' });

    console.log('\n📊 Estado DESPUÉS de la migración:');
    console.log(`   Total servicios: ${totalAfter}`);
    console.log(`   Aprobados: ${approvedAfter}`);
    console.log(`   Pendientes: ${pendingAfter}\n`);

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar migración
migrateServices();
