import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { MouseEvent } from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    // Cek apakah browser mendukung View Transitions API dan pengguna tidak menyalakan prefers-reduced-motion
    const isAppearanceTransition =
      // @ts-ignore
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      setIsDark(!isDark);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setIsDark(!isDark);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border transition-all duration-500 ease-out flex-shrink-0 active:scale-90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
        isDark 
          ? 'border-zinc-800 hover:border-primary-500/35 hover:bg-zinc-850 hover:shadow-[0_0_15px_rgba(59,130,246,0.18)]' 
          : 'border-gray-200 hover:border-amber-500/35 hover:bg-gray-50 hover:shadow-[0_0_15px_rgba(245,158,11,0.18)]'
      }`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: isDark ? -135 : 135, scale: 0.3, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: isDark ? 135 : -135, scale: 0.3, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 18,
            mass: 0.8
          }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-[22px] h-[22px] text-primary-500 filter drop-shadow-[0_0_5px_rgba(59,130,246,0.45)]" />
          ) : (
            <Sun className="w-[22px] h-[22px] text-amber-500 filter drop-shadow-[0_0_5px_rgba(245,158,11,0.45)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

