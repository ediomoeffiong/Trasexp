import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routing/AppRoutes';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useSettings } from './hooks/useSettings';

const ThemeWatcher = () => {
  const { preferences, loadAllSettings } = useSettings();

  useEffect(() => {
    loadAllSettings();
  }, [loadAllSettings]);

  useEffect(() => {
    if (!preferences) return;

    const applyTheme = (theme) => {
      const root = document.documentElement;
      if (theme === 'DARK') {
        root.setAttribute('data-theme', 'dark');
      } else if (theme === 'LIGHT') {
        root.setAttribute('data-theme', 'light');
      } else {
        // SYSTEM
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      }
    };

    applyTheme(preferences.theme);

    if (preferences.theme === 'SYSTEM') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [preferences]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ThemeWatcher />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
