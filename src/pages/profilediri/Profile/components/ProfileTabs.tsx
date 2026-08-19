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
    <div className="flex items-center gap-8 border-b border-hairline-light dark:border-hairline-dark pb-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`group/tab relative pb-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
              ? 'text-ink-heading dark:text-on-dark'
              : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
            }`}
        >
          <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-accent dark:text-accent-on-dark' : 'text-muted'}`} />
          {tab.label}
          {/* Active indicator */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="profile-subtab-indicator"
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent dark:bg-accent-on-dark rounded-full"
            />
          )}
          {/* Hover underline */}
          {activeTab !== tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
          )}
        </button>
      ))}
    </div>
  );
};
