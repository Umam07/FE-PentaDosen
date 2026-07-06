import React from 'react';
import { User as UserIcon, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { ActivityLogsStatsProps } from '../types/activityLogs.types';

export default function ActivityLogsStats({
  loginCount,
  verifyCount,
  syncCount
}: ActivityLogsStatsProps) {
  const statsConfig = [
    { 
      label: 'Total Sesi Login', 
      value: loginCount, 
      icon: UserIcon, 
      desc: 'Sesi login di halaman ini',
      hoverClass: 'hover:border-emerald-200 dark:hover:border-emerald-900/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      valColor: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      label: 'Aksi Verifikasi', 
      value: verifyCount, 
      icon: Shield, 
      desc: 'Verifikasi di halaman ini',
      hoverClass: 'hover:border-amber-200 dark:hover:border-amber-900/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)]',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
      valColor: 'text-amber-600 dark:text-amber-400'
    },
    { 
      label: 'Sinkronisasi Data', 
      value: syncCount, 
      icon: RefreshCw, 
      desc: 'Sync data di halaman ini',
      hoverClass: 'hover:border-blue-200 dark:hover:border-blue-900/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)]',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      valColor: 'text-blue-600 dark:text-blue-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-5 flex items-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 ${stat.hoverClass}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${stat.iconBg}`}>
            <stat.icon className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em]">{stat.label}</p>
            <p className={`text-3xl font-black mt-0.5 ${stat.valColor}`}>{stat.value}</p>
            <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">{stat.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
