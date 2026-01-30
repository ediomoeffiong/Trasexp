import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemePreferences = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef(null);

  const setMode = (mode) => {
    setTheme(mode);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const label = theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light';

  // Show icon for current effective theme (no visible text) and keep accessible label for screen readers
  const effective = React.useMemo(() => {
    if (theme === 'auto') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  return (
    <div className="theme-preferences" ref={panelRef}>
      <button
        className="btn theme-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Theme preferences (current: ${label})`}
        title={`Theme: ${label}`}
      >
        {effective === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        <span className="sr-only">{label}</span>
      </button>

      {open && (
        <div className="theme-preferences-panel" role="menu" aria-label="Theme preferences">
          <button className={`theme-option ${theme === 'auto' ? 'active' : ''}`} onClick={() => setMode('auto')} role="menuitem">Auto</button>
          <button className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => setMode('light')} role="menuitem">Light</button>
          <button className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => setMode('dark')} role="menuitem">Dark</button>
        </div>
      )}
    </div>
  );
};

export default ThemePreferences;
