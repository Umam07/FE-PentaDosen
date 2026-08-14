import React from 'react';
import { RefreshCw, Search, Save, Trash2 } from 'lucide-react';
import { MetricTile } from './MetricTile';
import { AuthorPreview } from './AuthorPreview';
import { IntegrationCardProps } from '../types/konfigurasi.types';

const platformStyles = {
  scholar: {
    brandBadge: 'border-blue-200/80 bg-blue-50/80 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300',
    brandIcon: 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
    inputFocus: 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
  },
  scopus: {
    brandBadge: 'border-orange-200/80 bg-orange-50/80 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300',
    brandIcon: 'border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-400',
    primaryButton: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white',
    inputFocus: 'focus:border-orange-500 focus:ring-1 focus:ring-orange-500',
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
    <section className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="space-y-5">
        {/* Header: Platform info and status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.brandIcon}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              isSynchronized
                ? 'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isSynchronized ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'}`} />
            {isSynchronized ? 'Tersinkron' : 'Belum sinkron'}
          </span>
        </div>

        {/* Input & Action Controls */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {title} Author ID
            </label>
            {savedValue && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Tersimpan: <span className="font-semibold text-slate-700 dark:text-slate-300">{savedValue}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={`h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600 ${style.inputFocus}`}
            />

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onCheck}
                disabled={checking || !value}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {checking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                Verifikasi
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saveDisabled}
                className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${style.primaryButton}`}
              >
                <Save className="h-3.5 w-3.5" />
                Simpan
              </button>

              <button
                type="button"
                onClick={onSync}
                disabled={loading || !isSaved}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={onDelete}
                  title="Hapus ID"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/70 px-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
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
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-right">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Terakhir disinkronkan: {new Date(data.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      )}
    </section>
  );
};

