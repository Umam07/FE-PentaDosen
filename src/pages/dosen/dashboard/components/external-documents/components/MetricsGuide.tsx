import React from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen, Globe, Zap } from 'lucide-react';

export default function MetricsGuide() {
  return (
    <motion.div
      key="metriks"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-[2rem] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Panduan Metriks Penilaian KPI (SINTA & Institusi)</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Sistem menghitung poin secara otomatis dari publikasi terindeks Scopus & Google Scholar, serta dokumen internal (HKI, Buku, dan Penelitian) yang telah disetujui.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest block text-center shadow-md shadow-primary-500/20">
              Sesuai Kebijakan KPI Terbaru
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
      </div>

      {/* Grid 1: Scopus */}
      <div className="grid grid-cols-1 gap-8">
        {/* Card 1: Scopus Article - New Matrix Structure */}
        <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
              <Book className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Matriks Penilaian KPI Publikasi</h4>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Sistem distribusi poin berdasarkan peran dan koresponden penulis</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Section 1: Single Author */}
            <div className="bg-gradient-to-r from-violet-50/50 to-white dark:from-violet-950/10 dark:to-slate-950 rounded-2xl border border-violet-100 dark:border-violet-900/30 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-8 bg-violet-500 rounded-full"></div>
                <h5 className="text-sm font-black text-violet-700 dark:text-violet-400 uppercase tracking-wider">Single Author</h5>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-violet-200 dark:border-violet-800/50">
                      <th className="pb-3 pl-2 pr-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                      <th className="pb-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Base SKS</th>
                      <th className="pb-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Jumlah Penulis</th>
                      <th className="pb-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                      <th className="pb-3 pr-2 pl-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <tr className="bg-violet-100/50 dark:bg-violet-900/10">
                      <td className="py-3 pl-2 pr-4">Semua</td>
                      <td className="py-3 px-4 text-right">100%</td>
                      <td className="py-3 px-4 text-center">1</td>
                      <td className="py-3 px-4 text-violet-700 dark:text-violet-400 font-black">Single Author</td>
                      <td className="py-3 pr-2 pl-4 text-right font-black text-violet-700 dark:text-violet-400">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Author = 2 */}
            <div className="bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-slate-950 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                <h5 className="text-sm font-black text-orange-700 dark:text-orange-400 uppercase tracking-wider">Jumlah Penulis = 2</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sub-Section 2a: First = Corresponding */}
                <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-orange-100 dark:border-orange-900/20">
                  <h6 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    First = Corresponding
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/50">
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First + Corresponding</td>
                          <td className="py-3 text-right font-black">60%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Member</td>
                          <td className="py-3 text-right font-black">40%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-Section 2b: First ≠ Corresponding */}
                <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
                  <h6 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    First ≠ Corresponding
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/50">
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First Author</td>
                          <td className="py-3 text-right font-black">50%</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-blue-700 dark:text-blue-400 font-bold">Member + Corresponding</td>
                          <td className="py-3 text-right font-black">50%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Author > 2 */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-slate-950 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                <h5 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Jumlah Penulis &gt; 2</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sub-Section 3a: First = Corresponding */}
                <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/20">
                  <h6 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    First = Corresponding
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/50">
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First + Corresponding</td>
                          <td className="py-3 font-black">60%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Member</td>
                          <td className="py-3 font-black">(40% / n-1)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-Section 3b: First ≠ Corresponding */}
                <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-purple-100 dark:border-purple-900/20">
                  <h6 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    First ≠ Corresponding
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/50">
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                          <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First Author</td>
                          <td className="py-3 font-black">40%</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-blue-700 dark:text-blue-400 font-bold">Member + Corresponding</td>
                          <td className="py-3 font-black">40%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Member</td>
                          <td className="py-3 font-black">(20% / n-2)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Fallback */}
            <div className="bg-gradient-to-r from-red-50/50 to-white dark:from-red-950/10 dark:to-slate-950 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                <h5 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Fallback (Corresponding Tidak Ditemukan)</h5>
              </div>
              <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800/50">
                        <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                        <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <tr className="bg-red-50/60 dark:bg-red-900/10">
                        <td className="py-3 text-red-700 dark:text-red-400 font-black">First Author</td>
                        <td className="py-3 font-black text-red-700 dark:text-red-400">60%</td>
                      </tr>
                      <tr className="bg-red-50/60 dark:bg-red-900/10">
                        <td className="py-3 text-red-700 dark:text-red-400">Member</td>
                        <td className="py-3 font-black text-red-700 dark:text-red-400">(40% / n-1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Scopus Non-Article & Citations */}
        <div className="space-y-6">
          {/* Non-Article Card */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Scopus Non-Article</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proceeding, Review, Book Chapter, dll.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Kategori Peran</th>
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3">Single Author</td>
                    <td className="py-3 text-right text-blue-600 font-black">30</td>
                  </tr>
                  <tr>
                    <td className="py-3">First Author (Penulis Utama)</td>
                    <td className="py-3 text-right text-blue-600 font-black">18</td>
                  </tr>
                  <tr>
                    <td className="py-3">Member Author (Anggota)</td>
                    <td className="py-3 text-right text-blue-600 font-black">12 ÷ n</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Citations Card */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Metriks Sitasi Scopus</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dampak ilmiah publikasi Scopus</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-600 text-[10px] font-black">1</div>
                <div>
                  <p className="text-xs font-black text-emerald-800 dark:text-emerald-400">Poin Sitasi Terbagi</p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Setiap sitasi bernilai 1 poin dan dibagi secara proporsional dengan jumlah penulis. (Poin = Citasi / Penulis)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-start gap-3">
                <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-purple-600 text-[10px] font-black">2</div>
                <div>
                  <p className="text-xs font-black text-purple-800 dark:text-purple-400">Bonus Dokumen Tersitasi</p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dokumen yang memiliki minimal 1 sitasi mendapatkan tambahan bonus flat sebesar **+5 Poin**.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Scholar Card */}
      <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Google Scholar (GS)</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Matriks Penyelarasan Publikasi Google Scholar</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Poin Per Dokumen Scholar (GS Document)</span>
            <span className="text-blue-600 font-black">0.5 Pts</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Bonus Dokumen Tersitasi (Citations &gt; 0)</span>
            <span className="text-blue-600 font-black">0.5 Pts</span>
          </div>
          <div className="flex justify-between items-center pb-2 text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Poin Per Sitasi (GS Citation)</span>
            <span className="text-blue-600 font-black">0.25 Pts</span>
          </div>
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Ketentuan Batas Maksimal (Cut Off)</p>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Penghitungan poin dari jumlah sitasi dibatasi maksimal (cut-off) pada **500 sitasi** per dokumen publikasi.
            </p>
            <div className="mt-2.5 inline-block px-3 py-1.5 bg-blue-600/10 rounded-xl text-[9px] font-black text-blue-700 dark:text-blue-400">
              Poin = 0.5 + (Citations &gt; 0 ? 0.5 : 0) + (Min(Citations, 500) * 0.25)
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
