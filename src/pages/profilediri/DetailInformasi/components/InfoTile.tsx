import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { InfoTileProps } from '../types/detailInformasi.types';

const EMPTY_VALUE = '-';

export const InfoTile: React.FC<InfoTileProps> = ({
  label,
  value,
  icon: Icon,
  copyable = false,
  mono = false,
}) => {
  const [copied, setCopied] = useState(false);
  const displayValue = value && value.trim() !== '' ? value : EMPTY_VALUE;
  const isAvailable = displayValue !== EMPTY_VALUE;

  const handleCopy = async () => {
    if (!isAvailable) return;
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group relative flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/80 text-slate-600 shadow-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          {copyable && isAvailable && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Tersalin!' : `Salin ${label}`}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700/70 dark:hover:text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Salin</span>
                </>
              )}
            </button>
          )}
        </div>
        <p
          className={`mt-1 truncate text-sm font-semibold ${
            mono ? 'font-mono text-slate-900 dark:text-slate-100 tracking-tight' : 'text-slate-900 dark:text-slate-100'
          } ${!isAvailable ? 'italic text-slate-400 dark:text-slate-500 font-normal' : ''}`}
          title={displayValue}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
};

