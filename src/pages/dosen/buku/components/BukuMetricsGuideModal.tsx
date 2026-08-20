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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-hairline-light dark:border-hairline-dark flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between bg-surface-light-raised/50 dark:bg-surface-dark shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-body dark:text-on-dark-soft">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Panduan Metriks Penilaian KPI
                </h3>
                <p className="text-xs text-muted dark:text-on-dark-muted">
                  Sistem kalkulasi dan pembobotan poin penerbitan buku akademik dosen
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panduan metriks"
              className="p-2 rounded-xl text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-surface-light-raised/60 dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">
                    Skema Kalkulasi Otomatis KPI Buku Akademik
                  </h4>
                  <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
                    Poin dihitung secara transparan berdasarkan jenis buku yang telah diverifikasi dan disetujui oleh administrator LPPM.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-3 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body-strong dark:text-on-dark rounded-xl text-[11px] font-semibold tracking-wide">
                    Sesuai Kebijakan KPI Terbaru
                  </span>
                </div>
              </div>
            </div>

            {/* Buku Card */}
            <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                  <Book className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                    Buku Akademik
                  </h4>
                  <p className="text-xs text-muted dark:text-on-dark-muted">
                    Poin penerbitan buku dosen berdasarkan keputusan universitas
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-hairline-light-soft dark:border-hairline-dark-soft">
                      <th className="pb-2.5 font-semibold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Jenis Buku</th>
                      <th className="pb-2.5 font-semibold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Poin KPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                    {BUKU_CATEGORIES.map((cat) => (
                      <tr key={cat.value} className="hover:bg-surface-light-raised/50 dark:hover:bg-surface-dark-elevated/40 transition-colors">
                        <td className="py-2.5 font-semibold text-ink-heading dark:text-on-dark">
                          <div>
                            <span>{cat.label}</span>
                            {cat.desc && <span className="block text-[11px] font-normal text-muted dark:text-on-dark-muted mt-0.5">{cat.desc}</span>}
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark text-sm">
                          {cat.points} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl">
              <div className="w-6 h-6 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark tracking-wider">
                  Catatan Penting
                </p>
                <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
                  Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
                  Dokumen yang masih berstatus <span className="font-semibold text-warning dark:text-warning-on-dark">Pending</span>, <span className="font-semibold text-error dark:text-error-on-dark">Ditolak</span>, atau kategori <span className="font-semibold text-body-strong dark:text-on-dark">Arsip Umum</span> tidak akan dihitung dalam total KPI.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
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


