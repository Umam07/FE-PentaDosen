import React from 'react';
import { ShieldCheck, Book, Beaker, Info } from 'lucide-react';

export default function MetricsGuide() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl">
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
            <span className="inline-flex items-center px-3 py-1 bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-xs font-semibold">
              Sesuai Kebijakan KPI
            </span>
          </div>
        </div>
      </div>

      {/* Grid: HKI & Buku */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HKI Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700/60">
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
                <tr className="border-b border-slate-200/80 dark:border-slate-800">
                  <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400">Jenis HKI</th>
                  <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400 text-center">Batasan Maksimal</th>
                  <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400 text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 font-medium">HKI Paten</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">40</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Paten Sederhana</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">28</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Merek</td>
                  <td className="py-2.5 text-center text-slate-400 dark:text-slate-500">-</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">12</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">HKI Hak Cipta</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-medium">
                      Maks 2 / Tahun
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Buku Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700/60">
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
                <tr className="border-b border-slate-200/80 dark:border-slate-800">
                  <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400">Jenis Buku</th>
                  <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400 text-right">Poin KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 font-medium">Buku Referensi</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">40</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Buku Ajar</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">20</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Buku Monograf</td>
                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Penelitian & Hibah Card — full width */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700/60">
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
              <tr className="border-b border-slate-200/80 dark:border-slate-800">
                <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400">Program Penelitian</th>
                <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400 text-center">Rupiah Poin</th>
                <th className="pb-2.5 font-semibold text-xs text-slate-600 dark:text-slate-400 text-right">Poin KPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-medium">Penelitian Hibah Luar Negeri</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 font-mono tabular-nums">0</td>
                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">10</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Penelitian Hibah Eksternal (Dikti)</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 font-mono tabular-nums">0</td>
                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">6</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Penelitian Internal Institusi</td>
                <td className="py-2.5 text-center text-slate-400 dark:text-slate-500 font-mono tabular-nums">0</td>
                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-slate-900 dark:text-white">3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3.5 p-4 sm:p-5 bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 rounded-2xl">
        <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-sky-950 dark:text-sky-300">
            Catatan Penting
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
            Dokumen yang masih berstatus <span className="font-semibold text-amber-700 dark:text-amber-400">Pending</span> atau <span className="font-semibold text-rose-600 dark:text-rose-400">Rejected</span> tidak akan dihitung dalam total KPI.
          </p>
        </div>
      </div>
    </div>
  );
}

