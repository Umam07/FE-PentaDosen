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
        className="mt-2.5 rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden w-full max-w-xl bg-surface-light dark:bg-surface-dark shadow-2xs"
      >
        <div className="px-3.5 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <p className="text-[10px] font-semibold text-body-strong dark:text-on-dark">
            Rincian Perhitungan Poin (Google Scholar)
          </p>
        </div>
        <div className="p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-start py-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
            <div>
              <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Dokumen GS</p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">Poin flat per publikasi Google Scholar</p>
            </div>
            <span className="text-xs font-mono font-bold text-ink-heading dark:text-on-dark flex-shrink-0">+0.50</span>
          </div>

          <div className="flex justify-between items-start py-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
            <div>
              <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Dokumen Tersitasi</p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">Poin tambahan flat jika sitasi &gt; 0</p>
            </div>
            <span className="text-xs font-mono font-bold text-ink-heading dark:text-on-dark flex-shrink-0">
              +{(bd.citationBonus || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-start py-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
            <div>
              <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                Sitasi (×{Math.min(bd.citations || 0, 500)} × 0.25)
                {(bd.citations || 0) > 500 && ' (Cut-off 500)'}
              </p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">Nilai bobot per sitasi yang didapat</p>
            </div>
            <span className="text-xs font-mono font-bold text-ink-heading dark:text-on-dark flex-shrink-0">
              +{(bd.citationPoints || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-hairline-light dark:border-hairline-dark">
            <span className="text-xs font-bold text-ink-heading dark:text-on-dark">Total Poin</span>
            <span className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{bd.totalPoints} Pts</span>
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
      className="mt-2.5 rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden w-full max-w-xl bg-surface-light dark:bg-surface-dark shadow-2xs"
    >
      <div className="px-3.5 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
        <p className="text-[10px] font-semibold text-body-strong dark:text-on-dark">
          Rincian Kalkulasi Poin SINTA (Skema Persentase + Quartile)
        </p>
      </div>
      <div className="p-3.5 space-y-2 text-xs">
        {isCrossIndexed && (
          <div className="p-2.5 bg-success-soft dark:bg-success/15 border border-success-border dark:border-success/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-success-dark dark:text-success-on-dark mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              Irisan Publikasi Scopus &amp; Google Scholar
            </span>
            <span className="text-[10px] bg-success-soft dark:bg-success/20 px-2 py-0.5 rounded-md border border-success-border dark:border-success/30">
              Skema Scopus Digunakan
            </span>
          </div>
        )}

        {/* Kontrol Individual Status Korespondensi (Dalam Detail Rincian Poin) */}
        {showCorrespondingControls && (
          <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-body dark:text-on-dark-soft mb-2">
            <div className="flex items-center gap-2">
              <span>Status Korespondensi:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                !doc.is_corresponding_confirmed
                  ? 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                  : doc.is_corresponding
                  ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                  : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark'
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
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                  doc.is_corresponding_confirmed && doc.is_corresponding
                    ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                    : 'bg-surface-light dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark'
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
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                  doc.is_corresponding_confirmed && !doc.is_corresponding
                    ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                    : 'bg-surface-light dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark'
                }`}
              >
                Set TIDAK
              </button>
              {updatingCorrespondingId === doc.id && (
                <div className="w-3 h-3 border-2 border-muted border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
          <span className="text-[10px] font-semibold text-muted dark:text-on-dark-muted">
            Quartile Jurnal:
          </span>
          {bd.q && bd.q !== 'None' ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-surface-light-raised text-ink-heading dark:bg-surface-dark-elevated dark:text-on-dark border border-hairline-light dark:border-hairline-dark">
              {bd.q}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-light-raised text-muted dark:bg-surface-dark-elevated dark:text-on-dark-muted">
              Tidak terdeteksi
            </span>
          )}
        </div>

        <div className="flex justify-between items-start py-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
          <div>
            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Poin Maks {bd.q && bd.q !== 'None' ? bd.q : (isJI ? 'Tanpa Quartile' : 'Jurnal Nasional')}</p>
            <p className="text-[11px] text-muted dark:text-on-dark-muted">{isJI ? 'Q1=40, Q2=38, Q3=35, Q4/None=33 pts' : 'S1/S2=25, S3/S4=20, S5/S6=15, Non-SINTA=10 pts'}</p>
          </div>
          <span className="text-xs font-mono font-bold text-muted dark:text-on-dark-muted flex-shrink-0">{bd.maxPoints} pts</span>
        </div>

        <div className="flex justify-between items-start py-1 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
          <div>
            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">{bd.detailStr}</p>
            <p className="text-[11px] text-muted dark:text-on-dark-muted">{bd.pctStr}</p>
          </div>
          <span className="text-xs font-mono font-bold text-ink-heading dark:text-on-dark flex-shrink-0">+{bd.totalPoints}</span>
        </div>

        {bd.totalAuthors > 1 && (
          <div className="flex justify-between items-center py-1 gap-2 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
            <p className="text-[11px] text-muted dark:text-on-dark-muted">Total penulis terdeteksi</p>
            <span className="text-xs font-mono font-bold text-body-strong dark:text-on-dark">{bd.totalAuthors} penulis</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-hairline-light dark:border-hairline-dark">
          <div>
            <span className="text-xs font-bold text-ink-heading dark:text-on-dark">
              {doc.status === 'Pending' ? 'Estimasi Total Poin' : 'Total Poin'}
            </span>
            {doc.status === 'Pending' && (
              <p className="text-[10px] text-warning dark:text-warning-on-dark mt-0.5">
                Poin aktif +0 pts hingga disetujui Fakultas
              </p>
            )}
          </div>
          <span className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{bd.totalPoints} Pts</span>
        </div>
      </div>
    </motion.div>
  );
}
