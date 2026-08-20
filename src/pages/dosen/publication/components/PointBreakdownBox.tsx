import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, Sparkles, Award, Layers, 
  UserCheck, Users, HelpCircle, Check, X, Loader2
} from 'lucide-react';

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

  // ── 1. Google Scholar Breakdown ──
  if (bd.type === 'scholar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="mt-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark overflow-hidden w-full max-w-xl bg-surface-light dark:bg-surface-dark shadow-2xs"
      >
        {/* Card Header */}
        <div className="px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
              Rincian Perhitungan Google Scholar
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
            GS Formula
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Metrics Overview Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
            <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Jumlah Sitasi</p>
              <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark mt-0.5">
                {bd.citations ?? 0} Sitasi
              </p>
            </div>
            <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Status Sitasi</p>
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark mt-0.5">
                {(bd.citations ?? 0) > 0 ? 'Tersitasi' : 'Belum Tersitasi'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark col-span-2 sm:col-span-1">
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Maks. Sitasi (Cut-off)</p>
              <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark mt-0.5">
                500 Sitasi
              </p>
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start py-1.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-3">
              <div>
                <p className="font-semibold text-ink-heading dark:text-on-dark">1. Dokumen Google Scholar</p>
                <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">Bobot dasar publikasi terindeks Google Scholar</p>
              </div>
              <span className="font-mono font-bold text-ink-heading dark:text-on-dark shrink-0">+0.50</span>
            </div>

            <div className="flex justify-between items-start py-1.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-3">
              <div>
                <p className="font-semibold text-ink-heading dark:text-on-dark">2. Bonus Dokumen Tersitasi</p>
                <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">Bonus flat jika dokumen memiliki minimal 1 sitasi</p>
              </div>
              <span className="font-mono font-bold text-ink-heading dark:text-on-dark shrink-0">
                +{(bd.citationBonus || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-start py-1.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-3">
              <div>
                <p className="font-semibold text-ink-heading dark:text-on-dark">
                  3. Poin Sitasi (×{Math.min(bd.citations || 0, 500)} × 0.25)
                  {(bd.citations || 0) > 500 && ' (Cut-off 500)'}
                </p>
                <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">Kalkulasi 0.25 poin per sitasi (maksimal 500 sitasi)</p>
              </div>
              <span className="font-mono font-bold text-ink-heading dark:text-on-dark shrink-0">
                +{(bd.citationPoints || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Total */}
        <div className="px-4 py-3 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border-t border-hairline-light dark:border-hairline-dark flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-ink-heading dark:text-on-dark">Total Poin Scholar</span>
            <p className="text-[10px] text-muted dark:text-on-dark-muted">Kalkulasi otomatis sistem</p>
          </div>
          <span className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">
            +{bd.totalPoints} Pts
          </span>
        </div>
      </motion.div>
    );
  }

  // ── 2. Scopus / SINTA Breakdown ──
  const isJI = doc.category === 'Jurnal Internasional' || doc.source === 'scopus';

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="mt-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark overflow-hidden w-full max-w-xl bg-surface-light dark:bg-surface-dark shadow-2xs"
    >
      {/* Card Header */}
      <div className="px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
            <Sparkles className="w-3.5 h-3.5 text-warning dark:text-warning-on-dark" />
          </div>
          <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
            {isJI ? 'Rincian Penilaian Scopus (Quartile & Peran)' : 'Rincian Penilaian SINTA (POAK)'}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
          {isJI ? 'Scopus Base' : 'POAK Rules'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Cross-Indexed Banner */}
        {isCrossIndexed && (
          <div className="p-2.5 bg-success-soft dark:bg-success/15 border border-success-border dark:border-success/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-success-dark dark:text-success-on-dark">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-success shrink-0" />
              Irisan Publikasi Scopus &amp; Google Scholar
            </span>
            <span className="text-[10px] bg-success/10 px-2 py-0.5 rounded-md border border-success-border dark:border-success/30">
              Skema Scopus Digunakan
            </span>
          </div>
        )}

        {/* Interactive Corresponding Author Toggle */}
        {showCorrespondingControls && (
          <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
                <span className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                  Penulis Korespondensi:
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                !doc.is_corresponding_confirmed
                  ? 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                  : doc.is_corresponding
                  ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                  : 'bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border-hairline-light dark:border-hairline-dark'
              }`}>
                {!doc.is_corresponding_confirmed ? 'Perlu Konfirmasi' : doc.is_corresponding ? '✓ Ya (Corresponding)' : 'Bukan Corresponding'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
              <p className="text-[11px] text-muted dark:text-on-dark-muted">
                Apakah Anda adalah corresponding author?
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={updatingCorrespondingId === doc.id}
                  onClick={async () => {
                    if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(doc.id);
                    if (handleToggleCorresponding) await handleToggleCorresponding(doc.id, true);
                    if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(null);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    doc.is_corresponding_confirmed && doc.is_corresponding
                      ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                      : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>YA</span>
                </button>

                <button
                  type="button"
                  disabled={updatingCorrespondingId === doc.id}
                  onClick={async () => {
                    if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(doc.id);
                    if (handleToggleCorresponding) await handleToggleCorresponding(doc.id, false);
                    if (setUpdatingCorrespondingId) setUpdatingCorrespondingId(null);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    doc.is_corresponding_confirmed && !doc.is_corresponding
                      ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                      : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                  }`}
                >
                  <X className="w-3 h-3" />
                  <span>TIDAK</span>
                </button>

                {updatingCorrespondingId === doc.id && (
                  <Loader2 className="w-3.5 h-3.5 text-muted animate-spin shrink-0 ml-1" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
          <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
            <p className="text-[10px] text-muted dark:text-on-dark-muted flex items-center gap-1">
              <Award className="w-3 h-3 text-warning" />
              {isJI ? 'Quartile' : 'Akreditasi'}
            </p>
            <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark mt-0.5">
              {bd.q && bd.q !== 'None' ? bd.q : (isJI ? 'None' : (doc.sinta_rank || 'Non-SINTA'))}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
            <p className="text-[10px] text-muted dark:text-on-dark-muted">Peran Penulis</p>
            <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate mt-0.5">
              {bd.role || doc.author_role || 'Penulis'}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
            <p className="text-[10px] text-muted dark:text-on-dark-muted flex items-center gap-1">
              <Users className="w-3 h-3 text-muted" />
              Total Penulis
            </p>
            <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark mt-0.5">
              {bd.totalAuthors ?? 1} Penulis
            </p>
          </div>

          <div className="p-2 rounded-lg bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark">
            <p className="text-[10px] text-muted dark:text-on-dark-muted">Persentase Poin</p>
            <p className="text-xs font-bold font-mono text-accent dark:text-accent-on-dark mt-0.5">
              {bd.pctStr || '100%'}
            </p>
          </div>
        </div>

        {/* Calculation Steps */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start py-1.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-3">
            <div>
              <p className="font-semibold text-ink-heading dark:text-on-dark">
                Poin Dasar Maksimal ({bd.q && bd.q !== 'None' ? bd.q : (isJI ? 'Tanpa Quartile' : (doc.sinta_rank || 'Jurnal Nasional'))})
              </p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">
                {isJI ? 'Q1=40, Q2=38, Q3=35, Q4/None=33 pts' : 'S1/S2=25, S3/S4=20, S5/S6=15, Non-SINTA=10 pts'}
              </p>
            </div>
            <span className="font-mono font-bold text-muted dark:text-on-dark-muted shrink-0">
              {bd.maxPoints} pts
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft gap-3">
            <div>
              <p className="font-semibold text-ink-heading dark:text-on-dark">{bd.detailStr}</p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">
                {bd.pctStr ? `Alokasi persentase: ${bd.pctStr}` : 'Distribusi peran penulis'}
              </p>
            </div>
            <span className="font-mono font-bold text-ink-heading dark:text-on-dark shrink-0">
              +{bd.totalPoints} pts
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Total */}
      <div className="px-4 py-3 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border-t border-hairline-light dark:border-hairline-dark flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-ink-heading dark:text-on-dark">
            {doc.status === 'Pending' ? 'Estimasi Total Poin KPI' : 'Total Poin KPI Diterima'}
          </span>
          {doc.status === 'Pending' ? (
            <p className="text-[10px] text-warning dark:text-warning-on-dark flex items-center gap-1 mt-0.5">
              <HelpCircle className="w-3 h-3 shrink-0" />
              Menunggu verifikasi Fakultas
            </p>
          ) : (
            <p className="text-[10px] text-muted dark:text-on-dark-muted mt-0.5">
              Telah dihitung ke dalam skor KPI
            </p>
          )}
        </div>
        <span className="text-sm sm:text-base font-bold font-mono text-ink-heading dark:text-on-dark">
          +{bd.totalPoints} Pts
        </span>
      </div>
    </motion.div>
  );
}
