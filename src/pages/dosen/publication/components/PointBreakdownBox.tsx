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
        className="mt-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden w-full max-w-xl"
      >
        <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/30">
          <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            RINCIAN PERHITUNGAN POIN (SINTA GS)
          </p>
        </div>
        <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen GS</p>
              <p className="text-[9px] font-medium text-slate-400">Poin flat per publikasi Google Scholar</p>
            </div>
            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">+0.50</span>
          </div>

          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen Tersitasi</p>
              <p className="text-[9px] font-medium text-slate-400">Poin tambahan flat jika sitasi &gt; 0</p>
            </div>
            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
              +{(bd.citationBonus || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                Sitasi (×{Math.min(bd.citations || 0, 500)} × 0.25)
                {(bd.citations || 0) > 500 && ' (Cut-off 500)'}
              </p>
              <p className="text-[9px] font-medium text-slate-400">Nilai bobot per sitasi yang didapat</p>
            </div>
            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
              +{(bd.citationPoints || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">TOTAL POIN</span>
            <span className="text-base font-black text-blue-600">{bd.totalPoints} pts</span>
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
      className="mt-3 rounded-2xl border border-primary-100 dark:border-primary-900/30 overflow-hidden w-full max-w-xl"
    >
      <div className="px-4 py-2.5 bg-primary-50 dark:bg-primary-950/30 border-b border-primary-100 dark:border-primary-900/30">
        <p className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
          RINCIAN KALKULASI POIN SINTA (SKEMA PERSENTASE + QUARTILE)
        </p>
      </div>
      <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
        {isCrossIndexed && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              🔗 Irisan Publikasi Scopus & Google Scholar
            </span>
            <span className="font-black text-[8px] bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
              Skema Scopus Digunakan (No Double-Count)
            </span>
          </div>
        )}

        {/* Kontrol Individual Status Korespondensi (Dalam Detail Rincian Poin) */}
        {showCorrespondingControls && (
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold text-slate-700 dark:text-zinc-300 mb-2">
            <div className="flex items-center gap-2">
              <span>Status Korespondensi:</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                !doc.is_corresponding_confirmed
                  ? 'bg-orange-500 text-white dark:bg-orange-600'
                  : doc.is_corresponding
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {!doc.is_corresponding_confirmed ? '⚠️ Belum Dikonfirmasi' : doc.is_corresponding ? '✓ YA (Corresponding)' : 'TIDAK'}
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
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                  doc.is_corresponding_confirmed && doc.is_corresponding
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
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
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                  doc.is_corresponding_confirmed && !doc.is_corresponding
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                }`}
              >
                Set TIDAK
              </button>
              {updatingCorrespondingId === doc.id && (
                <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            QUARTILE JURNAL:
          </span>
          {bd.q && bd.q !== 'None' ? (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
              bd.q === 'Q1' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              bd.q === 'Q2' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
              bd.q === 'Q3' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>{bd.q}</span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Tidak terdeteksi</span>
          )}
        </div>

        <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Poin Maks {bd.q && bd.q !== 'None' ? bd.q : (isJI ? 'Tanpa Quartile' : 'Jurnal Nasional')}</p>
            <p className="text-[9px] font-medium text-slate-400">{isJI ? 'Q1=40, Q2=38, Q3=35, Q4/None=33 pts' : 'S1/S2=25, S3/S4=20, S5/S6=15, Non-SINTA=10 pts'}</p>
          </div>
          <span className="text-[11px] font-black text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
        </div>

        <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{bd.detailStr}</p>
            <p className="text-[9px] font-bold text-primary-600 dark:text-primary-400">{bd.pctStr}</p>
          </div>
          <span className="text-[11px] font-black text-primary-600 dark:text-primary-400 flex-shrink-0">+{bd.totalPoints}</span>
        </div>

        {bd.totalAuthors > 1 && (
          <div className="flex justify-between items-center py-1 gap-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[9px] font-medium text-slate-400">Total penulis terdeteksi</p>
            <span className="text-[9px] font-black text-slate-500">{bd.totalAuthors} penulis</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {doc.status === 'Pending' ? 'ESTIMASI TOTAL POIN' : 'TOTAL POIN'}
            </span>
            {doc.status === 'Pending' && (
              <p className="text-[8px] font-bold text-amber-600 dark:text-amber-400">
                ⚠️ Poin aktif +0 pts hingga disetujui Fakultas
              </p>
            )}
          </div>
          <span className="text-base font-black text-primary-600 dark:text-primary-400">{bd.totalPoints} pts</span>
        </div>
      </div>
    </motion.div>
  );
}
