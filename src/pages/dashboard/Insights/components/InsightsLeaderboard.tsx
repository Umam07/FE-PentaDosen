import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-4 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xs border border-hairline-light dark:border-hairline-dark p-6 sm:p-8 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline-light dark:border-hairline-dark">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Top 5 Peringkat Dosen</h2>
          </div>
          <button 
            onClick={onViewAllClick}
            className="text-xs font-semibold text-accent dark:text-accent-on-dark hover:text-accent-hover dark:hover:text-accent-on-dark flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
                <div className="w-6 h-6 bg-hairline-light dark:bg-hairline-dark rounded" />
                <div className="w-10 h-10 bg-hairline-light dark:bg-hairline-dark rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5 text-left">
                  <div className="h-3.5 bg-hairline-light dark:bg-hairline-dark rounded w-3/4" />
                  <div className="h-2.5 bg-hairline-light dark:bg-hairline-dark rounded w-1/2" />
                </div>
                <div className="w-12 h-4 bg-hairline-light dark:bg-hairline-dark rounded shrink-0" />
              </div>
            ))
          ) : leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map((user, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <button 
                  key={user.id}
                  onClick={() => onUserClick(user.id)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all group border text-left cursor-pointer focus:outline-none ${
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
                      <span className="w-full h-full rounded-xl bg-warning-soft text-warning border border-warning-border flex items-center justify-center">3</span>
                    ) : (
                      <span className="font-mono text-muted dark:text-on-dark-muted">{index + 1}</span>
                    )}
                  </div>

                  {/* Lecturer Thumbnail / Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center font-bold text-xs shrink-0 border border-hairline-light dark:border-hairline-dark overflow-hidden">
                    {user.thumbnail ? (
                      <img src={user.thumbnail} alt={user.name} className="w-full h-full object-cover" />
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
            })
          ) : (
            <div className="text-center py-8 text-muted dark:text-on-dark-muted">
              <p className="text-xs font-medium">Tidak ada data peringkat</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
