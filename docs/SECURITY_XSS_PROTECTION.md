# Protección contra XSS (Cross-Site Scripting)

## Resumen

Se implementó sanitización de contenido HTML en toda la aplicación para prevenir ataques XSS utilizando DOMPurify.

## Archivos Modificados

### 1. TipDetailPage.jsx
**Ubicación**: `frontend/src/features/tips/pages/TipDetailPage.jsx`

**Cambios**:
- Agregado import: `import DOMPurify from 'dompurify';`
- Sanitización del contenido del tip antes de renderizar (líneas 172-180)
- Tags permitidos: p, br, strong, em, u, a, ul, ol, li, h1-h6, blockquote
- Atributos permitidos: href, target, rel

**Código**:
```jsx
<div
  className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(tip.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    })
  }}
/>
```

### 2. BlogPostPage.jsx
**Ubicación**: `frontend/src/features/blog/pages/BlogPostPage.jsx`

**Estado**: ✅ Ya estaba implementado correctamente
- DOMPurify ya importado (línea 5)
- Función sanitizeHTML ya implementada (líneas 76-102)
- Tags permitidos: p, br, strong, em, u, s, a, ul, ol, li, h1-h6, blockquote, code, pre, img
- Atributos permitidos: href, target, rel, src, alt, title, class

### 3. BlogPostPreview.jsx
**Ubicación**: `frontend/src/features/admin/blog/BlogPostPreview.jsx`

**Cambios**:
- Agregado import: `import DOMPurify from 'dompurify';`
- Sanitización del contenido del post antes de renderizar (líneas 152-157)
- Tags permitidos: p, br, strong, em, u, s, a, ul, ol, li, h1-h6, blockquote, code, pre, img
- Atributos permitidos: href, target, rel, src, alt, title, class

**Código**:
```jsx
<div
  className="prose prose-lg max-w-none ..."
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class']
    })
  }}
/>
```

### 4. EventDetailPage.jsx
**Estado**: ❌ No existe este archivo
- No se requiere implementación

## Dependencias

**Paquete**: `dompurify`
**Versión**: Instalada en el proyecto
**Instalación**: Ya estaba instalado previamente

```bash
cd frontend
npm install dompurify
```

## Tags HTML Permitidos

### Tips (TipDetailPage)
- Texto: `p`, `br`, `strong`, `em`, `u`
- Enlaces: `a`
- Listas: `ul`, `ol`, `li`
- Encabezados: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Citas: `blockquote`

### Blog (BlogPostPage, BlogPostPreview)
- Todo lo anterior +
- Código: `code`, `pre`
- Imágenes: `img`
- Tachado: `s`

## Atributos Permitidos

### Tips
- `href`, `target`, `rel` (para enlaces)

### Blog
- Todo lo anterior +
- `src`, `alt`, `title`, `class` (para imágenes y estilos)

## Validación de Seguridad

### Scripts Bloqueados
❌ `<script>alert('XSS')</script>` → Se elimina completamente

### Eventos Bloqueados
❌ `<img src="x" onerror="alert('XSS')">` → Atributo `onerror` eliminado

### Iframes Bloqueados
❌ `<iframe src="malicious.com"></iframe>` → Tag `iframe` no permitido

### Tags Peligrosos Bloqueados
- `<script>`
- `<iframe>`
- `<object>`
- `<embed>`
- `<link>`
- `<style>` (excepto en scope limitado)
- Cualquier tag con event handlers (onclick, onerror, onload, etc.)

## Ejemplo de Prueba

### Input Malicioso
```html
<script>alert('XSS')</script>
<p>Contenido normal</p>
<img src="x" onerror="alert('XSS')">
<a href="javascript:alert('XSS')">Click</a>
```

### Output Sanitizado
```html
<p>Contenido normal</p>
<img src="x">
<a>Click</a>
```

## Testing

Para probar la protección XSS:

1. **Como Admin**, crear un tip/blog con contenido malicioso:
```html
<script>alert('XSS Test')</script>
<p>Este es contenido normal</p>
<img src="x" onerror="alert('XSS Image')">
```

2. **Verificar** que:
   - ✅ El script NO se ejecuta
   - ✅ El alert NO aparece
   - ✅ El contenido `<p>` se muestra correctamente
   - ✅ La imagen no ejecuta el evento onerror

3. **Resultado Esperado**:
   - Solo se muestra: "Este es contenido normal"
   - No hay alertas ni scripts ejecutándose

## Mejores Prácticas

### ✅ DO (Hacer)
- Siempre usar DOMPurify antes de renderizar HTML de usuarios
- Mantener lista blanca de tags restrictiva
- Validar input en backend también
- Actualizar DOMPurify regularmente

### ❌ DON'T (No Hacer)
- Nunca usar `dangerouslySetInnerHTML` sin sanitizar
- No confiar solo en validación frontend
- No permitir tags innecesarios
- No deshabilitar protecciones de DOMPurify

## Próximos Pasos

### Recomendaciones Adicionales
1. **CSP Headers**: Implementar Content Security Policy en el servidor
2. **Backend Validation**: Sanitizar también en el backend (Express.js)
3. **Rate Limiting**: Prevenir spam de contenido malicioso
4. **Logging**: Registrar intentos de XSS para análisis

### CSP Ejemplo
```javascript
// En el servidor Express
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
```

## Referencias

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)

---

**Fecha de Implementación**: 2025-12-01
**Desarrollador**: Frontend Developer (Claude Code)
**Status**: ✅ Completado
**Prioridad**: 🔴 CRÍTICA (Seguridad)
