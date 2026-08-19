import React from 'react';
import { RefreshCw, Search, Save, Trash2 } from 'lucide-react';
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
  onDelete,
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
              <Icon className="h-5 w-5" />
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
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-semibold ${
              isSynchronized
                ? 'border-success-border bg-success-soft text-success dark:border-success-on-dark/30 dark:bg-success/15 dark:text-success-on-dark'
                : 'border-hairline-light bg-surface-light-raised text-muted dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-muted'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isSynchronized ? 'bg-success dark:bg-success-on-dark' : 'bg-muted-soft dark:bg-on-dark-muted'}`} />
            {isSynchronized ? 'Tersinkron' : 'Belum sinkron'}
          </span>
        </div>

        {/* Input & Action Controls */}
        <div className="rounded-xl border border-hairline-light bg-surface-light-raised p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
              {title} Author ID
            </label>
            {savedValue && (
              <span className="text-[11px] font-mono text-muted dark:text-on-dark-muted">
                Tersimpan: <span className="font-semibold text-ink-heading dark:text-on-dark">{savedValue}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={`h-10 w-full rounded-lg border border-hairline-light bg-surface-light px-3.5 text-xs font-semibold text-ink-heading outline-none transition-all placeholder:text-muted dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:placeholder:text-on-dark-muted ${style.inputFocus}`}
            />

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onCheck}
                disabled={checking || !value}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-hairline-light bg-surface-light px-3.5 text-xs font-bold text-body-strong transition-colors hover:bg-surface-light-raised disabled:cursor-not-allowed disabled:opacity-50 dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:hover:bg-surface-dark-elevated cursor-pointer"
              >
                {checking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                Verifikasi
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saveDisabled}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-ink px-4 text-xs font-bold text-on-ink transition-colors hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-ink dark:hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Simpan
              </button>

              <button
                type="button"
                onClick={onSync}
                disabled={loading || !isSaved}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-hairline-light bg-surface-light px-3.5 text-xs font-bold text-body-strong transition-colors hover:bg-surface-light-raised disabled:cursor-not-allowed disabled:opacity-50 dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark dark:hover:bg-surface-dark-elevated cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={onDelete}
                  title="Hapus ID"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-error-border bg-error-soft px-3 text-xs font-bold text-error transition-colors hover:bg-error/20 dark:border-error-on-dark/30 dark:bg-error/20 dark:text-error-on-dark cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Verified Author Preview */}
        <AuthorPreview author={checkedAuthor} tone={type} />

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

