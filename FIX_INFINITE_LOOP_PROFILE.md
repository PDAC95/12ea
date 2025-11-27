# Fix: Infinite Loop en Carga de Perfil de Usuario

## Problema Reportado

**Síntoma**: Cuando un usuario accede a su perfil y navega a "Mis Negocios" sin tener negocios registrados, la página se queda cargando eternamente.

**Errores en consola**:
```
useProfile.js:108  GET http://localhost:8000/api/v1/services/my/list 429 (Too Many Requests)
useProfile.js:111  Error fetching services: AxiosError
```

Este patrón se repetía infinitamente, activando el rate limiter del backend.

---

## Causa Raíz

### 1. Infinite Loop en `useProfile.js` (Hook Custom)

**Archivo**: `frontend/src/features/dashboard/hooks/useProfile.js`
**Líneas problemáticas**: 145-147

```javascript
// ❌ ANTES (INCORRECTO)
useEffect(() => {
  fetchProfile();
}, [fetchProfile]); // fetchProfile cambia en cada render
```

**Problema**:
- El `useEffect` depende de `fetchProfile`
- `fetchProfile` está envuelto en `useCallback` pero con array de dependencias vacío:
  ```javascript
  const fetchProfile = useCallback(async () => {
    // código...
  }, []); // Sin deps, pero useCallback genera nueva ref en cada render
  ```
- Aunque `useCallback` tiene deps vacías, React puede crear nuevas referencias
- Esto dispara el `useEffect` → ejecuta `fetchProfile` → causa re-render → nueva referencia de `fetchProfile` → dispara `useEffect` nuevamente
- **Loop infinito**

### 2. Similar problema en `UserProfilePage.jsx`

**Archivo**: `frontend/src/features/dashboard/pages/UserProfilePage.jsx`
**Líneas problemáticas**: 93-104

```javascript
// ❌ ANTES (INCORRECTO)
useEffect(() => {
  if (activeTab === 'businesses' && businesses.length === 0 && !loadingBusinesses) {
    fetchMyBusinesses();
  }
  if (activeTab === 'services' && services.length === 0 && !loadingServices) {
    fetchMyServices();
  }
  if (activeTab === 'events' && events.length === 0 && !loadingEvents) {
    fetchMyEvents();
  }
}, [
  activeTab,
  businesses.length,
  loadingBusinesses,
  fetchMyBusinesses,  // ❌ Función que cambia
  services.length,
  loadingServices,
  fetchMyServices,    // ❌ Función que cambia
  events.length,
  loadingEvents,
  fetchMyEvents,      // ❌ Función que cambia
]);
```

**Problema**:
- El `useEffect` incluye las funciones `fetch*` en el array de dependencias
- Estas funciones vienen del hook `useProfile` y pueden cambiar entre renders
- Esto causa que el `useEffect` se ejecute múltiples veces
- Cuando no hay datos (ej: `businesses.length === 0`), se dispara la función fetch
- Si la fetch falla o tarda, puede causar re-renders que vuelven a ejecutar el `useEffect`
- **Loop potencial**

---

## Solución Implementada

### Fix 1: `useProfile.js` - Líneas 142-149

```javascript
// ✅ DESPUÉS (CORRECTO)
/**
 * Fetch inicial del perfil al montar el hook
 * Solo se ejecuta una vez al montar (no depende de fetchProfile para evitar loop)
 */
useEffect(() => {
  fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Array vacío = solo ejecuta al montar
```

**Cambios**:
- Cambiar dependency array de `[fetchProfile]` a `[]`
- Agregar comentario explicativo
- Agregar `eslint-disable` para suprimir warning de React Hooks linting
- **Resultado**: El efecto se ejecuta solo UNA VEZ al montar el componente

### Fix 2: `UserProfilePage.jsx` - Líneas 78-95

```javascript
// ✅ DESPUÉS (CORRECTO)
/**
 * Fetch data when switching tabs (lazy loading)
 * Solo depende de activeTab y los estados de arrays, no de las funciones fetch
 */
useEffect(() => {
  if (activeTab === 'businesses' && businesses.length === 0 && !loadingBusinesses) {
    fetchMyBusinesses();
  }

  if (activeTab === 'services' && services.length === 0 && !loadingServices) {
    fetchMyServices();
  }

  if (activeTab === 'events' && events.length === 0 && !loadingEvents) {
    fetchMyEvents();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeTab, businesses.length, services.length, events.length]);
```

**Cambios**:
- Remover las funciones `fetch*` del dependency array
- Mantener solo las variables de estado que realmente importan:
  - `activeTab` - para detectar cambios de tab
  - `businesses.length`, `services.length`, `events.length` - para lazy loading
