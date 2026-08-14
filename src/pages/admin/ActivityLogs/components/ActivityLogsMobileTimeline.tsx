import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActivityLogsMobileTimelineProps } from '../types/activityLogs.types';
import { 
  getActionConfig, 
  getUserBg, 
  getInitials, 
  formatLogForCopy 
} from '../utils/activityLogsUtils';

export default function ActivityLogsMobileTimeline({
  logs,
  copiedId,
  onCopy
}: ActivityLogsMobileTimelineProps) {
  return (
    <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800/80">
      {logs.map((log, idx) => {
        const cfg = getActionConfig(log.action);
        const isCopied = copiedId === log.id;

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            className="p-5 space-y-3.5 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border shadow-xs ${getUserBg(log.user?.role || '')}`}>
                  {getInitials(log.user?.name || '')}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                    {log.user?.name || 'Sistem / Anonim'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 capitalize">
                    {log.user?.role || 'Sistem'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl uppercase tracking-wider border shadow-xs ${cfg.badge} shrink-0`}>
                {cfg.icon}
                {log.action}
              </span>
            </div>

            <div className="bg-gray-50/70 dark:bg-zinc-800/50 rounded-xl p-3.5 border border-gray-200/60 dark:border-zinc-800 space-y-2.5">
              <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">{log.description}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-zinc-700/50">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                  <span>{new Date(log.created_at).toLocaleString('id-ID')}</span>
                </div>
                
                <button
                  onClick={() => onCopy(formatLogForCopy(log), log.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                    isCopied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400'
                      : 'bg-white border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                  }`}
                  title="Salin detail log ke clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                      <span className="text-[10px] font-bold">Salin Detail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
