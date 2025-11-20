# Resend Production Checklist - Task 5.1.1
**Entre Amigas - Sprint 5**

##  Task 5.1.1: Verificar Configuración de Resend en Producción

### Estado Actual: =á PENDIENTE VERIFICACIÓN EN RESEND DASHBOARD

---

## =Ë Checklist de Configuración

### 1. Variables de Entorno - Backend Local 

- [x] `RESEND_API_KEY` configurada
- [x] `EMAIL_FROM` = `noreply@entreamigas.ca`
- [x] `EMAIL_REPLY_TO` = `hola@entreamigas.ca`
- [x] `FRONTEND_URL` = `https://www.entreamigas.ca` (actualizada)
- [x] `CORS_ORIGIN` = `https://www.entreamigas.ca` (actualizada)

### 2. Verificación en Resend Dashboard =2

**URL:** https://resend.com/domains

#### 2.1 Estado del Dominio `entreamigas.ca`

- [ ] Dominio agregado a Resend
- [ ] Estado: **"Verified"** (no "Pending")
- [ ] Records DNS configurados:
  - [ ] **SPF Record** agregado
  - [ ] **DKIM Record** agregado
  - [ ] **DMARC Record** agregado (opcional pero recomendado)

**Si está "Pending":**
1. Ir a proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.)
2. Agregar los records DNS que Resend te proporciona
3. Esperar propagación DNS (5-30 minutos)
4. Verificar en Resend

---

#### 2.2 API Key Activa

**URL:** https://resend.com/api-keys

- [ ] API Key `re_SPVSdTZe_7yVhVDj6RssNL1kDquvU8Q4A` existe
- [ ] Estado: **"Active"**
- [ ] Permisos: **"Sending access"** o **"Full access"**
- [ ] Nombre descriptivo (ej: "Entre Amigas Backend - Production")

**Si no existe o está revocada:**
1. Crear nueva API Key en Resend
2. Actualizar variable `RESEND_API_KEY` en Railway y `.env`

---

#### 2.3 Límites y Cuota

**URL:** https://resend.com/overview

- [ ] Plan: **Free** (100 emails/día) o **Pro**
- [ ] Emails enviados hoy: **_____ / 100**
- [ ] Emails enviados este mes: **_____ / 3,000**
- [ ] Sin alertas o warnings

---

### 3. Test de Envío Local =2

```bash
cd backend
npm run test:email
```

**Email de prueba se enviará a:** `pdmckinster@gmail.com`

**Resultado esperado:**
```
 Email enviado exitosamente!
=ì ID del email: [resend-email-id]
```

**Si falla, errores comunes:**

| Error | Causa | Solución |
|-------|-------|----------|
| `Domain not verified` | Dominio no verificado en Resend | Verificar records DNS |
| `Invalid API key` | API key inválida o revocada | Crear nueva API key |
| `Quota exceeded` | Límite de emails alcanzado | Esperar 24h o upgrade plan |
| `Unauthorized` | Permisos insuficientes | Verificar permisos de API key |

---

### 4. Variables de Entorno en Railway (Producción) =2

**URL:** https://railway.app ’ Project ’ Variables

#### Variables Requeridas:

```env
# Email Service - Resend
RESEND_API_KEY=re_SPVSdTZe_7yVhVDj6RssNL1kDquvU8Q4A
EMAIL_FROM=noreply@entreamigas.ca
EMAIL_REPLY_TO=hola@entreamigas.ca

# Frontend URL
FRONTEND_URL=https://www.entreamigas.ca
CORS_ORIGIN=https://www.entreamigas.ca

# Google OAuth (actualizado para producción)
GOOGLE_CALLBACK_URL=https://api.entreamigas.ca/api/v1/auth/google/callback
```

#### Pasos:

1. [ ] Ir a Railway Dashboard
2. [ ] Seleccionar proyecto "Entre Amigas Backend"
3. [ ] Tab "Variables"
4. [ ] Verificar que existan TODAS las variables de arriba
5. [ ] Verificar que los valores sean correctos
6. [ ] Si falta alguna ’ Agregar
7. [ ] Si alguna está incorrecta ’ Actualizar
8. [ ] **Importante:** Railway redespliega automáticamente al cambiar variables

