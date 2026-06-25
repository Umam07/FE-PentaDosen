import React, { useState } from 'react';
import { 
  Users, Settings, Megaphone, HelpCircle, FileSpreadsheet, 
  CheckCircle, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import UsersTab from './UsersTab';
import KpiTab from './KpiTab';
import AnnouncementsTab from './AnnouncementsTab';
import FaqTab from './FaqTab';
import TemplatesTab from './TemplatesTab';

export default function CmsDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'users' | 'kpi' | 'announcements' | 'faq' | 'templates'>('users');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Trigger temporary notification message
  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

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
              Pusat konfigurasi master data, pengumuman, panduan, berkas template, dan hak akses
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
      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
        {[
          { id: 'users', label: 'Hak Akses & Users', icon: Users },
          { id: 'kpi', label: 'Bobot KPI & Periode', icon: Settings },
          { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
          { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
          { id: 'templates', label: 'Template Berkas', icon: FileSpreadsheet },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
                : 'bg-white dark:bg-zinc-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 border border-gray-100 dark:border-zinc-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Rendering */}
      <div className="mt-4">
        {activeTab === 'users' && <UsersTab triggerMessage={triggerMessage} />}
        {activeTab === 'kpi' && <KpiTab triggerMessage={triggerMessage} />}
        {activeTab === 'announcements' && <AnnouncementsTab triggerMessage={triggerMessage} user={user} />}
        {activeTab === 'faq' && <FaqTab triggerMessage={triggerMessage} />}
        {activeTab === 'templates' && <TemplatesTab triggerMessage={triggerMessage} />}
      </div>
    </div>
  );
}
