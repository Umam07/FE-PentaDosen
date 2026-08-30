import React from 'react';
import { Loader, type LoaderVariant } from './Loader';

export interface PageLoaderProps {
  /** Display as full screen overlay (min-h-screen) or contained. Default: true */
  fullScreen?: boolean;
  /** Main title text. Default: 'PentaDosen' */
  title?: string;
  /** Subtitle / status message. Default: 'Memuat halaman...' */
  message?: string;
  /** Size of the loader animation in px. Default: 56 */
  size?: number;
  /** Visual variant for the loader */
  variant?: LoaderVariant;
  /** Additional container classes */
  className?: string;
}

export function PageLoader({
  fullScreen = true,
  title = 'PentaDosen',
  message = 'Memuat halaman...',
  size = 56,
  variant = 'pentagon',
  className = '',
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${
        fullScreen
          ? 'fixed inset-0 z-50 min-h-screen w-screen bg-[#f7f7f5] dark:bg-[#171412]'
          : 'min-h-[360px] w-full bg-transparent'
      } ${className}`}
    >
      {/* Ambient background glow (subtle, 0 CPU cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/8 dark:bg-blue-400/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/5 dark:bg-amber-400/5 blur-3xl"
      />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated kinetic loader */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md dark:bg-blue-400/10" />
          <Loader
            size={size}
            variant={variant}
            color="#2563eb"
            trackColor="rgba(37, 99, 235, 0.12)"
            accentColor="#f59e0b"
            speed={1.1}
            label={message}
          />
        </div>

        {/* Brand title with subtle gradient */}
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
          {title}
        </h2>

        {/* Message with pulsing dots */}
        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{message}</span>
          <span className="inline-flex gap-0.5">
            <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
