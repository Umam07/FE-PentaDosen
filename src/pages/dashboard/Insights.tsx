import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Sector 
} from 'recharts';
import { 
  Trophy, Users, Building2, ChevronRight, CheckCircle2, 
  BookOpen, Sparkles, Zap, TrendingUp, Search, Filter, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

const PRODI_COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'];

const FAKULTAS_COLORS: Record<string, string> = {
  'kedokteran': '#10b981', // Emerald
  'kedokterangigi': '#8b5cf6', // Violet
  'teknologiinformasi': '#0ea5e9', // Sky
  'ekonomibisnis': '#f59e0b', // Amber
  'ekonomidanbisnis': '#f59e0b', // Amber
  'hukum': '#ef4444', // Red
  'psikologi': '#ec4899', // Pink
};

const FAKULTAS_SHORT: Record<string, string> = {
  'kedokteran': 'Kedokteran',
  'kedokterangigi': 'Ked. Gigi',
  'teknologiinformasi': 'Tek. Informasi',
  'ekonomibisnis': 'Eko. Bisnis',
  'ekonomidanbisnis': 'Eko. Bisnis',
  'hukum': 'Hukum',
  'psikologi': 'Psikologi',
};

const ALL_FAKULTAS_NAMES = [
  'Fakultas Kedokteran',
  'Fakultas Kedokteran Gigi',
  'Fakultas Teknologi Informasi',
  'Fakultas Ekonomi dan Bisnis',
  'Fakultas Hukum',
  'Fakultas Psikologi'
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-black uppercase tracking-widest">
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#0f172a" className="text-3xl dark:fill-white font-black tracking-tighter">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'url(#glow)' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 12}
        fill={fill}
        opacity={0.3}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} strokeWidth={2} fill="none" strokeDasharray="4 2" />
      <circle cx={ex} cy={ey} r={4} fill={fill} stroke="white" strokeWidth={2} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#64748b" className="text-xs font-black">{`${value.toLocaleString()} Poin`}</text>
    </g>
  );
};

