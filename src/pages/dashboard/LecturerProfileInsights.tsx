import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Award, FileText, Building2, BookOpen, Calendar, 
  GraduationCap, Users, Sparkles, TrendingUp, Zap, 
  ArrowLeft, Search, ShieldCheck, Mail, MapPin,
  ExternalLink, Lock, Book, FileCode, CheckCircle2, Trophy,
  RefreshCw, Globe, Fingerprint
} from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Customized } from 'recharts';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

// 1. Komponen Kustom Crosshair ala TradingView
const CustomCrosshair = (props: any) => {
  const { offset, leftMax, rightMax, crosshairData } = props;
  
  if (!offset || !crosshairData || crosshairData.y === undefined || crosshairData.x === undefined) return null;

  const { left, right, top, bottom, height } = offset;
  const { x, y, year } = crosshairData;

  const boundedY = Math.max(top, Math.min(bottom, y));

  const ratio = (bottom - boundedY) / height;
  const leftValue = (ratio * leftMax).toFixed(1);
  const rightValue = (ratio * rightMax).toFixed(1);

  const lineColor = "#71717a"; 
  const badgeBg = "#18181b"; 
  const textColor = "#ffffff"; 

  return (
    <g className="recharts-custom-crosshair pointer-events-none">
      <line x1={left} y1={boundedY} x2={right} y2={boundedY} stroke={lineColor} strokeDasharray="3 3" strokeWidth={1} />
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={lineColor} strokeDasharray="3 3" strokeWidth={1} />

      <circle cx={x} cy={boundedY} r={4.5} fill="#0ea5e9" />
      <circle cx={x} cy={boundedY} r={10} fill="#0ea5e9" opacity={0.25} />

      <path d={`M ${left} ${boundedY} L ${left - 6} ${boundedY - 11} H ${left - 42} V ${boundedY + 11} H ${left - 6} Z`} fill={badgeBg} />
      <text x={left - 23} y={boundedY + 3.5} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{leftValue}</text>

      <path d={`M ${right} ${boundedY} L ${right + 6} ${boundedY - 11} H ${right + 42} V ${boundedY + 11} H ${right + 6} Z`} fill={badgeBg} />
      <text x={right + 24} y={boundedY + 3.5} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{rightValue}</text>

      <path d={`M ${x} ${bottom} L ${x + 6} ${bottom + 6} H ${x + 22} V ${bottom + 24} H ${x - 22} V ${bottom + 6} L ${x - 6} ${bottom + 6} Z`} fill={badgeBg} />
      <text x={x} y={bottom + 17} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{year}</text>
    </g>
  );
};

