import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import 'dotenv/config';

/**
 * Script para crear el primer usuario administrador
 * Uso: node src/scripts/createFirstAdmin.js
 */

const ADMIN_DATA = {
  fullName: 'Administradora Entre Amigas',
  preferredName: 'Admin',
  email: 'admin@entreamigas.com',
  password: 'Admin123!',
  phone: '+1 (416) 555-0100',
  birthday: new Date('1990-01-01'),
  city: 'Toronto',
  role: 'admin',
  isVerified: true,
  isActive: true,
};

async function createFirstAdmin() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB:', mongoose.connection.host);

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('\n⚠️  Ya existe un administrador en el sistema:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nombre:', existingAdmin.fullName);
      console.log('🎭 Role:', existingAdmin.role);
      console.log('✅ Verificado:', existingAdmin.isVerified ? 'Sí' : 'No');
      console.log('📅 Creado:', existingAdmin.createdAt.toLocaleDateString());
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Preguntar si desea crear otro admin
      console.log('⚠️  Si deseas crear otro admin, modifica el script con datos diferentes.\n');
      process.exit(0);
    }

    console.log('\n🔨 Creando primer usuario administrador...');

    // Crear admin (el password se hashea automáticamente por el hook pre-save)
    const admin = await User.create(ADMIN_DATA);

    console.log('\n✅ Administrador creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:   ', admin.email);
    console.log('🔑 Password:', ADMIN_DATA.password);
    console.log('👤 Nombre:  ', admin.fullName);
    console.log('🎭 Role:    ', admin.role);
    console.log('✅ Verificado:', admin.isVerified ? 'Sí' : 'No');
    console.log('🆔 ID:      ', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
    console.log('🔐 Para login, usa: POST /api/auth/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al crear administrador:', error);

    if (error.code === 11000) {
      console.error('⚠️  El email ya está registrado');
    } else if (error.name === 'ValidationError') {
      console.error('⚠️  Error de validación:');
      Object.values(error.errors).forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }

    process.exit(1);
  }
}

// Ejecutar script
createFirstAdmin();
