import React from 'react';
import { ShieldCheck, Book, Beaker } from 'lucide-react';

export default function MetricsGuide() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-[2rem] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Panduan Metriks Penilaian KPI (Dokumen Internal)</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Poin dihitung otomatis berdasarkan kategori dokumen yang telah disetujui — HKI, Buku Akademik, dan Penelitian & Hibah.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest block text-center shadow-md shadow-primary-500/20">
              Sesuai Kebijakan KPI Terbaru
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
      </div>

      {/* Grid: HKI & Buku */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HKI Card */}
        <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Hak Kekayaan Intelektual (HKI)</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin HKI berdasarkan keputusan universitas</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis HKI</th>
                  <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Batasan Maksimal</th>
                  <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5">HKI Paten</td>
                  <td className="py-2.5 text-center text-slate-400">-</td>
                  <td className="py-2.5 text-right text-purple-600 font-black">40</td>
                </tr>
                <tr>
                  <td className="py-2.5">HKI Paten Sederhana</td>
                  <td className="py-2.5 text-center text-slate-400">-</td>
                  <td className="py-2.5 text-right text-purple-600 font-black">28</td>
                </tr>
                <tr>
                  <td className="py-2.5">HKI Merek</td>
                  <td className="py-2.5 text-center text-slate-400">-</td>
                  <td className="py-2.5 text-right text-purple-600 font-black">12</td>
                </tr>
                <tr>
                  <td className="py-2.5">HKI Hak Cipta</td>
                  <td className="py-2.5 text-center text-red-500 font-black">Maks 2 / Tahun</td>
                  <td className="py-2.5 text-right text-purple-600 font-black">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Buku Card */}
        <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-inner">
              <Book className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Buku Akademik</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin penerbitan buku dosen</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Buku</th>
                  <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3">Buku Referensi</td>
                  <td className="py-3 text-right text-amber-600 font-black">40</td>
                </tr>
                <tr>
                  <td className="py-3">Buku Ajar</td>
                  <td className="py-3 text-right text-amber-600 font-black">20</td>
                </tr>
                <tr>
                  <td className="py-3">Buku Monograf</td>
                  <td className="py-3 text-right text-amber-600 font-black">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Penelitian & Hibah Card — full width */}
      <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <Beaker className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Penelitian &amp; Hibah</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin pendanaan hibah penelitian yang disetujui</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Program Penelitian</th>
                <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Rupiah Poin</th>
                <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5">Penelitian Hibah Luar Negeri</td>
                <td className="py-2.5 text-center text-slate-400">0</td>
                <td className="py-2.5 text-right text-emerald-600 font-black">10</td>
              </tr>
              <tr>
                <td className="py-2.5">Penelitian Hibah Eksternal (Dikti)</td>
                <td className="py-2.5 text-center text-slate-400">0</td>
                <td className="py-2.5 text-right text-emerald-600 font-black">6</td>
              </tr>
              <tr>
                <td className="py-2.5">Penelitian Internal Institusi</td>
                <td className="py-2.5 text-center text-slate-400">0</td>
                <td className="py-2.5 text-right text-emerald-600 font-black">3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black">i</span>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Catatan Penting</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
            Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
            Dokumen yang masih berstatus <span className="font-black text-amber-500">pending</span> atau <span className="font-black text-red-500">ditolak</span> tidak akan dihitung dalam total KPI.
          </p>
        </div>
      </div>
    </div>
  );
}
