import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Config } from './src/config/aws.js';

/**
 * Script de prueba para verificar si el bucket permite ACL public-read
 */
const testS3ACL = async () => {
  try {
    console.log('🧪 Probando subida a S3 con ACL public-read...');
    console.log('📦 Bucket:', s3Config.bucket);
    console.log('🌍 Region:', s3Config.region);

    const testContent = 'Test file content';
    const testKey = 'test/acl-test.txt';

    // Intentar subir con ACL public-read
    const params = {
      Bucket: s3Config.bucket,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await s3Config.client.send(command);

    const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${testKey}`;

    console.log('✅ Archivo subido exitosamente con ACL public-read');
    console.log('🔗 URL pública:', fileUrl);
    console.log('\n🧪 Probando acceso a la URL...');

    // Intentar acceder a la URL
    const response = await fetch(fileUrl);
    if (response.ok) {
      console.log('✅ URL pública accesible (200 OK)');
    } else {
      console.log(`❌ URL pública no accesible (${response.status} ${response.statusText})`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.name === 'AccessControlListNotSupported') {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO:');
      console.log('El bucket S3 tiene deshabilitadas las ACLs.');
      console.log('\nSOLUCIONES:');
      console.log('1. En AWS S3 Console:');
      console.log('   - Ve a tu bucket "entre-amigas-dev"');
      console.log('   - Pestaña "Permissions"');
      console.log('   - "Object Ownership" → Editar');
      console.log('   - Selecciona "ACLs enabled"');
      console.log('   - Marca "Bucket owner preferred"');
      console.log('\n2. O cambia el código para NO usar ACL:');
      console.log('   - Eliminar "ACL: \'public-read\'" del código');
      console.log('   - Configurar el bucket como público mediante Bucket Policy');
    }
  }
};

testS3ACL();
