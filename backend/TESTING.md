# Testing Guide - Entre Amigas Backend

## Descripción General

Este proyecto usa **Jest** como framework de testing y **Supertest** para tests de endpoints HTTP.

## Stack de Testing

- **Jest**: Framework de testing con soporte para ES Modules
- **Supertest**: Librería para tests de APIs HTTP
- **MongoDB Memory Server** (opcional): Para tests aislados sin DB real

## Configuración Inicial

### 1. Instalar Dependencias

Las dependencias ya están instaladas en el proyecto:

```bash
npm install --save-dev jest supertest @babel/preset-env
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus valores:

```bash
cp .env.test.example .env.test
```

Edita `.env.test`:

```env
MONGODB_TEST_URI=mongodb://localhost:27017/entreamigas-test
JWT_SECRET=test-secret-key-for-testing-only
NODE_ENV=test
```

⚠️ **IMPORTANTE**: Usa una base de datos separada para tests. Los tests limpian automáticamente la DB.

## Ejecutar Tests

### Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests de Tips
npm run test:tips

# Modo watch (re-ejecuta automáticamente)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Estructura de Tests

```
backend/
├── tests/
│   ├── tip.model.test.js      # Tests del modelo Tip
│   ├── tip.controller.test.js # Tests de endpoints de Tips
│   └── README.md              # Documentación de tests
├── jest.config.js             # Configuración de Jest
└── .env.test                  # Variables de entorno para tests
```

## Tests Implementados

### Tests del Modelo (`tip.model.test.js`)

**Validaciones**:
- ✅ Crear tip válido
- ✅ Fallar si título muy corto (<5 caracteres)
- ✅ Fallar si contenido muy corto (<100 caracteres)
- ✅ Fallar si categoría inválida
- ✅ Fallar si faltan campos requeridos

**Métodos de Instancia**:
- ✅ `approve()` - Aprobar tip
- ✅ `reject()` - Rechazar tip con razón
- ✅ `incrementViews()` - Incrementar vistas
- ✅ `addLike()` - Agregar like
- ✅ `removeLike()` - Quitar like
- ✅ Prevenir likes duplicados

**Campos Virtuales**:
- ✅ `likeCount` - Calcular número de likes

**Métodos Estáticos**:
- ✅ `findPending()` - Buscar tips pendientes
- ✅ `findByAuthor()` - Buscar tips por autor
- ✅ `findMostLiked()` - Buscar tips más gustados
- ✅ `getStats()` - Obtener estadísticas

**Valores por Defecto**:
- ✅ Status = 'pending'
- ✅ Views = 0
- ✅ Likes = []

### Tests del Controlador (`tip.controller.test.js`)

**Endpoints Públicos**:
- ✅ `GET /api/v1/tips` - Listar tips aprobados
  - Solo muestra tips aprobados
  - Filtra por categoría
  - Retorna category counts
  - Pagina resultados
- ✅ `GET /api/v1/tips/:id` - Detalle de tip
  - Retorna tip aprobado
  - No muestra tips pending
  - Incrementa vistas
  - Retorna 404 si no existe

**Endpoints Protegidos (Usuario)**:
- ✅ `POST /api/v1/tips/my/propose` - Proponer tip
  - Crea tip con datos válidos
  - Falla sin autenticación
  - Valida título (min 5 caracteres)
  - Valida contenido (min 100 caracteres)
  - Valida categoría
- ✅ `GET /api/v1/tips/my/list` - Listar mis tips
  - Retorna tips del usuario
  - Requiere autenticación
- ✅ `PUT /api/v1/tips/my/:id` - Actualizar mi tip
  - Actualiza tip pending
  - No permite editar tip approved
- ✅ `DELETE /api/v1/tips/my/:id` - Eliminar mi tip
  - Elimina tip pending
  - No permite eliminar tip approved
- ✅ `POST /api/v1/tips/:id/like` - Dar like
  - Agrega like exitosamente
  - Falla si ya dio like
- ✅ `DELETE /api/v1/tips/:id/like` - Quitar like
  - Remueve like exitosamente
  - Falla si no había dado like

**Endpoints Admin**:
- ✅ `GET /api/v1/admin/tips/pending` - Tips pendientes
  - Lista tips pending
  - Requiere rol admin
- ✅ `PUT /api/v1/admin/tips/:id/approve` - Aprobar tip
  - Aprueba tip pending
  - Requiere rol admin
- ✅ `PUT /api/v1/admin/tips/:id/reject` - Rechazar tip
  - Rechaza con razón válida
  - Requiere razón (min 10 caracteres)
  - Requiere rol admin
- ✅ `DELETE /api/v1/admin/tips/:id` - Eliminar tip
  - Elimina cualquier tip
  - Requiere rol admin

## Cobertura de Código

Ejecutar con:
```bash
npm run test:coverage
```

Genera reporte en `coverage/lcov-report/index.html`

**Meta de Cobertura**:
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## Buenas Prácticas

### 1. Estructura de Tests

```javascript
describe('Feature', () => {
  beforeEach(async () => {
    // Setup compartido
  });

  test('should do something specific', async () => {
    // Arrange
    const data = { ... };

    // Act
    const result = await action(data);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### 2. Nombres Descriptivos

✅ **Bueno**:
```javascript
test('should return 400 if title is less than 5 characters', ...)
```

❌ **Malo**:
```javascript
test('validation test', ...)
```

### 3. Datos de Prueba

- Usa datos realistas pero mínimos
- Evita hardcodear IDs reales
- Limpia datos después de cada test

### 4. Assertions Claras

✅ **Bueno**:
```javascript
expect(res.status).toBe(200);
expect(res.body.success).toBe(true);
expect(res.body.data.title).toBe('Expected Title');
```

❌ **Malo**:
```javascript
expect(res).toBeTruthy();
```

## Troubleshooting

### Error: Cannot find module

**Problema**: Jest no encuentra módulos

**Solución**:
- Verifica que imports terminen en `.js`
- Asegúrate de que `"type": "module"` esté en package.json
- Usa rutas absolutas desde la raíz del backend

### Error: Timeout

**Problema**: Tests exceden tiempo límite

**Solución**:
- Aumenta `testTimeout` en `jest.config.js`
- Verifica que MongoDB esté corriendo
- Revisa conexiones no cerradas

### Tests fallan por MongoDB

**Problema**: No puede conectar a base de datos

**Solución**:
```bash
# Verificar que MongoDB esté corriendo
mongosh mongodb://localhost:27017/entreamigas-test

# Si no está corriendo, iniciarlo
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod
```

### Limpieza de Base de Datos

Si los tests dejan datos sucios:

```bash
# Conectar a DB de test
mongosh mongodb://localhost:27017/entreamigas-test

# Eliminar colecciones
db.tips.drop()
db.users.drop()
```

## CI/CD Integration

Para integrar con GitHub Actions:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Próximos Pasos

- [ ] Agregar tests para otros módulos (Events, Business, Services)
- [ ] Implementar MongoDB Memory Server para tests aislados
- [ ] Configurar CI/CD en GitHub Actions
- [ ] Agregar tests de integración E2E
- [ ] Implementar tests de performance
