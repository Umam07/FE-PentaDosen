import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Globe,
  Hash,
  RefreshCw,
  Save,
  Search,
  Trash2,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { ProfileTrendChart } from '../dosen/dashboard/components/ProfileCharts';

interface KonfigurasiProps {
  user: any;
  setUser: (user: any) => void;
  scholarId: string;
  setScholarId: (id: string) => void;
  scopusId: string;
  setScopusId: (id: string) => void;
  scholarData: any;
  setScholarData: (data: any) => void;
  scopusData: any;
  setScopusData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  checkingInfo: boolean;
  setCheckingInfo: (checking: boolean) => void;
  checkingScopus: boolean;
  setCheckingScopus: (checking: boolean) => void;
  checkedAuthor: any;
  setCheckedAuthor: (author: any) => void;
  checkedScopusAuthor: any;
  setCheckedScopusAuthor: (author: any) => void;
  message: { text: string; type: 'success' | 'error' | '' };
  setMessage: (msg: { text: string; type: 'success' | 'error' | '' }) => void;
  scholarChartData: any;
  scopusChartData: any;
  handleCheckId: () => Promise<void>;
  handleSaveScholarId: () => Promise<void>;
  handleCheckScopusId: () => Promise<void>;
  handleSaveScopusId: () => Promise<void>;
  handleDeleteScholarId: () => Promise<void>;
  handleDeleteScopusId: () => Promise<void>;
  handleSync: () => Promise<void>;
  handleSyncScopus: () => Promise<void>;
  handleSyncAll: () => Promise<void>;
  tabVariants: any;
}

type IntegrationTone = 'scholar' | 'scopus';

const toneClasses = {
  scholar: {
    icon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-300',
    iconBorder: 'border-blue-100 dark:border-blue-900/40',
    button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
    ring: 'focus:border-blue-500 focus:ring-blue-500/15',
    chartBar: '#2563eb',
    chartBarGradient: '#60a5fa',
    chartLine: '#7c3aed',
  },
  scopus: {
    icon: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-300',
    iconBorder: 'border-rose-100 dark:border-rose-900/40',
    button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
    ring: 'focus:border-rose-500 focus:ring-rose-500/15',
    chartBar: '#e11d48',
    chartBarGradient: '#fb7185',
    chartLine: '#0891b2',
  },
};

const MetricTile: React.FC<{ label: string; value: any; icon: any }> = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <Icon className="h-4 w-4 text-slate-400 dark:text-slate-600" />
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{value ?? 0}</p>
    </div>
  );
};

