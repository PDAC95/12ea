# Scripts de Utilidades - Entre Amigas Backend

Colección de scripts para facilitar el desarrollo y testing del backend.

---

## Seed Scripts

### Business Seed (`seedBusiness.js`)

Popula la base de datos con 30 negocios de ejemplo para testing y desarrollo.

**Comando:**
```bash
npm run seed:business
```

**Características:**
- ✅ 30 negocios realistas en español
- ✅ 6 categorías diferentes:
  - Gastronomía (8 negocios)
  - Belleza y Bienestar (6 negocios)
  - Moda y Accesorios (4 negocios)
  - Servicios Profesionales (5 negocios)
  - Educación y Talleres (3 negocios)
  - Otros (4 negocios)
- ✅ 4 ciudades: Toronto, Vancouver, Montreal, Calgary
- ✅ Negocios verificados y destacados
- ✅ Estadísticas realistas (vistas, clics)
- ✅ Información de contacto completa
- ✅ Redes sociales configuradas

**Lo que hace:**
1. Conecta a MongoDB Atlas
2. Busca o crea usuario de prueba (dev@jappi.ca)
3. Elimina negocios existentes (opcional - comentar si no deseas eliminar)
4. Inserta 30 negocios de ejemplo
5. Muestra resumen por categoría y ciudad

**Estadísticas generadas:**
```
Total: 30 negocios
Activos: 30
Verificados: 20
Destacados: 6
```

**Distribución por ciudad:**
- Toronto: 8 negocios
- Vancouver: 8 negocios
- Montreal: 7 negocios
- Calgary: 7 negocios

---

### Services Seed (`seedServices.js`)

Popula la base de datos con 20 servicios profesionales de ejemplo para testing y desarrollo.

**Comando:**
```bash
npm run seed:services
```

**Características:**
- ✅ 20 servicios profesionales realistas en español
- ✅ 8 tipos de servicio diferentes:
  - Salud (4 servicios)
  - Legal (3 servicios)
  - Financiero (3 servicios)
  - Traducción (2 servicios)
  - Educación (2 servicios)
  - Inmigración (2 servicios)
  - Tecnología (2 servicios)
  - Consultoría (2 servicios)
- ✅ 4 ciudades: Toronto, Vancouver, Calgary, Montreal
- ✅ Servicios verificados y destacados
- ✅ Credenciales profesionales realistas
- ✅ Estadísticas realistas (vistas, clics)
- ✅ Información de contacto completa
- ✅ Redes sociales configuradas (incluye LinkedIn)

**Lo que hace:**
1. Conecta a MongoDB Atlas
2. Busca o crea usuario de prueba (dev@jappi.ca)
3. Elimina servicios existentes (opcional - comentar si no deseas eliminar)
4. Inserta 20 servicios profesionales de ejemplo
5. Muestra resumen por tipo de servicio y estadísticas

**Estadísticas generadas:**
```
Total: 20 servicios
Activos: 20
Verificados: 14
Destacados: 6
```

**Distribución por ciudad:**
- Toronto: 6 servicios
- Vancouver: 6 servicios
- Calgary: 4 servicios
- Montreal: 4 servicios

---

## Testing Scripts

### Email Test (`test-email.js`)

Prueba el servicio de emails con Resend.

**Comando:**
```bash
npm run test:email
```

---

## Notas

- Todos los scripts usan ES6 modules (import/export)
- Requieren conexión a MongoDB Atlas
- Variables de entorno deben estar configuradas en `.env`
- Los scripts son safe para ejecutar múltiples veces
- Para testing, los negocios usan logos por defecto del sistema

---

## Próximos Scripts

- [x] Seed de Servicios ✅
- [ ] Seed de Usuarios
- [ ] Seed de Eventos
- [ ] Seed de Blog Posts
- [ ] Cleanup Script (eliminar datos de testing)
- [ ] Migration Scripts

---

**Última actualización:** 2025-01-12
**Proyecto:** Entre Amigas - Comunidad de Mujeres Migrantes
