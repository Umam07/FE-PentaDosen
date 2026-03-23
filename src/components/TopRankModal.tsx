import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, FileText, Building2, BookOpen, Calendar, CheckCircle2, GraduationCap, Users, Sparkles } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('jurnal') || cat.includes('prosiding') || cat.includes('artikel') || cat.includes('penelitian')) return <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;
  if (cat.includes('pengabdian') || cat.includes('masyarakat')) return <Users className="w-3.5 h-3.5 text-teal-500" />;
  if (cat.includes('pendidikan') || cat.includes('mengajar') || cat.includes('ajar')) return <GraduationCap className="w-3.5 h-3.5 text-lime-500" />;
  return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
};

interface TopRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

export default function TopRankModal({ isOpen, onClose, userId }: TopRankModalProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      Promise.all([
        fetch(`/api/users/${userId}`).then(res => res.json()),
        fetch(`/api/users/${userId}/documents`).then(res => res.json())
      ])
      .then(([profileRes, docsRes]) => {
        setProfile(profileRes.user);
        
        // Filter and sort KPI documents
        // is_kpi_counted might be boolean or 1/0
        const kpiDocs = docsRes.documents?.filter(
          (doc: any) => doc.is_kpi_counted && doc.awarded_points > 0 && doc.status === 'Approved'
        ) || [];
        
        setDocuments(kpiDocs.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      })
      .catch(err => {
        console.error('Failed to fetch modal data', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, userId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-zinc-800/80 overflow-hidden flex flex-col max-h-[85vh] relative"
          >
            {/* Header Profile Section */}
            <div className="relative p-6 sm:p-8 overflow-hidden bg-zinc-950 text-white shrink-0">
              {/* Background Glows */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-teal-950 to-emerald-900 opacity-95"></div>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-25"></div>
              <div className="absolute -bottom-12 right-12 w-48 h-48 bg-teal-500 rounded-full blur-[80px] opacity-20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_90%)]"></div>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all hover:scale-105 duration-200 text-white/80 hover:text-white z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {loading ? (
                <div className="flex animate-pulse items-center gap-5 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-white/10 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                    <div className="h-10 bg-white/10 rounded-xl w-32 mt-4"></div>
                  </div>
                </div>
              ) : profile ? (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 flex items-center justify-center font-black text-3xl sm:text-4xl text-white shadow-2xl shrink-0 uppercase tracking-widest"
                  >
                      {profile.name?.substring(0, 2)}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h2 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl sm:text-3xl font-black mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-r from-white via-white to-zinc-300 bg-clip-text text-transparent"
                    >
                      {profile.name}
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-semibold text-white/90 items-center select-none"
                    >
                      <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{profile.fakultas || 'Fakultas'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>{profile.program_studi || 'Prodi'}</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-5 flex justify-center sm:justify-start"
                    >
                       <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 backdrop-blur-xl border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg relative overflow-hidden">
                          <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md"
                          >
                             <Award className="w-4 h-4 text-white" />
                          </motion.div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-extrabold text-amber-200/80 uppercase tracking-wider leading-none mb-0.5">Total KPI Poin</span>
                             <span className="text-xl font-black text-amber-300 tabular-nums">{profile.total_kpi_points?.toLocaleString() || 0}</span>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                       </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-white/50">Profil tidak ditemukan</div>
              )}
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-8 relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Dokumen Berkinerja (KPI)
                </h3>
                <span className="text-[11px] font-black bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1.5 rounded-full tracking-wider">
                  {!loading ? documents.length : 0} ITEMS
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 h-[90px]"></div>
                  ))}
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-3 pb-2">
                  {documents.map((doc, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, type: "spring", stiffness: 100, damping: 15 }}
                      key={doc.id}
                      className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_25px_-10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_25px_-10px_rgba(0,0,0,0.4)] transition-all duration-300 group relative overflow-hidden flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:translate-y-[-2px]"
                    >
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full translate-y-3 scale-75"></div>
                       
                       <div className="flex-1 min-w-0 pl-2">
                         <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                           {doc.title}
                         </h4>
                         
                         <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                           <div className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-200/10">
                             {getCategoryIcon(doc.category)}
                             <span className="truncate max-w-[150px]">{doc.category}</span>
                           </div>
                           
                           <div className="flex items-center gap-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-zinc-200/10">
                             <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                             <span>{new Date(doc.published_at).getFullYear()}</span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-zinc-100 dark:border-zinc-800 sm:border-t-0 pt-3 sm:pt-0 shrink-0 gap-1">
                         <div className="text-[9px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest sm:text-right w-full">Poin</div>
                         <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm w-fit tabular-nums">
                           +{doc.awarded_points}
                         </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-zinc-300 dark:text-zinc-600">
                     <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-100 font-bold mb-1">Belum Ada Dokumen</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[250px]">Dosen ini belum memiliki dokumen yang disetujui untuk poin KPI.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
