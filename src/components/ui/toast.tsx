'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from 'sonner';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type Variant = 'default' | 'success' | 'error' | 'warning';
export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface ToasterProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}

export interface ToasterRef {
  show: (props: ToasterProps) => void;
}

// Left accent bar color per variant
const accentBar: Record<Variant, string> = {
  default: 'bg-zinc-400 dark:bg-zinc-500',
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  warning: 'bg-amber-400',
};

// Icon color per variant
const iconColor: Record<Variant, string> = {
  default: 'text-zinc-400 dark:text-zinc-500',
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-400',
};

// Title color per variant
const titleColor: Record<Variant, string> = {
  default: 'text-gray-900 dark:text-zinc-100',
  success: 'text-emerald-700 dark:text-emerald-400',
  error:   'text-red-700 dark:text-red-400',
  warning: 'text-amber-700 dark:text-amber-400',
};

// Action button color per variant
const actionColor: Record<Variant, string> = {
  default: 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100',
  success: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300',
  error:   'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300',
  warning: 'text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300',
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle2,
  error:   AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: 8,  scale: 0.97 },
};

/**
 * Direct global function to show toast anywhere in the app
 */
export const showToast = ({
  title,
  message,
  variant = 'default',
  duration = 4000,
  position = 'bottom-right',
  actions,
  onDismiss,
  highlightTitle,
}: ToasterProps) => {
  const Icon = variantIcons[variant];

  return sonnerToast.custom(
    (toastId) => (
      <motion.div
        variants={toastAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          // Base shell — clean white/dark card, no glow
          'relative flex items-stretch w-full min-w-[320px] max-w-[400px]',
          'bg-white dark:bg-zinc-900',
          'border border-gray-100 dark:border-zinc-800',
          'rounded-xl overflow-hidden',
          'shadow-sm',
          'z-[9999] pointer-events-auto',
        )}
      >
        {/* Left accent strip */}
        <div className={cn('w-[3px] flex-shrink-0', accentBar[variant])} />

        {/* Content area */}
        <div className="flex items-start gap-3 flex-1 px-4 py-3.5">
          <Icon
            className={cn('w-[18px] h-[18px] mt-[1px] flex-shrink-0', iconColor[variant])}
          />
          <div className="flex-1 min-w-0 space-y-0.5">
            {title && (
              <p
                className={cn(
                  'text-[13px] font-semibold leading-snug tracking-tight',
                  highlightTitle ? titleColor['success'] : titleColor[variant],
                )}
              >
                {title}
              </p>
            )}
            <p className="text-[12.5px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Right: action + dismiss */}
        <div className="flex items-center gap-1 pr-3 flex-shrink-0">
          {actions?.label && (
            <button
              onClick={() => {
                actions.onClick();
                sonnerToast.dismiss(toastId);
              }}
              className={cn(
                'text-[12px] font-semibold px-2.5 py-1 rounded-lg transition-colors duration-150',
                'bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800',
                actionColor[variant],
              )}
            >
              {actions.label}
            </button>
          )}

          <button
            onClick={() => {
              sonnerToast.dismiss(toastId);
              onDismiss?.();
            }}
            className="p-1.5 rounded-lg text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150 cursor-pointer focus:outline-none"
            aria-label="Dismiss notification"
          >
            <X className="h-[14px] w-[14px]" />
          </button>
        </div>
      </motion.div>
    ),
    { duration, position }
  );
};

/**
 * Convenient toast helper object
 */
export const toast = {
  show: showToast,
  success: (message: string, title: string = 'Sukses', options?: Partial<ToasterProps>) =>
    showToast({ title, message, variant: 'success', ...options }),
  error: (message: string, title: string = 'Gagal', options?: Partial<ToasterProps>) =>
    showToast({ title, message, variant: 'error', ...options }),
  warning: (message: string, title: string = 'Peringatan', options?: Partial<ToasterProps>) =>
    showToast({ title, message, variant: 'warning', ...options }),
  info: (message: string, title: string = 'Informasi', options?: Partial<ToasterProps>) =>
    showToast({ title, message, variant: 'default', ...options }),
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  promise: sonnerToast.promise,
};

const Toaster = forwardRef<ToasterRef, { defaultPosition?: Position }>(
  ({ defaultPosition = 'bottom-right' }, ref) => {
    const toastReference = useRef<string | number | null>(null);

    useImperativeHandle(ref, () => ({
      show(props: ToasterProps) {
        toastReference.current = showToast({
          position: defaultPosition,
          ...props,
        });
      },
    }));

    return (
      <SonnerToaster
        position={defaultPosition}
        gap={8}
        toastOptions={{ unstyled: true, className: 'flex justify-end w-full' }}
      />
    );
  }
);

Toaster.displayName = 'Toaster';

export default Toaster;
