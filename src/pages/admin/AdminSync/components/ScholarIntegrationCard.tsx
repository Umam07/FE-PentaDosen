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
    <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden">
      <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-chart-scholar/10 text-chart-scholar dark:text-chart-scholar-dark rounded-xl mr-3 border border-chart-scholar/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">ID Google Scholar</h3>
        </div>
        {messageScholar && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-semibold text-success-dark dark:text-success-on-dark flex items-center bg-success-soft dark:bg-success/15 px-3 py-1 rounded-full uppercase tracking-wider border border-success-border dark:border-success/30">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            {messageScholar}
          </motion.span>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        {/* ID Editor */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">Google Scholar ID</label>
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-on-dark-muted"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated text-xs font-mono font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted dark:placeholder:text-on-dark-muted"
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
              className="px-5 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider transition-all disabled:opacity-40 shadow-xs cursor-pointer"
            >
              {checkingInfoScholar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScholar && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-3 p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center gap-4 shadow-xs">
              {checkedAuthorScholar.thumbnail ? (
                <img src={checkedAuthorScholar.thumbnail} className="h-12 w-12 rounded-xl object-cover shadow-xs border border-hairline-light dark:border-hairline-dark" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-muted"><User className="w-5 h-5" /></div>
              )}
              <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark truncate">{checkedAuthorScholar.name}</h4>
                  <p className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-0.5 line-clamp-1">{checkedAuthorScholar.affiliations}</p>
                  <button onClick={onSave} className="mt-2 text-xs font-semibold text-accent dark:text-accent-on-dark uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer">
                    Konfirmasi & Simpan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="border-t border-hairline-light-soft dark:border-hairline-dark-soft pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">Metrik Performa</h4>
            <button
              onClick={onSync}
              disabled={loadingScholar || !scholarUser.scholar_id}
              className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScholar ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scholarData ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Citations', val: scholarData.total_citations, color: 'text-ink-heading dark:text-on-dark' },
                { label: 'H-Index', val: scholarData.h_index, color: 'text-success-dark dark:text-success-on-dark' },
                { label: 'i10-Index', val: scholarData.i10_index, color: 'text-chart-scholar dark:text-chart-scholar-dark' },
              ].map((s, i) => (
                <div key={i} className="bg-surface-light-raised dark:bg-surface-dark-elevated p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center shadow-xs">
                  <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-xl font-bold font-mono ${s.color} tabular-nums`}>{s.val ?? 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-dashed border-hairline-light dark:border-hairline-dark">
              <Database className="mx-auto h-6 w-6 text-muted-soft dark:text-on-dark-muted mb-2" />
              <p className="text-xs font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider">Snapshot Data Tidak Tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
