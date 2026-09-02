import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, GraduationCap, Fingerprint, 
  ShieldCheck 
} from 'lucide-react';
import { LecturerProfile } from '../types';

interface ProfileHeroHeaderProps {
  profile: LecturerProfile;
  grandTotal: number;
  grandTotal3Years: number;
  grandTotalThisYear: number;
  internalPoints: number;
  apiPointsTotal: number;
  loading?: boolean;
}

export default function ProfileHeroHeader({ 
  profile, 
  grandTotal,
  grandTotal3Years,
  grandTotalThisYear,
  internalPoints,
  apiPointsTotal,
  loading = false 
}: ProfileHeroHeaderProps) {
  const { user, scholarData } = profile;
  const prodi = user?.program_studi || 'Universitas YARSI';

  const internalPct = grandTotal > 0 ? (internalPoints / grandTotal) * 100 : 0;
  const apiPct = grandTotal > 0 ? (apiPointsTotal / grandTotal) * 100 : 0;

  const statsLocal = [
    { label: 'KPI Overall', fullLabel: 'Total KPI Overall', val: loading ? null : grandTotal.toLocaleString() },
    { label: 'KPI 3 Tahun', fullLabel: 'Total KPI 3 Tahun', val: loading ? null : grandTotal3Years.toLocaleString() },
    { label: 'KPI Tahun Ini', fullLabel: 'Total KPI Tahun Ini', val: loading ? null : grandTotalThisYear.toLocaleString() },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-7 shadow-2xs"
    >
      {/* Top Profile Info Section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated sm:h-20 sm:w-20">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user?.name || 'Lecturer'} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : user?.thumbnail ? (
            <img 
              src={user.thumbnail} 
              alt={user?.name || 'Lecturer'} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : scholarData?.thumbnail ? (
            <img 
              src={scholarData.thumbnail} 
              alt={user?.name || 'Lecturer'} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink text-2xl font-bold text-on-ink dark:bg-on-dark dark:text-ink">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        {/* Name & Academic Meta */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-success-soft px-2.5 py-0.5 text-[11px] font-semibold text-success-dark dark:bg-success/15 dark:text-success-on-dark">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Profil Dosen Terverifikasi</span>
            </span>
          </div>

          <h1 className="truncate text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark sm:text-2xl">
            {loading ? (
              <span className="inline-block h-6 bg-surface-light-raised dark:bg-surface-dark-elevated animate-pulse rounded w-48" />
            ) : (
              user?.name || 'Dosen'
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted dark:text-on-dark-muted">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
              <span className="truncate">{prodi}</span>
            </div>

            {user?.nidn && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <GraduationCap className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span>NIDN: {user.nidn}</span>
              </div>
            )}

            {user?.penta_id && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Fingerprint className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span>Penta ID: {user.penta_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

      {/* ─── Inline KPI Stats (flat, divided) ─── */}
      <div className="grid grid-cols-3 divide-x divide-hairline-light dark:divide-hairline-dark">
        {statsLocal.map((stat, i) => (
          <div key={i} className="px-2 sm:px-3 first:pl-0 last:pr-0 text-center sm:text-left">
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums leading-none">
              {stat.val ?? (loading ? '…' : '0')}
            </span>
            <span className="block text-[11px] sm:text-xs font-semibold text-muted dark:text-on-dark-muted mt-1.5 leading-tight sm:leading-normal">
              <span className="hidden sm:inline">{stat.fullLabel}</span>
              <span className="inline sm:hidden">{stat.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* ─── Kontribusi Poin (Internal vs Eksternal) ─── */}
      <div className="mt-5 space-y-2">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="font-semibold text-ink-heading dark:text-on-dark">
              Kontribusi Poin:
            </span>
            
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark shrink-0" />
              <span className="text-muted dark:text-on-dark-muted">
                Internal <strong className="font-bold font-mono text-xs sm:text-sm text-ink-heading dark:text-on-dark tabular-nums">{internalPoints.toLocaleString()}</strong> <span className="font-mono text-muted dark:text-on-dark-muted">({internalPct.toFixed(1)}%)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent dark:bg-accent-on-dark shrink-0" />
              <span className="text-muted dark:text-on-dark-muted">
                Eksternal <strong className="font-bold font-mono text-xs sm:text-sm text-ink-heading dark:text-on-dark tabular-nums">{apiPointsTotal.toLocaleString()}</strong> <span className="font-mono text-muted dark:text-on-dark-muted">({apiPct.toFixed(1)}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Contribution Progress Bar */}
        <div className="h-2 w-full rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden flex">
          {internalPct > 0 && (
            <div
              className="h-full bg-chart-scopus dark:bg-chart-scopus-dark transition-all duration-500"
              style={{ width: `${internalPct}%` }}
            />
          )}
          {apiPct > 0 && (
            <div
              className="h-full bg-accent dark:bg-accent-on-dark transition-all duration-500"
              style={{ width: `${apiPct}%` }}
            />
          )}
        </div>
      </div>

    </motion.div>
  );
}
