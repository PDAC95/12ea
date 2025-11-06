# Configuración de AWS S3 para Entre Amigas

## Información del Bucket

- **Bucket Name:** entre-amigas-dev
- **Región:** us-east-1 (US East - N. Virginia)
- **Usuario IAM:** entre-amigas-s3-user
- **Access Key ID:** AKIAT7OTX6CAKQLFNJNI

---

## Pasos de Configuración

### 1. Verificar que el Bucket existe

```bash
# Usando AWS CLI (opcional)
aws s3 ls s3://entre-amigas-dev
```

Si el bucket no existe, créalo:
```bash
aws s3 mb s3://entre-amigas-dev --region us-east-1
```

---

### 2. Configurar CORS en el Bucket

**Opción A: Via AWS Console**

1. Ir a AWS Console → S3
2. Click en el bucket `entre-amigas-dev`
3. Tab "Permissions"
4. Scroll a "Cross-origin resource sharing (CORS)"
5. Click "Edit"
6. Copiar el contenido del archivo `s3-cors-config.json`
7. Click "Save changes"

**Opción B: Via AWS CLI**

```bash
aws s3api put-bucket-cors \
  --bucket entre-amigas-dev \
  --cors-configuration file://src/config/s3-cors-config.json
```

---

### 3. Configurar Bucket Policy (Opcional - Solo si necesitas acceso público)

**NOTA:** Por defecto usaremos Signed URLs, por lo que NO necesitamos hacer el bucket público.

Si en el futuro necesitas acceso público a ciertas carpetas:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::entre-amigas-dev/public/*"
    }
  ]
}
```

---

### 4. Estructura de Carpetas Recomendada

```
entre-amigas-dev/
├── users/
│   └── {userId}/
│       ├── profile-photo.jpg
│       └── documents/
├── events/
│   └── {eventId}/
│       └── cover-image.jpg
├── businesses/
│   └── {businessId}/
│       ├── logo.jpg
│       └── photos/
└── blog/
    └── {postId}/
        └── images/
```

---

### 5. Permisos del Usuario IAM

El usuario `entre-amigas-s3-user` debe tener los siguientes permisos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetObjectAcl",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::entre-amigas-dev",
        "arn:aws:s3:::entre-amigas-dev/*"
      ]
    }
  ]
}
```

---

### 6. Configurar Lifecycle Rules (Opcional - Ahorro de costos)

Para eliminar automáticamente archivos temporales:

1. AWS Console → S3 → entre-amigas-dev
2. Tab "Management"
3. Click "Create lifecycle rule"
4. Nombre: "Delete-Temp-Files"
5. Scope: Prefix = `temp/`
6. Lifecycle rule actions: "Expire current versions of objects"
7. Days after object creation: 7 días
8. Click "Create rule"

---

### 7. Testing de Conexión

Una vez configurado, testear con:

```bash
# Listar contenido del bucket
aws s3 ls s3://entre-amigas-dev/

# Subir archivo de prueba
echo "test" > test.txt
aws s3 cp test.txt s3://entre-amigas-dev/test.txt

# Eliminar archivo de prueba
aws s3 rm s3://entre-amigas-dev/test.txt
```

---

## Límites del Free Tier

AWS S3 Free Tier (primer año):
- **5 GB** de almacenamiento estándar
- **20,000** solicitudes GET
- **2,000** solicitudes PUT, COPY, POST, LIST
- **100 GB** de transferencia de datos salientes

**Monitorear uso:** AWS Console → Billing → Free Tier

---

## Seguridad

### ✅ Buenas Prácticas Implementadas

- ✅ Credenciales en archivo `.env` (NO commiteado)
- ✅ Usuario IAM con permisos específicos (no root)
- ✅ CORS configurado para dominios específicos
- ✅ Block Public Access activado (Signed URLs)

### ⚠️ NUNCA hacer:

- ❌ Commitear credenciales al repositorio
- ❌ Usar credenciales de cuenta root
- ❌ Hacer el bucket completamente público sin necesidad
- ❌ Dejar credenciales en código hardcodeado

---

## Troubleshooting

### Error: "Access Denied"
- Verificar que el usuario IAM tiene permisos correctos
- Verificar que las credenciales en `.env` son correctas

### Error: "CORS policy"
- Verificar que CORS está configurado en el bucket
- Verificar que el origen (localhost:5173) está en AllowedOrigins

### Error: "Bucket not found"
- Verificar que el bucket existe
- Verificar que la región es correcta (us-east-1)

---

**Última actualización:** 6 de noviembre, 2025
**Mantenido por:** Equipo Entre Amigas
