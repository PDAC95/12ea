# Sprint 2 Plan - Entre Amigas

**Sprint Duration:** 2 semanas (Semanas 3-4)
**Sprint Goal:** Usuarias pueden navegar y usar features principales
**Team Capacity:** ~20-25 horas/semana (1 desarrollador)
**Total Points:** 15 puntos
**Start Date:** Noviembre 2025
**End Date:** Noviembre 2025
**Status:** ✅ COMPLETADO (15/15 SP - 100%)

---

## Sprint Goal

**"Usuarias autenticadas pueden acceder al dashboard principal y explorar directorios de negocios y servicios de la comunidad"**

### Success Criteria

- ✅ Dashboard principal funcional con navegación completa
- ✅ Usuarias pueden buscar y filtrar negocios latinos
- ✅ Usuarias pueden buscar y filtrar servicios esenciales
- ✅ UI responsive (móvil y desktop)
- ✅ Data de ejemplo poblada en ambos directorios
- ✅ Todas las rutas protegidas funcionando correctamente

---

## Sprint Backlog

### US-003: Dashboard Principal de Usuaria

**Story Points:** 5 (Medium)  
**Priority:** MUST HAVE - CRITICAL  
**Estimated Hours:** 10-12 horas

**Como** usuaria registrada  
**Quiero** ver un dashboard con todas las opciones disponibles  
**Para** navegar fácilmente por la plataforma

#### Acceptance Criteria

- [x] Dashboard muestra mensaje de bienvenida con nombre preferido
- [x] Menú principal visible con 5 secciones: Eventos, Negocios, Servicios, Blog, Perfil
- [x] Vista rápida de próximos 3 eventos destacados (mock data por ahora)
- [x] Navegación clara con iconos y labels
- [x] Header con logo y opción de logout
- [x] Diseño limpio y organizado (tendencia: cards con glassmorphism/neomorphism)
- [x] Responsive para móvil y desktop
- [x] Protected route (requiere autenticación)

#### Technical Tasks

1. **Layout Base del Dashboard** (2h)

   - Crear estructura con sidebar/navbar responsive
   - Header con logo y botón logout
   - Container principal para contenido

2. **Sección de Bienvenida** (1h)

   - Obtener nombre preferido del usuario desde context/token
   - Mensaje personalizado "¡Hola, [nombre]!"
   - Diseño acogedor con gradiente suave

3. **Cards de Navegación** (3h)

   - 5 cards principales: Eventos, Negocios, Servicios, Blog, Perfil
   - Iconos de Lucide React
   - Hover effects y animaciones sutiles
   - Click navega a sección correspondiente

4. **Preview de Eventos** (2h)

   - Sección "Próximos Eventos"
   - Mock de 3 eventos con: imagen, título, fecha, modalidad
   - Diseño tipo timeline o cards horizontales
   - Link "Ver todos los eventos"

5. **Protected Route Setup** (1h)

   - Crear HOC o componente ProtectedRoute
   - Verificar JWT en localStorage
   - Redirect a /login si no autenticado

6. **Responsive & Polish** (2h)
   - Mobile-first design
   - Breakpoints: móvil (< 768px), tablet (768-1024px), desktop (> 1024px)
   - Testing en diferentes dispositivos
   - Ajustes finales de espaciado y colores

#### Dependencies

- ✅ US-001 completada (sistema de auth funcionando)
- Lucide React icons (ya instalado)
- React Router (ya configurado)

#### Technical Notes

- **Tendencia UI 2025:** Cards con sombras suaves, gradientes sutiles, mucho white space, iconos coloridos pero no saturados
- Usar TailwindCSS para todo el styling
- Context API para manejar estado de usuario
- Layout debe ser base para resto de vistas

---

### US-005: Directorio de Negocios

**Story Points:** 5 (Medium)  
**Priority:** MUST HAVE  
**Estimated Hours:** 10-12 horas

**Como** usuaria  
**Quiero** encontrar negocios y emprendimientos de otras latinas  
**Para** apoyar a la comunidad

#### Acceptance Criteria

- [x] Vista de grid de negocios (3 columnas desktop, 1 columna móvil)
- [x] Cada negocio muestra: logo/imagen, nombre, categoría, descripción breve, ciudad
- [x] Barra de búsqueda por palabra clave (nombre o descripción)
- [x] Filtros por categoría (dropdown)
- [x] Filtro por ciudad (dropdown)
- [x] Click en negocio abre vista detallada en modal o página
- [x] Información de contacto visible: teléfono (click-to-call), email (click-to-email)
- [x] Diseño tipo grid de Pinterest/Airbnb (tendencia actual)
- [x] Paginación si hay muchos resultados (20 por página)
- [x] Mensaje amigable si no hay resultados
- [x] Loading state mientras carga data

