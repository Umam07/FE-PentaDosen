import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, GraduationCap } from 'lucide-react';
import { ProfileUser, ProfileStat } from '../types/profile.types';

interface ProfileHeaderProps {
  user: ProfileUser | null | undefined;
  stats: ProfileStat[] | null;
  scholarData?: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, stats, scholarData }) => {
  const [imgError, setImgError] = React.useState(false);
  const avatarUrl = user?.avatar || scholarData?.thumbnail;
  const affiliation = [user?.program_studi, user?.fakultas].filter(Boolean).join(' • ');

  React.useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-hairline-light bg-surface-light p-6 shadow-xs dark:border-hairline-dark dark:bg-surface-dark sm:p-8"
    >
      {/* Top Profile Info Section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-hairline-light bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark-elevated sm:h-22 sm:w-22">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink text-2xl font-bold text-on-ink dark:bg-on-dark dark:text-ink">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        {/* Name & Academic Meta */}
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="truncate text-2xl font-bold tracking-tight text-ink-heading dark:text-on-dark sm:text-3xl">
            {user?.name || 'Dosen'}
          </h2>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted dark:text-on-dark-muted">
            {affiliation ? (
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span className="truncate">{affiliation}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span>Universitas YARSI</span>
              </div>
            )}

            {user?.email && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span className="truncate">{user.email}</span>
              </div>
            )}

            {user?.nidn && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <GraduationCap className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                <span>NIDN: {user.nidn}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Row (Rendered if stats exist) */}
      {stats && stats.length > 0 && (
        <>
          <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex min-h-[88px] items-center gap-4 rounded-xl border border-hairline-light bg-surface-light-raised p-4 transition-all duration-200 hover:border-hairline-light hover:bg-surface-light dark:border-hairline-dark dark:bg-surface-dark-elevated dark:hover:border-hairline-dark dark:hover:bg-surface-dark"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-hairline-light bg-surface-light text-body-strong shadow-none dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold tracking-wide text-muted dark:text-on-dark-muted">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-2xl font-extrabold font-mono leading-none tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {stat.val}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};


