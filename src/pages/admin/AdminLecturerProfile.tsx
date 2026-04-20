import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, TrendingUp, BookOpen, Award, FileText, RefreshCw, CheckCircle, Globe, ExternalLink, Mail, User } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Customized } from 'recharts';

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

// 2. Komponen Tooltip diekstrak keluar agar lebih bersih
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl shadow-xl shrink-0 min-w-[150px]">
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

// 3. Chart dibuat terpisah & di-memo (DIPERBARUI AGAR RESPONSIVE DI MOBILE)
const ProfileTrendChart = memo(({ chartData, leftDomainMax, rightDomainMax }: any) => {
  const [crosshair, setCrosshair] = useState<{ x: number, y: number, year: string } | null>(null);

  return (
    /* Menambahkan wrapper overflow-x-auto agar bisa di-scroll di HP */
    <div className="w-full overflow-x-auto pb-4"> 
      {/* Memberikan min-width agar chart tidak penyok di layar kecil */}
      <div className="h-80 min-w-[600px] w-full relative"> 
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            /* Margin disesuaikan agar label tidak terpotong dan lebih proporsional */
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
            
            <Tooltip content={<CustomTooltip />} cursor={false} />
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
});

// 4. Komponen Utama Halaman
export default function AdminLecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncingScholar, setSyncingScholar] = useState(false);
  const [syncingScopus, setSyncingScopus] = useState(false);
  const [message, setMessage] = useState('');
  
  const [pubFilter, setPubFilter] = useState<'all' | 'scholar' | 'scopus'>('scholar');
  const [pubPage, setPubPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleSyncScholar = async () => {
    if (!profile?.user?.scholar_id) {
      setMessage('Dosen belum memiliki Google Scholar ID.');
      return;
    }
    try {
      setSyncingScholar(true);
      setMessage('');
      const res = await fetch(`/api/users/${id}/sync`, { method: 'POST' });
      if (res.ok) {
        setMessage('Data Google Scholar berhasil disinkronisasi.');
        const profileRes = await fetch(`/api/users/${id}`);
        const data = await profileRes.json();
        setProfile(data);
      } else {
        setMessage('Gagal melakukan sinkronisasi Google Scholar.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSyncingScholar(false);
      setTimeout(() => setMessage(''), 5000); 
    }
  };

  const handleSyncScopus = async () => {
    if (!profile?.user?.scopus_id) {
      setMessage('Dosen belum memiliki Scopus ID.');
      return;
    }
    try {
      setSyncingScopus(true);
      setMessage('');
      const res = await fetch(`/api/users/${id}/sync-scopus`, { method: 'POST' });
      if (res.ok) {
        setMessage('Data Scopus berhasil disinkronisasi.');
        const profileRes = await fetch(`/api/users/${id}`);
        const data = await profileRes.json();
        setProfile(data);
      } else {
        setMessage('Gagal melakukan sinkronisasi Scopus. Cek konfigurasi API.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSyncingScopus(false);
      setTimeout(() => setMessage(''), 5000); 
    }
  };

  if (loading) return (
    <div className="max-w-none space-y-6 animate-pulse pb-12">
      <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
    </div>
  );

  if (!profile || !profile.user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <User className="h-16 w-16 text-gray-300 dark:text-zinc-700 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-zinc-300">User tidak ditemukan</h2>
      <button onClick={() => navigate('/admin/lecturers')} className="mt-4 text-primary-600 hover:underline">Kembali ke Daftar</button>
    </div>
  );

  const { user, scholarData, scopusData, publications, scopusPublications } = profile;

  const scholarPubsTagged = (publications || []).map((p: any) => ({ ...p, source: 'scholar' }));
  const scopusPubsTagged = (scopusPublications || []).map((p: any) => ({ ...p, source: 'scopus' }));
  const allPubs = [...scholarPubsTagged, ...scopusPubsTagged].sort((a, b) => (b.year || 0) - (a.year || 0));

  const filteredPubs = pubFilter === 'all' ? allPubs 
    : pubFilter === 'scholar' ? scholarPubsTagged 
    : scopusPubsTagged;

  // Data Agregasi
  const chartDataMap = new Map();
  filteredPubs.forEach((pub: any) => {
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

  const leftDomainMax = getNiceMax(Math.max(...chartData.map(d => d.publications), 0));
  const rightDomainMax = getNiceMax(Math.max(...chartData.map(d => d.citations), 0));

  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIdx = (pubPage - 1) * itemsPerPage;
  const currentPubs = filteredPubs.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="space-y-6 max-w-none pb-12 transition-all duration-300">
      <button 
        onClick={() => navigate('/admin/lecturers')}
        className="group flex items-center text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Dosen
      </button>

      {/* Header Profile - Sekarang Memuat Stats Scholar & Scopus */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden relative">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 h-36"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="relative group">
              {scholarData?.thumbnail ? (
                <img 
                  src={scholarData.thumbnail} 
                  alt={user.name} 
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-lg bg-white dark:bg-zinc-800"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-300 text-4xl font-bold shadow-lg">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-zinc-800 px-5 py-2.5 rounded-xl border border-primary-100 dark:border-primary-900/30 shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold leading-none mb-1">Total KPI</span>
                <span className="text-primary-900 dark:text-primary-300 font-bold leading-none">{user.total_kpi_points} Points</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user.name}</h1>
            <div className="flex items-center text-gray-500 dark:text-zinc-400 mt-2">
              <Mail className="w-4 h-4 mr-1.5" />
              <p>{user.email}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center text-sm text-gray-700 dark:text-zinc-200 bg-gray-100/80 dark:bg-zinc-800/80 px-4 py-2 rounded-lg border border-gray-200/50 dark:border-zinc-700/50">
                <GraduationCap className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                Program Studi: <span className="font-semibold ml-1.5">{user.program_studi || '-'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-zinc-200 bg-gray-100/80 dark:bg-zinc-800/80 px-4 py-2 rounded-lg border border-gray-200/50 dark:border-zinc-700/50">
                <Award className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                Role: <span className="font-semibold ml-1.5 capitalize">{user.role}</span>
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-3 rounded-lg text-sm flex items-start ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {message}
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-zinc-800 pt-8">
              
              {/* Box Scholar */}
              <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-200 dark:border-zinc-700/50 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                      <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Google Scholar</h3>
                      {user.scholar_id && <p className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 mt-0.5">ID: {user.scholar_id}</p>}
                    </div>
                  </div>
                  <button
                    onClick={handleSyncScholar}
                    disabled={syncingScholar}
                    className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncingScholar ? 'animate-spin' : ''}`} />
                    {syncingScholar ? 'Syncing...' : 'Sync'}
                  </button>
                </div>

                {scholarData ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Sitasi</p>
                        <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{scholarData.total_citations}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">h-index</p>
                        <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{scholarData.h_index}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">i10-index</p>
                        <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{scholarData.i10_index}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 text-right mt-3">
                      Update: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium text-center py-4">Belum ada data terhubung.</p>
                )}
              </div>

              {/* Box Scopus */}
              <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-200 dark:border-zinc-700/50 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-3">
                      <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Scopus</h3>
                      {user.scopus_id && <p className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 mt-0.5">ID: {user.scopus_id}</p>}
                    </div>
                  </div>
                  <button
                    onClick={handleSyncScopus}
                    disabled={syncingScopus}
                    className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncingScopus ? 'animate-spin' : ''}`} />
                    {syncingScopus ? 'Syncing...' : 'Sync'}
                  </button>
                </div>

                {scopusData ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Dokumen</p>
                        <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{scopusData.document_count}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Sitasi</p>
                        <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{scopusData.total_citations}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm text-center flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">h-index</p>
                        <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{scopusData.h_index}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 text-right mt-3">
                      Update: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium text-center py-4">Belum ada data terhubung.</p>
                )}
              </div>

            </div>

            {/* Area Chart Tren Publikasi */}
            {chartData.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-6 text-center">Tren Publikasi & Sitasi Per Tahun</h4>
                <ProfileTrendChart 
                  chartData={chartData} 
                  leftDomainMax={leftDomainMax} 
                  rightDomainMax={rightDomainMax} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Daftar Publikasi Full Width */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header with Tabs */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Publikasi</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Total {filteredPubs.length} dokumen ditemukan</p>
              </div>
            </div>
            {/* Tab Filters */}
            <div className="flex space-x-3">
              <button
                onClick={() => { setPubFilter('scholar'); setPubPage(1); }}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border-2 ${
                  pubFilter === 'scholar'
                    ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-400 border-teal-600 dark:border-teal-500 shadow-sm'
                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
              >
                Scholar ({scholarPubsTagged.length})
              </button>
              <button
                onClick={() => { setPubFilter('scopus'); setPubPage(1); }}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border-2 ${
                  pubFilter === 'scopus'
                    ? 'bg-white dark:bg-zinc-900 text-orange-700 dark:text-orange-400 border-orange-600 dark:border-orange-500 shadow-sm'
                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
              >
                Scopus ({scopusPubsTagged.length})
              </button>
            </div>
          </div>
        </div>

        {/* Publication Items */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800 flex-1">
          {currentPubs.length > 0 ? (
            currentPubs.map((pub: any, idx: number) => (
              <div key={`${pub.source}-${pub.id}-${idx}`} className="group px-6 py-5 hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        pub.source === 'scholar'
                          ? 'bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800/30'
                          : 'bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30'
                      }`}>
                        {pub.source === 'scholar' ? (
                          <><BookOpen className="h-3 w-3 mr-1.5" />Scholar</>
                        ) : (
                          <><Globe className="h-3 w-3 mr-1.5" />Scopus</>
                        )}
                      </span>
                      {pub.year && (
                        <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-1 rounded-md">
                          {pub.year}
                        </span>
                      )}
                    </div>
                    <a 
                      href={pub.link || (pub.source === 'scholar' ? `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}` : `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(pub.title)}%22)`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base font-semibold text-gray-900 dark:text-white mb-1.5 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      title="Buka di platform"
                    >
                      {pub.title}
                    </a>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3 line-clamp-1">{pub.authors}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                      {pub.journal && (
                        <span className="flex items-center bg-gray-50 dark:bg-zinc-800/50 px-2 py-1 rounded border border-gray-100 dark:border-zinc-700/50">
                          <ExternalLink className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span className="truncate max-w-[200px] sm:max-w-[400px] italic">{pub.journal}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-shrink-0 w-16 h-16 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:shadow-sm group-hover:border-gray-200 transition-all">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">{pub.citations || 0}</span>
                    <span className="text-[9px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">Sitasi</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-5 border border-gray-100 dark:border-zinc-800">
                <FileText className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada publikasi</h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm">
                {pubFilter === 'all' 
                  ? 'Dosen ini belum memiliki data publikasi di sistem.' 
                  : pubFilter === 'scholar' 
                    ? 'Belum ada data publikasi yang ditarik dari Google Scholar.'
                    : 'Belum ada data publikasi yang ditarik dari database Scopus.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
            <span className="text-sm text-gray-500 dark:text-zinc-400">
              Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{startIdx + 1}</span>–
              <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIdx + itemsPerPage, filteredPubs.length)}</span> dari{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{filteredPubs.length}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPubPage((p) => Math.max(p - 1, 1))}
                disabled={pubPage === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-white dark:hover:bg-zinc-700 hover:text-primary-600 text-gray-700 dark:text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-colors bg-transparent shadow-sm"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPubPage((p) => Math.min(p + 1, totalPages))}
                disabled={pubPage === totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-white dark:hover:bg-zinc-700 hover:text-primary-600 text-gray-700 dark:text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-colors bg-transparent shadow-sm"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}