#### Technical Tasks

1. **Backend - Modelo Business** (1h)

   ```javascript
   // Schema: name, category, description, phone, email, city,
   // website, logo (URL genérico), isActive, createdAt
   ```

2. **Backend - Endpoints API** (2h)

   - GET /api/business - Lista con query params (search, category, city, page)
   - GET /api/business/:id - Detalle de negocio
   - Paginación con skip/limit
   - Text search en MongoDB para búsqueda

3. **Backend - Seed Data** (1h)

   - Script para poblar 20-30 negocios de ejemplo
   - Categorías: Restaurante, Belleza, Consultoría, Servicios del Hogar, Ropa, etc.
   - Ciudades: Toronto, Vancouver, Montreal, Calgary
   - Logos genéricos por categoría

4. **Frontend - BusinessList Component** (2h)

   - Grid responsive con TailwindCSS
   - BusinessCard component reutilizable
   - Fetch de datos con useState/useEffect
   - Loading skeleton mientras carga

5. **Frontend - Búsqueda y Filtros** (2h)

   - Search bar con debounce (300ms)
   - Dropdown de categorías (multi-select opcional)
   - Dropdown de ciudades
   - Lógica para combinar filtros
   - Botón "Limpiar filtros"

6. **Frontend - Vista Detallada** (2h)

   - Modal o página separada con info completa
   - Botones de contacto: tel: y mailto: links
   - Diseño limpio y scannable
   - Botón "Volver a resultados"

7. **Frontend - Paginación y Empty States** (1h)

   - Componente Pagination reutilizable
   - Mensaje "No se encontraron negocios" con ilustración
   - Sugerencia de limpiar filtros

8. **Testing & Polish** (1h)
   - Probar búsqueda y filtros
   - Verificar responsive
   - Optimizar performance (memoization si necesario)

#### Dependencies

- ✅ US-003 completada (dashboard y navegación)
- MongoDB text search indexing
- Logo placeholder images (usar placeholders tipo UI Avatars o similar)

#### Technical Notes

- **Tendencia UI:** Grid tipo Airbnb/Pinterest con cards que tienen hover effect (scale up slightly)
- Usar `react-intersection-observer` para lazy loading si la lista es muy larga
- Iconos de categoría con Lucide React
- Click-to-call: `<a href="tel:+1234567890">`
- Click-to-email: `<a href="mailto:email@example.com">`

---

### US-006: Directorio de Servicios Esenciales

**Story Points:** 5 (Medium)  
**Priority:** MUST HAVE  
**Estimated Hours:** 8-10 horas (reutilizamos mucho de US-005)

**Como** usuaria  
**Quiero** encontrar servicios importantes (médicos, dentistas, abogados, etc.)  
**Para** acceder a recursos locales confiables

#### Acceptance Criteria

- [x] Vista similar a Directorio de Negocios (reutilizar componentes)
- [x] Cada servicio muestra: logo, nombre, tipo de servicio, descripción, contacto, ciudad
- [x] Filtros por tipo de servicio (Salud, Legal, Educación, Financiero, Inmigración)
- [x] Filtro por ciudad
- [x] Barra de búsqueda por palabra clave
- [x] Click en servicio abre vista detallada
- [x] Información de contacto destacada
- [x] Diseño consistente con US-005
- [x] Paginación (20 por página)
- [x] Mensaje amigable si no hay resultados

#### Technical Tasks

1. **Backend - Modelo Service** (45min)

   ```javascript
   // Schema similar a Business pero con serviceType en vez de category
   // Tipos: Salud, Legal, Educación, Financiero, Inmigración, Traducción
   ```

2. **Backend - Endpoints API** (1h)

   - GET /api/services - Con query params idénticos a business
   - GET /api/services/:id - Detalle
   - Reutilizar lógica de paginación y búsqueda

3. **Backend - Seed Data** (1h)

   - Poblar 15-20 servicios de ejemplo
   - Mix de doctores, dentistas, abogados, contadores, traductores
   - Mismo formato que Business

4. **Frontend - ServiceList Component** (2h)

   - Copiar estructura de BusinessList
   - Adaptar filtros a serviceType
   - Reutilizar BusinessCard (renombrar a DirectoryCard genérico)
   - Mismo grid y layout

5. **Frontend - Filtros Específicos** (1h)

   - Dropdown de tipos de servicio
   - Mantener búsqueda y filtro de ciudad
   - Misma UI que US-005

6. **Frontend - Vista Detallada** (1h)

   - Reutilizar modal de Business
   - Ajustar labels si es necesario
   - Destacar credenciales/certificaciones si aplica

