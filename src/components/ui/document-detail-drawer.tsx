import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XCircle, CheckCircle, Clock, AlertCircle, 
  CalendarDays, Sparkles, Archive, Link, 
  Eye, Download, Upload, Loader2, History
} from 'lucide-react';
import { buildDownloadFilename, downloadWithFilename } from '../../lib/utils';

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
  const [history, setHistory] = useState<any[]>([]);
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

  const handleDownload = async () => {
    if (!fileUrl || fileUrl === '-') return;
    setIsDownloading(true);
    const filename = buildDownloadFilename(title, fileUrl);
    await downloadWithFilename(fileUrl, filename);
    setIsDownloading(false);
  };

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
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{drawerTitle}</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">{drawerSubtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title Section */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-900/30 uppercase tracking-wider inline-block">
                  {category}
                </span>
                <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight leading-snug pt-1">
                  {title}
                </h4>
              </div>

              {/* Status Card */}
              {status === 'Rejected' ? (
                <div className="p-5 pb-7 bg-gradient-to-br from-red-50/90 to-red-50/40 dark:from-red-950/20 dark:to-red-950/5 border border-red-200 dark:border-red-900/30 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-800 dark:text-red-400 uppercase tracking-widest leading-none">Status Dokumen</p>
                      <p className="text-xs font-black text-red-700 dark:text-red-400 mt-1">
                        Ditolak / Perlu Revisi
                      </p>
                    </div>
                  </div>

                  {catatan && (
                    <div className="pt-3.5 border-t border-red-200/50 dark:border-red-900/20 space-y-2">
                      <p className="text-[9px] font-black text-red-800/60 dark:text-red-400/60 uppercase tracking-wider">
                        Umpan Balik Reviewer
                      </p>
                      <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 leading-relaxed pl-3 border-l-2 border-red-500">
                        {catatan}
                      </p>
                      <p className="text-[10px] font-bold text-red-600/95 dark:text-red-400/95 leading-normal pt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        Silakan unggah ulang dokumen yang sesuai atau hubungi admin LPPM jika membutuhkan klarifikasi.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  status === 'Approved' ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                  status === 'Verified by Fakultas' ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-400' :
                  'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400'
                }`}>
                  <div className="mt-0.5 shrink-0">
                    {status === 'Approved' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {(status === 'Pending' || status === 'Verified by Fakultas') && <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider leading-none">Status Dokumen</p>
                    <p className="text-xs font-bold mt-1">
                      {status === 'Verified by Fakultas' ? 'Verified by Fakultas (LPPM Approval Pending)' : status}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                <div>
                  <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">Tahun</p>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 dark:text-zinc-200">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                    {formatDisplayYear(year)}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">Poin KPI</p>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 dark:text-zinc-200">
                    <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                    +{points} PTS
                  </div>
                </div>
                {customMetadata}
                {!hideKpiClassification && (
                  <div className="col-span-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-2">Klasifikasi KPI</p>
                    {isKpiCounted ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-900/30">
                        <Sparkles className="w-3 h-3" /> KPI Tercatat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">
                        <Archive className="w-3 h-3" /> Arsip Umum
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Penelitian Asal Section */}
              {showResearchLink && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Penelitian Asal</p>
                  {linkedResearch ? (
                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <Link className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight leading-snug">
                          {linkedResearch.judul_penelitian}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded">
                          {linkedResearch.program}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">
                          Tahun {formatDisplayYear(linkedResearch.tahun)}
                        </span>
                      </div>
                      {onChangeResearchClick && (
                        <button
                          type="button"
                          onClick={onChangeResearchClick}
                          className="w-full py-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm transition-colors text-center"
                        >
                          Ubah Hubungan Penelitian
                        </button>
                      )}
                    </div>
                  ) : onLinkResearchClick ? (
                    <button
                      type="button"
                      onClick={onLinkResearchClick}
                      className="w-full p-5 bg-gray-50 dark:bg-zinc-800/30 hover:bg-gray-100 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-all group"
                    >
                      <Link className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Pilih Penelitian Asal</span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500">Hubungkan dokumen ke penelitian dosen</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/50 rounded-2xl flex items-center gap-2 text-gray-400">
                      <Link className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                      <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Tidak ada penelitian terhubung</span>
                    </div>
                  )}
                </div>
              )}

              {/* Riwayat Dokumen (Timeline) */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Riwayat Perjalanan Dokumen
                </h4>
                
                {loadingHistory ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div>
                ) : history.length === 0 ? (
                  <p className="text-[11px] text-gray-500 italic">Belum ada riwayat tercatat.</p>
                ) : (
                  <div className="relative pl-3 space-y-4 before:absolute before:inset-y-2 before:left-[15px] before:w-0.5 before:bg-gray-100 dark:before:bg-zinc-800">
                    {history.map((item, idx) => (
                      <div key={item.id} className="relative flex items-start gap-4">
                        <div className="absolute -left-[5px] mt-1.5 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-white dark:ring-zinc-900 z-10" />
                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3 flex-1 border border-gray-100 dark:border-zinc-800">
                          <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">{item.action}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">Oleh: {item.user?.name}</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              {new Date(item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {item.notes && (
                            <div className="mt-2 text-[10px] p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                              <span className="font-bold">Catatan:</span> {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30 flex flex-col gap-3">
              {fileUrl && fileUrl !== '-' ? (
                <div className="flex gap-3">
                  <button
                    onClick={onPreviewClick}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Lihat Dokumen
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-1.5 p-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-primary-500 text-gray-600 dark:text-zinc-300 hover:text-primary-600 rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Download"
                  >
                    {isDownloading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                  </button>
                </div>
              ) : onUploadPdf ? (
                <div>
                  <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-200 dark:shadow-primary-900/20 cursor-pointer transition-all active:scale-95">
                    {uploadingPdfId === docId ? (
                      <span className="animate-pulse">Mengunggah...</span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Upload Dokumen
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
                </div>
              ) : (
                <div className="w-full py-3.5 px-4 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest rounded-xl text-center">
                  Tidak Ada File Dokumen
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
