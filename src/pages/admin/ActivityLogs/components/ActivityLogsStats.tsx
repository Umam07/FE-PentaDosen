import React from 'react';
import { UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActivityLogsStatsProps } from '../types/activityLogs.types';

export default function ActivityLogsStats({
  loginCount,
  verifyCount,
  syncCount
}: ActivityLogsStatsProps) {
  const statsConfig = [
    { 
      label: 'Sesi Login', 
      value: loginCount, 
      icon: UserCheck, 
      desc: 'Autentikasi pada halaman ini',
      iconBox: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
      valColor: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      label: 'Aksi Verifikasi', 
      value: verifyCount, 
      icon: ShieldCheck, 
      desc: 'Validasi berkas & aksi admin',
      iconBox: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
      valColor: 'text-amber-600 dark:text-amber-400'
    },
    { 
      label: 'Sinkronisasi Data', 
      value: syncCount, 
      icon: RefreshCw, 
      desc: 'Scholar & Scopus sync update',
      iconBox: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
      valColor: 'text-blue-600 dark:text-blue-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {statsConfig.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-5 flex items-center gap-4.5 shadow-xs transition-colors hover:border-gray-300 dark:hover:border-zinc-700"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBox}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em]">{stat.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${stat.valColor}`}>{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-0.5">{stat.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