export default function Insights() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fakultasData, setFakultasData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'points_desc' | 'points_asc' | 'alphabetical'>('points_desc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        console.error('Failed to fetch insights data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mergedFakultasData = ALL_FAKULTAS_NAMES.map(name => {
    const apiItem = fakultasData.find(f => f.fakultas === name);
    return apiItem || { fakultas: name, total_points: 0, dosen_count: 0 };
  });

  const formattedFakultasData = mergedFakultasData.map((f: any, index: number) => {
    const rawName = f.fakultas || '';
    const normalizedKey = rawName.toLowerCase().replace(/fakultas/g, '').replace(/[^a-z0-9]/g, '');
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

  const filteredFakultasData = formattedFakultasData.filter((f) => 
    f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredData = [...filteredFakultasData].sort((a, b) => {
    if (sortBy === 'points_desc') {
      return b.value - a.value;
    } else if (sortBy === 'points_asc') {
      return a.value - b.value;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const activeDataIndex = activeIndex >= sortedAndFilteredData.length ? 0 : activeIndex;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-sans">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Premium Redesigned Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden p-8 lg:p-16 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-850 bg-white/95 dark:bg-slate-900/80 backdrop-blur-md shadow-xs"
        >
          {/* Immersive Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[0.95]">
                  Penta<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Insights</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
                  Analisis cerdas untuk ekosistem akademik. Pantau pertumbuhan KPI dan output riset dengan <span className="relative inline-block">
                    <span className="relative z-10 text-slate-900 dark:text-white font-extrabold">akurasi tingkat tinggi</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-500/10 -rotate-1"></span>
                  </span>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="grid grid-cols-2 gap-6 relative">
                {/* Floating Stats Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="group bg-white dark:bg-slate-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-xs transition-all hover:-translate-y-1.5">
                    <div className="w-11 h-11 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-5.5 h-5.5 text-primary-500" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1">Total Dokumen</p>
                    {loading ? (
                      <div className="h-9 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md w-16 mt-2" />
                    ) : (
                      <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                        {((stats?.total_docs || 0) + (stats?.total_research || 0) + (stats?.total_scholar || 0) + (stats?.total_scopus || 0)).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="group bg-primary-600 p-6 rounded-3xl text-white shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-1.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-5.5 h-5.5 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-primary-100 uppercase tracking-widest mb-1">Total Sitasi</p>
                    {loading ? (
                      <div className="h-9 bg-white/20 animate-pulse rounded-md w-16 mt-2" />
                    ) : (
                      <p className="text-3xl font-extrabold tracking-tighter text-white">
                        {(stats?.total_citations || 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-8 flex flex-col gap-6"
                >
                  <div className="group bg-slate-900 dark:bg-white p-6 rounded-3xl text-white dark:text-slate-900 shadow-md transition-all hover:-translate-y-1.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-slate-900/5 flex items-center justify-center mb-4">
                      <Trophy className="w-5.5 h-5.5 text-white dark:text-slate-800" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rerata KPI</p>
                    {loading ? (
                      <div className="h-9 bg-white/10 dark:bg-slate-200 animate-pulse rounded-md w-16 mt-2" />
                    ) : (
                      <p className="text-3xl font-extrabold tracking-tighter">
                        {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
                      </p>
                    )}
                  </div>

                  <div className="group bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5.5 h-5.5 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Akurasi Data</p>
                    <p className="text-3xl font-extrabold tracking-tighter text-white">99.9<span className="text-xl">%</span></p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unified Statistics Intelligence */}
        <div className="space-y-10">
          {/* Primary KPI Highlights - Major Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                label: 'Total KPI Overall', 
                val: stats?.total_points?.toLocaleString() || '0', 
                change: 'Akumulasi Poin', 
                icon: CheckCircle2, 
                colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
                glow: 'from-emerald-500/20 to-transparent'
              },
              { 
                label: 'KPI Score 3 Tahun', 
                val: stats?.kpi_score_3_years?.toLocaleString() || '0', 
                change: 'Batch 2024-2026', 
                icon: TrendingUp, 
                colorClass: 'text-primary-600 dark:text-primary-400 bg-primary-500/10',
                glow: 'from-primary-500/20 to-transparent'
              },
              { 
                label: 'KPI Tahun Ini', 
                val: stats?.kpi_score_this_year?.toLocaleString() || '0', 
                change: 'Periode Berjalan 2026', 
                icon: Zap, 
                colorClass: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
                glow: 'from-violet-500/20 to-transparent'
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200/60 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-700 overflow-hidden"
              >
                {/* Dynamic Visual Flare */}
                <div className={`absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br ${item.glow} rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${item.colorClass} flex items-center justify-center mb-8 shadow-sm group-hover:rotate-12 transition-transform duration-500`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.25em] mb-3">{item.label}</p>
                  {loading ? (
                    <div className="h-14 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg w-32 mb-6" />
                  ) : (
                    <p className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6 group-hover:scale-[1.02] transition-transform origin-left">{item.val}</p>
                  )}
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                    <span className="text-[11px] font-bold text-slate-650 dark:text-slate-450 italic tracking-tight">{item.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary Intelligence Row - Refined Placement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Personnel Statistics (Dosen & Prodi) - Consistently grouped */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-around overflow-hidden relative group shadow-xs hover:shadow-lg transition-all duration-700"
            >
              <button 
                onClick={() => navigate('/lecturers')}
                className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all duration-700 shadow-sm group-hover/btn:shadow-blue-500/25">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  {loading ? (
                    <div className="h-9 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-12 mx-auto" />
                  ) : (
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{stats?.total_dosen || 0}</p>
                  )}
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Dosen Aktif</p>
                </div>
              </button>

              <div className="w-px h-20 bg-slate-100 dark:bg-slate-800"></div>

              <button 
                onClick={() => navigate('/departments')}
                className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-all duration-700 shadow-sm group-hover/btn:shadow-indigo-500/25">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter text-glow">6</p>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Fakultas</p>
                </div>
              </button>
            </motion.div>

            {/* Top Performer Card - Special Distinction */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-12 xl:col-span-7 bg-[#0F172A] dark:bg-slate-900 p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative shadow-md border border-white/5"
            >
              <div className="relative z-10 space-y-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/30 shadow-sm">
                    <Trophy className="w-5.5 h-5.5 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500">Performa Terbaik Utama</span>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-7 bg-white/10 dark:bg-slate-800 animate-pulse rounded w-48" />
                      <div className="h-5 bg-white/10 dark:bg-slate-800 animate-pulse rounded w-32" />
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl lg:text-4xl font-extrabold tracking-tight group-hover:text-amber-400 transition-colors duration-500">{stats?.top_performer?.name || 'N/A'}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <p className="text-slate-400 font-semibold text-sm tracking-tight">Akumulasi:</p>
                        <p className="text-white font-extrabold text-xl">{Math.round(stats?.top_performer?.total_kpi_points || 0).toLocaleString()} <span className="text-[11px] uppercase text-slate-500 tracking-widest ml-1 font-bold">Poin KPI</span></p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-6 sm:mt-0 relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-3 group-hover:border-amber-500/40 transition-all duration-700 shadow-xl">
                 <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] text-slate-200">Rank 01</p>
                 <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 flex items-center justify-center text-slate-900 shadow-md">
                    <Sparkles className="w-7 h-7" />
                 </div>
              </div>
              
              <Zap className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 -rotate-12 group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000" />
            </motion.div>
          </div>
        </div>


        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/60 dark:border-slate-800 p-8 lg:p-10 overflow-hidden relative group flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-2.5 bg-primary-500 rounded-xl shadow-md shadow-primary-500/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Poin KPI per Fakultas</h2>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                    {totalFakultasPoints.toLocaleString()} Poin
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-xs max-w-sm">
                  Distribusi metrik KPI di seluruh fakultas secara real-time.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative group/search">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    className="pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none w-40 transition-all dark:text-white" 
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    aria-label="Filter peringkat"
                    className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-500 dark:text-slate-400"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1">
                      <button 
                        onClick={() => { setSortBy('points_desc'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'points_desc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        Poin Tertinggi
                      </button>
                      <button 
                        onClick={() => { setSortBy('points_asc'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'points_asc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        Poin Terendah
                      </button>
                      <button 
                        onClick={() => { setSortBy('alphabetical'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'alphabetical' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        Nama (A-Z)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center flex-1">
              <div className="xl:col-span-7 h-[360px] relative">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <div className="w-48 h-48 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 animate-spin flex items-center justify-center">
                      <Building2 className="w-10 h-10 opacity-30 animate-pulse" />
                    </div>
                  </div>
                ) : sortedAndFilteredData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeDataIndex}
                        activeShape={renderActiveShape}
                        data={sortedAndFilteredData}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={125}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        animationDuration={1500}
                        paddingAngle={5}
                        stroke="none"
                        cornerRadius={8}
                      >
                        {sortedAndFilteredData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Building2 className="w-16 h-16 mb-2 opacity-30" />
                    <p className="text-sm font-bold">Tidak ada data visualisasi</p>
                  </div>
                )}
              </div>
  
              <div className="xl:col-span-5 flex flex-col gap-2">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl border border-transparent animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
                        <div className="h-2 bg-slate-200 dark:bg-slate-850 rounded w-full" />
                      </div>
                    </div>
                  ))
                ) : sortedAndFilteredData.length > 0 ? (
                  sortedAndFilteredData.map((f: any, i: number) => {
                    const percentage = totalFakultasPoints > 0 ? ((f.value / totalFakultasPoints) * 100).toFixed(1) : '0';
                    const isActive = activeDataIndex === i;
                    
                    return (
                      <motion.div 
                        key={f.fullName}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all border cursor-pointer ${isActive ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-xs' : 'border-transparent'}`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" 
                          style={{ backgroundColor: f.color }}
                        >
                          {f.name[0]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {f.name}
                            </p>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{percentage}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: f.color }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                    <Building2 className="w-10 h-10 mb-2 opacity-30 animate-pulse" />
                    <p className="text-xs font-bold">Fakultas tidak ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/60 dark:border-slate-800 p-8 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top 5 Peringkat</h2>
                </div>
                <button 
                  onClick={() => navigate('/lecturers')}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 group cursor-pointer"
                >
                  LIHAT SEMUA
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent animate-pulse">
                      <div className="w-6 h-4 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-850 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2 text-left">
                        <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
                      </div>
                      <div className="space-y-1.5 text-right">
                        <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-10 ml-auto" />
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-850 rounded w-8 ml-auto" />
                      </div>
                    </div>
                  ))
                ) : leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((user: any, index: number) => (
                    <button 
                      key={user.id}
                      onClick={() => navigate(`/lecturer/${user.id}`)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      {/* Rank Number */}
                      <div className={`w-6 text-center shrink-0 ${
                        index === 0 ? 'text-amber-500 dark:text-amber-400 text-base font-bold' : 
                        index === 1 ? 'text-slate-400 dark:text-slate-300 text-sm font-bold' : 
                        index === 2 ? 'text-orange-400 dark:text-orange-300 text-sm font-bold' :
                        'text-slate-400 dark:text-slate-500 text-sm font-bold'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Lecturer Photo / Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm relative shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs">
                        <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                          {user.thumbnail ? (
                            <img src={user.thumbnail} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 uppercase">
                              {user.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        {index === 0 && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 z-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-white dark:bg-slate-900 border border-amber-500 items-center justify-center shadow-xs">
                              <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 truncate">{user.program_studi}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(user.total_kpi_points).toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">Poin KPI</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-xs">Tidak ada data peringkat</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}