# Diagnóstico de Configuración de Resend - Sprint 5 Task 5.1.1

**Fecha:** 2025-01-18
**Estado:** ❌ ERROR IDENTIFICADO - Requiere verificación de dominio
**Prioridad:** 🔴 CRÍTICA

---

## 📊 Resultado del Test

### Test Ejecutado
```bash
cd backend && node test-resend.js
```

### Resultado
```json
{
  "data": null,
  "error": {
    "name": "application_error",
    "message": "Internal server error. We are unable to process your request right now, please try again later."
  }
}
```

**Status:** ❌ EMAIL NO ENVIADO

---

## ✅ Configuración Local CORRECTA

Las siguientes variables de entorno están correctamente configuradas:

| Variable | Valor | Status |
|----------|-------|--------|
| `RESEND_API_KEY` | `re_SPVSd...8Q4A` (oculta por seguridad) | ✅ |
| `EMAIL_FROM` | `noreply@entreamigas.ca` | ✅ |
| `EMAIL_REPLY_TO` | `hola@entreamigas.ca` | ✅ |
| `FRONTEND_URL` | `https://www.entreamigas.ca` | ✅ |
| `NODE_ENV` | `development` | ✅ |

**Conclusión:** El código y las variables de entorno están correctos.

---

## ❌ Problema Identificado

### Error: "Internal server error" de Resend

Este error típicamente ocurre cuando:

1. **Dominio no verificado en Resend Dashboard** (CAUSA MÁS PROBABLE)
2. API key revocada o inválida
3. Límite de envíos excedido
4. Problema temporal en servidores de Resend

### Diagnóstico Principal: Dominio No Verificado

El dominio `entreamigas.ca` está configurado en `EMAIL_FROM` como `noreply@entreamigas.ca`, pero **necesita estar verificado en Resend** antes de poder enviar emails.

---

## 🔧 Solución: Verificar Dominio en Resend

### Paso 1: Acceder a Resend Dashboard

1. Ir a: **https://resend.com/domains**
2. Iniciar sesión con la cuenta de Resend
3. Verificar el estado del dominio `entreamigas.ca`

### Paso 2: Verificar Estado del Dominio

#### Si el dominio NO existe:
1. Click en "Add Domain"
2. Ingresar: `entreamigas.ca`
3. Click en "Add"
4. Continuar con Paso 3

#### Si el dominio existe pero está "Pending":
1. Continuar con Paso 3 para configurar DNS

#### Si el dominio está "Verified":
1. El problema es otro (ver Paso 4)

### Paso 3: Configurar Records DNS

Resend te proporcionará 3 records DNS que debes agregar en tu proveedor de dominio:

#### 3.1 SPF Record (TXT)
```
Tipo: TXT
Host: @
Valor: v=spf1 include:_spf.resend.com ~all
```

#### 3.2 DKIM Record (TXT)
```
Tipo: TXT
Host: resend._domainkey
Valor: [Valor proporcionado por Resend - cópialo exactamente]
```

#### 3.3 DMARC Record (TXT) - OPCIONAL pero recomendado
```
Tipo: TXT
Host: _dmarc
Valor: v=DMARC1; p=none
```

### Paso 4: Agregar Records en Proveedor de Dominio

**¿Dónde está registrado `entreamigas.ca`?**
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Otro

**Pasos generales:**
1. Ir al panel de administración de tu proveedor de dominio
2. Buscar sección "DNS Management" o "DNS Settings"
3. Agregar los 3 records TXT proporcionados por Resend
4. Guardar cambios

### Paso 5: Esperar Propagación DNS

⏰ **Tiempo estimado:** 5-30 minutos (puede tomar hasta 48 horas)

Para verificar propagación:
```bash
# Verificar SPF
nslookup -type=TXT entreamigas.ca

# Verificar DKIM
nslookup -type=TXT resend._domainkey.entreamigas.ca
```

### Paso 6: Verificar Dominio en Resend

1. Regresar a https://resend.com/domains
2. Click en "Verify" junto al dominio `entreamigas.ca`
3. Esperar confirmación de verificación

**Estado esperado:** ✅ Verified

### Paso 7: Ejecutar Test Nuevamente

Una vez que el dominio esté verificado:

```bash
cd backend
node test-resend.js
```

**Resultado esperado:**
```
✅ EMAIL ENVIADO EXITOSAMENTE
🆔 ID del email: [resend-email-id]
```

---

## 🚀 Solución Alternativa: Usar Email de Desarrollo

Si necesitas probar el envío de emails **inmediatamente** antes de verificar el dominio:

### Opción 1: Usar dominio de prueba de Resend

Resend proporciona un dominio de prueba `onboarding@resend.dev` que puedes usar sin verificación:

```bash
# En .env - TEMPORAL SOLO PARA DESARROLLO
EMAIL_FROM=onboarding@resend.dev
EMAIL_REPLY_TO=onboarding@resend.dev
```

**⚠️ IMPORTANTE:** Esto es SOLO para testing local. NO usar en producción.

### Opción 2: Verificar otro dominio

Si tienes otro dominio ya verificado en Resend, úsalo temporalmente:

```bash
EMAIL_FROM=noreply@tuotrodominio.com
```

