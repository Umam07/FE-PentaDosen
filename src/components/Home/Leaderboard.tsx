import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Sparkles, Zap, BookOpen, Users, FileText, ArrowRight } from 'lucide-react';
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

  const content = loading ? (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-pulse">
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 p-8 lg:p-10 h-96"></div>
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 p-8 lg:p-10 h-96"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Top 5 Lecturers List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col justify-between shadow-sm"
      >
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <HeadingTag className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Top 5 Peringkat Dosen</HeadingTag>
            </div>
            <button 
              onClick={() => navigate('/lecturers')}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
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
                className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group border border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Rank Badge */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-extrabold ${
                  index === 0 ? 'bg-amber-500 text-white' : 
                  index === 1 ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' : 
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {index + 1}
                </div>

                {/* Lecturer Photo / Avatar */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {user.thumbnail ? (
                    <img src={user.thumbnail} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-600 dark:text-slate-300 uppercase">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user.name}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.program_studi}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{Math.round(user.total_kpi_points).toLocaleString()}</p>
                  <p className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">Poin KPI</p>
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
        className="lg:col-span-6 bg-slate-900 dark:bg-slate-900 rounded-2xl border border-slate-800 p-6 lg:p-8 text-white flex flex-col justify-between shadow-sm"
      >
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-primary-950/60 border border-primary-800/50">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
            <HeadingTag className="text-base font-bold uppercase tracking-tight text-white">Statistik Produktivitas</HeadingTag>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {[
              { label: 'Total Dokumen', val: (stats?.total_docs || 0) + (stats?.total_research || 0) + (stats?.total_scholar || 0) + (stats?.total_scopus || 0), icon: BookOpen, color: 'text-indigo-400 bg-indigo-950/50 border-indigo-900/50', colSpan: 'col-span-2' },
              { label: 'Total Sitasi', val: stats?.total_citations || 0, icon: FileText, color: 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50' },
              { label: 'Dosen Aktif', val: stats?.total_dosen || 0, icon: Users, color: 'text-blue-400 bg-blue-950/50 border-blue-900/50' }
            ].map((item, i) => (
              <div key={i} className={`bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5 ${item.colSpan || ''}`}>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <div className="text-base font-mono font-bold text-white">{item.val.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-200">Rerata Nilai KPI Dosen</h4>
            <p className="text-[11px] text-slate-400">Total Poin KPI / Jumlah Dosen Terdaftar</p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center sm:text-right min-w-[110px]">
            <p className="text-lg font-mono font-bold text-primary-400">
              {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
            </p>
            <p className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">Poin Rerata</p>
          </div>
        </div>
      </motion.div>

    </div>
  );

  if (isHero) {
    return <div>{content}</div>;
  }

  return (
    <section id="leaderboard" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              PRESTASI AKADEMIK
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
          >
            Leaderboard Dosen <span className="text-amber-600 dark:text-amber-400">Terbaik Tahun Ini</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Apresiasi performa dosen dengan poin KPI tertinggi dan kontribusi riset teraktif pada tahun ini.
          </motion.p>
        </div>

        {content}
      </div>
    </section>
  );
}
