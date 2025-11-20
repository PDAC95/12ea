/**
 * Script para actualizar el rol de un usuario a 'admin'
 *
 * Uso: node backend/src/scripts/updateUserRole.js
 *
 * Este script cambia el rol del usuario pdmckinster@gmail.com a 'admin'
 * para permitir acceso al panel de administración
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateUserToAdmin = async () => {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Email del usuario a actualizar
    const userEmail = 'pdmckinster@gmail.com';

    // Buscar usuario
    console.log(`\n🔍 Buscando usuario: ${userEmail}`);
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(`❌ Usuario con email ${userEmail} no encontrado`);
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Nombre: ${user.fullName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol actual: ${user.role}`);
    console.log(`   Verificado: ${user.isVerified ? 'Sí' : 'No'}`);

    // Actualizar rol a admin
    console.log(`\n🔄 Actualizando rol a 'admin'...`);
    user.role = 'admin';
    await user.save();

    console.log(`✅ Rol actualizado exitosamente`);
    console.log(`\n📊 Datos actualizados del usuario:`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Nombre: ${user.fullName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Verificado: ${user.isVerified ? 'Sí' : 'No'}`);

    console.log(`\n✅ ¡Usuario ahora es administrador!`);
    console.log(`   Puede acceder al panel admin en: https://entreamigas.ca/admin`);

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error al actualizar usuario:', error);
    process.exit(1);
  }
};

// Ejecutar script
updateUserToAdmin();
