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
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
        <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
          <tr>
            {['Waktu & Tanggal', 'Pengguna', 'Aksi', 'Deskripsi Detail'].map((h, i) => (
              <th 
                key={i} 
                className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
          {logs.map((log, index) => {
            const cfg = getActionConfig(log.action);
            const isCopied = copiedId === log.id;

            return (
              <motion.tr 
                key={log.id} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-zinc-800/40"
              >
                {/* Waktu & Tanggal Column */}
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 tabular-nums">
                      {new Date(log.created_at).toLocaleDateString('id-ID', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center text-[11px] font-medium text-gray-500 dark:text-zinc-400 mt-0.5 gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
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
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${getUserBg(log.user?.role || '')}`}>
                      {getInitials(log.user?.name || '')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {log.user?.name || 'Sistem / Anonim'}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-0.5 capitalize">
                        {log.user?.role || 'Sistem'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Aksi Column */}
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-xs ${cfg.badge}`}>
                    {cfg.icon}
                    {log.action}
                  </span>
                </td>

                {/* Deskripsi Detail Column with Salin Detail */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                      {log.description}
                    </p>
                    
                    <button
                      onClick={() => onCopy(formatLogForCopy(log), log.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400'
                          : 'bg-white border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-primary-400'
                      }`}
                      title="Salin detail log ke clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 dark:text-zinc-400" />
                          <span className="text-[11px] font-bold">Salin Detail</span>
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
