import React from 'react';
import { ShieldCheck, Book, Beaker, Info } from 'lucide-react';

export default function MetricsGuide() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Panduan Metriks Penilaian KPI (Dokumen Internal)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Poin dihitung otomatis berdasarkan kategori dokumen yang telah disetujui — HKI, Buku Akademik, dan Penelitian &amp; Hibah.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/60 text-primary-700 dark:text-primary-300 rounded-xl text-[11px] font-bold tracking-wide">
              Sesuai Kebijakan KPI Terbaru
            </span>
          </div>
        </div>
      </div>

      {/* Grid: HKI & Buku */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HKI Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-200/60 dark:border-purple-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Hak Kekayaan Intelektual (HKI)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Poin HKI berdasarkan keputusan universitas</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Jenis HKI</th>
                  <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Batasan Maksimal</th>
                  <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 font-medium">HKI Paten</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-purple-600 dark:text-purple-400">40</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Paten Sederhana</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-purple-600 dark:text-purple-400">28</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Merek</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-purple-600 dark:text-purple-400">12</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Hak Cipta</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-[10px] font-bold">
                      Maks 2 / Tahun
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-black tabular-nums text-purple-600 dark:text-purple-400">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Buku Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-800/60">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Buku Akademik
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Poin penerbitan buku dosen</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Jenis Buku</th>
                  <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 font-medium">Buku Referensi</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-amber-600 dark:text-amber-400">40</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Buku Ajar</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-amber-600 dark:text-amber-400">20</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Buku Monograf</td>
                  <td className="py-2.5 text-right font-black tabular-nums text-amber-600 dark:text-amber-400">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Penelitian & Hibah Card — full width */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
            <Beaker className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Penelitian &amp; Hibah
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Poin pendanaan hibah penelitian yang disetujui</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Program Penelitian</th>
                <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Rupiah Poin</th>
                <th className="pb-2.5 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Poin KPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-medium">Penelitian Hibah Luar Negeri</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 tabular-nums">0</td>
                <td className="py-2.5 text-right font-black tabular-nums text-emerald-600 dark:text-emerald-400">10</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Penelitian Hibah Eksternal (Dikti)</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 tabular-nums">0</td>
                <td className="py-2.5 text-right font-black tabular-nums text-emerald-600 dark:text-emerald-400">6</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Penelitian Internal Institusi</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 tabular-nums">0</td>
                <td className="py-2.5 text-right font-black tabular-nums text-emerald-600 dark:text-emerald-400">3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3.5 p-4 sm:p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl">
        <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-950 dark:text-blue-300 uppercase tracking-wider">
            Catatan Penting
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
            Dokumen yang masih berstatus <span className="font-bold text-amber-700 dark:text-amber-400">pending</span> atau <span className="font-bold text-red-600 dark:text-red-400">ditolak</span> tidak akan dihitung dalam total KPI.
          </p>
        </div>
      </div>
    </div>
  );
}
