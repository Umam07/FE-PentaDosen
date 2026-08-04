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
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border transition-colors flex-shrink-0 active:scale-95 shadow-sm ${
        isDark 
          ? 'border-zinc-800 hover:bg-zinc-800' 
          : 'border-gray-200 hover:bg-gray-100'
      }`}
      aria-label="Toggle theme"
    >
      <div className="flex items-center justify-center">
        {isDark ? (
          <Moon className="w-5 h-5 text-primary-400" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </div>
    </button>
  );
}

