import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Script para establecer permisos de administrador a un usuario
 */

const setAdminUser = async () => {
  try {
    console.log('\n🔑 Estableciendo permisos de administrador...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar usuario por email
    const email = 'pdmckinster@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ Usuario no encontrado: ${email}`);
      console.log('\nPor favor verifica que el usuario exista en la base de datos.\n');
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${user.email}`);
    console.log(`   Nombre: ${user.fullName}`);
    console.log(`   Rol actual: ${user.role}`);
    console.log('');

    // 3. Verificar si ya es admin
    if (user.role === 'admin') {
      console.log('⚠️  Este usuario ya tiene permisos de administrador.\n');
      process.exit(0);
    }

    // 4. Actualizar rol a admin
    user.role = 'admin';
    await user.save();

    console.log('✅ Permisos de administrador otorgados exitosamente!');
    console.log('');
    console.log('📋 Detalles del usuario:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.fullName}`);
    console.log(`   Rol: ${user.role} ⭐`);
    console.log(`   Verificado: ${user.isVerified ? 'Sí' : 'No'}`);
    console.log(`   Activo: ${user.isActive ? 'Sí' : 'No'}`);
    console.log('');

    console.log('✅ Proceso completado!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el proceso:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar script
setAdminUser();
