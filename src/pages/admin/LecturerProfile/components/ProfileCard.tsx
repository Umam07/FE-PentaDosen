import React from 'react';
import { 
  Mail, Building2, GraduationCap, Fingerprint, 
  ShieldCheck, CheckCircle, AlertCircle, BookOpen, Globe, ExternalLink 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfileCardProps } from '../types/lecturerProfile.types';

export default function ProfileCard({
  profile,
  loading,
  stats,
  message
}: ProfileCardProps) {
  const { user, scholarData, scopusData } = profile;

  const affiliation = [user?.program_studi, user?.fakultas].filter(Boolean).join(' • ');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xs"
    >
      {/* Top Profile Info Section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated sm:h-22 sm:w-22">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
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
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-success-border bg-success-soft px-2.5 py-0.5 text-[11px] font-semibold text-success-dark dark:border-success/30 dark:bg-success/15 dark:text-success-on-dark">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Profil Dosen Terverifikasi</span>
            </span>
            {user?.role && (
              <span className="inline-flex items-center rounded-pill border border-hairline-light bg-surface-light-raised px-2.5 py-0.5 text-[11px] font-semibold text-muted dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-muted capitalize">
                {user.role}
              </span>
            )}
          </div>

          <h1 className="truncate text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark sm:text-2xl">
            {loading ? (
              <span className="inline-block h-6 bg-surface-light-raised dark:bg-surface-dark-elevated animate-pulse rounded w-48" />
            ) : (
              user?.name || 'Dosen'
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted dark:text-on-dark-muted">
            {affiliation ? (
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span className="truncate">{affiliation}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span>Universitas YARSI</span>
              </div>
            )}

            {user?.email && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span className="truncate">{user.email}</span>
              </div>
            )}

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

      {message && (
        <div className={`mt-5 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 border ${
          message.includes('Gagal') 
            ? 'border-error-border bg-error-soft text-error dark:border-error/30 dark:bg-error/15 dark:text-error-on-dark' 
            : 'border-success-border bg-success-soft text-success-dark dark:border-success/30 dark:bg-success/15 dark:text-success-on-dark'
        }`}>
          {message.includes('Gagal') ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Divider */}
      <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {stats?.map((stat, i) => (
          <div 
            key={i} 
            className="flex min-h-[80px] items-center gap-3.5 rounded-2xl border border-hairline-light bg-surface-light-raised p-4 transition-all duration-200 hover:border-hairline-light hover:bg-surface-light dark:border-hairline-dark dark:bg-surface-dark-elevated dark:hover:border-hairline-dark dark:hover:bg-surface-dark"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline-light bg-surface-light text-body-strong dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark">
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-muted dark:text-on-dark-muted truncate">{stat.label}</span>
              <span className="block text-xl font-bold font-mono leading-tight tracking-tight text-ink-heading dark:text-on-dark tabular-nums mt-0.5">
                {loading ? (
                  <span className="inline-block h-5 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded w-16" />
                ) : (
                  stat.val
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

      {/* Scholar & Scopus Cards Row */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        
        {/* Google Scholar Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light-raised p-3.5 sm:p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold tracking-tight text-ink-heading dark:text-on-dark truncate">
                      Google Scholar
                    </h2>
                    {user?.scholar_id && (
                      <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted hidden sm:inline truncate">
                        ({user.scholar_id})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    scholarData
                      ? 'border-hairline-light bg-surface-light text-ink-heading dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark'
                      : 'border-hairline-light-soft bg-transparent text-muted dark:border-hairline-dark-soft dark:text-on-dark-muted'
                  }`}
                >
                  {loading ? 'Memuat...' : scholarData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>

                {user?.scholar_id && (
                  <a
                    href={`https://scholar.google.com/citations?user=${user.scholar_id.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-hairline-light bg-surface-light px-2 py-0.5 text-[10px] font-semibold text-body hover:text-ink-heading hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-soft dark:hover:text-on-dark dark:hover:bg-surface-dark-elevated transition-colors"
                    title="Buka Profil Google Scholar"
                  >
                    <span>Profil</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Metrics */}
            {scholarData ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    Dokumen
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scholarData.document_count ?? profile?.publications?.length ?? 0}
                  </span>
                </div>
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    Sitasi
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scholarData.total_citations}
                  </span>
                </div>
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    h-index
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scholarData.h_index}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 px-3 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                <BookOpen className="h-3.5 w-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                <p className="text-[11px] text-muted dark:text-on-dark-muted">Belum terhubung</p>
              </div>
            )}
          </div>

          {!loading && scholarData && (
            <div className="text-[10px] font-medium text-muted dark:text-on-dark-muted text-right mt-3">
              Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
        </div>

        {/* Scopus Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light-raised p-3.5 sm:p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold tracking-tight text-ink-heading dark:text-on-dark truncate">
                      Scopus
                    </h2>
                    {user?.scopus_id && (
                      <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted hidden sm:inline truncate">
                        ({user.scopus_id})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    scopusData
                      ? 'border-hairline-light bg-surface-light text-ink-heading dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark'
                      : 'border-hairline-light-soft bg-transparent text-muted dark:border-hairline-dark-soft dark:text-on-dark-muted'
                  }`}
                >
                  {loading ? 'Memuat...' : scopusData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>

                {user?.scopus_id && (
                  <a
                    href={`https://www.scopus.com/authid/detail.uri?authorId=${user.scopus_id.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-hairline-light bg-surface-light px-2 py-0.5 text-[10px] font-semibold text-body hover:text-ink-heading hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-soft dark:hover:text-on-dark dark:hover:bg-surface-dark-elevated transition-colors"
                    title="Buka Profil Scopus"
                  >
                    <span>Profil</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Metrics */}
            {scopusData ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    Dokumen
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scopusData.document_count}
                  </span>
                </div>
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    Sitasi
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scopusData.total_citations}
                  </span>
                </div>
                <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    h-index
                  </span>
                  <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {scopusData.h_index}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 px-3 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                <Globe className="h-3.5 w-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                <p className="text-[11px] text-muted dark:text-on-dark-muted">Belum terhubung</p>
              </div>
            )}
          </div>

          {!loading && scopusData && (
            <div className="text-[10px] font-medium text-muted dark:text-on-dark-muted text-right mt-3">
              Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
