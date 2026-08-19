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
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all flex-shrink-0 active:scale-95 shadow-2xs cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="flex items-center justify-center">
        {isDark ? (
          <Moon className="w-[18px] h-[18px] text-slate-200" />
        ) : (
          <Sun className="w-[18px] h-[18px] text-amber-500" />
        )}
      </div>
    </button>
  );
}


