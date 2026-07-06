import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
      {logs.map((log, idx) => {
        const cfg = getActionConfig(log.action);
        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="p-5 space-y-3 bg-white dark:bg-zinc-900 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-[11px] bg-gradient-to-br ${getUserBg(log.user?.role || '')} shadow-sm`}>
                  {getInitials(log.user?.name || '')}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">
                    {log.user?.name || 'Sistem'}
                  </p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{log.user?.role || 'System'}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${cfg.badge} shrink-0`}>
                {cfg.icon}
                {log.action}
              </span>
            </div>

            <div className="bg-gray-50/50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100/50 dark:border-zinc-800/50 space-y-2 relative">
              <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 leading-relaxed pr-8">{log.description}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString('id-ID')}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <AnimatePresence mode="wait">
                    {copiedId === log.id && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md"
                      >
                        Tersalin!
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onCopy(formatLogForCopy(log), log.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      copiedId === log.id 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                        : 'bg-white border-gray-100 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700'
                    }`}
                    title="Salin deskripsi"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
