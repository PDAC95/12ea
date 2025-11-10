import AppRoutes from './routes/AppRoutes';

/**
 * App - Componente raíz de la aplicación
 *
 * Features:
 * - Renderiza el sistema de rutas completo
 * - AuthProvider envuelto en main.jsx
 * - BrowserRouter envuelto en main.jsx
 *
 * @returns {JSX.Element} Aplicación principal
 */
function App() {
  return <AppRoutes />;
}

export default App;
