# Sistema de Diseño - Entre Amigas

**Versión:** 1.0
**Última actualización:** 11 de noviembre, 2025
**Proyecto:** Entre Amigas - Comunidad para mujeres migrantes hispanas

---

## Paleta de Colores

Nuestra paleta de colores refleja calidez, confianza y comunidad. Utilizamos tonos que evocan amistad, apoyo y empoderamiento femenino.

### Color Primario: Rosa Coral

**Uso:** CTAs principales, enlaces importantes, elementos destacados

```js
primary: {
  50: '#fef5f8',   // Fondos muy claros
  100: '#fde9f0',  // Fondos claros, hovers
  200: '#fcd3e1',  // Bordes suaves
  300: '#fab0ca',  // Estados hover
  400: '#f781a8',  // Variante media
  500: '#f0568c', // ⭐ COLOR PRINCIPAL - CTAs, botones primarios
  600: '#de3370', // Hover de botones
  700: '#c32259', // Active states
  800: '#a11e4c', // Texto en fondos claros
  900: '#871d43', // Acentos oscuros
}
```

**Significado:** Energía, amistad, calidez, empoderamiento
**Aplicaciones:** Botones principales, links importantes, iconos destacados, gradientes

---

### Color Secundario: Lavanda/Morado

**Uso:** Gradientes, fondos de secciones, elementos decorativos

```js
secondary: {
  50: '#f9f6fe',   // Fondos muy suaves
  100: '#f2edfd',  // Fondos de cards
  200: '#e7ddfb',  // Bordes
  300: '#d4c2f7',  // Hover states
  400: '#ba9af0',  // Variante media
  500: '#a076e7', // ⭐ COLOR SECUNDARIO - Gradientes, secciones
  600: '#8a55da', // Hover
  700: '#7642c0', // Active
  800: '#63389d', // Texto oscuro
  900: '#52307f', // Acentos profundos
}
```

**Significado:** Creatividad, inspiración, espiritualidad, confianza
**Aplicaciones:** Gradientes de hero, fondos de secciones, decoración, iconos secundarios

---

### Color de Acento: Turquesa/Teal

**Uso:** Elementos informativos, badges, notificaciones positivas

```js
accent: {
  50: '#f0fdfa',   // Fondos de success
  100: '#ccfbf1',  // Fondos suaves
  200: '#99f6e4',  // Bordes
  300: '#5eead4',  // Hover
  400: '#2dd4bf',  // Variante media
  500: '#14b8a6', // ⭐ COLOR ACENTO - Badges, info
  600: '#0d9488', // Hover
  700: '#0f766e', // Active
  800: '#115e59', // Texto
  900: '#134e4a', // Profundo
}
```

**Significado:** Frescura, claridad, tranquilidad, crecimiento
**Aplicaciones:** Badges de "verificado", elementos de información, iconos de features

---

### Color Cálido: Terracota/Melocotón

**Uso:** Elementos de calidez, ilustraciones, detalles decorativos

```js
warm: {
  50: '#fef9f5',   // Fondos muy cálidos
  100: '#fef1e7',  // Fondos suaves
  200: '#fde1cb',  // Bordes
  300: '#fbc9a3',  // Hover
  400: '#f8a870',  // Variante media
  500: '#f58b4c', // ⭐ COLOR CÁLIDO - Acentos cálidos
  600: '#e66f32', // Hover
  700: '#c05628', // Active
  800: '#984625', // Texto
  900: '#7a3b22', // Profundo
}
```

**Significado:** Calidez, acogida, tierra, comunidad
**Aplicaciones:** Iconos decorativos, ilustraciones, detalles sutiles

---

## Gradientes Principales

### Gradiente Hero (Principal)

```css
/* De rosa a morado - usado en hero y CTAs principales */
background: linear-gradient(135deg, #f0568c 0%, #a076e7 100%);

/* Tailwind CSS */
className="bg-gradient-to-br from-primary-500 to-secondary-500"
```

**Uso:** Hero section, CTAs grandes, secciones destacadas

---

### Gradiente Suave (Fondos)