---

### 5. Test de Envío en Producción =2

Una vez que Railway haya redesplegado:

```bash
# Test desde la API de producción
curl -X POST https://api.entreamigas.ca/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "pdmckinster@gmail.com",
    "password": "Password123"
  }'
```

**Resultado esperado:**
-  Usuario creado
-  Email de bienvenida enviado
-  Email recibido en `pdmckinster@gmail.com`

---

### 6. Verificar Logs de Railway =2

**URL:** https://railway.app ’ Project ’ Deployments ’ Logs

**Buscar en logs:**

```
 Logs esperados (OK):
=ç Resend Email Service configurado
=î Email remitente: noreply@entreamigas.ca
 Email enviado exitosamente: [resend-id]

L Logs de error (FALLÓ):
L Error al enviar email: Domain not verified
L RESEND_API_KEY no está definida
L Error: Invalid API key
```

---

## =Ê Criterios de Aceptación - Task 5.1.1

- [x]  Variable `RESEND_API_KEY` existe en Railway
- [ ] =2 Variable `EMAIL_FROM` es válida (`noreply@entreamigas.ca`)
- [ ] =2 Dominio `entreamigas.ca` está verificado en Resend
- [ ] =2 API key tiene permisos de envío
- [ ] =2 Test de envío local funciona
- [ ] =2 Test de envío en producción funciona

---

## =€ Siguientes Tareas (Sprint 5)

Una vez completada Task 5.1.1:

- **Task 5.1.2:** Implementar modelo EmailVerificationToken
- **Task 5.1.3:** Endpoint POST /api/v1/auth/verify-email
- **Task 5.1.4:** Endpoint POST /api/v1/auth/resend-verification

---

## =Ý Notas Importantes

### Dominio vs Email

- **Dominio:** `entreamigas.ca` (debe estar verificado en Resend)
- **Email From:** `noreply@entreamigas.ca` (debe usar dominio verificado)
- **Email Reply-To:** `hola@entreamigas.ca` (para respuestas de usuarios)

### URLs de Producción

- **Frontend:** `https://www.entreamigas.ca`
- **Backend API:** `https://api.entreamigas.ca`
- **Google OAuth Callback:** `https://api.entreamigas.ca/api/v1/auth/google/callback`

### Límites de Resend Free Plan

- **Diario:** 100 emails
- **Mensual:** 3,000 emails
- **Upgrade a Pro:** $20/mes ’ 50,000 emails/mes

---

## =' Troubleshooting

### Problema: "Domain not verified"

**Solución:**
1. Ir a https://resend.com/domains
2. Verificar estado del dominio `entreamigas.ca`
3. Si está "Pending":
   - Copiar records DNS de Resend
   - Agregarlos en proveedor de dominio
   - Esperar propagación (5-30 min)
   - Click "Verify" en Resend

### Problema: "Invalid API key"

**Solución:**
1. Ir a https://resend.com/api-keys
2. Verificar que la API key exista y esté "Active"
3. Si no existe o está revocada:
   - Crear nueva API key
   - Copiar nueva key
   - Actualizar en Railway y `.env`

### Problema: "Quota exceeded"

**Solución:**
1. Verificar límites en https://resend.com/overview
2. Si alcanzaste el límite:
   - Esperar 24 horas (reset diario)
   - O upgrade a plan Pro

### Problema: Email no llega

**Solución:**
1. Verificar carpeta de spam
2. Verificar logs de Resend: https://resend.com/emails
3. Verificar que el email sea válido
4. Verificar que `EMAIL_FROM` use dominio verificado

---

## =Ú Recursos

- **Resend Docs:** https://resend.com/docs
- **Resend Dashboard:** https://resend.com/overview
- **Setup Checklist:** [backend/SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md)
- **README Backend:** [backend/README.md](./README.md)
- **Sprint 5 Tasks:** [docs/tasks s5.md](../docs/tasks%20s5.md)

---

**Última actualización:** 2025-01-17
**Estado:** =á Pendiente verificación en Resend Dashboard
**Siguiente paso:** Verificar dominio `entreamigas.ca` en Resend
