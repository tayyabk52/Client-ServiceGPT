import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';

const UnifiedThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-24 z-[100] p-2 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-lg border border-gray-200/20 dark:border-white/10 shadow-lg hover:bg-white/30 dark:hover:bg-black/50 transition-all duration-300 group"
      style={{ 
        marginRight: 'calc(3.5rem + env(safe-area-inset-right))',
        transform: 'translateY(-50%)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      )}
    </button>
  );
};

export default UnifiedThemeToggle;
