# Testing Admin Eventos - Guía Completa

**Task 8.10 - Sprint 4**
**Fecha**: 2025-11-14
**Tester**: Frontend Developer
**Duración estimada**: 1 hora

---

## SETUP INICIAL

### URLs de Acceso
- **Frontend**: http://localhost:8081
- **Admin Login**: http://localhost:8081/admin/login
- **Admin Events**: http://localhost:8081/admin/events
- **Backend API**: http://localhost:8000/api/v1

### Credenciales de Admin
```
Email: dev@jappi.ca
Password: Password123
```

### Servidores
- ✅ Backend running on port 8000
- ✅ Frontend running on port 8081
- ✅ MongoDB conectado

---

## CHECKLIST DE TESTING

### PARTE 1: Acceso y Navegación

#### ✅ Test 1.1: Login Admin
**Pasos:**
1. Ir a http://localhost:8081/admin/login
2. Ingresar email: dev@jappi.ca
3. Ingresar password: Password123
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- Login exitoso
- Redirección a /admin (dashboard)
- No hay errores en consola

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 1.2: Navegación a Eventos
**Pasos:**
1. Estar logueado como admin
2. Verificar sidebar izquierdo
3. Click en "Eventos" (ícono Calendar)

**Resultado Esperado:**
- Link "Eventos" visible en sidebar
- Ícono Calendar a la izquierda
- Click navega a /admin/events
- Active state en "Eventos" (fondo azul, descripción visible)

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 2: Vista de Lista de Eventos

#### ✅ Test 2.1: Ver Lista de Eventos
**Pasos:**
1. Estar en /admin/events
2. Verificar que se muestra la tabla de eventos

**Resultado Esperado:**
- Tabla con columnas: Event, Date & Hora, Modalidad, Capacidad, Estado, Acciones
- Botón "Crear Nuevo Evento" visible en header
- Filtros visibles: Status dropdown y barra de búsqueda
- Paginación visible si hay más de 20 eventos

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 2.2: Filtro por Estado
**Pasos:**
1. Click en dropdown "Estado"
2. Seleccionar "Próximos"
3. Verificar que lista se filtra
4. Seleccionar "Pasados"
5. Seleccionar "Cancelados"
6. Volver a "Todos"

**Resultado Esperado:**
- Cada filtro actualiza la lista correctamente
- Loading state visible durante fetch
- Paginación se resetea a página 1

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 2.3: Búsqueda por Título
**Pasos:**
1. Escribir texto en barra de búsqueda
2. Esperar que se ejecute la búsqueda
3. Verificar resultados

**Resultado Esperado:**
- Búsqueda filtra eventos por título
- Resultados se actualizan automáticamente
- Si no hay resultados, muestra empty state

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 3: Crear Evento

#### ✅ Test 3.1: Modal Crear Evento
**Pasos:**
1. Click en "Crear Nuevo Evento"
2. Verificar que modal se abre

**Resultado Esperado:**
- Modal se abre con título "Crear Nuevo Evento"
- EventForm visible con todos los campos
- Botones "Crear Evento" y "Cancelar"

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 3.2: Validaciones del Formulario
**Pasos:**
1. Intentar submit sin llenar campos
2. Llenar título con solo 3 caracteres
3. Seleccionar fecha pasada (en modo create)
4. Poner capacidad = 0

**Resultado Esperado:**
- Mensajes de error claros para cada campo
- No permite submit hasta que todo sea válido
- Mensajes de error en español

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 3.3: Campos Condicionales
**Pasos:**
1. Seleccionar modalidad "Virtual"
2. Verificar que solo aparece campo "Link"
3. Seleccionar modalidad "Presencial"
4. Verificar que solo aparece campo "Ubicación"
5. Seleccionar modalidad "Híbrido"
6. Verificar que aparecen ambos campos

