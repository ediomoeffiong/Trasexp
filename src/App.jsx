import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routing/AppRoutes';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
