import React from 'react';
import {
  Globe, Zap, ArrowRight, RefreshCw,
  CheckCircle2, Database, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ScopusIntegrationCardProps } from '../types/adminSync.types';

export default function ScopusIntegrationCard({
  scopusId,
  scopusData,
  scholarUser,
  loadingScopus,
  checkingInfoScopus,
  checkedAuthorScopus,
  messageScopus,
  onScopusIdChange,
  onCheck,
  onSave,
  onSync,
  onClearChecked,
}: ScopusIntegrationCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-8 py-6 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2.5 bg-[#e07b39]/10 text-[#e07b39] dark:text-[#d99568] rounded-lg mr-4 shadow-xs">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">Id Scopus</h3>
        </div>
        {messageScopus && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-success dark:text-success-on-dark flex items-center bg-success-soft dark:bg-surface-dark-elevated px-4 py-2 rounded-lg uppercase tracking-widest border border-success-border dark:border-hairline-dark">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
            {messageScopus}
          </motion.span>
        )}
      </div>
      
      <div className="p-8 space-y-8">
        {/* ID Editor */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted dark:text-on-dark-muted uppercase tracking-[0.2em] ml-1">Scopus Author ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted dark:text-on-dark-muted"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-sm font-bold text-ink-heading dark:text-on-dark focus:border-[#e07b39] focus:ring-2 focus:ring-[#e07b39]/20 outline-none transition-all"
                placeholder="Contoh: 57xxxxxxxxx"
                value={scopusId}
                onChange={(e) => {
                  onScopusIdChange(e.target.value);
                  onClearChecked();
                }}
              />
            </div>
            <button
              onClick={onCheck}
              disabled={checkingInfoScopus || !scopusId}
              className="px-6 py-3 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-[10px] font-black text-body-strong dark:text-on-dark uppercase tracking-widest hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {checkingInfoScopus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScopus && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark flex flex-col gap-2 shadow-xs">
              <h4 className="text-sm font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">{checkedAuthorScopus.name}</h4>
              <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase leading-relaxed">{checkedAuthorScopus.affiliations}</p>
              <button onClick={onSave} className="mt-2 text-[10px] font-black text-[#e07b39] dark:text-[#d99568] uppercase tracking-[0.15em] hover:underline flex items-center gap-1.5 w-fit cursor-pointer">
                Verifikasi & Link ID <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="border-t border-hairline-light dark:border-hairline-dark pt-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-ink-heading dark:text-on-dark uppercase tracking-[0.2em]">Statistik Output</h4>
            <button
              onClick={onSync}
              disabled={loadingScopus || !scholarUser.scopus_id}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScopus ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scopusData ? (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Documents', val: scopusData.document_count, color: 'text-[#e07b39] dark:text-[#d99568]', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
                { label: 'Citations', val: scopusData.total_citations, color: 'text-accent dark:text-accent-on-dark', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
                { label: 'H-Index', val: scopusData.h_index, color: 'text-success dark:text-success-on-dark', bg: 'bg-surface-light-raised dark:bg-surface-dark-elevated' },
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
              <p className="text-[10px] font-black text-muted dark:text-on-dark-muted uppercase tracking-widest">Data Scopus Belum Terpetakan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
