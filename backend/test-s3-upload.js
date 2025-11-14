import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Config } from './src/config/aws.js';

/**
 * Script de prueba para verificar que S3 funciona sin ACL
 * y con Bucket Policy configurada
 */
const testS3Upload = async () => {
  try {
    console.log('🧪 Probando subida a S3 sin ACL...');
    console.log('📦 Bucket:', s3Config.bucket);
    console.log('🌍 Region:', s3Config.region);
    console.log('');

    const testContent = 'Test file uploaded at ' + new Date().toISOString();
    const testKey = `test/upload-test-${Date.now()}.txt`;

    // Subir SIN ACL (acceso público mediante Bucket Policy)
    const params = {
      Bucket: s3Config.bucket,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      // ❌ NO incluimos ACL
    };

    console.log('⬆️  Subiendo archivo de prueba...');
    const command = new PutObjectCommand(params);
    await s3Config.client.send(command);

    const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${testKey}`;

    console.log('✅ Archivo subido exitosamente!');
    console.log('🔗 URL:', fileUrl);
    console.log('');
    console.log('🧪 Probando acceso público a la URL...');

    // Intentar acceder a la URL
    const response = await fetch(fileUrl);

    if (response.ok) {
      const content = await response.text();
      console.log('✅ ¡URL pública accesible! (200 OK)');
      console.log('📄 Contenido:', content);
      console.log('');
      console.log('🎉 ¡TODO FUNCIONA CORRECTAMENTE!');
      console.log('');
      console.log('✅ El bucket está configurado correctamente con Bucket Policy.');
      console.log('✅ Las imágenes ahora deberían verse en el frontend.');
    } else {
      console.log(`❌ URL no accesible (${response.status} ${response.statusText})`);
      console.log('');
      console.log('⚠️  PROBLEMA:');
      console.log('El archivo se subió pero no es público.');
      console.log('');
      console.log('VERIFICA:');
      console.log('1. ¿Configuraste el Bucket Policy? (Ver GUIA-S3-BUCKET-POLICY.md)');
      console.log('2. ¿Desactivaste Block Public Access?');
      console.log('3. Espera 1-2 minutos para que los cambios se propaguen');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.name === 'AccessDenied' || error.name === 'AllAccessDisabled') {
      console.log('');
      console.log('⚠️  No tienes permisos para subir archivos.');
      console.log('Verifica tus credenciales de AWS en el archivo .env');
    }

    if (error.name === 'NoSuchBucket') {
      console.log('');
      console.log('⚠️  El bucket "' + s3Config.bucket + '" no existe.');
      console.log('Verifica el nombre del bucket en tu archivo .env');
    }
  }
};

testS3Upload();
