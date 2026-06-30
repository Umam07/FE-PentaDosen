import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, GraduationCap, 
  BookOpen, ChevronRight, ArrowLeft, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

const FAKULTAS_THEMES: Record<string, {
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  glowColor: string;
}> = {
  'Fakultas Kedokteran': {
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
    glowColor: 'group-hover:shadow-emerald-500/5'
  },
  'Fakultas Kedokteran Gigi': {
    color: 'bg-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30',
    glowColor: 'group-hover:shadow-purple-500/5'
  },
  'Fakultas Teknologi Informasi': {
    color: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-900/30',
    glowColor: 'group-hover:shadow-sky-500/5'
  },
  'Fakultas Ekonomi dan Bisnis': {
    color: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
    glowColor: 'group-hover:shadow-amber-500/5'
  },
  'Fakultas Hukum': {
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    badgeClass: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30',
    glowColor: 'group-hover:shadow-red-500/5'
  },
  'Fakultas Psikologi': {
    color: 'bg-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    badgeClass: 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-100/50 dark:border-pink-900/30',
    glowColor: 'group-hover:shadow-pink-500/5'
  }
};

const getFakultasTheme = (fakultasName?: string) => {
  return FAKULTAS_THEMES[fakultasName || ''] || {
    color: 'bg-primary-500',
    textColor: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
    badgeClass: 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border-primary-100/50 dark:border-primary-900/30',
    glowColor: 'group-hover:shadow-primary-500/5'
  };
};

export default function LecturerList() {
  const [searchParams] = useSearchParams();
  const initialFakultas = searchParams.get('fakultas') || 'Semua';

  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState(initialFakultas);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setLecturers(data.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch lecturers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  const fakultasOptions = ['Semua', ...new Set(lecturers.map(l => l.fakultas).filter(Boolean))];

  const filteredLecturers = lecturers.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.fakultas && l.fakultas.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFakultas = selectedFakultas === 'Semua' || l.fakultas === selectedFakultas;
    return matchesSearch && matchesFakultas;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-sans">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden p-8 lg:p-12 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-850 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6">
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Kembali</span>
              </motion.button>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[0.9]"
                >
                  Direktori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Dosen</span>
                </motion.h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-base leading-relaxed">
                  Basis data akademis terverifikasi untuk seluruh dosen <span className="text-slate-900 dark:text-white font-extrabold">Penta</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative group min-w-[320px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Cari nama atau fakultas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                />
              </div>

              {/* Stats Summary in Header */}
              <div className="flex items-center gap-8 px-6 py-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 backdrop-blur-sm">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Terdaftar</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">{filteredLecturers.length} Orang</p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-850"></div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fakultas</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">6 Unit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Strip */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 px-1">
            <Filter className="w-4 h-4 text-primary-500" />
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-[0.25em]">Filter Fakultas</h4>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {fakultasOptions.map((fak) => (
              <button
                key={fak}
                onClick={() => setSelectedFakultas(fak)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedFakultas === fak 
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20 scale-[1.02]' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {fak}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Lecturer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loading
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-800/80 h-[480px] animate-pulse space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  </div>
                  <div className="h-32 bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                    </div>
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                </div>
              ))
            ) : filteredLecturers.length > 0 ? (
              filteredLecturers.map((lecturer, index) => {
                const theme = getFakultasTheme(lecturer.fakultas);
                return (
                  <motion.div
                    key={lecturer.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ delay: index * 0.03 }}
                    className={`group relative bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-xl ${theme.glowColor} hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[480px]`}
                    onClick={() => navigate(`/lecturer/${lecturer.id}`)}
                  >
                    {/* Decorative background glow */}
                    <div className={`absolute -right-8 -top-8 w-24 h-24 ${theme.color} opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 rounded-full blur-xl transition-all duration-700`}></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between flex-1">
                      <div className="space-y-5">
                        {/* Top Row: Avatar & Penta ID */}
                        <div className="flex justify-between items-start">
                          <div className={`w-14 h-14 rounded-2xl ${theme.bgColor} flex items-center justify-center font-bold text-lg ${theme.textColor} shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
                            {lecturer.thumbnail ? (
                              <img src={lecturer.thumbnail} alt={lecturer.name} className="w-full h-full object-cover" />
                            ) : (
                              lecturer.name.charAt(0)
                            )}
                          </div>
                          <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                              Penta ID: <span className="text-slate-800 dark:text-slate-200 font-semibold">{lecturer.penta_id || `712400${index + 1}`}</span>
                            </p>
                          </div>
                        </div>

                        {/* Title & Info tags */}
                        <div className="space-y-3">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {lecturer.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeClass}`}>
                              {lecturer.fakultas || 'N/A'}
                            </span>
                            {lecturer.program_studi && (
                              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md">
                                {lecturer.program_studi}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Scholar & Scopus Metrics block */}
                        <div className="space-y-4 py-4 border-y border-slate-100 dark:border-slate-800/60">
                          {/* Scholar Metrics */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Google Scholar</span>
                              </div>
                              <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Metrics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/50 dark:border-slate-900/50 text-center">
                              <div>
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Citations</p>
                                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.total_citations || 0}</p>
                              </div>
                              <div className="border-l border-slate-200/50 dark:border-slate-800/50">
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">H-Index</p>
                                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.h_index || 0}</p>
                              </div>
                            </div>
                          </div>

                          {/* Scopus Metrics */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Scopus</span>
                              </div>
                              <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Metrics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/50 dark:border-slate-900/50 text-center">
                              <div>
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Citations</p>
                                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.scopus_total_citations || 0}</p>
                              </div>
                              <div className="border-l border-slate-200/50 dark:border-slate-800/50">
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">H-Index</p>
                                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.scopus_h_index || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: KPI & Nav button */}
                      <div className="flex items-end justify-between pt-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest opacity-80">Total KPI</p>
                          <p className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                            {Math.round(lecturer.total_kpi_points).toLocaleString()}
                          </p>
                        </div>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.bgColor} text-slate-500 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300`}>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <Sparkles className="absolute top-6 right-6 w-10 h-10 text-slate-900/5 dark:text-white/5 -rotate-12 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
