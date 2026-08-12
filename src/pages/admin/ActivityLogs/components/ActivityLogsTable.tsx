import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityLogsTableProps } from '../types/activityLogs.types';
import { 
  getActionConfig, 
  getUserBg, 
  getInitials, 
  isRecent, 
  formatLogForCopy 
} from '../utils/activityLogsUtils';

export default function ActivityLogsTable({
  logs,
  copiedId,
  onCopy
}: ActivityLogsTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto scrollbar-hide">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
        <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
          <tr>
            {['Waktu', 'Pengguna', 'Aksi', 'Deskripsi Detail'].map((h) => (
              <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
          <AnimatePresence>
            {logs.map((log, idx) => {
              const cfg = getActionConfig(log.action);
              const recent = isRecent(log.created_at);
              return (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  {/* Time Column */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex items-center justify-center shrink-0 w-2.5 h-2.5">
                        {recent && (
                          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${cfg.dot}`} />
                        )}
                        <div className={`relative w-2 h-2 rounded-full ${cfg.dot}`} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-700 dark:text-zinc-300 tabular-nums">
                          {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* User Column with Initials Avatar */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-[11px] ${getUserBg(log.user?.role || '')} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                        {getInitials(log.user?.name || '')}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {log.user?.name || 'Sistem / Anonim'}
                        </p>
                        <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          {log.user?.role || 'System'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Action Badge Column */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${cfg.badge} transition-all duration-200`}>
                      {cfg.icon}
                      {log.action}
                    </span>
                  </td>

                  {/* Description Column with Improved Copy Button */}
                  <td className="px-6 py-4 align-top max-w-[360px] group/desc relative">
                    <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 leading-relaxed pr-8">
                      {log.description}
                    </p>
                    <div className="absolute right-3 top-4 flex items-center gap-1.5 opacity-0 group-hover/desc:opacity-100 transition-all duration-200">
                      <AnimatePresence mode="wait">
                        {copiedId === log.id ? (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8, x: 5 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -5 }}
                            className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20"
                          >
                            Tersalin!
                          </motion.span>
                        ) : null}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCopy(formatLogForCopy(log), log.id)}
                        className={`p-2 rounded-xl border transition-all shadow-sm flex items-center justify-center ${
                          copiedId === log.id
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                            : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600 dark:bg-zinc-850 dark:border-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Salin detail log"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
