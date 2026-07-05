import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, History, Loader2, Upload, CheckCircle, XCircle,
  ShieldCheck, Building2, University, User, Clock,
  FileCheck, AlertCircle, RefreshCw
} from 'lucide-react';

export interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: number | null;
  title: string;
}

type HistoryItem = {
  id: number;
  action: string;
  notes?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    role: string;
  };
};

function getStepConfig(action: string) {
  const a = action.toLowerCase();
  if (a.includes('diunggah') || a.includes('upload')) {
    return {
      icon: Upload,
      bgGradient: 'from-blue-500 to-blue-600',
      ringColor: 'ring-blue-100 dark:ring-blue-900/40',
      cardBg: 'bg-blue-50/60 dark:bg-blue-950/20',
      cardBorder: 'border-blue-100 dark:border-blue-900/30',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      label: 'Dosen',
    };
  }
  if (a.includes('diperbarui') || a.includes('update')) {
    return {
      icon: RefreshCw,
      bgGradient: 'from-violet-500 to-violet-600',
      ringColor: 'ring-violet-100 dark:ring-violet-900/40',
      cardBg: 'bg-violet-50/60 dark:bg-violet-950/20',
      cardBorder: 'border-violet-100 dark:border-violet-900/30',
      badgeBg: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
      label: 'Dosen',
    };
  }
  if (a.includes('verifikasi fakultas') || a.includes('diverifikasi fakultas')) {
    return {
      icon: Building2,
      bgGradient: 'from-indigo-500 to-indigo-600',
      ringColor: 'ring-indigo-100 dark:ring-indigo-900/40',
      cardBg: 'bg-indigo-50/60 dark:bg-indigo-950/20',
      cardBorder: 'border-indigo-100 dark:border-indigo-900/30',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
      label: 'Admin Fakultas',
    };
  }
  if (a.includes('disetujui') || a.includes('approved') || a.includes('lppm')) {
    return {
      icon: ShieldCheck,
      bgGradient: 'from-emerald-500 to-emerald-600',
      ringColor: 'ring-emerald-100 dark:ring-emerald-900/40',
      cardBg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
      cardBorder: 'border-emerald-100 dark:border-emerald-900/30',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
      label: 'Admin LPPM',
    };
  }
  if (a.includes('ditolak') || a.includes('reject')) {
    return {
      icon: XCircle,
      bgGradient: 'from-red-500 to-red-600',
      ringColor: 'ring-red-100 dark:ring-red-900/40',
      cardBg: 'bg-red-50/60 dark:bg-red-950/20',
      cardBorder: 'border-red-100 dark:border-red-900/30',
      badgeBg: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      label: a.includes('lppm') ? 'Admin LPPM' : 'Admin Fakultas',
    };
  }
  return {
    icon: FileCheck,
    bgGradient: 'from-gray-400 to-gray-500',
    ringColor: 'ring-gray-100 dark:ring-zinc-800',
    cardBg: 'bg-gray-50/60 dark:bg-zinc-800/50',
    cardBorder: 'border-gray-100 dark:border-zinc-700',
    badgeBg: 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300',
    label: 'Sistem',
  };
}

function getRoleIcon(role?: string) {
  if (!role) return User;
  const r = role.toLowerCase();
  if (r.includes('lppm')) return University;
  if (r.includes('fakultas')) return Building2;
  return User;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('id-ID', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}

export function DocumentHistoryModal({ isOpen, onClose, docId, title }: DocumentHistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && docId) {
      setLoading(true);
      setHistory([]);
      fetch(`/api/documents/${docId}/history`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setHistory(data.history || []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, docId]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-gray-100 dark:border-zinc-800"
          >
            {/* ── Header ── */}
            <div className="relative px-7 pt-7 pb-5 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-gray-100/80 dark:border-zinc-800 flex-shrink-0 overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4 relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                      Riwayat Dokumen
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5 line-clamp-1 max-w-[260px]">
                      {title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!loading && history.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">
                    Total Aktivitas:
                  </span>
                  <span className="text-[9px] font-black bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {history.length} Langkah
                  </span>
                </div>
              )}
            </div>

            {/* ── Body ── */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                    Memuat Riwayat...
                  </p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-[1.25rem] flex items-center justify-center mb-4 shadow-inner">
                    <History className="w-8 h-8 text-gray-200 dark:text-zinc-600" />
                  </div>
                  <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    Belum ada riwayat
                  </p>
                  <p className="text-[10px] font-bold text-gray-300 dark:text-zinc-600 uppercase tracking-wider mt-1">
                    Aktivitas akan tercatat di sini
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical connector */}
                  <div className="absolute left-[27px] top-7 bottom-7 w-0.5 bg-gradient-to-b from-gray-200 via-gray-100 to-transparent dark:from-zinc-700 dark:via-zinc-800 dark:to-transparent" />

                  <div className="space-y-5">
                    {history.map((item, idx) => {
                      const cfg = getStepConfig(item.action);
                      const StepIcon = cfg.icon;
                      const RoleIcon = getRoleIcon(item.user?.role);
                      const { date, time } = formatDateTime(item.created_at);
                      const isLast = idx === history.length - 1;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07, duration: 0.28, ease: 'easeOut' }}
                          className="relative flex items-start gap-4"
                        >
                          {/* Step icon */}
                          <div className={`relative z-10 shrink-0 w-[54px] h-[54px] flex items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.bgGradient} shadow-lg ring-4 ${cfg.ringColor}`}>
                            <StepIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                            {isLast && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              </span>
                            )}
                          </div>

                          {/* Card */}
                          <div className={`flex-1 ${cfg.cardBg} border ${cfg.cardBorder} rounded-2xl p-4 min-w-0`}>
                            {/* Title + badge */}
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight leading-snug">
                                {item.action}
                              </p>
                              <span className={`shrink-0 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${cfg.badgeBg}`}>
                                {cfg.label}
                              </span>
                            </div>

                            {/* Actor + timestamp */}
                            <div className="flex items-center flex-wrap gap-2 mt-2.5">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                <RoleIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                <span>{item.user?.name || 'Sistem'}</span>
                              </div>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600 shrink-0" />
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                                <Clock className="w-3 h-3 shrink-0 opacity-60" />
                                <span>{date}</span>
                                <span className="font-black bg-white/80 dark:bg-zinc-900/70 px-1.5 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700/50">
                                  {time}
                                </span>
                              </div>
                            </div>

                            {/* Notes */}
                            {item.notes && (
                              <div className="mt-3 flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-wider text-red-500 mb-1">Catatan Penolakan</p>
                                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 leading-relaxed">{item.notes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Final status tail */}
                  {history.length > 0 && (() => {
                    const last = history[history.length - 1];
                    const isApproved = last.action.toLowerCase().includes('disetujui');
                    const isRejected = last.action.toLowerCase().includes('ditolak');
                    if (!isApproved && !isRejected) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: history.length * 0.07 + 0.1 }}
                        className={`mt-5 ml-[70px] flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isApproved
                          ? <><CheckCircle className="w-4 h-4 shrink-0" /> Dokumen telah disetujui sepenuhnya</>
                          : <><XCircle className="w-4 h-4 shrink-0" /> Dokumen ditolak — perlu perbaikan</>
                        }
                      </motion.div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
