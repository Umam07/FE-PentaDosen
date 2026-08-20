import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, BarChart2, Info } from 'lucide-react';
import { BUKU_CATEGORIES } from '../constants';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface BukuMetricsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BukuMetricsGuideModal({ isOpen, onClose }: BukuMetricsGuideModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Panduan Metriks Penilaian KPI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sistem kalkulasi dan pembobotan poin penerbitan buku akademik dosen
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Skema Kalkulasi Otomatis KPI Buku Akademik
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poin dihitung secara transparan berdasarkan jenis buku yang telah diverifikasi dan disetujui oleh administrator LPPM.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-semibold tracking-wide">
                    Sesuai Kebijakan KPI Terbaru
                  </span>
                </div>
              </div>
            </div>

            {/* Buku Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/80 dark:border-slate-700/80">
                  <Book className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Buku Akademik
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Poin penerbitan buku dosen berdasarkan keputusan universitas
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-2.5 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Jenis Buku</th>
                      <th className="pb-2.5 font-semibold text-[10px] text-slate-500 uppercase tracking-wider text-right">Poin KPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {BUKU_CATEGORIES.map((cat) => (
                      <tr key={cat.value} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{cat.label}</span>
                            {cat.desc && <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">{cat.desc}</span>}
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100 text-sm">
                          {cat.points} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl">
              <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                  Catatan Penting
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
                  Dokumen yang masih berstatus <span className="font-semibold text-amber-700 dark:text-amber-400">Pending</span>, <span className="font-semibold text-red-600 dark:text-red-400">Ditolak</span>, atau kategori <span className="font-semibold text-slate-700 dark:text-slate-300">Arsip Umum</span> tidak akan dihitung dalam total KPI.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

