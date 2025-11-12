# Service Model - Entre Amigas

Modelo de Mongoose para la gestión de servicios profesionales de mujeres migrantes en la comunidad.

---

## Características Principales

✅ **9 tipos de servicios**: Salud, Legal, Educación, Financiero, Inmigración, Traducción, Tecnología, Consultoría, Otros
✅ **Validaciones robustas**: Email, teléfono, URLs (website, Facebook, LinkedIn)
✅ **Búsqueda full-text**: Índices de texto con pesos (name: 10, serviceType: 5, description: 1)
✅ **Analytics integrados**: Views y contact clicks
✅ **Credenciales**: Campo especial para certificaciones profesionales
✅ **Hooks automáticos**: Normalización de URLs e Instagram
✅ **Virtuals útiles**: engagementRate, hasSocialMedia, hasFullContact
✅ **Métodos de instancia**: incrementViews(), incrementContactClicks(), verify(), feature()
✅ **Métodos estáticos**: findActiveByCity(), searchText(), getStats()

---

## Schema Overview

```javascript
{
  // Información Básica
  name: String (required, 2-100 chars),
  serviceType: Enum (required),
  description: String (required, 20-1000 chars),
  credentials: String (optional, max 500 chars),

  // Contacto
  phone: String (validación de formato),
  email: String (validación email),
  whatsapp: String (validación de formato),

  // Ubicación
  city: String (required, indexed),
  address: String (optional, max 200 chars),

  // Presencia Digital
  website: String (validación URL),
  instagram: String,
  facebook: String (validación Facebook URL),
  linkedin: String (validación LinkedIn URL),

  // Medios
  logo: String (default placeholder),
  images: [String] (array de URLs),

  // Relaciones
  owner: ObjectId → User (required),

  // Estado
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  isFeatured: Boolean (default: false),

  // Analytics
  views: Number (default: 0),
  contactClicks: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Tipos de Servicio (serviceType)

1. **Salud** - Médicos, enfermeras, terapeutas
2. **Legal** - Abogados, notarios, asesores legales
3. **Educación** - Tutores, profesores, academias
4. **Financiero** - Contadores, asesores financieros
5. **Inmigración** - Consultores de inmigración, abogados
6. **Traducción** - Traductores, intérpretes
7. **Tecnología** - Desarrolladores, diseñadores, IT
8. **Consultoría** - Consultores de negocio, coaches
9. **Otros** - Otros servicios profesionales

---

## Índices

### Text Index (Full-Text Search)
```javascript
{
  name: 'text',
  description: 'text',
  serviceType: 'text'
}
Weights: { name: 10, serviceType: 5, description: 1 }
```

### Compound Indexes
- `{ serviceType: 1, city: 1, isActive: 1 }` - Búsquedas por tipo y ciudad
- `{ owner: 1, isActive: 1 }` - Servicios de un usuario
- `{ createdAt: -1 }` - Ordenamiento por fecha
- `{ isVerified: 1, isFeatured: 1 }` - Servicios destacados

---

## Virtuals

### engagementRate
Calcula el porcentaje de engagement (contactClicks / views * 100)

```javascript
const rate = service.engagementRate; // "15.50"
```

### hasSocialMedia
Verifica si tiene al menos una red social configurada

```javascript
const hasSocial = service.hasSocialMedia; // true/false
```

### hasFullContact
Verifica si tiene teléfono y email

```javascript
const hasContact = service.hasFullContact; // true/false
```

---

## Métodos de Instancia

### incrementViews()
Incrementa el contador de visualizaciones

```javascript
await service.incrementViews();
```

### incrementContactClicks()
Incrementa el contador de clics en contacto

```javascript
await service.incrementContactClicks();
```

### verify()
Marca el servicio como verificado (solo admin)

```javascript
await service.verify();
```

### feature()
Marca el servicio como destacado (solo admin)

```javascript
await service.feature();
```

---

## Métodos Estáticos

### findActiveByCity(city)
Busca servicios activos por ciudad

```javascript
const services = await Service.findActiveByCity('Toronto');
```

### searchText(searchTerm, filters)
Búsqueda de texto completo con filtros opcionales

```javascript
const results = await Service.searchText('médico familiar', {
  serviceType: 'Salud',
  city: 'Toronto'
});
```

### getStats()
Obtiene estadísticas generales de servicios

```javascript
const stats = await Service.getStats();
// {
//   general: { total, active, verified, featured, totalViews, totalClicks },
//   byType: [{ _id: 'Salud', count: 15 }, ...],
//   byCity: [{ _id: 'Toronto', count: 30 }, ...]
// }
```

---

## Validaciones

### Email
```javascript
Regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
```

### Phone / WhatsApp
```javascript
Regex: /^[\d\s\-\+\(\)]{10,20}$/
Formato: +1 (416) 555-0100
```

### Website
```javascript
Regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
```

### Facebook
```javascript
Regex: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/
```

### LinkedIn
```javascript
Regex: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/.+$/
```

### Logo / Images
```javascript
Regex: /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i
```

---

## Pre-save Hooks

### Normalización de Website
Agrega `https://` si no está presente

