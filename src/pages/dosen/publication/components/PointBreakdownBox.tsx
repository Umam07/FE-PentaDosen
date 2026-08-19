import React from 'react';
import { motion } from 'framer-motion';

export interface PointBreakdownBoxProps {
  doc: any;
  bd: any;
  isCrossIndexed?: boolean;
  showCorrespondingControls?: boolean;
  updatingCorrespondingId?: string | number | null;
  handleToggleCorresponding?: (id: number | string, isCorr: boolean) => Promise<void>;
  setUpdatingCorrespondingId?: (id: string | number | null) => void;
}

export default function PointBreakdownBox({
  doc,
  bd,
  isCrossIndexed = false,
  showCorrespondingControls = false,
  updatingCorrespondingId = null,
  handleToggleCorresponding,
  setUpdatingCorrespondingId,
}: PointBreakdownBoxProps) {
  if (!bd) return null;

  if (bd.type === 'scholar') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xs"
      >
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            Rincian Perhitungan Poin (Google Scholar)
          </p>
        </div>
        <div className="p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-start py-1 border-b border-slate-100 dark:border-slate-800/80 gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Dokumen GS</p>
              <p className="text-[11px] text-slate-500">Poin flat per publikasi Google Scholar</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex-shrink-0">+0.50</span>
          </div>

          <div className="flex justify-between items-start py-1 border-b border-slate-100 dark:border-slate-800/80 gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Dokumen Tersitasi</p>
              <p className="text-[11px] text-slate-500">Poin tambahan flat jika sitasi &gt; 0</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex-shrink-0">
              +{(bd.citationBonus || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-start py-1 border-b border-slate-100 dark:border-slate-800/80 gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Sitasi (×{Math.min(bd.citations || 0, 500)} × 0.25)
                {(bd.citations || 0) > 500 && ' (Cut-off 500)'}
              </p>
              <p className="text-[11px] text-slate-500">Nilai bobot per sitasi yang didapat</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex-shrink-0">
              +{(bd.citationPoints || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Total Poin</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{bd.totalPoints} Pts</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const isJI = doc.category === 'Jurnal Internasional' || doc.source === 'scopus';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xs"
    >
      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
        <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
          Rincian Kalkulasi Poin SINTA (Skema Persentase + Quartile)
        </p>
      </div>
      <div className="p-3.5 space-y-2 text-xs">
        {isCrossIndexed && (
          <div className="p-2.5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-teal-700 dark:text-teal-300 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              Irisan Publikasi Scopus & Google Scholar
            </span>
            <span className="text-[10px] bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 rounded-md">
              Skema Scopus Digunakan
            </span>
          </div>
        )}

        {/* Kontrol Individual Status Korespondensi (Dalam Detail Rincian Poin) */}
        {showCorrespondingControls && (
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <span>Status Korespondensi:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                !doc.is_corresponding_confirmed
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40'
                  : doc.is_corresponding
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
              }`}>
                {!doc.is_corresponding_confirmed ? 'Belum Dikonfirmasi' : doc.is_corresponding ? '✓ Corresponding' : 'Non-Corresponding'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                disabled={updatingCorrespondingId === doc.id}
                onClick={async () => {
                  if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(doc.id);
                  if (handleToggleCorresponding) await handleToggleCorresponding(doc.id, true);
                  if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(null);
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  doc.is_corresponding_confirmed && doc.is_corresponding
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Set YA
              </button>
              <button
                type="button"
                disabled={updatingCorrespondingId === doc.id}
                onClick={async () => {
                  if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(doc.id);
                  if (handleToggleCorresponding) await handleToggleCorresponding(doc.id, false);
                  if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(null);
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  doc.is_corresponding_confirmed && !doc.is_corresponding
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Set TIDAK
              </button>
              {updatingCorrespondingId === doc.id && (
                <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Quartile Jurnal:
          </span>
          {bd.q && bd.q !== 'None' ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              {bd.q}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Tidak terdeteksi
            </span>
          )}
        </div>

        <div className="flex justify-between items-start py-1 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Poin Maks {bd.q && bd.q !== 'None' ? bd.q : (isJI ? 'Tanpa Quartile' : 'Jurnal Nasional')}</p>
            <p className="text-[11px] text-slate-500">{isJI ? 'Q1=40, Q2=38, Q3=35, Q4/None=33 pts' : 'S1/S2=25, S3/S4=20, S5/S6=15, Non-SINTA=10 pts'}</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
        </div>

        <div className="flex justify-between items-start py-1 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{bd.detailStr}</p>
            <p className="text-[11px] text-slate-500">{bd.pctStr}</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex-shrink-0">+{bd.totalPoints}</span>
        </div>

        {bd.totalAuthors > 1 && (
          <div className="flex justify-between items-center py-1 gap-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">Total penulis terdeteksi</p>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{bd.totalAuthors} penulis</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {doc.status === 'Pending' ? 'Estimasi Total Poin' : 'Total Poin'}
            </span>
            {doc.status === 'Pending' && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                Poin aktif +0 pts hingga disetujui Fakultas
              </p>
            )}
          </div>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{bd.totalPoints} Pts</span>
        </div>
      </div>
    </motion.div>
  );
}

