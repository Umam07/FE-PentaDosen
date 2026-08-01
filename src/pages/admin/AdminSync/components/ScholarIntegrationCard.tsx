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
    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-blue-100/50 dark:border-blue-950/20 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-8 py-6 border-b border-blue-50 dark:border-blue-950/30 bg-blue-50/20 dark:bg-blue-950/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4 shadow-sm">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-black text-blue-950 dark:text-zinc-100 uppercase tracking-tight">Id Scholar</h3>
        </div>
        {messageScholar && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100/20">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
            {messageScholar}
          </motion.span>
        )}
      </div>
      
      <div className="p-8 space-y-8">
        {/* ID Editor */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Google Scholar ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-305 dark:text-zinc-600"><Zap className="w-4 h-4" /></div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/30 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
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
              className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {checkingInfoScholar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
            </button>
          </div>
          
          {/* Verification Result */}
          {checkedAuthorScholar && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-blue-50/20 to-white dark:from-blue-950/10 dark:to-zinc-900/50 rounded-2xl border border-blue-100/30 dark:border-blue-900/20 flex items-center gap-5 shadow-sm">
              {checkedAuthorScholar.thumbnail ? (
                <img src={checkedAuthorScholar.thumbnail} className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-zinc-800" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
              )}
              <div className="flex-1">
                  <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScholar.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 leading-relaxed">{checkedAuthorScholar.affiliations}</p>
                  <button onClick={onSave} className="mt-3 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] hover:text-blue-700 dark:hover:text-blue-300 underline flex items-center gap-1.5">
                    Konfirmasi & Simpan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-gray-950 dark:text-zinc-100 uppercase tracking-[0.2em]">Metrik Performa</h4>
            <button
              onClick={onSync}
              disabled={loadingScholar || !scholarUser.scholar_id}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScholar ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>

          {scholarData ? (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Citations', val: scholarData.total_citations, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/30 dark:bg-blue-950/10' },
                { label: 'H-Index', val: scholarData.h_index, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/30 dark:bg-emerald-950/10' },
                { label: 'i10-Index', val: scholarData.i10_index, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/30 dark:bg-purple-950/10' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 text-center shadow-sm`}>
                  <p className="text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50/30 dark:bg-zinc-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
              <Database className="mx-auto h-8 w-8 text-gray-350 dark:text-zinc-700 mb-3" />
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Snapshot Data Tidak Tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
