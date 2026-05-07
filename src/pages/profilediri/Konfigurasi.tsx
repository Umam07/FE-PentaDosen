import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Hash, TrendingUp, RefreshCw, CheckCircle, AlertCircle, User, Zap,
  Award, BookOpen
} from 'lucide-react';
import { ProfileTrendChart } from './ProfileCharts';

interface KonfigurasiProps {
  user: any;
  setUser: (user: any) => void;
  scholarId: string;
  setScholarId: (id: string) => void;
  scopusId: string;
  setScopusId: (id: string) => void;
  scholarData: any;
  setScholarData: (data: any) => void;
  scopusData: any;
  setScopusData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  checkingInfo: boolean;
  setCheckingInfo: (checking: boolean) => void;
  checkingScopus: boolean;
  setCheckingScopus: (checking: boolean) => void;
  checkedAuthor: any;
  setCheckedAuthor: (author: any) => void;
  checkedScopusAuthor: any;
  setCheckedScopusAuthor: (author: any) => void;
  message: { text: string; type: 'success' | 'error' | '' };
  setMessage: (msg: { text: string; type: 'success' | 'error' | '' }) => void;
  scholarChartData: any;
  scopusChartData: any;
  handleCheckId: () => Promise<void>;
  handleSaveScholarId: () => Promise<void>;
  handleCheckScopusId: () => Promise<void>;
  handleSaveScopusId: () => Promise<void>;
  handleDeleteScholarId: () => Promise<void>;
  handleDeleteScopusId: () => Promise<void>;
  handleSync: () => Promise<void>;
  handleSyncScopus: () => Promise<void>;
  handleSyncAll: () => Promise<void>;
  tabVariants: any;
}

export default function Konfigurasi({
  user,
  setUser,
  scholarId,
  setScholarId,
  scopusId,
  setScopusId,
  scholarData,
  setScholarData,
  scopusData,
  setScopusData,
  loading,
  setLoading,
  checkingInfo,
  setCheckingInfo,
  checkingScopus,
  setCheckingScopus,
  checkedAuthor,
  setCheckedAuthor,
  checkedScopusAuthor,
  setCheckedScopusAuthor,
  message,
  setMessage,
  scholarChartData,
  scopusChartData,
  handleCheckId,
  handleSaveScholarId,
  handleCheckScopusId,
  handleSaveScopusId,
  handleSync,
  handleSyncScopus,
  handleSyncAll,
  handleDeleteScholarId,
  handleDeleteScopusId,
  tabVariants
}: KonfigurasiProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'scholar' | 'scopus' | null }>({ type: null });

  const confirmDelete = async () => {
    if (showDeleteConfirm.type === 'scholar') {
      await handleDeleteScholarId();
    } else if (showDeleteConfirm.type === 'scopus') {
      await handleDeleteScopusId();
    }
    setShowDeleteConfirm({ type: null });
  };

  return (
    <motion.div 
      key="integrasi"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm.type && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Konfirmasi Hapus</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
                Apakah Anda yakin ingin menghapus ID {showDeleteConfirm.type === 'scholar' ? 'Google Scholar' : 'Scopus'}? Data yang tersinkronisasi akan dihapus dari profil Anda.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm({ type: null })}
                  className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-500/20"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Status Notifications */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl backdrop-blur-md border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-600 border-red-500/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Sync Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 dark:bg-white p-5 rounded-[2rem] shadow-xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center text-white dark:text-slate-900 backdrop-blur-md border border-white/10 dark:border-slate-900/10">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-black text-white dark:text-slate-900 uppercase tracking-widest leading-tight">Sinkronisasi Data</h4>
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Perbarui metrik Scopus & Scholar</p>
          </div>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={loading || (!scholarId && !scopusId)}
          className="relative z-10 w-full sm:w-auto px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2.5"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Sinkronkan Semua
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Google Scholar Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                Google Scholar
              </h3>
              {scholarData && (
                <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  Synced
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-6">
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Scholar Author ID</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="e.g., xxxxxxxAAAAJ"
                      value={scholarId}
                      onChange={(e) => {
                        setScholarId(e.target.value);
                        setCheckedAuthor(null);
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCheckId}
                        disabled={checkingInfo || !scholarId}
                        className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {checkingInfo ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Verifikasi'}
                      </button>
                      <button
                        onClick={handleSaveScholarId}
                        disabled={loading || !scholarId || (scholarId !== user.scholar_id && !checkedAuthor)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                      >
                        Simpan ID
                      </button>
                      {user.scholar_id && (
                        <button
                          onClick={() => setShowDeleteConfirm({ type: 'scholar' })}
                          className="px-4 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {checkedAuthor && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                      {checkedAuthor.thumbnail ? <img src={checkedAuthor.thumbnail} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{checkedAuthor.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 truncate mt-0.5">{checkedAuthor.affiliations}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Citations', value: scholarData?.total_citations, icon: TrendingUp, color: 'text-blue-500' },
                  { label: 'h-index', value: scholarData?.h_index, icon: Award, color: 'text-purple-500' },
                  { label: 'i10-index', value: scholarData?.i10_index, icon: Zap, color: 'text-orange-500' },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1.5`} />
                    <p className="text-[9px] font-black text-slate-900 dark:text-white leading-none">{s.value || 0}</p>
                    <p className="text-[6.5px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scopus Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <Hash className="w-5 h-5" />
                </div>
                Scopus Database
              </h3>
              {scopusData && (
                <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  Synced
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-6">
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Author Scopus ID</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="e.g., 57211234567"
                      value={scopusId}
                      onChange={(e) => {
                        setScopusId(e.target.value);
                        setCheckedScopusAuthor(null);
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCheckScopusId}
                        disabled={checkingScopus || !scopusId}
                        className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {checkingScopus ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Verifikasi'}
                      </button>
                      <button
                        onClick={handleSaveScopusId}
                        disabled={loading || !scopusId || (scopusId !== user.scopus_id && !checkedScopusAuthor)}
                        className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
                      >
                        Simpan ID
                      </button>
                      {user.scopus_id && (
                        <button
                          onClick={() => setShowDeleteConfirm({ type: 'scopus' })}
                          className="px-4 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {checkedScopusAuthor && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-3.5 bg-pink-500/5 rounded-xl border border-pink-500/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{checkedScopusAuthor.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 truncate mt-0.5">{checkedScopusAuthor.affiliations}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Documents', value: scopusData?.document_count, icon: BookOpen, color: 'text-blue-500' },
                  { label: 'Citations', value: scopusData?.total_citations, icon: TrendingUp, color: 'text-pink-500' },
                  { label: 'h-index', value: scopusData?.h_index, icon: Award, color: 'text-purple-500' },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1.5`} />
                    <p className="text-[9px] font-black text-slate-900 dark:text-white leading-none">{s.value || 0}</p>
                    <p className="text-[6.5px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
