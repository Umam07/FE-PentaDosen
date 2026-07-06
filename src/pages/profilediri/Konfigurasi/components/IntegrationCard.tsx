import React from 'react';
import { RefreshCw, Search, Save, Trash2, TrendingUp, Award, Zap, BookOpen } from 'lucide-react';
import { MetricTile } from './MetricTile';
import { AuthorPreview } from './AuthorPreview';
import { IntegrationCardProps } from '../types/konfigurasi.types';

const toneClasses = {
  scholar: {
    icon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-300',
    iconBorder: 'border-blue-100 dark:border-blue-900/40',
    button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
    ring: 'focus:border-blue-500 focus:ring-blue-500/15',
  },
  scopus: {
    icon: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-300',
    iconBorder: 'border-rose-100 dark:border-rose-900/40',
    button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
    ring: 'focus:border-rose-500 focus:ring-rose-500/15',
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
  const tone = toneClasses[type];
  const isSaved = Boolean(savedValue);
  const saveDisabled = loading || !value || (value !== savedValue && !checkedAuthor);
  const metrics =
    type === 'scholar'
      ? [
          { label: 'Citations', value: data?.total_citations, icon: TrendingUp },
          { label: 'h-index', value: data?.h_index, icon: Award },
          { label: 'i10-index', value: data?.i10_index, icon: Zap },
        ]
      : [
          { label: 'Documents', value: data?.document_count, icon: BookOpen },
          { label: 'Citations', value: data?.total_citations, icon: TrendingUp },
          { label: 'h-index', value: data?.h_index, icon: Award },
        ];

  return (
    <section className="rounded-[2rem] border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Card header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tone.icon} ${tone.iconBorder}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-950 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
            data
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
              : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${data ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
          {data ? 'Tersinkron' : 'Belum sinkron'}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Input area */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {title} Author ID
          </label>
          <div className="mt-3 flex flex-col gap-3">
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={`min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${tone.ring}`}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onCheck}
                disabled={checking || !value}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
              >
                {checking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Verifikasi
              </button>
              <button
                onClick={onSave}
                disabled={saveDisabled}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${tone.button} sm:flex-none`}
              >
                <Save className="h-4 w-4" />
                Simpan
              </button>
              <button
                onClick={onSync}
                disabled={loading || !isSaved}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </button>
              {isSaved && (
                <button
                  onClick={onDelete}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-black text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Author Preview */}
        <AuthorPreview author={checkedAuthor} tone={type} />

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={metric.value} icon={metric.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};
