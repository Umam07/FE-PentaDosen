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
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                platform === 'scholar'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {label}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'
              }`}
            />
            {isConnected ? 'Terhubung' : 'Belum Dihubungkan'}
          </span>
        </div>

        {/* Value Box */}
        <div className="mt-4 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {platform === 'scholar' ? 'Google Scholar ID' : 'Scopus Author ID'}
              </span>
              <p
                className={`mt-0.5 truncate font-mono text-sm font-semibold ${
                  isConnected
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'italic text-slate-400 dark:text-slate-500 font-normal'
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-xs dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-xs dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
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
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {isConnected ? 'Sinkronisasi otomatis aktif' : 'Hubungkan untuk menarik data riset'}
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
          >
            <span>{isConnected ? 'Kelola ID' : 'Hubungkan Sekarang'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

