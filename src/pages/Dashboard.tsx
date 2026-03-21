import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Trophy, Users, FileText, Award, Building2, 
  ChevronRight, ArrowUpRight, CheckCircle2, LayoutDashboard, BookOpen 
} from 'lucide-react';
import { motion } from 'motion/react'; 

const PRODI_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// FIX WARNA: Key diubah menjadi huruf kecil semua tanpa spasi dan tanpa kata "fakultas"
// Ini memastikan pencocokan data dari API ke warna akan selalu akurat
const FAKULTAS_COLORS: Record<string, string> = {
  'kedokteran': '#6a9256',
  'kedokterangigi': '#8773ae',
  'teknologiinformasi': '#e09a67',
  'ekonomibisnis': '#036aac',
  'hukum': '#a93246',
  'psikologi': '#8b3969',
};

const FAKULTAS_SHORT: Record<string, string> = {
  'kedokteran': 'Kedokteran',
  'kedokterangigi': 'Ked. Gigi',
  'teknologiinformasi': 'Tek. Informasi',
  'ekonomibisnis': 'Eko. Bisnis',
  'hukum': 'Hukum',
  'psikologi': 'Psikologi',
};

export default function Dashboard() {
  const { isCollapsed } = useOutletContext<{ isCollapsed: boolean }>();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fakultasData, setFakultasData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hapus fetch '/api/charts/prodi' karena chart program studi dihilangkan
        const [lbRes, fakultasRes, statsRes] = await Promise.all([
          fetch('/api/leaderboard'),
          fetch('/api/charts/fakultas'),
          fetch('/api/dashboard/stats')
        ]);
        const lbData = await lbRes.json();
        const fakData = await fakultasRes.json();
        const sData = await statsRes.json();
        
        setLeaderboard(lbData.leaderboard || []);
        setFakultasData(fakData.data || []);
        setStats(sData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12 w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="h-[120px] lg:h-[140px] bg-gray-200 dark:bg-zinc-800 rounded-3xl w-full"></div>

        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 h-[152px]">
              <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-2xl mb-4"></div>
              <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full mb-3"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full mb-3"></div>
              <div className="w-32 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Layout Baru: Statistik & Leaderboard Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Fakultas Statistics Skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 lg:p-10 min-h-[450px]">
             <div className="w-48 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full mb-3"></div>
             <div className="w-64 h-4 bg-gray-200 dark:bg-zinc-800 rounded-full mb-10"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <div className="flex justify-center items-center h-[280px] lg:h-[350px]">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-[30px] border-gray-100 dark:border-zinc-800"></div>
                </div>
                <div className="flex flex-col justify-center gap-4">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-full h-[60px] bg-gray-100 dark:bg-zinc-800 rounded-2xl"></div>
                   ))}
                </div>
             </div>
          </div>

          {/* Leaderboard Skeleton */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 min-h-[450px] flex flex-col">
            <div className="px-6 py-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between">
              <div className="w-32 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
            <div className="flex-1 py-4 space-y-4">
               {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="px-6 py-2 flex items-center gap-4">
                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
                     <div className="flex-1 space-y-2">
                       <div className="w-3/4 h-4 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                       <div className="w-1/2 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tertiary Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-gray-200 dark:bg-zinc-800 rounded-3xl h-[280px]"></div>
          <div className="md:col-span-2 bg-gray-200 dark:bg-zinc-800 rounded-3xl h-[280px]"></div>
        </div>
      </div>
    );
  }

  // EXTREME NORMALIZATION UNTUK FIX WARNA
  const formattedFakultasData = fakultasData.map((f: any, index: number) => {
    const rawName = f.fakultas || '';
    
    // Hilangkan kata "fakultas", hapus semua spasi dan karakter non-alfanumerik, ubah ke huruf kecil
    const normalizedKey = rawName.toLowerCase().replace(/fakultas/g, '').replace(/[^a-z0-9]/g, '');
    
    // Ambil warna dan nama pendek berdasarkan key yang sudah bersih
    const color = FAKULTAS_COLORS[normalizedKey] || PRODI_COLORS[index % PRODI_COLORS.length];
    const shortName = FAKULTAS_SHORT[normalizedKey] || rawName.replace(/Fakultas\s/i, '').trim();

    return {
      ...f,
      name: shortName,
      fullName: rawName,
      value: Number(f.total_points || 0),
      dosen: f.dosen_count || 0,
      color: color
    };
  });

  const totalFakultasPoints = formattedFakultasData.reduce((sum: number, f: any) => sum + f.value, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 selection:bg-primary-200">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-800 p-8 lg:p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)] text-white border border-primary-500/30"
      >
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-inner border border-white/20 flex-shrink-0">
            <LayoutDashboard className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight mb-1">PentaDashboard</h1>
            <p className="text-primary-100/90 text-sm lg:text-base font-medium">Monitoring Kinerja & Akreditasi Dosen</p>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4 flex-wrap">
          <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 w-fit transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-1.5">Total Poin KPI</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-5xl font-black text-white drop-shadow-lg">{stats?.total_points?.toLocaleString() || '0'}</span>
              <span className="text-primary-300 text-sm font-bold uppercase">PTS</span>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 w-fit transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-1.5">Total Sitasi</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-5xl font-black text-white drop-shadow-lg">{(stats?.total_citations || 0).toLocaleString()}</span>
              <span className="text-primary-300 text-sm font-bold uppercase">Cite</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {[
          { label: 'Dosen Aktif', val: stats?.total_dosen || 0, sub: 'Terdaftar di sistem', icon: Users, theme: 'blue' },
          { label: 'Top Score', val: leaderboard[0]?.total_kpi_points || 0, sub: leaderboard[0]?.name || 'Belum ada data', icon: Trophy, theme: 'amber' },
          { label: 'Dokumen Approved', val: stats?.approved_docs || 0, sub: `${stats?.total_docs || 0} Total diunggah`, icon: FileText, theme: 'emerald' },
          { label: 'Total Sitasi', val: (stats?.total_citations || 0).toLocaleString(), sub: 'Scholar API tersinkron', icon: BookOpen, theme: 'purple' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className={`relative bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 hover:border-${item.theme}-200 group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default`}
          >
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-${item.theme}-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
            <div className={`relative z-10 p-3 rounded-2xl bg-${item.theme}-50 text-${item.theme}-600 w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm font-bold`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight truncate">{item.val}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-gray-500">
                <span className="truncate">{item.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Layout Baru: Statistik Fakultas & Leaderboard Bersebelahan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Fakultas Statistics Section (Spans 2 Columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 p-6 lg:p-10 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-10 gap-4">
            <div>
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                  <Building2 className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                Statistik Fakultas
              </h3>
              <p className="text-gray-500 font-medium text-sm mt-2 ml-1">Distribusi perolehan poin KPI berdasarkan Fakultas</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Pie Chart */}
            <div className="h-[280px] lg:h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedFakultasData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isCollapsed ? 70 : 80}
                    outerRadius={isCollapsed ? 110 : 130}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={300}
                    animationDuration={1200}
                    stroke="none"
                  >
                    {formattedFakultasData.map((entry: any, index: number) => (
                      <Cell 
                        key={`fak-cell-${index}`} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      padding: '16px',
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      <span className="font-black text-gray-900 ml-2">{value.toLocaleString()} Poin <span className="text-gray-400 font-semibold text-xs ml-1">({props.payload.dosen} Dosen)</span></span>, 
                      <span className="font-bold text-gray-500">{name}</span>
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Poin</p>
                <p className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-zinc-100 mt-1">{totalFakultasPoints.toLocaleString()}</p>
              </div>
            </div>

            {/* Fakultas List */}
            <div className="flex flex-col justify-center gap-3 lg:gap-4">
              {formattedFakultasData.map((f: any, i: number) => {
                const percentage = totalFakultasPoints > 0 
                  ? ((f.value / totalFakultasPoints) * 100).toFixed(1) 
                  : '0';
                
                return (
                  <motion.div 
                    key={f.fullName}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 p-3 lg:p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 transition-all group"
                  >
                    <div 
                      className="w-4 h-4 lg:w-5 lg:h-5 rounded-lg shrink-0 shadow-sm" 
                      style={{ backgroundColor: f.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-extrabold text-gray-800 dark:text-zinc-100 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                        {f.name}
                      </p>
                      <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        {f.dosen} Dosen Terdaftar
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm lg:text-base font-black" style={{ color: f.color }}>{f.value.toLocaleString()}</p>
                      <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 mt-1">{percentage}% dari Total</p>
                    </div>
                    <div className="hidden sm:block w-16 lg:w-20 h-2 lg:h-2.5 bg-gray-100 rounded-full overflow-hidden shrink-0 shadow-inner ml-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 * i, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: f.color }}
                      ></motion.div>
                    </div>
                  </motion.div>
                );
              })}
              {formattedFakultasData.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-bold text-sm">Belum ada data fakultas</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Redesign (Spans 1 Column) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 max-h-[600px] lg:max-h-full"
        >
          <div className="px-6 py-6 bg-gradient-to-b from-gray-50 dark:from-zinc-800 to-white dark:to-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                <Award className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 fill-amber-100" />
              </div>
              Top Rank
            </h3>
            <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Top 10</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
            {leaderboard.length > 0 ? leaderboard.map((user: any, index: number) => (
              <div 
                key={user.id} 
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200 cursor-default group border-b border-gray-50 dark:border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-black text-base lg:text-lg transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-amber-200' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-200' :
                      index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-orange-200' :
                      'bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index === 0 && <span className="absolute -top-2 -right-2 text-lg lg:text-xl drop-shadow-md">👑</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate group-hover:text-primary-600 transition-colors">{user.name}</p>
                    <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase mt-1 tracking-wider truncate">{user.program_studi}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <div className="flex items-center text-xs lg:text-sm font-black text-primary-700 bg-primary-50 px-2 lg:px-3 py-1 rounded-xl shadow-sm border border-primary-100/50">
                    {user.total_kpi_points.toLocaleString()}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-60 hidden sm:block" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-bold">Belum ada data ranking</p>
              </div>
            )}
          </div>
          <div className="p-5 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 mt-auto">
            <button className="w-full py-3 px-6 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs lg:text-sm font-bold text-gray-600 dark:text-zinc-300 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center gap-2 group">
              Lihat Ranking Lengkap 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tertiary Section - Achievement/Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 overflow-hidden relative group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 w-fit mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-black mb-3 leading-tight">Verifikasi Berkas Efisien</h4>
              <p className="text-emerald-50/90 font-medium text-sm leading-relaxed max-w-[90%]">
                Sistem otomatisasi verifikasi Scopus & Google Scholar menghemat waktu pengecekan manual Admin secara drastis.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex justify-between items-end font-black mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Auto-Verified Rate</span>
                <span className="text-2xl">74%</span>
              </div>
              <div className="h-2.5 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '74%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] relative"
                >
                  <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </div>
          <CheckCircle2 className="absolute -right-12 -bottom-12 w-56 h-56 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
        </div>

        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 p-8 flex flex-col sm:flex-row items-center gap-8 lg:gap-12 hover:shadow-lg transition-all">
          <div className="hidden sm:block w-1/3 relative">
            <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
             <div className="relative grid grid-cols-2 gap-3 lg:gap-4 p-2">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`aspect-square rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 ${i === 1 ? 'animate-pulse ring-2 ring-primary-100' : 'hover:scale-105 transition-transform'}`}>
                   <LayoutDashboard className={`w-6 h-6 lg:w-8 lg:h-8 ${i === 1 ? 'text-primary-600' : 'text-gray-300'}`} />
                 </div>
               ))}
             </div>
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100 mb-3">Monitoring Real-time</h4>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Dashboard diperbarui secara real-time setelah sinkronisasi. Memastikan progress akreditasi dan publikasi Dosen selalu dalam pantauan yang akurat.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mt-8 items-start sm:items-center bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 w-fit">
              <div className="flex -space-x-4 overflow-hidden p-1">
                {leaderboard.slice(0, 5).map((u: any, i: number) => (
                   <div 
                    key={u.id} 
                    className="inline-block h-10 w-10 lg:h-12 lg:w-12 rounded-full ring-4 ring-gray-50 bg-white flex items-center justify-center font-black text-xs text-primary-600 shadow-sm border border-gray-200 z-10"
                    style={{ zIndex: 10 - i }}
                   >
                      {u.name.substring(0, 2).toUpperCase()}
                   </div>
                ))}
                <div className="flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full ring-4 ring-gray-50 bg-gray-900 font-bold text-xs text-white shadow-sm z-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  +{stats?.total_dosen || 0}
                </div>
              </div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Dosen Berpartisipasi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}