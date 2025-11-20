import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ToastProvider } from './shared/context/ToastContext';
import './index.css';

/**
 * main.jsx - Punto de entrada de la aplicación
 *
 * Providers en orden:
 * 1. React.StrictMode - Modo estricto de React (development)
 * 2. BrowserRouter - React Router para navegación
 * 3. AuthProvider - Contexto de autenticación global
 * 4. ToastProvider - Sistema de notificaciones toast
 * 5. App - Componente raíz con rutas
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