7. **Testing & Polish** (1h)
   - Verificar que todo funciona igual que Negocios
   - Responsive check
   - Consistency de diseño

#### Dependencies

- ✅ US-003 completada (dashboard)
- ✅ US-005 completada (podemos reutilizar casi todo)
- Componentes reutilizables de US-005

#### Technical Notes

- **Objetivo:** Reutilizar el 70-80% del código de US-005
- Crear componente `<DirectoryCard />` genérico que sirva para ambos
- Crear custom hook `useDirectory(type)` para manejar lógica compartida
- Tipos de servicio con iconos específicos (Lucide: Heart para Salud, Scale para Legal, etc.)

---

## Sprint Schedule (Sugerido)

### Week 1 (Días 1-7)

**Focus:** Dashboard + Inicio de Directorios

- **Día 1-2:** US-003 - Layout y estructura del Dashboard
- **Día 3:** US-003 - Preview de eventos y polish
- **Día 4-5:** US-005 - Backend (modelo, endpoints, seed data)
- **Día 6-7:** US-005 - Frontend BusinessList y filtros

### Week 2 (Días 8-14)

**Focus:** Completar Directorios + Testing

- **Día 8-9:** US-005 - Vista detallada, paginación, testing
- **Día 10-11:** US-006 - Backend + Frontend (reutilizando componentes)
- **Día 12-13:** US-006 - Testing, refinamiento, responsive check
- **Día 14:** Sprint Review prep, documentación, polish general

---

## Definition of Done

Una User Story se considera "Done" cuando:

- [x] Todo el código cumple acceptance criteria
- [x] Código funcional sin errores en consola
- [x] Testing manual completo (happy path + edge cases)
- [x] Responsive verificado (móvil y desktop)
- [x] Protected routes funcionando correctamente
- [x] Loading states y error states implementados
- [x] Mensajes de error claros en español
- [x] Sin bugs críticos
- [x] Código commiteado con mensajes descriptivos
- [x] Listo para demo

---

## Technical Decisions Log

### UI Framework & Patterns

- **Grid Layout:** CSS Grid con TailwindCSS
- **Tendencia 2025:** Cards con sombras suaves, hover effects sutiles, mucho white space
- **Colors:** Paleta cálida y acogedora (corales, amarillos suaves, verdes menta)
- **Icons:** Lucide React (consistencia en toda la app)

### Component Architecture

- Crear componentes reutilizables desde el inicio:
  - `<DirectoryCard />` - Para Negocios y Servicios
  - `<SearchBar />` - Barra de búsqueda reutilizable
  - `<FilterDropdown />` - Dropdown de filtros genérico
  - `<Pagination />` - Componente de paginación
  - `<EmptyState />` - Para resultados vacíos

### State Management

- Context API para usuario autenticado
- useState/useEffect para data de directorios
- Custom hooks para lógica compartida:
  - `useDirectory(type)` - Fetch, búsqueda, filtros
  - `useDebounce(value, delay)` - Para search bar

### API Design

