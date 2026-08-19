import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, History, Loader2, Upload, CheckCircle2,
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
      bgColor: 'bg-blue-600 dark:bg-blue-500',
      iconColor: 'text-white',
      cardBg: 'bg-zinc-50 dark:bg-zinc-800/40',
      cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
      label: 'Dosen',
    };
  }
  if (a.includes('diperbarui') || a.includes('update')) {
    return {
      icon: RefreshCw,
      bgColor: 'bg-violet-600 dark:bg-violet-500',
      iconColor: 'text-white',
      cardBg: 'bg-zinc-50 dark:bg-zinc-800/40',
      cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
      badgeBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200 dark:border-violet-800/40',
      label: 'Dosen',
    };
  }
  if (a.includes('verifikasi fakultas') || a.includes('diverifikasi fakultas')) {
    return {
      icon: Building2,
      bgColor: 'bg-indigo-600 dark:bg-indigo-500',
      iconColor: 'text-white',
      cardBg: 'bg-zinc-50 dark:bg-zinc-800/40',
      cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40',
      label: 'Admin Fakultas',
    };
  }
  if (a.includes('disetujui') || a.includes('approved') || a.includes('lppm') || a.includes('penelitian')) {
    return {
      icon: ShieldCheck,
      bgColor: 'bg-emerald-600 dark:bg-emerald-500',
      iconColor: 'text-white',
      cardBg: 'bg-zinc-50 dark:bg-zinc-800/40',
      cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
      label: 'Admin Penelitian',
    };
  }
  if (a.includes('ditolak') || a.includes('reject')) {
    return {
      icon: AlertCircle,
      bgColor: 'bg-rose-600 dark:bg-rose-500',
      iconColor: 'text-white',
      cardBg: 'bg-rose-50/40 dark:bg-rose-950/20',
      cardBorder: 'border-rose-200/80 dark:border-rose-900/30',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
      label: a.includes('lppm') || a.includes('penelitian') ? 'Admin LPPM' : 'Admin Fakultas',
    };
  }
  return {
    icon: FileCheck,
    bgColor: 'bg-zinc-600 dark:bg-zinc-500',
    iconColor: 'text-white',
    cardBg: 'bg-zinc-50 dark:bg-zinc-800/40',
    cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
    badgeBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    label: 'Sistem',
  };
}

function getRoleIcon(role?: string) {
  if (!role) return User;
  const r = role.toLowerCase();
  if (r.includes('lppm') || r.includes('penelitian')) return University;
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-zinc-200 dark:border-zinc-800 z-10"
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Riwayat Perjalanan Dokumen
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-sm">
                    {title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Tutup Riwayat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Memuat Riwayat Dokumen...
                  </p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-3">
                    <History className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Belum ada riwayat tercatat
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Semua jejak verifikasi dan aksi dokumen akan tampil di sini.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 pt-1">
                  <div className="absolute left-[11px] top-3 bottom-3 w-px bg-zinc-200 dark:bg-zinc-800" />

                  <div className="space-y-4">
                    {history.map((item, idx) => {
                      const cfg = getStepConfig(item.action);
                      const StepIcon = cfg.icon;
                      const RoleIcon = getRoleIcon(item.user?.role);
                      const { date, time } = formatDateTime(item.created_at);
                      const isLatest = idx === history.length - 1;

                      return (
                        <div
                          key={item.id}
                          className="relative flex items-start gap-3"
                        >
                          <div className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${cfg.bgColor} ${cfg.iconColor} border-2 border-white dark:border-zinc-900 z-10`}>
                            <StepIcon className="w-3 h-3" />
                          </div>

                          <div className={`flex-1 ${cfg.cardBg} border ${cfg.cardBorder} rounded-xl p-3.5 min-w-0 ${isLatest ? 'shadow-sm' : ''}`}>
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {item.action}
                                </p>
                                {isLatest && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                    Terkini
                                  </span>
                                )}
                              </div>
                              <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border ${cfg.badgeBg}`}>
                                {cfg.label}
                              </span>
                            </div>

                            <div className="flex items-center flex-wrap gap-2 mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                              <div className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                                <RoleIcon className="w-3 h-3 text-zinc-400 shrink-0" />
                                <span>{item.user?.name || 'Sistem'}</span>
                              </div>
                              <span className="text-zinc-300 dark:text-zinc-700">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                                <span>{date}</span>
                                <span>({time})</span>
                              </div>
                            </div>

                            {item.notes && (
                              <div className="mt-2.5 p-2.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/30 rounded-lg">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-0.5">
                                  Catatan Penolakan / Feedback
                                </p>
                                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold transition-colors"
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