```javascript
// Antes: "example.com"
// Después: "https://example.com"
```

### Normalización de Instagram
Remueve el `@` si está presente

```javascript
// Antes: "@username"
// Después: "username"
```

---

## Ejemplo de Uso

```javascript
import Service from './models/Service.js';

// Crear servicio
const service = new Service({
  name: 'Dra. Ana Martínez - Medicina Familiar',
  serviceType: 'Salud',
  description: 'Médica familiar con 15 años de experiencia...',
  credentials: 'MD, CCFP, 15+ años de experiencia',
  phone: '+1 (416) 555-0200',
  email: 'dra.martinez@health.com',
  whatsapp: '+14165550200',
  city: 'Toronto',
  address: '123 Medical Center, Toronto, ON',
  website: 'https://dra-martinez.com',
  instagram: '@dra.martinez',
  linkedin: 'https://linkedin.com/in/ana-martinez-md',
  owner: userId,
});

await service.save();

// Incrementar vistas
await service.incrementViews();

// Buscar servicios
const services = await Service.find({
  serviceType: 'Salud',
  city: 'Toronto',
  isActive: true
})
.populate('owner', 'preferredName email')
.sort({ createdAt: -1 });

// Búsqueda de texto
const results = await Service.searchText('médico familiar');

// Estadísticas
const stats = await Service.getStats();
console.log(`Total de servicios: ${stats.general.total}`);
```

---

## Testing

Ejecutar tests del modelo:

```bash
npm run test:service
```

El script de testing valida:
- ✅ Creación de servicios válidos
- ✅ Validación de campos requeridos
- ✅ Validación de enum serviceType
- ✅ Validación de email
- ✅ Validación de URLs
- ✅ Pre-save hooks
- ✅ Índices de texto
- ✅ Métodos de instancia
- ✅ Virtuals
- ✅ Métodos estáticos

---

## Diferencias con Business Model

| Característica | Business | Service |
|----------------|----------|---------|
| Campo principal | `category` | `serviceType` |
| Categorías | 10 tipos de negocios | 9 tipos de servicios |
| Campo especial | - | `credentials` |
| Red social extra | - | `linkedin` |
| Enfoque | Productos/tiendas | Profesionales/servicios |

---

## Archivos Relacionados

- **Model**: `backend/src/models/Service.js`
- **Test**: `backend/test-service-model.js`
- **Controller**: `backend/src/controllers/service.controller.js` (próximo)
- **Routes**: `backend/src/routes/service.routes.js` (próximo)
- **Validators**: `backend/src/validators/service.validator.js` (próximo)

---

**Creado:** 2025-01-12
**Proyecto:** Entre Amigas - Comunidad de Mujeres Migrantes
**Status:** ✅ Task 6.1 Completado
