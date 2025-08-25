import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme-preference';

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
      return savedTheme || 'dark'; // Default to dark
    }
    return 'dark';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'dark';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center justify-center hover:scale-105 ${
        theme === 'light'
          ? 'bg-white/80 border-gray-300/50 text-gray-800 hover:bg-white shadow-md'
          : 'bg-gray-800/80 border-white/20 text-white hover:bg-gray-700/80'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon size={18} className="transition-transform duration-300" />
      ) : (
        <Sun size={18} className="transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeSwitcher;