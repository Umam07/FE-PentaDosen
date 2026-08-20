import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, Clock, AlertCircle, 
  Calendar, Sparkles, Archive, Link2, 
  Eye, Download, Upload, Loader2, History,
  Building2, ShieldCheck, RefreshCw, User,
  FileText, ArrowRight
} from 'lucide-react';
import { buildDownloadFilename, downloadWithFilename, lockBodyScroll, unlockBodyScroll } from '../../lib/utils';

export interface DocumentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerTitle?: string;
  drawerSubtitle?: string;
  
  // Basic Document Info
  category: string;
  title: string;
  status: string;
  catatan?: string;
  
  // Metadata
  year: string | number;
  points: number | string;
  isKpiCounted?: boolean;
  hideKpiClassification?: boolean;
  customMetadata?: React.ReactNode;
  
  // Linked Research (Optional)
  showResearchLink?: boolean;
  linkedResearch?: {
    judul_penelitian: string;
    program: string;
    tahun: string | number;
  } | null;
  onChangeResearchClick?: () => void;
  onLinkResearchClick?: () => void;
  
  // File Actions
  fileUrl?: string;
  docId: number;
  uploadingPdfId?: number | null;
  onPreviewClick?: () => void;
  onUploadPdf?: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

interface HistoryItem {
  id: number;
  action: string;
  notes?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    role?: string;
  };
}

const formatDisplayYear = (val: string | number | undefined | null) => {
  if (!val || val === '-') return '-';
  const str = String(val);
  if (str.includes('-') || str.includes('T')) {
    const parsedDate = new Date(str);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear().toString();
    }
  }
  return str;
};

function getHistoryStepConfig(action: string) {
  const a = (action || '').toLowerCase();
  if (a.includes('diunggah') || a.includes('upload') || a.includes('diajukan') || a.includes('pengajuan')) {
    return {
      icon: Upload,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
      roleLabel: 'Dosen',
    };
  }
  if (a.includes('diperbarui') || a.includes('update') || a.includes('ubah') || a.includes('revisi dokumen')) {
    return {
      icon: RefreshCw,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200 dark:border-violet-800/40',
      roleLabel: 'Dosen',
    };
  }
  if (a.includes('verifikasi fakultas') || a.includes('diverifikasi fakultas') || a.includes('fakultas')) {
    return {
      icon: Building2,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40',
      roleLabel: 'Admin Fakultas',
    };
  }
  if (a.includes('disetujui') || a.includes('approved') || a.includes('lppm') || a.includes('penelitian')) {
    return {
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
      roleLabel: 'Admin LPPM',
    };
  }
  if (a.includes('ditolak') || a.includes('reject') || a.includes('revisi')) {
    return {
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
      roleLabel: a.includes('lppm') ? 'Admin LPPM' : 'Admin Fakultas',
    };
  }
  return {
    icon: FileText,
    iconColor: 'text-zinc-600 dark:text-zinc-400',
    iconBg: 'bg-zinc-100 dark:bg-zinc-800',
    badgeClass: 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    roleLabel: 'Sistem',
  };
}

function formatHistoryDateTime(dateStr: string) {
  if (!dateStr) return { date: '-', time: '-' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: dateStr, time: '' };
  
  const date = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return { date, time };
}

