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
      iconBox: 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30',
      valColor: 'text-success-dark dark:text-success-on-dark'
    },
    { 
      label: 'Aksi Verifikasi', 
      value: verifyCount, 
      icon: ShieldCheck, 
      desc: 'Validasi berkas & aksi admin',
      iconBox: 'bg-warning-soft dark:bg-warning/15 text-warning-dark dark:text-warning border border-warning-border dark:border-warning/30',
      valColor: 'text-warning-dark dark:text-warning'
    },
    { 
      label: 'Sinkronisasi Data', 
      value: syncCount, 
      icon: RefreshCw, 
      desc: 'Scholar & Scopus sync update',
      iconBox: 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark border border-accent/20',
      valColor: 'text-accent dark:text-accent-on-dark'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {statsConfig.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 flex items-center gap-4 shadow-xs transition-colors hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBox}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono mt-0.5 ${stat.valColor}`}>{stat.value}</p>
              <p className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-0.5">{stat.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
