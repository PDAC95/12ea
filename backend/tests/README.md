# Tests Unitarios - Entre Amigas Backend

Este directorio contiene los tests unitarios para el backend de Entre Amigas usando Jest y Supertest.

## Configuración

### Variables de Entorno para Tests

Crea un archivo `.env.test` en la raíz del backend con:

```env
MONGODB_TEST_URI=mongodb://localhost:27017/entreamigas-test
JWT_SECRET=test-secret-key-for-testing
```

**IMPORTANTE**: Usa una base de datos diferente para tests. Los tests limpian la base de datos automáticamente.

## Ejecutar Tests

### Todos los tests
```bash
npm test
```

### Solo tests de Tips
```bash
npm run test:tips
```

### Modo watch (re-ejecuta al guardar cambios)
```bash
npm run test:watch
```

### Con cobertura de código
```bash
npm run test:coverage
```

## Estructura de Tests

### `tip.model.test.js`
Tests unitarios para el modelo Tip:
- Validaciones de campos
- Métodos de instancia (approve, reject, addLike, removeLike)
- Campos virtuales (likeCount)
- Métodos estáticos (findPending, findByAuthor, getStats)
- Valores por defecto

### `tip.controller.test.js`
Tests de integración para los endpoints de Tips:
- **Endpoints públicos**: GET /tips, GET /tips/:id
- **Endpoints de usuario**: POST /my/propose, GET /my/list, PUT /my/:id, DELETE /my/:id, POST /like, DELETE /like
- **Endpoints admin**: GET /pending, PUT /approve, PUT /reject, DELETE /:id

## Estructura de un Test

```javascript
describe('Feature Group', () => {
  beforeEach(async () => {
    // Setup antes de cada test
  });

  test('should do something', async () => {
    // Arrange: preparar datos
    const data = { ... };

    // Act: ejecutar acción
    const result = await someFunction(data);

    // Assert: verificar resultado
    expect(result).toBe(expected);
  });
});
```

## Coverage Esperado

Los tests cubren:
- ✅ Validaciones de entrada
- ✅ Autenticación y autorización
- ✅ Lógica de negocio (aprobación, rechazo, likes)
- ✅ Manejo de errores
- ✅ Estados de datos (pending, approved, rejected)
- ✅ Paginación y filtros

## Tips para Escribir Tests

1. **Nombres descriptivos**: Usa nombres que expliquen qué se está probando
2. **Arrange-Act-Assert**: Sigue este patrón para claridad
3. **Un concepto por test**: Cada test debe verificar una sola cosa
4. **Datos de prueba**: Usa datos realistas pero mínimos
5. **Cleanup**: Siempre limpia datos después de los tests

## Troubleshooting

### Error: Cannot find module
- Verifica que las rutas de import usen `.js` al final
- Asegúrate de que `"type": "module"` esté en package.json

### Error: Jest timeout
- Aumenta el timeout en jest.config.js
- Verifica que la base de datos esté corriendo

### Tests fallan por conexión a MongoDB
- Asegúrate de que MongoDB esté corriendo localmente
- Verifica que `MONGODB_TEST_URI` esté configurada correctamente
