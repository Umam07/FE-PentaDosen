import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronRight, BarChart3, BookOpen, Users, FileText, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Leaderboard({ isHero = false }: { isHero?: boolean }) {
  const navigate = useNavigate();
  const HeadingTag = isHero ? 'h2' : 'h3';
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, statsRes] = await Promise.all([
          fetch('/api/leaderboard'),
          fetch('/api/dashboard/stats')
        ]);
        const lbData = await lbRes.json();
        const sData = await statsRes.json();
        
        setLeaderboard(lbData.leaderboard || []);
        setStats(sData);
      } catch (error) {
        console.error('Failed to fetch leaderboard data on Home', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDocs = (stats?.total_docs || 0) + (stats?.total_research || 0) + (stats?.total_scholar || 0) + (stats?.total_scopus || 0);
  const scopusCount = stats?.total_scopus || 0;
  const scholarCount = stats?.total_scholar || 0;
  const internalCount = (stats?.total_docs || 0) + (stats?.total_research || 0);
  
  const scopusPercent = totalDocs > 0 ? (scopusCount / totalDocs) * 100 : 0;
  const scholarPercent = totalDocs > 0 ? (scholarCount / totalDocs) * 100 : 0;
  const internalPercent = totalDocs > 0 ? (internalCount / totalDocs) * 100 : 0;

  const content = loading ? (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-pulse">
      <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-8 lg:p-10 h-96"></div>
      <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-8 lg:p-10 h-96"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Top 5 Lecturers List (Identical to InsightsLeaderboard) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-6 sm:p-8 flex flex-col justify-between shadow-xs"
      >
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline-light dark:border-hairline-dark">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark rounded-xl">
                <Trophy className="w-5 h-5" />
              </div>
              <HeadingTag className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Top 5 Peringkat Dosen</HeadingTag>
            </div>
            <button 
              onClick={() => navigate('/lecturers')}
              className="text-xs font-bold text-accent dark:text-accent-on-dark hover:text-accent-hover dark:hover:text-accent-on-dark flex items-center gap-1 group cursor-pointer transition-colors"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
 
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((user: any, index: number) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <button 
                  key={user.id}
                  onClick={() => navigate(`/lecturer/${user.id}`)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all group border text-left cursor-pointer focus:outline-hidden ${
                    isFirst 
                      ? 'bg-warning-soft/60 dark:bg-warning/10 border-warning-border dark:border-warning/30' 
                      : 'bg-surface-light-raised/70 dark:bg-surface-dark-elevated/40 border-hairline-light dark:border-hairline-dark hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs">
                    {isFirst ? (
                      <span className="w-full h-full rounded-xl bg-warning text-on-ink flex items-center justify-center shadow-xs">1</span>
                    ) : isSecond ? (
                      <span className="w-full h-full rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark flex items-center justify-center">2</span>
                    ) : isThird ? (
                      <span className="w-full h-full rounded-xl bg-[#9a4e1d]/15 text-[#9a4e1d] dark:bg-[#d9823b]/20 dark:text-[#efa466] border border-[#9a4e1d]/30 dark:border-[#d9823b]/40 flex items-center justify-center">3</span>
                    ) : (
                      <span className="font-mono text-muted dark:text-on-dark-muted">{index + 1}</span>
                    )}
                  </div>

                  {/* Lecturer Photo / Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center font-bold text-xs shrink-0 border border-hairline-light dark:border-hairline-dark overflow-hidden">
                    {user.thumbnail ? (
                      <img 
                        src={user.thumbnail} 
                        alt={user.name} 
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-body-strong dark:text-on-dark">
                        {user.name?.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Name and Program Studi */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-muted dark:text-on-dark-muted truncate">
                      {user.program_studi}
                    </p>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-black text-ink-heading dark:text-on-dark">
                      {Math.round(user.total_kpi_points).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted dark:text-on-dark-muted">Poin</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Global Productivity Stats */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-6 lg:p-8 flex flex-col justify-between shadow-sm"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline-light dark:border-hairline-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-ink-soft dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                <BarChart3 className="w-5 h-5 text-accent dark:text-accent-on-dark" />
              </div>
              <HeadingTag className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">Statistik Produktivitas</HeadingTag>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-soft dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-[11px] font-mono font-bold text-body dark:text-on-dark-soft shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Data Real-Time</span>
            </div>
          </div>

          {/* Featured Highlight: Total Akumulasi Poin KPI & Source Distribution */}
          <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 sm:p-5 border border-hairline-light-soft dark:border-hairline-dark-soft mb-4">
            <div className="mb-1.5">
              <span className="text-xs font-mono font-bold text-body-strong dark:text-on-dark-soft">
                Total Akumulasi Poin KPI
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl sm:text-4xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                {stats?.total_points ? Math.round(stats.total_points).toLocaleString() : '0'}
              </span>
              <span className="text-xs font-mono font-bold text-body dark:text-on-dark-soft">
                Poin
              </span>
            </div>

            {/* Distribution Contribution Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-hairline-light dark:bg-canvas-dark overflow-hidden flex">
                <div 
                  style={{ width: `${scopusPercent}%` }} 
                  className="h-full bg-chart-scopus dark:bg-chart-scopus-dark transition-all duration-500" 
                  title={`Scopus: ${scopusCount} dokumen (${scopusPercent.toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${scholarPercent}%` }} 
                  className="h-full bg-chart-scholar dark:bg-chart-scholar-dark transition-all duration-500" 
                  title={`Google Scholar: ${scholarCount} dokumen (${scholarPercent.toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${internalPercent}%` }} 
                  className="h-full bg-accent/70 dark:bg-accent-on-dark/70 transition-all duration-500" 
                  title={`Riset Internal: ${internalCount} dokumen (${internalPercent.toFixed(1)}%)`} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-body dark:text-on-dark-soft pt-0.5">
                <span className="flex items-center gap-1.5" title={`Scopus: ${scopusCount.toLocaleString()} dokumen`}>
                  <span className="w-2 h-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark" />
                  Scopus <span className="text-ink-heading dark:text-on-dark font-bold">{scopusPercent.toFixed(1)}%</span>
                </span>
                <span className="flex items-center gap-1.5" title={`Google Scholar: ${scholarCount.toLocaleString()} dokumen`}>
                  <span className="w-2 h-2 rounded-full bg-chart-scholar dark:bg-chart-scholar-dark" />
                  Scholar <span className="text-ink-heading dark:text-on-dark font-bold">{scholarPercent.toFixed(1)}%</span>
                </span>
                <span className="flex items-center gap-1.5" title={`Riset Internal: ${internalCount.toLocaleString()} dokumen`}>
                  <span className="w-2 h-2 rounded-full bg-accent/70 dark:bg-accent-on-dark/70" />
                  Internal <span className="text-ink-heading dark:text-on-dark font-bold">{internalPercent.toFixed(1)}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Metric Tiles (3-column on sm, 1-col on mobile) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { 
                label: 'Total Dokumen', 
                val: totalDocs, 
                sub: 'Publikasi Riset',
                icon: BookOpen 
              },
              { 
                label: 'Total Sitasi', 
                val: stats?.total_citations || 0, 
                sub: 'Kutipan Sitasi',
                icon: FileText 
              },
              { 
                label: 'Dosen Aktif', 
                val: stats?.total_dosen || 0, 
                sub: 'Terverifikasi',
                icon: Users 
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft hover:border-hairline-light dark:hover:border-hairline-dark p-3 sm:p-3.5 rounded-xl flex flex-col justify-between transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-body-strong dark:text-on-dark-soft truncate">
                    {item.label}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-ink-soft dark:bg-surface-dark flex items-center justify-center text-body dark:text-on-dark-soft shrink-0">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-mono font-bold text-ink-heading dark:text-on-dark">
                    {item.val.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-body dark:text-on-dark-soft font-medium truncate mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Row: Average KPI with Interactive Calculation Tooltip */}
        <div className="mt-6 pt-5 border-t border-hairline-light dark:border-hairline-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h3 className="text-xs font-bold text-ink-heading dark:text-on-dark">Rerata Nilai KPI Dosen</h3>
              <div className="relative group/tooltip inline-flex items-center">
                <button
                  type="button"
                  aria-label="Informasi cara perhitungan Rerata Nilai KPI"
                  className="text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-help rounded-full p-0.5 focus:outline-hidden focus:ring-1 focus:ring-accent"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                
                {/* Tooltip Content */}
                <div 
                  role="tooltip"
                  className="absolute bottom-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mb-2 w-64 p-3 rounded-xl bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark border border-ink-border/30 dark:border-hairline-dark shadow-xl text-left pointer-events-none opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-all duration-200 z-30"
                >
                  <p className="text-[11px] font-bold text-on-ink dark:text-on-dark mb-1">
                    Metode Perhitungan
                  </p>
                  <p className="text-[11px] font-mono text-on-dark-soft dark:text-on-dark-muted bg-white/10 dark:bg-canvas-dark px-2 py-1 rounded-md mb-1.5 border border-white/10 dark:border-hairline-dark">
                    Total Poin KPI ÷ Total Dosen
                  </p>
                  <p className="text-[10px] text-on-dark-soft dark:text-on-dark-muted leading-relaxed">
                    Dihitung dari seluruh akumulasi poin Tri Dharma dosen terdaftar di Universitas YARSI.
                  </p>
                  {/* Arrow tooltip */}
                  <div className="absolute top-full left-1/2 sm:left-3 -translate-x-1/2 sm:translate-x-0 border-4 border-transparent border-t-ink dark:border-t-surface-dark-elevated" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-light-raised dark:bg-surface-dark-elevated px-3.5 py-2 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center sm:text-right min-w-[90px]">
            <p className="text-lg font-mono font-bold text-accent dark:text-accent-on-dark">
              {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
            </p>
            <p className="text-[10px] font-mono font-bold text-body dark:text-on-dark-soft">Poin Rerata</p>
          </div>
        </div>
      </motion.div>

    </div>
  );

  if (isHero) {
    return <div>{content}</div>;
  }

  return (
    <section id="leaderboard" className="py-20 md:py-32 bg-canvas-light dark:bg-canvas-dark relative overflow-hidden">
      {/* Structural Line Grid Pattern (No glows, no gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warning-soft dark:bg-surface-dark-elevated border border-warning-border dark:border-hairline-dark mb-6"
          >
            <Trophy className="w-4 h-4 text-warning dark:text-warning-on-dark" />
            <span className="text-xs font-mono font-bold text-warning dark:text-warning-on-dark">
              Prestasi Akademik
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-ink-heading dark:text-on-dark tracking-tight leading-tight mb-4"
          >
            Leaderboard Dosen <span className="text-warning dark:text-warning-on-dark">Terbaik Tahun Ini</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-body dark:text-on-dark-soft max-w-2xl mx-auto leading-relaxed"
          >
            Apresiasi performa dosen dengan poin KPI tertinggi dan kontribusi riset teraktif pada tahun ini.
          </motion.p>
        </div>

        {content}
      </div>
    </section>
  );
}
