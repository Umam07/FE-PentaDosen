import React, { useState } from 'react';
import { 
  Users, Settings, Megaphone, HelpCircle, FileSpreadsheet, 
  CheckCircle, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import sub-komponen baru dari folder components
import UsersTab from './components/UsersTab';
import KpiTab from './components/KpiTab';
import AnnouncementsTab from './components/AnnouncementsTab';
import FaqTab from './components/FaqTab';
import TemplatesTab from './components/TemplatesTab';
import SupportTicketsTab from './components/SupportTicketsTab';
import { User } from './types/cmsDashboard.types';
import { MessageSquare } from 'lucide-react';

interface CmsDashboardProps {
  user: User;
}

/**
 * Main Orchestrator untuk Halaman CMS Dashboard Admin.
 * Mengelola navigasi tab utama dan notifikasi global.
 */
export default function CmsDashboard({ user }: CmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'kpi' | 'announcements' | 'faq' | 'templates' | 'support'>('users');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [pendingTicketCount, setPendingTicketCount] = useState<number>(0);

  // Trigger pesan notifikasi temporer (hilang setelah 4 detik)
  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // Fetch pending ticket count untuk badge tab
  React.useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch(`/api/admin/support-tickets?status=menunggu&role=${encodeURIComponent(user?.role || 'super admin')}`);
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

  return (
    <div className="max-w-none space-y-6 lg:space-y-8 pb-12">
      {/* Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Super Admin CMS Panel</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-505 uppercase tracking-widest mt-1">
              Pusat konfigurasi master data, pengumuman, panduan, berkas template, pesan masuk support, dan hak akses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Global Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border ${
              messageType === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
            }`}
          >
            {messageType === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-xs font-black uppercase tracking-wider">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-[2rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm flex flex-wrap gap-1.5">
        {[
          { id: 'users', label: 'Hak Akses & Users', icon: Users },
          { id: 'kpi', label: 'Bobot KPI & Periode', icon: Settings },
          { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
          { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
          { id: 'support', label: 'Pesan Masuk', icon: MessageSquare, badge: pendingTicketCount },
          { id: 'templates', label: 'Template Berkas', icon: FileSpreadsheet },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 outline-none select-none ${
                isActive
                  ? 'text-white'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-cms-tab"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-primary-600 dark:bg-primary-600 rounded-2xl shadow-lg shadow-primary-500/20"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    isActive ? 'bg-white text-primary-600' : 'bg-red-500 text-white animate-pulse'
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
        {activeTab === 'templates' && <TemplatesTab triggerMessage={triggerMessage} />}
      </div>
    </div>
  );
}
