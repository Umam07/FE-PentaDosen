import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, ChevronRight, Search, Filter, 
  Stethoscope, Cpu, Library, Briefcase, 
  Scale, Brain, GraduationCap, ArrowLeft,
  Loader2
} from 'lucide-react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

interface DepartmentStats {
  program_studi: string;
  dosen_count: number;
  research_count: number;
  total_points: number;
}

const DEPARTMENT_METADATA: Record<string, any> = {
  'Kedokteran': { 
    icon: Stethoscope, 
    color: 'bg-emerald-500',
    description: 'Fokus pada pendidikan medis dan penelitian kesehatan masyarakat.'
  },
  'Kedokteran Gigi': { 
    icon: Stethoscope, 
    color: 'bg-teal-500',
    description: 'Keunggulan dalam perawatan gigi dan ilmu kedokteran mulut.'
  },
  'Teknik Informatika': { 
    icon: Cpu, 
    color: 'bg-blue-600',
    description: 'Pusat inovasi teknologi, kecerdasan buatan, dan pengembangan perangkat lunak.'
  },
  'Perpustakaan dan Sains Informasi': { 
    icon: Library, 
    color: 'bg-indigo-600',
    description: 'Manajemen informasi strategis di era digital.'
  },
  'Manajemen': { 
    icon: Briefcase, 
    color: 'bg-amber-500',
    description: 'Mencetak pemimpin bisnis masa depan dengan visi global.'
  },
  'Akuntansi': { 
    icon: Briefcase, 
    color: 'bg-orange-500',
    description: 'Transparansi dan akuntabilitas dalam pelaporan keuangan modern.'
  },
  'Hukum': { 
    icon: Scale, 
    color: 'bg-red-600',
    description: 'Studi hukum komprehensif untuk keadilan dan integritas bangsa.'
  },
  'Psikologi': { 
    icon: Brain, 
    color: 'bg-pink-500',
    description: 'Memahami perilaku manusia dan kesehatan mental secara saintifik.'
  }
};

const DEFAULT_NAMES = Object.keys(DEPARTMENT_METADATA);

export default function DepartementList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/charts/prodi');
        const result = await response.json();
        const apiData = result.data || [];

        // Create a map for easy lookup
        const statsMap = new Map<string, DepartmentStats>(
          apiData.map((d: any) => [d.program_studi, d])
        );

        // Merge API data with default set to ensure all 8 prodi are shown
        const merged = DEFAULT_NAMES.map(name => {
          const stats = statsMap.get(name) || { dosen_count: 0, research_count: 0, total_points: 0 };
          const meta = DEPARTMENT_METADATA[name];
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            ...meta,
            lecturerCount: stats.dosen_count || 0,
            researchCount: stats.research_count || 0,
            totalKPI: stats.total_points || 0
          };
        });

        setDepartments(merged);
      } catch (error) {
        console.error('Failed to fetch department stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-mono">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/dashboard-all')}
              className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Kembali ke Dashboard</span>
            </button>
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">
                Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Studi</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
                Eksplorasi ekosistem akademik di seluruh jurusan Universitas. 
                Data disinkronkan langsung dengan basis data kepegawaian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Cari program studi..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-6 py-4 bg-white dark:bg-slate-900 rounded-[2rem] text-sm font-bold border border-slate-200 dark:border-slate-800 focus:border-primary-500 outline-none w-full md:w-80 transition-all shadow-sm" 
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Menyelaraskan Data...</p>
          </div>
        ) : (
          <>
            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDepartments.map((dept, i) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer overflow-hidden relative"
                  onClick={() => navigate(`/lecturers?dept=${dept.name}`)}
                >
                  <div className={`absolute -right-12 -top-12 w-32 h-32 ${dept.color} opacity-[0.03] group-hover:opacity-10 rounded-full blur-2xl transition-all duration-700`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl ${dept.color} bg-opacity-10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <dept.icon className={`w-8 h-8 ${dept.color.replace('bg-', 'text-')}`} />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {dept.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                        {dept.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dosen</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{dept.lecturerCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Riset</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{dept.researchCount}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-700">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Fakultas Utama</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDepartments.length === 0 && (
              <div className="text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Tidak ada hasil</h3>
                  <p className="text-slate-500 text-sm">Coba kata kunci lain atau filter yang berbeda.</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
