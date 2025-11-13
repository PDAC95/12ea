import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

/**
 * Seed Admin User - Entre Amigas
 * Crea usuario admin para testing de US-009 Admin Panel
 *
 * Credentials:
 * Email: dev@jappi.ca
 * Password: Password123
 * Role: admin
 */

const seedAdminUser = async () => {
  try {
    console.log('🌱 Iniciando seed de usuario admin...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Admin user data
    const adminData = {
      fullName: 'Admin Entre Amigas',
      preferredName: 'Admin',
      email: 'dev@jappi.ca',
      password: 'Password123',
      phone: '+1-555-0100',
      birthday: new Date('1990-01-01'),
      city: 'Toronto',
      authProvider: 'local',
      role: 'admin',
      isVerified: true,
      isActive: true,
      bio: 'Administrador del sistema Entre Amigas',
      profileImage: 'https://ui-avatars.com/api/?name=Admin+EA&background=ec4899&color=fff&size=200',
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Usuario admin ya existe');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('✅ isVerified:', existingAdmin.isVerified);
      console.log('🔑 ID:', existingAdmin._id);

      // Ask if want to reset password
      console.log('\n💡 Si quieres resetear el password, elimina el usuario primero:');
      console.log(`   await User.deleteOne({ email: '${adminData.email}' })`);

      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create(adminData);

    console.log('\n✅ Usuario admin creado exitosamente!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ', adminUser.email);
    console.log('🔑 Password: ', 'Password123');
    console.log('👤 Role:     ', adminUser.role);
    console.log('🆔 ID:       ', adminUser._id);
    console.log('✅ Verified: ', adminUser.isVerified);
    console.log('═══════════════════════════════════════');
    console.log('\n🚀 Puedes iniciar sesión con estas credenciales en:');
    console.log('   http://localhost:8080/login');
    console.log('\n🔐 Para acceder al Admin Panel:');
    console.log('   http://localhost:8080/dashboard/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    process.exit(1);
  }
};

// Run seed
seedAdminUser();
