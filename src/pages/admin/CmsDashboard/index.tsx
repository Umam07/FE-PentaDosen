import React, { useState } from 'react';
import { 
  Users, Settings, Megaphone, HelpCircle, 
  ShieldCheck, MessageSquare 
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
 * Design Read: Admin CMS Dashboard redesign for academic research administrators, 
 * with a refined modern SaaS language, clean layout hierarchy, smooth micro-interactions, 
 * subtle borders/elevations, and high readability.
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
    <div className="max-w-none space-y-6 lg:space-y-8 pb-12">
      {/* Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200/80 dark:border-zinc-800/80 p-6 md:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="p-3.5 bg-primary-50 dark:bg-primary-950/40 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                CMS Control Center
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Pusat manajemen hak akses pengguna, konfigurasi bobot KPI, publikasi pengumuman, panduan FAQ, serta respon pesan dukungan.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200/70 dark:border-zinc-800/80 shadow-sm flex flex-wrap gap-1">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 outline-none select-none ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-cms-tab"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 bg-primary-600 dark:bg-primary-600 rounded-xl shadow-sm shadow-primary-600/25"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors ${
                    isActive 
                      ? 'bg-white text-primary-700' 
                      : 'bg-rose-500 text-white shadow-sm'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Rendering */}
      <div className="mt-4">
        {activeTab === 'users' && <UsersTab triggerMessage={triggerMessage} />}
        {activeTab === 'kpi' && <KpiTab triggerMessage={triggerMessage} />}
        {activeTab === 'announcements' && <AnnouncementsTab triggerMessage={triggerMessage} user={user} />}
        {activeTab === 'faq' && <FaqTab triggerMessage={triggerMessage} />}
        {activeTab === 'support' && <SupportTicketsTab triggerMessage={triggerMessage} user={user} />}
      </div>
    </div>
  );
}

