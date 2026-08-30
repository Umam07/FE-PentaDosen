import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

export interface EmptyStateProps {
  /** Optional icon component (Lucide) */
  icon?: LucideIcon;
  /** Main title of the empty state */
  title: string;
  /** Description / guide text */
  description?: string;
  /** Primary action button label */
  actionLabel?: string;
  /** Primary action callback */
  onAction?: () => void;
  /** Secondary action button label (e.g., 'Reset Filter') */
  secondaryActionLabel?: string;
  /** Secondary action callback */
  onSecondaryAction?: () => void;
  /** Additional container classes */
  className?: string;
  /** Compact mode for small cards or drawers */
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center text-center select-none ${
        compact ? 'py-8 px-4' : 'py-14 lg:py-16 px-6'
      } ${className}`}
    >
      {/* Icon with warm-neutral badge container adhering to design.md */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted shadow-2xs">
          <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} strokeWidth={1.75} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-semibold text-ink-heading dark:text-on-dark tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1 text-xs text-muted dark:text-on-dark-muted max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(onAction || onSecondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs"
            >
              {secondaryActionLabel}
            </button>
          )}

          {onAction && actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-ink hover:bg-ink-hover text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark border border-transparent dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
