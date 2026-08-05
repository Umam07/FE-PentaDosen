import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface Props untuk DropdownPrimitive.
 * Mengatur state open/close secara terkontrol, trigger element, serta konten panel.
 */
export interface DropdownPrimitiveProps {
  /** Menandakan apakah panel dropdown sedang terbuka */
  isOpen: boolean;
  /** Callback saat status terbuka/tertutup berubah */
  onOpenChange: (open: boolean) => void;
  /** Elemen tombol/trigger untuk membuka dropdown */
  trigger: React.ReactNode;
  /** Konten di dalam panel dropdown */
  children: React.ReactNode;
  /** Class CSS tambahan untuk container utama */
  className?: string;
  /** Class CSS tambahan untuk panel dropdown */
  panelClassName?: string;
  /** Posisi kelurusan panel ('left' atau 'right') */
  align?: 'left' | 'right';
}

/**
 * DropdownPrimitive
 * Komponen dasar (primitive) dropdown reusable yang menangani:
 * - Event click-outside untuk menutup panel
 * - Event tombol Keyboard 'Escape' untuk menutup panel
 * - Animasi smooth dan styling flat (border tipis, tanpa shadow berlebih)
 */
export const DropdownPrimitive: React.FC<DropdownPrimitiveProps> = ({
  isOpen,
  onOpenChange,
  trigger,
  children,
  className = '',
  panelClassName = '',
  align = 'left',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Listener untuk mendeteksi klik di luar area dropdown (close on outside click)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // Listener untuk mendeteksi penekanan tombol Escape (close on Escape)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Wrapper Trigger */}
      <div onClick={() => onOpenChange(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Floating Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-1.5 z-50 min-w-[220px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-sm focus:outline-none ${panelClassName}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownPrimitive;
