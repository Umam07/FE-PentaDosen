import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, BookOpen, Globe, Zap, BarChart2, AlertCircle } from 'lucide-react';

interface MetricsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string; // 'Jurnal Internasional' | 'Jurnal Nasional' | string
}

type TabType = 'all' | 'scopus' | 'scholar';

export default function MetricsGuideModal({ isOpen, onClose, category }: MetricsGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    if (category) {
      const lower = category.toLowerCase();
      if (lower.includes('internasional')) {
        setActiveTab('scopus');
      } else if (lower.includes('nasional')) {
        setActiveTab('scholar');
      } else {
        setActiveTab('all');
      }
    } else {
      setActiveTab('all');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const showScopus = activeTab === 'all' || activeTab === 'scopus';
  const showScholar = activeTab === 'all' || activeTab === 'scholar';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <BarChart2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Panduan Metriks Penilaian KPI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sistem kalkulasi dan pembobotan poin publikasi ilmiah (SINTA &amp; Scopus)
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

          {/* Filter Sub-Tabs */}
          <div className="px-6 pt-3 pb-0 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Metriks' },
              { id: 'scopus', label: 'Scopus (Jurnal Internasional)' },
              { id: 'scholar', label: 'SINTA & Scholar (Jurnal Nasional)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Skema Kalkulasi Otomatis KPI Publikasi
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poin dihitung secara transparan menurut jumlah penulis, urutan peran, akreditasi/quartile, serta status konfirmasi penulis korespondensi.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold">
                    Sesuai Kebijakan KPI Terbaru
                  </span>
                </div>
              </div>
            </div>

            {/* Scopus Section */}
            {showScopus && (
              <div className="space-y-6">
                {/* Scopus Article Matrix */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                      <Book className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Matriks Penilaian KPI Scopus (Article)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sistem distribusi persentase poin berdasarkan peran dan koresponden penulis
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Subsection 1: Single Author */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          1
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Single Author
                        </h5>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                              <th className="pb-2.5 font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                              <th className="pb-2.5 px-3 font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Base SKS</th>
                              <th className="pb-2.5 px-3 font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Jumlah Penulis</th>
                              <th className="pb-2.5 px-3 font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                              <th className="pb-2.5 font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Persentase</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                            <tr>
                              <td className="py-2.5 font-medium">Semua Quartile</td>
                              <td className="py-2.5 px-3 text-right tabular-nums">100%</td>
                              <td className="py-2.5 px-3 text-center tabular-nums">1</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Single Author</td>
                              <td className="py-2.5 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Subsection 2: Author = 2 */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          2
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Jumlah Penulis = 2
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sub-Section 2a: First = Corresponding */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 space-y-2">
                          <h6 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              2a
                            </span>
                            First = Corresponding
                          </h6>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Persentase</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">First + Corresponding</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">60%</td>
                                </tr>
                                <tr>
                                  <td className="py-2 font-normal text-slate-600 dark:text-slate-400">Member</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">40%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Sub-Section 2b: First ≠ Corresponding */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 space-y-2">
                          <h6 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              2b
                            </span>
                            First ≠ Corresponding
                          </h6>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Persentase</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">First Author</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">50%</td>
                                </tr>
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">Member + Corresponding</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">50%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subsection 3: Author > 2 */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          3
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Jumlah Penulis &gt; 2
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sub-Section 3a: First = Corresponding */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 space-y-2">
                          <h6 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              3a
                            </span>
                            First = Corresponding
                          </h6>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Persentase</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">First + Corresponding</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">60%</td>
                                </tr>
                                <tr>
                                  <td className="py-2 font-normal text-slate-600 dark:text-slate-400">Member</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">(40% / n-1)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Sub-Section 3b: First ≠ Corresponding */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 space-y-2">
                          <h6 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              3b
                            </span>
                            First ≠ Corresponding
                          </h6>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                                  <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Persentase</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">First Author</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">40%</td>
                                </tr>
                                <tr>
                                  <td className="py-2 font-semibold text-slate-900 dark:text-white">Member + Corresponding</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">40%</td>
                                </tr>
                                <tr>
                                  <td className="py-2 font-normal text-slate-600 dark:text-slate-400">Member</td>
                                  <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">(20% / n-2)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subsection 4: Fallback */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          Fallback (Corresponding Belum Dikonfirmasi / Tidak Ditemukan)
                        </h5>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="pb-2 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                              <tr>
                                <td className="py-2 font-semibold text-slate-900 dark:text-white">First Author</td>
                                <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">60%</td>
                              </tr>
                              <tr>
                                <td className="py-2 font-normal text-slate-600 dark:text-slate-400">Member</td>
                                <td className="py-2 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">(40% / n-1)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scopus Non-Article & Citations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Non-Article Card */}
                  <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Scopus Non-Article</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Proceeding, Review, Book Chapter, dll.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kategori Peran</th>
                            <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Poin KPI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                          <tr>
                            <td className="py-2.5 font-medium">Single Author</td>
                            <td className="py-2.5 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">30</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-medium">First Author (Penulis Utama)</td>
                            <td className="py-2.5 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">18</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-medium">Member Author (Anggota)</td>
                            <td className="py-2.5 text-right font-bold tabular-nums text-primary-600 dark:text-primary-400">12 ÷ n</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Citations Card */}
                  <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Metriks Sitasi Scopus</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dampak ilmiah publikasi Scopus</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                            1
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white">Poin Sitasi Terbagi</p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                          Setiap sitasi bernilai 1 poin dan dibagi secara proporsional dengan jumlah penulis (Poin = Sitasi / Penulis).
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                            2
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white">Bonus Dokumen Tersitasi</p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                          Dokumen yang memiliki minimal 1 sitasi mendapatkan tambahan bonus flat sebesar <strong className="font-bold text-slate-900 dark:text-white">+5 Poin</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Google Scholar & SINTA Section */}
            {showScholar && (
              <div className="space-y-6">
                {/* SINTA Base Points Card */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Acuan Base Points SINTA (POAK)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Standar bobot dasar akreditasi Jurnal Nasional
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SINTA 1 &amp; 2</p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1 tabular-nums">25 pts</p>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SINTA 3 &amp; 4</p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1 tabular-nums">20 pts</p>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SINTA 5 &amp; 6</p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1 tabular-nums">15 pts</p>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Non-SINTA</p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1 tabular-nums">10 pts</p>
                    </div>
                  </div>
                </div>

                {/* Google Scholar Card */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Google Scholar (GS)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Matriks Penyelarasan Publikasi Google Scholar
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Poin Per Dokumen Scholar (GS Document)</span>
                        <span className="font-bold tabular-nums text-primary-600 dark:text-primary-400">0.5 Pts</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Bonus Dokumen Tersitasi (Citations &gt; 0)</span>
                        <span className="font-bold tabular-nums text-primary-600 dark:text-primary-400">0.5 Pts</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Poin Per Sitasi (GS Citation)</span>
                        <span className="font-bold tabular-nums text-primary-600 dark:text-primary-400">0.25 Pts</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Ketentuan Batas Maksimal (Cut Off)
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Penghitungan poin dari jumlah sitasi dibatasi maksimal (cut-off) pada <strong className="font-bold text-slate-900 dark:text-white">500 sitasi</strong> per dokumen publikasi.
                      </p>
                      <div className="pt-1">
                        <span className="inline-block px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200">
                          Poin = 0.5 + (Citations &gt; 0 ? 0.5 : 0) + (Min(Citations, 500) * 0.25)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
