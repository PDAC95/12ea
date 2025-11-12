# Business API Documentation

API RESTful para gestión de negocios de mujeres migrantes en la comunidad "Entre Amigas".

**Base URL:** `http://localhost:8000/api/v1/businesses`

---

## Tabla de Contenidos

1. [Endpoints Públicos](#endpoints-públicos)
2. [Endpoints Privados](#endpoints-privados)
3. [Endpoints Admin](#endpoints-admin)
4. [Modelos de Datos](#modelos-de-datos)
5. [Filtros y Paginación](#filtros-y-paginación)
6. [Códigos de Error](#códigos-de-error)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Endpoints Públicos

### 1. Obtener Categorías Disponibles

```
GET /api/v1/businesses/categories
```

Retorna lista de categorías de negocios con conteo de negocios activos por categoría.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Gastronomía",
      "count": 15
    },
    {
      "name": "Belleza y Bienestar",
      "count": 8
    }
  ]
}
```

---

### 2. Obtener Estadísticas Generales

```
GET /api/v1/businesses/stats
```

Retorna estadísticas agregadas de negocios.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "active": 42,
    "verified": 30,
    "featured": 6,
    "byCategory": [
      { "_id": "Gastronomía", "count": 15 },
      { "_id": "Belleza y Bienestar", "count": 8 }
    ],
    "byCity": [
      { "_id": "Toronto", "count": 25 },
      { "_id": "Montreal", "count": 12 }
    ]
  }
}
```

---

### 3. Obtener Negocios Destacados

```
GET /api/v1/businesses/featured?limit=6
```

Retorna negocios marcados como destacados (isFeatured=true).

**Query Parameters:**
- `limit` (optional): Número de negocios a retornar (default: 6)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6914bb683634be7bc10985db",
      "name": "Sabores de Casa",
      "category": "Gastronomía",
      "description": "Restaurante familiar...",
      "city": "Toronto",
      "logo": "https://...",
      "isVerified": true,
      "isFeatured": true,
      "views": 125,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "owner": {
        "_id": "691253ed10e3376ba8e88366",
        "preferredName": "María",
        "email": "maria@example.com"
      }
    }
  ]
}
```

---

### 4. Listar Negocios con Filtros y Paginación

```
GET /api/v1/businesses?search=cafe&category=Gastronomía&city=Toronto&page=1&limit=20
```

Endpoint principal para buscar y filtrar negocios.

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `search` | string | - | Búsqueda full-text (nombre, descripción, categoría) |
| `category` | string | - | Filtrar por categoría exacta |
| `city` | string | - | Filtrar por ciudad (case-insensitive) |
| `verified` | boolean | - | Solo negocios verificados (`true`/`false`) |
| `featured` | boolean | - | Solo negocios destacados (`true`/`false`) |
| `page` | number | 1 | Número de página |
| `limit` | number | 20 | Items por página (max: 100) |
| `sortBy` | string | createdAt | Campo para ordenar: `createdAt`, `name`, `views`, `contactClicks` |
| `sortOrder` | string | desc | Orden: `asc` o `desc` |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "6914bb683634be7bc10985db",
        "name": "Sabores de Casa",
        "category": "Gastronomía",
        "description": "Restaurante familiar...",
        "phone": "+1 (416) 555-0123",
        "email": "contacto@saboresdecasa.com",
        "whatsapp": "+14165550123",
        "city": "Toronto",
        "address": "123 Queen St W, Toronto",
        "website": "https://saboresdecasa.com",
        "instagram": "saboresdecasa",
        "facebook": "https://facebook.com/saboresdecasa",
        "logo": "https://...",
        "images": ["https://..."],
        "isVerified": true,
        "isFeatured": false,
        "views": 125,
        "contactClicks": 23,
        "owner": {
          "_id": "691253ed10e3376ba8e88366",
          "preferredName": "María",
          "email": "maria@example.com",
          "city": "Toronto"
        },
        "createdAt": "2025-01-01T10:00:00.000Z",
        "updatedAt": "2025-01-10T15:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 5. Obtener Negocio por ID

```
GET /api/v1/businesses/:id
```

Retorna detalle completo de un negocio específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6914bb683634be7bc10985db",
    "name": "Sabores de Casa",
    "category": "Gastronomía",
    "description": "Restaurante familiar...",
    "phone": "+1 (416) 555-0123",
    "email": "contacto@saboresdecasa.com",
    "whatsapp": "+14165550123",
    "city": "Toronto",
    "address": "123 Queen St W, Toronto",
    "website": "https://saboresdecasa.com",
    "instagram": "saboresdecasa",
    "facebook": "https://facebook.com/saboresdecasa",
    "logo": "https://...",
    "images": ["https://..."],
    "isActive": true,
    "isVerified": true,
    "isFeatured": true,
    "views": 125,
    "contactClicks": 23,
    "owner": {
      "_id": "691253ed10e3376ba8e88366",
      "preferredName": "María",
      "email": "maria@example.com",
      "city": "Toronto",
      "bio": "Emprendedora colombiana..."
    },
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-10T15:30:00.000Z",
    "engagementRate": "18.40",
    "hasSocialMedia": true,
    "hasFullContact": true
  }
}
```

