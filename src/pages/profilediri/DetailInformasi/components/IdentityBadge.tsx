import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ArrowUpRight } from 'lucide-react';
import { IdentityBadgeProps } from '../types/detailInformasi.types';

export const IdentityBadge: React.FC<IdentityBadgeProps> = ({
  platform,
  label,
  description,
  value,
  icon: Icon,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);
  const isConnected = Boolean(value && value.trim() !== '');

  const getProfileUrl = () => {
    if (!isConnected || !value) return null;
    if (platform === 'scholar') {
      return `https://scholar.google.com/citations?user=${value.trim()}`;
    }
    if (platform === 'scopus') {
      return `https://www.scopus.com/authid/detail.uri?authorId=${value.trim()}`;
    }
    return null;
  };

  const handleCopy = async () => {
    if (!isConnected || !value) return;
    try {
      await navigator.clipboard.writeText(value.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const profileUrl = getProfileUrl();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light p-5 transition-all hover:border-ink-border dark:border-hairline-dark dark:bg-surface-dark dark:hover:border-hairline-dark-soft">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                platform === 'scholar'
                  ? 'border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark'
                  : 'border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">
                {label}
              </h4>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">
                {description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold ${
              isConnected
                ? 'border-success-border bg-success-soft text-success dark:border-success-on-dark/30 dark:bg-success/15 dark:text-success-on-dark'
                : 'border-hairline-light bg-surface-light-raised text-muted dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-muted'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? 'bg-success dark:bg-success-on-dark' : 'bg-muted-soft dark:bg-on-dark-muted'
              }`}
            />
            {isConnected ? 'Terhubung' : 'Belum Dihubungkan'}
          </span>
        </div>

        {/* Value Box */}
        <div className="mt-4 rounded-xl border border-hairline-light bg-surface-light-raised p-3 dark:border-hairline-dark dark:bg-surface-dark-elevated">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                {platform === 'scholar' ? 'Google Scholar ID' : 'Scopus Author ID'}
              </span>
              <p
                className={`mt-0.5 truncate font-mono text-sm font-semibold ${
                  isConnected
                    ? 'text-ink-heading dark:text-on-dark'
                    : 'italic text-muted-soft dark:text-on-dark-muted font-normal'
                }`}
                title={value || 'Belum dikonfigurasi'}
              >
                {value || 'Belum dikonfigurasi'}
              </p>
            </div>

            {isConnected && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  title={copied ? 'Tersalin!' : 'Salin ID'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-light hover:text-ink-heading hover:shadow-xs dark:text-on-dark-muted dark:hover:bg-surface-dark dark:hover:text-on-dark transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success dark:text-success-on-dark" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>

                {profileUrl && (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Buka profil ${label}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-light hover:text-ink-heading hover:shadow-xs dark:text-on-dark-muted dark:hover:bg-surface-dark dark:hover:text-on-dark transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {onNavigateTab && (
        <div className="mt-4 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between">
          <span className="text-[11px] text-muted dark:text-on-dark-muted">
            {isConnected ? 'Sinkronisasi otomatis aktif' : 'Hubungkan untuk menarik data riset'}
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover dark:text-accent-on-dark dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>{isConnected ? 'Kelola ID' : 'Hubungkan Sekarang'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

