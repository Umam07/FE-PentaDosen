import React from 'react';
import { GraduationCap, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { LecturerManagementPanelProps } from '../types/adminSync.types';
import ScholarIntegrationCard from './ScholarIntegrationCard';
import ScopusIntegrationCard from './ScopusIntegrationCard';

export default function LecturerManagementPanel({
  scholarUser,
  scholarData,
  scopusData,
  scholarId,
  scopusId,
  loadingScholar,
  loadingScopus,
  checkingInfoScholar,
  checkingInfoScopus,
  checkedAuthorScholar,
  checkedAuthorScopus,
  messageScholar,
  messageScopus,
  onScholarIdChange,
  onScopusIdChange,
  onCheckScholar,
  onSaveScholar,
  onSyncScholar,
  onCheckScopus,
  onSaveScopus,
  onSyncScopus,
  onClose,
  onClearCheckedScholar,
  onClearCheckedScopus,
}: LecturerManagementPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {scholarUser && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {/* Lecturer Management Header */}
          <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent dark:from-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between relative z-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="h-20 w-20 rounded-3xl bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20 transform -rotate-2 group-hover:rotate-0 transition-all duration-500 border-2 border-white dark:border-zinc-800 overflow-hidden">
                    {scholarData?.thumbnail ? (
                      <img src={scholarData.thumbnail} alt={scholarUser.name} className="w-full h-full object-cover" />
                    ) : (
                      scholarUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">{scholarUser.name}</h4>
                    <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
                      <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary-500" />
                        {scholarUser.program_studi || 'N/A'}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-primary-500" />
                        {scholarUser.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/30 rounded-2xl text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 group/close"
                >
                  <X className="w-4 h-4 group-hover/close:rotate-90 transition-transform" /> Tutup Panel
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ScholarIntegrationCard
              scholarId={scholarId}
              scholarData={scholarData}
              scholarUser={scholarUser}
              loadingScholar={loadingScholar}
              checkingInfoScholar={checkingInfoScholar}
              checkedAuthorScholar={checkedAuthorScholar}
              messageScholar={messageScholar}
              onScholarIdChange={onScholarIdChange}
              onCheck={onCheckScholar}
              onSave={onSaveScholar}
              onSync={onSyncScholar}
              onClearChecked={onClearCheckedScholar}
            />

            <ScopusIntegrationCard
              scopusId={scopusId}
              scopusData={scopusData}
              scholarUser={scholarUser}
              loadingScopus={loadingScopus}
              checkingInfoScopus={checkingInfoScopus}
              checkedAuthorScopus={checkedAuthorScopus}
              messageScopus={messageScopus}
              onScopusIdChange={onScopusIdChange}
              onCheck={onCheckScopus}
              onSave={onSaveScopus}
              onSync={onSyncScopus}
              onClearChecked={onClearCheckedScopus}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
