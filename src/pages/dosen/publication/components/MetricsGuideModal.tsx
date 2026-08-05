import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, BookOpen, Globe, Zap, BarChart2, Info } from 'lucide-react';

interface MetricsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string; // 'Jurnal Internasional' | 'Jurnal Nasional' | string
}

export default function MetricsGuideModal({ isOpen, onClose, category }: MetricsGuideModalProps) {
  if (!isOpen) return null;

  const isInternational = category === 'Jurnal Internasional';
  const isNational = category === 'Jurnal Nasional';

  // Determine what sections to show:
  // If International -> Scopus only
  // If National -> Google Scholar (GS) only
  // Otherwise -> All
  const showScopus = isInternational || (!isInternational && !isNational);
  const showScholar = isNational || (!isInternational && !isNational);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-zinc-800 flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Panduan Metriks Penilaian KPI
                </h3>
                <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
                  {isInternational
                    ? 'Metriks Khusus Scopus (Jurnal Internasional)'
                    : isNational
                    ? 'Metriks Khusus Google Scholar (Jurnal Nasional)'
                    : 'Metriks Publikasi Scopus & Google Scholar'}
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
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 custom-scrollbar">
            {/* Top Info Banner */}
            <div className="p-5 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 border border-slate-200 dark:border-zinc-800 rounded-3xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {isInternational
                        ? 'Skema Distribusi Poin Jurnal Internasional (Scopus)'
                        : isNational
                        ? 'Skema Distribusi Poin Jurnal Nasional (Google Scholar)'
                        : 'Skema Kalkulasi Otomatis KPI Publikasi'}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 mt-0.5">
                      Poin dihitung secara transparan menurut jumlah penulis, posisi urutan penulis, serta status konfirmasi penulis korespondensi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scopus Section */}
            {showScopus && (
              <div className="space-y-8">
                {/* Scopus Article Matrix */}
                <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                      <Book className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Matriks Penilaian KPI Scopus</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Distribusi poin berdasarkan skenario peran & korespondensi</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Section 1: Single Author */}
                    <div className="bg-gradient-to-r from-violet-50/50 to-white dark:from-violet-950/10 dark:to-zinc-900 rounded-2xl border border-violet-100 dark:border-violet-900/30 p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1.5 h-6 bg-violet-500 rounded-full"></div>
                        <h5 className="text-xs font-black text-violet-700 dark:text-violet-400 uppercase tracking-wider">Single Author</h5>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-violet-200 dark:border-violet-800/50">
                              <th className="pb-2.5 pl-2 pr-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                              <th className="pb-2.5 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Base SKS</th>
                              <th className="pb-2.5 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Jumlah Penulis</th>
                              <th className="pb-2.5 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                              <th className="pb-2.5 pr-2 pl-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            <tr className="bg-violet-100/50 dark:bg-violet-900/10">
                              <td className="py-2.5 pl-2 pr-4">Semua Quartile</td>
                              <td className="py-2.5 px-4 text-right">100%</td>
                              <td className="py-2.5 px-4 text-center">1</td>
                              <td className="py-2.5 px-4 text-violet-700 dark:text-violet-400 font-black">Single Author</td>
                              <td className="py-2.5 pr-2 pl-4 text-right font-black text-violet-700 dark:text-violet-400">100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 2: Author = 2 */}
                    <div className="bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-zinc-900 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                        <h5 className="text-xs font-black text-orange-700 dark:text-orange-400 uppercase tracking-wider">Jumlah Penulis = 2</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-orange-100 dark:border-orange-900/20">
                          <h6 className="text-[11px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            First = Corresponding
                          </h6>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800">
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase">Role</th>
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                              <tr>
                                <td className="py-2 text-orange-600 font-bold">First + Corresponding</td>
                                <td className="py-2 text-right font-black">60%</td>
                              </tr>
                              <tr>
                                <td className="py-2">Member</td>
                                <td className="py-2 text-right font-black">40%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-blue-100 dark:border-blue-900/20">
                          <h6 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            First ≠ Corresponding
                          </h6>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800">
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase">Role</th>
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                              <tr>
                                <td className="py-2 text-orange-600 font-bold">First Author</td>
                                <td className="py-2 text-right font-black">50%</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-blue-600 font-bold">Member + Corresponding</td>
                                <td className="py-2 text-right font-black">50%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Author > 2 */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-zinc-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        <h5 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Jumlah Penulis &gt; 2</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/20">
                          <h6 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            First = Corresponding
                          </h6>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800">
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase">Role</th>
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                              <tr>
                                <td className="py-2 text-orange-600 font-bold">First + Corresponding</td>
                                <td className="py-2 text-right font-black">60%</td>
                              </tr>
                              <tr>
                                <td className="py-2">Member</td>
                                <td className="py-2 text-right font-black">(40% / n-1)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-purple-100 dark:border-purple-900/20">
                          <h6 className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            First ≠ Corresponding
                          </h6>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800">
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase">Role</th>
                                <th className="pb-2 text-[9px] font-black text-slate-400 uppercase text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                              <tr>
                                <td className="py-2 text-orange-600 font-bold">First Author</td>
                                <td className="py-2 text-right font-black">40%</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-blue-600 font-bold">Member + Corresponding</td>
                                <td className="py-2 text-right font-black">40%</td>
                              </tr>
                              <tr>
                                <td className="py-2">Member</td>
                                <td className="py-2 text-right font-black">(20% / n-2)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scopus Non-Article & Sitasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Non-Article */}
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Scopus Non-Article</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Proceeding, Review, Chapter</p>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-800">
                          <th className="pb-2 text-[9px] font-black text-slate-400 uppercase">Peran</th>
                          <th className="pb-2 text-[9px] font-black text-slate-400 uppercase text-right">Poin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        <tr>
                          <td className="py-2">Single Author</td>
                          <td className="py-2 text-right text-blue-600 font-black">30 pts</td>
                        </tr>
                        <tr>
                          <td className="py-2">First Author</td>
                          <td className="py-2 text-right text-blue-600 font-black">18 pts</td>
                        </tr>
                        <tr>
                          <td className="py-2">Member Author</td>
                          <td className="py-2 text-right text-blue-600 font-black">12 ÷ n pts</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Sitasi Scopus */}
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <Zap className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Metriks Sitasi Scopus</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Dampak ilmiah publikasi</p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-2.5">
                      <span className="text-[10px] font-black text-emerald-600">1.</span>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                        Sitasi Terbagi: Sitasi ÷ Jumlah Penulis (+1 Pts / Sitasi Terbagi).
                      </p>
                    </div>

                    <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-start gap-2.5">
                      <span className="text-[10px] font-black text-purple-600">2.</span>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                        Bonus Dokumen Tersitasi: Minimal 1 sitasi mendapat bonus flat <strong className="text-purple-600">+5 Poin</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Google Scholar & Jurnal Nasional Section */}
            {showScholar && (
              <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Jurnal Nasional & SINTA</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Matriks Base Points SINTA & Penyelarasan Google Scholar</p>
                  </div>
                </div>

                {/* Table SINTA Base Points */}
                <div className="bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-zinc-900 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-5">
                  <h5 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">Acuan Base Points SINTA (POAK)</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[9px] font-black text-slate-400 uppercase">SINTA 1 & 2</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">25 pts</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[9px] font-black text-slate-400 uppercase">SINTA 3 & 4</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">20 pts</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[9px] font-black text-slate-400 uppercase">SINTA 5 & 6</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">15 pts</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Non-SINTA</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">10 pts</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2.5 text-xs font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Poin Per Dokumen Scholar (GS Sync Document)</span>
                    <span className="text-blue-600 font-black">0.5 Pts</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2.5 text-xs font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Bonus Dokumen Tersitasi (Citations &gt; 0)</span>
                    <span className="text-blue-600 font-black">0.5 Pts</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 text-xs font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Poin Per Sitasi (GS Citation)</span>
                    <span className="text-blue-600 font-black">0.25 Pts</span>
                  </div>

                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Ketentuan Batas Maksimal (Cut Off)</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Penghitungan poin dari jumlah sitasi dibatasi maksimal (cut-off) pada <strong>500 sitasi</strong> per dokumen publikasi.
                    </p>
                    <div className="mt-2.5 inline-block px-3 py-1.5 bg-blue-600/10 rounded-xl text-[9px] font-black text-blue-700 dark:text-blue-400">
                      Poin GS = 0.5 + (Citations &gt; 0 ? 0.5 : 0) + (Min(Citations, 500) * 0.25)
                    </div>
                  </div>
                </div>
              </div>
            )}
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