---

### 6. Incrementar Contador de Vistas (Analytics)

```
POST /api/v1/businesses/:id/view
```

Incrementa el contador de vistas en 1. Útil para tracking de analytics.

**Response:**
```json
{
  "success": true,
  "message": "Vista registrada",
  "data": {
    "views": 126
  }
}
```

---

### 7. Incrementar Contador de Clics en Contacto (Analytics)

```
POST /api/v1/businesses/:id/contact-click
```

Incrementa el contador de clics en información de contacto. Útil para medir engagement.

**Response:**
```json
{
  "success": true,
  "message": "Clic de contacto registrado",
  "data": {
    "contactClicks": 24
  }
}
```

---

## Endpoints Privados

Requieren autenticación mediante JWT token en header:
```
Authorization: Bearer {token}
```

### 8. Obtener Mis Negocios

```
GET /api/v1/businesses/my/list
```

Retorna todos los negocios del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6914bb683634be7bc10985db",
      "name": "Sabores de Casa",
      "category": "Gastronomía",
      "isActive": true,
      "isVerified": true,
      "views": 125,
      "contactClicks": 23,
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 9. Crear Nuevo Negocio

```
POST /api/v1/businesses
```

Crea un nuevo negocio. El owner es automáticamente el usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (Mínimo Requerido):**
```json
{
  "name": "Mi Negocio",
  "category": "Gastronomía",
  "description": "Descripción detallada del negocio con al menos 20 caracteres",
  "city": "Toronto"
}
```

**Body (Completo):**
```json
{
  "name": "Sabores de Casa",
  "category": "Gastronomía",
  "description": "Restaurante familiar que ofrece auténtica comida latinoamericana preparada con recetas tradicionales. Especializados en empanadas, arepas y platos típicos de Colombia y Venezuela.",
  "phone": "+1 (416) 555-0123",
  "email": "contacto@saboresdecasa.com",
  "whatsapp": "+14165550123",
  "city": "Toronto",
  "address": "123 Queen St W, Toronto, ON M5H 2M9",
  "website": "https://saboresdecasa.com",
  "instagram": "@saboresdecasa",
  "facebook": "https://facebook.com/saboresdecasa",
  "logo": "https://entre-amigas-dev.s3.us-east-1.amazonaws.com/logos/sabores.png",
  "images": [
    "https://entre-amigas-dev.s3.us-east-1.amazonaws.com/images/sabores1.jpg",
    "https://entre-amigas-dev.s3.us-east-1.amazonaws.com/images/sabores2.jpg"
  ]
}
```

**Validaciones:**
- `name`: 2-100 caracteres
- `category`: Debe ser una categoría válida (ver endpoint `/categories`)
- `description`: 20-1000 caracteres
- `city`: 2-100 caracteres
- `phone`, `whatsapp`: Formato de teléfono (10-20 caracteres)
- `email`: Email válido
- `website`: URL válida
- `instagram`: Username (@usuario) o URL de Instagram
- `facebook`: URL de Facebook
- `logo`, `images`: URLs de imágenes (jpg, jpeg, png, webp, gif, svg)

