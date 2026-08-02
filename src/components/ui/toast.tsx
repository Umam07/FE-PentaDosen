'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from 'sonner';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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

const variantStyles: Record<Variant, string> = {
  default: 'bg-card/95 border-border text-foreground shadow-xl shadow-black/5 dark:shadow-black/30',
  success: 'bg-card/95 border-green-600/40 text-foreground shadow-xl shadow-green-950/10 dark:shadow-green-950/30',
  error: 'bg-card/95 border-destructive/40 text-foreground shadow-xl shadow-red-950/10 dark:shadow-red-950/30',
  warning: 'bg-card/95 border-amber-600/40 text-foreground shadow-xl shadow-amber-950/10 dark:shadow-amber-950/30',
};

const titleColor: Record<Variant, string> = {
  default: 'text-foreground',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
};

const iconColor: Record<Variant, string> = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
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
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'flex items-center justify-between w-full min-w-[340px] max-w-sm sm:max-w-md p-4 rounded-2xl border z-[9999] pointer-events-auto backdrop-blur-md',
          variantStyles[variant]
        )}
      >
        <div className="flex items-start gap-3.5">
          <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor[variant])} />
          <div className="space-y-1">
            {title && (
              <h3
                className={cn(
                  'text-sm font-semibold leading-tight tracking-tight',
                  titleColor[variant],
                  highlightTitle && titleColor['success']
                )}
              >
                {title}
              </h3>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-3 flex-shrink-0">
          {actions?.label && (
            <Button
              variant={actions.variant || 'outline'}
              size="sm"
              onClick={() => {
                actions.onClick();
                sonnerToast.dismiss(toastId);
              }}
              className={cn(
                'cursor-pointer h-8 px-3 text-xs font-semibold rounded-xl',
                variant === 'success'
                  ? 'text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20'
                  : variant === 'error'
                  ? 'text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20'
                  : variant === 'warning'
                  ? 'text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20'
                  : 'text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20'
              )}
            >
              {actions.label}
            </Button>
          )}

          <button
            onClick={() => {
              sonnerToast.dismiss(toastId);
              onDismiss?.();
            }}
            className="rounded-full p-1.5 hover:bg-muted/60 dark:hover:bg-muted/40 transition-colors focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 text-muted-foreground" />
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
        toastOptions={{ unstyled: true, className: 'flex justify-end' }}
      />
    );
  }
);

Toaster.displayName = 'Toaster';

export default Toaster;
