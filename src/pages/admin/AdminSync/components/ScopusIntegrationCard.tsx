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
    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-orange-100/50 dark:border-orange-950/20 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-8 py-6 border-b border-orange-50 dark:border-orange-950/30 bg-orange-50/20 dark:bg-orange-950/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl mr-4 shadow-sm">
            <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-black text-orange-950 dark:text-zinc-100 uppercase tracking-tight">Id Scopus</h3>
        </div>
        {messageScopus && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100/20">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
            {messageScopus}
          </motion.span>
        )}
      </div>
      
      <div className="p-8 space-y-8">
        {/* ID Editor */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Scopus Author ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-305 dark:text-zinc-600"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/30 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 outline-none transition-all"
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
              className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {checkingInfoScopus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScopus && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-orange-50/20 to-white dark:from-orange-950/10 dark:to-zinc-900/50 rounded-2xl border border-orange-100/30 dark:border-orange-900/20 flex flex-col gap-2 shadow-sm">
              <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScopus.name}</h4>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase leading-relaxed">{checkedAuthorScopus.affiliations}</p>
              <button onClick={onSave} className="mt-2 text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.15em] hover:text-orange-700 dark:hover:text-orange-300 underline flex items-center gap-1.5 w-fit">
                Verifikasi & Link ID <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-gray-950 dark:text-zinc-100 uppercase tracking-[0.2em]">Statistik Output</h4>
            <button
              onClick={onSync}
              disabled={loadingScopus || !scholarUser.scopus_id}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScopus ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scopusData ? (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Documents', val: scopusData.document_count, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50/30 dark:bg-orange-950/10' },
                { label: 'Citations', val: scopusData.total_citations, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50/30 dark:bg-sky-950/10' },
                { label: 'H-Index', val: scopusData.h_index, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50/30 dark:bg-teal-950/10' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 text-center shadow-sm`}>
                  <p className="text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50/30 dark:bg-zinc-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
              <Database className="mx-auto h-8 w-8 text-gray-355 dark:text-zinc-700 mb-3" />
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Data Scopus Belum Terpetakan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