**Response:**
```json
{
  "success": true,
  "message": "Negocio creado exitosamente",
  "data": {
    "_id": "6914bb683634be7bc10985db",
    "name": "Sabores de Casa",
    "category": "Gastronomía",
    "description": "Restaurante familiar...",
    "owner": {
      "_id": "691253ed10e3376ba8e88366",
      "preferredName": "María",
      "email": "maria@example.com"
    },
    "isActive": true,
    "isVerified": false,
    "isFeatured": false,
    "views": 0,
    "contactClicks": 0,
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 10. Actualizar Negocio

```
PUT /api/v1/businesses/:id
```

Actualiza un negocio existente. Solo el owner o admin pueden actualizar.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (Ejemplo - Solo campos a actualizar):**
```json
{
  "description": "Nueva descripción actualizada del negocio con más de 20 caracteres",
  "phone": "+1 (416) 555-9999",
  "website": "https://nuevoweb.com"
}
```

**Restricciones:**
- Los campos `owner`, `views`, `contactClicks` NO se pueden modificar directamente
- Los campos `isVerified`, `isFeatured` solo pueden ser modificados por admin
- Las validaciones son las mismas que en creación (pero todos los campos son opcionales)

**Response:**
```json
{
  "success": true,
  "message": "Negocio actualizado exitosamente",
  "data": {
    "_id": "6914bb683634be7bc10985db",
    "name": "Sabores de Casa",
    "description": "Nueva descripción actualizada...",
    "phone": "+1 (416) 555-9999",
    "website": "https://nuevoweb.com",
    "updatedAt": "2025-01-15T12:00:00.000Z",
    "lastModifiedBy": "691253ed10e3376ba8e88366"
  }
}
```

---

### 11. Eliminar Negocio (Soft Delete)

```
DELETE /api/v1/businesses/:id
```

Elimina un negocio (soft delete - marca como inactivo). Solo el owner o admin pueden eliminar.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Negocio eliminado exitosamente"
}
```

**Nota:** El negocio no se elimina de la base de datos, solo se marca `isActive: false`.

---

## Endpoints Admin

Solo accesibles para usuarios con `role: 'admin'`.

### 12. Verificar Negocio

```
PUT /api/v1/businesses/:id
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body:**
```json
{
  "isVerified": true
}
```

---

### 13. Destacar Negocio

```
PUT /api/v1/businesses/:id
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body:**
```json
{
  "isFeatured": true
}
```

---

## Modelos de Datos

### Business Schema

```typescript
{
  _id: ObjectId,
  name: string (2-100 chars),
  category: enum [
    'Gastronomía',
    'Belleza y Bienestar',
    'Moda y Accesorios',
    'Servicios Profesionales',
    'Educación y Talleres',
    'Arte y Manualidades',
    'Salud',
    'Tecnología',
    'Eventos y Entretenimiento',
    'Otros'
  ],
  description: string (20-1000 chars),
  phone?: string,
  email?: string,
  whatsapp?: string,
  city: string,
  address?: string,
  website?: string,
  instagram?: string,
  facebook?: string,
  logo?: string (URL),
  images?: string[] (URLs),
  owner: ObjectId (ref: User),
  isActive: boolean (default: true),
  isVerified: boolean (default: false),
  isFeatured: boolean (default: false),
  views: number (default: 0),
  contactClicks: number (default: 0),
  verifiedAt?: Date,
  lastModifiedBy?: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Virtuals (Campos Calculados)

- `engagementRate`: (contactClicks / views) * 100
- `hasSocialMedia`: boolean (tiene Instagram o Facebook)
- `hasFullContact`: boolean (tiene al menos un método de contacto)

---

## Filtros y Paginación

### Búsqueda Full-Text

El parámetro `search` realiza búsqueda en:
- Nombre del negocio (peso: 10)
- Categoría (peso: 5)
- Descripción (peso: 1)

Ejemplo:
```
GET /api/v1/businesses?search=empanadas cafe
```

### Filtros Combinados

Puedes combinar múltiples filtros:
```
GET /api/v1/businesses?category=Gastronomía&city=Toronto&verified=true&page=1&limit=10
```

### Ordenamiento

```
GET /api/v1/businesses?sortBy=views&sortOrder=desc
```

Campos disponibles para `sortBy`:
- `createdAt` (default)
- `name`
- `views`
- `contactClicks`

---

## Códigos de Error

### 400 - Bad Request

**Validación de datos:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "name",
      "message": "El nombre debe tener entre 2 y 100 caracteres",
      "value": "A"
    },
    {
      "field": "email",
      "message": "Debe proporcionar un email válido",
      "value": "invalid-email"
    }
  ]
}
```

