import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector 
} from 'recharts';
import { 
  Trophy, Users, FileText, Building2, 
  ChevronRight, ArrowUpRight, CheckCircle2, LayoutDashboard, 
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
  const { isCollapsed } = (useOutletContext<{ isCollapsed: boolean }>() || { isCollapsed: false });
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fakultasData, setFakultasData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 animate-pulse space-y-12">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[3rem] w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 h-44"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800"></div>
            <div className="lg:col-span-1 h-96 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-mono">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Premium Redesigned Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden p-8 lg:p-20 rounded-[4rem] border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none"
        >
          {/* Immersive Background Elements */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/brain/9aa23505-eb27-4992-a16a-8bac81e655e9/futuristic_data_visualization_1775927908123.png" 
              className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-[0.15] dark:opacity-20 mask-gradient-left"
              alt="Data Visualization"
            />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">

              
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.95]">
                  Penta<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Insights</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                  Analisis cerdas untuk ekosistem akademik. Pantau pertumbuhan KPI dan output riset dengan <span className="relative inline-block">
                    <span className="relative z-10 text-slate-900 dark:text-white font-black">akurasi tingkat tinggi</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-500/10 -rotate-1"></span>
                  </span>.
                </p>
              </div>

            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="grid grid-cols-2 gap-6 relative">
                {/* Floating Stats Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="group bg-white dark:bg-slate-800/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-slate-200/60 dark:border-white/10 shadow-xl transition-all hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-primary-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Total Dokumen</p>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {((stats?.total_research || 0) + (stats?.total_docs || 0)).toLocaleString()}
                    </h3>
                  </div>
                  <div className="group bg-primary-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-primary-600/30 transition-all hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-primary-100/60 uppercase tracking-widest mb-2">Total Sitasi</p>
                    <h3 className="text-4xl font-black tracking-tighter">
                      {(stats?.total_citations || 0).toLocaleString()}
                    </h3>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-12 flex flex-col gap-6"
                >
                   <div className="group bg-slate-900 dark:bg-white p-8 rounded-[3rem] text-white dark:text-slate-900 shadow-2xl transition-all hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-slate-900/5 flex items-center justify-center mb-6">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">Rerata KPI</p>
                    <h3 className="text-4xl font-black tracking-tighter">
                      {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
                    </h3>
                  </div>
                  <div className="group bg-emerald-500 p-8 rounded-[3rem] text-white shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest mb-2">Akurasi Data</p>
                    <h3 className="text-4xl font-black tracking-tighter text-white">99.9<span className="text-xl">%</span></h3>
                  </div>
                </motion.div>
                
                {/* Abstract Ornaments */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-emerald-500/20 rounded-full blur-2xl animate-bounce"></div>
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
                className="group relative bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden"
              >
                {/* Dynamic Visual Flare */}
                <div className={`absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br ${item.glow} rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000`}></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-[1.5rem] ${item.colorClass} flex items-center justify-center mb-10 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <p className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">{item.label}</p>
                  <h4 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 group-hover:scale-[1.02] transition-transform origin-left">{item.val}</h4>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                    <span className="text-[11px] font-bold text-slate-400 italic tracking-tight">{item.change}</span>
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
              className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 flex items-center justify-around overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-700"
            >
              <button 
                onClick={() => navigate('/lecturers')}
                className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all duration-700 shadow-lg group-hover/btn:shadow-blue-500/25">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats?.total_dosen || 0}</h5>
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Dosen Aktif</p>
                </div>
              </button>

              <div className="w-px h-24 bg-slate-100 dark:bg-slate-800"></div>

              <button 
                onClick={() => navigate('/departments')}
                className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-all duration-700 shadow-lg group-hover/btn:shadow-indigo-500/25">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter text-glow">6</h5>
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Fakultas</p>
                </div>
              </button>
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 dark:bg-slate-800/10 translate-x-24 -translate-y-24 rotate-45 group-hover:translate-x-20 group-hover:-translate-y-20 transition-transform duration-1000"></div>
            </motion.div>

            {/* Top Performer Card - Special Distinction */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-12 xl:col-span-7 bg-[#0F172A] dark:bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/5"
            >
              <div className="relative z-10 space-y-8 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-[0.25em] text-amber-500">Performa Terbaik Utama</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-4xl lg:text-5xl font-black tracking-tight group-hover:text-amber-400 transition-colors duration-500">{stats?.top_performer?.name || 'N/A'}</h4>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <p className="text-slate-400 font-bold text-base tracking-tight">Akumulasi:</p>
                    <p className="text-white font-black text-2xl">{stats?.top_performer?.total_kpi_points?.toLocaleString() || '0'} <span className="text-[12px] uppercase text-slate-500 tracking-widest ml-1">Poin KPI</span></p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 sm:mt-0 relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 group-hover:border-amber-500/40 transition-all duration-700 shadow-2xl">
                 <p className="text-[11px] font-black opacity-40 uppercase tracking-[0.2em]">Rank 01</p>
                 <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <Sparkles className="w-8 h-8" />
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
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-200/60 dark:border-slate-800 p-8 lg:p-10 overflow-hidden relative group flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-2.5 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Poin KPI per Fakultas</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
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
                    className="pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none w-40 transition-all" 
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
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
              <div className="xl:col-span-7 h-[380px] relative">
                {sortedAndFilteredData.length > 0 && (
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
                )}
                {sortedAndFilteredData.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Building2 className="w-16 h-16 mb-2 opacity-30" />
                    <p className="text-sm font-bold">Tidak ada data visualisasi</p>
                  </div>
                )}
              </div>
 
              <div className="xl:col-span-5 flex flex-col gap-2">
                {sortedAndFilteredData.length > 0 ? (
                  sortedAndFilteredData.map((f: any, i: number) => {
                    const percentage = totalFakultasPoints > 0 ? ((f.value / totalFakultasPoints) * 100).toFixed(1) : '0';
                    const isActive = activeDataIndex === i;
                    
                    return (
                      <motion.div 
                        key={f.fullName}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all border cursor-pointer ${isActive ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm' : 'border-transparent'}`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" 
                          style={{ backgroundColor: f.color }}
                        >
                          {f.name[0]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                              {f.name}
                            </p>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white">{percentage}%</span>
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
                    <p className="text-xs font-black">Fakultas tidak ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-200/60 dark:border-slate-800 p-8 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Top 5 Peringkat</h3>
                </div>
                <button 
                  onClick={() => navigate('/lecturers')}
                  className="text-xs font-black text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 group cursor-pointer"
                >
                  LIHAT SEMUA
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {leaderboard.slice(0, 5).map((user: any, index: number) => (
                  <button 
                    key={user.id}
                    onClick={() => navigate(`/lecturer/${user.id}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    {/* Rank Number */}
                    <div className={`w-6 text-center shrink-0 ${
                      index === 0 ? 'text-amber-500 dark:text-amber-400 text-base font-black' : 
                      index === 1 ? 'text-slate-400 dark:text-slate-300 text-sm font-black' : 
                      index === 2 ? 'text-orange-400 dark:text-orange-300 text-sm font-black' :
                      'text-slate-400 dark:text-slate-500 text-sm font-bold'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Lecturer Photo / Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm relative shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-sm">
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
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-white dark:bg-slate-900 border border-amber-500 items-center justify-center shadow-md">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{user.program_studi}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{user.total_kpi_points.toLocaleString()}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Poin KPI</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            

          </motion.div>
        </div>



      </main>

      <Footer />
    </div>
  );
}