**Resultado Esperado:**
- Campos se muestran/ocultan correctamente según modalidad
- Validaciones se aplican solo a campos visibles

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 3.4: Upload de Imagen
**Pasos:**
1. Drag & drop una imagen PNG de 2MB
2. Verificar preview
3. Remover imagen con botón X
4. Click to upload una imagen JPG de 6MB (excede límite)
5. Upload una imagen válida de 3MB

**Resultado Esperado:**
- Drag & drop funciona
- Preview se muestra correctamente
- Botón X remueve imagen
- Error si excede 5MB o tipo inválido
- Loading spinner visible durante upload
- URL de S3 se guarda en campo image

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 3.5: Crear Evento Completo
**Pasos:**
1. Llenar formulario:
   - Título: "Workshop de React para Emprendedoras"
   - Descripción: "Aprende React desde cero con ejemplos prácticos y proyectos reales aplicados a negocios"
   - Fecha: 2025-12-20
   - Hora: 18:00
   - Modalidad: Virtual
   - Link: https://zoom.us/j/123456789
   - Capacidad: 30
   - Categoría: Tecnología
2. Upload imagen
3. Click "Crear Evento"

**Resultado Esperado:**
- Loading state durante submit
- Alert de éxito: "Evento creado exitosamente"
- Modal se cierra
- Nuevo evento aparece en lista
- Lista se refresca automáticamente

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 4: Editar Evento

#### ✅ Test 4.1: Abrir Modal de Edición
**Pasos:**
1. En lista de eventos, click en botón "Editar" (ícono Edit)
2. Verificar que modal se abre

**Resultado Esperado:**
- Modal se abre con título "Editar Evento"
- Campos pre-poblados con datos del evento
- Imagen existente se muestra en preview
- Botones "Guardar Cambios" y "Cancelar"

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 4.2: Modificar Evento
**Pasos:**
1. Modificar título: agregar " - ACTUALIZADO"
2. Cambiar capacidad: de 30 a 50
3. Click "Guardar Cambios"

**Resultado Esperado:**
- Loading state durante submit
- Alert de éxito
- Modal se cierra
- Cambios se reflejan en lista

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 5: Ver Registros

#### ✅ Test 5.1: Abrir Modal de Registros (Sin Registros)
**Pasos:**
1. Seleccionar evento sin registros
2. Click en botón "Ver Registros" (ícono Eye)

**Resultado Esperado:**
- Modal se abre
- Header muestra: "Registradas al Evento" + título del evento
- Empty state: "Aún no hay personas registradas" con ícono Users
- Botón "Cerrar"

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 5.2: Ver Registros (Con Registrados)
**Pasos:**
1. Seleccionar evento con registros
2. Click en "Ver Registros"
3. Verificar tabla

**Resultado Esperado:**
- Modal muestra contador: "X personas registradas"
- Tabla con columnas: #, Nombre, Email, Fecha de Registro
- Fechas formateadas en español
- Botón "Exportar CSV" visible

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 5.3: Exportar CSV
**Pasos:**
1. En modal de registros, click "Exportar CSV"
2. Verificar descarga de archivo
3. Abrir archivo en Excel o editor de texto

**Resultado Esperado:**
- Archivo se descarga automáticamente
- Nombre: `evento-{id}-registradas.csv`
- Contiene BOM para Excel
- Headers: Nombre, Email, Fecha de Registro
- Datos correctos en cada fila

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 6: Cancelar Evento

#### ✅ Test 6.1: Abrir Modal de Cancelación
**Pasos:**
1. Click en botón "Cancelar Evento" (ícono Trash2)
2. Verificar modal de confirmación

**Resultado Esperado:**
- Modal de confirmación se abre
- Muestra título del evento
- Muestra fecha y hora
- Muestra número de registrados
- Advertencia en rojo: "Esta acción no se puede deshacer"
- Botones "Confirmar" y "Cancelar"

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

#### ✅ Test 6.2: Cancelar Evento
**Pasos:**
1. En modal de confirmación, click "Confirmar"

