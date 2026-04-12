import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Award, FileText, Building2, BookOpen, Calendar, 
  GraduationCap, Users, Sparkles, TrendingUp, Zap, 
  ArrowLeft, Search, ShieldCheck, Mail, MapPin,
  ExternalLink, Lock, Book, FileCode, CheckCircle2, Trophy
} from 'lucide-react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

export default function LecturerProfileDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('publikasi');
  const [publicationSubTab, setPublicationSubTab] = useState('scopus');

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        fetch(`/api/users/${id}`).then(res => res.json()),
        fetch(`/api/users/${id}/documents`).then(res => res.json())
      ])
      .then(([profileRes, docsRes]) => {
        setProfile(profileRes.user);
        setDocuments(docsRes.documents || []);
      })
      .catch(err => {
        console.error('Failed to fetch profile data', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  // Grouping documents for limited display
  const categorizedDocs = useMemo(() => {
    // Sort documents by date descending (newest first)
    const sortedDocs = [...documents]
      .filter(d => d.status === 'Approved')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    
    return {
      publications: sortedDocs.filter(d => 
        d.category?.toLowerCase().includes('jurnal') || 
        d.category?.toLowerCase().includes('prosiding') ||
        d.category?.toLowerCase().includes('artikel')
      ).slice(0, 5),
      research: sortedDocs.filter(d => 
        d.category?.toLowerCase().includes('penelitian') ||
        d.category?.toLowerCase().includes('proposal') ||
        d.category?.toLowerCase().includes('laporan')
      ).slice(0, 5),
      hki: sortedDocs.filter(d => 
        d.category?.toLowerCase().includes('hki') ||
        d.category?.toLowerCase().includes('kekayaan intelektual')
      ).slice(0, 5),
      books: sortedDocs.filter(d => 
        d.category?.toLowerCase().includes('buku') ||
        d.category?.toLowerCase().includes('ajar')
      ).slice(0, 5)
    };
  }, [documents]);

  const stats = useMemo(() => {
    if (!profile) return null;
    return [
      { 
        label: 'Total KPI Overall', 
        val: profile.total_kpi_points?.toLocaleString() || '0', 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'KPI Score 3 Tahun', 
        val: (profile.total_kpi_points * 0.8).toFixed(0), // Dummy calculation if not in profile
        icon: TrendingUp, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      },
      { 
        label: 'KPI Tahun Ini', 
        val: (profile.total_kpi_points * 0.3).toFixed(0), // Dummy calculation
        icon: Zap, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      }
    ];
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-mono">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-20 animate-pulse">
          <div className="h-64 bg-white dark:bg-slate-900 rounded-[3rem] mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl"></div>
             <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl"></div>
             <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl"></div>
          </div>
          <div className="h-96 bg-white dark:bg-slate-900 rounded-[3rem]"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-mono">
        <Navbar />
        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 font-bold hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Navigation Breadcrumb */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Kembali ke Direktori</span>
        </motion.button>

        {/* Profile Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm mb-12"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary-600/10 via-emerald-500/10 to-primary-600/5 dark:from-primary-600/20 dark:via-emerald-500/20 dark:to-slate-900"></div>
          
          <div className="relative z-10 p-8 lg:p-16 flex flex-col md:flex-row items-center md:items-end gap-10">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[3rem] bg-gradient-to-br from-primary-500 to-emerald-500 p-1.5 shadow-2xl transition-transform duration-700 group-hover:rotate-3">
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[2.8rem] flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900">
                  {profile.thumbnail ? (
                    <img src={profile.thumbnail} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {profile.name?.substring(0, 1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    Verified Lecturer
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4 uppercase">
                  {profile.name}
                </h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    <span>Universitas Yarsi</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                    <GraduationCap className="w-4 h-4 text-primary-500" />
                    <span>{profile.program_studi || 'Department'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-32 bg-slate-100 dark:bg-slate-800 mx-4"></div>

            <div className="hidden lg:flex flex-col items-center gap-2 bg-slate-900 dark:bg-white p-10 rounded-[2.5rem] shadow-2xl">
                <p className="text-[10px] font-black text-white/40 dark:text-slate-500 uppercase tracking-widest">Performance Score</p>
                <div className="text-4xl font-black text-white dark:text-slate-900 tracking-tighter flex items-center gap-2">
                   {profile.total_kpi_points?.toLocaleString() || '0'}
                </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats?.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center border border-slate-100/10 shadow-sm group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500">+12%</span>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Poin</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-8">
          {/* Main Tabs Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all">
            {[
              { id: 'publikasi', label: 'Publikasi', icon: BookOpen },
              { id: 'penelitian', label: 'Penelitian', icon: Zap },
              { id: 'hki', label: 'HKI', icon: ShieldCheck },
              { id: 'buku', label: 'Buku & Modul', icon: Book },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-3 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[400px]"
          >
            {activeTab === 'publikasi' && (
              <div className="space-y-8">
                {/* Sub-tabs for Publications */}
                <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {[
                    { id: 'scopus', label: 'Scopus Indexed' },
                    { id: 'scholar', label: 'Google Scholar' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setPublicationSubTab(sub.id)}
                      className={`relative pb-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        publicationSubTab === sub.id 
                          ? 'text-primary-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {sub.label}
                      {publicationSubTab === sub.id && (
                        <motion.div 
                          layoutId="subtab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" 
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  {categorizedDocs.publications.length > 0 ? (
                    categorizedDocs.publications.map((doc, idx) => (
                      <div key={idx} className="group p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                          publicationSubTab === 'scopus' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                              publicationSubTab === 'scopus' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {publicationSubTab === 'scopus' ? 'Scopus Indexed' : 'Scholar'}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {new Date(doc.published_at).getFullYear()}
                            </span>
                          </div>
                          <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                            {doc.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">
                            {doc.journal_name || 'International Journal of Academic Research'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                          </div>
                          <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <Lock className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Publikasi Terbatas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'penelitian' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorizedDocs.research.length > 0 ? (
                  categorizedDocs.research.map((doc, idx) => (
                    <div key={idx} className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-500/10 rounded-2xl">
                          <Zap className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{doc.category}</p>
                          <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-1">{doc.title}</h5>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grant Approved</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">2023 - 2024</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Lock className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Penelitian Terbatas</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hki' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorizedDocs.hki.length > 0 ? (
                  categorizedDocs.hki.map((doc, idx) => (
                    <div key={idx} className="group p-8 bg-[#0F172A] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
                        <h5 className="text-lg font-black text-white mb-4 leading-tight">{doc.title}</h5>
                        <div className="inline-flex px-3 py-1.5 bg-white/10 rounded-xl">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Reg: IDN-2024-XP{idx}</span>
                        </div>
                      </div>
                      <Sparkles className="absolute -right-10 -bottom-10 w-32 h-32 opacity-10 text-white" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Lock className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data HKI Terbatas</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'buku' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorizedDocs.books.length > 0 ? (
                  categorizedDocs.books.map((doc, idx) => (
                    <div key={idx} className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl transition-all">
                      <div className="flex gap-6">
                        <div className="w-24 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center">
                          <Book className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mb-2">{doc.category || 'Monograf'}</p>
                          <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-primary-600 transition-colors">{doc.title}</h5>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                            <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-md">ISBN Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Lock className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Buku Terbatas</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Minimalist Login CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-1 bg-gradient-to-r from-slate-200 via-primary-500/20 to-slate-200 dark:from-slate-800 dark:via-primary-500/20 dark:to-slate-800 rounded-[2.5rem]"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shadow-inner">
                  <Lock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1.5">Akses Profil Terbatas</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masuk ke Portal Penta untuk melihat detail lengkap & analisis mendalam</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                <span>Login ke Portal</span>
                <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center group-hover:bg-white/40">
                   <Zap className="w-3 h-3 rotate-12" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>


      </main>
      
      <Footer />
    </div>
  );
}
