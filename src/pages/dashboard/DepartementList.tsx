import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Stethoscope, Cpu, Briefcase, 
  Scale, Brain, GraduationCap, ArrowLeft,
  Loader2, ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

interface DepartmentStats {
  program_studi: string;
  dosen_count: number;
  research_count: number;
  total_points: number;
}

const FAKULTAS_METADATA: Record<string, {
  icon: any;
  color: string;
  textColor: string;
  bgColor: string;
  badgeBg: string;
  glowColor: string;
  description: string;
  prodi: string[];
}> = {
  'Fakultas Kedokteran': { 
    icon: Stethoscope, 
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
    glowColor: 'group-hover:shadow-emerald-500/10',
    description: 'Mewujudkan Fakultas Kedokteran Islam bermutu tinggi, adaptif terhadap iptek, serta berkontribusi dalam kesehatan masyarakat nasional dan internasional.',
    prodi: ['Kedokteran']
  },
  'Fakultas Kedokteran Gigi': { 
    icon: Stethoscope, 
    color: 'bg-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30',
    glowColor: 'group-hover:shadow-purple-500/10',
    description: 'Mewujudkan Fakultas Kedokteran Gigi Islam bermutu tinggi di bidang kesehatan gigi dan mulut, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Kedokteran Gigi']
  },
  'Fakultas Teknologi Informasi': { 
    icon: Cpu, 
    color: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-900/30',
    glowColor: 'group-hover:shadow-sky-500/10',
    description: 'Mewujudkan Fakultas Teknologi Informasi berkarakteristik Islam, terpandang, bermutu tinggi, serta mampu berkompetisi di tingkat nasional dan internasional.',
    prodi: ['Teknik Informatika', 'Perpustakaan dan Sains Informasi']
  },
  'Fakultas Ekonomi dan Bisnis': { 
    icon: Briefcase, 
    color: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
    glowColor: 'group-hover:shadow-amber-500/10',
    description: 'Mewujudkan Fakultas Ekonomi dan Bisnis Islam bermutu tinggi, terpandang, berwibawa, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Manajemen', 'Akuntansi']
  },
  'Fakultas Hukum': { 
    icon: Scale, 
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    badgeBg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30',
    glowColor: 'group-hover:shadow-red-500/10',
    description: 'Mewujudkan Fakultas Hukum berwawasan Islam, bermutu tinggi, berintegritas, serta mampu bersaing di tingkat nasional maupun regional Asia Tenggara.',
    prodi: ['Ilmu Hukum']
  },
  'Fakultas Psikologi': { 
    icon: Brain, 
    color: 'bg-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-100/50 dark:border-pink-900/30',
    glowColor: 'group-hover:shadow-pink-500/10',
    description: 'Mewujudkan Fakultas Psikologi Islami bermutu tinggi, terpandang, dan berwibawa dalam pengembangan Psikologi Kesehatan nasional dan internasional.',
    prodi: ['Psikologi']
  }
};

const DEFAULT_NAMES = Object.keys(FAKULTAS_METADATA);

export default function DepartementList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/charts/fakultas');
        const result = await response.json();
        const apiData = result.data || [];

        // Create a map for easy lookup
        const statsMap = new Map<string, any>(
          apiData.map((d: any) => [d.fakultas, d])
        );

        // Merge API data with default set to ensure all 6 fakultas are shown
        const merged = DEFAULT_NAMES.map(name => {
          const stats = statsMap.get(name) || { dosen_count: 0, research_count: 0, total_points: 0 };
          const meta = FAKULTAS_METADATA[name];
          
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

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal !== null) {
      setSearch(searchVal);
    }
  }, [searchParams]);

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-sans">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/insights')}
              className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold w-fit shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Dashboard</span>
            </button>
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full border border-primary-500/20">
                Direktori Akademik
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Daftar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Fakultas</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-2xl leading-relaxed">
                Eksplorasi ekosistem akademik di seluruh Fakultas Universitas. 
                Data disinkronkan langsung dengan basis data kepegawaian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-80 group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Cari fakultas..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-6 py-3.5 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-sm font-semibold border border-slate-200 dark:border-slate-850 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 outline-none w-full transition-all shadow-xs dark:text-white" 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDepartments.map((dept, i) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className={`group relative bg-white dark:bg-slate-900/90 backdrop-blur-md p-7 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-xl ${dept.glowColor} transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[460px]`}
                  onClick={() => navigate(`/lecturers?fakultas=${dept.name}`)}
                >
                  {/* Decorative background glow */}
                  <div className={`absolute -right-10 -top-10 w-28 h-28 ${dept.color} opacity-5 group-hover:opacity-15 group-hover:scale-125 rounded-full blur-xl transition-all duration-700`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between flex-1">
                    <div className="space-y-5">
                      {/* Icon and Title Header */}
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-2xl ${dept.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                          <dept.icon className={`w-7 h-7 ${dept.textColor}`} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/40 rounded-full border border-slate-100 dark:border-slate-800">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fakultas</span>
                        </div>
                      </div>

                      {/* Title & Aligned Description */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-relaxed text-justify">
                          {dept.description}
                        </p>
                      </div>

                      {/* Program Studi Badges */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Program Studi:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dept.prodi?.map((p: string) => (
                            <span key={p} className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-md border transition-all ${dept.badgeBg}`}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Stats & Action */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
                      {/* Micro-metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
                        <div>
                          <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Dosen</p>
                          <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{dept.lecturerCount}</p>
                        </div>
                        <div className="border-x border-slate-200/50 dark:border-slate-800/50">
                          <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Riset</p>
                          <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{dept.researchCount}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Prodi</p>
                          <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{dept.prodi?.length || 0}</p>
                        </div>
                      </div>

                      {/* Read more trigger */}
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <span>Lihat Direktori Dosen</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${dept.bgColor} text-slate-500 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300`}>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
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