---

## 📋 Checklist de Verificación

### Antes de Verificar Dominio
- [x] Variables de entorno configuradas correctamente
- [x] Script de prueba creado (`test-resend.js`)
- [x] API key válida de Resend
- [ ] Dominio `entreamigas.ca` verificado en Resend

### Durante Verificación de Dominio
- [ ] Accedido a Resend Dashboard
- [ ] Dominio `entreamigas.ca` agregado
- [ ] Records DNS copiados de Resend
- [ ] Records DNS agregados en proveedor de dominio
- [ ] Esperado propagación DNS (5-30 min)
- [ ] Dominio verificado en Resend

### Después de Verificar Dominio
- [ ] Test de envío local exitoso
- [ ] Email recibido en `pdmckinster@gmail.com`
- [ ] Configuración de Railway actualizada
- [ ] Test de envío en producción exitoso

---

## 🔐 Verificación de API Key

Si después de verificar el dominio el problema persiste, verifica la API key:

### Paso 1: Revisar API Keys en Resend
1. Ir a: https://resend.com/api-keys
2. Verificar que la API key existe
3. Verificar que el estado sea "Active"
4. Verificar permisos: "Sending access" o "Full access"

### Paso 2: Si la API Key está Revocada
1. Click en "Create API Key"
2. Nombre: "Entre Amigas Backend - Production"
3. Permisos: "Full access"
4. Click en "Create"
5. **COPIAR LA API KEY INMEDIATAMENTE** (solo se muestra una vez)
6. Actualizar en `.env`:
   ```bash
   RESEND_API_KEY=re_nueva_api_key_aqui
   ```
7. Actualizar en Railway (ver sección siguiente)

---

## ☁️ Configuración en Railway (Producción)

Una vez que el test local funcione, configura las mismas variables en Railway:

### Paso 1: Acceder a Railway Dashboard
1. Ir a: https://railway.app
2. Seleccionar proyecto "Entre Amigas Backend"
3. Click en tab "Variables"

### Paso 2: Verificar/Actualizar Variables

Asegúrate de que existan estas variables:

```env
# Email Service - Resend
RESEND_API_KEY=re_SPVSdTZe_7yVhVDj6RssNL1kDquvU8Q4A
EMAIL_FROM=noreply@entreamigas.ca
EMAIL_REPLY_TO=hola@entreamigas.ca

# Frontend URL
FRONTEND_URL=https://www.entreamigas.ca
CORS_ORIGIN=https://www.entreamigas.ca

# Google OAuth
GOOGLE_CALLBACK_URL=https://api.entreamigas.ca/api/v1/auth/google/callback
```

### Paso 3: Redesplegar (Automático)
Railway redesplegará automáticamente al cambiar las variables.

### Paso 4: Verificar Logs
1. Tab "Deployments"
2. Click en el último deployment
3. Click en "View Logs"
4. Buscar:
   ```
   ✅ Resend Email Service configurado
   📮 Email remitente: noreply@entreamigas.ca
   ```

---

## 📊 Status de Task 5.1.1

### Criterios de Aceptación

| Criterio | Status |
|----------|--------|
| Variable `RESEND_API_KEY` existe en Railway | ✅ |
| Variable `EMAIL_FROM` es válida (`noreply@entreamigas.ca`) | ✅ |
| Dominio `entreamigas.ca` está verificado en Resend | ❌ **PENDIENTE** |
| API key tiene permisos de envío | ✅ |
| Test de envío local funciona | ❌ **PENDIENTE** |
| Test de envío en producción funciona | ❌ **PENDIENTE** |

**Status General:** ⏸️ **BLOQUEADO** - Requiere verificación de dominio

---

## 📝 Próximos Pasos

### Inmediato (HOY)
1. **Verificar dominio `entreamigas.ca` en Resend**
   - Acceder a https://resend.com/domains
   - Agregar/verificar dominio
   - Configurar DNS records
2. **Ejecutar test local nuevamente**
   ```bash
   node test-resend.js
   ```
3. **Verificar recepción de email**

### Después de Verificar Dominio
1. **Actualizar Railway** (si es necesario)
2. **Test en producción**
3. **Marcar Task 5.1.1 como completada**
4. **Continuar con Task 5.1.2** (EmailVerificationToken model)

---

## 📚 Recursos

- **Resend Dashboard:** https://resend.com/overview
- **Resend Domains:** https://resend.com/domains
- **Resend API Keys:** https://resend.com/api-keys
- **Resend Docs:** https://resend.com/docs
- **DNS Propagation Checker:** https://dnschecker.org
- **Sprint 5 Tasks:** [docs/tasks s5.md](../docs/tasks%20s5.md)

---

## 🆘 Soporte

Si el problema persiste después de verificar el dominio:

1. **Revisar logs de Resend:** https://resend.com/emails
2. **Contactar soporte de Resend:** support@resend.com
3. **Revisar documentación:** https://resend.com/docs/send-with-nodejs

---

**Última actualización:** 2025-01-18
**Status:** ❌ ERROR - Requiere verificación de dominio en Resend
**Siguiente acción:** Verificar `entreamigas.ca` en https://resend.com/domains
