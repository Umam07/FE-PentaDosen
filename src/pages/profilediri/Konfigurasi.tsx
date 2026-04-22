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
  handleSync: () => Promise<void>;
  handleSyncScopus: () => Promise<void>;
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
  tabVariants
}: KonfigurasiProps) {
  return (
    <motion.div 
      key="integrasi"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
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

      <div className="grid grid-cols-1 gap-8">
        {/* Google Scholar Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                Google Scholar
              </h3>
              {scholarData && (
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Synced
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Scholar Author ID</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="e.g., xxxxxxxAAAAJ"
                      value={scholarId}
                      onChange={(e) => {
                        setScholarId(e.target.value);
                        setCheckedAuthor(null);
                      }}
                      className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCheckId}
                        disabled={checkingInfo || !scholarId}
                        className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {checkingInfo ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Verifikasi'}
                      </button>
                      <button
                        onClick={handleSaveScholarId}
                        disabled={loading || !scholarId || (scholarId !== user.scholar_id && !checkedAuthor)}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                      >
                        Simpan ID
                      </button>
                    </div>
                  </div>
                </div>

                {checkedAuthor && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                      {checkedAuthor.thumbnail ? <img src={checkedAuthor.thumbnail} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{checkedAuthor.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{checkedAuthor.affiliations}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Citations', value: scholarData?.total_citations, icon: TrendingUp, color: 'text-blue-500' },
                    { label: 'h-index', value: scholarData?.h_index, icon: Award, color: 'text-purple-500' },
                    { label: 'i10-index', value: scholarData?.i10_index, icon: Zap, color: 'text-orange-500' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                      <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-2`} />
                      <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none">{s.value || 0}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSync}
                  disabled={loading || !scholarId}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Sinkronisasi Data Scholar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Scopus Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <Hash className="w-6 h-6" />
                </div>
                Scopus Database
              </h3>
              {scopusData && (
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Synced
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Author Scopus ID</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="e.g., 57211234567"
                      value={scopusId}
                      onChange={(e) => {
                        setScopusId(e.target.value);
                        setCheckedScopusAuthor(null);
                      }}
                      className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCheckScopusId}
                        disabled={checkingScopus || !scopusId}
                        className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {checkingScopus ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Verifikasi'}
                      </button>
                      <button
                        onClick={handleSaveScopusId}
                        disabled={loading || !scopusId || (scopusId !== user.scopus_id && !checkedScopusAuthor)}
                        className="flex-1 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
                      >
                        Simpan ID
                      </button>
                    </div>
                  </div>
                </div>

                {checkedScopusAuthor && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-pink-500/5 rounded-2xl border border-pink-500/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{checkedScopusAuthor.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{checkedScopusAuthor.affiliations}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Documents', value: scopusData?.document_count, icon: BookOpen, color: 'text-blue-500' },
                    { label: 'Citations', value: scopusData?.total_citations, icon: TrendingUp, color: 'text-pink-500' },
                    { label: 'h-index', value: scopusData?.h_index, icon: Award, color: 'text-purple-500' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                      <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-2`} />
                      <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none">{s.value || 0}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSyncScopus}
                  disabled={loading || !scopusId}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Sinkronisasi Data Scopus
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
