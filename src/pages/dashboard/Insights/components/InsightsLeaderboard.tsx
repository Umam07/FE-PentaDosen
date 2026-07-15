import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight, Crown } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface InsightsLeaderboardProps {
  leaderboard: LeaderboardUser[];
  loading: boolean;
  onUserClick: (id: string | number) => void;
  onViewAllClick: () => void;
}

export default function InsightsLeaderboard({
  leaderboard,
  loading,
  onUserClick,
  onViewAllClick
}: InsightsLeaderboardProps) {
  return (
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top 5 Peringkat Tahun Ini</h2>
          </div>
          <button 
            onClick={onViewAllClick}
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
            leaderboard.slice(0, 5).map((user, index) => (
              <button 
                key={user.id}
                onClick={() => onUserClick(user.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
              >
                {/* Rank Number */}
                <div className={`w-6 text-center shrink-0 ${
                  index === 0 ? 'text-amber-500 dark:text-amber-400 text-base font-bold' : 
                  index === 1 ? 'text-slate-400 dark:text-slate-300 text-sm font-bold' : 
                  index === 2 ? 'text-orange-400 dark:text-orange-300 text-sm font-bold' :
                  'text-slate-400 dark:text-slate-505 text-sm font-bold'
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
  );
}
