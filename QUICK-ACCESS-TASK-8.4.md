# Task 8.4: EventForm - ACCESO RÁPIDO

**Status**: ✅ COMPLETADO - READY FOR TESTING

---

## ACCESO DIRECTO

### 1. Verificar Servidores Running

```bash
# Backend debe estar en puerto 8000
# Frontend debe estar en puerto 8081
```

**Backend**: http://localhost:8000
**Frontend**: http://localhost:8081

---

## 2. Login como Admin

**URL**: http://localhost:8081/admin/login

**Credenciales**:
```
Email: dev@jappi.ca
Password: Password123
```

---

## 3. Acceder a la Página de Testing

**URL**: http://localhost:8081/admin/events

---

## TESTING RÁPIDO (5 minutos)

### Test 1: Modo CREATE - Evento Virtual

1. Click en "Modo CREATE"
2. Llenar formulario:
   ```
   Título: Workshop de React
   Descripción: Aprende React desde cero con ejemplos prácticos
   Fecha: 2025-12-20
   Hora: 18:00
   Modalidad: Virtual
   Link: https://zoom.us/j/123456789
   Capacidad: 30
   ```
3. Drag & drop una imagen
4. Click "Crear Evento"

**Resultado**: Alert "Evento creado exitosamente!"

---

### Test 2: Modo EDIT

1. Click en "Modo EDIT"
2. Verificar que todos los campos están llenos
3. Modificar título: "... MODIFICADO"
4. Click "Guardar Cambios"

**Resultado**: Alert "Evento actualizado exitosamente!"

---

### Test 3: Validaciones

1. Modo CREATE
2. Dejar campos vacíos
3. Click "Crear Evento"

**Resultado**: Mensajes de error rojos en cada campo inválido

---

## ARCHIVOS IMPORTANTES

| Archivo | Descripción |
|---------|-------------|
| `frontend/src/features/admin/events/EventForm.jsx` | Componente principal |
| `frontend/src/features/admin/pages/AdminEventsPage.jsx` | Página de testing |
| `frontend/TASK-8.4-TESTING.md` | Guía completa de testing |
| `TASK-8.4-SUMMARY.md` | Resumen ejecutivo de la tarea |

---

## CHECKLIST VISUAL EN LA PÁGINA

La página de testing incluye un checklist visual mostrando:

- ✓ Todos los campos del formulario implementados
- ✓ Validaciones con React Hook Form + Yup funcionando
- ✓ Campos condicionales (location/link) según modalidad
- ✓ Upload de imagen con drag & drop y preview
- ✓ Loading states durante submit y upload
- ✓ Mensajes de éxito y error claros
- ✓ Botones diferentes para create y edit

---

## TROUBLESHOOTING

### Frontend no carga

```bash
cd c:\dev\12ea\frontend
npm run dev
```

### Backend no responde

```bash
cd c:\dev\12ea\backend
npm run dev
```

### No puedes hacer login

- Verificar credenciales: `dev@jappi.ca` / `Password123`
- Verificar que backend está corriendo
- Revisar consola del navegador para errores

---

**END OF QUICK ACCESS GUIDE**

**URL de Testing**: http://localhost:8081/admin/events
**Credenciales**: dev@jappi.ca / Password123
