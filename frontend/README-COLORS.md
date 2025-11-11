# 🎨 Paleta de Colores - Entre Amigas

**Referencia Rápida de Colores y Tipografía**

---

## Colores Principales

### 💗 Primary - Rosa Coral
```
#f0568c - primary-500
```
**Uso:** Botones principales, CTAs, enlaces importantes
**Significado:** Energía, amistad, calidez

### 💜 Secondary - Lavanda/Morado
```
#a076e7 - secondary-500
```
**Uso:** Gradientes, fondos de secciones
**Significado:** Creatividad, inspiración, confianza

### 🌊 Accent - Turquesa
```
#14b8a6 - accent-500
```
**Uso:** Badges, elementos informativos
**Significado:** Frescura, claridad, crecimiento

### 🧡 Warm - Terracota/Melocotón
```
#f58b4c - warm-500
```
**Uso:** Acentos cálidos, ilustraciones
**Significado:** Calidez, acogida, comunidad

---

## Gradientes

### Gradiente Hero (Principal)
```css
background: linear-gradient(135deg, #f0568c 0%, #a076e7 100%);
```
```jsx
className="bg-gradient-to-br from-primary-500 to-secondary-500"
```

---

## Tipografía

### Plus Jakarta Sans (Display)
**Para:** Títulos, headings, CTAs
**Pesos:** 400, 500, 600, 700, 800
```jsx
className="font-display text-4xl font-bold"
```

### Inter (Sans)
**Para:** Texto de cuerpo, párrafos
**Pesos:** 300, 400, 500, 600, 700
```jsx
className="font-sans text-base"
```

---

## Escala de Colores Completa

### Primary (Rosa Coral)
| Shade | Hex | Uso |
|-------|-----|-----|
| 50 | #fef5f8 | Fondos muy claros |
| 100 | #fde9f0 | Fondos claros |
| 200 | #fcd3e1 | Bordes suaves |
| 300 | #fab0ca | Estados hover |
| 400 | #f781a8 | Variante media |
| **500** | **#f0568c** | **🎯 Principal** |
| 600 | #de3370 | Hover botones |
| 700 | #c32259 | Active states |
| 800 | #a11e4c | Texto oscuro |
| 900 | #871d43 | Acentos profundos |

### Secondary (Lavanda)
| Shade | Hex | Uso |
|-------|-----|-----|
| 50 | #f9f6fe | Fondos suaves |
| 100 | #f2edfd | Fondos cards |
| 200 | #e7ddfb | Bordes |
| 300 | #d4c2f7 | Hover |
| 400 | #ba9af0 | Media |
| **500** | **#a076e7** | **🎯 Principal** |
| 600 | #8a55da | Hover |
| 700 | #7642c0 | Active |
| 800 | #63389d | Texto oscuro |
| 900 | #52307f | Profundo |

### Accent (Turquesa)
| Shade | Hex | Uso |
|-------|-----|-----|
| 50 | #f0fdfa | Fondos success |
| 100 | #ccfbf1 | Fondos suaves |
| 200 | #99f6e4 | Bordes |
| 300 | #5eead4 | Hover |
| 400 | #2dd4bf | Media |
| **500** | **#14b8a6** | **🎯 Principal** |
| 600 | #0d9488 | Hover |
| 700 | #0f766e | Active |
| 800 | #115e59 | Texto |
| 900 | #134e4a | Profundo |

### Warm (Terracota)
| Shade | Hex | Uso |
|-------|-----|-----|
| 50 | #fef9f5 | Fondos cálidos |
| 100 | #fef1e7 | Fondos suaves |
| 200 | #fde1cb | Bordes |
| 300 | #fbc9a3 | Hover |
| 400 | #f8a870 | Media |
| **500** | **#f58b4c** | **🎯 Principal** |
| 600 | #e66f32 | Hover |
| 700 | #c05628 | Active |
| 800 | #984625 | Texto |
| 900 | #7a3b22 | Profundo |

---

## Ejemplos de Uso

### Botón Primario con Gradiente
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl shadow-soft hover:shadow-soft-lg transition-all">
  Únete Ahora
</button>
```

### Card con Gradiente Suave
```jsx
<div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-soft">
  Contenido
</div>
```

### Título Hero
```jsx
<h1 className="font-display text-6xl font-bold text-gray-900">
  Tu comunidad en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Canadá</span>
</h1>
```

---

## Accesibilidad

### Contraste Mínimo (WCAG AA)
- Texto normal: 4.5:1
- Texto grande (18px+): 3:1
- Elementos UI: 3:1

### Colores Seguros para Texto
✅ **En fondos blancos:**
- primary-700 o más oscuro
- secondary-700 o más oscuro
- accent-700 o más oscuro
- gray-700 o más oscuro

✅ **En fondos de color:**
- Siempre usar blanco (text-white)
- Verificar contraste con herramienta

---

## Recursos

📄 **Documentación Completa:** `/frontend/docs/DESIGN-SYSTEM.md`
🔧 **Configuración Tailwind:** `/frontend/tailwind.config.js`
🌐 **Google Fonts:** `/frontend/index.html`
🎨 **Generador de Escalas:** https://uicolors.app/create
🔍 **Test de Contraste:** https://webaim.org/resources/contrastchecker/

---

**Última Actualización:** 11 de noviembre, 2025