```css
/* De rosa muy claro a morado muy claro */
background: linear-gradient(135deg, #fef5f8 0%, #f9f6fe 100%);

/* Tailwind CSS */
className="bg-gradient-to-br from-primary-50 to-secondary-50"
```

**Uso:** Fondos de secciones, cards, elementos sutiles

---

## Tipografía

### Fuente Principal: Inter

**Uso:** Texto de cuerpo, párrafos, descripciones, navegación

```html
<!-- Google Fonts Link -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Pesos disponibles:**
- Light (300): Textos decorativos
- Regular (400): Párrafos, texto general
- Medium (500): Énfasis sutil, botones
- SemiBold (600): Subtítulos, labels
- Bold (700): Énfasis fuerte

**Configuración Tailwind:**
```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif']
}
```

**Características:**
- Moderna y altamente legible
- Excelente en pantallas
- Amplio soporte de caracteres
- Profesional y accesible

---

### Fuente Display: Plus Jakarta Sans

**Uso:** Títulos, headings, CTAs, elementos destacados

```html
<!-- Google Fonts Link -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Pesos disponibles:**
- Regular (400): Títulos pequeños
- Medium (500): Subtítulos
- SemiBold (600): Headings H3-H4
- Bold (700): Headings H1-H2
- ExtraBold (800): CTAs, títulos hero

**Configuración Tailwind:**
```js
fontFamily: {
  display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
}
```

**Características:**
- Formas redondeadas y amigables
- Perfecta para títulos impactantes
- Moderna y contemporánea
- Transmite calidez y apertura

---

## Escalas de Tipografía

### Títulos (Headings)

```js
// H1 - Hero principal
className="font-display text-5xl md:text-6xl lg:text-7xl font-bold"

// H2 - Títulos de sección
className="font-display text-3xl md:text-4xl lg:text-5xl font-bold"

// H3 - Subtítulos importantes
className="font-display text-2xl md:text-3xl font-semibold"

// H4 - Subtítulos de cards
className="font-display text-xl md:text-2xl font-semibold"
```

### Texto de Cuerpo

```js
// Texto grande (leads)
className="font-sans text-lg md:text-xl"

// Texto regular
className="font-sans text-base"

// Texto pequeño (captions)
className="font-sans text-sm"

// Texto muy pequeño (labels)
className="font-sans text-xs"
```

---

## Border Radius

### Valores Personalizados

```js
borderRadius: {
  'xl': '1rem',    // 16px - Cards, botones grandes
  '2xl': '1.5rem', // 24px - Cards destacadas
  '3xl': '2rem',   // 32px - Hero images, elementos grandes
}
```

**Guía de uso:**
- `rounded-xl`: Botones estándar, inputs, cards pequeñas
- `rounded-2xl`: Cards medianas, imágenes de perfil
- `rounded-3xl`: Hero images, cards grandes, secciones destacadas

---

## Sombras (Shadows)

### Sombra Suave (Soft)

```js
shadow-soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)'
```

**Uso:** Cards, botones en estado normal, elementos flotantes

---

### Sombra Suave Grande (Soft Large)

```js
shadow-soft-lg: '0 10px 40px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)'
```

**Uso:** Modals, popovers, elementos muy destacados, hover de cards importantes

---

## Espaciado (Spacing)

### Sistema de Espaciado

Usamos el sistema de espaciado de Tailwind (múltiplos de 4px):

```js
// Espaciado interno de componentes
px-4 py-2    // Botones pequeños
px-6 py-3    // Botones medianos
px-8 py-4    // Botones grandes

// Espaciado entre secciones
space-y-8    // Pequeño
space-y-12   // Mediano
space-y-16   // Grande
space-y-24   // Extra grande (entre secciones principales)
```

---

## Iconografía

### Biblioteca: Lucide React

```bash
npm install lucide-react
```

**Estilo:** Outline, minimalista, moderno
**Tamaños estándar:**
- `size={16}` - Pequeño (texto inline)
- `size={20}` - Mediano (botones, navegación)
- `size={24}` - Grande (features, títulos)
- `size={32}` - Extra grande (hero, destacados)

**Colores:**
- Primary: `className="text-primary-500"`
- Secondary: `className="text-secondary-500"`
- Accent: `className="text-accent-500"`
- Neutral: `className="text-gray-600"`

