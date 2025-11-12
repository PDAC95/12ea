# Business Model Documentation

## Descripción General

Modelo Mongoose para gestión de negocios de mujeres migrantes en la comunidad "Entre Amigas".

**Archivo:** `backend/src/models/Business.js`

---

## Schema Fields

### Información Básica

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `name` | String | ✅ | 2-100 caracteres | Nombre del negocio |
| `category` | String | ✅ | Enum (10 categorías) | Categoría del negocio |
| `description` | String | ✅ | 20-1000 caracteres | Descripción detallada |

**Categorías disponibles:**
- Gastronomía
- Belleza y Bienestar
- Moda y Accesorios
- Servicios Profesionales
- Educación y Talleres
- Arte y Manualidades
- Salud
- Tecnología
- Eventos y Entretenimiento
- Otros

### Información de Contacto

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `phone` | String | ❌ | Formato teléfono | Teléfono de contacto |
| `email` | String | ❌ | Email válido | Email de contacto |
| `whatsapp` | String | ❌ | Formato teléfono | WhatsApp |

### Ubicación

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `city` | String | ✅ | - | Ciudad donde opera |
| `address` | String | ❌ | Max 200 caracteres | Dirección física |

### Presencia Digital

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `website` | String | ❌ | URL válida | Sitio web |
| `instagram` | String | ❌ | Username o URL | Instagram |
| `facebook` | String | ❌ | URL Facebook | Facebook |

### Media

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `logo` | String | ❌ | Placeholder S3 | Logo del negocio (URL) |
| `images` | [String] | ❌ | [] | Galería de imágenes (URLs) |

### Relación con Usuario

| Campo | Tipo | Requerido | Referencia | Descripción |
|-------|------|-----------|------------|-------------|
| `owner` | ObjectId | ✅ | User | Dueña del negocio |

### Estado y Visibilidad

| Campo | Tipo | Default | Índice | Descripción |
|-------|------|---------|--------|-------------|
| `isActive` | Boolean | true | ✅ | Negocio activo |
| `isVerified` | Boolean | false | ✅ | Negocio verificado por admin |
| `isFeatured` | Boolean | false | ✅ | Negocio destacado |

### Estadísticas

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `views` | Number | 0 | Contador de vistas |
| `contactClicks` | Number | 0 | Clics en información de contacto |

### Metadata

| Campo | Tipo | Auto | Descripción |
|-------|------|------|-------------|
| `createdAt` | Date | ✅ | Fecha de creación (timestamp) |
| `updatedAt` | Date | ✅ | Última actualización (timestamp) |
| `verifiedAt` | Date | ❌ | Fecha de verificación |
| `lastModifiedBy` | ObjectId | ❌ | Último usuario que modificó |

---

## Índices

### Índice de Texto Completo
```javascript
{
  name: 'text',
  description: 'text',
  category: 'text'
}
```
**Pesos:** name (10), category (5), description (1)

### Índices Individuales
- `category`
- `city`
- `owner`
- `isActive`
- `isVerified`
- `isFeatured`
- `views`
- `contactClicks`

### Índices Compuestos
- `{ city: 1, category: 1 }`
- `{ city: 1, isActive: 1 }`
- `{ category: 1, isActive: 1 }`
- `{ isActive: 1, isFeatured: 1, createdAt: -1 }`

---

## Métodos de Instancia

### `incrementViews()`
Incrementa el contador de vistas en 1.

```javascript
const business = await Business.findById(id);
await business.incrementViews();
```

### `incrementContactClicks()`
Incrementa el contador de clics en contacto en 1.

```javascript
const business = await Business.findById(id);
await business.incrementContactClicks();
```

### `verify()`
Marca el negocio como verificado.

```javascript
const business = await Business.findById(id);
await business.verify();
```

### `feature()`
Marca el negocio como destacado.

```javascript
const business = await Business.findById(id);
await business.feature();
```

### `getPublicProfile()`
Retorna objeto con datos públicos del negocio (sin información sensible).

```javascript
const business = await Business.findById(id);
const publicData = business.getPublicProfile();
```

---

## Métodos Estáticos

### `findActiveByCity(city)`
Busca negocios activos en una ciudad específica.

```javascript
const businesses = await Business.findActiveByCity('Toronto');
```

### `findActiveByCategory(category)`
Busca negocios activos en una categoría específica.

```javascript
const businesses = await Business.findActiveByCategory('Gastronomía');
```

### `findFeatured(limit = 6)`
Busca negocios destacados.

