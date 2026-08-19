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
    <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden">
      <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-chart-scopus/10 text-chart-scopus dark:text-chart-scopus-dark rounded-xl mr-3 border border-chart-scopus/20">
            <Globe className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">ID Scopus</h3>
        </div>
        {messageScopus && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-semibold text-success-dark dark:text-success-on-dark flex items-center bg-success-soft dark:bg-success/15 px-3 py-1 rounded-full uppercase tracking-wider border border-success-border dark:border-success/30">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            {messageScopus}
          </motion.span>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        {/* ID Editor */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">Scopus Author ID</label>
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-on-dark-muted"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated text-xs font-mono font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted dark:placeholder:text-on-dark-muted"
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
              className="px-5 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider transition-all disabled:opacity-40 shadow-xs cursor-pointer"
            >
              {checkingInfoScopus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScopus && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-3 p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft flex flex-col gap-1.5 shadow-xs">
              <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark">{checkedAuthorScopus.name}</h4>
              <p className="text-[10px] font-medium text-muted dark:text-on-dark-muted line-clamp-1">{checkedAuthorScopus.affiliations}</p>
              <button onClick={onSave} className="mt-2 text-xs font-semibold text-accent dark:text-accent-on-dark uppercase tracking-wider hover:underline flex items-center gap-1 w-fit cursor-pointer">
                Verifikasi & Link ID <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="border-t border-hairline-light-soft dark:border-hairline-dark-soft pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">Statistik Output</h4>
            <button
              onClick={onSync}
              disabled={loadingScopus || !scholarUser.scopus_id}
              className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScopus ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scopusData ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Documents', val: scopusData.document_count, color: 'text-chart-scopus dark:text-chart-scopus-dark' },
                { label: 'Citations', val: scopusData.total_citations, color: 'text-ink-heading dark:text-on-dark' },
                { label: 'H-Index', val: scopusData.h_index, color: 'text-success-dark dark:text-success-on-dark' },
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
              <p className="text-xs font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider">Data Scopus Belum Terpetakan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
