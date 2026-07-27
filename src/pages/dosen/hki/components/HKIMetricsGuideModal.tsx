import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, BarChart2, Info } from 'lucide-react';

interface HKIMetricsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HKIMetricsGuideModal({ isOpen, onClose }: HKIMetricsGuideModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-zinc-800 flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Panduan Metriks Penilaian KPI HKI
                </h3>
                <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
                  Metriks Hak Kekayaan Intelektual (Dokumen Internal)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
            {/* Top Info Banner */}
            <div className="p-5 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-200 dark:border-zinc-800 rounded-3xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Skema Kalkulasi Otomatis KPI Hak Kekayaan Intelektual
                    </h4>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Poin dihitung secara otomatis berdasarkan jenis HKI yang terdaftar dan telah disetujui oleh administrator LPPM.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HKI Matrix Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Hak Kekayaan Intelektual (HKI)
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Poin HKI berdasarkan keputusan universitas
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800">
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis HKI</th>
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Batasan Maksimal</th>
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3">HKI Paten</td>
                      <td className="py-3 text-center text-slate-400 font-semibold">-</td>
                      <td className="py-3 text-right text-purple-600 dark:text-purple-400 font-black text-sm">40</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3">HKI Paten Sederhana</td>
                      <td className="py-3 text-center text-slate-400 font-semibold">-</td>
                      <td className="py-3 text-right text-purple-600 dark:text-purple-400 font-black text-sm">28</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3">HKI Merek</td>
                      <td className="py-3 text-center text-slate-400 font-semibold">-</td>
                      <td className="py-3 text-right text-purple-600 dark:text-purple-400 font-black text-sm">12</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3">HKI Hak Cipta</td>
                      <td className="py-3 text-center text-red-500 dark:text-red-400 font-black">Maks 2 / Tahun</td>
                      <td className="py-3 text-right text-purple-600 dark:text-purple-400 font-black text-sm">5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-slate-500 dark:text-zinc-400 text-[10px] font-black">i</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 dark:text-zinc-300 uppercase tracking-widest">Catatan Penting</p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
                  Dokumen yang masih berstatus <span className="font-black text-amber-500">Pending</span>, <span className="font-black text-red-500">Ditolak</span>, atau kategori <span className="font-black text-slate-600 dark:text-zinc-300">Arsip Umum</span> tidak akan dihitung dalam total KPI.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