export function DocumentDetailDrawer({
  isOpen,
  onClose,
  drawerTitle = "Detail Dokumen",
  drawerSubtitle = "Informasi & Output Akademik",
  category,
  title,
  status,
  catatan,
  year,
  points,
  isKpiCounted = false,
  hideKpiClassification = false,
  customMetadata,
  showResearchLink = false,
  linkedResearch,
  onChangeResearchClick,
  onLinkResearchClick,
  fileUrl,
  docId,
  uploadingPdfId,
  onPreviewClick,
  onUploadPdf,
}: DocumentDetailDrawerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && docId) {
      setLoadingHistory(true);
      const isResearch = category?.toLowerCase().includes('hibah') || category?.toLowerCase() === 'penelitian';
      const url = isResearch 
        ? `/api/documents/${docId}/history?type=penelitian`
        : `/api/documents/${docId}/history`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.history || []);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingHistory(false));
    }
  }, [isOpen, docId, category]);

  // Handle ESC key to close drawer & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!fileUrl || fileUrl === '-') return;
    setIsDownloading(true);
    const filename = buildDownloadFilename(title, fileUrl);
    await downloadWithFilename(fileUrl, filename);
    setIsDownloading(false);
  };

  const statusNormalized = (status || '').toLowerCase();
  const isApproved = statusNormalized.includes('approved') || statusNormalized.includes('disetujui');
  const isRejected = statusNormalized.includes('rejected') || statusNormalized.includes('ditolak');
  const isVerifiedFakultas = statusNormalized.includes('verified by fakultas') || statusNormalized.includes('diverifikasi fakultas');

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[8000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full z-10"
          >
            {/* ── Header ── */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {drawerTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                  {drawerSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              
              {/* Document Identity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {category || 'Dokumen'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {title || 'Tanpa Judul'}
                </h4>
              </div>

              {/* Status Banner */}
              {isRejected ? (
                <div className="p-4 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-lg shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                        Status Dokumen
                      </p>
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                        Ditolak / Perlu Revisi
                      </p>
                    </div>
                  </div>

                  {catatan && (
                    <div className="pt-3 border-t border-rose-200/60 dark:border-rose-900/30 space-y-1.5">
                      <p className="text-[10px] font-bold text-rose-800/70 dark:text-rose-400/70 uppercase tracking-wider">
                        Catatan Reviewer:
                      </p>
                      <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-lg border border-rose-200/70 dark:border-rose-900/40 text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {catatan}
                      </div>
                      <p className="text-[11px] text-rose-700/90 dark:text-rose-400/90 pt-1 leading-normal">
                        Silakan perbaiki dokumen dan unggah ulang melalui tombol di bawah atau hubungi reviewer terkait.
                      </p>
                    </div>
                  )}
                </div>
              ) : isApproved ? (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      Status Dokumen
                    </p>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Disetujui (Approved)
                    </p>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                      Dokumen telah divalidasi dan tercatat dalam portofolio akademik.
                    </p>
                  </div>
                </div>
              ) : isVerifiedFakultas ? (
                <div className="p-4 bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/40 rounded-xl flex items-start gap-3">
                  <div className="p-1.5 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-lg shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-sky-800 dark:text-sky-400 uppercase tracking-wider">
                      Status Dokumen
                    </p>
                    <p className="text-xs font-bold text-sky-800 dark:text-sky-300 mt-0.5">
                      Diverifikasi Fakultas
                    </p>
                    <p className="text-[11px] text-sky-700/80 dark:text-sky-400/80 mt-0.5">
                      Menunggu persetujuan akhir dari Admin LPPM / Penelitian.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Status Dokumen
                    </p>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                      {status || 'Menunggu Verifikasi'}
                    </p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                      Dokumen sedang dalam antrean verifikasi oleh tim reviewer.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Metadata Grid ── */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-50/80 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800">
                <div className="p-3 bg-white dark:bg-zinc-900/60 rounded-lg border border-zinc-200/60 dark:border-zinc-800/80">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    Tahun
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {formatDisplayYear(year)}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-zinc-900/60 rounded-lg border border-zinc-200/60 dark:border-zinc-800/80">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    Poin KPI
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    +{points} PTS
                  </div>
                </div>

                {customMetadata && (
                  <div className="col-span-2 pt-1">
                    {customMetadata}
                  </div>
                )}

                {!hideKpiClassification && (
                  <div className="col-span-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                      Klasifikasi KPI
                    </p>
                    {isKpiCounted ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                        <Sparkles className="w-3 h-3 text-emerald-500" /> KPI Tercatat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                        <Archive className="w-3 h-3 text-zinc-400" /> Arsip Umum
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── Penelitian Asal Section ── */}
              {showResearchLink && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Penelitian Terkait
                  </p>
                  {linkedResearch ? (
                    <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 rounded-xl space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded shrink-0 mt-0.5">
                          <Link2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {linkedResearch.judul_penelitian}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 text-[9px] font-bold uppercase tracking-wider rounded">
                          {linkedResearch.program}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          Tahun {formatDisplayYear(linkedResearch.tahun)}
                        </span>
                      </div>
                      {onChangeResearchClick && (
                        <div className="pt-1 pl-6">
                          <button
                            type="button"
                            onClick={onChangeResearchClick}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                          >
                            <span>Ubah Hubungan Penelitian</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : onLinkResearchClick ? (
                    <button
                      type="button"
                      onClick={onLinkResearchClick}
                      className="w-full p-4 bg-zinc-50/60 dark:bg-zinc-800/20 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-semibold"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Hubungkan ke Penelitian Asal</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-zinc-50/60 dark:bg-zinc-800/20 border border-zinc-200/60 dark:border-zinc-800 rounded-xl flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs">
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Tidak ada penelitian terhubung</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Riwayat Perjalanan Dokumen (Timeline) ── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Riwayat Perjalanan Dokumen
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Jejak audit dan verifikasi berjenjang
                      </p>
                    </div>
                  </div>
                  
                  {!loadingHistory && history.length > 0 && (
                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-md border border-zinc-200 dark:border-zinc-700">
                      {history.length} Catatan
                    </span>
                  )}
                </div>

                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 bg-zinc-50/60 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      Memuat riwayat perjalanan...
                    </span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-6 px-4 text-center bg-zinc-50/60 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Belum ada riwayat aktivitas
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Semua aksi pengajuan, verifikasi, atau penolakan akan tercatat di sini.
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 pt-2">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[11px] top-4 bottom-4 w-px bg-zinc-200 dark:bg-zinc-800" />

                    {history.map((item, idx) => {
                      const cfg = getHistoryStepConfig(item.action);
                      const StepIcon = cfg.icon;
                      const { date, time } = formatHistoryDateTime(item.created_at);
                      const isLatest = idx === history.length - 1;

                      return (
                        <div key={item.id || idx} className="relative group">
                          {/* Step Node */}
                          <div className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor} border-2 border-white dark:border-zinc-900 z-10`}>
                            <StepIcon className="w-3 h-3" />
                          </div>

                          {/* Card Content */}
                          <div className={`p-3.5 rounded-xl border transition-all ${
                            isLatest 
                              ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 shadow-sm' 
                              : 'bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800'
                          }`}>
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {item.action}
                                </span>
                                {isLatest && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                    Terkini
                                  </span>
                                )}
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${cfg.badgeClass}`}>
                                {cfg.roleLabel}
                              </span>
                            </div>

                            {/* Actor & Timestamp */}
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-zinc-400" />
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                  {item.user?.name || 'Sistem'}
                                </span>
                              </div>
                              <span className="text-zinc-300 dark:text-zinc-700">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-400" />
                                <span>{date}</span>
                                {time && <span className="text-zinc-400 dark:text-zinc-500">({time})</span>}
                              </div>
                            </div>

                            {/* Reviewer / Action Notes */}
                            {item.notes && (
                              <div className="mt-2.5 p-2.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/30 rounded-lg">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-0.5">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>Catatan Review</span>
                                </div>
                                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* ── Footer Actions ── */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center gap-3">
              {fileUrl && fileUrl !== '-' ? (
                <>
                  <button
                    type="button"
                    onClick={onPreviewClick}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Dokumen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-1.5 p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Download File Dokumen"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : onUploadPdf ? (
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  {uploadingPdfId === docId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Unggah Berkas Dokumen</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        className="sr-only"
                        onChange={(e) => onUploadPdf && onUploadPdf(e, docId)}
                        disabled={uploadingPdfId === docId}
                      />
                    </>
                  )}
                </label>
              ) : (
                <div className="w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-xs font-semibold rounded-xl text-center">
                  Tidak Ada Berkas Dokumen
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : null;
}
