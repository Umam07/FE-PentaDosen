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
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kelengkapan Profil
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isComplete
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {isComplete ? 'Lengkap' : 'Perlu Dilengkapi'}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {completionPercent}%
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              data akun terisi
            </span>
          </div>
        </div>

        {!isComplete && onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center justify-center self-start sm:self-auto rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer"
          >
            Lengkapi ID Publikasi
          </button>
        )}
      </div>

      {/* Clean Segmented Progress Indicators */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {completionItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.done ? 'bg-emerald-500' : 'bg-transparent'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-medium ${
                  item.done
                    ? 'text-slate-700 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  item.done
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
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


