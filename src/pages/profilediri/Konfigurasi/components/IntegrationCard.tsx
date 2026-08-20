import React from 'react';
import { RefreshCw, Search, Save, Lock } from 'lucide-react';
import { MetricTile } from './MetricTile';
import { AuthorPreview } from './AuthorPreview';
import { IntegrationCardProps } from '../types/konfigurasi.types';

const platformStyles = {
  scholar: {
    brandBadge: 'border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark',
    brandIcon: 'border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark',
    inputFocus: 'focus:border-chart-scholar focus:ring-2 focus:ring-chart-scholar/15',
  },
  scopus: {
    brandBadge: 'border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark',
    brandIcon: 'border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark',
    inputFocus: 'focus:border-chart-scopus focus:ring-2 focus:ring-chart-scopus/15',
  },
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  type,
  icon: Icon,
  value,
  savedValue,
  placeholder,
  data,
  checkedAuthor,
  checking,
  loading,
  onChange,
  onCheck,
  onSave,
  onSync,
}) => {
  const style = platformStyles[type];
  const isSaved = Boolean(savedValue);
  const isSynchronized = Boolean(data);
  const saveDisabled = loading || !value || (value !== savedValue && !checkedAuthor);

  const metrics = [
    { label: 'Documents', value: data?.document_count },
    { label: 'Citations', value: data?.total_citations },
    { label: 'h-index', value: data?.h_index },
  ];

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light p-5 shadow-xs dark:border-hairline-dark dark:bg-surface-dark sm:p-6">
      <div className="space-y-5">
        {/* Header: Platform info and status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${style.brandIcon}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark">
                  {title}
                </h3>
              </div>
              <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
              isSynchronized
                ? 'border-hairline-light bg-surface-light-raised text-ink-heading dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark'
                : 'border-hairline-light-soft bg-transparent text-muted dark:border-hairline-dark-soft dark:text-on-dark-muted'
            }`}
          >
            {isSynchronized ? 'Tersinkron' : 'Belum Sinkron'}
          </span>
        </div>

        {/* Input & Action Controls */}
        <div className="rounded-xl border border-hairline-light bg-surface-light-raised p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
              {title} Author ID
            </label>
            {isSaved ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted dark:text-on-dark-muted">
                <Lock className="h-3 w-3 text-muted-soft dark:text-on-dark-muted" aria-hidden="true" />
                Terkunci
              </span>
            ) : (
              <span className="text-[11px] font-medium text-warning dark:text-warning-on-dark">
                Belum Terdaftar
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            {isSaved ? (
              // Saved & Locked state: Input is read-only, non-editable
              <>
                <div className="relative w-full">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={savedValue || value}
                    aria-label={`${title} Author ID (Terkunci)`}
                    className="h-10 w-full rounded-lg border border-hairline-light-soft bg-surface-light-raised/80 px-3.5 text-xs font-mono font-semibold text-ink-heading cursor-not-allowed select-all dark:border-hairline-dark-soft dark:bg-surface-dark-soft dark:text-on-dark"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onSync}
                    disabled={loading}
                    aria-label={`Sinkronkan data ${title}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-hairline-light bg-surface-light px-4 text-xs font-bold text-body-strong transition-colors hover:bg-surface-light-raised hover:text-ink-heading disabled:cursor-not-allowed disabled:opacity-50 dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:hover:bg-surface-dark-elevated dark:hover:text-on-dark cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                    Sync Data
                  </button>
                </div>
              </>
            ) : (
              // Unsaved state: Editable with Verification & Save buttons
              <>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  disabled={loading || checking}
                  onChange={(event) => onChange(event.target.value)}
                  aria-label={`Masukkan ${title} Author ID`}
                  className={`h-10 w-full rounded-lg border border-hairline-light bg-surface-light px-3.5 text-xs font-mono font-semibold text-ink-heading outline-none transition-all placeholder:text-muted dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:placeholder:text-on-dark-muted ${style.inputFocus}`}
                />

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onCheck}
                    disabled={checking || !value}
                    aria-label={`Verifikasi ${title} ID`}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-hairline-light bg-surface-light px-3.5 text-xs font-bold text-body-strong transition-colors hover:bg-surface-light-raised disabled:cursor-not-allowed disabled:opacity-50 dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:hover:bg-surface-dark-elevated cursor-pointer"
                  >
                    {checking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Search className="h-3.5 w-3.5" aria-hidden="true" />}
                    Verifikasi
                  </button>

                  {checkedAuthor && (
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={saveDisabled}
                      aria-label={`Simpan ${title} ID`}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-ink px-4 text-xs font-bold text-on-ink transition-colors hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-ink dark:hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer animate-in fade-in zoom-in-95 duration-150"
                    >
                      <Save className="h-3.5 w-3.5" aria-hidden="true" />
                      Simpan ID
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Contextual notice */}
          {isSaved ? (
            <p className="text-[11px] text-muted dark:text-on-dark-muted flex items-center gap-1.5">
              <Lock className="h-3 w-3 shrink-0 text-muted-soft dark:text-on-dark-muted" aria-hidden="true" />
              <span>ID ini telah terverifikasi dan terkunci. Hubungi Admin Penelitian jika membutuhkan perubahan.</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted dark:text-on-dark-muted">
              Setelah disimpan, ID akan terkunci otomatis demi integritas data publikasi akademik.
            </p>
          )}
        </div>

        {/* Verified Author Preview (only when checking unsaved ID) */}
        {!isSaved && <AuthorPreview author={checkedAuthor} tone={type} />}

        {/* Metrics Grid: Documents, Citations, h-index */}
        <div>
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <MetricTile
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Timestamp */}
      {data?.last_synced && (
        <div className="mt-4 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft text-right">
          <p className="text-[11px] text-muted dark:text-on-dark-muted font-medium">
            Terakhir disinkronkan: {new Date(data.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      )}
    </section>
  );
};

