/**
 * Script para verificar si el usuario dev@jappi.ca tiene password hasheado
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function checkPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const user = await User.findOne({ email: 'dev@jappi.ca' });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }

    console.log('\n📧 Email:', user.email);
    console.log('👤 Role:', user.role);
    console.log('✅ Verificado:', user.isVerified);
    console.log('🔒 Password field exists:', !!user.password);
    console.log('🔒 Password length:', user.password ? user.password.length : 0);
    console.log('🔒 Password starts with $2:', user.password ? user.password.startsWith('$2') : false);

    // Intentar comparar password
    try {
      const isMatch = await user.comparePassword('Password123');
      console.log('\n✅ Password "Password123" match:', isMatch);
    } catch (error) {
      console.log('\n❌ Error comparing password:', error.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPassword();