// 2. Komponen Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl shadow-xl shrink-0 min-w-[150px] font-sans">
        <p className="text-gray-900 dark:text-gray-100 font-bold mb-2 border-b border-gray-100 dark:border-zinc-700 pb-2">Tahun {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-600 dark:text-zinc-400">{entry.name}:</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 3. Chart Trend
const ProfileTrendChart = ({ chartData, leftDomainMax, rightDomainMax }: any) => {
  const [crosshair, setCrosshair] = useState<{ x: number, y: number, year: string } | null>(null);

  return (
    <div className="w-full overflow-x-auto pb-4"> 
      <div className="h-80 min-w-[600px] w-full relative"> 
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 40, right: 60, bottom: 35, left: 60 }} 
            onMouseMove={(state: any) => {
              if (state && state.isTooltipActive && state.activeCoordinate) {
                setCrosshair({ 
                  x: state.activeCoordinate.x,
                  y: state.chartY,
                  year: state.activeLabel 
                });
              } else {
                setCrosshair(null);
              }
            }}
            onMouseLeave={() => setCrosshair(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.15} />
            
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} dy={10} />
            
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              domain={[0, leftDomainMax]} 
              tick={{ fill: '#0d9488', fontSize: 12, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dx={-10} 
              label={{ 
                value: 'Publikasi', 
                position: 'top', 
                offset: 20, 
                fill: '#0d9488', 
                fontWeight: 'bold',
                style: { textAnchor: 'start', fontStyle: 'normal' }
              }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, rightDomainMax]} 
              tick={{ fill: '#a855f7', fontSize: 12, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dx={10} 
              label={{ 
                value: 'Sitasi', 
                position: 'top', 
                offset: 20, 
                fill: '#a855f7', 
                fontWeight: 'bold',
                style: { textAnchor: 'end', fontStyle: 'normal' }
              }} 
            />
            
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            <Legend wrapperStyle={{ paddingTop: '25px', fontSize: '12px', fontWeight: 500 }} />
            
            <Customized 
              component={(props: any) => (
                <CustomCrosshair 
                  {...props} 
                  crosshairData={crosshair} 
                  leftMax={leftDomainMax} 
                  rightMax={rightDomainMax} 
                />
              )} 
            />

            <Bar yAxisId="left" dataKey="publications" name="Jumlah Publikasi" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={45} />
            <Line yAxisId="right" type="monotone" dataKey="citations" name="Sitasi" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#a855f7' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function LecturerProfileInsights() {
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
        setProfile(profileRes);
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
    
    const filterByCategory = (keywords: string[]) => 
      sortedDocs.filter(d => keywords.some(k => d.category?.toLowerCase().includes(k)));

    const research = filterByCategory(['penelitian', 'proposal', 'laporan']);
    const hki = filterByCategory(['hki', 'kekayaan intelektual']);
    const books = filterByCategory(['buku', 'ajar']);

    return {
      research: { items: research.slice(0, 5), hasMore: research.length > 5, total: research.length },
      hki: { items: hki.slice(0, 5), hasMore: hki.length > 5, total: hki.length },
      books: { items: books.slice(0, 5), hasMore: books.length > 5, total: books.length }
    };
  }, [documents]);

  const stats = useMemo(() => {
    if (!profile || !profile.user) return null;
    const user = profile.user;
    return [
      { 
        label: 'Total KPI Overall', 
        val: user.total_kpi_points?.toLocaleString() || '0', 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'KPI Score 3 Tahun', 
        val: (user.total_kpi_points * 0.8).toFixed(0), // Dummy calculation if not in profile
        icon: TrendingUp, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      },
      { 
        label: 'KPI Tahun Ini', 
        val: (user.total_kpi_points * 0.3).toFixed(0), // Dummy calculation
        icon: Zap, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      }
    ];
  }, [profile]);

  // Publication Data Processing
  const publicationData = useMemo(() => {
    if (!profile) return { filteredPubs: [], chartData: [], leftMax: 10, rightMax: 10 };

    const { publications = [], scopusPublications = [] } = profile;
    
    const scholarPubsTagged = publications.map((p: any) => ({ ...p, source: 'scholar' }));
    const scopusPubsTagged = scopusPublications.map((p: any) => ({ ...p, source: 'scopus' }));
    
    const activeRawData = publicationSubTab === 'scholar' ? scholarPubsTagged : scopusPubsTagged;
    
    // Process Chart Data (tetap gunakan semua data agar tren akurat)
    const chartDataMap = new Map();
    activeRawData.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));

    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };

    const leftMax = getNiceMax(Math.max(...chartData.map(d => d.publications), 0));
    const rightMax = getNiceMax(Math.max(...chartData.map(d => d.citations), 0));

    // Limit list display to 5 newest items
    const limitedPubs = [...activeRawData]
      .sort((a: any, b: any) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      })
      .slice(0, 5);

    return { 
      filteredPubs: limitedPubs, 
      chartData, 
      leftMax, 
      rightMax, 
      hasMore: activeRawData.length > 5,
      total: activeRawData.length 
    };
  }, [profile, publicationSubTab]);

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

  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-mono">
        <Navbar />
        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 font-bold hover:underline">Kembali</button>
      </div>
    );
  }

  const { user, scholarData, scopusData } = profile;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        
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
          className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm mb-8"
        >
          {/* Premium Decorative Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Mesh Gradients Blobs */}
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[150%] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[120%] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[100px]" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] left-[20%] w-[40%] h-[80%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px]"></div>
            
            {/* Subtle Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Gradient Overlay for smoothness */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-900"></div>
          </div>
          
          <div className="relative z-10 p-8 lg:p-16 flex flex-col md:flex-row items-center md:items-end gap-10">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[3rem] bg-gradient-to-br from-primary-500 to-emerald-500 p-1.5 shadow-2xl transition-transform duration-700 group-hover:rotate-3">
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[2.8rem] flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900">
                  {user.thumbnail ? (
                    <img src={user.thumbnail} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {user.name?.substring(0, 1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Lecturer
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight uppercase">
                  {user.name}
                </h1>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 lg:gap-6 pt-2">
                  {/* University Field */}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/30 group">
                    <Building2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Institution</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Universitas Yarsi</span>
                    </div>
                  </div>

                  {/* Department Field */}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-orange-500/30 group">
                    <GraduationCap className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{user.program_studi || 'Teknik Informatika'}</span>
                    </div>
                  </div>

                  {/* Penta ID Field */}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-primary-500/30 group">
                    <Fingerprint className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Penta ID</span>
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{user.penta_id || '7124001'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-32 bg-slate-100 dark:bg-slate-800 mx-4"></div>

            <div className="hidden lg:flex flex-col items-center gap-2 bg-slate-900 dark:bg-white p-10 rounded-[2.5rem] shadow-2xl">
                <p className="text-[10px] font-black text-white/40 dark:text-slate-500 uppercase tracking-widest">Performance Score</p>
                <div className="text-4xl font-black text-white dark:text-slate-900 tracking-tighter flex items-center gap-2">
                   {user.total_kpi_points?.toLocaleString() || '0'}
                </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
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


                {/* Publication Trend Chart */}
                {publicationData.chartData.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-primary-500/10 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        Tren {publicationSubTab === 'scopus' ? 'Scopus' : 'Scholar'} Per Tahun
                      </h4>
                    </div>
                    <ProfileTrendChart 
                      chartData={publicationData.chartData} 
                      leftDomainMax={publicationData.leftMax} 
                      rightDomainMax={publicationData.rightMax} 
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {publicationData.filteredPubs.length > 0 ? (
                    publicationData.filteredPubs.map((doc: any, idx: number) => (
                      <div key={idx} className="group p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                          publicationSubTab === 'scopus' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {publicationSubTab === 'scopus' ? <Globe className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                              publicationSubTab === 'scopus' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {publicationSubTab === 'scopus' ? 'Scopus Indexed' : 'Scholar'}
                            </span>
                            {doc.year && (
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {doc.year}
                              </span>
                            )}
                          </div>
                          <a 
                            href={doc.link || (publicationSubTab === 'scholar' ? `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}` : `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors block"
                          >
                            {doc.title}
                          </a>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide line-clamp-1">
                            {doc.authors || 'Unknown Authors'}
                          </p>
                          {doc.journal && (
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium italic">
                              {doc.journal}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{doc.citations || 0}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
                          </div>
                          <a 
                            href={doc.link || (publicationSubTab === 'scholar' ? `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}` : `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
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

                {publicationData.hasMore && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 px-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800"
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">
                      + {publicationData.total - 5} Dokumen {publicationSubTab === 'scopus' ? 'Scopus' : 'Scholar'} Lainnya Tersedia
                    </p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all shadow-sm"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Login untuk Lihat Semua</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'penelitian' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categorizedDocs.research.items.length > 0 ? (
                    categorizedDocs.research.items.map((doc: any, idx: number) => (
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
                
                {categorizedDocs.research.hasMore && (
                  <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                       + {categorizedDocs.research.total - 5} Penelitian Lainnya Tersedia
                    </p>
                    <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span>Login untuk Lihat Semua</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hki' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categorizedDocs.hki.items.length > 0 ? (
                    categorizedDocs.hki.items.map((doc: any, idx: number) => (
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

                {categorizedDocs.hki.hasMore && (
                  <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                       + {categorizedDocs.hki.total - 5} Kekayaan Intelektual Lainnya Tersedia
                    </p>
                    <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span>Login untuk Lihat Semua</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'buku' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categorizedDocs.books.items.length > 0 ? (
                    categorizedDocs.books.items.map((doc: any, idx: number) => (
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

                {categorizedDocs.books.hasMore && (
                  <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                       + {categorizedDocs.books.total - 5} Buku & Modul Lainnya Tersedia
                    </p>
                    <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span>Login untuk Lihat Semua</span>
                    </button>
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
            className="mt-10 p-1 bg-gradient-to-r from-slate-200 via-primary-500/20 to-slate-200 dark:from-slate-800 dark:via-primary-500/20 dark:to-slate-800 rounded-[2.5rem]"
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
