import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { ProfileUser } from '../types/profile.types';

interface ProfileTabsProps {
  user: ProfileUser | null | undefined;
  activeTab: 'info' | 'integrasi';
  setActiveTab: (tab: 'info' | 'integrasi') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'info', label: 'Detail Informasi', icon: User },
    ...(user?.role === 'dosen' ? [{ id: 'integrasi', label: 'Konfigurasi ID', icon: Settings }] : []),
  ];

  return (
    <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`group/tab relative pb-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
        >
          <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
          {tab.label}
          {/* Active indicator */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="profile-subtab-indicator"
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600 dark:bg-primary-500 rounded-full"
            />
          )}
          {/* Hover underline */}
          {activeTab !== tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
          )}
        </button>
      ))}
    </div>
  );
};