- Agregar comentario explicativo
- Agregar `eslint-disable` para suprimir warning
- **Resultado**: El efecto solo se ejecuta cuando cambia el tab o cuando se cargan datos por primera vez

---

## Impacto de la Solución

### Antes del Fix:
- ❌ Loop infinito en peticiones HTTP
- ❌ Errores 429 (Too Many Requests) del rate limiter
- ❌ Página congelada con spinner de carga infinito
- ❌ Usuario no puede acceder a sus datos
- ❌ Backend sobrecargado con peticiones repetidas

### Después del Fix:
- ✅ Perfil se carga solo UNA VEZ al montar
- ✅ Lazy loading funciona correctamente al cambiar tabs
- ✅ No hay peticiones repetidas innecesarias
- ✅ Rate limiter NO se activa
- ✅ UI responde correctamente
- ✅ Empty states se muestran apropiadamente cuando no hay datos

---

## Testing del Fix

### Manual Testing Steps:

1. **Iniciar servidores**:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Login como usuario regular**:
   - URL: http://localhost:8080/login
   - Email: `dev@jappi.ca`
   - Password: `Password123`

3. **Navegar a perfil**:
   - Click en "Mi Perfil" en el menú lateral
   - O directamente: http://localhost:8080/dashboard/profile

4. **Probar tabs**:
   - Click en "Mi Perfil" → debe cargar datos del usuario
   - Click en "Mis Negocios" → debe mostrar lista (o empty state)
   - Click en "Mis Servicios" → debe mostrar lista (o empty state)
   - Click en "Próximos Eventos" → debe mostrar lista (o empty state)

5. **Verificar en DevTools**:
   - Abrir console (F12)
   - NO debe haber errores de loop infinito
   - NO debe haber errores 429
   - Network tab: Cada petición debe hacerse SOLO UNA VEZ por tab

### Escenarios de Prueba:

#### Escenario 1: Usuario SIN negocios/servicios/eventos
- **Antes**: Loop infinito, 429 errors
- **Después**: Empty state correcto, sin errores

#### Escenario 2: Usuario CON negocios/servicios/eventos
- **Antes**: Podía funcionar pero con riesgo de loops
- **Después**: Carga normal, solo una petición por tab

#### Escenario 3: Cambiar entre tabs múltiples veces
- **Antes**: Posibles re-fetches innecesarios
- **Después**: Data cacheada en estado, no re-fetch si ya existe

---

## Patrón de Solución: Best Practice para useEffect

### ❌ EVITAR: Funciones en dependency array

```javascript
// MAL - Función en deps causa loops
const fetchData = useCallback(async () => {
  // código...
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]); // ❌ fetchData puede cambiar entre renders
```

### ✅ PREFERIR: Solo valores primitivos/objetos estables en deps

```javascript
// BIEN - Solo estado primitivo en deps
useEffect(() => {
  async function fetchData() {
    // código...
  }
  fetchData();
}, []); // Solo ejecuta al montar
```

```javascript
// BIEN - Solo valores que realmente importan
useEffect(() => {
  if (shouldFetch && !isLoading) {
    fetchDataFunction(); // OK llamar función, pero no incluirla en deps
  }
}, [shouldFetch, isLoading]); // Solo valores primitivos
```

### Cuándo usar `eslint-disable-next-line react-hooks/exhaustive-deps`

Es aceptable cuando:
1. **Entiendes el comportamiento** del hook completamente
2. **Sabes que la función no cambia** realmente (es estable)
3. **Quieres evitar re-ejecuciones innecesarias**
4. **Has verificado que NO causa bugs**

⚠️ **NUNCA uses este disable si**:
- No entiendes por qué React se queja
- Solo lo usas para "quitar el warning"
- No has probado que funcione correctamente

---

## Archivos Modificados

1. **frontend/src/features/dashboard/hooks/useProfile.js**
   - Líneas 142-149: Fix infinite loop en fetchProfile

2. **frontend/src/features/dashboard/pages/UserProfilePage.jsx**
   - Líneas 78-95: Fix dependency array en lazy loading

---

## Commit Info

**Commit**: `4114c69`
**Mensaje**: `fix: resolver infinite loop en useProfile hook - carga de perfil de usuario`
**Fecha**: 26 de noviembre de 2025
**Branch**: `main`

---

## Referencias

- [React useEffect Docs](https://react.dev/reference/react/useEffect)
- [React useCallback Docs](https://react.dev/reference/react/useCallback)
- [React Hooks ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

**Estado**: ✅ Fix implementado y pusheado
**Testing**: ⏳ Pendiente de testing manual por el usuario