**ID inválido:**
```json
{
  "success": false,
  "message": "ID de negocio inválido"
}
```

---

### 401 - Unauthorized

**Token no proporcionado:**
```json
{
  "success": false,
  "message": "No autorizado. Token no proporcionado.",
  "code": "NO_TOKEN"
}
```

**Token expirado:**
```json
{
  "success": false,
  "message": "Token expirado. Por favor inicia sesión nuevamente.",
  "code": "TOKEN_EXPIRED"
}
```

---

### 403 - Forbidden

**Sin permiso para editar:**
```json
{
  "success": false,
  "message": "No tienes permiso para editar este negocio"
}
```

---

### 404 - Not Found

**Negocio no encontrado:**
```json
{
  "success": false,
  "message": "Negocio no encontrado"
}
```

---

### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Error al obtener la lista de negocios",
  "error": "MongoDB connection error..." // Solo en development
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Listar Negocios de Gastronomía en Toronto

```bash
curl -X GET "http://localhost:8000/api/v1/businesses?category=Gastronomía&city=Toronto&page=1&limit=10"
```

### Ejemplo 2: Buscar "empanadas"

```bash
curl -X GET "http://localhost:8000/api/v1/businesses?search=empanadas"
```

### Ejemplo 3: Crear Negocio

```bash
curl -X POST "http://localhost:8000/api/v1/businesses" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Negocio",
    "category": "Gastronomía",
    "description": "Descripción detallada del negocio con al menos 20 caracteres",
    "city": "Toronto",
    "phone": "+14165550123"
  }'
```

### Ejemplo 4: Actualizar Negocio

```bash
curl -X PUT "http://localhost:8000/api/v1/businesses/6914bb683634be7bc10985db" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nueva descripción actualizada con más de 20 caracteres",
    "phone": "+14165559999"
  }'
```

### Ejemplo 5: Registrar Vista

```bash
curl -X POST "http://localhost:8000/api/v1/businesses/6914bb683634be7bc10985db/view"
```

---

## Testing

Archivo de testing HTTP disponible en: `backend/business-api.http`

Puedes usar extensiones como:
- **REST Client** (VS Code)
- **Thunder Client** (VS Code)
- **Postman**
- **Insomnia**

---

## Notas Técnicas

- **Paginación:** Default 20 items por página, máximo recomendado 100
- **Rate Limiting:** Configurado en server.js (100 requests por 15 minutos por IP)
- **CORS:** Configurado para `http://localhost:8080` (frontend)
- **Soft Delete:** Los negocios eliminados se marcan como `isActive: false`
- **Búsqueda:** Usa índices de texto de MongoDB para performance óptima
- **Analytics:** Los contadores de vistas y clics son incrementales (no se resetean)
- **Autenticación:** JWT tokens válidos por 7 días (configurable en `.env`)

---

## Categorías Disponibles

1. Gastronomía
2. Belleza y Bienestar
3. Moda y Accesorios
4. Servicios Profesionales
5. Educación y Talleres
6. Arte y Manualidades
7. Salud
8. Tecnología
9. Eventos y Entretenimiento
10. Otros

---

**Documentación actualizada:** 2025-01-12
**Versión API:** 1.0.0
**Proyecto:** Entre Amigas - Comunidad de Mujeres Migrantes
