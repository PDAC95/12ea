/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f7ba79',
          400: '#f39343',
          500: '#f0741d',
          600: '#e15a13',
          700: '#ba4412',
          800: '#943717',
          900: '#782f15',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe6',
          300: '#a7bdd0',
          400: '#789ab5',
          500: '#577d9d',
          600: '#446483',
          700: '#38516a',
          800: '#324659',
          900: '#2d3c4b',
        },
      },
    },
  },
  plugins: [],
};
