import React from 'react';
import { Mail, Fingerprint, ShieldCheck, CheckCircle, Globe, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfileCardProps } from '../types/lecturerProfile.types';

export default function ProfileCard({
  profile,
  loading,
  stats,
  message
}: ProfileCardProps) {
  const { user, scholarData, scopusData } = profile;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header Cover Banner (Adaptive, Premium & Shorter) */}
      <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden border-b border-slate-200/40 dark:border-slate-800/50">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Profile details & KPI stats container */}
      <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        {/* Profile details row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left -mt-8 relative z-10 mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg dark:bg-slate-900 border-2 border-white dark:border-slate-800">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name || 'Lecturer'} 
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : scholarData?.thumbnail ? (
                <img 
                  src={scholarData.thumbnail} 
                  alt={user?.name || 'Lecturer'} 
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary-600 text-2xl font-black text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
          </div>

          <div className="space-y-1.5 pb-1 flex-1">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Lecturer Profile
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white min-h-[32px] flex items-center justify-center sm:justify-start">
              {loading ? (
                <span className="inline-block h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48" />
              ) : (
                user?.name || 'User'
              )}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {loading ? (
                <>
                  <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                  <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                  <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                  <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-28" />
                </>
              ) : (
                <>
                  <span className="capitalize">{user?.role || 'Lecturer'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                  {user?.fakultas && (
                    <>
                      <span>{user.fakultas}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    </>
                  )}
                  <span>{user?.program_studi || 'Lecturer'}</span>
                  {user?.penta_id && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                      <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
                        <Fingerprint className="h-3.5 w-3.5" />
                        <span className="font-black">{user.penta_id}</span>
                      </span>
                    </>
                  )}
                  {user?.email && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{user.email}</span>
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm flex items-start ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {message}
          </div>
        )}

        {/* Elegant Divider */}
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

        {/* KPI Stats Row (Full Width - Zero Overlap!) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
          {stats?.map((stat, i) => (
            <div 
              key={i} 
              className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white/85 px-5 py-4 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950/50 dark:to-slate-900/30 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{stat.label}</span>
                <span className="mt-1.5 block text-2xl font-black leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {loading ? (
                    <span className="inline-block h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16" />
                  ) : (
                    stat.val
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
          
          {/* Box Scholar */}
          <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-850 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/80 text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400 shadow-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Google Scholar</h3>
                    {loading ? (
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-805 animate-pulse rounded w-32 mt-1.5" />
                    ) : user?.scholar_id ? (
                      <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1">ID: {user?.scholar_id}</p>
                    ) : (
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                    )}
                  </div>
                </div>
                <span
                   className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                    !loading && scholarData
                       ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                       : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                   }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${!loading && scholarData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  {loading ? 'Memuat...' : scholarData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm text-center flex flex-col justify-center gap-1.5">
                      <span className="h-2.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12 mx-auto" />
                      <span className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-8 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : scholarData ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Dokumen</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{scholarData.document_count ?? profile?.publications?.length ?? 0}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Sitasi</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{scholarData.total_citations}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">h-index</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scholarData.h_index}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                  <BookOpen className="h-8 w-8 text-slate-200 dark:text-slate-800 mb-2" />
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                </div>
              )}
            </div>
            {!loading && scholarData && (
              <div className="text-[10px] font-semibold text-slate-650 dark:text-slate-400 text-right mt-5">
                Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

          {/* Box Scopus */}
          <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-850 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50/80 text-orange-600 dark:border-orange-900/30 dark:bg-orange-950/20 dark:text-orange-400 shadow-sm">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Scopus</h3>
                    {loading ? (
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-805 animate-pulse rounded w-32 mt-1.5" />
                    ) : user?.scopus_id ? (
                      <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1">ID: {user?.scopus_id}</p>
                    ) : (
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                    )}
                  </div>
                </div>
                <span
                   className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                    !loading && scopusData
                       ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                       : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                   }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${!loading && scopusData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  {loading ? 'Memuat...' : scopusData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm text-center flex flex-col justify-center gap-1.5">
                      <span className="h-2.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12 mx-auto" />
                      <span className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-8 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : scopusData ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-650 dark:text-slate-400 uppercase tracking-wider">Dokumen</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{scopusData.document_count}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-650 dark:text-slate-400 uppercase tracking-wider">Total Sitasi</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{scopusData.total_citations}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                    <span className="text-[9px] font-black text-slate-655 dark:text-slate-400 uppercase tracking-wider">h-index</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scopusData.h_index}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                  <Globe className="h-8 w-8 text-slate-200 dark:text-slate-800 mb-2" />
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                </div>
              )}
            </div>
            {!loading && scopusData && (
              <div className="text-[10px] font-semibold text-slate-650 dark:text-slate-400 text-right mt-5">
                Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
