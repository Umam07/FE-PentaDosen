import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, BarChart3, BookOpen, Users, FileText, ArrowRight, ArrowUpRight } from 'lucide-react';
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
  const internalCount = (stats?.total_research || 0) + (stats?.total_docs || 0);

  const docsSum = totalDocs > 0 ? totalDocs : 1;
  const scopusPercent = totalDocs > 0 ? Math.max(5, Math.round((scopusCount / docsSum) * 100)) : 35;
  const scholarPercent = totalDocs > 0 ? Math.max(5, Math.round((scholarCount / docsSum) * 100)) : 45;
  const internalPercent = Math.max(0, 100 - scopusPercent - scholarPercent);

  const content = loading ? (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-pulse">
      <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-8 lg:p-10 h-96"></div>
      <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-8 lg:p-10 h-96"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Top 5 Lecturers List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-6 bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-6 lg:p-8 flex flex-col justify-between shadow-sm"
      >
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline-light dark:border-hairline-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-soft dark:bg-surface-dark-elevated border border-warning-border dark:border-hairline-dark">
                <Trophy className="w-5 h-5 text-warning dark:text-warning-on-dark" />
              </div>
              <HeadingTag className="text-base font-bold text-ink-heading dark:text-on-dark uppercase tracking-tight">Top 5 Peringkat Dosen</HeadingTag>
            </div>
            <button 
              onClick={() => navigate('/lecturers')}
              className="text-xs font-bold text-accent dark:text-accent-on-dark hover:text-accent-hover flex items-center gap-1 group cursor-pointer"
            >
              LIHAT SEMUA
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
 
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((user: any, index: number) => (
              <button 
                key={user.id}
                onClick={() => navigate(`/lecturer/${user.id}`)}
                className="w-full flex items-center gap-3.5 p-3 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all group border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark cursor-pointer"
              >
                {/* Rank Badge */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-extrabold ${
                  index === 0 ? 'bg-warning text-white' : 
                  index === 1 ? 'bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark' : 
                  index === 2 ? 'bg-[#9a6125] text-white' :
                  'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft'
                }`}>
                  {index + 1}
                </div>

                {/* Lecturer Photo / Avatar */}
                <div className="w-10 h-10 rounded-lg bg-ink-soft dark:bg-surface-dark-elevated flex items-center justify-center font-bold text-xs shrink-0 border border-hairline-light dark:border-hairline-dark overflow-hidden">
                  {user.thumbnail ? (
                    <img src={user.thumbnail} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-body dark:text-on-dark-soft uppercase">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-bold text-ink-heading dark:text-on-dark truncate group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors uppercase tracking-tight">{user.name}</p>
                  <p className="text-xs font-medium text-muted dark:text-on-dark-muted truncate">{user.program_studi}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-bold text-ink-heading dark:text-on-dark">{Math.round(user.total_kpi_points).toLocaleString()}</p>
                  <p className="text-[9px] font-mono font-bold text-muted dark:text-on-dark-muted uppercase">Poin KPI</p>
                </div>
              </button>
            ))}
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
              <HeadingTag className="text-base font-bold text-ink-heading dark:text-on-dark uppercase tracking-tight">Statistik Produktivitas</HeadingTag>
            </div>
            <button 
              onClick={() => navigate('/insights')}
              className="text-xs font-bold text-accent dark:text-accent-on-dark hover:text-accent-hover flex items-center gap-1 group cursor-pointer"
            >
              LIHAT INSIGHT
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Featured Highlight: Total Akumulasi Poin KPI & Source Distribution */}
          <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 sm:p-5 border border-hairline-light-soft dark:border-hairline-dark-soft mb-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                Total Akumulasi Poin KPI
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-ink-soft dark:bg-canvas-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                Universitas YARSI
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl sm:text-4xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                {stats?.total_points ? Math.round(stats.total_points).toLocaleString() : '0'}
              </span>
              <span className="text-xs font-mono font-bold text-muted dark:text-on-dark-muted uppercase">
                Poin Agregat
              </span>
            </div>

            {/* Distribution Contribution Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-hairline-light dark:bg-canvas-dark overflow-hidden flex">
                <div 
                  style={{ width: `${scopusPercent}%` }} 
                  className="h-full bg-chart-scopus dark:bg-chart-scopus-dark transition-all duration-500" 
                  title={`Scopus: ${scopusCount} dokumen`} 
                />
                <div 
                  style={{ width: `${scholarPercent}%` }} 
                  className="h-full bg-chart-scholar dark:bg-chart-scholar-dark transition-all duration-500" 
                  title={`Google Scholar: ${scholarCount} dokumen`} 
                />
                <div 
                  style={{ width: `${internalPercent}%` }} 
                  className="h-full bg-accent/70 dark:bg-accent-on-dark/70 transition-all duration-500" 
                  title={`Riset Internal: ${internalCount} dokumen`} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted dark:text-on-dark-muted pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark" />
                  Scopus <span className="text-ink-heading dark:text-on-dark font-bold">({scopusCount.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-chart-scholar dark:bg-chart-scholar-dark" />
                  Scholar <span className="text-ink-heading dark:text-on-dark font-bold">({scholarCount.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent/70 dark:bg-accent-on-dark/70" />
                  Internal <span className="text-ink-heading dark:text-on-dark font-bold">({internalCount.toLocaleString()})</span>
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
                  <span className="text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted uppercase truncate">
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
                  <p className="text-[10px] text-muted dark:text-on-dark-muted font-medium truncate mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Row: Average KPI & Insights CTA */}
        <div className="mt-6 pt-5 border-t border-hairline-light dark:border-hairline-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark">Rerata Nilai KPI Dosen</h4>
            <p className="text-[11px] text-muted dark:text-on-dark-muted">Total Poin KPI / Jumlah Dosen Terdaftar</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated px-3.5 py-2 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center sm:text-right min-w-[90px]">
              <p className="text-lg font-mono font-bold text-accent dark:text-accent-on-dark">
                {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
              </p>
              <p className="text-[9px] font-mono font-bold uppercase text-muted dark:text-on-dark-muted tracking-wider">Poin Rerata</p>
            </div>
            <button 
              onClick={() => navigate('/insights')}
              title="Buka Analisis Insights Lengkap"
              className="p-2.5 rounded-xl bg-ink-soft hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark transition-all cursor-pointer group"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
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
            <span className="text-xs font-mono font-bold text-warning dark:text-warning-on-dark uppercase tracking-wider">
              PRESTASI AKADEMIK
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