**Resultado Esperado:**
- Loading state en botón
- Evento se marca como "Cancelado"
- Badge de estado cambia a rojo
- Modal se cierra
- Lista se refresca

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 7: Paginación

#### ✅ Test 7.1: Paginación (si hay más de 20 eventos)
**Pasos:**
1. Si hay más de 20 eventos, verificar controles de paginación
2. Click "Siguiente"
3. Click "Anterior"

**Resultado Esperado:**
- Botones Previous/Next visibles
- Indica página actual
- Click navega entre páginas
- Loading state durante cambio de página

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 8: Responsive Design

#### ✅ Test 8.1: Responsive en Mobile
**Pasos:**
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Seleccionar "iPhone 12 Pro"
4. Verificar AdminEventList

**Resultado Esperado:**
- Sidebar se oculta, aparece menú hamburguesa
- Tabla se adapta o cambia a cards
- Formularios son usables
- Botones son clickeables
- No hay scroll horizontal

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

### PARTE 9: Console y Errores

#### ✅ Test 9.1: Verificar Consola
**Pasos:**
1. Abrir DevTools (F12)
2. Tab "Console"
3. Realizar todos los flujos anteriores
4. Verificar que no hay errores críticos

**Resultado Esperado:**
- No hay errores en rojo
- Warnings permitidos (deprecations, etc)
- No hay errores 500 del backend
- No hay errores de CORS

**Status**: [ ] Pasó [ ] Falló
**Notas**: _______________

---

## RESUMEN DE TESTING

### Estadísticas
- **Total de tests**: 19
- **Tests pasados**: ___
- **Tests fallidos**: ___
- **Tests pendientes**: ___

### Issues Encontrados

#### Issue 1
**Descripción**: _______________
**Severidad**: [ ] Crítico [ ] Alto [ ] Medio [ ] Bajo
**Pasos para reproducir**: _______________
**Resultado esperado**: _______________
**Resultado actual**: _______________

#### Issue 2
**Descripción**: _______________
**Severidad**: [ ] Crítico [ ] Alto [ ] Medio [ ] Bajo
**Pasos para reproducir**: _______________
**Resultado esperado**: _______________
**Resultado actual**: _______________

#### Issue 3
**Descripción**: _______________
**Severidad**: [ ] Crítico [ ] Alto [ ] Medio [ ] Bajo
**Pasos para reproducir**: _______________
**Resultado esperado**: _______________
**Resultado actual**: _______________

---

## CHECKLIST FINAL

- [ ] CRUD completo funciona (Create, Read, Update, Delete)
- [ ] Upload de imágenes funciona correctamente
- [ ] Exportar CSV funciona y formato es correcto
- [ ] Filtros (status y búsqueda) funcionan
- [ ] Validaciones de formulario funcionan
- [ ] Campos condicionales funcionan según modalidad
- [ ] Paginación funciona (si aplicable)
- [ ] Modales abren y cierran correctamente
- [ ] Loading states visibles en todas las operaciones
- [ ] Empty states se muestran cuando no hay datos
- [ ] No hay errores en consola del navegador
- [ ] No hay errores 500 del backend
- [ ] Responsive funciona en mobile (320px - 1920px)
- [ ] Active state en sidebar funciona
- [ ] Navegación es fluida sin lag

---

## RESULTADO FINAL

**Status**: [ ] ✅ PASÓ [ ] ❌ FALLÓ [ ] ⚠️ PARCIAL

**Comentarios Generales**:
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

**Próximos Pasos**:
- [ ] Corregir issues críticos
- [ ] Corregir issues de alta prioridad
- [ ] Marcar Task 8.10 como completada
- [ ] Continuar con Task 8.8 (Seed) o US-010 (Admin Blog)

---

**Tester**: _______________
**Fecha de Ejecución**: _______________
**Firma**: _______________