function AuthorPreview({ author, tone }: { author: any; tone: IntegrationTone }) {
  if (!author) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-slate-300 dark:bg-slate-900">
        {author.thumbnail ? (
          <img src={author.thumbnail} alt={author.name || 'Author'} className="h-full w-full object-cover" />
        ) : (
          <User className={`h-6 w-6 ${tone === 'scholar' ? 'text-blue-300' : 'text-rose-300'}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950 dark:text-white">{author.name}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
          {author.affiliations}
        </p>
      </div>
      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
    </motion.div>
  );
}

function IntegrationCard({
  title,
  description,
  type,
  icon: Icon,
  value,
  savedValue,
  placeholder,
  data,
  checkedAuthor,
  chartData,
  checking,
  loading,
  onChange,
  onCheck,
  onSave,
  onDelete,
  onSync,
}: {
  title: string;
  description: string;
  type: IntegrationTone;
  icon: any;
  value: string;
  savedValue?: string;
  placeholder: string;
  data: any;
  checkedAuthor: any;
  chartData: any;
  checking: boolean;
  loading: boolean;
  onChange: (value: string) => void;
  onCheck: () => Promise<void>;
  onSave: () => Promise<void>;
  onDelete: () => void;
  onSync: () => Promise<void>;
}) {
  const tone = toneClasses[type];
  const isSaved = Boolean(savedValue);
  const hasChart = Array.isArray(chartData?.chartData) && chartData.chartData.length > 0;
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

        {/* Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Tren Publikasi
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                Publikasi dan sitasi per tahun
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-300 dark:text-slate-700" />
          </div>
          <div className="h-52">
            {hasChart ? (
              <ProfileTrendChart
                chartData={chartData.chartData}
                leftDomainMax={chartData.leftMax}
                rightDomainMax={chartData.rightMax}
                barColor={tone.chartBar}
                barGradientColor={tone.chartBarGradient}
                lineColor={tone.chartLine}
                areaGradientColor={tone.chartLine}
                gradientId={type}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-center dark:bg-slate-900/60">
                <div>
                  <BarChart3 className="mx-auto h-8 w-8 text-slate-200 dark:text-slate-800" />
                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
                    Data tren belum tersedia
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Konfigurasi({
  user,
  scholarId,
  setScholarId,
  scopusId,
  setScopusId,
  scholarData,
  scopusData,
  loading,
  checkingInfo,
  checkingScopus,
  checkedAuthor,
  setCheckedAuthor,
  checkedScopusAuthor,
  setCheckedScopusAuthor,
  scholarChartData,
  scopusChartData,
  handleCheckId,
  handleSaveScholarId,
  handleCheckScopusId,
  handleSaveScopusId,
  handleSync,
  handleSyncScopus,
  handleSyncAll,
  handleDeleteScholarId,
  handleDeleteScopusId,
  tabVariants,
}: KonfigurasiProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'scholar' | 'scopus' | null }>({ type: null });

  const confirmDelete = async () => {
    if (showDeleteConfirm.type === 'scholar') {
      await handleDeleteScholarId();
    } else if (showDeleteConfirm.type === 'scopus') {
      await handleDeleteScopusId();
    }
    setShowDeleteConfirm({ type: null });
  };

  return (
    <motion.div
      key="integrasi"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm.type && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Konfirmasi Hapus
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                ID {showDeleteConfirm.type === 'scholar' ? 'Google Scholar' : 'Scopus'} akan dilepas dari profil dan data sinkronisasinya tidak lagi ditampilkan.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteConfirm({ type: null })}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-black text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
                >
                  Hapus ID
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sync All Banner */}
      <section className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-widest text-slate-950 dark:text-white">
                Sinkronisasi Data Publikasi
              </h2>
              <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Hubungkan Google Scholar dan Scopus agar metrik publikasi, sitasi, dan poin performa dapat diperbarui dari sumber eksternal.
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncAll}
            disabled={loading || (!scholarId && !scopusId)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Sinkronkan Semua
          </button>
        </div>
      </section>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntegrationCard
          title="Google Scholar"
          description="Dipakai untuk mengambil sitasi, h-index, i10-index, dan daftar publikasi Scholar."
          type="scholar"
          icon={Globe}
          value={scholarId}
          savedValue={user?.scholar_id}
          placeholder="Contoh: xxxxxxxAAAAJ"
          data={scholarData}
          checkedAuthor={checkedAuthor}
          chartData={scholarChartData}
          checking={checkingInfo}
          loading={loading}
          onChange={(nextValue) => {
            setScholarId(nextValue);
            setCheckedAuthor(null);
          }}
          onCheck={handleCheckId}
          onSave={handleSaveScholarId}
          onDelete={() => setShowDeleteConfirm({ type: 'scholar' })}
          onSync={handleSync}
        />

        <IntegrationCard
          title="Scopus"
          description="Dipakai untuk mengambil dokumen terindeks, sitasi, h-index, dan basis penilaian Scopus."
          type="scopus"
          icon={Hash}
          value={scopusId}
          savedValue={user?.scopus_id}
          placeholder="Contoh: 57211234567"
          data={scopusData}
          checkedAuthor={checkedScopusAuthor}
          chartData={scopusChartData}
          checking={checkingScopus}
          loading={loading}
          onChange={(nextValue) => {
            setScopusId(nextValue);
            setCheckedScopusAuthor(null);
          }}
          onCheck={handleCheckScopusId}
          onSave={handleSaveScopusId}
          onDelete={() => setShowDeleteConfirm({ type: 'scopus' })}
          onSync={handleSyncScopus}
        />
      </div>
    </motion.div>
  );
}
