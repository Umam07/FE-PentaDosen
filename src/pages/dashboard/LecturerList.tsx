import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, GraduationCap, 
  BookOpen, ChevronRight, ArrowLeft, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';
import TopRankModal from './TopRankModal';

export default function LecturerList() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProdi, setSelectedProdi] = useState('Semua');
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

  const prodis = ['Semua', ...new Set(lecturers.map(l => l.program_studi).filter(Boolean))];

  const filteredLecturers = lecturers.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProdi = selectedProdi === 'Semua' || l.program_studi === selectedProdi;
    return matchesSearch && matchesProdi;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Kembali ke Dashboard</span>
            </motion.button>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter"
            >
              Direktori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500 uppercase">Dosen</span>
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Daftar seluruh dosen yang telah terdaftar dalam sistem <span className="text-slate-900 dark:text-white font-black">Penta</span> dengan performa akademik terverifikasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text"
                placeholder="Cari nama dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {prodis.map((prodi) => (
            <button
              key={prodi}
              onClick={() => setSelectedProdi(prodi)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedProdi === prodi 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              {prodi}
            </button>
          ))}
        </motion.div>

        {/* Lecturer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  onClick={() => setSelectedUserId(lecturer.id)}
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-2xl border border-primary-500/20 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        {lecturer.thumbnail ? (
                          <img src={lecturer.thumbnail} alt="" className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                          lecturer.name.charAt(0)
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {lecturer.name}
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] line-clamp-1">
                        {lecturer.program_studi || 'Unit Tidak Tersedia'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                           <BookOpen className="w-3 h-3" /> Citations
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {lecturer.total_citations || 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                           <GraduationCap className="w-3 h-3" /> H-Index
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {lecturer.h_index || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Total KPI Points</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {lecturer.total_kpi_points.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5" />
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

      <TopRankModal 
        isOpen={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
}