```javascript
const featured = await Business.findFeatured(10);
```

### `findByOwner(ownerId)`
Busca todos los negocios de un usuario específico.

```javascript
const myBusinesses = await Business.findByOwner(userId);
```

### `searchText(searchText, filters = {})`
Búsqueda de texto completo con filtros opcionales.

```javascript
const results = await Business.searchText('empanadas', {
  city: 'Toronto',
  category: 'Gastronomía'
});
```

### `getStats()`
Obtiene estadísticas generales de negocios.

```javascript
const stats = await Business.getStats();
// Returns: { total, active, verified, featured, byCategory, byCity }
```

---

## Virtuals (Campos Calculados)

### `engagementRate`
Tasa de engagement (CTR): `(contactClicks / views) * 100`

```javascript
const business = await Business.findById(id);
console.log(business.engagementRate); // "12.50"
```

### `hasSocialMedia`
Verifica si tiene Instagram o Facebook configurado.

```javascript
console.log(business.hasSocialMedia); // true/false
```

### `hasFullContact`
Verifica si tiene al menos un método de contacto (phone, email, whatsapp).

```javascript
console.log(business.hasFullContact); // true/false
```

---

## Hooks (Middleware)

### Pre-save: Normalización de URLs
- Quita @ de Instagram si existe
- Agrega `https://` a website si falta

### Post-save: Logging
- En desarrollo, muestra log de confirmación en consola

---

## Uso Básico

### Crear un negocio

```javascript
import Business from './models/Business.js';

const business = await Business.create({
  name: 'Mi Negocio',
  category: 'Gastronomía',
  description: 'Descripción de mi negocio...',
  phone: '+1234567890',
  email: 'contacto@example.com',
  city: 'Toronto',
  website: 'www.minegocio.com',
  instagram: '@minegocio',
  owner: userId, // ObjectId del usuario
});
```

### Buscar negocios

```javascript
// Por ciudad
const businesses = await Business.findActiveByCity('Toronto');

// Por categoría
const gastronomy = await Business.findActiveByCategory('Gastronomía');

// Búsqueda de texto
const results = await Business.searchText('empanadas arepas');

// Destacados
const featured = await Business.findFeatured(6);
```

### Actualizar estadísticas

```javascript
const business = await Business.findById(id);
await business.incrementViews();
await business.incrementContactClicks();
```

### Verificar negocio

```javascript
const business = await Business.findById(id);
await business.verify();
```

---

## Testing

Ejecutar test del modelo:

```bash
npm run test:business
```

El test verifica:
- ✅ Creación de negocio
- ✅ Validaciones
- ✅ Métodos de instancia
- ✅ Métodos estáticos
- ✅ Búsqueda de texto
- ✅ Estadísticas
- ✅ Virtuals
- ✅ Perfil público

---

## Próximos Pasos

1. ✅ Modelo Business creado
2. ⏳ Crear controlador (business.controller.js)
3. ⏳ Crear rutas (business.routes.js)
4. ⏳ Crear validadores (business.validator.js)
5. ⏳ Integrar en API principal

---

## Notas Técnicas

- **ES6 Modules:** Usa `import/export` (no CommonJS)
- **Mongoose:** v7.6.3
- **Timestamps:** Automáticos (`createdAt`, `updatedAt`)
- **Población:** El campo `owner` puede ser populado con datos del User
- **Índices:** Se crean automáticamente en la primera operación

---

## Ejemplo de Documento en MongoDB

```json
{
  "_id": "6914bb683634be7bc10985db",
  "name": "Sabores de Casa",
  "category": "Gastronomía",
  "description": "Restaurante familiar con comida latinoamericana...",
  "phone": "+1 (416) 555-0123",
  "email": "sabores@example.com",
  "whatsapp": "+14165550123",
  "city": "Toronto",
  "address": "123 Queen St W, Toronto",
  "website": "https://saboresdecasa.com",
  "instagram": "saboresdecasa",
  "facebook": "https://facebook.com/saboresdecasa",
  "logo": "https://entre-amigas-dev.s3.us-east-1.amazonaws.com/logos/sabores-logo.png",
  "images": [
    "https://entre-amigas-dev.s3.us-east-1.amazonaws.com/images/sabores-1.jpg"
  ],
  "owner": "691253ed10e3376ba8e88366",
  "isActive": true,
  "isVerified": true,
  "isFeatured": true,
  "views": 125,
  "contactClicks": 23,
  "verifiedAt": "2025-01-10T12:00:00.000Z",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-12T15:30:00.000Z"
}
```
