# Guía de Configuración S3 Bucket Policy

## ❌ Problema Actual
Las imágenes se ven rotas porque el bucket S3 no permite acceso público.

## ✅ Solución: Configurar Bucket Policy (Producción)

### Paso 1: Desactivar Block Public Access
1. Ve a [AWS S3 Console](https://s3.console.aws.amazon.com/s3/buckets/entre-amigas-dev)
2. Click en el bucket **"entre-amigas-dev"**
3. Click en la pestaña **"Permissions"**
4. En la sección **"Block public access (bucket settings)"**, click en **"Edit"**
5. **Desmarca** la opción:
   - ✅ "Block public access to buckets and objects granted through new public bucket or access point policies"
6. Click en **"Save changes"**
7. Escribe `confirm` cuando te lo pida

### Paso 2: Configurar Bucket Policy
1. En la misma pestaña **"Permissions"**, scroll hasta **"Bucket policy"**
2. Click en **"Edit"**
3. Pega la siguiente política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::entre-amigas-dev/*"
    }
  ]
}
```

4. Click en **"Save changes"**

### Paso 3: Verificar que funciona
Ejecuta el script de prueba:
```bash
cd backend
node test-s3-upload.js
```

## 🔒 Seguridad
Esta configuración:
- ✅ Permite **lectura pública** de todos los objetos (imágenes)
- 🔒 **Solo** el propietario del bucket puede **escribir/eliminar** objetos
- ✅ Es la configuración estándar para almacenamiento de assets públicos

## 📋 Qué hace cada configuración

### Block Public Access OFF
Permite que el bucket tenga políticas públicas.

### Bucket Policy
Define que:
- Cualquier persona (`"Principal": "*"`) puede hacer `GetObject` (leer/descargar)
- Solo afecta a objetos dentro del bucket (`Resource: "arn:aws:s3:::entre-amigas-dev/*"`)
- No permite subir, eliminar o modificar objetos

## 🚀 Producción
Para el bucket de producción, repite los mismos pasos pero:
- Usa el nombre del bucket de producción (ej: `entre-amigas-prod`)
- Aplica la misma política pero con el nombre correcto del bucket

## ⚠️ Troubleshooting

### Si las imágenes siguen rotas después de configurar:
1. Verifica que el bucket policy se aplicó correctamente
2. Prueba acceder directamente a una URL de imagen en el navegador
3. Revisa los logs del backend al subir una imagen
4. Ejecuta: `node test-s3-upload.js` para verificar

### Si no puedes editar Block Public Access:
Necesitas permisos de administrador de la cuenta de AWS.
