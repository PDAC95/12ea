/**
 * Script para verificar usuarios en la base de datos
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const users = await User.find({}, 'email role isVerified fullName').lean();

    console.log(`\n📊 Total de usuarios: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verificado: ${user.isVerified ? '✅' : '❌'}`);
      console.log(`   Nombre: ${user.fullName}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
