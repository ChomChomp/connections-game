"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage on client side
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        const isDark = savedTheme === 'true';
        setDarkMode(isDark);
        applyThemeClass(isDark);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        applyThemeClass(prefersDark);
      }
    }
  }, []);

  // Separate function to apply theme classes
  const applyThemeClass = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#121212'; // Fallback
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff'; // Fallback
    }
  };

  // Update document class when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      applyThemeClass(darkMode);
      localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}