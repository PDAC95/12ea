import mongoose from 'mongoose';
import Business from './src/models/Business.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const checkBusinessStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    const total = await Business.countDocuments();
    const approved = await Business.countDocuments({ status: 'approved' });
    const pending = await Business.countDocuments({ status: 'pending' });
    const rejected = await Business.countDocuments({ status: 'rejected' });

    console.log('📊 RESUMEN DE NEGOCIOS:');
    console.log('='.repeat(50));
    console.log(`Total de negocios:      ${total}`);
    console.log(`✅ Aprobados:           ${approved}`);
    console.log(`⏳ Pendientes:          ${pending}`);
    console.log(`❌ Rechazados:          ${rejected}`);
    console.log('='.repeat(50));

    console.log('\n📋 NEGOCIOS PENDIENTES:');
    const pendingBusinesses = await Business.find({ status: 'pending' })
      .select('name category status createdAt')
      .limit(10)
      .lean();

    if (pendingBusinesses.length > 0) {
      pendingBusinesses.forEach((b, i) => {
        console.log(`${i + 1}. ${b.name} (${b.category}) - ${b.status}`);
      });
      if (pending > 10) {
        console.log(`... y ${pending - 10} más`);
      }
    } else {
      console.log('No hay negocios pendientes');
    }

    console.log('\n✅ NEGOCIOS APROBADOS:');
    const approvedBusinesses = await Business.find({ status: 'approved' })
      .select('name category status createdAt')
      .limit(10)
      .lean();

    if (approvedBusinesses.length > 0) {
      approvedBusinesses.forEach((b, i) => {
        console.log(`${i + 1}. ${b.name} (${b.category}) - ${b.status}`);
      });
      if (approved > 10) {
        console.log(`... y ${approved - 10} más`);
      }
    } else {
      console.log('No hay negocios aprobados aún');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkBusinessStatus();
