import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, GraduationCap, 
  BookOpen, ChevronRight, ArrowLeft, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

export default function LecturerList() {
  const [searchParams] = useSearchParams();
  const initialFakultas = searchParams.get('fakultas') || 'Semua';

  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState(initialFakultas);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await fetch('/api/leaderboard'); // Using leaderboard API to get sorted lecturers with points
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden p-8 lg:p-16 rounded-[4rem] border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] dark:shadow-none">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6">
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-600 dark:hover:text-white transition-all border border-transparent hover:border-primary-500/20"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
              </motion.button>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]"
                >
                  Direktori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">DOSEN</span>
                </motion.h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
                  Basis data akademis terverifikasi untuk seluruh dosen <span className="text-slate-900 dark:text-white font-black">Penta</span>.
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
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary-500 shadow-inner transition-all"
                />
              </div>

              {/* Stats Summary in Header */}
              <div className="flex items-center gap-8 px-6 py-4 bg-slate-900/5 dark:bg-white/5 rounded-3xl border border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Terdaftar</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{filteredLecturers.length} Orang</p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fakultas</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">6 Unit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Strip */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Filter className="w-4 h-4 text-primary-500" />
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Filter Fakultas</h4>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2.5"
          >
            {fakultasOptions.map((fak) => (
              <button
                key={fak}
                onClick={() => setSelectedFakultas(fak)}
                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  selectedFakultas === fak 
                  ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-600/20 scale-105' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:text-primary-600'
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
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 h-80 animate-pulse" />
              ))
            ) : filteredLecturers.length > 0 ? (
              filteredLecturers.map((lecturer, index) => (
                <motion.div
                  key={lecturer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/lecturer/${lecturer.id}`)}
                >
                  <div className="relative z-10 space-y-6 flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-500">
                        {lecturer.thumbnail ? (
                          <img src={lecturer.thumbnail} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          lecturer.name.charAt(0)
                        )}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Penta ID: <span className="text-slate-900 dark:text-white">{lecturer.penta_id || `712400${index + 1}`}</span></p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
                        {lecturer.name}
                      </h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest line-clamp-1 border-l-2 border-primary-500 pl-2">
                        {lecturer.fakultas || 'N/A'} • {lecturer.program_studi || 'N/A'}
                      </p>
                    </div>

                    <div className="flex-1 space-y-6 py-6 my-2 border-y border-slate-100 dark:border-slate-800/50">
                      {/* Scholar Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-primary-500" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scholar</p>
                          </div>
                          <div className="h-[2px] flex-1 mx-3 bg-slate-100 dark:bg-slate-800/50 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Citations</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                              {lecturer.total_citations || 0}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">H-Index</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                              {lecturer.h_index || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Scopus Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3 text-emerald-500" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scopus</p>
                          </div>
                          <div className="h-[2px] flex-1 mx-3 bg-slate-100 dark:bg-slate-800/50 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Citations</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                              {lecturer.scopus_total_citations || 0}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">H-Index</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                              {lecturer.scopus_h_index || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-2">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest opacity-60">Total KPI</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                          {lecturer.total_kpi_points.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center transition-all group-hover:bg-primary-600 group-hover:text-white">
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <Sparkles className="absolute top-6 right-6 w-12 h-12 text-slate-900/5 dark:text-white/5 -rotate-12 group-hover:rotate-12 transition-transform duration-700" />
                </motion.div>
              ))
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
