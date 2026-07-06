import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint } from 'lucide-react';
import { ProfileUser, ProfileStat } from '../types/profile.types';

interface ProfileHeaderProps {
  user: ProfileUser | null | undefined;
  stats: ProfileStat[] | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
                  alt={user.name}
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

          <div className="space-y-1.5 pb-1">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Lecturer Profile
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
              {user?.name || 'User'}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{user?.program_studi || 'Lecturer'}</span>
              {user?.penta_id && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span className="font-black">{user.penta_id}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

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
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                <span className="mt-1.5 block text-2xl font-black leading-none tracking-tight text-slate-950 dark:text-white tabular-nums">{stat.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
