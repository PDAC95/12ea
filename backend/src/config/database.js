import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opciones de configuración para Mongoose 7.x
      // Las opciones antiguas useNewUrlParser y useUnifiedTopology ya no son necesarias
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);

    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB Desconectado');
    });

    // Cerrar conexión cuando el proceso termina
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔴 MongoDB Conexión cerrada por terminación del proceso');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
