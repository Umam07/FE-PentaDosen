import React from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import type { FaqHelpTabsProps } from '../types/faqHelp.types';

export default function FaqHelpTabs({
  activeMainTab,
  unreadTicketCount,
  onTabSwitch
}: FaqHelpTabsProps) {
  return (
    <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-200 dark:border-slate-800 pb-1">
      {/* Tab 1: Panduan */}
      <button
        onClick={() => onTabSwitch('panduan')}
        className={`group relative pb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
          activeMainTab === 'panduan'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>Panduan</span>
        {activeMainTab === 'panduan' && (
          <motion.div
            layoutId="faq-main-tab-indicator"
            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-600 dark:bg-primary-400 rounded-full"
          />
        )}
      </button>

      {/* Tab 2: Pesan Saya */}
      <button
        onClick={() => onTabSwitch('pesan')}
        className={`group relative pb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
          activeMainTab === 'pesan'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Pesan Saya</span>

        {/* Badge Unread Ticket Count */}
        {unreadTicketCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadTicketCount}
          </span>
        )}

        {activeMainTab === 'pesan' && (
          <motion.div
            layoutId="faq-main-tab-indicator"
            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-600 dark:bg-primary-400 rounded-full"
          />
        )}
      </button>
    </div>
  );
}
