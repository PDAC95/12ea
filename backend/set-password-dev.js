/**
 * Script para setear password al usuario dev@jappi.ca
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function setPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const user = await User.findOne({ email: 'dev@jappi.ca' });

    if (!user) {
      console.log('❌ Usuario dev@jappi.ca no encontrado');
      process.exit(1);
    }

    // Setear password directamente (el pre-save hook lo hasheará)
    user.password = 'Password123';
    await user.save();

    console.log('\n✅ Password actualizado exitosamente!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password:', 'Password123');
    console.log('👤 Role:', user.role);
    console.log('✅ Verificado:', user.isVerified);

    // Verificar que funciona
    const isMatch = await user.comparePassword('Password123');
    console.log('\n🔍 Verificando password... Match:', isMatch ? '✅' : '❌');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setPassword();
