import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, LucideIcon } from 'lucide-react';

interface BaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColorClass?: string; // e.g., 'text-primary-500' or 'text-blue-500'
  maxWidthClass?: string;  // e.g., 'max-w-6xl' (default), 'max-w-2xl'
  children: ReactNode;
}

export function BaseFormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColorClass = 'text-primary-500',
  maxWidthClass = 'max-w-6xl',
  children
}: BaseFormModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full h-full sm:h-auto max-h-screen sm:max-h-[90vh] ${maxWidthClass} bg-white dark:bg-zinc-900 rounded-none sm:rounded-[2rem] shadow-2xl border-0 sm:border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  {Icon && <Icon className={`w-5 h-5 ${iconColorClass}`} />}
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                type="button"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
