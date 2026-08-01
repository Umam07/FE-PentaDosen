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
          className="bg-white dark:bg-zinc-900 shadow-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          {/* Console Header */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-950 rounded-xl">
                <Terminal className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Konsol Sinkronisasi Massal</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistem Penjadwalan & Monitor Real-time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {syncState === 'running' && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  Running
                </span>
              )}
              {syncState === 'paused' && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                  Paused
                </span>
              )}
              {syncState === 'cancelled' && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/40 uppercase tracking-widest">
                  Batal
                </span>
              )}
              {syncState === 'completed' && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/40 uppercase tracking-widest">
                  Selesai
                </span>
              )}
            </div>
          </div>

          {/* Console Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-100 dark:border-zinc-800">
            {/* Stats Panel */}
            <div className="lg:col-span-4 p-6 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 gap-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Progress Keseluruhan</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 font-mono">{progressPercent}%</span>
                </div>
                
                <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block">Diproses</span>
                    <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">{syncStats.processed} / {syncStats.total}</span>
                  </div>
                  <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-100/20 dark:border-emerald-900/10">
                    <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block">Berhasil</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">{syncStats.success}</span>
                  </div>
                  <div className="bg-rose-50/30 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/20 dark:border-rose-900/10">
                    <span className="text-[8px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-widest block">Gagal</span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">{syncStats.failed}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block">Dilewati</span>
                    <span className="text-lg font-bold text-zinc-500 dark:text-zinc-500 font-mono mt-0.5 block">{syncStats.skipped}</span>
                  </div>
                </div>
              </div>

              {/* Queue Control Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {syncState === 'running' && (
                    <button 
                      onClick={onPause}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      <Pause className="w-3.5 h-3.5" /> Tangguhkan
                    </button>
                  )}
                  {syncState === 'paused' && (
                    <button 
                      onClick={onStart}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 shadow-md shadow-emerald-600/10"
                    >
                      <Play className="w-3.5 h-3.5" /> Lanjutkan
                    </button>
                  )}
                  {(syncState === 'running' || syncState === 'paused') && (
                    <button 
                      onClick={onCancel}
                      className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Square className="w-3.5 h-3.5" /> Batalkan
                    </button>
                  )}
                  {(syncState === 'completed' || syncState === 'cancelled') && (
                    <button 
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-805 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95"
                    >
                      Tutup Konsol
                    </button>
                  )}
                </div>

                {syncState === 'running' && (
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-center mt-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Estimasi Sisa Waktu: {formatETA(etaSeconds)}
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Logs Panel */}
            <div className="lg:col-span-8 bg-zinc-950 p-6 flex flex-col justify-between gap-4 h-[320px]">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">Live Logs</span>
                <div className="flex gap-2">
                  <button 
                    onClick={onCopyLogs}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider font-mono"
                    title="Salin Log"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-2 space-y-1.5 font-mono text-[11px] leading-relaxed select-text">
                {syncLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
                    <span>Menunggu instruksi antrean sinkronisasi...</span>
                  </div>
                ) : (
                  syncLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'error' ? 'text-rose-400 font-bold' : ''}
                        ${log.type === 'warning' ? 'text-amber-400' : ''}
                        ${log.type === 'info' ? 'text-zinc-300' : ''}
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
            <div className="px-6 py-3 bg-rose-50/50 dark:bg-rose-950/10 border-t border-rose-100/20 dark:border-rose-900/10 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
              <p className="text-[9px] md:text-[10px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest">
                Penting: Jangan tutup atau segarkan halaman ini selama sinkronisasi sedang berlangsung.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
