# API Utility - Instancia de Axios Configurada

## Descripción

Instancia de Axios pre-configurada con interceptors para:
- ✅ Agregar JWT token automáticamente a todas las peticiones
- ✅ Manejar errores 401 (sesión expirada) con logout automático
- ✅ Redirigir a login cuando la sesión expira
- ✅ Manejo centralizado de errores comunes (403, 404, 500)

## Uso

### 1. Importar la instancia de API

```javascript
import api from '@/shared/utils/api';
```

### 2. Hacer peticiones GET

```javascript
// Ejemplo: Obtener lista de eventos
const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};
```

### 3. Hacer peticiones POST

```javascript
// Ejemplo: Crear un nuevo evento
const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error del servidor con respuesta
      const errorMessage = error.response.data?.error?.message || 'Error al crear evento';
      throw new Error(errorMessage);
    }
    throw error;
  }
};
```

### 4. Hacer peticiones PUT

```javascript
// Ejemplo: Actualizar perfil de usuario
const updateProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};
```

### 5. Hacer peticiones DELETE

```javascript
// Ejemplo: Eliminar un evento
const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    throw error;
  }
};
```

### 6. Con Query Parameters

```javascript
// Ejemplo: Filtrar eventos por ciudad
const getEventsByCity = async (city) => {
  try {
    const response = await api.get('/events', {
      params: { city }
    });
    return response.data;
  } catch (error) {
    console.error('Error al filtrar eventos:', error);
    throw error;
  }
};
```

### 7. Con FormData (Upload de archivos)

```javascript
// Ejemplo: Subir imagen de perfil
const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};
```

## Interceptors

### Request Interceptor

Agrega automáticamente el JWT token a todas las peticiones:

```javascript
// Antes de cada petición:
Authorization: Bearer <token-from-localStorage>
```

**No necesitas agregar el header manualmente**, el interceptor lo hace por ti.

### Response Interceptor

Maneja automáticamente:

- **401 Unauthorized**:
  - Limpia localStorage (token + user)
  - Redirige a `/login`
  - Evita loops si ya estás en `/login`

- **403 Forbidden**: Log de error en consola
- **404 Not Found**: Log de error con URL
- **500 Server Error**: Log de error genérico

## Manejo de Errores

### Estructura de error del backend

```javascript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Mensaje de error en español',
    details: [ ... ] // Opcional para errores de validación
  }
}
```

### Ejemplo de manejo robusto

```javascript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un status code fuera del rango 2xx
      const errorData = error.response.data;
      const errorMessage = errorData?.error?.message || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo sucedió al configurar la petición
      throw new Error('Error al procesar la solicitud');
    }
  }
};
```

## Variables de Entorno

La instancia usa `VITE_API_URL` del archivo `.env.local`:

```bash
# frontend/.env.local
VITE_API_URL=http://localhost:5000/api/v1
```

Si no está definida, usa `http://localhost:5000/api/v1` por defecto.

## Timeout

La instancia tiene un timeout de **10 segundos**. Si una petición tarda más, se rechaza automáticamente.

## Características

✅ Instancia centralizada de Axios
✅ JWT automático en todas las peticiones
✅ Logout automático en 401
✅ Redirección a login cuando expira sesión
✅ Manejo de errores comunes
✅ Timeout configurado (10s)
✅ Logs informativos en consola
✅ Compatible con FormData (uploads)
✅ Compatible con query parameters

## Testing

Para testing, puedes mockear la instancia:

```javascript
// En tus tests
import api from '@/shared/utils/api';

jest.mock('@/shared/utils/api');

// Mockear respuesta
api.get.mockResolvedValue({ data: { success: true, data: [] } });
```

## Notas Importantes

1. **No uses `fetch` directamente**: Usa siempre esta instancia de `api` para que los interceptors funcionen.

2. **401 es manejado automáticamente**: No necesitas agregar lógica de logout en cada componente.

3. **El token viene de localStorage**: El interceptor lo lee automáticamente, no lo pases manualmente.

4. **Errores siempre se rechazan**: Debes usar try-catch en tus funciones para manejarlos.

5. **Compatible con React Query**: Esta instancia funciona perfectamente con TanStack Query (React Query).
