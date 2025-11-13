import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

/**
 * Update User Role to Admin - Entre Amigas
 * Actualiza el rol del usuario dev@jappi.ca a admin
 */

const updateToAdmin = async () => {
  try {
    console.log('🔧 Actualizando rol de usuario a admin...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const email = 'dev@jappi.ca';

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        role: 'admin',
        isVerified: true,
        isActive: true,
      },
      { new: true }
    );

    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }

    console.log('\n✅ Usuario actualizado exitosamente!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ', user.email);
    console.log('👤 Role:     ', user.role);
    console.log('🆔 ID:       ', user._id);
    console.log('✅ Verified: ', user.isVerified);
    console.log('✅ Active:   ', user.isActive);
    console.log('═══════════════════════════════════════');
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Email:    dev@jappi.ca');
    console.log('   Password: Password123');
    console.log('\n🚀 Puedes iniciar sesión en:');
    console.log('   http://localhost:8080/login');
    console.log('\n🔐 Para acceder al Admin Panel:');
    console.log('   http://localhost:8080/dashboard/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    process.exit(1);
  }
};

// Run update
updateToAdmin();