```javascript
// Endpoints con query params
GET /api/business?search=cafe&category=Restaurante&city=Toronto&page=1&limit=20
GET /api/services?search=doctor&serviceType=Salud&city=Vancouver&page=1&limit=20

// Response format
{
  success: true,
  data: {
    items: [...],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 45,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

---

## Risks & Mitigation

### Risk 1: Complejidad de filtros combinados

**Impact:** Medium  
**Probability:** Low  
**Mitigation:** Empezar con filtros simples (uno a la vez), luego combinar. Usar query params bien estructurados.

### Risk 2: Performance con muchos items

**Impact:** Medium  
**Probability:** Medium  
**Mitigation:** Implementar paginación desde el inicio. Considerar lazy loading o virtualización si crece mucho.

### Risk 3: Reutilización de componentes no funciona bien

**Impact:** High  
**Probability:** Low  
**Mitigation:** Diseñar componentes genéricos desde US-005. Hacer props flexibles.

---

## Blocked Items

Ninguno. Sprint 1 debe estar 100% completado antes de iniciar Sprint 2.

**Pre-requisitos:**

- ✅ US-001: Autenticación funcionando
- ✅ US-002: Landing page deployada
- ✅ Backend configurado y funcionando
- ✅ MongoDB conectado

---

## Sprint Review Preparation

### Demo Script (15-20 min)

1. **Login** (2 min)

   - Mostrar login funcionando
   - Redirect automático a dashboard

2. **Dashboard Tour** (3 min)

   - Mensaje de bienvenida personalizado
   - Navegación por las 5 secciones
   - Preview de eventos
   - Logout functionality

3. **Directorio de Negocios** (5 min)

   - Mostrar grid con negocios
   - Demostrar búsqueda en tiempo real
   - Usar filtros (categoría + ciudad)
   - Abrir vista detallada
   - Click-to-call y click-to-email
   - Mostrar paginación

4. **Directorio de Servicios** (5 min)

   - Similar a negocios
   - Enfatizar diferentes categorías
   - Mostrar consistencia de diseño

5. **Responsive Demo** (3 min)
   - Resize browser para mostrar móvil
   - Navegar en móvil
   - Todos los features funcionando

### Metrics to Share

- Total puntos completados: X/15
- Velocity actual vs estimada
- Bugs encontrados y resueltos
- User stories done vs planned

---

## Sprint Retrospective Topics

### What to Discuss:

1. ¿Qué funcionó bien en este sprint?
2. ¿Qué podemos mejorar para Sprint 3?
3. ¿Las estimaciones fueron precisas?
4. ¿Hubo bloqueadores o impedimentos?
5. ¿Necesitamos ajustar velocity para próximos sprints?

### Action Items Template:

- [ ] Acción 1: [descripción] - Responsable: [nombre]
- [ ] Acción 2: [descripción] - Responsable: [nombre]

---

## Next Sprint Preview

**Sprint 3 Goal:** Sistema de eventos funcionando end-to-end

**Planeado para Sprint 3:**

- US-004: Ver y Registrarse en Eventos (L = 8 pts)
- US-007: Blog con Artículos (S = 3 pts)
- US-009: Panel Admin - Directorios (M = 5 pts)

**Total:** 16 puntos

---

## Quick Reference Commands

### Backend

```bash
cd backend
npm run dev                    # Start server
node src/scripts/seedBusiness.js   # Seed business data
node src/scripts/seedServices.js   # Seed services data
```

### Frontend

```bash
cd frontend
npm run dev                    # Start dev server (localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build
```

### Git Workflow

```bash
git checkout -b feature/US-003-dashboard
# ... hacer cambios ...
git add .
git commit -m "feat: implement main dashboard layout"
git push origin feature/US-003-dashboard
```

---

## Resources & References

### Design Inspiration

- **Airbnb** - Grid de cards, filtros laterales
- **Pinterest** - Masonry layout (opcional)
- **Notion** - Navegación limpia, sidebar colapsable
- **Linear** - Comandos rápidos, shortcuts

### UI Components Reference

- **shadcn/ui** - Para componentes complejos si necesitamos
- **TailwindUI** - Patterns y ejemplos
- **Lucide Icons** - https://lucide.dev

### Technical Docs

- React Router: https://reactrouter.com
- TailwindCSS: https://tailwindcss.com
- MongoDB Text Search: https://docs.mongodb.com/manual/text-search/

---

## Notes & Observations

_Espacio para notas durante el sprint..._

---

**Sprint Created:** Noviembre 2025
**Last Updated:** 13 de Noviembre, 2025
**Sprint Status:** ✅ COMPLETADO (15/15 SP - 100%)

---

## Sprint Closure Summary

**Fecha de Cierre:** 13 de Noviembre, 2025
**Duración Real:** 2 semanas según lo planeado
**Story Points Completados:** 15/15 (100%)

### User Stories Completadas

1. **US-003: Dashboard Principal** - 5 SP ✅
   - Dashboard completo con navegación
   - Componentes reutilizables implementados
   - Protected routes funcionando
   - Responsive en móvil y desktop

2. **US-005: Directorio de Negocios** - 5 SP ✅
   - CRUD completo en backend
   - Búsqueda, filtros y paginación
   - 10 negocios seed data
   - Vista detallada con modal
   - DirectoryCard genérico creado

3. **US-006: Directorio de Servicios** - 5 SP ✅
   - CRUD completo en backend
   - Reutilización de componentes de US-005
   - 10 servicios seed data
   - Filtros por tipo de servicio
   - Consistencia visual con Negocios

### Logros Destacados

- **Componentes Compartidos:** DirectoryCard, SearchBar, FilterDropdown, Pagination, DirectoryDetailModal
- **APIs REST:** 10 endpoints implementados para Businesses y Services
- **Testing:** Cobertura manual completa
- **Velocity:** 15 SP/2 semanas = 7.5 SP/semana
- **Calidad:** Cero bugs críticos, código limpio y documentado

### Retrospective - Key Learnings

**Qué funcionó bien:**
- Reutilización de componentes entre US-005 y US-006 aceleró el desarrollo
- Arquitectura feature-based facilitó la organización
- Seed scripts permitieron testing rápido

**Áreas de mejora:**
- Considerar agregar tests automatizados en Sprint 3
- Optimizar queries MongoDB con índices adicionales

**Próximo Sprint:**
- Sprint 3: Eventos y Panel Admin (US-004, US-008)

---

**END OF SPRINT 2 PLAN**