---

## Componentes Base

### Botones

#### Botón Primario

```jsx
<button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
  Texto del Botón
</button>
```

#### Botón Secundario

```jsx
<button className="px-6 py-3 bg-white text-primary-600 font-medium rounded-xl shadow-soft border-2 border-primary-200 hover:border-primary-400 transition-all duration-300">
  Texto del Botón
</button>
```

---

### Cards

#### Card Estándar

```jsx
<div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-soft-lg transition-shadow duration-300">
  {/* Contenido */}
</div>
```

#### Card con Gradiente

```jsx
<div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6">
  {/* Contenido */}
</div>
```

---

## Principios de Diseño

### 1. Calidez y Acogida
- Usar tonos cálidos (rosa, melocotón)
- Bordes redondeados generosos
- Sombras suaves, nunca duras

### 2. Profesionalismo
- Tipografía clara y legible
- Jerarquía visual clara
- Espaciado generoso

### 3. Accesibilidad
- Contraste de color mínimo 4.5:1 para texto
- Tamaño de fuente mínimo 16px para cuerpo
- Botones con área de click de mínimo 44x44px

### 4. Responsividad
- Mobile-first approach
- Breakpoints de Tailwind estándar
- Imágenes responsive y optimizadas

### 5. Animaciones Sutiles
- Transiciones suaves (300ms)
- Hover effects elegantes
- Sin animaciones bruscas o exageradas

---

## Combinaciones de Colores Recomendadas

### Para CTAs Principales
- **Fondo:** Gradiente primary-500 → secondary-500
- **Texto:** Blanco
- **Hover:** Aumentar saturación/brillo

### Para Texto en Fondos Claros
- **Títulos:** gray-900 o primary-800
- **Párrafos:** gray-700
- **Captions:** gray-500

### Para Badges/Etiquetas
- **Éxito/Verificado:** accent-500
- **Información:** secondary-500
- **Destacado:** primary-500
- **Neutral:** gray-500

---

## Archivos de Configuración

### tailwind.config.js

Ubicación: `/frontend/tailwind.config.js`

Contiene:
- Paleta de colores extendida
- Fuentes personalizadas
- Border radius personalizado
- Sombras personalizadas

### index.html

Ubicación: `/frontend/index.html`

Contiene:
- Imports de Google Fonts (Inter + Plus Jakarta Sans)
- Meta tags de SEO
- Favicon

---

## Recursos y Herramientas

### Generadores de Paleta
- [Tailwind Color Shades](https://uicolors.app/create) - Para generar escalas de color
- [Coolors](https://coolors.co/) - Inspiración de paletas

### Tipografía
- [Google Fonts](https://fonts.google.com/)
- [Inter](https://fonts.google.com/specimen/Inter)
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

### Iconos
- [Lucide Icons](https://lucide.dev/) - Biblioteca oficial

### Testing de Accesibilidad
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Lighthouse

---

## Checklist de Implementación

Al crear nuevos componentes, verifica:

- [ ] Usa colores de la paleta definida
- [ ] Tipografía con font-display para títulos, font-sans para cuerpo
- [ ] Border radius según el tamaño del componente
- [ ] Sombras suaves, no CSS shadow por defecto
- [ ] Espaciado consistente con sistema Tailwind
- [ ] Responsive en mobile, tablet y desktop
- [ ] Contraste de color accesible (WCAG AA)
- [ ] Transiciones suaves en interacciones
- [ ] Iconos de Lucide React cuando sea necesario
- [ ] Estados hover/active definidos

---

## Changelog

### v1.0 - 11 de noviembre, 2025
- ✅ Paleta de colores definida (Primary, Secondary, Accent, Warm)
- ✅ Tipografía seleccionada (Inter + Plus Jakarta Sans)
- ✅ Border radius personalizado
- ✅ Sombras suaves definidas
- ✅ Gradientes principales creados
- ✅ Componentes base documentados
- ✅ Principios de diseño establecidos

---

**Mantenido por:** Equipo Entre Amigas
**Contacto:** hola@entreamigas.ca
