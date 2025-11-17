# Backend Setup Checklist

Este checklist te guiará paso a paso en la configuración del backend de Entre Amigas.

## Pre-requisitos

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Git instalado
- [ ] Cuenta en MongoDB Atlas
- [ ] Cuenta en AWS (para S3)
- [ ] Cuenta en Resend (para emails)
- [ ] (Opcional) Cuenta en Google Cloud Platform (para OAuth)

---

## 1. Instalación Local

### 1.1 Clonar y Setup Inicial
- [ ] Clonar el repositorio
- [ ] Navegar a la carpeta `backend`
- [ ] Ejecutar `npm install`
- [ ] Verificar que no hay errores en la instalación

```bash
cd backend
npm install
```

---

## 2. Configuración de Base de Datos (MongoDB Atlas)

### 2.1 Crear Cluster
- [ ] Ir a [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Crear cuenta o iniciar sesión
- [ ] Crear nuevo proyecto (o usar existente)
- [ ] Crear cluster gratuito (M0 Sandbox)
- [ ] Esperar a que el cluster se active (~5 minutos)

### 2.2 Configurar Acceso
- [ ] Click en "Database Access"
- [ ] Crear usuario de base de datos
- [ ] Guardar username y password (los necesitarás)
- [ ] Click en "Network Access"
- [ ] Agregar IP: `0.0.0.0/0` (permitir desde cualquier IP)
  - Para producción: usar IP específica

### 2.3 Obtener Connection String
- [ ] Click en "Connect" en tu cluster
- [ ] Seleccionar "Connect your application"
- [ ] Copiar el connection string
- [ ] Reemplazar `<username>`, `<password>` y `<database>` con tus valores

Ejemplo:
```
mongodb+srv://miusuario:mipassword@cluster0.xxxxx.mongodb.net/entreamigas-dev?retryWrites=true&w=majority
```

---

## 3. Configuración de AWS S3 (File Storage)

### 3.1 Crear cuenta AWS
- [ ] Ir a [AWS Console](https://aws.amazon.com)
- [ ] Crear cuenta o iniciar sesión
- [ ] Completar verificación de cuenta

### 3.2 Crear Bucket S3
- [ ] Ir a S3 en AWS Console
- [ ] Click "Create bucket"
- [ ] Nombre: `entre-amigas-dev` (o tu preferencia)
- [ ] Región: `us-east-1` (o tu preferencia)
- [ ] Desmarcar "Block all public access" (queremos acceso público de lectura)
- [ ] Confirmar configuración
- [ ] Click "Create bucket"

### 3.3 Configurar Permisos del Bucket
- [ ] Ir a tu bucket > Permissions
- [ ] Editar "Bucket policy"
- [ ] Agregar política para lectura pública:

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

### 3.4 Crear IAM User
- [ ] Ir a IAM > Users
- [ ] Click "Add users"
- [ ] Nombre: `entre-amigas-app`
- [ ] Access type: "Programmatic access"
- [ ] Permissions: Attach `AmazonS3FullAccess` policy
- [ ] Click "Create user"
- [ ] **IMPORTANTE:** Copiar `Access Key ID` y `Secret Access Key`
- [ ] Guardarlos en lugar seguro (no se mostrarán de nuevo)

---

## 4. Configuración de Resend (Email Service)

### 4.1 Crear cuenta Resend
- [ ] Ir a [Resend](https://resend.com)
- [ ] Crear cuenta (gratis para 100 emails/día)
- [ ] Verificar email

### 4.2 Verificar Dominio
- [ ] Ir a "Domains" en dashboard
- [ ] Click "Add Domain"
- [ ] Ingresar tu dominio (ej: `ac95.ca`)
- [ ] Seguir instrucciones para agregar records DNS
- [ ] Esperar verificación (~15 minutos)

**Alternativa para testing:**
- [ ] Usar email sandbox de Resend (sin verificar dominio)
- [ ] Solo permite enviar a emails registrados en Resend

### 4.3 Obtener API Key
- [ ] Ir a [API Keys](https://resend.com/api-keys)
- [ ] Click "Create API Key"
- [ ] Nombre: "Entre Amigas Backend"
- [ ] Permisos: "Sending access"
- [ ] **IMPORTANTE:** Copiar API Key (solo se muestra una vez)
- [ ] Guardar en lugar seguro

---

## 5. Configuración de Google OAuth (OPCIONAL)

### 5.1 Crear Proyecto Google Cloud
- [ ] Ir a [Google Cloud Console](https://console.cloud.google.com)
- [ ] Crear nuevo proyecto o usar existente
- [ ] Activar "Google+ API"

### 5.2 Configurar OAuth Consent Screen
- [ ] Ir a "APIs & Services" > "OAuth consent screen"
- [ ] User Type: "External"
- [ ] Nombre de aplicación: "Entre Amigas"
- [ ] Email de soporte: tu email
- [ ] Guardar

### 5.3 Crear Credenciales OAuth
- [ ] Ir a "APIs & Services" > "Credentials"
- [ ] Click "Create Credentials" > "OAuth client ID"
- [ ] Application type: "Web application"
- [ ] Nombre: "Entre Amigas Web"
- [ ] Authorized redirect URIs:
  - Development: `http://localhost:8000/api/v1/auth/google/callback`
  - Production: `https://yourdomain.com/api/v1/auth/google/callback`
- [ ] Copiar `Client ID` y `Client Secret`
- [ ] Guardar en lugar seguro

---

## 6. Configurar Variables de Entorno

### 6.1 Crear archivo .env
- [ ] Copiar `.env.example` a `.env`
```bash
cp .env.example .env
```

### 6.2 Completar variables SERVER
- [ ] `NODE_ENV=development`
- [ ] `PORT=8000`

### 6.3 Completar variables DATABASE
- [ ] `MONGODB_URI=` (tu connection string de MongoDB Atlas)

### 6.4 Completar variables JWT
- [ ] Generar `JWT_SECRET` con:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] `JWT_SECRET=` (pegar valor generado)
- [ ] `JWT_EXPIRE=7d`

### 6.5 Completar variables RESEND
- [ ] `RESEND_API_KEY=` (tu API Key de Resend)
- [ ] `EMAIL_FROM=` (tu email verificado en Resend)
- [ ] `EMAIL_REPLY_TO=` (email para respuestas)

### 6.6 Completar variables AWS
- [ ] `AWS_ACCESS_KEY_ID=` (tu Access Key de IAM)
- [ ] `AWS_SECRET_ACCESS_KEY=` (tu Secret Key de IAM)
- [ ] `AWS_REGION=us-east-1` (o tu región)
- [ ] `AWS_S3_BUCKET_NAME=entre-amigas-dev` (o tu bucket)

### 6.7 Completar variables FRONTEND
- [ ] `FRONTEND_URL=http://localhost:8080`
- [ ] `CORS_ORIGIN=http://localhost:8080`

### 6.8 (Opcional) Completar variables GOOGLE OAUTH
- [ ] `GOOGLE_CLIENT_ID=` (tu Client ID)
- [ ] `GOOGLE_CLIENT_SECRET=` (tu Client Secret)
- [ ] `GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback`

---

## 7. Verificar Configuración

### 7.1 Test de Conexión MongoDB
- [ ] Ejecutar servidor: `npm run dev`
- [ ] Verificar en consola: " MongoDB Connected"
- [ ] Si hay error, revisar `MONGODB_URI`

### 7.2 Test de Email
- [ ] Ejecutar: `npm run test:email`
- [ ] Verificar que se envió email correctamente
- [ ] Revisar inbox del email de prueba
- [ ] Si hay error, revisar `RESEND_API_KEY` y `EMAIL_FROM`

### 7.3 Test de JWT
- [ ] Ejecutar: `npm run test:tokens`
- [ ] Verificar que tokens se generan correctamente
- [ ] Si hay error, revisar `JWT_SECRET` (debe tener 32+ caracteres)

### 7.4 Test de AWS S3 (manual)
- [ ] Intentar crear un negocio con logo (POST /api/v1/businesses)
- [ ] Verificar que la imagen se subió al bucket S3
- [ ] Verificar que la URL pública funciona
- [ ] Si hay error, revisar credenciales AWS y permisos del bucket

---

## 8. Poblar Base de Datos (Seeds)

### 8.1 Crear usuario admin
- [ ] Ejecutar: `npm run admin:create`
- [ ] Email: `dev@jappi.ca`
- [ ] Password: `Password123`
- [ ] Verificar creación exitosa

### 8.2 Poblar datos de ejemplo
- [ ] Ejecutar: `npm run seed:business` (crear negocios)
- [ ] Ejecutar: `npm run seed:services` (crear servicios)
- [ ] Ejecutar: `npm run seed:events` (crear eventos)
- [ ] Ejecutar: `npm run seed:blog` (crear posts)

### 8.3 Verificar datos
- [ ] GET `http://localhost:8000/api/v1/businesses`
- [ ] GET `http://localhost:8000/api/v1/services`
- [ ] GET `http://localhost:8000/api/v1/events`
- [ ] GET `http://localhost:8000/api/v1/blog`
- [ ] Verificar que todos retornan datos

---

## 9. Testing Manual de API

### 9.1 Test de Autenticación
- [ ] POST `/api/v1/auth/login`
  ```json
  {
    "email": "dev@jappi.ca",
    "password": "Password123"
  }
  ```
- [ ] Copiar `token` de la respuesta
- [ ] GET `/api/v1/auth/me` con header `Authorization: Bearer <token>`
- [ ] Verificar que retorna datos del usuario

### 9.2 Test de Endpoints Públicos
- [ ] GET `/api/v1/businesses`
- [ ] GET `/api/v1/services`
- [ ] GET `/api/v1/events`
- [ ] GET `/api/v1/blog`
- [ ] Verificar que todos funcionan sin autenticación

### 9.3 Test de Endpoints Protegidos
- [ ] POST `/api/v1/businesses` (con token de admin)
- [ ] PUT `/api/v1/businesses/:id` (con token de owner)
- [ ] DELETE `/api/v1/businesses/:id` (con token de admin)
- [ ] Verificar que sin token retorna 401 Unauthorized

---

## 10. Preparación para Producción

### 10.1 Variables de entorno
- [ ] Cambiar `NODE_ENV=production`
- [ ] Cambiar `FRONTEND_URL` a URL real
- [ ] Cambiar `CORS_ORIGIN` a URL real
- [ ] Cambiar `GOOGLE_CALLBACK_URL` a URL real
- [ ] Verificar que `JWT_SECRET` sea fuerte (32+ caracteres random)

### 10.2 MongoDB Atlas
- [ ] Cambiar IP whitelist de `0.0.0.0/0` a IP específica del servidor
- [ ] Crear usuario de DB específico para producción
- [ ] Cambiar database name a `entreamigas-prod`

### 10.3 AWS S3
- [ ] Crear bucket separado para producción (`entre-amigas-prod`)
- [ ] Crear IAM user separado para producción
- [ ] Configurar CORS en bucket para URL de producción

### 10.4 Seguridad
- [ ] Habilitar HTTPS en servidor
- [ ] Configurar rate limiting más estricto
- [ ] Revisar permisos de usuarios admin
- [ ] Configurar logs de producción
- [ ] Configurar monitoring (opcional)

---

## 11. Deployment

### 11.1 Railway (recomendado)
- [ ] Crear cuenta en [Railway](https://railway.app)
- [ ] Nuevo proyecto > Deploy from GitHub
- [ ] Seleccionar repositorio
- [ ] Agregar todas las variables de entorno
- [ ] Deploy automático en cada push a `main`

### 11.2 Render
- [ ] Crear cuenta en [Render](https://render.com)
- [ ] New Web Service > Connect GitHub
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Agregar variables de entorno
- [ ] Deploy

### 11.3 Fly.io
- [ ] Instalar Fly CLI
- [ ] `fly launch` en carpeta backend
- [ ] Configurar variables con `fly secrets set`
- [ ] `fly deploy`

---

## Checklist Final

- [ ]  Backend corre en `http://localhost:8000`
- [ ]  MongoDB conectado correctamente
- [ ]  Emails se envían correctamente
- [ ]  Upload de archivos a S3 funciona
- [ ]  JWT authentication funciona
- [ ]  Base de datos poblada con datos de ejemplo
- [ ]  Todos los endpoints responden correctamente
- [ ]  CORS configurado para el frontend
- [ ]  Variables de entorno documentadas
- [ ]  `.env` está en `.gitignore`
- [ ]  README.md actualizado
- [ ]  Listo para conectar frontend

---

## Troubleshooting Común

### Error: "MongoDB connection failed"
- Verificar `MONGODB_URI`
- Verificar whitelist de IPs en MongoDB Atlas
- Verificar usuario/password correctos

### Error: "JWT malformed"
- Verificar que `JWT_SECRET` tenga 32+ caracteres
- Generar nuevo secret con comando en paso 6.4

### Error: "AWS Access Denied"
- Verificar `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`
- Verificar permisos del IAM user
- Verificar que bucket existe en región correcta

### Error: "Email sending failed"
- Verificar `RESEND_API_KEY`
- Verificar que dominio en `EMAIL_FROM` esté verificado
- Revisar cuota de emails en Resend

### Puerto 8000 ocupado
- Cambiar `PORT` en `.env` a otro valor (ej: 8001)
- O matar proceso: `npx kill-port 8000`

---

## Soporte

Si tienes problemas que no se resuelven con este checklist:
1. Revisar logs del servidor
2. Revisar documentación en [README.md](README.md)
3. Crear issue en el repositorio

---

**¡Configuración completa!** <‰

Ahora puedes proceder con el desarrollo del frontend y conectarlo a este backend.
