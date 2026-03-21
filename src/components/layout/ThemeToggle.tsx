import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative flex items-center bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-1 rounded-2xl w-14 h-8 transition-all duration-300 overflow-hidden group shadow-inner flex-shrink-0"
    >
      <motion.div
        layout
        className="absolute h-6 w-6 rounded-xl bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center z-10"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="w-3.5 h-3.5 text-primary-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
      </motion.div>
      <div className="flex justify-between w-full px-1.5 z-0">
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-gray-400'} transition-colors duration-300`} />
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-primary-500' : 'text-gray-400'} transition-colors duration-300`} />
      </div>
    </button>
  );
}
