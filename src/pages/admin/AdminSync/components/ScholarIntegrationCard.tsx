import React from 'react';
import {
  BookOpen, Zap, User, ArrowRight, RefreshCw,
  CheckCircle2, Database, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ScholarIntegrationCardProps } from '../types/adminSync.types';

export default function ScholarIntegrationCard({
  scholarId,
  scholarData,
  scholarUser,
  loadingScholar,
  checkingInfoScholar,
  checkedAuthorScholar,
  messageScholar,
  onScholarIdChange,
  onCheck,
  onSave,
  onSync,
  onClearChecked,
}: ScholarIntegrationCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-8 py-6 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2.5 bg-[#3b6fe0]/10 text-[#3b6fe0] dark:text-[#7fa4ea] rounded-lg mr-4 shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">Id Scholar</h3>
        </div>
        {messageScholar && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-success dark:text-success-on-dark flex items-center bg-success-soft dark:bg-surface-dark-elevated px-4 py-2 rounded-lg uppercase tracking-widest border border-success-border dark:border-hairline-dark">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
            {messageScholar}
          </motion.span>
        )}
      </div>
      
      <div className="p-8 space-y-8">
        {/* ID Editor */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted dark:text-on-dark-muted uppercase tracking-[0.2em] ml-1">Google Scholar ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted dark:text-on-dark-muted"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-sm font-bold text-ink-heading dark:text-on-dark focus:border-[#3b6fe0] focus:ring-2 focus:ring-[#3b6fe0]/20 outline-none transition-all"
                placeholder="Contoh: xxxxxxxAAAAJ"
                value={scholarId}
                onChange={(e) => {
                  onScholarIdChange(e.target.value);
                  onClearChecked();
                }}
              />
            </div>
            <button
              onClick={onCheck}
              disabled={checkingInfoScholar || !scholarId}
              className="px-6 py-3 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-[10px] font-black text-body-strong dark:text-on-dark uppercase tracking-widest hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {checkingInfoScholar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScholar && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark flex items-center gap-5 shadow-xs">
              {checkedAuthorScholar.thumbnail ? (
                <img src={checkedAuthorScholar.thumbnail} className="h-16 w-16 rounded-xl object-cover shadow-xs border border-hairline-light dark:border-hairline-dark" />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-ink-soft dark:bg-surface-dark-elevated flex items-center justify-center"><User className="w-6 h-6 text-muted" /></div>
              )}
              <div className="flex-1">
                  <h4 className="text-sm font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">{checkedAuthorScholar.name}</h4>
                  <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase mt-1 leading-relaxed">{checkedAuthorScholar.affiliations}</p>
                  <button onClick={onSave} className="mt-3 text-[10px] font-black text-accent dark:text-accent-on-dark uppercase tracking-[0.15em] hover:underline flex items-center gap-1.5 cursor-pointer">
                    Konfirmasi & Simpan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="border-t border-hairline-light dark:border-hairline-dark pt-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-ink-heading dark:text-on-dark uppercase tracking-[0.2em]">Metrik Performa</h4>
            <button
              onClick={onSync}
              disabled={loadingScholar || !scholarUser.scholar_id}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScholar ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scholarData ? (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Citations', val: scholarData.total_citations, color: 'text-accent dark:text-accent-on-dark', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
                { label: 'H-Index', val: scholarData.h_index, color: 'text-success dark:text-success-on-dark', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
                { label: 'i10-Index', val: scholarData.i10_index, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-4 rounded-xl border border-hairline-light dark:border-hairline-dark text-center shadow-xs`}>
                  <p className="text-[8px] font-black text-muted dark:text-on-dark-muted uppercase tracking-widest mb-1.5">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-dashed border-hairline-light dark:border-hairline-dark">
              <Database className="mx-auto h-8 w-8 text-muted dark:text-on-dark-muted mb-3" />
              <p className="text-[10px] font-black text-muted dark:text-on-dark-muted uppercase tracking-widest">Snapshot Data Tidak Tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
