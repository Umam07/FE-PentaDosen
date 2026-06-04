import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Sparkles, Zap, BookOpen, Users, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Leaderboard({ isHero = false }: { isHero?: boolean }) {
  const navigate = useNavigate();
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
      
      {/* Top 3 Lecturers Podium/List */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 lg:p-10 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Top 5 Peringkat</h3>
            </div>
            <button 
              onClick={() => navigate('/lecturers')}
              className="text-xs font-black text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 group"
            >
              LIHAT SEMUA
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
 
          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((user: any, index: number) => (
              <button 
                key={user.id}
                onClick={() => navigate(`/lecturer/${user.id}`)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm relative shrink-0 ${
                  index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                  index === 1 ? 'bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 
                  index === 2 ? 'bg-orange-300 text-orange-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {index + 1}
                  {index === 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[8px] text-white">🏆</span>
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">{user.program_studi}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.total_kpi_points.toLocaleString()}</p>
                  <p className="text-[8px] font-black text-slate-600 dark:text-slate-400 uppercase">Poin KPI</p>
                </div>
              </button>
            ))}
          </div>
        </div>


      </motion.div>

      {/* Global Productivity Stats */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-6 bg-[#0F172A] dark:bg-slate-900 rounded-[3rem] shadow-xl border border-white/5 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden"
      >
        {/* Absract Ornament */}
        <Zap className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 -rotate-12 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-black uppercase tracking-wider">Statistik Produktivitas</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Dokumen', val: (stats?.total_research || 0) + (stats?.total_docs || 0), icon: BookOpen, color: 'text-indigo-400 bg-indigo-500/10', colSpan: 'col-span-2' },
              { label: 'Total Sitasi', val: stats?.total_citations || 0, icon: FileText, color: 'text-emerald-400 bg-emerald-500/10' },
              { label: 'Dosen Aktif', val: stats?.total_dosen || 0, icon: Users, color: 'text-blue-400 bg-blue-500/10' }
            ].map((item, i) => (
              <div key={i} className={`bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center gap-4 ${item.colSpan || ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                  <div className="text-lg font-black text-white">{item.val.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-black mb-1">Rerata Nilai KPI Dosen</h4>
            <p className="text-xs text-slate-300">Total Poin KPI / Jumlah Dosen Terdaftar</p>
          </div>
          <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center sm:text-right min-w-[120px]">
            <p className="text-xl font-black text-primary-400">
              {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
            </p>
            <p className="text-[8px] font-black uppercase text-slate-300 tracking-wider">Poin Rerata</p>
          </div>
        </div>
      </motion.div>

    </div>
  );

  if (isHero) {
    return <div className="font-mono">{content}</div>;
  }

  return (
    <section id="leaderboard" className="py-20 md:py-32 bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden font-mono">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-300 dark:bg-primary-900 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-300 dark:bg-blue-900 rounded-full filter blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] md:text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
              Prestasi Akademik
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6"
          >
            Leaderboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400">Dosen Terbaik</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Apresiasi performa dosen dengan poin KPI tertinggi dan kontribusi riset teraktif.
          </motion.p>
        </div>

        {content}
      </div>
    </section>
  );
}
