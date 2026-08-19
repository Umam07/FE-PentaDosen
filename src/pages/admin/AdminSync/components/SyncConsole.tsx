import React from 'react';
import {
  Terminal, Play, Pause, Square, Copy, Check,
  Clock, AlertTriangle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { SyncConsoleProps } from '../types/adminSync.types';
import { formatETA } from '../utils/adminSyncUtils';

export default function SyncConsole({
  syncState,
  syncStats,
  syncLogs,
  progressPercent,
  etaSeconds,
  copied,
  terminalEndRef,
  onStart,
  onPause,
  onCancel,
  onClose,
  onCopyLogs,
}: SyncConsoleProps) {
  return (
    <AnimatePresence>
      {syncState !== 'idle' && (
        <motion.div 
          id="sync-console-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-surface-light dark:bg-surface-dark shadow-lg rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden"
        >
          {/* Console Header */}
          <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark rounded-xl border border-hairline-light dark:border-hairline-dark">
                <Terminal className="w-4 h-4 text-accent dark:text-accent-on-dark" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">Konsol Sinkronisasi Massal</h3>
                <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted uppercase tracking-wider">Sistem Penjadwalan & Monitor Real-time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {syncState === 'running' && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-success-dark dark:text-success-on-dark bg-success-soft dark:bg-success/15 px-3 py-1 rounded-full border border-success-border dark:border-success/30 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-success-dark dark:bg-success-on-dark rounded-full animate-ping"></span>
                  Running
                </span>
              )}
              {syncState === 'paused' && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-warning-dark dark:text-warning bg-warning-soft dark:bg-warning/15 px-3 py-1 rounded-full border border-warning-border dark:border-warning/30 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse"></span>
                  Paused
                </span>
              )}
              {syncState === 'cancelled' && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-3 py-1 rounded-full border border-error-border dark:border-error/30 uppercase tracking-wider">
                  Batal
                </span>
              )}
              {syncState === 'completed' && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-accent dark:text-accent-on-dark bg-accent-soft dark:bg-accent/15 px-3 py-1 rounded-full border border-accent/20 uppercase tracking-wider">
                  Selesai
                </span>
              )}
            </div>
          </div>

          {/* Console Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
            {/* Stats Panel */}
            <div className="lg:col-span-4 p-6 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline-light dark:border-hairline-dark gap-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider">Progress Keseluruhan</span>
                  <span className="text-sm font-bold text-ink-heading dark:text-on-dark font-mono">{progressPercent}%</span>
                </div>
                
                <div className="w-full h-2.5 bg-surface-light dark:bg-surface-dark rounded-full overflow-hidden border border-hairline-light-soft dark:border-hairline-dark-soft">
                  <motion.div 
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
                    <span className="text-[9px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider block">Diproses</span>
                    <span className="text-base font-bold text-ink-heading dark:text-on-dark font-mono mt-0.5 block">{syncStats.processed} / {syncStats.total}</span>
                  </div>
                  <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
                    <span className="text-[9px] font-semibold uppercase text-success-dark dark:text-success-on-dark tracking-wider block">Berhasil</span>
                    <span className="text-base font-bold text-success-dark dark:text-success-on-dark font-mono mt-0.5 block">{syncStats.success}</span>
                  </div>
                  <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
                    <span className="text-[9px] font-semibold uppercase text-error dark:text-error-on-dark tracking-wider block">Gagal</span>
                    <span className="text-base font-bold text-error dark:text-error-on-dark font-mono mt-0.5 block">{syncStats.failed}</span>
                  </div>
                  <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
                    <span className="text-[9px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider block">Dilewati</span>
                    <span className="text-base font-bold text-muted dark:text-on-dark-muted font-mono mt-0.5 block">{syncStats.skipped}</span>
                  </div>
                </div>
              </div>

              {/* Queue Control Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {syncState === 'running' && (
                    <button 
                      onClick={onPause}
                      className="flex-1 flex items-center justify-center gap-2 bg-warning hover:bg-warning/90 text-white px-4 py-2.5 rounded-xl transition-all font-semibold text-xs active:scale-95 shadow-xs cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" /> Tangguhkan
                    </button>
                  )}
                  {syncState === 'paused' && (
                    <button 
                      onClick={onStart}
                      className="flex-1 flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white px-4 py-2.5 rounded-xl transition-all font-semibold text-xs active:scale-95 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Lanjutkan
                    </button>
                  )}
                  {(syncState === 'running' || syncState === 'paused') && (
                    <button 
                      onClick={onCancel}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark px-4 py-2.5 rounded-xl transition-all font-semibold text-xs active:scale-95 border border-hairline-light dark:border-hairline-dark cursor-pointer shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5" /> Batalkan
                    </button>
                  )}
                  {(syncState === 'completed' || syncState === 'cancelled') && (
                    <button 
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark px-4 py-2.5 rounded-xl transition-all font-semibold text-xs active:scale-95 cursor-pointer shadow-xs"
                    >
                      Tutup Konsol
                    </button>
                  )}
                </div>

                {syncState === 'running' && (
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider text-center mt-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Estimasi Sisa: {formatETA(etaSeconds)}
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Logs Panel */}
            <div className="lg:col-span-8 bg-[#11100f] dark:bg-[#151210] p-6 flex flex-col justify-between gap-4 h-[320px]">
              <div className="flex justify-between items-center pb-2 border-b border-[#2c2621]">
                <span className="text-[10px] font-semibold text-[#8c827a] uppercase tracking-wider font-mono">Live Logs</span>
                <div className="flex gap-2">
                  <button 
                    onClick={onCopyLogs}
                    className="p-1.5 hover:bg-[#201b17] rounded-lg text-[#a89f91] hover:text-white transition-colors flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider font-mono cursor-pointer"
                    title="Salin Log"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2c2621] pr-2 space-y-1.5 font-mono text-[11px] leading-relaxed select-text">
                {syncLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#78746d] text-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#78746d]" />
                    <span>Menunggu instruksi antrean sinkronisasi...</span>
                  </div>
                ) : (
                  syncLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[#78746d] shrink-0">[{log.time}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'error' ? 'text-rose-400 font-bold' : ''}
                        ${log.type === 'warning' ? 'text-amber-400' : ''}
                        ${log.type === 'info' ? 'text-[#f0efec]' : ''}
                      `}>
                        {log.type === 'success' && '✓ '}
                        {log.type === 'error' && '✗ '}
                        {log.type === 'warning' && '⚠ '}
                        {log.msg}
                      </span>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
          
          {/* Warning Footer */}
          {(syncState === 'running' || syncState === 'paused') && (
            <div className="px-6 py-3 bg-warning-soft dark:bg-warning/10 border-t border-warning-border dark:border-warning/20 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 animate-bounce" />
              <p className="text-[10px] font-semibold text-warning-dark dark:text-warning uppercase tracking-wider">
                Penting: Jangan tutup atau segarkan halaman ini selama sinkronisasi sedang berlangsung.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
