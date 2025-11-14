import { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } from '@aws-sdk/client-s3';
import { s3Config } from './src/config/aws.js';

/**
 * Script para configurar Bucket Policy en S3
 * Hace el bucket público para lectura (GetObject)
 *
 * Ejecutar: node setup-s3-bucket-policy.js
 */

const setupBucketPolicy = async () => {
  try {
    console.log('🔧 Configurando Bucket Policy para S3...');
    console.log('📦 Bucket:', s3Config.bucket);
    console.log('🌍 Region:', s3Config.region);
    console.log('');

    // Política del bucket: permitir acceso público de lectura (GetObject)
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${s3Config.bucket}/*`
        }
      ]
    };

    // Aplicar la política
    const command = new PutBucketPolicyCommand({
      Bucket: s3Config.bucket,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3Config.client.send(command);

    console.log('✅ Bucket Policy configurada exitosamente!');
    console.log('');
    console.log('📋 Política aplicada:');
    console.log(JSON.stringify(bucketPolicy, null, 2));
    console.log('');
    console.log('🎉 Tu bucket ahora permite acceso público de lectura a todos los objetos.');
    console.log('🔒 Solo el propietario del bucket puede escribir/eliminar objetos.');
    console.log('');
    console.log('✅ Configuración completa. Ya puedes subir imágenes sin ACL.');

  } catch (error) {
    console.error('❌ Error al configurar Bucket Policy:', error.message);

    if (error.name === 'AccessDenied') {
      console.log('');
      console.log('⚠️  PROBLEMA DE PERMISOS:');
      console.log('Tu usuario de AWS no tiene permisos para modificar Bucket Policies.');
      console.log('');
      console.log('SOLUCIÓN MANUAL:');
      console.log('1. Ve a AWS S3 Console: https://s3.console.aws.amazon.com/s3/buckets/' + s3Config.bucket);
      console.log('2. Click en la pestaña "Permissions"');
      console.log('3. Scroll hasta "Bucket policy"');
      console.log('4. Click en "Edit"');
      console.log('5. Pega esta política:');
      console.log('');
      console.log(JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${s3Config.bucket}/*`
          }
        ]
      }, null, 2));
      console.log('');
      console.log('6. Click en "Save changes"');
    }

    if (error.name === 'NoSuchBucket') {
      console.log('');
      console.log('⚠️  El bucket "' + s3Config.bucket + '" no existe.');
      console.log('Verifica el nombre del bucket en tu archivo .env');
    }
  }
};

setupBucketPolicy();
