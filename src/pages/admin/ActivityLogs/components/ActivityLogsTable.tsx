import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActivityLogsTableProps } from '../types/activityLogs.types';
import { 
  getActionConfig, 
  getUserBg, 
  getInitials, 
  formatLogForCopy 
} from '../utils/activityLogsUtils';

export default function ActivityLogsTable({
  logs,
  copiedId,
  onCopy
}: ActivityLogsTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
        <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <tr>
            {['Waktu & Tanggal', 'Pengguna', 'Aksi', 'Deskripsi Detail'].map((h, i) => (
              <th 
                key={i} 
                className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
          {logs.map((log, index) => {
            const cfg = getActionConfig(log.action);
            const isCopied = copiedId === log.id;

            return (
              <motion.tr 
                key={log.id} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                className="group transition-colors hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated"
              >
                {/* Waktu & Tanggal Column */}
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <div>
                    <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                      {new Date(log.created_at).toLocaleDateString('id-ID', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5 gap-1.5">
                      <Clock className="w-3 h-3 text-muted-soft dark:text-on-dark-muted" />
                      <span>
                        {new Date(log.created_at).toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Pengguna Column */}
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <div className="flex items-center gap-3.5">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-xs ${getUserBg(log.user?.role || '')}`}>
                      {getInitials(log.user?.name || '')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-heading dark:text-on-dark group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                        {log.user?.name || 'Sistem / Anonim'}
                      </p>
                      <p className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-0.5 capitalize">
                        {log.user?.role || 'Sistem'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Aksi Column */}
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider border shadow-xs ${cfg.badge}`}>
                    {cfg.icon}
                    {log.action}
                  </span>
                </td>

                {/* Deskripsi Detail Column with Salin Detail */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-body dark:text-on-dark-soft leading-relaxed max-w-xl">
                      {log.description}
                    </p>
                    
                    <button
                      onClick={() => onCopy(formatLogForCopy(log), log.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 ${
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
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
