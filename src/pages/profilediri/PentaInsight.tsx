import { motion } from 'framer-motion';
import { 
  BookOpen, Zap, ShieldCheck, Book, TrendingUp, Calendar, ExternalLink, Search, AlertCircle
} from 'lucide-react';
import { ProfileTrendChart } from './ProfileCharts';

interface PentaInsightProps {
  insightsSubTab: 'publikasi' | 'penelitian' | 'hki' | 'buku';
  setInsightsSubTab: (tab: 'publikasi' | 'penelitian' | 'hki' | 'buku') => void;
  publicationSubTab: 'scopus' | 'scholar';
  setPublicationSubTab: (tab: 'scopus' | 'scholar') => void;
  scopusChartData: any;
  scholarChartData: any;
  scopusData: any;
  scholarData: any;
  tabVariants: any;
}

export default function PentaInsight({
  insightsSubTab,
  setInsightsSubTab,
  publicationSubTab,
  setPublicationSubTab,
  scopusChartData,
  scholarChartData,
  scopusData,
  scholarData,
  tabVariants
}: PentaInsightProps) {
  return (
    <motion.div
      key="insights"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Insights Sub-Navigation - More Elegant Style */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        {[
          { id: 'publikasi', label: 'Publikasi', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { id: 'penelitian', label: 'Penelitian', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { id: 'buku', label: 'Buku & Modul', icon: Book, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInsightsSubTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 min-w-[140px] ${
              insightsSubTab === tab.id 
                ? `${tab.bg} ${tab.color} ring-1 ring-inset ring-current/20` 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${insightsSubTab === tab.id ? tab.color : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm min-h-[500px] relative overflow-hidden">
         {insightsSubTab === 'publikasi' && (
            <div className="space-y-10 relative z-10">
               {/* Nested Publication Sub-tabs - Underline Style */}
               <div className="flex items-center gap-10 border-b border-slate-100 dark:border-slate-800">
                  {[
                    { id: 'scopus', label: 'Scopus Indexed' },
                    { id: 'scholar', label: 'Google Scholar' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setPublicationSubTab(sub.id as any)}
                      className={`relative pb-5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        publicationSubTab === sub.id 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {sub.label}
                      {publicationSubTab === sub.id && (
                        <motion.div 
                          layoutId="insights-subtab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-500 rounded-full" 
                        />
                      )}
                    </button>
                  ))}
               </div>

               {/* Publication Content */}
               <div className="space-y-12">
                  {publicationSubTab === 'scopus' ? (
                     <div className="space-y-10">
                        {scopusChartData.chartData.length > 0 ? (
                           <>
                              <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                 <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-primary-500/10 rounded-xl">
                                          <TrendingUp className="w-4 h-4 text-primary-500" />
                                       </div>
                                       <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Tren Publikasi Scopus</h4>
                                    </div>
                                    <div className="text-[9px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/5 px-3 py-1 rounded-full border border-primary-500/10">
                                       Last 10 Years
                                    </div>
                                 </div>
                                 <div className="h-[300px] w-full">
                                    <ProfileTrendChart 
                                       chartData={scopusChartData.chartData} 
                                       leftDomainMax={scopusChartData.leftMax} 
                                       rightDomainMax={scopusChartData.rightMax} 
                                    />
                                 </div>
                              </div>

                              {/* Document List */}
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Dokumen</h4>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Terindeks oleh Scopus Database</p>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                       {scopusData?.publications?.length || 0} Total
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4">
                                    {scopusData?.publications?.map((doc: any, idx: number) => (
                                       <motion.div 
                                          key={idx}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="group flex items-center gap-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                                       >
                                          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                             <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{doc.citations || 0}</span>
                                             <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-md text-[7px] font-black uppercase tracking-widest">Scopus</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                   <Calendar className="w-3 h-3" /> {doc.year || 'Unknown'}
                                                </span>
                                             </div>
                                             <a 
                                                href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors block line-clamp-2"
                                             >
                                                {doc.title}
                                             </a>
                                          </div>
                                          <a 
                                             href={doc.link || '#'}
                                             target="_blank"
                                             className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary-500 hover:text-white transition-all"
                                          >
                                             <ExternalLink className="w-4 h-4" />
                                          </a>
                                       </motion.div>
                                    ))}
                                 </div>
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                 <Search className="w-8 h-8 opacity-40" />
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Data Tidak Ditemukan</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-2">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="space-y-10">
                        {scholarChartData.chartData.length > 0 ? (
                           <>
                              <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                 <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-blue-500/10 rounded-xl">
                                          <TrendingUp className="w-4 h-4 text-blue-500" />
                                       </div>
                                       <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Tren Google Scholar</h4>
                                    </div>
                                 </div>
                                 <div className="h-[300px] w-full">
                                    <ProfileTrendChart 
                                       chartData={scholarChartData.chartData} 
                                       leftDomainMax={scholarChartData.leftMax} 
                                       rightDomainMax={scholarChartData.rightMax} 
                                    />
                                 </div>
                              </div>

                              {/* Document List */}
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Dokumen Scholar</h4>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data publikasi dari Google Scholar</p>
                                    </div>
                                    <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                       {scholarData?.publications?.length || 0} Total
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4">
                                    {scholarData?.publications?.map((doc: any, idx: number) => (
                                       <motion.div 
                                          key={idx}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="group flex items-center gap-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                       >
                                          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                             <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{doc.citations || 0}</span>
                                             <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md text-[7px] font-black uppercase tracking-widest">Scholar</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                   <Calendar className="w-3 h-3" /> {doc.year || 'Unknown'}
                                                </span>
                                             </div>
                                             <a 
                                                href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors block line-clamp-2"
                                             >
                                                {doc.title}
                                             </a>
                                          </div>
                                          <a 
                                             href={doc.link || '#'}
                                             target="_blank"
                                             className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"
                                          >
                                             <ExternalLink className="w-4 h-4" />
                                          </a>
                                       </motion.div>
                                    ))}
                                 </div>
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                 <Search className="w-8 h-8 opacity-40" />
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Data</p>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         )}

         {insightsSubTab !== 'publikasi' && (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 relative z-10">
               <div className="w-24 h-24 bg-slate-50/50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 shadow-inner">
                  {insightsSubTab === 'penelitian' && <Zap className="w-12 h-12" />}
                  {insightsSubTab === 'hki' && <ShieldCheck className="w-12 h-12" />}
                  {insightsSubTab === 'buku' && <Book className="w-12 h-12" />}
               </div>
               <div className="text-center space-y-3">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                     Data {insightsSubTab}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                     Sistem sedang mengintegrasikan data {insightsSubTab} Anda dari database institusi.
                  </p>
               </div>
               <div className="px-6 py-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                  <AlertCircle className="w-4 h-4" /> Feature in Development
               </div>
            </div>
         )}
      </div>
    </motion.div>
  );
}
