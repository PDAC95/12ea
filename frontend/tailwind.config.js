/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal: Rosa coral suave y profesional
        primary: {
          50: '#fef5f8',
          100: '#fde9f0',
          200: '#fcd3e1',
          300: '#fab0ca',
          400: '#f781a8',
          500: '#f0568c', // Rosa coral principal
          600: '#de3370',
          700: '#c32259',
          800: '#a11e4c',
          900: '#871d43',
        },
        // Paleta secundaria: Lavanda/Morado suave
        secondary: {
          50: '#f9f6fe',
          100: '#f2edfd',
          200: '#e7ddfb',
          300: '#d4c2f7',
          400: '#ba9af0',
          500: '#a076e7',
          600: '#8a55da',
          700: '#7642c0',
          800: '#63389d',
          900: '#52307f',
        },
        // Acento: Turquesa/Teal cálido
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Terracota/Melocotón para calidez
        warm: {
          50: '#fef9f5',
          100: '#fef1e7',
          200: '#fde1cb',
          300: '#fbc9a3',
          400: '#f8a870',
          500: '#f58b4c',
          600: '#e66f32',
          700: '#c05628',
          800: '#984625',
          900: '#7a3b22',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
