import React from 'react';

interface CompletionItem {
  label: string;
  done: boolean;
}

interface ProfileCompletionProps {
  completionPercent: number;
  completionItems: CompletionItem[];
  onNavigateTab?: (tab: 'integrasi' | 'info') => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercent,
  completionItems,
  onNavigateTab,
}) => {
  const isComplete = completionPercent === 100;

  return (
    <div className="rounded-3xl border border-hairline-light bg-surface-light p-6 shadow-xs dark:border-hairline-dark dark:bg-surface-dark">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
              Kelengkapan Profil
            </h3>
            <span
              className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold ${
                isComplete
                  ? 'border-success-border bg-success-soft text-success dark:border-success-on-dark/30 dark:bg-success/15 dark:text-success-on-dark'
                  : 'border-warning-border bg-warning-soft text-warning dark:border-warning-on-dark/30 dark:bg-warning/15 dark:text-warning-on-dark'
              }`}
            >
              {isComplete ? 'Lengkap' : 'Perlu Dilengkapi'}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
              {completionPercent}%
            </span>
            <span className="text-xs font-medium text-muted dark:text-on-dark-muted">
              data akun terisi
            </span>
          </div>
        </div>

        {!isComplete && onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center justify-center self-start sm:self-auto rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-on-ink transition-colors hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-ink dark:hover:bg-white cursor-pointer"
          >
            Lengkapi ID Publikasi
          </button>
        )}
      </div>

      {/* Clean Segmented Progress Indicators */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {completionItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.done ? 'bg-success dark:bg-success-on-dark' : 'bg-transparent'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-medium ${
                  item.done
                    ? 'text-body-strong dark:text-on-dark'
                    : 'text-muted-soft dark:text-on-dark-muted'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`text-[11px] font-semibold font-mono ${
                  item.done
                    ? 'text-success dark:text-success-on-dark'
                    : 'text-muted-soft dark:text-on-dark-muted'
                }`}
              >
                {item.done ? 'Terisi' : 'Belum'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


