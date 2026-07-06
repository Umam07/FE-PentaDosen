import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { ToastMessage } from '../types/profile.types';

interface ToastContainerProps {
  message: ToastMessage;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ message }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-5 py-4 shadow-xl ${message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 backdrop-blur border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/90 backdrop-blur border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-400'
              }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="text-xs font-bold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
