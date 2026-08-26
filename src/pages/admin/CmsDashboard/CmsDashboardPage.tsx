import React, { useState } from 'react';
import { 
  Users, Settings, Megaphone, HelpCircle, 
  MessageSquare 
} from 'lucide-react';
import { motion } from 'motion/react';

// Import sub-komponen
import UsersTab from './components/UsersTab';
import KpiTab from './components/KpiTab';
import AnnouncementsTab from './components/AnnouncementsTab';
import FaqTab from './components/FaqTab';
import SupportTicketsTab from './components/SupportTicketsTab';
import { User } from './types/cmsDashboard.types';
import { toast } from '@/components/ui/toast';

interface CmsDashboardProps {
  user: User;
}

/**
 * CMS Dashboard Root Component
 * High-density, space-efficient control center with clean typography,
 * crisp hairline borders, solid accents (no glows, no gradients), and streamlined tab navigation.
 */
export default function CmsDashboard({ user }: CmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'kpi' | 'announcements' | 'faq' | 'support'>('users');
  const [pendingTicketCount, setPendingTicketCount] = useState<number>(0);

  // Trigger pesan notifikasi via toast
  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    toast.show({
      title: type === 'success' ? 'Sukses' : 'Gagal',
      message: text,
      variant: type === 'success' ? 'success' : 'error',
      position: 'bottom-right',
    });
  };

  // Fetch pending ticket count untuk badge tab
  React.useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch(`/api/admin/support-tickets?status=menunggu&role=${encodeURIComponent(user?.role || 'admin penelitian')}`);
        if (res.ok) {
          const data = await res.json();
          setPendingTicketCount(data.pending_count || data.counts?.menunggu || 0);
        }
      } catch (e) {
        // Silent catch
      }
    };
    fetchPendingCount();
  }, [user]);

  interface NavTabItem {
    id: 'users' | 'kpi' | 'announcements' | 'faq' | 'support';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navTabs: NavTabItem[] = [
    { id: 'users', label: 'Hak Akses & Users', icon: Users },
    { id: 'kpi', label: 'Bobot KPI & Periode', icon: Settings },
    { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
    { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
    { id: 'support', label: 'Pesan Masuk', icon: MessageSquare, badge: pendingTicketCount },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">
            CMS Control Center
          </h1>
          <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
            Manajemen Hak Akses, Bobot KPI, Pengumuman, Panduan FAQ &amp; Dukungan
          </p>
        </div>
      </div>

      {/* Sub Menu / Navigation Tabs */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 sm:gap-8 min-w-max">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group/tab relative pb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'text-accent dark:text-accent-on-dark font-bold'
                    : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${
                  isActive 
                    ? 'scale-105 text-accent dark:text-accent-on-dark' 
                    : 'text-muted dark:text-on-dark-muted group-hover/tab:text-ink-heading dark:group-hover/tab:text-on-dark'
                }`} />
                <span>{tab.label}</span>

                {/* Badge Pending Ticket */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded-full bg-error-soft text-error border border-error-border text-[10px] font-bold font-mono leading-none">
                    {tab.badge}
                  </span>
                )}

                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="active-cms-tab-indicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent dark:bg-accent-on-dark rounded-full"
                  />
                )}

                {/* Hover Underline effect */}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {activeTab === 'users' && <UsersTab triggerMessage={triggerMessage} />}
        {activeTab === 'kpi' && <KpiTab triggerMessage={triggerMessage} />}
        {activeTab === 'announcements' && <AnnouncementsTab triggerMessage={triggerMessage} user={user} />}
        {activeTab === 'faq' && <FaqTab triggerMessage={triggerMessage} />}
        {activeTab === 'support' && <SupportTicketsTab triggerMessage={triggerMessage} user={user} />}
      </motion.div>
    </div>
  );
}

