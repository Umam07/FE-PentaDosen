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
    <div className="group relative flex items-start gap-3.5 rounded-xl border border-hairline-light bg-surface-light-raised p-4 transition-all duration-200 hover:border-ink-border dark:border-hairline-dark dark:bg-surface-dark-elevated dark:hover:border-hairline-dark">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline-light bg-surface-light text-body-strong shadow-none dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] font-semibold tracking-wide text-muted dark:text-on-dark-muted">
            {label}
          </p>
          {copyable && isAvailable && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Tersalin!' : `Salin ${label}`}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-muted transition-colors hover:bg-surface-light hover:text-ink-heading dark:text-on-dark-muted dark:hover:bg-surface-dark dark:hover:text-on-dark cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-success dark:text-success-on-dark" />
                  <span className="text-success dark:text-success-on-dark">Tersalin</span>
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
            mono ? 'font-mono text-ink-heading dark:text-on-dark tracking-tight' : 'text-ink-heading dark:text-on-dark'
          } ${!isAvailable ? 'italic text-muted-soft dark:text-on-dark-muted font-normal' : ''}`}
          title={displayValue}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
};

