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
    <div className="md:hidden divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
      {logs.map((log, idx) => {
        const cfg = getActionConfig(log.action);
        const isCopied = copiedId === log.id;

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            className="p-4 sm:p-5 space-y-3 bg-surface-light dark:bg-surface-dark"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold font-mono text-xs border shadow-xs ${getUserBg(log.user?.role || '')}`}>
                  {getInitials(log.user?.name || '')}
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
                    {log.user?.name || 'Sistem / Anonim'}
                  </p>
                  <p className="text-[10px] font-medium text-muted dark:text-on-dark-muted capitalize">
                    {log.user?.role || 'Sistem'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg uppercase tracking-wider border shadow-xs ${cfg.badge} shrink-0`}>
                {cfg.icon}
                {log.action}
              </span>
            </div>

            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl p-3 border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
              <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">{log.description}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted dark:text-on-dark-muted">
                  <Clock className="w-3 h-3 text-muted-soft dark:text-on-dark-muted" />
                  <span>{new Date(log.created_at).toLocaleString('id-ID')}</span>
                </div>
                
                <button
                  onClick={() => onCopy(formatLogForCopy(log), log.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer ${
                    isCopied 
                      ? 'bg-success-soft border-success-border text-success-dark dark:text-success-on-dark'
                      : 'bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark'
                  }`}
                  title="Salin detail log ke clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success-dark dark:text-success-on-dark" />
                      <span className="text-[10px] font-semibold text-success-dark dark:text-success-on-dark">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
                      <span className="text-[10px] font-semibold">Salin Detail</span>
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
