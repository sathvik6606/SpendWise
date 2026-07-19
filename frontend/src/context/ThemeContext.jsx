import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('spendwise-theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const getSystemTheme = () => (mediaQuery.matches ? 'dark' : 'light');

    const applyTheme = (nextTheme) => {
      const resolved = nextTheme === 'system' ? getSystemTheme() : nextTheme;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
      setResolvedTheme(resolved);
    };

    applyTheme(theme);

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener?.('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleSystemChange);
    };
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
};
