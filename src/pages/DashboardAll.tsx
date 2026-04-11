import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector 
} from 'recharts';
import { 
  Trophy, Users, FileText, Building2, 
  ChevronRight, ArrowUpRight, CheckCircle2, LayoutDashboard, 
  BookOpen, Sparkles, Zap, TrendingUp, Search, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TopRankModal from '../components/TopRankModal';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';

const PRODI_COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'];

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
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold font-mono">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#94a3b8" className="text-xs font-mono">{`${value} Poin`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#94a3b8" className="text-[10px] font-mono">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function DashboardAll() {
  const { isCollapsed } = (useOutletContext<{ isCollapsed: boolean }>() || { isCollapsed: false });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fakultasData, setFakultasData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
        console.error('Failed to fetch dashboard data', error);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 animate-pulse space-y-12">
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

  const formattedFakultasData = fakultasData.map((f: any, index: number) => {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-mono">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Modern Glass Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden group p-8 lg:p-14 rounded-[3.5rem] shadow-2xl shadow-primary-500/10 border border-white dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-2xl"
        >
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] group-hover:bg-primary-500/20 transition-all duration-1000"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-5 gap-12 items-center">
            <div className="col-span-3 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                <Sparkles className="w-4 h-4" />
                Metrik Performa Langsung
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                  Dasbor<span className="text-primary-500">Penta</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                  Mesin analitik waktu-nyata untuk keunggulan akademik. Melacak dengan <span className="text-slate-900 dark:text-white font-bold underline decoration-primary-500 underline-offset-4">presisi 98%</span> pada data publikasi.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-500/25 transition-all flex items-center gap-3 group/btn hover:-translate-y-1">
                  <span className="font-bold">Jelajahi data</span>
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
                <div className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:opacity-90 transition-all cursor-pointer hover:-translate-y-1">
                  Dokumentasi
                </div>
              </div>
            </div>

            <div className="col-span-2 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Poin KPI</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-primary-400">{stats?.total_points?.toLocaleString() || '0'}</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-2" />
                  </div>
                  <div className="bg-primary-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-primary-500/20">
                    <p className="text-[10px] font-black text-primary-100 uppercase tracking-widest mb-3">Total Sitasi</p>
                    <h3 className="text-3xl font-black">{(stats?.total_citations || 0).toLocaleString()}</h3>
                    <TrendingUp className="w-4 h-4 text-primary-200 mt-2 rotate-45" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                   <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-3">Dosen Aktif</p>
                    <h3 className="text-3xl font-black">{stats?.total_dosen || 0}</h3>
                    <Users className="w-4 h-4 text-indigo-200 mt-2" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verifikasi</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">98%</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Personel Aktif', val: stats?.total_dosen || 0, change: '+12%', icon: Users, color: 'primary' },
            { label: 'Performa Terbaik', val: leaderboard[0]?.total_kpi_points || 0, change: 'Rekor', icon: Trophy, color: 'amber' },
            { label: 'Aset Terverifikasi', val: stats?.approved_docs || 0, change: '96%', icon: FileText, color: 'emerald' },
            { label: 'Visibilitas Total', val: (stats?.total_citations || 0).toLocaleString(), change: '+4.2k', icon: BookOpen, color: 'indigo' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700">
                  {item.change}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{item.val}</h4>
                {i === 1 && <span className="text-xs font-black text-amber-500">UTAMA</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 lg:p-14 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-14 opacity-5 pointer-events-none">
              <TrendingUp className="w-64 h-64 text-primary-500" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-500/10 rounded-2xl">
                    <Building2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Intelijen Fakultas</h3>
                </div>
                <p className="text-slate-500 font-medium max-w-sm">Distribusi global metrik KPI di seluruh fakultas khusus.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group/search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary-500 transition-colors" />
                  <input type="text" placeholder="Cari fakultas..." className="pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 focus:ring-2 ring-primary-500/20 focus:border-primary-500 outline-none w-64 transition-all" />
                </div>
                <button className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
                  <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center relative z-10">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={formattedFakultasData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      animationDuration={1500}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {formattedFakultasData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '24px', 
                        border: 'none', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                        padding: '24px',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {formattedFakultasData.map((f: any, i: number) => {
                  const percentage = totalFakultasPoints > 0 ? ((f.value / totalFakultasPoints) * 100).toFixed(1) : '0';
                  return (
                    <motion.div 
                      key={f.fullName}
                      whileHover={{ x: 10 }}
                      className="group/item flex items-center gap-6 p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg" style={{ backgroundColor: f.color }}>
                          {f.name[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-50">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-black text-slate-800 dark:text-white group-hover/item:text-primary-600 transition-colors">{f.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{f.dosen} PERSONEL</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 dark:text-white">{f.value.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.color }}></div>
                          <p className="text-[10px] font-bold text-slate-400">{percentage}%</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col gap-8"
          >

            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col flex-1">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Peringkat Lengkap</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
              
              <div className="p-4 space-y-1">
                {leaderboard.slice(0, 8).map((user: any, index: number) => (
                  <button 
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[140px] group-hover:text-primary-600 transition-colors">{user.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{user.program_studi}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{user.total_kpi_points.toLocaleString()}</p>
                      <p className="text-[8px] font-black text-slate-300 uppercase">Poin</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-8 mt-auto">
                <button className="w-full py-5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 text-slate-900 dark:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 group/all">
                  Lihat Papan Peringkat Lengkap
                  <ArrowUpRight className="w-4 h-4 group-hover/all:translate-x-1 group-hover/all:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-primary-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 w-fit shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-3xl font-black mb-4 leading-[1.1]">Verifikasi Data Otomatis</h4>
                <p className="text-primary-100/80 font-medium text-sm leading-relaxed">
                  Mesin sinkronisasi kami memproses <span className="font-bold text-white">4.200+</span> rekam publikasi unik bulan ini tanpa entri manual.
                </p>
              </div>
              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-200 text-white/60">Throughput Sistem</span>
                  <span className="text-2xl font-black">98.2%</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '98.2%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-white"></motion.div>
                </div>
              </div>
            </div>
            <Sparkles className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 pointer-events-none" />
          </div>
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-10 lg:p-14 flex flex-col md:flex-row items-center gap-16 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/5 blur-3xl pointer-events-none"></div>
            <div className="w-full md:w-5/12 relative">
               <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl peer"></div>
                <div className="relative grid grid-cols-2 gap-4 h-full">
                  {[
                    { label: 'Scholar', val: stats?.total_scholar || 0, icon: BookOpen, color: 'primary' },
                    { label: 'Scopus', val: stats?.total_scopus || 0, icon: Sparkles, color: 'indigo' },
                    { label: 'Riset', val: stats?.total_research || 0, icon: Zap, color: 'amber' },
                    { label: 'Draft', val: (stats?.total_docs || 0) - (stats?.approved_docs || 0), icon: FileText, color: 'slate' }
                  ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-700 group-hover:even:translate-y-2 group-hover:odd:-translate-y-2`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-500 mb-4`} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <h5 className="text-xl font-black text-slate-900 dark:text-white">{item.val.toLocaleString()}</h5>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h4 className="text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">Analisis Distribusi Luaran</h4>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Pemetaan otomatis seluruh aktivitas akademik. PentaDosen mengintegrasikan data dari berbagai platform indeksasi global secara otonom.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produktivitas Riset</span>
                    <span className="text-sm font-black text-primary-500">+{((stats?.total_research / (stats?.total_dosen || 1)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-primary-500"></motion.div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akurasi Sinkron</span>
                    <span className="text-sm font-black text-indigo-500">99.4%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '99.4%' }} transition={{ duration: 1.2 }} className="h-full bg-indigo-500"></motion.div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-primary-600 shadow-sm">
                      PENTA
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Informasi diperbarui setiap 24 jam</p>
              </div>
            </div>
          </div>
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